/**
 * i18n.js — Translations file
 *
 * Languages: English (en) · Arabic (ar) · German (de) · Turkish (tr) · French (fr)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WANT TO ADD YOUR LANGUAGE? It's easy — no build tools, no setup.
 *
 * 1. Copy the template block at the bottom of this file
 * 2. Replace 'xx' with your ISO 639-1 language code (e.g. 'es', 'ja', 'pt')
 * 3. Translate every string value — keep the keys exactly as they are
 * 4. Set dir: 'rtl' if your language reads right-to-left (Hebrew, Persian, etc.)
 * 5. Set a suitable fontFamily if the default Inter font doesn't cover your script
 * 6. In index.html, add your <option> to the <select id="langSelector"> element
 * ─────────────────────────────────────────────────────────────────────────────
 * i will review it and accpet the pull req.
 */

window.I18N = {

  ar: {
    dir: 'rtl',
    lang: 'ar',
    fontFamily: "'Cairo', sans-serif",

    // Header
    searchPlaceholder: 'البحث في أغانيك المحلية والمحملة...',
    eqBtn: 'صوت جبار (Bass Boost)',
    eqBtnOff: 'صوت عادي',
    miniPlayerBtn: '🗔 نافذة مصغرة',
    refreshBtn: 'تحديث المكتبة',

    // Sidebar nav
    navHome: 'الرئيسية',
    navExplore: 'استكشاف',
    navLibrary: 'المكتبة المحلية',
    sidebarPlaylistsLabel: 'قوائم التشغيل والمفضلة',
    playlistDownloads: 'الأغاني المحملة (320kbps)',
    playlistFavorites: 'الأغاني المفضلة',

    // Home
    chipAll: 'الكل',
    chip320k: 'أعلى جودة (320kbps)',
    chipRecent: 'المضافة حديثاً',
    chipFavs: 'المفضلة ❤️',
    heroTitle: 'مرحباً بك في يوتيوب ميوزك المحلي 🔥',
    heroSubtitle: 'أغانيك المحملة عبر إضافة كروم تصبح متاحة فوراً بأعلى جودة MP3 320kbps وبث مباشر فائق السرعة.',
    statLabel: 'أغنية محملة',
    sectionAllTracks: 'جميع الأغاني المحملة',

    // Explore
    exploreTitle: 'استكشاف التصنيفات والمشاعر 🎧',
    exploreSubtitle: 'تصفح أغانيك المحلية المحملة حسب الطابع والمود',
    moodEnergetic: 'حماسي وراب',
    moodChill: 'روقان وهدوء',
    moodRemix: 'ريمكس وSlowed',
    moodClassic: 'كلاسيك وتراث',
    exploreSectionDefault: 'الأغاني المقترحة',
    exploreSectionFiltered: 'الأغاني المصنفة كـ',

    // Library
    libraryTitle: 'المكتبة المحلية الشاملة 📂',
    librarySubtitle: 'إدارة واستعراض تفاصيل ملفاتك الصوتية المحملة بوضوح 320kbps',
    libColNum: '#',
    libColTitle: 'العنوان والأغنية',
    libColArtist: 'الفنان',
    libColAlbum: 'الألبوم',
    libColSize: 'الحجم',
    libColQuality: 'الجودة',
    libColPlay: 'تشغيل',
    libEmpty: 'لا توجد أغاني محملة بالمكتبة بعد.',
    libDefaultAlbum: 'مكتبتي المحلية',

    // Downloads
    downloadsPlaylistBadge: 'قائمة تشغيل محلي',
    downloadsTitle: 'الأغاني المحملة (320kbps)',
    playAllBtn: '▶ تشغيل الكل',
    shuffleBtn: '🔀 خلط عشوائي',

    // Favorites
    favPlaylistBadge: 'قائمة تشغيل شخصية',
    favTitle: 'الأغاني المفضلة',
    playFavsBtn: '▶ تشغيل المفضلة',

    // Queue
    queueTitle: 'قائمة الانتظار (Queue)',

    // Player
    playerDefaultTitle: 'اختر أغنية للتشغيل',
    playerDefaultArtist: 'يوتيوب ميوزك المحلي',

    // Empty state
    emptyGrid: '🎵 لا توجد أغاني مطابقة للشرط حالياً.',
    loadingTracks: 'جاري تحميل الأغاني... ⏳',

    // Language selector label
    langLabel: 'اللغة',
  },

  en: {
    dir: 'ltr',
    lang: 'en',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",

    searchPlaceholder: 'Search your local music library...',
    eqBtn: '🔥 Bass Boost (ON)',
    eqBtnOff: 'Normal Sound',
    miniPlayerBtn: '🗔 Mini Window',
    refreshBtn: 'Refresh Library',

    navHome: 'Home',
    navExplore: 'Explore',
    navLibrary: 'Local Library',
    sidebarPlaylistsLabel: 'Playlists & Favorites',
    playlistDownloads: 'Downloaded Songs (320kbps)',
    playlistFavorites: 'Favorite Songs',

    chipAll: 'All',
    chip320k: 'Top Quality (320kbps)',
    chipRecent: 'Recently Added',
    chipFavs: 'Favorites ❤️',
    heroTitle: 'Welcome to Local YouTube Music 🔥',
    heroSubtitle: 'Songs downloaded via the Chrome extension are instantly available at the highest MP3 320kbps quality.',
    statLabel: 'downloaded tracks',
    sectionAllTracks: 'All Downloaded Songs',

    exploreTitle: 'Explore Moods & Genres 🎧',
    exploreSubtitle: 'Browse your local library by mood and vibe',
    moodEnergetic: 'Energetic & Rap',
    moodChill: 'Chill & Calm',
    moodRemix: 'Remix & Slowed',
    moodClassic: 'Classic & Heritage',
    exploreSectionDefault: 'Suggested Tracks',
    exploreSectionFiltered: 'Tracks tagged as',

    libraryTitle: 'Full Local Library 📂',
    librarySubtitle: 'Manage and browse your downloaded audio files at 320kbps quality',
    libColNum: '#',
    libColTitle: 'Title',
    libColArtist: 'Artist',
    libColAlbum: 'Album',
    libColSize: 'Size',
    libColQuality: 'Quality',
    libColPlay: 'Play',
    libEmpty: 'No songs in the library yet.',
    libDefaultAlbum: 'My Local Library',

    downloadsPlaylistBadge: 'Local Playlist',
    downloadsTitle: 'Downloaded Songs (320kbps)',
    playAllBtn: '▶ Play All',
    shuffleBtn: '🔀 Shuffle',

    favPlaylistBadge: 'Personal Playlist',
    favTitle: 'Favorite Songs',
    playFavsBtn: '▶ Play Favorites',

    queueTitle: 'Queue',

    playerDefaultTitle: 'Choose a song to play',
    playerDefaultArtist: 'Local YouTube Music',

    emptyGrid: '🎵 No matching tracks found.',
    loadingTracks: 'Loading tracks... ⏳',

    langLabel: 'Language',
  },

  de: {
    dir: 'ltr',
    lang: 'de',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",

    searchPlaceholder: 'Lokale Musikbibliothek durchsuchen...',
    eqBtn: '🔥 Bass Boost (AN)',
    eqBtnOff: 'Normaler Klang',
    miniPlayerBtn: '🗔 Mini-Fenster',
    refreshBtn: 'Bibliothek aktualisieren',

    navHome: 'Startseite',
    navExplore: 'Entdecken',
    navLibrary: 'Lokale Bibliothek',
    sidebarPlaylistsLabel: 'Wiedergabelisten & Favoriten',
    playlistDownloads: 'Heruntergeladene Titel (320kbps)',
    playlistFavorites: 'Lieblingstitel',

    chipAll: 'Alle',
    chip320k: 'Höchste Qualität (320kbps)',
    chipRecent: 'Zuletzt hinzugefügt',
    chipFavs: 'Favoriten ❤️',
    heroTitle: 'Willkommen bei lokalem YouTube Music 🔥',
    heroSubtitle: 'Über die Chrome-Erweiterung heruntergeladene Songs stehen sofort in höchster MP3-Qualität 320kbps bereit.',
    statLabel: 'heruntergeladene Titel',
    sectionAllTracks: 'Alle heruntergeladenen Titel',

    exploreTitle: 'Stimmungen & Genres entdecken 🎧',
    exploreSubtitle: 'Durchsuche deine lokale Bibliothek nach Stimmung und Stil',
    moodEnergetic: 'Energetisch & Rap',
    moodChill: 'Entspannt & Ruhig',
    moodRemix: 'Remix & Slowed',
    moodClassic: 'Klassisch & Tradition',
    exploreSectionDefault: 'Vorgeschlagene Titel',
    exploreSectionFiltered: 'Titel mit Tag',

    libraryTitle: 'Vollständige lokale Bibliothek 📂',
    librarySubtitle: 'Verwalte und durchsuche deine heruntergeladenen Audiodateien in 320kbps',
    libColNum: '#',
    libColTitle: 'Titel',
    libColArtist: 'Künstler',
    libColAlbum: 'Album',
    libColSize: 'Größe',
    libColQuality: 'Qualität',
    libColPlay: 'Abspielen',
    libEmpty: 'Noch keine Titel in der Bibliothek.',
    libDefaultAlbum: 'Meine lokale Bibliothek',

    downloadsPlaylistBadge: 'Lokale Wiedergabeliste',
    downloadsTitle: 'Heruntergeladene Titel (320kbps)',
    playAllBtn: '▶ Alle abspielen',
    shuffleBtn: '🔀 Zufallswiedergabe',

    favPlaylistBadge: 'Persönliche Wiedergabeliste',
    favTitle: 'Lieblingstitel',
    playFavsBtn: '▶ Favoriten abspielen',

    queueTitle: 'Warteschlange',

    playerDefaultTitle: 'Wähle einen Titel zum Abspielen',
    playerDefaultArtist: 'Lokales YouTube Music',

    emptyGrid: '🎵 Keine passenden Titel gefunden.',
    loadingTracks: 'Titel werden geladen... ⏳',

    langLabel: 'Sprache',
  },

  tr: {
    dir: 'ltr',
    lang: 'tr',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",

    searchPlaceholder: 'Yerel müzik kitaplığında ara...',
    eqBtn: '🔥 Bas Güçlendirme (AÇIK)',
    eqBtnOff: 'Normal Ses',
    miniPlayerBtn: '🗔 Mini Pencere',
    refreshBtn: 'Kitaplığı Yenile',

    navHome: 'Ana Sayfa',
    navExplore: 'Keşfet',
    navLibrary: 'Yerel Kitaplık',
    sidebarPlaylistsLabel: 'Oynatma Listeleri & Favoriler',
    playlistDownloads: 'İndirilen Şarkılar (320kbps)',
    playlistFavorites: 'Favori Şarkılar',

    chipAll: 'Tümü',
    chip320k: 'En Yüksek Kalite (320kbps)',
    chipRecent: 'Son Eklenenler',
    chipFavs: 'Favoriler ❤️',
    heroTitle: 'Yerel YouTube Music\'e Hoş Geldiniz 🔥',
    heroSubtitle: 'Chrome eklentisi aracılığıyla indirilen şarkılar anında en yüksek MP3 320kbps kalitesinde kullanılabilir.',
    statLabel: 'indirilen parça',
    sectionAllTracks: 'Tüm İndirilen Şarkılar',

    exploreTitle: 'Ruh Halleri & Türleri Keşfet 🎧',
    exploreSubtitle: 'Yerel kitaplığınızı ruh haline ve tarzına göre gezin',
    moodEnergetic: 'Enerjik & Rap',
    moodChill: 'Sakin & Huzurlu',
    moodRemix: 'Remix & Yavaşlatılmış',
    moodClassic: 'Klasik & Gelenek',
    exploreSectionDefault: 'Önerilen Parçalar',
    exploreSectionFiltered: 'Etiketli parçalar:',

    libraryTitle: 'Tam Yerel Kitaplık 📂',
    librarySubtitle: '320kbps kalitesinde indirilen ses dosyalarınızı yönetin ve göz atın',
    libColNum: '#',
    libColTitle: 'Başlık',
    libColArtist: 'Sanatçı',
    libColAlbum: 'Albüm',
    libColSize: 'Boyut',
    libColQuality: 'Kalite',
    libColPlay: 'Oynat',
    libEmpty: 'Kitaplıkta henüz şarkı yok.',
    libDefaultAlbum: 'Yerel Kitaplığım',

    downloadsPlaylistBadge: 'Yerel Oynatma Listesi',
    downloadsTitle: 'İndirilen Şarkılar (320kbps)',
    playAllBtn: '▶ Tümünü Oynat',
    shuffleBtn: '🔀 Karıştır',

    favPlaylistBadge: 'Kişisel Oynatma Listesi',
    favTitle: 'Favori Şarkılar',
    playFavsBtn: '▶ Favorileri Oynat',

    queueTitle: 'Sıra',

    playerDefaultTitle: 'Oynatmak için bir şarkı seçin',
    playerDefaultArtist: 'Yerel YouTube Music',

    emptyGrid: '🎵 Eşleşen parça bulunamadı.',
    loadingTracks: 'Parçalar yükleniyor... ⏳',

    langLabel: 'Dil',
  },

  fr: {
    dir: 'ltr',
    lang: 'fr',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",

    searchPlaceholder: 'Rechercher dans votre bibliothèque locale...',
    eqBtn: '🔥 Basse Boost (ACTIVÉ)',
    eqBtnOff: 'Son Normal',
    miniPlayerBtn: '🗔 Mini Fenêtre',
    refreshBtn: 'Actualiser la bibliothèque',

    navHome: 'Accueil',
    navExplore: 'Explorer',
    navLibrary: 'Bibliothèque locale',
    sidebarPlaylistsLabel: 'Listes de lecture & Favoris',
    playlistDownloads: 'Titres téléchargés (320kbps)',
    playlistFavorites: 'Titres favoris',

    chipAll: 'Tout',
    chip320k: 'Meilleure qualité (320kbps)',
    chipRecent: 'Récemment ajoutés',
    chipFavs: 'Favoris ❤️',
    heroTitle: 'Bienvenue sur YouTube Music local 🔥',
    heroSubtitle: 'Les chansons téléchargées via l\'extension Chrome sont disponibles immédiatement à la meilleure qualité MP3 320kbps.',
    statLabel: 'titres téléchargés',
    sectionAllTracks: 'Tous les titres téléchargés',

    exploreTitle: 'Explorer les ambiances & genres 🎧',
    exploreSubtitle: 'Parcourez votre bibliothèque locale par ambiance et style',
    moodEnergetic: 'Énergique & Rap',
    moodChill: 'Calme & Relaxant',
    moodRemix: 'Remix & Ralenti',
    moodClassic: 'Classique & Patrimoine',
    exploreSectionDefault: 'Titres suggérés',
    exploreSectionFiltered: 'Titres classés comme',

    libraryTitle: 'Bibliothèque locale complète 📂',
    librarySubtitle: 'Gérez et parcourez vos fichiers audio téléchargés en qualité 320kbps',
    libColNum: '#',
    libColTitle: 'Titre',
    libColArtist: 'Artiste',
    libColAlbum: 'Album',
    libColSize: 'Taille',
    libColQuality: 'Qualité',
    libColPlay: 'Lire',
    libEmpty: 'Aucun titre dans la bibliothèque pour l\'instant.',
    libDefaultAlbum: 'Ma bibliothèque locale',

    downloadsPlaylistBadge: 'Liste de lecture locale',
    downloadsTitle: 'Titres téléchargés (320kbps)',
    playAllBtn: '▶ Tout lire',
    shuffleBtn: '🔀 Aléatoire',

    favPlaylistBadge: 'Liste de lecture personnelle',
    favTitle: 'Titres favoris',
    playFavsBtn: '▶ Lire les favoris',

    queueTitle: 'File d\'attente',

    playerDefaultTitle: 'Choisissez un titre à lire',
    playerDefaultArtist: 'YouTube Music local',

    emptyGrid: '🎵 Aucun titre correspondant trouvé.',
    loadingTracks: 'Chargement des titres... ⏳',

    langLabel: 'Langue',
  }
};


