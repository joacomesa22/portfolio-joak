/**
 * Hide-on-scroll-down, show-on-scroll-up header.
 *
 * This module only writes a state onto the element and publishes the measured
 * height; the transition itself is CSS. See [data-header] in global.css.
 */

/**
 * Direction changes smaller than this are ignored. Smooth scrolling eases to a
 * stop in sub-pixel steps and trackpads emit tiny opposite-sign deltas, so
 * reacting to every change of sign would flicker the header on and off.
 */
const DIRECTION_THRESHOLD = 8;

type State = "top" | "pinned" | "hidden";

let header: HTMLElement | null = null;
let lastY = 0;
let onScroll: (() => void) | null = null;
let onResize: (() => void) | null = null;
let resizeObserver: ResizeObserver | null = null;

/** Media currently passing behind the header band. */
let mediaObserver: IntersectionObserver | null = null;
const behindHeader = new Set<Element>();

/** Pages reserve the header's height in padding, so it has to be published. */
function measure() {
  if (!header) return;
  document.documentElement.style.setProperty(
    "--header-h",
    `${header.offsetHeight}px`,
  );
}

function setState(state: State) {
  if (header && header.dataset.state !== state) header.dataset.state = state;
}

/**
 * Switches the header to light type while media sits behind it.
 *
 * The header has no background, so over a photo the ink text all but vanishes.
 * Rather than infer this from scroll offsets — which breaks the moment the page
 * reflows — the observer's root is shrunk to just the header's own band at the
 * top of the viewport, so "is media behind the header" becomes a plain
 * intersection test the browser answers for us.
 */
function watchMedia() {
  mediaObserver?.disconnect();
  mediaObserver = null;
  behindHeader.clear();
  if (!header) return;

  header.removeAttribute("data-over-media");

  const targets = document.querySelectorAll("[data-header-invert]");
  if (!targets.length) return;

  // Collapse the root from the whole viewport down to the top `--header-h` strip.
  const belowBand = Math.max(0, window.innerHeight - header.offsetHeight);

  mediaObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) behindHeader.add(entry.target);
        else behindHeader.delete(entry.target);
      }
      if (!header) return;
      if (behindHeader.size) header.setAttribute("data-over-media", "");
      else header.removeAttribute("data-over-media");
    },
    { rootMargin: `0px 0px -${belowBand}px 0px`, threshold: 0 },
  );

  targets.forEach((target) => mediaObserver!.observe(target));
}

export function initHeader(): void {
  destroyHeader();

  header = document.querySelector<HTMLElement>("[data-header]");
  if (!header) return;

  measure();
  // The header is two lines on mobile and one from tablet up, so its height
  // changes with the viewport — and the layout padding has to follow.
  resizeObserver = new ResizeObserver(measure);
  resizeObserver.observe(header);

  watchMedia();
  // The observer's root is derived from the viewport height, so it has to be
  // rebuilt when that changes.
  onResize = () => {
    measure();
    watchMedia();
  };
  window.addEventListener("resize", onResize, { passive: true });

  // Never hide the header when motion is reduced: sliding it out means the user
  // has to move to get it back, and that trade only pays for itself if the
  // movement is comfortable to watch.
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  lastY = window.scrollY;
  setState(window.scrollY <= header.offsetHeight ? "top" : "pinned");

  onScroll = () => {
    if (!header) return;
    const y = Math.max(0, window.scrollY);
    const delta = y - lastY;

    // While still over the header's own band it belongs to the page, not
    // floating above it — that keeps the hero looking untouched.
    if (y <= header.offsetHeight) {
      setState("top");
      lastY = y;
      return;
    }

    if (Math.abs(delta) < DIRECTION_THRESHOLD) return;
    setState(delta > 0 && !reduced ? "hidden" : "pinned");
    lastY = y;
  };

  window.addEventListener("scroll", onScroll, { passive: true });
}

export function destroyHeader(): void {
  if (onScroll) window.removeEventListener("scroll", onScroll);
  onScroll = null;
  if (onResize) window.removeEventListener("resize", onResize);
  onResize = null;
  resizeObserver?.disconnect();
  resizeObserver = null;
  mediaObserver?.disconnect();
  mediaObserver = null;
  behindHeader.clear();
  header = null;
}
