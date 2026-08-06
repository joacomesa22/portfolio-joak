import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Client-side routing calls init once per navigation, so both of these are held
// at module scope: without tearing the previous pair down we'd stack a live
// Lenis instance and a GSAP ticker callback on every page change.
let lenis: Lenis | null = null;
let tick: ((time: number) => void) | null = null;

/**
 * Lenis drives the scroll position; GSAP's ticker drives Lenis' RAF loop so the
 * two never run on separate frames. ScrollTrigger is told to re-measure on every
 * Lenis frame, which keeps pinned/scrubbed animations in sync with the eased
 * scroll rather than the native one.
 */
export function initSmoothScroll(): Lenis | null {
  destroySmoothScroll();

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return null;
  }

  lenis = new Lenis({
    duration: 1.1,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on("scroll", ScrollTrigger.update);

  tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  // In-page anchors need to go through Lenis, not the browser. Cross-page links
  // (/#work from /about) are left alone so the router can handle them.
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = link.getAttribute("href");
      if (!target || target === "#") return;
      event.preventDefault();
      lenis?.scrollTo(target, { offset: 0 });
    });
  });

  return lenis;
}

export function destroySmoothScroll(): void {
  if (tick) {
    gsap.ticker.remove(tick);
    tick = null;
  }
  lenis?.destroy();
  lenis = null;
}
