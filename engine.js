export const categories = ["Design", "Engineering", "Reading", "Inspiration"];
export const samples = [
  {
    id: "one",
    title: "The shape of good interfaces",
    url: "https://www.w3.org/WAI/tutorials/",
    category: "Design",
    collection: "Craft",
    notes: "Accessible patterns that make everyday interactions better.",
    saved: true,
  },
  {
    id: "two",
    title: "A handbook for the web",
    url: "https://developer.mozilla.org/en-US/docs/Web",
    category: "Engineering",
    collection: "Craft",
    notes: "A dependable reference for the things we build.",
    saved: false,
  },
  {
    id: "three",
    title: "A library without walls",
    url: "https://www.gutenberg.org/",
    category: "Reading",
    collection: "After hours",
    notes: "A next read waiting to be discovered.",
    saved: false,
  },
  {
    id: "four",
    title: "See Earth differently",
    url: "https://earthobservatory.nasa.gov/",
    category: "Inspiration",
    collection: "After hours",
    notes: "Patterns, landscapes, and a bigger perspective.",
    saved: true,
  },
];
export function validateGem(g) {
  if (!g || typeof g !== "object") throw Error("Each gem must be an object.");
  for (const [key, max] of [
    ["title", 80],
    ["collection", 40],
    ["notes", 400],
  ])
    if (
      typeof g[key] !== "string" ||
      g[key].length > max ||
      (key !== "notes" && !g[key].trim())
    )
      throw Error("A title, collection, and short note are required.");
  const url = new URL(g.url);
  if (!["http:", "https:"].includes(url.protocol))
    throw Error("Use an http or https link.");
  if (!categories.includes(g.category)) throw Error("Choose a valid category.");
  return {
    ...g,
    title: g.title.trim(),
    collection: g.collection.trim(),
    url: url.href,
    saved: !!g.saved,
  };
}
export function importGems(value) {
  if (!Array.isArray(value) || value.length > 1000)
    throw Error("Import a JSON array of up to 1,000 gems.");
  const ids = new Set();
  return value.map((g) => {
    const v = validateGem(g);
    if (typeof v.id !== "string" || !v.id || ids.has(v.id))
      throw Error("Gem identifiers must be unique.");
    ids.add(v.id);
    return v;
  });
}
export function filterGems(
  gems,
  { query = "", collection = "", saved = false } = {},
) {
  return gems.filter(
    (g) =>
      (!collection || g.collection === collection) &&
      (!saved || g.saved) &&
      [g.title, g.notes, g.category, g.collection]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
}
