import { $, escape, load, save, download, announce } from "./shared.js";
import { samples, validateGem, importGems, filterGems } from "./engine.js";
let gems;
try {
  gems = importGems(load("gemhub.v1", structuredClone(samples)));
} catch {
  gems = structuredClone(samples);
  announce("Invalid stored library. Sample library loaded.");
}
function render() {
  const choice = $("collection").value;
  const collections = [...new Set(gems.map((g) => g.collection))].sort();
  $("collection").innerHTML =
    '<option value="">All collections</option>' +
    collections
      .map((c) => `<option value="${escape(c)}">${escape(c)}</option>`)
      .join("");
  $("collection").value = collections.includes(choice) ? choice : "";
  $("count").textContent = gems.length;
  $("savedCount").textContent = gems.filter((g) => g.saved).length;
  $("collectionCount").textContent = collections.length;
  const filtered = filterGems(gems, {
    query: $("search").value,
    collection: $("collection").value,
    saved: $("view").value === "saved",
  });
  $("gems").innerHTML = filtered.length
    ? filtered
        .map(
          (g) =>
            `<article class="card"><div class="art" aria-hidden="true">${{ Design: "◈", Engineering: "⌘", Reading: "☷", Inspiration: "✳" }[g.category]}</div><p><span class="chip">${escape(g.category)}</span> <span class="small">${escape(g.collection)}</span></p><h3>${escape(g.title)}</h3><p>${escape(g.notes)}</p><a href="${escape(g.url)}" target="_blank" rel="noopener noreferrer">Open resource ↗</a><button class="secondary" data-save="${escape(g.id)}" aria-pressed="${g.saved}">${g.saved ? "★ Saved" : "☆ Save gem"}</button><button class="secondary" data-delete="${escape(g.id)}">Remove gem</button></article>`,
        )
        .join("")
    : '<div class="empty">No gems match. Try another search or add something new.</div>';
}
$("add").onsubmit = (e) => {
  e.preventDefault();
  try {
    const g = validateGem({
      ...Object.fromEntries(new FormData(e.target)),
      id: crypto.randomUUID(),
      saved: false,
    });
    gems.unshift(g);
    save("gemhub.v1", gems);
    e.target.reset();
    render();
    announce("Gem added to your library.");
  } catch (err) {
    announce(err.message);
  }
};
for (const id of ["search", "collection", "view"])
  $(id).addEventListener("input", render);
$("gems").onclick = (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  const id = b.dataset.save || b.dataset.delete;
  if (b.dataset.save) {
    gems = gems.map((g) => (g.id === id ? { ...g, saved: !g.saved } : g));
  } else if (confirm("Remove this gem from your library?"))
    gems = gems.filter((g) => g.id !== id);
  save("gemhub.v1", gems);
  render();
};
$("export").onclick = () => download("gemhub-library.json", gems);
$("import").onchange = async (e) => {
  try {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2e6) throw Error("Backup exceeds 2 MB.");
    const imported = importGems(JSON.parse(await file.text()));
    if (!confirm("Replace your library with this backup?")) return;
    gems = imported;
    save("gemhub.v1", gems);
    render();
    announce("Backup restored.");
  } catch (err) {
    announce("Import failed: " + err.message);
  }
  e.target.value = "";
};
$("reset").onclick = () => {
  if (confirm("Replace your library with the sample gems?")) {
    gems = structuredClone(samples);
    save("gemhub.v1", gems);
    render();
  }
};
render();
