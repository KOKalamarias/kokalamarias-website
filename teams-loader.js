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

    const page = document.body.dataset.page; // "teams" or "home"
    const isTeamsPage = page === "teams";
    const isHomePage  = page === "home";
    const ctaLabel = lang === "en" ? "See more" : "Δείτε περισσότερα";

    cards.forEach((card, idx) => {
      const team = cache[idx];
      if (!team) return;

      // Redirect cards to their individual team page (on both home and teams listing)
      if (team.slug && (isTeamsPage || isHomePage)) {
        card.setAttribute("href", `/teams/${team.slug}`);
      }

      // Remove old caption if any
      const existing = card.querySelector(".program-caption");
      if (existing) existing.remove();

      const desc = pick(team, "description", lang);
      const sched = pick(team, "schedule", lang);
      const hasSlug = team.slug && (isTeamsPage || isHomePage);

      if (!desc && !sched && !hasSlug) return;

      // Show description & schedule ONLY on /teams (not on home, which is just image previews)
      const showDetails = isTeamsPage;
      const caption = document.createElement("div");
      caption.className = "program-caption";
      caption.innerHTML = `
        ${(showDetails && desc) ? `<p class="program-desc">${desc}</p>` : ""}
        ${(showDetails && sched) ? `<div class="program-schedule"><i class="fas fa-clock"></i> ${sched}</div>` : ""}
        ${hasSlug ? `<span class="program-cta">${ctaLabel} <i class="fas fa-arrow-right"></i></span>` : ""}
      `;
      card.appendChild(caption);
    });
  }

  load();

  const obs = new MutationObserver(load);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();
