// ==UserScript==
// @name         YouTube → Fangea Rich Player
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  UI na wzór radia internetowego
// @match        https://www.youtube.com/playlist?list*
// @match        https://www.youtube.com/watch?*list*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function () {
  'use strict';


  // Pobierz ID playlisty z URL
  const listId = new URLSearchParams(location.search).get('list');

  // Sprawdź czy lista istnieje
  if (!listId) {
    return;
  }

  // Zdefiniuj funkcje sprawdzające stronę TUTAJ - na początku
  function onPlaylist() {
    return location.pathname === '/playlist' && location.search.includes('list=');
  }

  function onWatch() {
    return location.pathname === '/watch' && location.search.includes('list=');
  }


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

  let playlistTitle = '';
  let playlistThumb = '';
  let playlistData = [];
  let currentTrackIndex = -1;
  let videoObserver = null;
  let isScriptActive = true;
  let retryCount = 0;
  const MAX_RETRIES = 3;


  // Zapisywanie stanu między utworami
  let isMuted = GM_getValue('fangeaMuted', false);
  let volume = GM_getValue('fangeaVolume', 0.5);


  // CSS - bez zmian
  const css = `
    html, body {
      background: #101920 !important;
      overflow: hidden !important;
    }

    /* Ukryj główne elementy YouTube */
    ytd-app, #masthead, #guide, #content, ytd-page-manager,
    ytd-browse, ytd-two-column-browse-results-renderer,
    ytd-watch-flexy > #columns, ytd-playlist-sidebar-renderer,
    #secondary, #primary, #chat, #merch-shelf,
    .ytd-watch-metadata, .ytd-video-secondary-info-renderer,
    #info, #meta, ytd-comments {
      display: none !important;
    }

    /* Pokaż tylko odtwarzacz i nasze elementy */
    #movie_player,
    #fangea-panel,
    #fangea-bg,
    .fangea-control {
      display: block !important;
    }

    /* Ukryj video ale pozostaw player */
    #movie_player video {
      opacity: 0 !important;
    }

    /* Upewnij się, że player jest widoczny */
    #movie_player {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      z-index: 1 !important;
    }

    #fangea-panel {
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%) scale(1.8);
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
      width: 140px;
      text-align: center;
    }

    #fangea-logo {
      width: 138px;
      height: 138px;
      border-radius: .5rem;
      background-color: #fff;
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      box-shadow: inset 0 0 4px rgba(0,0,0,0.2);
      flex-shrink: 0;
      object-fit: contain;
      margin-bottom: .4rem;
      border: 1px solid rgba(255,255,255,0.1);
    }

    #fangea-info {
      flex: none;
      width: 100%;
      margin-bottom: 1.2rem;
    }
    #fangea-title {
      font-size: 1.2rem;
      font-weight: 600;
      overflow: hidden;
      white-space: nowrap;
      height: 1.5rem;
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

    #fangea-current-track {
      background: rgba(255,255,255,0.1);
      padding: .5rem;
      border-radius: .3rem;
      margin-bottom: .8rem;
      font-size: .9rem;
      font-weight: 600;
    }

    #fangea-current-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    #fangea-tracklist {
      max-height: 120px;
      overflow-y: auto;
      width: 100%;
      font-size: .8rem;
      text-align: left;
      margin-bottom: 1rem;
    }

    #fangea-tracklist::-webkit-scrollbar {
      width: 4px;
    }

    #fangea-tracklist::-webkit-scrollbar-track {
      background: #1b262f;
      border-radius: 2px;
    }

    #fangea-tracklist::-webkit-scrollbar-thumb {
      background: #596e81;
      border-radius: 2px;
    }

    .track-item {
      padding: .3rem;
      margin-bottom: .2rem;
      background: rgba(255,255,255,0.05);
      border-radius: .2rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: left;
      position: relative;
      padding-left: 1rem;
    }

    .track-item::before {
      content: "•";
      position: absolute;
      left: 0.3rem;
      color: #ecf0f1;
    }

    .track-item.upcoming {
      opacity: 0.7;
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
      transition: transform 0.2s ease;
    }

    #fangea-toggle:hover {
      transform: scale(1.1);
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

    /* Ukryte kontrolki */
    .fangea-control {
      position: fixed;
      width: 40px;
      height: 40px;
      background: rgba(20, 30, 38, 0.8);
      border: none;
      color: #ecf0f1;
      font-size: 1.2rem;
      border-radius: 50%;
      cursor: pointer;
      z-index: 100001;
      opacity: 0.05;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .fangea-control:hover {
      opacity: 1;
      transform: scale(1.1);
      background: rgba(20, 30, 38, 0.95);
    }

    #fangea-first {
      bottom: 20px;
      left: 20px;
    }

    #fangea-prev {
      top: 20px;
      left: 20px;
    }

    #fangea-next {
      top: 20px;
      right: 20px;
    }

    /* Przycisk powrotu */
    #fangea-return {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: #141e26;
      border: none;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0px 0px 4px 1px #596e81;
      cursor: pointer;
      transition-duration: 0.3s;
      overflow: hidden;
      z-index: 100002;
      text-decoration: none;
    }

    #fangea-return .svgIcon {
      width: 20px;
      height: 20px;
      transition-duration: 0.3s;
    }

    #fangea-return .svgIcon path {
      fill: white;
    }

    #fangea-return:hover {
      width: 140px;
      border-radius: 50px;
      transition-duration: 0.3s;
      background-color: #222e3a;
      align-items: center;
    }

    #fangea-return:hover .svgIcon {
      transition-duration: 0.3s;
      transform: translateY(-200%);
    }

    #fangea-return::before {
      position: absolute;
      bottom: -20px;
      content: "Powrót";
      font-family: 'Montserrat', sans-serif;
      color: white;
      font-size: 0px;
    }

    #fangea-return:hover::before {
      font-size: 15px;
      opacity: 1;
      bottom: unset;
      transition-duration: 0.3s;
    }
  `;

  // Ulepszona funkcja do pobierania danych playlisty
  function getPlaylistData() {
    try {
      if (onWatch()) {
        const playlistItems = document.querySelectorAll('#playlist ytd-playlist-panel-video-renderer');
        playlistData = Array.from(playlistItems).map((item, index) => {
          const titleEl = item.querySelector('#video-title');
          const durationEl = item.querySelector('.ytd-thumbnail-overlay-time-status-renderer');
          const isCurrentEl = item.querySelector('.ytd-playlist-panel-video-renderer[selected]');

          return {
            title: titleEl ? titleEl.textContent.trim() : `Track ${index + 1}`,
            duration: durationEl ? durationEl.textContent.trim() : '',
            isCurrent: isCurrentEl !== null || item.hasAttribute('selected'),
            element: item
          };
        });

        currentTrackIndex = playlistData.findIndex(track => track.isCurrent);
        if (currentTrackIndex === -1) currentTrackIndex = 0;
      }
    } catch (e) {
      console.warn('Nie udało się pobrać danych playlisty:', e);
    }
  }

  // Ulepszona funkcja obsługi wideo z retry mechanism
  function setupVideoListeners(video) {
    if (!video || !isScriptActive) return;


    // Usuń poprzednie event listenery jeśli istnieją
    const oldVideo = document.querySelector('video[data-fangea-setup]');
    if (oldVideo) {
      oldVideo.removeAttribute('data-fangea-setup');
    }

    // Oznacz video jako skonfigurowane
    video.setAttribute('data-fangea-setup', 'true');

    // Ustaw zapisany stan z opóźnieniem aby YouTube nie nadpisał
    setTimeout(() => {
      if (video && isScriptActive) {
        video.muted = isMuted;
        video.volume = volume;
      }
    }, 500);

    // Event listener na zmiany stanu odtwarzania
    const handlePlayStateChange = () => {
      if (!isScriptActive) return;
      setTimeout(() => {
        updateControls();
        updateTrackList();
      }, 100);
    };

    // Bardziej agresywne monitorowanie stanu wideo
    video.addEventListener('loadstart', handlePlayStateChange);
    video.addEventListener('loadeddata', handlePlayStateChange);
    video.addEventListener('canplay', handlePlayStateChange);
    video.addEventListener('playing', handlePlayStateChange);
    video.addEventListener('pause', handlePlayStateChange);

    // Monitorowanie końca wideo z zabezpieczeniem
    video.addEventListener('ended', () => {
      if (!isScriptActive) return;
      setTimeout(() => {
        navigatePlaylist('next');
      }, 500);
    });

    // Dodaj listener na błędy wideo
    video.addEventListener('error', (e) => {
      console.warn('Video error:', e);
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        setTimeout(() => {
          if (isScriptActive) {
            const newVideo = document.querySelector('video');
            if (newVideo) setupVideoListeners(newVideo);
          }
        }, 2000);
      }
    });

    // Reset retry count po udanym załadowaniu
    video.addEventListener('canplaythrough', () => {
      retryCount = 0;
    });

    updateControls();
  }

  // Ulepszona funkcja wyłączania zapętlenia
  function disableSingleVideoLoop() {
    if (!isScriptActive) return;

    setTimeout(() => {
      const video = document.querySelector('video');
      if (video) {
        video.loop = false;
      }

      const loopButton = document.querySelector('.ytp-loop-button');
      if (loopButton && loopButton.getAttribute('aria-checked') === 'true') {
        loopButton.click();
      }
    }, 1000);
  }

  function updateControls() {
    if (!isScriptActive) return;

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
      // Sprawdź czy wartości rzeczywiście się zmieniły przed ich ustawieniem
      if (video.muted !== isMuted) {
        video.muted = isMuted;
      }
      if (Math.abs(video.volume - volume) > 0.01) {
        video.volume = volume;
      }
    }
  }

  function updateTrackList() {
    if (!isScriptActive) return;

    getPlaylistData();
    const tracklistEl = document.getElementById('fangea-tracklist');
    const currentTitleEl = document.getElementById('fangea-current-title');

    if (!tracklistEl || !currentTitleEl) return;

    if (playlistData[currentTrackIndex]) {
      currentTitleEl.textContent = playlistData[currentTrackIndex].title;
    }

    while (tracklistEl.firstChild) {
      tracklistEl.removeChild(tracklistEl.firstChild);
    }

    for (let i = 1; i <= 3; i++) {
      const nextIndex = (currentTrackIndex + i) % playlistData.length;
      if (playlistData[nextIndex]) {
        const trackDiv = document.createElement('div');
        trackDiv.className = 'track-item upcoming';
        trackDiv.textContent = playlistData[nextIndex].title;
        tracklistEl.appendChild(trackDiv);
      }
    }
  }

  // Ulepszona nawigacja z timeout protection
  function navigatePlaylist(direction) {
    if (!isScriptActive) return;

    try {

      // Zapobiegnij wielokrotnym szybkim kliknięciom
      if (window.fangeaNavigating) {
        return;
      }

      window.fangeaNavigating = true;

      setTimeout(() => {
        window.fangeaNavigating = false;
      }, 2000);

      if (direction === 'next') {
        const nextBtn = document.querySelector('.ytp-next-button');
        if (nextBtn) {
          nextBtn.click();
        } else {
          // Fallback - przejdź do następnego utworu przez playlist
          const playlistItems = document.querySelectorAll('#playlist ytd-playlist-panel-video-renderer');
          if (playlistItems.length > currentTrackIndex + 1) {
            const nextItem = playlistItems[currentTrackIndex + 1];
            const link = nextItem.querySelector('a');
            if (link) window.location.href = link.href;
          }
        }
      } else if (direction === 'prev') {
        const prevBtn = document.querySelector('.ytp-prev-button');
        if (prevBtn) {
          prevBtn.click();
        } else {
          // Fallback
          const playlistItems = document.querySelectorAll('#playlist ytd-playlist-panel-video-renderer');
          if (currentTrackIndex > 0) {
            const prevItem = playlistItems[currentTrackIndex - 1];
            const link = prevItem.querySelector('a');
            if (link) window.location.href = link.href;
          }
        }
      } else if (direction === 'first') {
        const playlistItems = document.querySelectorAll('#playlist ytd-playlist-panel-video-renderer');
        if (playlistItems.length > 0) {
          const firstItem = playlistItems[0];
          const link = firstItem.querySelector('a');
          if (link) window.location.href = link.href;
        }
      }
    } catch (e) {
      console.warn('Błąd nawigacji:', e);
      window.fangeaNavigating = false;
    }
  }

  function createPanel() {

    if (!isScriptActive) return;

    // Usuń poprzedni panel
    const existingPanel = document.getElementById('fangea-panel');
    const existingBg = document.getElementById('fangea-bg');
    const existingControls = document.querySelectorAll('.fangea-control');
    const existingReturn = document.getElementById('fangea-return');

    if (existingPanel) existingPanel.remove();
    if (existingBg) existingBg.remove();
    if (existingReturn) existingReturn.remove();
    existingControls.forEach(ctrl => ctrl.remove());

    if (!document.body) {
      setTimeout(createPanel, 500);
      return;
    }


    const bg = document.createElement('div');
    bg.id = 'fangea-bg';
    document.body.appendChild(bg);

    const panel = document.createElement('div');
    panel.id = 'fangea-panel';

    const logo = document.createElement('div');
    logo.id = 'fangea-logo';
    if (playlistThumb) {
      logo.style.backgroundImage = `url("${playlistThumb}")`;
    }
    panel.appendChild(logo);

    const info = document.createElement('div');
    info.id = 'fangea-info';

    const title = document.createElement('div');
    title.id = 'fangea-title';
    const span = document.createElement('span');
    span.textContent = playlistTitle || 'Playlist';
    title.appendChild(span);
    info.appendChild(title);

    const currentTrack = document.createElement('div');
    currentTrack.id = 'fangea-current-track';

    const nowPlayingLabel = document.createElement('div');
    nowPlayingLabel.style.fontSize = '0.7rem';
    nowPlayingLabel.style.marginBottom = '0.2rem';
    nowPlayingLabel.style.opacity = '0.7';
    nowPlayingLabel.textContent = 'TERAZ GRA:';

    const currentTitle = document.createElement('div');
    currentTitle.id = 'fangea-current-title';
    currentTitle.textContent = 'Loading...';

    currentTrack.appendChild(nowPlayingLabel);
    currentTrack.appendChild(currentTitle);
    info.appendChild(currentTrack);

    const trackListContainer = document.createElement('div');
    trackListContainer.id = 'fangea-tracklist';
    info.appendChild(trackListContainer);

    panel.appendChild(info);

    const ctr = document.createElement('div');
    ctr.id = 'fangea-controls';

    const btn = document.createElement('button');
    btn.id = 'fangea-toggle';
    const icon = document.createElement('i');
    icon.className = isMuted ? 'fas fa-circle-play fa-2x' : 'fas fa-circle-pause fa-2x';
    btn.appendChild(icon);

    btn.onclick = () => {
      if (!isScriptActive) return;

      const video = document.querySelector('video');
      if (onPlaylist()) {
        const links = [...document.querySelectorAll('a.ytd-playlist-video-renderer')];
        const random = links[Math.floor(Math.random() * links.length)];
        if (random) window.location.href = random.href;
      } else if (onWatch() && video) {
        isMuted = !isMuted;
        GM_setValue('fangeaMuted', isMuted);

        // Wymuszenie zmiany stanu
        setTimeout(() => {
          video.muted = isMuted;
          updateControls();
        }, 50);
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
      if (!isScriptActive) return;

      const v = document.querySelector('video');
      if (v) {
        volume = parseFloat(vol.value);
        GM_setValue('fangeaVolume', volume);
        v.volume = volume;
        if (isMuted && volume > 0) {
          isMuted = false;
          GM_setValue('fangeaMuted', false);
          v.muted = false;
          updateControls();
        }
      }
    };
    ctr.appendChild(vol);

    panel.appendChild(ctr);
    document.body.appendChild(panel);

    // Dodaj kontrolki nawigacji
    const controlsData = [
      { id: 'fangea-first', icon: 'fas fa-step-backward', action: 'first' },
      { id: 'fangea-prev', icon: 'fas fa-chevron-left', action: 'prev' },
      { id: 'fangea-next', icon: 'fas fa-chevron-right', action: 'next' }
    ];

    controlsData.forEach(ctrl => {
      const btn = document.createElement('button');
      btn.id = ctrl.id;
      btn.className = 'fangea-control';

      const icon = document.createElement('i');
      icon.className = ctrl.icon;
      btn.appendChild(icon);

      btn.onclick = () => {
        if (isScriptActive) navigatePlaylist(ctrl.action);
      };
      document.body.appendChild(btn);
    });

    // Dodaj przycisk powrotu
    const returnLink = document.createElement('a');
    returnLink.href = 'https://grumqy.github.io/fangea/radio/';
    returnLink.id = 'fangea-return';

    const returnSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    returnSvg.setAttribute('class', 'svgIcon');
    returnSvg.setAttribute('viewBox', '0 0 384 512');

    const returnPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    returnPath.setAttribute('d', 'M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z');

    returnSvg.appendChild(returnPath);
    returnLink.appendChild(returnSvg);
    document.body.appendChild(returnLink);

    // Wyłącz zapętlenie
    disableSingleVideoLoop();

    // Setup video listeners
    const video = document.querySelector('video');
    if (video) {
      setupVideoListeners(video);
    }

    // Aktualizuj listę utworów po krótkim czasie
    setTimeout(() => {
      if (isScriptActive) updateTrackList();
    }, 2000);

    // Ulepszona obsługa DOM mutations
    if (videoObserver) {
      videoObserver.disconnect();
    }

    videoObserver = new MutationObserver((mutations) => {
      if (!isScriptActive) return;

      let shouldUpdateVideo = false;
      mutations.forEach((mutation) => {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && (node.tagName === 'VIDEO' || node.querySelector('video'))) {
              shouldUpdateVideo = true;
            }
          });
        }
      });

      if (shouldUpdateVideo) {
        setTimeout(() => {
          const video = document.querySelector('video:not([data-fangea-setup])');
          if (video && isScriptActive) {
            setupVideoListeners(video);
            disableSingleVideoLoop();
          }
        }, 500);
      }
    });

    videoObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Regularnie sprawdzaj stan odtwarzacza (co 5 sekund zamiast co 3)
    const healthCheckInterval = setInterval(() => {
      if (!isScriptActive) {
        clearInterval(healthCheckInterval);
        return;
      }

      if (onWatch()) {
        const video = document.querySelector('video');
        if (video && !video.hasAttribute('data-fangea-setup')) {
          setupVideoListeners(video);
        }
        updateTrackList();
      }
    }, 5000);

  }

  // Pobierz dane playlisty
  try {
    if (customPlaylists[listId]) {
      playlistTitle = customPlaylists[listId].title;
      playlistThumb = customPlaylists[listId].thumb;
    } else {
      playlistTitle = 'Fangea Radio';
    }

    getPlaylistData();
  } catch (e) {
    console.warn('Nie udało się pobrać tytułu lub miniaturki:', e);
    playlistTitle = 'Fangea Radio';
  }

  // Ulepszona inicjalizacja
  function initScript() {

    if (!isScriptActive) {
      return;
    }

    if (document.readyState === 'loading') {
      setTimeout(initScript, 2000);
      return;
    }

    const hasPlaylistParam = location.search.includes('list=');
    const isPlaylistPage = location.pathname === '/playlist';
    const isWatchPage = location.pathname === '/watch';


    if (!hasPlaylistParam || (!isPlaylistPage && !isWatchPage)) {
      setTimeout(initScript, 2000);
      return;
    }

    // Sprawdź czy YouTube player jest gotowy
    const moviePlayer = document.getElementById('movie_player');
    if (!moviePlayer) {
      setTimeout(initScript, 1000);
      return;
    }

    createPanel();
  }

  // Funkcja czyszczenia przy zmianie strony
  function cleanup() {
    isScriptActive = false;

    if (videoObserver) {
      videoObserver.disconnect();
      videoObserver = null;
    }

    // Wyczyść globalne zmienne
    window.fangeaNavigating = false;

    // Usuń event listenery z video
    const video = document.querySelector('video[data-fangea-setup]');
    if (video) {
      video.removeAttribute('data-fangea-setup');
    }
  }

  // Rozpocznij po załadowaniu

  // Dodaj CSS
  const style = document.createElement('style');
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);

  // Dodaj FontAwesome
  const fa = document.createElement('link');
  fa.rel = 'stylesheet';
  fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
  (document.head || document.documentElement).appendChild(fa);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScript);
  } else {
    setTimeout(initScript, 1000);
  }

  // Ulepszone monitorowanie zmian URL
  let lastUrl = location.href;
  let urlCheckInterval;

  function startUrlMonitoring() {
    if (urlCheckInterval) clearInterval(urlCheckInterval);

    urlCheckInterval = setInterval(() => {
      if (location.href !== lastUrl) {
        const oldUrl = lastUrl;
        lastUrl = location.href;

        // Wykonaj cleanup
        cleanup();

        // Reset zmiennych
        isScriptActive = true;
        retryCount = 0;

        // Sprawdź czy nowy URL zawiera playlist
        const newListId = new URLSearchParams(location.search).get('list');
        if (newListId) {
          setTimeout(() => {
            if (isScriptActive) {
              initScript();
            }
          }, 1500);
        } else {
        }
      }
    }, 1000); // Sprawdzaj co sekundę zamiast co 500ms
  }

  startUrlMonitoring();

  // Dodaj event listener na window unload
  window.addEventListener('beforeunload', cleanup);


})();
