(function () {
  'use strict';

  const BACKEND_URL = 'http://localhost:4000/download';
  const CHECK_DUP_URL = 'http://localhost:4000/check-duplicate';
  const STATUS_URL = 'http://localhost:4000/download-status';
  let currentVideoId = null;

  const videoJobs = new Map();

  console.log('⚡ [YT HQ Downloader] Active with Smart Duplicate Detection & Warning!');

  function getVideoId() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('v')) {
      return urlParams.get('v');
    }
    const match = window.location.pathname.match(/\/watch\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  }

  function getThumbnailUrl(videoId) {
    if (!videoId) return '';
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }

  function getVideoTitle() {
    const isYtMusic = window.location.hostname.includes('music.youtube.com');
    if (isYtMusic) {
      const musicTitle = document.querySelector('ytmusic-player-bar .title.ytmusic-player-bar, ytmusic-player-queue-item[selected] .song-title');
      if (musicTitle && musicTitle.innerText.trim()) {
        return musicTitle.innerText.trim();
      }
    }
    
    const ytTitle = document.querySelector('h1.ytd-watch-metadata, h1.ytd-video-primary-info-renderer, yt-formatted-string.ytd-watch-metadata');
    if (ytTitle && ytTitle.innerText.trim()) {
      return ytTitle.innerText.trim();
    }

    return document.title.replace('- YouTube', '').replace('- YouTube Music', '').trim();
  }

  // فحص ما إذا كانت الأغنية موجودة مسبقاً بالمكتبة
  async function checkDuplicateOnServer(title) {
    try {
      const res = await fetch(CHECK_DUP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
    return { exists: false };
  }

  function createDownloadButton() {
    const btn = document.createElement('button');
    btn.id = 'yt-hq-download-btn';
    btn.className = 'yt-hq-btn-container';
    btn.setAttribute('type', 'button');
    btn.innerHTML = `
      <span class="yt-hq-btn-icon">⚡</span>
      <span class="yt-hq-btn-text">تحميل 320kbps</span>
    `;

    let confirmForceDownload = false;
    let confirmTimer = null;

    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const videoId = getVideoId();
      if (!videoId) {
        setButtonState(btn, 'error', 'رابط غير صالح!');
        return;
      }

      if (videoJobs.has(videoId) && !videoJobs.get(videoId).done) {
        return;
      }

      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const title = getVideoTitle();
      const thumbnail = getThumbnailUrl(videoId);

      // إذا كانت الأغنية محملة مسبقاً ولم يقم بالموافقة على إعادة التحميل القسري بعد
      if (btn.dataset.duplicate === 'true' && !confirmForceDownload) {
        confirmForceDownload = true;
        setButtonState(btn, 'warning', 'موجودة! إعادة تنزيل؟ ⚠️');

        if (confirmTimer) clearTimeout(confirmTimer);
        confirmTimer = setTimeout(() => {
          confirmForceDownload = false;
          setButtonState(btn, 'exists', 'موجودة بالمكتبة 🎵');
        }, 4000);

        return; // انتظار الضغطة الثانية للتأكيد
      }

      // بدء التنزيل (سواء أول مرة أو إعادة تنزيل قسرية)
      confirmForceDownload = false;
      if (confirmTimer) clearTimeout(confirmTimer);
      delete btn.dataset.duplicate;

      setButtonState(btn, 'loading', 'تنزيل صاروخي 10% ⚡');

      try {
        const response = await fetch(BACKEND_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: videoUrl,
            title: title,
            thumbnail: thumbnail,
            force: true // موافقة على التحميل
          })
        });

        const data = await response.json();

        if (response.ok && data.success && data.jobId) {
          videoJobs.set(videoId, { jobId: data.jobId, done: false, status: 'جاري التنزيل 10%' });
          trackJobProgress(btn, videoId, data.jobId);
        } else if (data.alreadyExists) {
          setButtonState(btn, 'exists', 'موجودة بالمكتبة 🎵');
          btn.dataset.duplicate = 'true';
        } else {
          setButtonState(btn, 'error', 'فشل التنزيل! ❌');
          setTimeout(() => resetButtonState(btn), 4000);
        }
      } catch (err) {
        setButtonState(btn, 'error', 'السيرفر غير متصل! 🔌');
        console.error('تعذر الاتصال بالسيرفر:', err);
        setTimeout(() => resetButtonState(btn), 4000);
      }
    });

    return btn;
  }

  function trackJobProgress(btn, videoId, jobId) {
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`${STATUS_URL}/${jobId}`);
        if (!res.ok) return;
        const job = await res.json();

        if (job) {
          videoJobs.set(videoId, { jobId, done: job.done, status: job.status, success: job.success });

          if (getVideoId() === videoId) {
            setButtonState(btn, 'loading', job.status);
          }

          if (job.done) {
            clearInterval(pollInterval);
            if (getVideoId() === videoId) {
              if (job.success) {
                setButtonState(btn, 'success', 'تم بنجاح 100% ✅');
                setTimeout(() => {
                  setButtonState(btn, 'exists', 'موجودة بالمكتبة 🎵');
                  btn.dataset.duplicate = 'true';
                }, 4000);
              } else {
                setButtonState(btn, 'error', 'فشل التنزيل! ❌');
                setTimeout(() => resetButtonState(btn), 4000);
              }
            }
          }
        }
      } catch (err) {
        console.warn('خطأ في متابعة التقدم:', err);
      }
    }, 400);
  }

  function setButtonState(btn, state, message) {
    btn.disabled = state === 'loading';
    btn.dataset.state = state;
    const textEl = btn.querySelector('.yt-hq-btn-text');
    if (textEl) textEl.innerText = message;
  }

  function resetButtonState(btn) {
    btn.disabled = false;
    btn.dataset.state = 'normal';
    delete btn.dataset.duplicate;
    const textEl = btn.querySelector('.yt-hq-btn-text');
    if (textEl) textEl.innerText = 'تحميل 320kbps';
  }

  async function injectButton() {
    const videoId = getVideoId();
    if (!videoId) return;

    let btn = document.getElementById('yt-hq-download-btn');

    if (!btn) {
      btn = createDownloadButton();
      const isYtMusic = window.location.hostname.includes('music.youtube.com');

      if (isYtMusic) {
        const musicSelectors = [
          'ytmusic-player-bar .middle-controls',
          'ytmusic-player-bar #menu-buttons',
          'ytmusic-player-bar .right-controls-buttons',
          '#top-level-buttons-computed',
          'ytmusic-menu-renderer'
        ];
        for (const sel of musicSelectors) {
          const el = document.querySelector(sel);
          if (el) {
            el.appendChild(btn);
            break;
          }
        }
      } else {
        const ytSelectors = [
          '#top-level-buttons-computed',
          'ytd-watch-metadata #actions #top-level-buttons-computed',
          '#actions-inner #top-level-buttons-computed',
          'ytd-watch-metadata #actions',
          'ytd-menu-renderer #flexible-item-buttons',
          '#segmented-like-dislike-button',
          'ytd-watch-metadata #owner',
          '#actions'
        ];

        for (const sel of ytSelectors) {
          const container = document.querySelector(sel);
          if (container) {
            if (sel.includes('buttons') || sel.includes('actions') || sel.includes('like')) {
              container.appendChild(btn);
            } else {
              container.parentNode.insertBefore(btn, container.nextSibling);
            }
            break;
          }
        }
      }
    }

    if (currentVideoId !== videoId) {
      currentVideoId = videoId;
      const existingJob = videoJobs.get(videoId);

      if (existingJob) {
        if (existingJob.done) {
          setButtonState(btn, 'exists', 'موجودة بالمكتبة 🎵');
          btn.dataset.duplicate = 'true';
        } else {
          setButtonState(btn, 'loading', existingJob.status || 'جاري التنزيل... ⏳');
        }
      } else {
        resetButtonState(btn);

        // فحص ما إذا كانت الأغنية محملة مسبقاً في المجلد
        const title = getVideoTitle();
        if (title) {
          const dupRes = await checkDuplicateOnServer(title);
          if (dupRes && dupRes.exists) {
            setButtonState(btn, 'exists', 'موجودة بالمكتبة 🎵');
            btn.dataset.duplicate = 'true';
          }
        }
      }
    }
  }

  setInterval(injectButton, 800);
  injectButton();
})();
