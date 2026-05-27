// =====================================================
//  Athlete Loader — Φορτώνει συγκεκριμένο αθλητή από slug στο URL
//  URL pattern: /champions/[slug]  →  rewritten to /athlete.html
// =====================================================

(function () {
  const container = document.getElementById("athleteContent");
  if (!container) return;

  const TYPE_ICON = {
    gold:   { icon: "fa-trophy", cls: "gold" },
    silver: { icon: "fa-medal",  cls: "silver" },
    bronze: { icon: "fa-medal",  cls: "bronze" },
    world:  { icon: "fa-globe",  cls: "" },
    time:   { icon: "fa-stopwatch", cls: "" },
    flag:   { icon: "fa-flag",   cls: "" },
    other:  { icon: "fa-star",   cls: "" }
  };

  function pick(item, field, lang) {
    return (lang === "en" && item[field + "_en"]) ? item[field + "_en"] : (item[field] || "");
  }

  function getSlugFromURL() {
    const path = window.location.pathname.replace(/\/+$/, "");
    const parts = path.split("/").filter(Boolean);
    return parts[1] || "";
  }

  function updateMeta(athlete, lang) {
    const name = pick(athlete, "name", lang);
    const spec = pick(athlete, "specialty", lang);
    const desc = `${name} — ${spec}. ${lang === "en" ? "Athlete of Kalamaria Swimming Club." : "Αθλητής/τρια του Κ.Ο. Καλαμαριάς."}`;
    document.title = name + " — Κ.Ο. Καλαμαριάς";
    const setAttr = (id, attr, value) => {
      const el = document.getElementById(id);
      if (el) el.setAttribute(attr, value);
    };
    setAttr("metaDesc", "content", desc);
    setAttr("ogTitle", "content", name + " — Κ.Ο. Καλαμαριάς");
    setAttr("ogDesc", "content", desc);
    setAttr("twTitle", "content", name + " — Κ.Ο. Καλαμαριάς");
    setAttr("twDesc", "content", desc);
  }

  function render(athlete, lang) {
    const name = pick(athlete, "name", lang);
    const spec = pick(athlete, "specialty", lang);
    const icon = athlete.icon || "fa-medal";

    const achievementsHtml = (athlete.achievements || []).map(a => {
      const t = TYPE_ICON[a.type] || TYPE_ICON.other;
      const text = lang === "en" ? (a.text_en || a.text_el) : a.text_el;
      return `<li><i class="fas ${t.icon} ${t.cls}"></i> <span>${text}</span></li>`;
    }).join("");

    container.innerHTML = `
      <article class="champion-card champion-page">
        <div class="champion-header">
          <div class="champion-avatar"><i class="fas ${icon}"></i></div>
          <div>
            <h1>${name}</h1>
            <span class="champion-spec">${spec}</span>
          </div>
        </div>
        <h2 class="achievements-title" data-i18n="athlete.achievements">Διακρίσεις</h2>
        <ul class="champion-achievements">${achievementsHtml}</ul>
      </article>
      <div class="article-footer">
        <a href="/champions" class="btn btn-outline-dark">
          <i class="fas fa-arrow-left"></i> <span data-i18n="athlete.back">Πίσω στους Πρωταθλητές</span>
        </a>
      </div>
    `;
  }

  function renderNotFound(lang) {
    const t = lang === "en"
      ? { title: "Athlete not found", msg: "The athlete you are looking for does not exist.", back: "Back to Champions" }
      : { title: "Ο αθλητής δεν βρέθηκε", msg: "Ο αθλητής που ψάχνετε δεν υπάρχει.", back: "Πίσω στους Πρωταθλητές" };
    container.innerHTML = `
      <div class="article-notfound">
        <i class="fas fa-exclamation-circle"></i>
        <h1>${t.title}</h1>
        <p>${t.msg}</p>
        <a href="/champions" class="btn btn-primary"><i class="fas fa-arrow-left"></i> ${t.back}</a>
      </div>
    `;
  }

  let cache = null;
  const slug = getSlugFromURL();

  async function load() {
    if (!cache) {
      try {
        const res = await fetch("/content/data/athletes.json", { cache: "no-cache" });
        const data = await res.json();
        cache = data.items || [];
      } catch (err) {
        console.error("Failed to load athletes.json:", err);
        return;
      }
    }
    const lang = document.documentElement.lang || "el";
    const athlete = cache.find(a => a.slug === slug);

    if (athlete) {
      updateMeta(athlete, lang);
      render(athlete, lang);
    } else {
      renderNotFound(lang);
    }
  }

  load();

  const obs = new MutationObserver(load);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();
