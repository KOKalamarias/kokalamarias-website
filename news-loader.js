// =====================================================
//  News Loader — Φορτώνει άρθρα από content/data/news.json
// =====================================================

(function () {
  const grid = document.getElementById("newsGrid");
  if (!grid) return;

  const CATEGORY_LABELS = {
    championship: { el: "Πρωτάθλημα", en: "Championship" },
    world: { el: "Παγκόσμιο", en: "World" },
    european: { el: "Ευρωπαϊκό", en: "European" },
    record: { el: "Ρεκόρ", en: "Record" },
    "national-teams": { el: "Εθνικές Ομάδες", en: "National Teams" },
    registration: { el: "Εγγραφές", en: "Registration" },
    event: { el: "Εκδήλωση", en: "Event" },
    social: { el: "Κοινωνικό", en: "Community" }
  };

  // Mini markdown → HTML
  function md(text) {
    if (!text) return "";
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    const lines = html.split("\n");
    const out = [];
    let inList = false;
    for (const line of lines) {
      const isLi = /^\s*[-*]\s+/.test(line);
      if (isLi) {
        if (!inList) { out.push("<ul>"); inList = true; }
        out.push("<li>" + line.replace(/^\s*[-*]\s+/, "") + "</li>");
      } else {
        if (inList) { out.push("</ul>"); inList = false; }
        if (line.trim()) out.push("<p>" + line + "</p>");
      }
    }
    if (inList) out.push("</ul>");
    return out.join("\n");
  }

  function pick(article, field, lang) {
    const enKey = field + "_en";
    if (lang === "en" && article[enKey]) return article[enKey];
    return article[field] || "";
  }

  // Returns the text AND whether it was returned untranslated (i.e. still Greek while page is EN)
  function pickWithLang(article, field, lang) {
    const enKey = field + "_en";
    if (lang === "en" && article[enKey]) return { text: article[enKey], untranslated: false };
    return { text: article[field] || "", untranslated: lang === "en" };
  }

  // Wrap with lang="el" when content is Greek inside an English page,
  // so the browser offers built-in translation.
  function langWrap(html, untranslated, tag) {
    tag = tag || "span";
    if (!untranslated || !html) return html;
    return `<${tag} lang="el">${html}</${tag}>`;
  }

  function renderCard(article, lang) {
    const cat = CATEGORY_LABELS[article.category]
      ? CATEGORY_LABELS[article.category][lang] || CATEGORY_LABELS[article.category].el
      : article.category;
    const titleR = pickWithLang(article, "title", lang);
    const dateR = pickWithLang(article, "date_label", lang);
    const summaryR = pickWithLang(article, "summary", lang);
    const bodyR = pickWithLang(article, "body", lang);
    const title = langWrap(titleR.text, titleR.untranslated);
    const dateLabel = langWrap(dateR.text, dateR.untranslated);
    const summary = langWrap(md(summaryR.text), summaryR.untranslated, "div");
    const body = langWrap(md(bodyR.text), bodyR.untranslated, "div");
    const isFeatured = article.featured && article.image;
    const slug = article.slug || "";
    const articleURL = slug ? `/news/${slug}` : null;
    const readMoreLabel = lang === "en" ? "Read more" : "Διαβάστε περισσότερα";
    const readMoreLink = articleURL
      ? `<a href="${articleURL}" class="news-link">${readMoreLabel} <i class="fas fa-arrow-right"></i></a>`
      : "";

    if (isFeatured) {
      const photoBlock = articleURL
        ? `<a href="${articleURL}" class="news-photo"><img src="${article.image}" alt="${title}" loading="lazy" /></a>`
        : `<div class="news-photo"><img src="${article.image}" alt="${title}" loading="lazy" /></div>`;
      const titleBlock = articleURL
        ? `<h3><a href="${articleURL}">${title}</a></h3>`
        : `<h3>${title}</h3>`;
      return `<article class="news-card featured-news has-photo">
        ${photoBlock}
        <div class="news-body">
          <div class="news-category">${cat}</div>
          <div class="news-date"><i class="fas fa-calendar"></i> ${dateLabel}</div>
          ${titleBlock}
          ${summary}
          ${body ? `<div class="news-body-extra">${body}</div>` : ""}
          ${readMoreLink}
        </div>
      </article>`;
    }

    const titleBlock = articleURL
      ? `<h3><a href="${articleURL}">${title}</a></h3>`
      : `<h3>${title}</h3>`;
    return `<article class="news-card">
      <div class="news-category">${cat}</div>
      <div class="news-date"><i class="fas fa-calendar"></i> ${dateLabel}</div>
      ${titleBlock}
      ${summary}
      ${readMoreLink}
    </article>`;
  }

  let cache = null;

  async function load() {
    if (!cache) {
      try {
        const res = await fetch("content/data/news.json", { cache: "no-cache" });
        const data = await res.json();
        cache = data.articles || [];
      } catch (err) {
        console.error("Failed to load news.json:", err);
        return;
      }
    }
    const lang = document.documentElement.lang || "el";
    const published = cache
      .filter((a) => a.published !== false)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    grid.innerHTML = published.map((a) => renderCard(a, lang)).join("\n");
  }

  load();

  // Re-render on language toggle
  const obs = new MutationObserver(load);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();
