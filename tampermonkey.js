// ==UserScript==
// @name         YouTube → Fangea Rich Player
// @namespace    http://tampermonkey.net/
// @version      1.1.4
// @description  UI na wzór radia internetowego
// @match        https://www.youtube.com/playlist?list*
// @match        https://www.youtube.com/watch?*list*
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function () {
  'use strict';

  // Pobierz ID playlisty z URL
  const listId = new URLSearchParams(location.search).get('list');

  // Zdefiniuj playlisty, na których ma działać skrypt
  const customPlaylists = {
    'PLZkKDd2WNmkJ1dyDrX_GagxasBlahqhrR': {
      title: 'Radio Break The Core',
      thumb: 'https://i.ibb.co/7r41HBt/zlam-kor.png'
    },
    'PLQK-CIQhtz9MYKzGlRgigNXe7BT5V4MpJ': {
      title: 'Nox FM',
      thumb: 'https://i.ibb.co/883RVC7/nox-fm.png'
    },
    'PLQK-CIQhtz9NLwXGQV11uzKLEMpO-FVoM': {
      title: 'ЖFM',
      thumb: 'https://i.ibb.co/CKQhSbMJ/zfm-Obszar-roboczy-1.png'
    },
    'PLQK-CIQhtz9PB3j0AXHi_-ycr1qO0YKFK': {
      title: 'Noir Radio',
      thumb: 'https://i.ibb.co/7C0gJjX/noir-noir.png'
    },
    'PLpUj5VNghWeRRRM_V92H4pb0S8rKDKnRc': {
      title: 'Радіо Верiград',
      thumb: 'https://i.ibb.co/t0MJNz9/radio-werigrad-Obszar-roboczy-1.png'
    },
    'PL8YJXgkG6ZjnX2m1zG0bpOvFX_pW8iQHs': {
      title: 'Boomer Hits',
      thumb: 'https://i.ibb.co/ncGF0Hb/boomer-hits.png'
    },
    'PLJ32iBqIDcZ_W6jL936Vjc7-98x7gflm1': {
      title: 'Kolenstad Radio',
      thumb: 'https://i.ibb.co/p6YDZMPh/kolencydam-radio-Obszar-roboczy-1.png'
    },
    'PLJ32iBqIDcZ-Dq6HLg3xzoAjlUJJKR7YR': {
      title: 'EchoRå',
      thumb: 'https://i.ibb.co/GQqXQvRL/echora-Obszar-roboczy-1.png'
    },
     'PLJ32iBqIDcZ_sQGYYk_cXI6QMH6SAJz18': {
      title: 'Not Input',
      thumb: 'https://i.ibb.co/NgDtdt4P/not-input-Obszar-roboczy-1.png'
    },
     'PLQK-CIQhtz9MTZa8Ozadk3axna-lfwE9J': {
      title: 'Radio Zen',
      thumb: 'https://i.ibb.co/dwr7pqmY/radio-zen-Obszar-roboczy-1.png'
    },
     'PLuvfpLAys6uXku0N2dVAKp6Lhulcw1UOs': {
      title: 'Sigma Radio',
      thumb: 'https://i.ibb.co/nNn1YK3c/sigma-radio-Obszar-roboczy-1.png'
    },
     'PLXOsc_dJNyeVYzBcaHUdgInzOn_U7mHUQ': {
      title: '-80/80',
      thumb: 'https://i.ibb.co/pvqX72J0/8080-i-rebel-Obszar-roboczy-1.png'
    },
     'PLXOsc_dJNyeXHVGD4DmY1sjUtFj7WCiPO': {
      title: 'Radio Unplugged',
      thumb: 'https://i.ibb.co/JwKkLWMs/unplugged.png'
    },
     'PLgcUvx3vCvqjNnWnUmowSKpyZ8p_rvn8R': {
      title: 'Radio Pregolau International',
      thumb: 'https://i.ibb.co/8gzPv0mJ/radio-pregolau-Obszar-roboczy-1.png'
    }
  };

  // Jeśli listId nie istnieje lub nie jest na liście, przerwij działanie skryptu
  if (!listId || !customPlaylists[listId]) return;

  const onPlaylist = () => location.pathname === '/playlist' && location.search.includes('list=');
  const onWatch = () => location.pathname === '/watch' && location.search.includes('list=');

  let playlistTitle = '';
  let playlistThumb = '';

  try {
    if (customPlaylists[listId]) {
      playlistTitle = customPlaylists[listId].title;
      playlistThumb = customPlaylists[listId].thumb;
    } else if (onPlaylist()) {
      const meta = window.ytInitialData.metadata?.playlistMetadataRenderer;
      playlistTitle = meta?.title || '';
      const contents = window.ytInitialData?.contents?.twoColumnBrowseResultsRenderer
        ?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]
        ?.itemSectionRenderer?.contents?.[0]?.playlistVideoListRenderer?.contents;
      const firstVidThumbs = contents?.[0]?.playlistVideoRenderer?.thumbnail?.thumbnails;
      if (firstVidThumbs?.length) playlistThumb = firstVidThumbs.at(-1).url;
    } else if (onWatch()) {
      const linkEl = document.querySelector('a[href*="/playlist?list="]');
      if (linkEl) playlistTitle = linkEl.textContent.trim();
      const player = window.ytInitialPlayerResponse;
      const thumbs = player?.videoDetails?.thumbnail?.thumbnails;
      if (thumbs?.length) playlistThumb = thumbs.at(-1).url;
    }
  } catch (e) {
    console.warn('Nie udało się pobrać tytułu lub miniaturki:', e);
  }

  const css = `
    html, body {
      background: #101920 !important;
      overflow: hidden !important;
    }
    body > * { display: none !important; }
    #movie_player, video, #fangea-panel, #fangea-bg { display: block !important; }
    video { opacity: 0 !important; }

    #fangea-panel {
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%) scale(2);
      background: #141e26;
      padding: 1.5rem;
      border-radius: .5rem;
      box-shadow: 0 0 8px rgba(89,110,129,0.7);
      font-family: 'Montserrat', sans-serif;
      color: #ecf0f1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      z-index: 100000;
      width: 120px;
      align-items: center;
      text-align: center;
    }

    #fangea-logo {
      width: 120px;
      height: 120px;
      border-radius: .5rem;
      background: ${playlistThumb ? `url("${playlistThumb}") center/cover no-repeat` : '#fff'};
      box-shadow: inset 0 0 4px rgba(0,0,0,0.2);
      flex-shrink: 0;
      object-fit: cover;
      margin-bottom: .4rem;
    }

    #fangea-info { flex: none; }
    #fangea-title {
      font-size: 1.5rem;
      font-weight: 600;
      overflow: hidden;
      white-space: nowrap;
      height: 1.8rem;
      margin-bottom: .5rem;
    }
    #fangea-title span {
      display: inline-block;
      padding-left: 100%;
      animation: marquee 15s linear infinite;
    }
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-100%); }
    }

    #fangea-list li {
      margin-bottom: .3rem;
      opacity: .8;
    }
    #fangea-list li.current {
      font-weight: 600;
      opacity: 1;
    }

    #fangea-controls {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      flex: none;
    }

    #fangea-toggle {
      background: transparent;
      color: #fff;
      font-size: 2rem;
      border: none;
      cursor: pointer;
    }

    #fangea-volume {
      width: 120px;
      height: 6px;
      appearance: none;
      accent-color: #ecf0f1;
      background: #1b262f;
      border-radius: 4px;
    }

    #fangea-volume::-webkit-slider-thumb {
      background: #ecf0f1;
      width: 14px;
      height: 14px;
      border: none;
      border-radius: 50%;
      box-shadow: 0 0 4px #596e81;
      appearance: none;
    }

    #fangea-volume::-moz-range-track {
      background: #1b262f;
      border-radius: 4px;
    }

    #fangea-volume::-moz-range-thumb {
      background: #ecf0f1;
      width: 14px;
      height: 14px;
      border: none;
      border-radius: 50%;
      box-shadow: 0 0 4px #596e81;
    }

    #fangea-bg {
      position: fixed;
      top: 0; left: 0;
      width: 100vw;
      height: 100vh;
      background: url("https://i.ibb.co/TMBrpbpy/image.png") center/cover no-repeat;
      z-index: -1;
    }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const fa = document.createElement('link');
  fa.rel = 'stylesheet';
  fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
  document.head.appendChild(fa);

  // Zapisywanie stanu między utworami
  let isMuted = GM_getValue('fangeaMuted', false);
  let volume = GM_getValue('fangeaVolume', 0.5);
  let isLoopEnabled = GM_getValue('fangeaLoop', false);

  function setupVideoListeners(video) {
    if (!video) return;

    // Ustaw zapisany stan
    video.muted = isMuted;
    video.volume = volume;

    // Obsługa zmiany utworu
    video.addEventListener('ended', () => {
      if (isLoopEnabled) {
        const nextButton = document.querySelector('.ytp-next-button');
        if (nextButton) nextButton.click();
      }
    });

    // Aktualizacja przycisku i suwaka
    updateControls();
  }

  function updateControls() {
    const toggleBtn = document.getElementById('fangea-toggle');
    const volumeSlider = document.getElementById('fangea-volume');
    const video = document.querySelector('video');

      if (toggleBtn) {
          const icon = toggleBtn.querySelector('i');
          if (icon) {
              icon.className = onPlaylist() || isMuted
                  ? 'fas fa-circle-play fa-2x'
              : 'fas fa-circle-pause fa-2x';
          }
      }

    if (volumeSlider) {
      volumeSlider.value = volume;
    }

    if (video) {
      video.muted = isMuted;
      video.volume = volume;
    }
  }

  function createPanel() {
    if (document.getElementById('fangea-panel')) return;

    const bg = document.createElement('div');
    bg.id = 'fangea-bg';
    document.body.appendChild(bg);

    const panel = document.createElement('div');
    panel.id = 'fangea-panel';

    const logo = document.createElement('div');
    logo.id = 'fangea-logo';
    if (playlistThumb) logo.style.backgroundImage = `url("${playlistThumb}")`;
    panel.appendChild(logo);

    const info = document.createElement('div');
    info.id = 'fangea-info';

    const title = document.createElement('div');
    title.id = 'fangea-title';
    const span = document.createElement('span');
    span.textContent = playlistTitle || 'Playlist';
    title.appendChild(span);
    info.appendChild(title);

    const ul = document.createElement('ul');
    ul.id = 'fangea-list';
    info.appendChild(ul);

    panel.appendChild(info);

    const ctr = document.createElement('div');
    ctr.id = 'fangea-controls';

    const btn = document.createElement('button');
    btn.id = 'fangea-toggle';
    const icon = document.createElement('i');
    icon.className = isMuted ? 'fas fa-circle-play fa-2x' : 'fas fa-circle-pause fa-2x';
    btn.appendChild(icon);

    btn.onclick = () => {
      const video = document.querySelector('video');
      if (onPlaylist()) {
        const links = [...document.querySelectorAll('a.ytd-playlist-video-renderer')];
        const random = links[Math.floor(Math.random() * links.length)];
        if (random) window.location.href = random.href;
      } else if (onWatch() && video) {
        isMuted = !isMuted;
        GM_setValue('fangeaMuted', isMuted);
        video.muted = isMuted;
        updateControls();
      }
    };

    ctr.appendChild(btn);

    const vol = document.createElement('input');
    vol.id = 'fangea-volume';
    vol.type = 'range';
    vol.min = 0;
    vol.max = 1;
    vol.step = 0.01;
    vol.value = volume;
    vol.oninput = () => {
      const v = document.querySelector('video');
      if (v) {
        volume = parseFloat(vol.value);
        GM_setValue('fangeaVolume', volume);
        v.volume = volume;
        // Jeśli wyciszony, odcisz przy zmianie głośności
        if (isMuted) {
          isMuted = false;
          GM_setValue('fangeaMuted', false);
          updateControls();
        }
      }
    };
    ctr.appendChild(vol);

    panel.appendChild(ctr);
    document.body.appendChild(panel);

    // Ustawienie zapętlenia playlisty
    const enableLoop = () => {
      const loopButton = document.querySelector('.ytp-loop-button');
      if (loopButton && loopButton.getAttribute('aria-checked') !== 'true') {
        loopButton.click();
        isLoopEnabled = true;
        GM_setValue('fangeaLoop', true);
      }
    };

    // Spróbuj ustawić zapętlenie od razu i co sekundę przez 5 sekund
    enableLoop();
    let attempts = 0;
    const loopInterval = setInterval(() => {
      enableLoop();
      attempts++;
      if (attempts >= 5 || isLoopEnabled) {
        clearInterval(loopInterval);
      }
    }, 1000);

    // Obserwuj zmiany wideo
    const video = document.querySelector('video');
    if (video) {
      setupVideoListeners(video);
    }

    // Obserwuj zmiany DOM dla nowych elementów wideo
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes) {
          const video = document.querySelector('video');
          if (video) {
            setupVideoListeners(video);
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  createPanel();

  // Obserwuj zmiany URL aby aktualizować panel
  let lastUrl = location.href;
  setInterval(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(createPanel, 300);
    }
  }, 500);
})();
