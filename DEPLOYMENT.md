# 🛠 Τεχνική Τεκμηρίωση — kokalamarias.gr

**Για ποιον είναι**: Για τον τεχνικό διαχειριστή του site (τωρινό ή μελλοντικό). Περιγράφει **όλη** την αρχιτεκτονική, τους λογαριασμούς και τις διαδικασίες. Ο μη-τεχνικός χρήστης δεν χρειάζεται αυτό το αρχείο — έχει το [MANUAL.md](MANUAL.md).

*Τελευταία ενημέρωση: Ιούνιος 2026*

---

## 🗺 Αρχιτεκτονική — Συνολική Εικόνα

```
Επισκέπτης
   │
   ▼
kokalamarias.gr  ──301──▶  www.kokalamarias.gr
(παλιό hosting pointer.gr,      (Cloudflare Pages)
 μόνο redirect)                        ▲
                                       │ auto-deploy σε κάθε push
                                       │
GitHub repo: KOKalamarias/kokalamarias-website (branch: main)
   ▲                    ▲
   │ git push           │ commits μέσω CMS
   │                    │
Τεχνικός           Decap CMS (/admin)
(GitHub Desktop)        │
                        ▼
              OAuth Worker (Cloudflare)
              decap-proxy.empty-cloud-336b.workers.dev
```

**Email** (ανεξάρτητο από το site): `info@kokalamarias.gr` → Zoho EU, μέσω MX records στο freedns του pointer.gr.

---

## 📋 Λογαριασμοί & Υπηρεσίες

| Υπηρεσία | Λογαριασμός | Ρόλος |
|---|---|---|
| **GitHub** | `KOKalamarias` (info@kokalamarias.gr) | Repo + CMS login |
| **Cloudflare** | info@kokalamarias.gr | Pages hosting + OAuth Worker |
| **pointer.gr** | λογαριασμός ΚΟΚ | Domain registrar + Free DNS + παλιό hosting (μόνο για apex redirect) |
| **Zoho EU** | info@kokalamarias.gr | Email |
| **Web3Forms** | info@kokalamarias.gr | Φόρμα επικοινωνίας (access key στο script.js — public key, ασφαλές) |

---

## 🌐 DNS (Free DNS @ pointer.gr)

Nameservers: `freedns1.pointer.gr` / `freedns2.pointer.gr`

| Record | Τύπος | Τιμή | Σκοπός |
|---|---|---|---|
| `www` | CNAME | `kokalamarias-website.pages.dev` | Site → Cloudflare Pages |
| `@` (apex) | A | `185.25.23.211` | Παλιό hosting pointer.gr → κάνει 301 στο www |
| `@` | MX ×3 | `mx.zoho.eu` (10), `mx2` (20), `mx3` (50) | Email Zoho |
| `@` | TXT | `v=spf1 include:zohomail.eu ~all` | SPF |
| `zmail._domainkey` | TXT | (DKIM key) | DKIM |
| `_dmarc` | TXT | `v=DMARC1; ...` | DMARC |

⚠️ **ΠΡΟΣΟΧΗ**: Μην ενεργοποιήσεις ποτέ το «Domain Forward» του pointer.gr — **απενεργοποιεί το Free DNS** και ρίχνει email + site.

### Apex redirect

Το `kokalamarias.gr` (χωρίς www) δείχνει στο παλιό hosting του pointer.gr (cPanel, `linux56.name-servers.gr`, χρήστης `ko664509`). Στο `public_html/` υπάρχουν **μόνο** 2 αρχεία:
- `.htaccess` → 301 redirect στο `https://www.kokalamarias.gr/$1`
- `index.html` → meta-refresh fallback

---

## ☁️ Cloudflare Pages

- **Project**: `kokalamarias-website`
- **Source**: GitHub repo, branch `main`, auto-deploy σε κάθε push (~1 λεπτό)
- **Custom domain**: `www.kokalamarias.gr` (CNAME validation, ΟΧΙ full DNS transfer)
- **Build**: κανένα build step — στατικά αρχεία από root

### Ειδικά αρχεία

| Αρχείο | Ρόλος |
|---|---|
| `_redirects` | URL rewrites: `/news/:slug → /article`, `/social/:slug → /article`, `/champions/:slug → /athlete`, `/teams/:slug → /team` (όλα status 200) |
| `_headers` | Cache-Control: εικόνες 1 έτος immutable, **JSON `must-revalidate`** (κρίσιμο — αλλιώς οι CMS αλλαγές δεν φαίνονται), security headers |
| `404.html` | Branded 404 (το Cloudflare το σερβίρει αυτόματα με status 404) |
| `functions/sitemap.xml.js` | **Δυναμικό sitemap** — Pages Function που διαβάζει τα JSON on-request. Δεν χρειάζεται ποτέ χειροκίνητη ενημέρωση. ΜΗΝ προσθέσεις στατικό `sitemap.xml` (θα υπερισχύσει της function). |

