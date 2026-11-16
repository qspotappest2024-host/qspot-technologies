/**
 * QSpot Technologies — French / English layer for the corporate site.
 *
 * Same scheme as the QSpot Marketplace website (www.qspotmarketplace.com): the
 * English text is the markup itself (what a crawler, or a reader with JS off,
 * sees) and the page carries its French beside it in a dictionary. Elements
 * marked data-i18n="key" take dict[key] when the page is French.
 *
 *   data-i18n="key"                           -> innerHTML = dict[key]
 *   data-i18n-attr="aria-label:key;href:key"  -> attributes
 *   data-langbar                              -> the "Français | English" switcher
 *   dict.doc_title                            -> document.title
 *
 * innerHTML is deliberate: the dictionaries are the page's own constant text
 * (some entries carry <strong>/<span>), never user or server data.
 *
 * Language choice: data-qs-lang on <html> (static /fr/ page) -> ?lang=fr|en
 * (remembered) -> remembered choice -> browser language. localStorage is a
 * per-viewer convenience only and every access is guarded.
 *
 * LINKS IN A DICTIONARY MUST BE ABSOLUTE. The French page is served from /fr/, so a
 * relative href set here would resolve to /fr/<path> and 404. Every URL below is a
 * full https:// URL; same-page anchors (#contact) are the only short form allowed.
 *
 * The build step (tools/build-i18n.cjs) applies this same French at deploy time and
 * writes the static page /fr/index.html, so search engines index real French.
 */
