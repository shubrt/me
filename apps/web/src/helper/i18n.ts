export type Lang = "de" | "en";

/** Picks the string for the page language. Keeps both texts next to each other. */
export function t<T>(lang: Lang, de: T, en: T): T {
  return lang === "de" ? de : en;
}

/** Site path for a language: `toLocalePath("en", "/impressum/")` is `/en/impressum/`. */
export function toLocalePath(lang: Lang, path = "/"): string {
  return lang === "de" ? path : `/en${path}`;
}
