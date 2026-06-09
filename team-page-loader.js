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
    const cleanURL = window.location.origin + window.location.pathname.replace(/\/+$/, "");
    setAttr("canonicalLink", "href", cleanURL);
    setAttr("metaDesc", "content", `${age} — ${desc}`);
    setAttr("ogTitle", "content", name + " — Κ.Ο. Καλαμαριάς");
    setAttr("ogDesc", "content", `${age} — ${desc}`);
    setAttr("twTitle", "content", name + " — Κ.Ο. Καλαμαριάς");
    setAttr("twDesc", "content", `${age} — ${desc}`);
  }

  function escape(text) {
    if (!text) return "";
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderFAQs(team, lang) {
    const faqs = (team.faqs || []).filter(f => f && (f.q || f.q_en));
    if (!faqs.length) return "";

    // Group by section (Greek section preferred, fallback EN, fallback no group)
    const groups = new Map();
    const order = [];
    for (const f of faqs) {
      const sec = lang === "en" ? (f.section_en || f.section || "") : (f.section || f.section_en || "");
      if (!groups.has(sec)) { groups.set(sec, []); order.push(sec); }
      groups.get(sec).push(f);
    }

    const faqTitle = lang === "en" ? "Frequently Asked Questions" : "Συχνές Ερωτήσεις";
    const faqIntro = lang === "en"
      ? "Click on any question to reveal the answer ↓"
      : "Πατήστε σε κάθε ερώτηση για να εμφανιστεί η απάντηση ↓";

    let html = `<div class="faq-header">
      <h2 class="faq-title"><i class="fas fa-circle-question"></i> ${faqTitle}</h2>
      <p class="faq-intro">${faqIntro}</p>
    </div>`;
    for (const sec of order) {
      if (sec) {
        html += `<h3 class="faq-section">${escape(sec)}</h3>`;
      }
      html += `<div class="faq-list">`;
      for (const f of groups.get(sec)) {
        const q = lang === "en" ? (f.q_en || f.q) : (f.q || f.q_en);
        const a = lang === "en" ? (f.a_en || f.a) : (f.a || f.a_en);
        const qUntr = lang === "en" && !f.q_en && f.q;
        const aUntr = lang === "en" && !f.a_en && f.a;
        const qWrap = qUntr ? ` lang="el"` : "";
        const aWrap = aUntr ? ` lang="el"` : "";
        const hintText = lang === "en" ? "Click to read" : "Πατήστε για ανάγνωση";
        html += `<details class="faq-item">
          <summary class="faq-q"${qWrap}>
            <span class="faq-q-text">${escape(q)}</span>
            <span class="faq-q-hint">${hintText}</span>
          </summary>
          <div class="faq-a"${aWrap}>${escape(a).replace(/\n/g, "<br>")}</div>
        </details>`;
      }
      html += `</div>`;
    }
    return html;
  }

  function render(team, lang) {
    const name = pick(team, "name", lang);
    const age = pick(team, "age", lang);
    const desc = pick(team, "description", lang);
    const sched = pick(team, "schedule", lang);
    const coachIntro = pick(team, "coach_intro", lang);

    const ctaLabel = lang === "en" ? "Register / Contact us" : "Εγγραφή / Επικοινωνία";
    const faqsHTML = renderFAQs(team, lang);

    container.innerHTML = `
      <article class="team-page">
        <span class="page-hero-tag">${age}</span>
        <h1>${name}</h1>
        ${desc ? `<p class="team-desc">${desc}</p>` : ""}
        ${sched ? `<div class="team-schedule"><i class="fas fa-clock"></i> ${sched}</div>` : ""}
        ${coachIntro ? `<div class="team-coach-intro">${team.coach_photo ? `<img class="team-coach-photo" src="${team.coach_photo}" alt="${escape(coachIntro.split('—')[0].trim())}" loading="lazy" />` : `<i class="fas fa-user-tie team-coach-icon"></i>`}<span>${escape(coachIntro)}</span></div>` : ""}
        ${faqsHTML}
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