/**
 * applyLanguage — applies the selected language to the DOM
 * Saves the choice to localStorage and updates html dir/lang attributes
 */
window.applyLanguage = function (langCode) {
  const t = window.I18N[langCode];
  if (!t) return;

  localStorage.setItem('yt_music_lang', langCode);

  const html = document.documentElement;
  html.setAttribute('lang', t.lang);
  html.setAttribute('dir', t.dir);
  document.body.style.fontFamily = t.fontFamily;

  // Apply translations to all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = t[key];
      } else {
        el.textContent = t[key];
      }
    }
  });

  // Sync the dropdown
  const selector = document.getElementById('langSelector');
  if (selector) selector.value = langCode;
};

/**
 * getCurrentLang — returns the saved language, or English as default
 */
window.getCurrentLang = function () {
  return localStorage.getItem('yt_music_lang') || 'en';
};

/**
 * t(key) — helper to get a translated string in the current language
 */
window.t = function (key) {
  const lang = window.getCurrentLang();
  return (window.I18N[lang] && window.I18N[lang][key]) || window.I18N['en'][key] || key;
};


// =============================================================================
// LANGUAGE TEMPLATE — copy this block to add a new language
// =============================================================================
//
// window.I18N['xx'] = {         // replace 'xx' with ISO 639-1 code (e.g. 'es')
//   dir: 'ltr',                 // 'rtl' for Hebrew, Persian, Urdu — 'ltr' for everything else
//   lang: 'xx',
//   fontFamily: "'Inter', 'Segoe UI', sans-serif",
//
//   searchPlaceholder: '',
//   eqBtn: '',
//   eqBtnOff: '',
//   miniPlayerBtn: '',
//   refreshBtn: '',
//
//   navHome: '',
//   navExplore: '',
//   navLibrary: '',
//   sidebarPlaylistsLabel: '',
//   playlistDownloads: '',
//   playlistFavorites: '',
//
//   chipAll: '',
//   chip320k: '',
//   chipRecent: '',
//   chipFavs: '',
//   heroTitle: '',
//   heroSubtitle: '',
//   statLabel: '',
//   sectionAllTracks: '',
//
//   exploreTitle: '',
//   exploreSubtitle: '',
//   moodEnergetic: '',
//   moodChill: '',
//   moodRemix: '',
//   moodClassic: '',
//   exploreSectionDefault: '',
//   exploreSectionFiltered: '',
//
//   libraryTitle: '',
//   librarySubtitle: '',
//   libColNum: '#',
//   libColTitle: '',
//   libColArtist: '',
//   libColAlbum: '',
//   libColSize: '',
//   libColQuality: '',
//   libColPlay: '',
//   libEmpty: '',
//   libDefaultAlbum: '',
//
//   downloadsPlaylistBadge: '',
//   downloadsTitle: '',
//   playAllBtn: '',
//   shuffleBtn: '',
//
//   favPlaylistBadge: '',
//   favTitle: '',
//   playFavsBtn: '',
//
//   queueTitle: '',
//
//   playerDefaultTitle: '',
//   playerDefaultArtist: '',
//
//   emptyGrid: '',
//   loadingTracks: '',
//
//   langLabel: '',
// };
//
// Then in index.html, add inside <select id="langSelector">:
//   <option value="xx">🇽🇽 Language Name</option>
// =============================================================================
