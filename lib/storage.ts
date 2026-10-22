export const THEME_KEY = "office-co-theme";
export const LANG_KEY = "office-co-lang";
export const LAST_TOOL_KEY = "office-co-last-tool";
export const PRO_KEY = "openx-pro-ok";

export const THEME_ORDER = ["white", "silver", "black"] as const;
export type Theme = (typeof THEME_ORDER)[number];
export type Lang = "en" | "zh";

export const DEFAULT_THEME: Theme = "white";

export function isProValue(value: string | null): boolean {
  return value !== null && value !== "" && value !== "0" && value !== "false";
}

export function nextTheme(current: string | null): Theme {
  const index = THEME_ORDER.indexOf(current as Theme);
  const base = index < 0 ? THEME_ORDER.indexOf(DEFAULT_THEME) : index;
  return THEME_ORDER[(base + 1) % THEME_ORDER.length];
}

export function readTheme(): Theme {
  if (typeof window === "undefined") return DEFAULT_THEME;
  const value = localStorage.getItem(THEME_KEY);
  return value === "white" || value === "silver" || value === "black" ? value : DEFAULT_THEME;
}

export function readLang(): Lang {
  if (typeof window === "undefined") return "en";
  return localStorage.getItem(LANG_KEY) === "zh" ? "zh" : "en";
}

export function readPro(): boolean {
  if (typeof window === "undefined") return false;
  return isProValue(localStorage.getItem(PRO_KEY));
}

export function writeTheme(theme: Theme): void {
  localStorage.setItem(THEME_KEY, theme);
  emitStore();
}

export function writeLang(lang: Lang): void {
  localStorage.setItem(LANG_KEY, lang);
  emitStore();
}

export function writePro(): void {
  localStorage.setItem(PRO_KEY, "1");
  emitStore();
}

export function clearPro(): void {
  localStorage.removeItem(PRO_KEY);
  emitStore();
}

export function readLastTool(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LAST_TOOL_KEY);
}

export function writeLastTool(slug: string): void {
  localStorage.setItem(LAST_TOOL_KEY, slug);
  emitStore();
}

export function emitStore(): void {
  window.dispatchEvent(new Event("office-co-store"));
}

export function subscribeStore(onChange: () => void): () => void {
  function onStorage(event: StorageEvent) {
    if (
      event.key === null ||
      event.key === THEME_KEY ||
      event.key === LANG_KEY ||
      event.key === PRO_KEY ||
      event.key === LAST_TOOL_KEY
    ) {
      onChange();
    }
  }
  window.addEventListener("storage", onStorage);
  window.addEventListener("office-co-store", onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("office-co-store", onChange);
  };
}
