// =====================================================
//  Shared Partials — Navbar + Footer για όλες τις σελίδες
//  Σταθερό σημείο αλήθειας. Ενημερώνεις εδώ και αλλάζει παντού.
// =====================================================

const NAVBAR_HTML = `
<nav class="navbar" id="navbar">
  <div class="nav-container">
    <a href="index.html" class="nav-logo">
      <img src="logo.png" alt="Κ.Ο. Καλαμαριάς" class="logo-img" />
      <div class="logo-text">
        <span class="logo-main" data-i18n="logo.main">Κ.Ο. Καλαμαριάς</span>
        <span class="logo-sub" data-i18n="logo.sub">Κολυμβητικός Όμιλος</span>
      </div>
    </a>

    <ul class="nav-links" id="navLinks">
      <li><a href="index.html" data-page="home" data-i18n="nav.home">Αρχική</a></li>

      <li class="has-dropdown">
        <a href="club.html" data-page="club" class="dropdown-trigger">
          <span data-i18n="nav.club">Ο Όμιλος</span> <i class="fas fa-chevron-down dd-arrow"></i>
        </a>
        <ul class="dropdown-menu">
          <li><a href="club.html#about" data-i18n="nav.dd.about">Ιστορία & Σχετικά</a></li>
          <li><a href="club.html#board" data-i18n="nav.dd.board">Διοίκηση & Οργάνωση</a></li>
          <li><a href="club.html#coaches" data-i18n="nav.dd.coaches">Προπονητικό Επιτελείο</a></li>
        </ul>
      </li>

      <li class="has-dropdown">
        <a href="teams.html" data-page="teams" class="dropdown-trigger">
          <span data-i18n="nav.teams">Τμήματα</span> <i class="fas fa-chevron-down dd-arrow"></i>
        </a>
        <ul class="dropdown-menu">
          <li><a href="teams.html#t1" data-i18n="teams.t1_name">Τμήμα Εκμάθησης</a></li>
          <li><a href="teams.html#t2" data-i18n="teams.t2_name">Ακαδημία</a></li>
          <li><a href="teams.html#t3" data-i18n="teams.t3_name">Προαγωνιστικό</a></li>
          <li><a href="teams.html#t4" data-i18n="teams.t4_name">Αγωνιστικό &amp; Τεχνική</a></li>
          <li class="dropdown-divider"></li>
          <li><a href="https://www.coastalrowingclub.gr/" target="_blank" rel="noopener"><span data-i18n="coastal.title">Παράκτια Κωπηλασία</span> <i class="fas fa-external-link-alt" style="font-size:9px;opacity:.6;"></i></a></li>
        </ul>
      </li>

      <li><a href="champions.html" data-page="champions" data-i18n="nav.champions">Πρωταθλητές</a></li>
      <li><a href="social.html" data-page="social" data-i18n="nav.social">Κοινωνικό Έργο</a></li>
      <li><a href="news.html" data-page="news" data-i18n="nav.news">Νέα</a></li>
      <li><a href="contact.html" class="nav-cta" data-page="contact" data-i18n="nav.contact">Επικοινωνία</a></li>
    </ul>

    <button class="lang-toggle" id="langToggle" aria-label="Language">
      <span class="lang-current">EL</span>
      <span class="lang-sep">/</span>
      <span class="lang-other">EN</span>
    </button>
    <button class="hamburger" id="hamburger" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>
`;

const FOOTER_HTML = `
<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="nav-logo">
          <img src="logo.png" alt="Κ.Ο. Καλαμαριάς" class="logo-img" />
          <div class="logo-text">
            <span class="logo-main" data-i18n="logo.main">Κ.Ο. Καλαμαριάς</span>
            <span class="logo-sub" data-i18n="logo.sub">Κολυμβητικός Όμιλος</span>
          </div>
        </div>
        <p data-i18n="footer.brand_p">Από το 2008. 5x Πρωταθλητές Ελλάδας Τεχνικής Κολύμβησης. Μέλος Κ.Ο.Ε. & CMAS.</p>
      </div>
      <div class="footer-links">
        <h4 data-i18n="footer.links">Σύνδεσμοι</h4>
        <ul>
          <li><a href="index.html" data-i18n="nav.home">Αρχική</a></li>
          <li><a href="club.html" data-i18n="nav.club">Ο Όμιλος</a></li>
          <li><a href="teams.html" data-i18n="nav.teams">Τμήματα</a></li>
          <li><a href="champions.html" data-i18n="nav.champions">Πρωταθλητές</a></li>
          <li><a href="social.html" data-i18n="nav.social">Κοινωνικό Έργο</a></li>
          <li><a href="news.html" data-i18n="nav.news">Νέα</a></li>
        </ul>
      </div>
      <div class="footer-links">
        <h4 data-i18n="footer.teams">Τμήματα</h4>
        <ul>
          <li><a href="teams.html#t1" data-i18n="teams.t1_name">Τμήμα Εκμάθησης</a></li>
          <li><a href="teams.html#t2" data-i18n="teams.t2_name">Ακαδημία</a></li>
          <li><a href="teams.html#t3" data-i18n="teams.t3_name">Προαγωνιστικό</a></li>
          <li><a href="teams.html#t4" data-i18n="teams.t4_name">Αγωνιστικό / Τεχνική</a></li>
          <li><a href="https://www.coastalrowingclub.gr/" target="_blank" rel="noopener" data-i18n="coastal.title">Παράκτια Κωπηλασία</a> <i class="fas fa-external-link-alt" style="font-size:9px;opacity:.6;"></i></li>
        </ul>
      </div>
      <div class="footer-links">
        <h4 data-i18n="footer.contact">Επικοινωνία</h4>
        <ul>
          <li><i class="fas fa-phone"></i> <a href="tel:+306986412401">698 641 2401</a></li>
          <li><i class="fas fa-envelope"></i> <a href="mailto:info@kokalamarias.gr">info@kokalamarias.gr</a></li>
          <li><i class="fas fa-globe"></i> <a href="https://kokalamarias.gr">kokalamarias.gr</a></li>
          <li><i class="fas fa-map-marker-alt"></i> <a href="https://maps.app.goo.gl/c4yW2WLRyR9PnEtNA" target="_blank" rel="noopener"><span data-i18n="footer.location">Καλαμαριά, Θεσσαλονίκη</span></a></li>
        </ul>
        <div class="footer-social">
          <a href="https://www.facebook.com/KOKalamarias" target="_blank" rel="noopener" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
          <a href="https://www.instagram.com/kokalamarias/" target="_blank" rel="noopener" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          <a href="https://www.tiktok.com/@kokalamarias" target="_blank" rel="noopener" aria-label="TikTok"><i class="fab fa-tiktok"></i></a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p data-i18n="footer.copyright">&copy; 2026 Κολυμβητικός Όμιλος Καλαμαριάς. Όλα τα δικαιώματα διατηρούνται.</p>
    </div>
  </div>
</footer>
`;

// Inject στα placeholders
function injectPartials() {
  const navHolder = document.getElementById('site-nav');
  const footHolder = document.getElementById('site-footer');
  if (navHolder) navHolder.outerHTML = NAVBAR_HTML;
  if (footHolder) footHolder.outerHTML = FOOTER_HTML;

  // Active state per page
  const currentPage = document.body.dataset.page;
  if (currentPage) {
    document.querySelectorAll(`.nav-links a[data-page="${currentPage}"]`).forEach(a => {
      a.classList.add('active');
    });
  }
}

// Trigger early — πριν φορτώσει το translations apply
injectPartials();