---

## 🔐 Decap CMS (/admin)

- **UI**: `admin/index.html` (φορτώνει decap-cms από unpkg)
- **Config**: `admin/config.yml` — backend `github`, repo `KOKalamarias/kokalamarias-website`
- **OAuth**: Cloudflare Worker `decap-proxy` (URL: `decap-proxy.empty-cloud-336b.workers.dev`)
  - Secrets στο Worker: `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET`
  - Αντιστοιχούν σε GitHub OAuth App (Settings → Developer settings του λογαριασμού KOKalamarias), callback: `https://decap-proxy.empty-cloud-336b.workers.dev/callback`
- Κάθε "Publish" στο CMS = git commit στο main = auto-deploy

### Collections (τι επεξεργάζεται ο χρήστης)

`content/data/` → `news.json`, `social.json`, `athletes.json`, `teams.json`, `board.json`, `site.json`
Media uploads → `images/uploads/`

---

## 🧩 Frontend αρχιτεκτονική

- **Στατικό multi-page** HTML/CSS/JS — κανένα framework, κανένα build
- **i18n**: `translations.js` (EL/EN) + `data-i18n` attributes· εναλλαγή client-side (κουμπί EL/EN), αποθήκευση σε localStorage
- **Loaders** (φορτώνουν JSON → render): `news-loader`, `social-news-loader`, `athletes-loader`, `board-loader`, `teams-loader`, `site-loader`, + ατομικές σελίδες: `article-loader`, `athlete-loader`, `team-page-loader`
- **Slug pages**: `/news/[slug]` κ.λπ. — το `_redirects` σερβίρει το template, ο loader διαβάζει το slug από το URL και κάνει render + ενημέρωση meta/canonical
- **Φόρμα επικοινωνίας**: Web3Forms API (POST από script.js) → email στο info@
- **Video**: πεδίο `video` σε άρθρα → YouTube/Vimeo embed (article-loader)
- **Εικόνες**: WebP παντού· hero eager + fetchpriority, τα υπόλοιπα lazy

⚠️ **ΜΗΝ αλλάξεις** τα `fetch(..., { cache: "no-cache" })` των loaders σε `force-cache` — σε συνδυασμό με το `_headers` (must-revalidate) εξασφαλίζουν ότι οι CMS αλλαγές εμφανίζονται αμέσως.

---

## 🔁 Συνηθισμένες εργασίες

### Deploy αλλαγής κώδικα
1. Επεξεργασία στο working folder (`kok-website-v2`) → αντιγραφή στο clone (`kokalamarias-website`)
2. GitHub Desktop → Commit → Push origin
3. ~1 λεπτό → live. Έλεγχος: `https://www.kokalamarias.gr`

### Αν το CMS δεν κάνει login
1. Έλεγχος Worker: `curl https://decap-proxy.empty-cloud-336b.workers.dev/` → «Decap CMS OAuth proxy — ready.»
2. Έλεγχος GitHub OAuth App callback URL
3. Έλεγχος secrets στο Worker (Cloudflare → Workers → decap-proxy → Settings → Variables)

### Αν πέσει το email
1. `dig MX kokalamarias.gr` → πρέπει 3 records Zoho EU
2. Έλεγχος Free DNS στο pointer.gr (τα records του πίνακα παραπάνω)
3. Zoho Admin: mailadmin.zoho.eu

### Rollback κακού deploy
- GitHub Desktop → History → δεξί κλικ στο κακό commit → Revert → Push
- Ή: Cloudflare Pages → Deployments → προηγούμενο deployment → Rollback

---

## 📦 Δομή repo (κύρια αρχεία)

```
├── *.html                  # σελίδες (index, club, teams, champions, social, news, contact)
├── article.html / athlete.html / team.html   # templates για slug pages
├── 404.html
├── style.css
├── translations.js         # EL/EN λεξικό
├── partials.js             # navbar + footer (κοινά)
├── script.js               # menu, γλώσσα, φόρμα επικοινωνίας
├── *-loader.js             # δυναμικό rendering από JSON
├── content/data/*.json     # ΤΟ ΠΕΡΙΕΧΟΜΕΝΟ (επεξεργάζεται το CMS)
├── admin/                  # Decap CMS
├── functions/sitemap.xml.js
├── _redirects, _headers, robots.txt
├── images/                 # γραφικά (WebP) + uploads/ (CMS) + coaches/
├── MANUAL.md               # οδηγός μη-τεχνικού χρήστη
└── DEPLOYMENT.md           # αυτό το αρχείο
```
