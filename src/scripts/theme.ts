/**
 * Light/dark theme.
 *
 * The palettes themselves are CSS (see the role variables under BASE in
 * global.css); this module only decides which one is active and writes
 * `data-theme` onto <html>.
 *
 * Three states, not two: "light" and "dark" are explicit choices that persist,
 * and no stored value at all means "follow the OS", which keeps tracking the OS
 * for as long as the visitor never picks a side. The attribute is always
 * resolved to a concrete value so the CSS and the button icon can both key off
 * it directly.
 *
 * The first paint is handled by an inline script in Layout.astro, which has to
 * run before the body renders. This module owns everything after that.
 */

export type Theme = "light" | "dark";

/** Shared with the inline boot script in Layout.astro — change both together. */
const STORAGE_KEY = "theme";

let toggle: HTMLElement | null = null;
let onClick: (() => void) | null = null;
let systemQuery: MediaQueryList | null = null;
let onSystemChange: ((event: MediaQueryListEvent) => void) | null = null;

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** `null` means no explicit choice has been made, so the OS still decides. */
function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    // Safari in private mode throws on localStorage. Not being able to remember
    // the choice is no reason to break the toggle.
    return null;
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
  applyTheme(storedTheme() ?? systemTheme());

  toggle = document.querySelector<HTMLElement>("[data-theme-toggle]");
  if (toggle) {
    syncToggle(currentTheme());
    onClick = () => switchTheme(currentTheme() === "dark" ? "light" : "dark");
    toggle.addEventListener("click", onClick);
  }

  // Only while no explicit choice exists: someone who picked a side keeps it
  // even if they flip their OS at sundown.
  systemQuery = window.matchMedia("(prefers-color-scheme: dark)");
  onSystemChange = (event) => {
    if (storedTheme()) return;
    applyTheme(event.matches ? "dark" : "light");
  };
  systemQuery.addEventListener("change", onSystemChange);
}

export function destroyTheme(): void {
  if (toggle && onClick) toggle.removeEventListener("click", onClick);
  toggle = null;
  onClick = null;
  if (systemQuery && onSystemChange)
    systemQuery.removeEventListener("change", onSystemChange);
  systemQuery = null;
  onSystemChange = null;
}
