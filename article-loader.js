// =====================================================
//  Article Loader — Φορτώνει συγκεκριμένο άρθρο από slug στο URL
//  URL pattern: /news/[slug]  →  rewritten to /article.html
// =====================================================

(function () {
  const container = document.getElementById("articleContent");
  if (!container) return;

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

  function pickWithLang(article, field, lang) {
    const enKey = field + "_en";
    if (lang === "en" && article[enKey]) return { text: article[enKey], untranslated: false };
    const elText = article[field] || "";
    // Only mark as "untranslated" when there's Greek content but no English equivalent
    return { text: elText, untranslated: lang === "en" && elText.trim() !== "" };
  }

  function langWrap(html, untranslated, tag) {
    tag = tag || "span";
    if (!untranslated || !html) return html;
    return `<${tag} lang="el">${html}</${tag}>`;
  }

  // Detect YouTube/Vimeo URLs and build responsive iframe embed
  function videoEmbedHTML(url) {
    if (!url) return "";
    const trimmed = String(url).trim();
    if (!trimmed) return "";

    // YouTube: watch?v=, youtu.be/, shorts/, embed/
    let m = trimmed.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
    if (m) {
      return `<div class="video-embed">
        <iframe src="https://www.youtube.com/embed/${m[1]}"
                title="YouTube video"
                allowfullscreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                loading="lazy"></iframe>
      </div>`;
    }

    // Vimeo: vimeo.com/12345 or vimeo.com/video/12345
    m = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (m) {
      return `<div class="video-embed">
        <iframe src="https://player.vimeo.com/video/${m[1]}"
                title="Vimeo video"
                allowfullscreen
                allow="autoplay; fullscreen; picture-in-picture"
                loading="lazy"></iframe>
      </div>`;
    }

    return "";
  }

  function getSlugFromURL() {
    // Path looks like "/news/5o-protathlima" or "/social/heart-swim"
    const path = window.location.pathname.replace(/\/+$/, "");
    const parts = path.split("/").filter(Boolean);
    return parts[1] || "";
  }

  function getSectionFromURL() {
    const path = window.location.pathname.replace(/\/+$/, "");
    const parts = path.split("/").filter(Boolean);
    return parts[0] || "news"; // "news" or "social"
  }

  const SECTION = getSectionFromURL();
  const IS_SOCIAL = SECTION === "social";
  const DATA_FILE = IS_SOCIAL ? "/content/data/social.json" : "/content/data/news.json";
  const BACK_URL = IS_SOCIAL ? "/social" : "/news";

  function updateMeta(article, lang) {
    const title = pick(article, "title", lang);
    const summary = pick(article, "summary", lang).replace(/\*\*/g, "").substring(0, 200);
    const image = article.image
      ? new URL(article.image.replace(/^\//, ""), window.location.origin).href
      : "https://www.kokalamarias.gr/images/og-image.jpg";

    document.title = title + " — Κ.Ο. Καλαμαριάς";
    const setAttr = (id, attr, value) => {
      const el = document.getElementById(id);
      if (el) el.setAttribute(attr, value);
    };
    setAttr("metaDesc", "content", summary);
    setAttr("ogTitle", "content", title + " — Κ.Ο. Καλαμαριάς");
    setAttr("ogDesc", "content", summary);
    setAttr("ogImage", "content", image);
    setAttr("twTitle", "content", title + " — Κ.Ο. Καλαμαριάς");
    setAttr("twDesc", "content", summary);
    setAttr("twImage", "content", image);
  }

  function render(article, lang) {
    const titleR = pickWithLang(article, "title", lang);
    const dateR = pickWithLang(article, "date_label", lang);
    const summaryR = pickWithLang(article, "summary", lang);
    const bodyR = pickWithLang(article, "body", lang);
    const title = langWrap(titleR.text, titleR.untranslated);
    const dateLabel = langWrap(dateR.text, dateR.untranslated);
    const summary = langWrap(md(summaryR.text), summaryR.untranslated, "div");
    const body = langWrap(md(bodyR.text), bodyR.untranslated, "div");
    const cat = CATEGORY_LABELS[article.category]
      ? CATEGORY_LABELS[article.category][lang] || CATEGORY_LABELS[article.category].el
      : article.category;

    // Detect if article is missing English version (when page is in EN mode)
    const missingEN = lang === "en" && (titleR.untranslated || summaryR.untranslated || bodyR.untranslated);
    const translateURL = "https://translate.google.com/translate?sl=el&tl=en&u=" + encodeURIComponent(window.location.href);
    const noticeBlock = missingEN
      ? `<div class="translate-notice">
           <i class="fas fa-language"></i>
           <span>This article is only available in Greek. Your browser may offer automatic translation, or
           <a href="${translateURL}" target="_blank" rel="noopener">view in Google Translate</a>.</span>
         </div>`
      : "";

    const imageBlock = article.image
      ? `<div class="article-hero-photo"><img src="${article.image}" alt="${titleR.text}" /></div>`
      : "";
    const videoBlock = videoEmbedHTML(article.video);

    container.innerHTML = `
      ${noticeBlock}
      ${imageBlock}
      <div class="article-meta">
        <span class="news-category">${cat}</span>
        ${dateLabel ? `<span class="news-date"><i class="fas fa-calendar"></i> ${dateLabel}</span>` : ""}
      </div>
      <h1 class="article-title">${title}</h1>
      <div class="article-summary">${summary}</div>
      ${videoBlock}
      ${body ? `<div class="article-body">${body}</div>` : ""}
      <div class="article-footer">
        <a href="${BACK_URL}" class="btn btn-outline-dark">
          <i class="fas fa-arrow-left"></i> ${IS_SOCIAL ? (lang === "en" ? "Back to Social Actions" : "Πίσω στις Δράσεις") : (lang === "en" ? "Back to News" : "Πίσω στα Νέα")}
        </a>
      </div>
    `;
  }

  function renderNotFound(lang) {
    let t;
    if (IS_SOCIAL) {
      t = lang === "en"
        ? { title: "Action not found", msg: "The action you are looking for does not exist or has been removed.", back: "Back to Social Actions" }
        : { title: "Η δράση δεν βρέθηκε", msg: "Η δράση που ψάχνετε δεν υπάρχει ή αφαιρέθηκε.", back: "Πίσω στις Δράσεις" };
    } else {
      t = lang === "en"
        ? { title: "Article not found", msg: "The article you are looking for does not exist or has been removed.", back: "Back to News" }
        : { title: "Το άρθρο δεν βρέθηκε", msg: "Το άρθρο που ψάχνετε δεν υπάρχει ή αφαιρέθηκε.", back: "Πίσω στα Νέα" };
    }
    container.innerHTML = `
      <div class="article-notfound">
        <i class="fas fa-exclamation-circle"></i>
        <h1>${t.title}</h1>
        <p>${t.msg}</p>
        <a href="${BACK_URL}" class="btn btn-primary"><i class="fas fa-arrow-left"></i> ${t.back}</a>
      </div>
    `;
  }

  let cache = null;
  const slug = getSlugFromURL();

  // Set top back-link based on section
  (function setBackLink() {
    const link = document.getElementById("articleBackLink");
    const label = document.getElementById("articleBackLabel");
    if (link) link.setAttribute("href", BACK_URL);
    if (label) {
      const lang = document.documentElement.lang || "el";
      if (IS_SOCIAL) {
        label.textContent = lang === "en" ? "Back to Social Actions" : "Πίσω στις Δράσεις";
      } else {
        label.textContent = lang === "en" ? "Back to News" : "Πίσω στα Νέα";
      }
    }
  })();

  async function load() {
    if (!cache) {
      try {
        const res = await fetch(DATA_FILE, { cache: "no-cache" });
        const data = await res.json();
        cache = data.articles || [];
      } catch (err) {
        console.error("Failed to load " + DATA_FILE + ":", err);
        return;
      }
    }
    const lang = document.documentElement.lang || "el";
    const article = cache.find(a => a.slug === slug && a.published !== false);

    if (article) {
      updateMeta(article, lang);
      render(article, lang);
    } else {
      renderNotFound(lang);
    }
  }

  load();

  // Re-render on language toggle
  const obs = new MutationObserver(load);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();
