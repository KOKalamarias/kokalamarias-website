// =====================================================
//  Board Loader — Φορτώνει μέλη ΔΣ από content/data/board.json
//  Render στη σελίδα club.html
// =====================================================

(function () {
  const grid = document.getElementById("boardGrid");
  if (!grid) return;

  function pick(item, field, lang) {
    return (lang === "en" && item[field + "_en"]) ? item[field + "_en"] : (item[field] || "");
  }

  function renderCard(member, lang) {
    const role = pick(member, "role", lang);
    const name = pick(member, "name", lang) || "—";
    const icon = member.icon || "fa-user";
    const isPending = !pick(member, "name", lang).trim();

    return `<div class="board-card ${isPending ? "pending" : ""}">
      <div class="board-avatar"><i class="fas ${icon}"></i></div>
      <div class="board-role">${role}</div>
      <div class="board-name">${name}</div>
    </div>`;
  }

  let cache = null;

  async function load() {
    if (!cache) {
      try {
        const res = await fetch("content/data/board.json", { cache: "no-cache" });
        const data = await res.json();
        cache = data.members || [];
      } catch (err) {
        console.error("Failed to load board.json:", err);
        return;
      }
    }
    const lang = document.documentElement.lang || "el";
    grid.innerHTML = cache.map(m => renderCard(m, lang)).join("\n");
  }

  load();

  const obs = new MutationObserver(load);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();
