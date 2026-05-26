// =====================================================
//  Site Loader — Φορτώνει γενικά κείμενα από content/data/site.json
//  Επικαλύπτει τα defaults σε hero, about, coastal, contact, social
//  ΣΗΜΕΙΩΣΗ: τρέχει ΜΟΝΟ για EL. Για EN κρατούνται τα defaults
//  από translations.js (μέχρι να μετεγκαταστήσουμε και αυτά).
// =====================================================

(function () {
  let cache = null;

  async function apply() {
    if (!cache) {
      try {
        const res = await fetch("content/data/site.json", { cache: "no-cache" });
        cache = await res.json();
      } catch (err) {
        console.error("Failed to load site.json:", err);
        return;
      }
    }

    // Δεν παρεμβαίνουμε στην αγγλική έκδοση
    if (document.documentElement.lang === "en") return;

    // Helper: set text (or HTML) by data-i18n key
    function setByKey(key, html) {
      document.querySelectorAll(`[data-i18n="${key}"]`).forEach(el => {
        if (el.hasAttribute("data-i18n-html")) el.innerHTML = html;
        else el.textContent = html;
      });
    }

    // Hero
    if (cache.hero) {
      if (cache.hero.badge) setByKey("hero.badge", cache.hero.badge);
      if (cache.hero.tagline) setByKey("hero.tagline", cache.hero.tagline);
    }

    // About
    if (cache.about) {
      ["title", "subtitle", "p1", "p2", "p3"].forEach(k => {
        const v = cache.about[k];
        if (v) setByKey(`about.${k}`, v);
      });
    }

    // Coastal
    if (cache.coastal) {
      if (cache.coastal.badge) setByKey("coastal.badge", cache.coastal.badge);
      if (cache.coastal.description) setByKey("coastal.p", cache.coastal.description);
      if (cache.coastal.cta) setByKey("coastal.cta", cache.coastal.cta);
    }

    // Contact / Social: ενημερώνει links σε footer + contact page
    if (cache.contact) {
      // Email
      document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
        a.href = "mailto:" + cache.contact.email;
        a.textContent = cache.contact.email;
      });
      // Phone
      const phoneClean = cache.contact.phone.replace(/\s+/g, "");
      document.querySelectorAll('a[href^="tel:"]').forEach(a => {
        a.href = "tel:+30" + phoneClean;
        a.textContent = cache.contact.phone;
      });
      // Maps
      if (cache.contact.maps_url) {
        document.querySelectorAll('a[href*="maps.app.goo.gl"], a[href*="maps.google"]').forEach(a => {
          a.href = cache.contact.maps_url;
        });
      }
    }

    if (cache.social) {
      const map = { facebook: cache.social.facebook, instagram: cache.social.instagram, tiktok: cache.social.tiktok };
      Object.entries(map).forEach(([net, url]) => {
        if (!url) return;
        document.querySelectorAll(`a[aria-label="${net.charAt(0).toUpperCase() + net.slice(1)}"]`).forEach(a => {
          a.href = url;
        });
      });
    }
  }

  // Εκκίνηση: μετά τα translations & partials, ώστε τα data-i18n να υπάρχουν
  document.addEventListener("DOMContentLoaded", () => setTimeout(apply, 100));

  // Όταν αλλάζει γλώσσα → ή αφαίρεση overrides (αν EN) ή reapply (αν EL)
  const obs = new MutationObserver(() => setTimeout(apply, 50));
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();
