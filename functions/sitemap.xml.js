// Cloudflare Pages Function — dynamic sitemap.xml
// Generated on request from the live content JSON files,
// so new CMS articles/athletes/teams appear automatically.

const BASE = "https://www.kokalamarias.gr";

const STATIC_PAGES = [
  { path: "/",          priority: "1.0", changefreq: "weekly" },
  { path: "/club",      priority: "0.8", changefreq: "monthly" },
  { path: "/teams",     priority: "0.8", changefreq: "monthly" },
  { path: "/champions", priority: "0.8", changefreq: "monthly" },
  { path: "/social",    priority: "0.8", changefreq: "weekly" },
  { path: "/news",      priority: "0.9", changefreq: "weekly" },
  { path: "/contact",   priority: "0.7", changefreq: "yearly" },
];

export async function onRequest(context) {
  const origin = new URL(context.request.url).origin;

  const fetchJSON = async (path) => {
    try {
      const res = await context.env.ASSETS.fetch(new URL(path, origin));
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  };

  const [news, athletes, teams, social] = await Promise.all([
    fetchJSON("/content/data/news.json"),
    fetchJSON("/content/data/athletes.json"),
    fetchJSON("/content/data/teams.json"),
    fetchJSON("/content/data/social.json"),
  ]);

  const urls = STATIC_PAGES.map((p) => ({ loc: BASE + p.path, ...p }));

  for (const a of news?.articles || []) {
    if (a.slug && a.published !== false) {
      urls.push({ loc: `${BASE}/news/${a.slug}`, priority: "0.7", changefreq: "monthly", lastmod: a.date });
    }
  }
  for (const a of athletes?.items || []) {
    if (a.slug) {
      urls.push({ loc: `${BASE}/champions/${a.slug}`, priority: "0.6", changefreq: "yearly" });
    }
  }
  for (const t of teams?.teams || []) {
    if (t.slug) {
      urls.push({ loc: `${BASE}/teams/${t.slug}`, priority: "0.7", changefreq: "monthly" });
    }
  }
  for (const a of social?.articles || []) {
    if (a.slug && a.published !== false) {
      urls.push({ loc: `${BASE}/social/${a.slug}`, priority: "0.7", changefreq: "monthly", lastmod: a.date });
    }
  }

  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls
      .map((u) => {
        let entry = `  <url>\n    <loc>${u.loc}</loc>\n`;
        if (u.lastmod) entry += `    <lastmod>${u.lastmod}</lastmod>\n`;
        entry += `    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`;
        return entry;
      })
      .join("\n") +
    "\n</urlset>\n";

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