(function () {
    'use strict';

    var KEY = 'qspot_lang';
    var SQUARE_EN = 'qspot-marketplace-square.svg';
    var SQUARE_FR = 'qspot-marche-fr-square.svg';

    function ok(v) { return v === 'fr' || v === 'en'; }

    function detect() {
        var l = null;
        // The static French page (/fr/, built by tools/build-i18n.cjs) carries
        // data-qs-lang="fr": the URL decides the language, and the choice is remembered.
        var forced = document.documentElement.getAttribute('data-qs-lang');
        if (ok(forced)) {
            try { localStorage.setItem(KEY, forced); } catch (e) { /* private mode */ }
            return forced;
        }
        try { l = new URLSearchParams(location.search).get('lang'); } catch (e) { l = null; }
        if (ok(l)) {
            try { localStorage.setItem(KEY, l); } catch (e) { /* private mode */ }
            return l;
        }
        try { l = localStorage.getItem(KEY); } catch (e) { l = null; }
        if (ok(l)) return l;
        return (navigator.language || '').toLowerCase().indexOf('fr') === 0 ? 'fr' : 'en';
    }

    // French for the chrome every page shares (menu, footer, outbound links).
    // A page's own dictionary overrides these keys.
    var COMMON_FR = {
        skip: "Passer au contenu",
        brand_aria: "QSpot Technologies — accueil",
        toggle_dark: "Basculer le mode sombre", toggle_menu: "Ouvrir ou fermer le menu",
        theme_to_light: "Passer au mode clair", theme_to_dark: "Passer au mode sombre",
        nav_mission: "Mission", nav_build: "Nos produits", nav_approach: "Approche", nav_contact: "Contact",
        nav_cta: "Visiter QSpot Marché ↗",
        mkt_name: "QSpot Marché", live_map: "Carte en direct",
        href_mkt: "https://www.qspotmarketplace.com/fr/",
        href_map: "https://www.qspotmarketplace.com/fr/map.html",
        href_premium: "https://www.qspotmarketplace.com/web/premium.html?lang=fr",
        href_privacy: "https://www.qspotmarketplace.com/web/confidentialite.html?lang=fr",
        href_terms: "https://www.qspotmarketplace.com/web/conditions.html?lang=fr",
        ft_product: "Produit", ft_company: "Entreprise",
        ft_mission: "Mission", ft_contact: "Contact",
        ft_privacy: "Politique de confidentialité", ft_terms: "Conditions d'utilisation",
        ft_copy: '&copy; 2026 QSpot Technologies Inc. Tous droits réservés. &middot; QSpot&trade; est une marque de commerce de QSpot Technologies Inc.',
        ft_bc: "Colombie-Britannique, Canada"
    };

    var lang = detect();

    // The "QSpot Marketplace" square lockup becomes the French "QSpot Marché" one.
    // Same box size in both languages; the images are decorative (alt="") so only the
    // source changes.
    function swapLogos() {
        if (lang !== 'fr') return;
        var imgs = document.querySelectorAll('img');
        for (var i = 0; i < imgs.length; i++) {
            var src = imgs[i].getAttribute('src') || '';
            if (src.indexOf(SQUARE_EN) !== -1) imgs[i].setAttribute('src', src.replace(SQUARE_EN, SQUARE_FR));
        }
    }

    // Where the language switch goes. The page lists both URLs as
    // <link rel="alternate" hreflang> (added at deploy): French goes to /fr/, English goes
    // to / with ?lang=en so the choice is remembered. Without the alternates (local file,
    // preview) it falls back to ?lang= on the current URL.
    function switchHref(code) {
        var alt = document.querySelector('link[rel="alternate"][hreflang="' + (code === 'fr' ? 'fr-CA' : 'en-CA') + '"]');
        if (alt) {
            try {
                var t = new URL(alt.getAttribute('href'), location.href);
                return t.pathname + (code === 'en' ? '?lang=en' : '') + location.hash;
            } catch (e) { /* fall through */ }
        }
        var u = new URL(location.href);
        u.searchParams.set('lang', code);
        return u.pathname + u.search + u.hash;
    }

    function langbar() {
        var bars = document.querySelectorAll('[data-langbar]');
        for (var i = 0; i < bars.length; i++) {
            bars[i].innerHTML = lang === 'fr'
                ? '<span class="cur" lang="fr">Français</span> &nbsp;|&nbsp; <a href="' + switchHref('en') + '" lang="en" hreflang="en">English</a>'
                : '<a href="' + switchHref('fr') + '" lang="fr" hreflang="fr">Français</a> &nbsp;|&nbsp; <span class="cur" lang="en">English</span>';
        }
    }

    // Small "FR | EN" pill in the top bar, between the dark-mode button and the menu
    // button (shown on phones only — CSS hides it on desktop, where the full switcher
    // sits in the menu). Injected here so the page needs no extra markup. Both codes
    // show, the current language highlighted; tapping it switches to the other one.
    function langButton() {
        var burger = document.querySelector('.nav-tools .burger');
        if (!burger || document.querySelector('.nav-lang-btn')) return;
        var a = document.createElement('a');
        a.className = 'nav-lang-btn';
        a.href = switchHref(lang === 'fr' ? 'en' : 'fr');
        a.setAttribute('hreflang', lang === 'fr' ? 'en' : 'fr');
        a.setAttribute('aria-label', lang === 'fr' ? 'Switch to English' : 'Passer au français');
        a.innerHTML = '<span' + (lang === 'fr' ? ' class="on"' : '') + '>FR</span>' +
                      '<span' + (lang === 'fr' ? '' : ' class="on"') + '>EN</span>';
        burger.parentNode.insertBefore(a, burger);
    }

    /** Applies the page's French dictionary. No-op in English apart from the switcher. */
    function apply(page) {
        document.documentElement.lang = lang === 'fr' ? 'fr-CA' : 'en';
        if (lang === 'fr') {
            var dict = {}, key;
            for (key in COMMON_FR) dict[key] = COMMON_FR[key];
            for (key in (page || {})) dict[key] = page[key];
            var els = document.querySelectorAll('[data-i18n]');
            for (var i = 0; i < els.length; i++) {
                var v = dict[els[i].getAttribute('data-i18n')];
                if (v != null) els[i].innerHTML = v;
            }
            var attrs = document.querySelectorAll('[data-i18n-attr]');
            for (var j = 0; j < attrs.length; j++) {
                var pairs = attrs[j].getAttribute('data-i18n-attr').split(';');
                for (var k = 0; k < pairs.length; k++) {
                    var kv = pairs[k].split(':');
                    var av = dict[kv[1]];
                    if (kv[0] && av != null) attrs[j].setAttribute(kv[0], av);
                }
            }
            if (dict.doc_title) document.title = dict.doc_title;
            document.body.classList.add('lang-fr');
        }
        swapLogos();
        langbar();
        langButton();
    }

    window.QSLang = {
        lang: lang,
        isFr: lang === 'fr',
        locale: lang === 'fr' ? 'fr-CA' : 'en-CA',
        apply: apply,
        /** pick(en, fr): the string for the current language. */
        pick: function (en, fr) { return lang === 'fr' ? fr : en; }
    };
})();
