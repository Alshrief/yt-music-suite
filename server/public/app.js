document.addEventListener('DOMContentLoaded', () => {
  // 1️⃣ عناصر DOM المشغل والصفحات
  const audioPlayer = document.getElementById('audioPlayer');
  
  // أزرار التحكم بالتشغيل
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const shuffleBtn = document.getElementById('shuffleBtn');
  const repeatBtn = document.getElementById('repeatBtn');
  const likeBtn = document.getElementById('likeBtn');
  const heartIcon = document.getElementById('heartIcon');

  const playerCover = document.getElementById('playerCover');
  const playerTitle = document.getElementById('playerTitle');
  const playerArtist = document.getElementById('playerArtist');

  const progressContainer = document.getElementById('progressContainer');
  const progressFilled = document.getElementById('progressFilled');
  const progressHandle = document.getElementById('progressHandle');
  const timeDisplay = document.getElementById('timeDisplay');

  const volumeSlider = document.getElementById('volumeSlider');
  const volumeBtn = document.getElementById('volumeBtn');
  const volHighIcon = document.getElementById('volHighIcon');
  const volMuteIcon = document.getElementById('volMuteIcon');

  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const refreshTracksBtn = document.getElementById('refreshTracksBtn');
  const eqToggleBtn = document.getElementById('eqToggleBtn');
  const brandLogoBtn = document.getElementById('brandLogoBtn');

  const pipBtn = document.getElementById('pipBtn');
  const popoutMiniPlayerBtn = document.getElementById('popoutMiniPlayerBtn');
  const toggleQueueBtn = document.getElementById('toggleQueueBtn');
  const queueDrawer = document.getElementById('queueDrawer');
  const closeQueueBtn = document.getElementById('closeQueueBtn');
  const queueList = document.getElementById('queueList');

  // عناصر الشاشات والقوائم
  const totalTracksCount = document.getElementById('totalTracksCount');
  const favCountBadge = document.getElementById('favCountBadge');

  // 2️⃣ حالة المشغل والتنقل (Player & Router State)
  let tracks = [];
  let currentTrackIndex = -1;
  let isShuffle = false;
  let repeatState = 0;
  let lastVolume = 0.8;
  let favorites = JSON.parse(localStorage.getItem('yt_music_favs') || '[]');

  // Web Audio Equalizer Engine
  let audioCtx = null;
  let sourceNode = null;
  let bassFilter = null;
  let trebleFilter = null;
  let isEqActive = true;

  function initWebAudioEngine() {
    if (audioCtx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      sourceNode = audioCtx.createMediaElementSource(audioPlayer);

      bassFilter = audioCtx.createBiquadFilter();
      bassFilter.type = 'lowshelf';
      bassFilter.frequency.value = 60;
      bassFilter.gain.value = 6.5;

      trebleFilter = audioCtx.createBiquadFilter();
      trebleFilter.type = 'highshelf';
      trebleFilter.frequency.value = 12000;
      trebleFilter.gain.value = 4.0;

      sourceNode.connect(bassFilter);
      bassFilter.connect(trebleFilter);
      trebleFilter.connect(audioCtx.destination);
    } catch (e) {
      console.warn('تعذر تهيئة Web Audio EQ:', e);
    }
  }

  eqToggleBtn.addEventListener('click', () => {
    isEqActive = !isEqActive;
    if (bassFilter && trebleFilter) {
      bassFilter.gain.value = isEqActive ? 6.5 : 0;
      trebleFilter.gain.value = isEqActive ? 4.0 : 0;
    }
    eqToggleBtn.style.opacity = isEqActive ? '1' : '0.5';
    eqToggleBtn.querySelector('span').innerText = isEqActive ? 'صوت جبار (Bass Boost)' : 'صوت عادي';
  });

  // 3️⃣ موجه الصفحات التفاعلي (Single Page Router)
  function switchView(targetView) {
    document.querySelectorAll('.page-view').forEach(view => {
      view.style.display = 'none';
      view.classList.remove('active-view');
    });

    document.querySelectorAll('.nav-item, .playlist-item').forEach(item => {
      item.classList.remove('active');
    });

    const activeNav = document.querySelector(`[data-view="${targetView}"]`);
    if (activeNav) activeNav.classList.add('active');

    const targetEl = document.getElementById(`view-${targetView}`);
    if (targetEl) {
      targetEl.style.display = 'block';
      targetEl.classList.add('active-view');
    }

    // تحديث المحتوى الخاص بكل صفحة
    if (targetView === 'home') renderHomeView();
    if (targetView === 'explore') renderExploreView();
    if (targetView === 'library') renderLibraryView();
    if (targetView === 'downloads') renderDownloadsView();
    if (targetView === 'favorites') renderFavoritesView();
  }

  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const view = btn.dataset.view;
      switchView(view);
    });
  });

  brandLogoBtn.addEventListener('click', () => switchView('home'));

  // 4️⃣ جلب مكتبة الأغاني من السيرفر
  async function loadTracks() {
    try {
      const response = await fetch('/api/tracks');
      const data = await response.json();
      
      tracks = data.tracks || [];
      totalTracksCount.innerText = tracks.length;
      favCountBadge.innerText = favorites.length;

      // تحديث جميع الشاشات
      renderHomeView();
      renderQueueList();

      if (tracks.length > 0 && currentTrackIndex === -1) {
        setTrack(0, false);
      }
    } catch (error) {
      console.error('خطأ في جلب المكتبة:', error);
    }
  }

  // 5️⃣ رندر الشاشات الخمس الكبرى (Render Views)

  // أ. الصفحة الرئيسية (Home View)
  function renderHomeView() {
    const homeGrid = document.getElementById('homeTracksGrid');
    renderGrid(homeGrid, tracks);
  }

  // ب. صفحة استكشاف (Explore View)
  function renderExploreView(filterMood = null) {
    const exploreGrid = document.getElementById('exploreTracksGrid');
    const titleEl = document.getElementById('exploreSectionTitle');

    let filtered = tracks;
    if (filterMood) {
      titleEl.innerText = `الأغاني المصنفة كـ "${filterMood}"`;
      filtered = tracks.filter(t => 
        t.title.includes(filterMood) || 
        t.artist.includes(filterMood) ||
        (filterMood === 'حماسي' && (t.title.includes('Slowed') || t.title.includes('Remix') || t.title.includes('⚡'))) ||
        (filterMood === 'هادئ' && (!t.title.includes('Remix') && !t.title.includes('Slowed'))) ||
        (filterMood === 'ريمكس' && (t.title.includes('Remix') || t.title.includes('Slowed') || t.title.includes('Reverb')))
      );
      if (filtered.length === 0) filtered = tracks; // Fallback
    } else {
      titleEl.innerText = 'أحدث مقاطع الاستكشاف المحلية';
    }

    renderGrid(exploreGrid, filtered);
  }

  document.querySelectorAll('.mood-card').forEach(card => {
    card.addEventListener('click', () => {
      const mood = card.dataset.mood;
      renderExploreView(mood);
    });
  });

  // جـ. صفحة المكتبة التفصيلية (Library View Table)
  function renderLibraryView() {
    const tbody = document.getElementById('libraryTableBody');
    tbody.innerHTML = '';

    if (tracks.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:#aaa;">لا توجد أغاني محملة بالمكتبة بعد.</td></tr>`;
      return;
    }

    tracks.forEach((track, i) => {
      const tr = document.createElement('tr');
      const sizeMB = (track.size / (1024 * 1024)).toFixed(1);

      tr.innerHTML = `
        <td>${i + 1}</td>
        <td style="font-weight:700; color:#fff;">${track.title}</td>
        <td style="color:#aaa;">${track.artist}</td>
        <td style="color:#aaa;">${track.album || 'مكتبتي المحلية'}</td>
        <td style="color:#aaa;">${sizeMB} MB</td>
        <td><span class="quality-badge">320kbps</span></td>
        <td>
          <button class="icon-btn" style="color:#ff0000;" title="تشغيل">▶</button>
        </td>
      `;

      tr.addEventListener('click', () => setTrack(i, true));
      tbody.appendChild(tr);
    });
  }

  // د. صفحة التنزيلات 320kbps (Downloads View)
  function renderDownloadsView() {
    const downloadsGrid = document.getElementById('downloadsTracksGrid');
    const statsEl = document.getElementById('downloadsPlaylistStats');

    const totalSize = tracks.reduce((acc, t) => acc + (t.size || 0), 0);
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(1);

    statsEl.innerText = `${tracks.length} أغنية محملة • إجمالي ${totalSizeMB} MB في المجلد المحلي`;

    renderGrid(downloadsGrid, tracks);
  }

  document.getElementById('playAllDownloadsBtn').addEventListener('click', () => {
    if (tracks.length > 0) setTrack(0, true);
  });

  document.getElementById('shuffleDownloadsBtn').addEventListener('click', () => {
    if (tracks.length > 0) {
      isShuffle = true;
      shuffleBtn.classList.add('active');
      const rand = Math.floor(Math.random() * tracks.length);
      setTrack(rand, true);
    }
  });

  // هـ. صفحة المفضلة (Favorites View)
  function renderFavoritesView() {
    const favGrid = document.getElementById('favoritesTracksGrid');
    const statsEl = document.getElementById('favoritesPlaylistStats');

    const favTracks = tracks.filter(t => favorites.includes(t.id));
    statsEl.innerText = `${favTracks.length} أغنية مفضلة في قائمة التشغيل الشخصية`;

    renderGrid(favGrid, favTracks);
  }

  document.getElementById('playAllFavsBtn').addEventListener('click', () => {
    const favTracks = tracks.filter(t => favorites.includes(t.id));
    if (favTracks.length > 0) {
      const idx = tracks.findIndex(t => t.id === favTracks[0].id);
      if (idx !== -1) setTrack(idx, true);
    }
  });

  // دالة عامة لبناء كروت الأغاني
  function renderGrid(container, trackList) {
    if (!container) return;
    if (trackList.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; color: #aaa; padding: 40px;">
          🎵 لا توجد أغاني مطابقة للشرط حالياً.
        </div>
      `;
      return;
    }

    container.innerHTML = '';
    trackList.forEach((track) => {
      const globalIndex = tracks.findIndex(t => t.id === track.id);
      const isFav = favorites.includes(track.id);

      const card = document.createElement('div');
      card.className = `track-card ${currentTrackIndex === globalIndex ? 'playing-card' : ''}`;
      
      card.innerHTML = `
        <div class="card-thumb-wrapper">
          <img src="${track.coverUrl}" alt="${track.title}" loading="lazy" onerror="this.src='https://music.youtube.com/img/on_platform_logo_dark.svg'">
          <div class="play-overlay">
            <div class="play-circle-btn">
              <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
        </div>
        <div class="card-title" title="${track.title}">${track.title}</div>
        <div class="card-artist" title="${track.artist}">${track.artist}</div>
        <div style="display:flex; justify-space-between; align-items:center; width:100%; margin-top:6px;">
          <span class="quality-badge">320kbps MP3</span>
          <span style="color:${isFav ? '#ff0000' : '#666'}; font-size:14px;">${isFav ? '❤️' : '🤍'}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        setTrack(globalIndex, true);
      });

      container.appendChild(card);
    });
  }

  // 6️⃣ إدارة المفضلة (Favorites Toggle)
  likeBtn.addEventListener('click', () => {
    if (currentTrackIndex === -1 || tracks.length === 0) return;
    const track = tracks[currentTrackIndex];

    if (favorites.includes(track.id)) {
      favorites = favorites.filter(id => id !== track.id);
      heartIcon.style.fill = 'currentColor';
      likeBtn.classList.remove('active');
    } else {
      favorites.push(track.id);
      heartIcon.style.fill = '#ff0000';
      likeBtn.classList.add('active');
    }

    localStorage.setItem('yt_music_favs', JSON.stringify(favorites));
    favCountBadge.innerText = favorites.length;

    // تحديث الشاشة الحالية
    const activeNav = document.querySelector('.nav-item.active, .playlist-item.active');
    if (activeNav) switchView(activeNav.dataset.view || 'home');
  });

  function updateHeartIconState() {
    if (currentTrackIndex === -1 || tracks.length === 0) return;
    const track = tracks[currentTrackIndex];
    if (favorites.includes(track.id)) {
      heartIcon.style.fill = '#ff0000';
      likeBtn.classList.add('active');
    } else {
      heartIcon.style.fill = 'currentColor';
      likeBtn.classList.remove('active');
    }
  }

  // 7️⃣ تعيين الأغنية والتشغيل
  function setTrack(index, playImmediately = true) {
    if (index < 0 || index >= tracks.length) return;

    currentTrackIndex = index;
    const track = tracks[currentTrackIndex];

    audioPlayer.src = track.streamUrl;
    playerCover.src = track.coverUrl;
    playerTitle.innerText = track.title;
    playerArtist.innerText = track.artist;

    updateHeartIconState();

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: track.album || 'يوتيوب ميوزك المحلي',
        artwork: [{ src: track.coverUrl, sizes: '512x512', type: 'image/png' }]
      });

      navigator.mediaSession.setActionHandler('play', () => playAudio());
      navigator.mediaSession.setActionHandler('pause', () => pauseAudio());
      navigator.mediaSession.setActionHandler('previoustrack', () => playPrevTrack());
      navigator.mediaSession.setActionHandler('nexttrack', () => playNextTrack());
    }

    renderQueueList();
    highlightActiveCards();

    if (playImmediately) {
      playAudio();
    }
  }

  function playAudio() {
    initWebAudioEngine();
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    audioPlayer.play().then(() => {
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
    }).catch(err => console.warn('تعذر التشغيل:', err));
  }

  function pauseAudio() {
    audioPlayer.pause();
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
  }

  function togglePlayPause() {
    if (audioPlayer.paused) {
      playAudio();
    } else {
      pauseAudio();
    }
  }

  function playNextTrack() {
    if (tracks.length === 0) return;
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      setTrack(randomIndex, true);
    } else {
      let nextIndex = currentTrackIndex + 1;
      if (nextIndex >= tracks.length) nextIndex = 0;
      setTrack(nextIndex, true);
    }
  }

  function playPrevTrack() {
    if (tracks.length === 0) return;
    let prevIndex = currentTrackIndex - 1;
    if (prevIndex < 0) prevIndex = tracks.length - 1;
    setTrack(prevIndex, true);
  }

  // 8️⃣ تحديث شريط التقدم السلس
  audioPlayer.addEventListener('timeupdate', () => {
    if (!audioPlayer.duration) return;
    const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressFilled.style.width = `${progressPercent}%`;
    progressHandle.style.left = `${progressPercent}%`;

    const currentMins = Math.floor(audioPlayer.currentTime / 60);
    const currentSecs = Math.floor(audioPlayer.currentTime % 60).toString().padStart(2, '0');
    const totalMins = Math.floor(audioPlayer.duration / 60);
    const totalSecs = Math.floor(audioPlayer.duration % 60).toString().padStart(2, '0');

    timeDisplay.innerText = `${currentMins}:${currentSecs} / ${totalMins}:${totalSecs}`;
  });

  audioPlayer.addEventListener('ended', () => {
    if (repeatState === 2) {
      audioPlayer.currentTime = 0;
      playAudio();
    } else {
      playNextTrack();
    }
  });

  progressContainer.addEventListener('click', (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const duration = audioPlayer.duration;
    if (duration) {
      audioPlayer.currentTime = (clickX / width) * duration;
    }
  });

  // 9️⃣ الصوت والـ Sliders
  volumeSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    audioPlayer.volume = val;
    updateVolumeIcon(val);
  });

  volumeBtn.addEventListener('click', () => {
    if (audioPlayer.volume > 0) {
      lastVolume = audioPlayer.volume;
      audioPlayer.volume = 0;
      volumeSlider.value = 0;
      updateVolumeIcon(0);
    } else {
      audioPlayer.volume = lastVolume || 0.8;
      volumeSlider.value = audioPlayer.volume;
      updateVolumeIcon(audioPlayer.volume);
    }
  });

  function updateVolumeIcon(val) {
    if (val === 0) {
      volHighIcon.style.display = 'none';
      volMuteIcon.style.display = 'block';
    } else {
      volHighIcon.style.display = 'block';
      volMuteIcon.style.display = 'none';
    }
  }

  shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
  });

  repeatBtn.addEventListener('click', () => {
    repeatState = (repeatState + 1) % 3;
    repeatBtn.classList.toggle('active', repeatState !== 0);
  });

  // 🔟 البحث والتصفية
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    clearSearchBtn.style.display = query ? 'block' : 'none';

    if (!query) {
      switchView('home');
      return;
    }

    const filtered = tracks.filter(t => 
      t.title.toLowerCase().includes(query) || 
      t.artist.toLowerCase().includes(query)
    );

    switchView('home');
    const homeGrid = document.getElementById('homeTracksGrid');
    renderGrid(homeGrid, filtered);
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    renderHomeView();
  });

  refreshTracksBtn.addEventListener('click', () => {
    loadTracks();
  });

  // 1️⃣1️⃣ الميزات الخاصة
  popoutMiniPlayerBtn.addEventListener('click', () => {
    window.open(
      window.location.href,
      'YTMusicMiniPlayer',
      'width=440,height=680,resizable=yes,scrollbars=no,status=no'
    );
  });

  pipBtn.addEventListener('click', async () => {
    try {
      if ('pictureInPictureEnabled' in document) {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#121212';
        ctx.fillRect(0, 0, 400, 400);
        ctx.fillStyle = '#ff0000';
        ctx.font = 'bold 22px Cairo, sans-serif';
        ctx.fillText(tracks[currentTrackIndex]?.title || 'YouTube Music', 20, 200);

        const video = document.createElement('video');
        video.srcObject = canvas.captureStream();
        video.muted = true;
        await video.play();
        await video.requestPictureInPicture();
      }
    } catch (err) {}
  });

  toggleQueueBtn.addEventListener('click', () => queueDrawer.classList.toggle('open'));
  closeQueueBtn.addEventListener('click', () => queueDrawer.classList.remove('open'));

  function renderQueueList() {
    queueList.innerHTML = '';
    tracks.forEach((t, i) => {
      const item = document.createElement('div');
      item.className = `queue-item ${i === currentTrackIndex ? 'playing' : ''}`;
      item.innerHTML = `
        <img src="${t.coverUrl}" onerror="this.src='https://music.youtube.com/img/on_platform_logo_dark.svg'">
        <div>
          <div style="font-size:13px; font-weight:600;">${t.title}</div>
          <div style="font-size:11px; color:#aaa;">${t.artist}</div>
        </div>
      `;
      item.addEventListener('click', () => setTrack(i, true));
      queueList.appendChild(item);
    });
  }

  function highlightActiveCards() {
    document.querySelectorAll('.track-card').forEach((card) => {
      card.classList.remove('playing-card');
    });
  }

  playPauseBtn.addEventListener('click', togglePlayPause);
  nextBtn.addEventListener('click', playNextTrack);
  prevBtn.addEventListener('click', playPrevTrack);

  loadTracks();
});
