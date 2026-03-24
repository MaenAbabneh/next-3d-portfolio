export function slugifyHeading(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[\s]+/g, "-")
    .replace(/[^a-z0-9\u0600-\u06FF\-]/g, "")
    .replace(/\-+/g, "-")
    .replace(/^\-/, "")
    .replace(/\-$/, "");

  return slug.length ? slug : null;
}
