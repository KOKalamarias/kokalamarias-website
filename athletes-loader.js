// =====================================================
//  Athletes Loader — Φορτώνει αθλητές από content/data/athletes.json
//  Render στη σελίδα champions.html
// =====================================================

(function () {
  const grid = document.getElementById("championsGrid");
  if (!grid) return;

  function showLoadError() {
    if (!grid || grid.children.length > 0) return;
    const lang = document.documentElement.lang || "el";
    const t = lang === "en"
      ? { msg: "Couldn't load the content. Please check your connection and refresh the page.", retry: "Refresh" }
      : { msg: "Δεν ήταν δυνατή η φόρτωση του περιεχομένου. Ελέγξτε τη σύνδεσή σας και ανανεώστε τη σελίδα.", retry: "Ανανέωση" };
    grid.innerHTML = `<div class="load-error"><i class="fas fa-triangle-exclamation"></i><p>${t.msg}</p><button type="button" onclick="location.reload()">${t.retry}</button></div>`;
  }

  // Icon class για κάθε τύπο διάκρισης
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

  function renderCard(athlete, lang) {
    const name = pick(athlete, "name", lang);
    const spec = pick(athlete, "specialty", lang);
    const icon = athlete.icon || "fa-medal";
    const slug = athlete.slug || "";
    const profileURL = slug ? `/champions/${slug}` : null;

    const achievementsHtml = (athlete.achievements || []).map(a => {
      const t = TYPE_ICON[a.type] || TYPE_ICON.other;
      const text = lang === "en" ? (a.text_en || a.text_el) : a.text_el;
      return `<li><i class="fas ${t.icon} ${t.cls}"></i> <span>${text}</span></li>`;
    }).join("");

    const titleBlock = profileURL
      ? `<h3><a href="${profileURL}">${name}</a></h3>`
      : `<h3>${name}</h3>`;

    const avatarBlock = athlete.photo
      ? `<div class="champion-avatar champion-avatar-photo"><img src="${athlete.photo}" alt="${name}" loading="lazy" /></div>`
      : `<div class="champion-avatar"><i class="fas ${icon}"></i></div>`;

    return `<article class="champion-card">
      <div class="champion-header">
        ${avatarBlock}
        <div>
          ${titleBlock}
          <span class="champion-spec">${spec}</span>
        </div>
      </div>
      <ul class="champion-achievements">${achievementsHtml}</ul>
    </article>`;
  }

  let cache = null;

  async function load() {
    if (!cache) {
      try {
        const res = await fetch("content/data/athletes.json", { cache: "no-cache" });
        const data = await res.json();
        cache = data.items || [];
      } catch (err) {
        console.error("Failed to load athletes.json:", err);
        showLoadError();
        return;
      }
    }
    const lang = document.documentElement.lang || "el";
    grid.innerHTML = cache.map(a => renderCard(a, lang)).join("\n");
  }

  load();

  // Re-render on language toggle
  const obs = new MutationObserver(load);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();
