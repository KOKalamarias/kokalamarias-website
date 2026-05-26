// =====================================================
//  Teams Loader — Φορτώνει info τμημάτων από content/data/teams.json
//  Προσθέτει caption (περιγραφή + πρόγραμμα) κάτω από κάθε image card
// =====================================================

(function () {
  const cards = document.querySelectorAll(".program-card-link");
  if (!cards.length) return;

  function pick(item, field, lang) {
    return (lang === "en" && item[field + "_en"]) ? item[field + "_en"] : (item[field] || "");
  }

  let cache = null;

  async function load() {
    if (!cache) {
      try {
        const res = await fetch("content/data/teams.json", { cache: "no-cache" });
        const data = await res.json();
        cache = data.teams || [];
      } catch (err) {
        console.error("Failed to load teams.json:", err);
        return;
      }
    }
    const lang = document.documentElement.lang || "el";

    cards.forEach((card, idx) => {
      const team = cache[idx];
      if (!team) return;

      // Remove old caption if any
      const existing = card.querySelector(".program-caption");
      if (existing) existing.remove();

      const desc = pick(team, "description", lang);
      const sched = pick(team, "schedule", lang);

      if (!desc && !sched) return;

      const caption = document.createElement("div");
      caption.className = "program-caption";
      caption.innerHTML = `
        ${desc ? `<p class="program-desc">${desc}</p>` : ""}
        ${sched ? `<div class="program-schedule"><i class="fas fa-clock"></i> ${sched}</div>` : ""}
      `;
      card.appendChild(caption);
    });
  }

  load();

  const obs = new MutationObserver(load);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();
