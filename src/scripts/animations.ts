import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * One easing curve and one duration scale across the whole site, so the motion
 * reads as a single system rather than a pile of separate effects.
 */
const EASE = "power3.out";
const DISPLAY = 0.95; // headline-sized type
const BODY = 0.7; // running text, captions, links

/**
 * Everything here uses fromTo, never from.
 *
 * Animated elements are parked at `opacity: 0` by CSS so they can't flash before
 * JS runs — which means their "natural" value IS zero, and a plain `from()`
 * would animate 0 → 0 and leave the page blank. The end state has to be stated
 * explicitly.
 */
const HIDDEN = { opacity: 0 };
const SHOWN = { opacity: 1 };

/** Splits are DOM surgery — every one must be reverted before a route change. */
let splits: SplitText[] = [];

/**
 * True only for a real page load. Module scripts survive client-side routing,
 * so this flips to false on the first navigation and stays there — which is how
 * the portrait knows to leave itself to the View Transition.
 */
let isFirstLoad = true;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Line breaks depend on font metrics, so splitting before the webfonts land
 * measures the fallback and splits in the wrong places. The race is a safety
 * net: if fonts stall, show the content rather than leaving it hidden.
 */
function fontsReady(): Promise<unknown> {
  return Promise.race([
    document.fonts.ready,
    new Promise((resolve) => setTimeout(resolve, 800)),
  ]);
}

/**
 * Display type arrives a line at a time, in reading order — the sentence
 * assembles the way you read it instead of appearing all at once.
 */
function revealLines(el: Element, immediate = false) {
  // SplitText's default aria handling labels the element and hides the lines it
  // makes. That reads correctly for plain type, but anything focusable inside
  // would then sit in an aria-hidden subtree — reachable by keyboard, invisible
  // to a screen reader. Where the sentence carries a link, leave the real
  // markup exposed instead.
  const split = new SplitText(el, {
    type: "lines",
    linesClass: "split-line",
    aria: el.querySelector("a, button") ? "none" : "auto",
  });
  splits.push(split);
  gsap.set(el, SHOWN); // the freshly-made lines carry the fade from here

  gsap.fromTo(
    split.lines,
    { yPercent: 60, ...HIDDEN },
    {
      yPercent: 0,
      ...SHOWN,
      duration: DISPLAY,
      ease: EASE,
      stagger: 0.09,
      ...(immediate
        ? {}
        : { scrollTrigger: { trigger: el, start: "top 90%", once: true } }),
    },
  );
}

/**
 * Body copy and small items: a short lift, staggered in document order.
 *
 * Starts at "top bottom" rather than a percentage. These groups include the
 * footer's link row, which sits at the very bottom of the last screen — at
 * maximum scroll its top rests around 86% of the viewport, so any threshold
 * tighter than the viewport edge can never be crossed and the links would stay
 * invisible for good. Firing as the element enters is guaranteed to resolve.
 */
function revealItems(items: ArrayLike<Element>, trigger: Element) {
  if (!items.length) return;
  gsap.fromTo(
    items,
    { y: 20, ...HIDDEN },
    {
      y: 0,
      ...SHOWN,
      duration: BODY,
      ease: EASE,
      stagger: 0.08,
      scrollTrigger: { trigger, start: "top bottom", once: true },
    },
  );
}

/**
 * Iris open. circle(50%) on a square box is exactly the inscribed circle — the
 * same shape rounded-full already gives it. Lands on `none` rather than clearing
 * the property, because clearing would fall back to the CSS rule that starts it
 * closed.
 *
 * Lives outside the hero timeline because the portrait appears on About too,
 * where there is no hero to run it.
 */
function irisOpen(portrait: HTMLElement) {
  return gsap.fromTo(
    portrait,
    { clipPath: "circle(0%)" },
    {
      clipPath: "circle(50%)",
      duration: 1.1,
      ease: EASE,
      onComplete: () => gsap.set(portrait, { clipPath: "none" }),
    },
  );
}

function revealHeader() {
  const items = document.querySelectorAll("[data-anim='header-item']");
  if (!items.length) return null;
  return gsap.fromTo(
    items,
    { y: -14, ...HIDDEN },
    { y: 0, ...SHOWN, duration: BODY, ease: EASE, stagger: 0.07 },
  );
}

