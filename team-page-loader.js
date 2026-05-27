// =====================================================
//  Team Page Loader — Φορτώνει συγκεκριμένο τμήμα από slug
//  URL pattern: /teams/[slug]  →  rewritten to /team.html
// =====================================================

(function () {
  const container = document.getElementById("teamContent");
  if (!container) return;

  function pick(item, field, lang) {
    return (lang === "en" && item[field + "_en"]) ? item[field + "_en"] : (item[field] || "");
  }

  function getSlugFromURL() {
    const path = window.location.pathname.replace(/\/+$/, "");
    const parts = path.split("/").filter(Boolean);
    return parts[1] || "";
  }

  function updateMeta(team, lang) {
    const name = pick(team, "name", lang);
    const age = pick(team, "age", lang);
    const desc = pick(team, "description", lang).substring(0, 200);
    document.title = name + " — Κ.Ο. Καλαμαριάς";
    const setAttr = (id, attr, value) => {
      const el = document.getElementById(id);
      if (el) el.setAttribute(attr, value);
    };
    setAttr("metaDesc", "content", `${age} — ${desc}`);
    setAttr("ogTitle", "content", name + " — Κ.Ο. Καλαμαριάς");
    setAttr("ogDesc", "content", `${age} — ${desc}`);
    setAttr("twTitle", "content", name + " — Κ.Ο. Καλαμαριάς");
    setAttr("twDesc", "content", `${age} — ${desc}`);
  }

  function render(team, lang) {
    const name = pick(team, "name", lang);
    const age = pick(team, "age", lang);
    const desc = pick(team, "description", lang);
    const sched = pick(team, "schedule", lang);

    const ctaLabel = lang === "en" ? "Register / Contact us" : "Εγγραφή / Επικοινωνία";

    container.innerHTML = `
      <article class="team-page">
        <span class="page-hero-tag">${age}</span>
        <h1>${name}</h1>
        ${desc ? `<p class="team-desc">${desc}</p>` : ""}
        ${sched ? `<div class="team-schedule"><i class="fas fa-clock"></i> ${sched}</div>` : ""}
        <div class="article-footer">
          <a href="/contact" class="btn btn-primary"><i class="fas fa-envelope"></i> ${ctaLabel}</a>
          <a href="/teams" class="btn btn-outline-dark"><i class="fas fa-arrow-left"></i> <span data-i18n="team.back">Πίσω στα Τμήματα</span></a>
        </div>
      </article>
    `;
  }

  function renderNotFound(lang) {
    const t = lang === "en"
      ? { title: "Team not found", msg: "The team you are looking for does not exist.", back: "Back to Teams" }
      : { title: "Το τμήμα δεν βρέθηκε", msg: "Το τμήμα που ψάχνετε δεν υπάρχει.", back: "Πίσω στα Τμήματα" };
    container.innerHTML = `
      <div class="article-notfound">
        <i class="fas fa-exclamation-circle"></i>
        <h1>${t.title}</h1>
        <p>${t.msg}</p>
        <a href="/teams" class="btn btn-primary"><i class="fas fa-arrow-left"></i> ${t.back}</a>
      </div>
    `;
  }

  let cache = null;
  const slug = getSlugFromURL();

  async function load() {
    if (!cache) {
      try {
        const res = await fetch("/content/data/teams.json", { cache: "no-cache" });
        const data = await res.json();
        cache = data.teams || [];
      } catch (err) {
        console.error("Failed to load teams.json:", err);
        return;
      }
    }
    const lang = document.documentElement.lang || "el";
    const team = cache.find(t => t.slug === slug);

    if (team) {
      updateMeta(team, lang);
      render(team, lang);
    } else {
      renderNotFound(lang);
    }
  }

  load();

  const obs = new MutationObserver(load);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();
