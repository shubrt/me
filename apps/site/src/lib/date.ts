/** Dates in frontmatter are UTC midnight. Format them in UTC so they never shift by a day. */
export function formatDate(date: Date, month: "short" | "long" = "short"): string {
  return date.toLocaleDateString("en-GB", { year: "numeric", month, day: "numeric", timeZone: "UTC" });
}