/**
 * The opening sequence cascades top to bottom — header, portrait, name — which
 * is both the spatial order on screen and the order you'd read them in.
 */
function heroIntro(hero: Element) {
  const tl = gsap.timeline({ defaults: { ease: EASE } });

  const headerItems = document.querySelectorAll("[data-anim='header-item']");
  if (headerItems.length) {
    tl.fromTo(
      headerItems,
      { y: -14, ...HIDDEN },
      { y: 0, ...SHOWN, duration: BODY, stagger: 0.07 },
    );
  }

  const portrait = hero.querySelector<HTMLElement>("[data-portrait]");
  if (portrait && isFirstLoad) {
    tl.add(irisOpen(portrait), "-=0.35");
  }

  const name = hero.querySelector("[data-anim='hero-name']");
  if (name) {
    const split = new SplitText(name, { type: "chars" });
    splits.push(split);
    gsap.set(name, SHOWN);
    // Letter by letter: the name is the page's masthead, so it gets set into
    // place rather than simply appearing.
    tl.fromTo(
      split.chars,
      { yPercent: 45, ...HIDDEN },
      { yPercent: 0, ...SHOWN, duration: DISPLAY, stagger: 0.018 },
      "-=0.75",
    );
  }

  return tl;
}

/** Project cards: the image settles out of an overscale as the card lifts. */
function revealWork() {
  gsap.utils.toArray<HTMLElement>("[data-anim='card']").forEach((card, i) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: card, start: "top 88%", once: true },
      // Cards sharing a row enter together; only the column index offsets them.
      delay: (i % 2) * 0.08,
    });

    tl.fromTo(
      card,
      { y: 44, ...HIDDEN },
      { y: 0, ...SHOWN, duration: DISPLAY, ease: EASE },
    );

    const img = card.querySelector("img");
    if (img) {
      // clearProps hands the transform back to CSS so the hover scale survives.
      tl.fromTo(
        img,
        { scale: 1.12 },
        { scale: 1, duration: 1.4, ease: EASE, clearProps: "transform" },
        0,
      );
    }
  });
}

/** A rule should draw itself rather than fade — it reads as a line being ruled. */
function revealRules() {
  gsap.utils.toArray<HTMLElement>("[data-anim='rule']").forEach((rule) => {
    gsap.fromTo(
      rule,
      { scaleX: 0, ...SHOWN },
      {
        scaleX: 1,
        transformOrigin: "left center",
        duration: 1,
        ease: "power2.inOut",
        scrollTrigger: { trigger: rule, start: "top 92%", once: true },
      },
    );
  });
}

export async function initAnimations(): Promise<void> {
  // Tells the inline safety net in <head> that this module is alive, so it
  // leaves the hiding hook in place.
  document.documentElement.dataset.animReady = "1";

  if (prefersReducedMotion()) {
    gsap.set("[data-anim]", SHOWN);
    isFirstLoad = false;
    return;
  }

  await fontsReady();

  const hero = document.querySelector("[data-hero]");
  if (hero) {
    heroIntro(hero);
  } else {
    // Pages without a hero still need their header revealed — and any portrait
    // opened, since CSS closed it and no hero timeline exists to reopen it.
    revealHeader();
    const portrait = document.querySelector<HTMLElement>("[data-portrait]");
    if (portrait && isFirstLoad) irisOpen(portrait);
  }

  // Everything outside the hero reveals on scroll. Anything already in view
  // fires immediately, which is what makes an arriving page animate in too.
  document.querySelectorAll("[data-anim='lines']").forEach((el) => {
    if (!el.closest("[data-hero]")) revealLines(el);
  });

  document.querySelectorAll("[data-group]").forEach((group) => {
    revealItems(group.querySelectorAll("[data-anim='item']"), group);
  });

  revealWork();
  revealRules();

  ScrollTrigger.refresh();
  isFirstLoad = false;
}

export function destroyAnimations(): void {
  ScrollTrigger.getAll().forEach((t) => t.kill());
  splits.forEach((s) => s.revert());
  splits = [];
}
