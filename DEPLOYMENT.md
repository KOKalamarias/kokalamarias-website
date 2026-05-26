# 🚀 Οδηγός Ανέβασματος Site & Χρήσης CMS

Αυτός ο οδηγός εξηγεί **βήμα-βήμα** πώς να ανεβάσεις το site στο internet (`kokalamarias.gr`) και πώς να ενημερώνεις νέα/αθλητές/κείμενα μέσω του admin πάνελ.

**Δεν χρειάζεσαι τεχνικές γνώσεις.** Όλα τα βήματα γίνονται μέσω browser.

---

## ⚡ Quick Start — 30 λεπτά

| # | Βήμα | Που |
|---|---|---|
| 1 | Φτιάξε **GitHub account** (δωρεάν) | [github.com/signup](https://github.com/signup) |
| 2 | Ανέβασε τον φάκελο `kok-website-v2` ως **νέο repository** | github.com |
| 3 | Φτιάξε **Netlify account** (δωρεάν, login με GitHub) | [netlify.com](https://netlify.com) |
| 4 | Πάτα **«Add new site → Import from Git»** και διάλεξε το repo | Netlify dashboard |
| 5 | Σύνδεσε το domain `kokalamarias.gr` | Netlify → Domain settings |
| 6 | Ενεργοποίησε **Netlify Identity + Git Gateway** | Netlify → Identity tab |
| 7 | Προσκάλεσε τον εαυτό σου ως **editor** | Identity → Invite users |
| 8 | Login στο `kokalamarias.gr/admin` | Browser |

---

## 📦 Τι περιλαμβάνει αυτός ο φάκελος

```
kok-website-v2/
├── admin/                          ← Decap CMS admin panel
│   ├── index.html
│   └── config.yml                  ← Ρυθμίσεις πεδίων που μπορούν να επεξεργαστούν
│
├── content/                        ← ΟΛΑ τα κείμενα του site (επεξεργάσιμα από CMS)
│   ├── data/
│   │   ├── news.json               ← Άρθρα/Νέα
│   │   ├── athletes.json           ← 9 Πρωταθλητές
│   │   ├── board.json              ← 7 μέλη ΔΣ
│   │   ├── teams.json              ← 4 τμήματα
│   │   └── site.json               ← Κείμενα Hero, About, Contact κλπ
│   └── news/                       ← (placeholder folder)
│
├── images/                         ← Όλες οι εικόνες
│   └── uploads/                    ← Νέες φωτογραφίες από το CMS
│
├── index.html, club.html, ...      ← Οι σελίδες του site
├── style.css, script.js, ...       ← Κώδικας
└── DEPLOYMENT.md                   ← Αυτός ο οδηγός
```

---

## 🪜 Αναλυτικά Βήματα

### Βήμα 1 — GitHub Account

1. Πήγαινε στο [github.com/signup](https://github.com/signup)
2. Φτιάξε λογαριασμό με το email του ομίλου (π.χ. `info@kokalamarias.gr`)
3. Επιβεβαίωσε το email

### Βήμα 2 — Ανέβασμα Repository

**Επιλογή Α — Μέσω GitHub Desktop (συνιστάται για μη-τεχνικούς):**
1. Κατέβασε το [GitHub Desktop](https://desktop.github.com/)
2. Login με τα GitHub credentials σου
3. File → Add Local Repository → Διάλεξε τον `kok-website-v2/` φάκελο
4. Publish repository → Όνομα: `kokalamarias-website` → Public OR Private
5. Πάτα «Publish»

**Επιλογή Β — Online (drag & drop):**
1. Πήγαινε στο [github.com/new](https://github.com/new)
2. Όνομα: `kokalamarias-website`
3. **Public** για δωρεάν Netlify (αν θες Private, χρειάζεται Netlify paid plan)
4. Πάτα «Create repository»
5. Στη σελίδα που εμφανίζεται, πάτα **«uploading an existing file»**
6. Σύρε ΟΛΟ τον φάκελο `kok-website-v2` μέσα
7. «Commit changes»

### Βήμα 3 — Netlify Account & Deploy

1. Πήγαινε στο [netlify.com](https://netlify.com)
2. Πάτα **«Sign up»** → Login with GitHub
3. Στο dashboard, πάτα **«Add new site → Import an existing project»**
4. Διάλεξε **GitHub** ως πάροχο
5. Διάλεξε το repository `kokalamarias-website`
6. **Build settings**: Άφησε τα κενά (είναι static site, δεν χρειάζεται build)
7. Πάτα **«Deploy»**

Σε ~30 δευτερόλεπτα το site θα είναι ζωντανό σε μια προσωρινή διεύθυνση τύπου `random-name-12345.netlify.app`.

### Βήμα 4 — Σύνδεση με kokalamarias.gr

1. Στο Netlify dashboard, πάτα το site σου
2. **«Domain settings» → «Add custom domain»**
3. Πληκτρολόγησε `kokalamarias.gr`
4. Το Netlify θα σου δώσει **DNS records** που πρέπει να βάλεις στον πάροχο που έχει το domain (π.χ. Papaki, GoDaddy)
5. Πες στον πάροχο του domain να δείξει το nameservers / A records σύμφωνα με τις οδηγίες Netlify
6. Μετά από 1-24 ώρες, το `kokalamarias.gr` οδηγεί στο site σου
7. Το Netlify δίνει **δωρεάν SSL** (https://) αυτόματα

### Βήμα 5 — Ενεργοποίηση Identity + Git Gateway (για το /admin)

1. Στο Netlify, πάτα **«Site configuration → Identity»**
2. Πάτα **«Enable Identity»**
3. Πάτα **«Registration preferences» → «Invite only»** (έτσι δεν μπορεί κάποιος τυχαίος να εγγραφεί)
4. Στο ίδιο tab, βρες **«Services → Git Gateway»** και πάτα **«Enable Git Gateway»**

### Βήμα 6 — Προσκάλεσε τον εαυτό σου / διαχειριστή

1. Στο **«Identity → Invite users»**
2. Δώσε το email του διαχειριστή
3. Θα έρθει email πρόσκλησης
4. Από το email, πάτα τον σύνδεσμο και βάλε password
5. Έγινε — μπορείς πλέον να συνδεθείς στο **`kokalamarias.gr/admin`**

---

## 🎛 Πώς δουλεύει το CMS

### Login

1. Πήγαινε στο **`kokalamarias.gr/admin`**
2. Email + Password
3. Είσαι μέσα

### Δημοσίευση Νέου Άρθρου

1. Στο αριστερό μενού πάτα **«📰 Νέα & Ανακοινώσεις»**
2. Πάτα **«Νew Entry»** / «Νέο»
3. Συμπλήρωσε:
   - **Τίτλος** — π.χ. «Νέο μετάλλιο στους Μεσογειακούς»
   - **Ημερομηνία** — επιλογή από ημερολόγιο
   - **Κατηγορία** — από dropdown (Πρωτάθλημα, Παγκόσμιο κλπ)
   - **Φωτογραφία** — drag & drop ή upload από υπολογιστή
   - **Σύντομη περίληψη** — 2-3 γραμμές
   - **Πλήρες κείμενο** (προαιρετικό) — markdown για bold/lists
   - **Featured** — checked για μεγάλη κάρτα με φωτό
4. Πάτα **«Save»** → **«Publish now»**
5. Σε ~30 δευτερόλεπτα το άρθρο εμφανίζεται στο `kokalamarias.gr/news.html`

### Επεξεργασία Αθλητών / Δ.Σ. / Τμημάτων

Από το αριστερό μενού:
- **🏊 Αθλητές / Πρωταθλητές** — προσθήκη/επεξεργασία διακρίσεων
- **🏛 Διοικητικό Συμβούλιο** — όνομα/ρόλος μελών
- **🏊‍♂️ Τμήματα** — περιγραφές, ηλικίες, πρόγραμμα
- **📝 Κείμενα Σελίδων** — Hero, About, Contact, social media URLs

Όλα έχουν φιλικά πεδία (όχι κώδικας).

### Markdown — Γρήγορος Οδηγός

Σε πεδία «Πλήρες κείμενο»:

| Σύνταξη | Αποτέλεσμα |
|---|---|
| `**έντονα**` | **έντονα** |
| `*πλάγια*` | *πλάγια* |
| `- στοιχείο 1` (νέα γραμμή) `- στοιχείο 2` | Λίστα κουκίδων |
| `[κείμενο](https://...)` | Σύνδεσμος |

---

## 🆘 Συχνές Ερωτήσεις

**Q: Άλλαξα κάτι στο CMS αλλά δεν φαίνεται στο site;**
A: Περίμενε ~30-60 δευτερόλεπτα. Το Netlify ξανα-deploy-άρει αυτόματα. Hard refresh (Cmd+Shift+R / Ctrl+F5) στον browser.

**Q: Πώς προσθέτω νέο μέλος Δ.Σ.;**
A: Admin → Διοικητικό Συμβούλιο → Πάτα στο μέλος που έχει άδειο όνομα → Συμπλήρωσε → Save.

**Q: Πώς αλλάζω εικόνες (logo, hero, κλπ);**
A: Admin → Media → ανέβασε νέα. Ή απευθείας από το αντίστοιχο πεδίο όπου την χρησιμοποιείς.

**Q: Πώς προσκαλώ έναν δεύτερο διαχειριστή;**
A: Netlify dashboard → Identity → Invite users → δώσε το email του. Θα του έρθει πρόσκληση.

**Q: Τι κάνω αν χαθούν τα data;**
A: Όλα είναι στο GitHub — έχεις πλήρες ιστορικό. Αν διαγράψεις άρθρο κατά λάθος, μπορεί να ανακτηθεί από το git history.

---

## 💰 Κόστος

- **GitHub**: Δωρεάν
- **Netlify**: Δωρεάν για το tier που χρειαζόμαστε (100GB bandwidth/μήνα — αρκετό για μικρομεσαίο site)
- **Domain `kokalamarias.gr`**: ~€15/χρόνο από πάροχο (Papaki, GoDaddy κλπ)

**Σύνολο: ~€15/χρόνο.**

---

## 📞 Υποστήριξη

Για τεχνική βοήθεια εγκατάστασης, μίλα με τον developer που σου έστησε το site. Μετά την αρχική εγκατάσταση, η συντήρηση γίνεται 100% από το `/admin` πάνελ χωρίς τεχνικές γνώσεις.
