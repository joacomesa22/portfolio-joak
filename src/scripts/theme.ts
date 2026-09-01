/**
 * Light/dark theme.
 *
 * The palettes themselves are CSS (see the role variables under BASE in
 * global.css); this module only decides which one is active and writes
 * `data-theme` onto <html>.
 *
 * Light is the default for everyone, whatever the OS is set to — the site is a
 * designed object and should open the way it was designed. Dark is opt-in, and
 * once someone opts in the choice is stored and honoured from then on.
 * `prefers-color-scheme` is deliberately not consulted anywhere.
 *
 * The first paint is handled by an inline script in Layout.astro, which has to
 * run before the body renders. This module owns everything after that.
 */

export type Theme = "light" | "dark";

/** Shared with the inline boot script in Layout.astro — change both together. */
const STORAGE_KEY = "theme";

let toggle: HTMLElement | null = null;
let onClick: (() => void) | null = null;

/** Whatever was stored, or light for a visitor who has never chosen. */
function storedTheme(): Theme {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "dark" ? "dark" : "light";
  } catch {
    // Safari in private mode throws on localStorage. Not being able to remember
    // the choice is no reason to break the toggle.
    return "light";
  }
}

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

/**
 * The address bar and the OS chrome should match the page, not the OS setting —
 * otherwise picking light on a dark phone leaves a black notch over a white
 * page.
 */
function syncThemeColor(theme: Theme) {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = theme === "dark" ? "#001621" : "#ffffff";
}

function syncToggle(theme: Theme) {
  if (!toggle) return;
  const next = theme === "dark" ? "light" : "dark";
  // The button shows where it takes you, not where you are.
  toggle.setAttribute("aria-label", `Switch to ${next} theme`);
  toggle.setAttribute("aria-pressed", String(theme === "dark"));
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  syncThemeColor(theme);
  syncToggle(theme);
}

/**
 * Repaints the whole page, so the swap is crossfaded rather than cut — see
 * `[data-theme-switching]` in global.css. The attribute has to come off again
 * or every later hover would inherit the theme's timing.
 */
function switchTheme(theme: Theme) {
  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) {
    applyTheme(theme);
  } else {
    root.setAttribute("data-theme-switching", "");
    applyTheme(theme);
    window.setTimeout(() => root.removeAttribute("data-theme-switching"), 400);
  }

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // See storedTheme: the choice just won't survive the tab.
  }
}

export function initTheme(): void {
  destroyTheme();

  // The router replaces <html>'s attributes on every navigation, so the
  // attribute the boot script wrote is gone by the time this runs on page two.
  applyTheme(storedTheme());

  toggle = document.querySelector<HTMLElement>("[data-theme-toggle]");
  if (!toggle) return;

  syncToggle(currentTheme());
  onClick = () => switchTheme(currentTheme() === "dark" ? "light" : "dark");
  toggle.addEventListener("click", onClick);
}

export function destroyTheme(): void {
  if (toggle && onClick) toggle.removeEventListener("click", onClick);
  toggle = null;
  onClick = null;
}
