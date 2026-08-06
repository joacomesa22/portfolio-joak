import { gsap } from "gsap";

/**
 * A small dot that trails the pointer.
 *
 * It rides alongside the real cursor rather than replacing it — hiding the
 * native cursor would undo the pointer affordance on links, and a custom cursor
 * that lags behind is a worse target than the one the OS draws.
 */

let dot: HTMLElement | null = null;
let onMove: ((event: PointerEvent) => void) | null = null;
let onEnter: (() => void) | null = null;
let onLeave: (() => void) | null = null;

export function initCursor(): void {
  destroyCursor();

  // Pointless without a real pointer, and the lag is exactly the kind of motion
  // reduced-motion asks us to drop.
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  dot = document.querySelector<HTMLElement>("[data-cursor]");
  if (!dot) return;

  // Centre the dot on the pointer once, so the tweens only ever touch x/y.
  gsap.set(dot, { xPercent: -50, yPercent: -50 });

  // quickTo reuses one tween per axis instead of allocating a new one on every
  // pointermove — the easing is what gives the dot its slight trail.
  const moveX = gsap.quickTo(dot, "x", { duration: 0.35, ease: "power3" });
  const moveY = gsap.quickTo(dot, "y", { duration: 0.35, ease: "power3" });

  onMove = (event) => {
    if (!dot) return;
    // Hidden until the pointer first moves, so it never sits at 0,0 on load.
    if (!dot.hasAttribute("data-visible")) dot.setAttribute("data-visible", "");
    moveX(event.clientX);
    moveY(event.clientY);
  };
  onEnter = () => dot?.setAttribute("data-visible", "");
  onLeave = () => dot?.removeAttribute("data-visible");

  window.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerenter", onEnter);
  document.addEventListener("pointerleave", onLeave);
}

export function destroyCursor(): void {
  if (onMove) window.removeEventListener("pointermove", onMove);
  if (onEnter) document.removeEventListener("pointerenter", onEnter);
  if (onLeave) document.removeEventListener("pointerleave", onLeave);
  onMove = onEnter = onLeave = null;
  if (dot) gsap.killTweensOf(dot);
  dot = null;
}
