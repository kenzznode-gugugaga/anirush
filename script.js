// ============================================================
// ANIRUSH — script.js
// Handles interactions for home, detail, and player pages
// ============================================================

// ---- Page Detection ----
const isHome = !!document.getElementById('rail-trending');
const isDetail = !!document.getElementById('seasonTabs');
const isPlayer = !!document.getElementById('player');

// ============================================================
// HOME PAGE
// ============================================================
if (isHome) {
  // --- Navigation Sidebar ---
  const navItems = document.querySelectorAll('.nav-item');
  const navIcons = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>',
    browse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
    watching: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
    fav: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
    profile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1z"/></svg>',
    premium: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9-6.2-3.3-6.2 3.3 1.2-6.9-5-4.9 6.9-1z"/></svg>',
    support: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>'
  };

  navItems.forEach(item => {
    const key = item.getAttribute('data-icon');
    const text = item.textContent.trim();
    item.innerHTML = navIcons[key] + ' ' + text;
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      if (text === 'Home') window.scrollTo(0, 0);
      else {
        // Simulate navigation
        const pageName = text;
        if (pageName === 'Browse') window.location.href = 'anirush-browse.html';
        else alert('Halaman ' + pageName + ' belum dibuat (simulasi)');
      }
    });
  });

  // --- Mobile bottom nav ---
  const bnItems = document.querySelectorAll('.bn-item');
  bnItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      bnItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      const text = item.textContent.trim();
      if (text === 'Home') window.scrollTo(0, 0);
      else if (text === 'Browse') window.location.href = 'anirush-browse.html';
      else if (text === 'Watching') alert('Halaman Watching belum dibuat');
      else if (text === 'Favorites') alert('Halaman Favorites belum dibuat');
      else if (text === 'Profile') alert('Halaman Profile belum dibuat');
    });
  });

  // --- Search filter ---
  const searchInput = document.querySelector('.search-bar input');
  const allCards = document.querySelectorAll('.card');
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    allCards.forEach(card => {
      const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
      card.style.display = title.includes(q) ? '' : 'none';
    });
  });

  // --- Card click to detail ---
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('.card-title').textContent;
      window.location.href = `anirush-detail.html?title=${encodeURIComponent(title)}`;
    });
  });

  // Continue watching card click -> player
  document.querySelectorAll('.card-cw').forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      window.location.href = 'anirush-player.html?ep=12';
    });
  });

  // --- Level up modal ---
  const overlay = document.getElementById('modalOverlay');
  document.getElementById('levelupTrigger').addEventListener('click', () => overlay.classList.add('show'));
  document.getElementById('closeModal').addEventListener('click', () => overlay.classList.remove('show'));
  document.getElementById('laterBtn').addEventListener('click', () => overlay.classList.remove('show'));
  document.getElementById('equipBtn').addEventListener('click', () => overlay.classList.remove('show'));
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('show');
  });

  // --- Favorite button in hero ---
  const favBtn = document.querySelector('.hero-actions .btn-ghost');
  let isFavorite = false;
  favBtn.addEventListener('click', () => {
    isFavorite = !isFavorite;
    favBtn.innerHTML = isFavorite
      ? '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg> Favorited'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg> Favorite';
  });

  // --- Watch Now button -> player ---
  document.querySelector('.hero-actions .btn-primary').addEventListener('click', () => {
    window.location.href = 'anirush-player.html?ep=12';
  });

  // --- Dummy data rendering ---
  const palette = ['#7A0000,#1a0a0a','#4a0d0d,#141414','#5a1414,#0f0f0f','#3a0a12,#111','#611010,#161616','#2c0a0a,#101010'];
  const grad = i => `linear-gradient(150deg, ${palette[i % palette.length].split(',')[0]}, ${palette[i % palette.length].split(',')[1]})`;

  const trending = [
    { t: 'Kagerou no Yami', g: 'Dark Fantasy', r: 8.9, ep: 'EP 24', q: '1080p', rank: 1 },
    { t: 'Crimson Fang Chronicle', g: 'Action', r: 8.6, ep: 'EP 12', q: '1080p', rank: 2 },
    { t: 'Voidwalker Century', g: 'Sci-Fi', r: 8.4, ep: 'EP 18', q: '720p', rank: 3 },
    { t: 'Nightbound Requiem', g: 'Supernatural', r: 9.1, ep: 'EP 09', q: '1080p', rank: 4 },
    { t: 'Ashfall Genesis', g: 'Shounen', r: 8.2, ep: 'EP 30', q: '1080p', rank: 5 },
    { t: 'Ronin Zero', g: 'Historical', r: 8.7, ep: 'EP 15', q: '720p', rank: 6 },
    { t: 'Ember Prince', g: 'Fantasy', r: 8.3, ep: 'EP 21', q: '1080p', rank: 7 }
  ];
  const reco = [
    { t: 'Hollow Static', g: 'Psychological', r: 8.8, ep: 'EP 11', q: '1080p' },
    { t: 'Wraith Circuit', g: 'Cyberpunk', r: 8.5, ep: 'EP 14', q: '1080p' },
    { t: 'Solstice Blade', g: 'Adventure', r: 8.1, ep: 'EP 26', q: '720p' },
    { t: 'Onyx Requiem', g: 'Dark Fantasy', r: 8.9, ep: 'EP 08', q: '1080p' },
    { t: 'Iron Lotus', g: 'Action', r: 8.0, ep: 'EP 19', q: '480p' },
    { t: 'Pale Ember', g: 'Romance', r: 7.9, ep: 'EP 13', q: '720p' }
  ];
  const latest = [
    { t: 'Kagerou no Yami', g: 'S2', r: 8.9, ep: 'EP 12 · NEW', q: '1080p', tag: true },
    { t: 'Crimson Fang Chronicle', g: 'S1', r: 8.6, ep: 'EP 07 · NEW', q: '1080p', tag: true },
    { t: 'Nightbound Requiem', g: 'S1', r: 9.1, ep: 'EP 09 · NEW', q: '1080p', tag: true },
    { t: 'Hollow Static', g: 'S1', r: 8.8, ep: 'EP 11 · NEW', q: '1080p', tag: true },
    { t: 'Voidwalker Century', g: 'S1', r: 8.4, ep: 'EP 18 · NEW', q: '720p', tag: true }
  ];
  const newAnime = ['Thornveil Saga', 'Glasswing Order', 'Obsidian Choir', 'Redline Eclipse', 'Faultline Requiem', 'Marrow & Ash'];
  const movies = [
    { t: 'Kagerou: Eternal Dusk', g: 'Movie', r: 9.0, ep: '2h 04m', q: '1080p' },
    { t: 'Crimson Fang: Origins', g: 'Movie', r: 8.7, ep: '1h 48m', q: '1080p' },
    { t: 'Voidwalker: Requiem', g: 'Movie', r: 8.3, ep: '1h 56m', q: '720p' },
    { t: 'Ashfall: The Reckoning', g: 'Movie', r: 8.5, ep: '2h 11m', q: '1080p' }
  ];

  function starIcon() {
    return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01z"/></svg>';
  }

  function posterCard({ t, g, r, ep, q, rank, tag }) {
    const bg = grad(t.length + (rank || 0));
    return `<div class="card">
      <div class="card-poster" style="background:${bg}">
        <div class="fade"></div>
        ${rank ? `<div class="rank">${String(rank).padStart(2, '0')}</div>` : ''}
        ${tag ? `<div class="new-tag">NEW</div>` : ''}
        ${q ? `<div class="qbadge">${q}</div>` : ''}
        <div class="rate">${starIcon()} ${r}</div>
        <div class="ep-pill">${ep}</div>
      </div>
      <div class="card-title">${t}</div>
      <div class="card-sub">${g}</div>
    </div>`;
  }

  function cwCard({ t, g, pct }) {
    const bg = grad(t.length);
    return `<div class="card card-cw">
      <div class="card-poster" style="background:${bg}">
        <div class="fade"></div>
        <div class="ep-pill">${g}</div>
        <div class="progress"><i style="width:${pct}%"></i></div>
      </div>
      <div class="card-title">${t}</div>
      <div class="card-sub">${pct}% watched</div>
    </div>`;
  }

  function soonCard(t) {
    return `<div class="card card-soon">
      <div class="card-poster">
        <div class="soon-label">COMING SOON</div>
        <button class="notify-btn">Notify Me</button>
      </div>
      <div class="card-title">${t}</div>
      <div class="card-sub">TBA · Season 1</div>
    </div>`;
  }

  document.getElementById('rail-cw').innerHTML = [
    { t: 'Kagerou no Yami', g: 'EP 12', pct: 64 },
    { t: 'Nightbound Requiem', g: 'EP 06', pct: 32 },
    { t: 'Hollow Static', g: 'EP 09', pct: 88 },
    { t: 'Ronin Zero', g: 'EP 14', pct: 20 },
    { t: 'Ember Prince', g: 'EP 18', pct: 47 }
  ].map(cwCard).join('');

  document.getElementById('rail-trending').innerHTML = trending.map(posterCard).join('');
  document.getElementById('rail-reco').innerHTML = reco.map(posterCard).join('');
  document.getElementById('rail-latest').innerHTML = latest.map(posterCard).join('');
  document.getElementById('rail-new').innerHTML = newAnime.map(soonCard).join('');
  document.getElementById('rail-movies').innerHTML = movies.map(posterCard).join('');
}

// ============================================================
// DETAIL PAGE
// ============================================================
if (isDetail) {
  // --- Season data ---
  const seasonData = {
    'Season 1': [
      { n: 1, t: 'Kelahiran Bayangan', dur: '23:14', state: 'watched' },
      { n: 2, t: 'Klan yang Terlupakan', dur: '24:02', state: 'watched' },
      { n: 3, t: 'Pisau di Bawah Bulan', dur: '22:48', state: 'watched' },
      { n: 4, t: 'Perjanjian Berdarah', dur: '23:37', state: 'watched' },
      { n: 5, t: 'Suara dari Reruntuhan', dur: '24:15', state: 'watched' },
      { n: 6, t: 'Api yang Tak Padam', dur: '23:02', state: 'watched' },
      { n: 7, t: 'Wajah di Cermin Retak', dur: '22:55', state: 'watched' },
      { n: 8, t: 'Malam Tanpa Bintang', dur: '23:48', state: 'watched' },
      { n: 9, t: 'Bisikan Iblis Tua', dur: '24:20', state: 'watched' },
      { n: 10, t: 'Jejak yang Terhapus', dur: '23:11', state: 'watched' },
      { n: 11, t: 'Antara Dua Dunia', dur: '22:39', state: 'watched' },
      { n: 12, t: 'Kagerou', dur: '24:44', state: 'inprogress', pct: 64 },
      { n: 13, t: 'Fajar Berdarah', dur: '23:20', state: 'locked' },
      { n: 14, t: 'Rantai Terakhir', dur: '22:58', state: 'locked' }
    ],
    'Season 2': [
      { n: 1, t: 'Rise of the Ash', dur: '24:00', state: 'locked' },
      { n: 2, t: 'The Hollow Crown', dur: '23:45', state: 'locked' },
      { n: 3, t: 'Echoes of the Past', dur: '24:10', state: 'locked' }
    ],
    'Season 3': [
      { n: 1, t: 'New Dawn', dur: '24:20', state: 'locked' }
    ],
    'Final Season': [
      { n: 1, t: 'The Last Flame', dur: '24:00', state: 'locked' }
    ],
    'Movie': [
      { n: 1, t: 'Kagerou: Eternal Dusk', dur: '2h 04m', state: 'locked' }
    ],
    'OVA': [
      { n: 1, t: 'Special: The Missing Page', dur: '23:00', state: 'locked' }
    ],
    'Special': [
      { n: 1, t: 'Behind the Scenes', dur: '20:00', state: 'locked' }
    ]
  };

  const epList = document.getElementById('epList');
  const seasonTabs = document.querySelectorAll('.stab');

  function renderEpisodes(seasonKey) {
    const eps = seasonData[seasonKey] || [];
    epList.innerHTML = eps.map(epRow).join('');
    attachEpisodeListeners();
  }

  function epRow(e) {
    const stateClass = e.state === 'watched' ? 'watched' : e.state === 'inprogress' ? 'inprogress' : '';
    const icon = e.state === 'watched'
      ? `<svg class="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polyline points="20 6 9 17 4 12"/></svg>`
      : `<span class="ep-num">${String(e.n).padStart(2, '0')}</span>`;
    return `<div class="ep-row ${stateClass}">
      <div style="text-align:center">${icon}</div>
      <div class="ep-body">
        <div class="ep-title">Episode ${e.n} — ${e.t}</div>
        <div class="ep-sub"><span>${e.state === 'inprogress' ? e.pct + '% watched' : e.state === 'watched' ? 'Watched' : 'Not started'}</span>
          <div class="ep-progress"><i style="width:${e.pct || 0}%"></i></div>
        </div>
      </div>
      <div class="ep-dur">${e.dur}</div>
      <button class="ep-watch-btn" data-ep="${e.n}"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></button>
    </div>`;
  }

  function attachEpisodeListeners() {
    document.querySelectorAll('.ep-watch-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const ep = btn.getAttribute('data-ep');
        window.location.href = `anirush-player.html?ep=${ep}`;
      });
    });
  }

  seasonTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      seasonTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const season = tab.textContent.trim();
      renderEpisodes(season);
    });
  });

  // initial render
  renderEpisodes('Season 1');

  // --- Favorite toggle ---
  const favBtn = document.getElementById('favBtn');
  let fav = false;
  favBtn.addEventListener('click', () => {
    fav = !fav;
    favBtn.innerHTML = fav
      ? '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg> Favorited'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg> Favorite';
  });

  // --- Watch Now button -> player ---
  document.getElementById('watchNow').addEventListener('click', () => {
    window.location.href = 'anirush-player.html?ep=12';
  });

  // --- Back button -> home ---
  document.querySelector('.back').addEventListener('click', () => {
    window.location.href = 'anirush-home.html';
  });

  // --- Comments ---
  const commentsData = [
    { user: 'shirokage_', time: '2j lalu', text: 'Animasi episode 12 gila sih, fight scene-nya smooth banget. Rush Level gue naik terus gara-gara nonton ini 🔥', likes: 34, spoiler: false },
    { user: 'demonfan88', time: '5j lalu', text: 'akhirnya tau siapa yang bunuh gurunya di [spoiler]episode 9, ternyata kakaknya sendiri gila plot twist parah[/spoiler]', likes: 58, spoiler: true },
    { user: 'ashwatcher', time: '1h lalu', text: 'studio emberlight emang selalu niat kalo urusan sound design, BGM pas scene reruntuhan itu nempel banget di kepala.', likes: 12, spoiler: false }
  ];

  function renderComments() {
    const commentList = document.getElementById('commentList');
    commentList.innerHTML = commentsData.map(commentHTML).join('');
    document.querySelectorAll('.reveal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const box = btn.closest('.spoiler-box');
        box.querySelector('.warn').style.display = 'none';
        btn.style.display = 'none';
        box.querySelector('.spoiler-revealed').style.display = 'block';
      });
    });
    document.querySelectorAll('.comment-actions button:first-child').forEach(btn => {
      btn.addEventListener('click', () => {
        const likeSpan = btn.querySelector('span');
        let likes = parseInt(likeSpan.textContent);
        likeSpan.textContent = likes + 1;
      });
    });
  }

  function commentHTML(c) {
    const initials = c.user.slice(0, 2).toUpperCase();
    let body;
    if (c.spoiler) {
      const clean = c.text.replace(/\[spoiler\]|\[\/spoiler\]/g, '');
      body = `<div class="spoiler-box">
        <div class="warn">⚠ SPOILER WARNING — klik untuk melihat</div>
        <button class="reveal-btn">Reveal Spoiler</button>
        <div class="spoiler-revealed comment-text">${clean}</div>
      </div>`;
    } else {
      body = `<div class="comment-text">${c.text}</div>`;
    }
    return `<div class="comment">
      <div class="c-avatar">${initials}</div>
      <div class="comment-body">
        <div class="comment-head"><span class="comment-user">${c.user}</span><span class="comment-time">${c.time}</span></div>
        ${body}
        <div class="comment-actions">
          <button><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-6 0v4H4l1 11h14l1-11h-4z"/></svg> <span>${c.likes}</span></button>
          <button>Reply</button>
          <button>Report</button>
        </div>
      </div>
    </div>`;
  }

  renderComments();

  const postBtn = document.getElementById('postComment');
  const textarea = document.querySelector('.c-input-box textarea');
  postBtn.addEventListener('click', () => {
    const text = textarea.value.trim();
    if (!text) return;
    commentsData.unshift({ user: 'ryu', time: 'Baru saja', text: text, likes: 0, spoiler: false });
    renderComments();
    textarea.value = '';
  });
}

// ============================================================
// PLAYER PAGE
// ============================================================
if (isPlayer) {
  // --- Player state ---
  let isPlaying = false;
  let currentTime = 14 * 60 + 32; // 14:32
  const totalTime = 24 * 60 + 44; // 24:44
  const player = document.getElementById('player');
  const timeline = player.querySelector('.timeline');
  const progress = timeline.querySelector('i');
  const knob = timeline.querySelector('.knob');
  const timeTxt = document.getElementById('timeTxt');
  const playPauseBtn = document.getElementById('playPauseBtn');
  let playbackInterval = null;

  function updateTimeline() {
    const pct = (currentTime / totalTime) * 100;
    progress.style.width = pct + '%';
    knob.style.left = pct + '%';
    const mins = Math.floor(currentTime / 60);
    const secs = currentTime % 60;
    const totalMins = Math.floor(totalTime / 60);
    const totalSecs = totalTime % 60;
    timeTxt.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')} / ${String(totalMins).padStart(2, '0')}:${String(totalSecs).padStart(2, '0')}`;
  }

  function togglePlay() {
    isPlaying = !isPlaying;
    playPauseBtn.innerHTML = isPlaying
      ? '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    const toast = document.querySelector('.resume-toast');
    if (toast) toast.style.display = 'none';
    if (isPlaying) {
      playbackInterval = setInterval(() => {
        currentTime += 1;
        if (currentTime >= totalTime) {
          clearInterval(playbackInterval);
          if (document.getElementById('autoNextToggle').classList.contains('active')) {
            document.getElementById('nextBtn').click();
          }
        }
        updateTimeline();
      }, 1000);
    } else {
      clearInterval(playbackInterval);
    }
  }

  playPauseBtn.addEventListener('click', togglePlay);
  document.getElementById('playBtn').addEventListener('click', togglePlay);

  // --- Timeline click to seek ---
  timeline.addEventListener('click', (e) => {
    const rect = timeline.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    currentTime = (pct / 100) * totalTime;
    updateTimeline();
  });

  // --- Volume ---
  const volBar = document.getElementById('volBar');
  volBar.addEventListener('click', (e) => {
    const rect = volBar.getBoundingClientRect();
    const pct = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    volBar.querySelector('i').style.width = pct * 100 + '%';
  });

  // --- Skip Intro ---
  const skipBtn = document.querySelector('.skip-intro');
  skipBtn.addEventListener('click', () => {
    currentTime = 20 * 60;
    updateTimeline();
    skipBtn.style.display = 'none';
  });

  // --- Quality menu ---
  const qbtn = document.getElementById('qbtn');
  qbtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const qualities = ['1080p', '720p', '480p', '360p'];
    const choice = prompt('Pilih kualitas:', qualities.join(', '));
    if (choice && qualities.includes(choice)) {
      qbtn.textContent = choice;
    }
  });

  // --- Auto Next toggle ---
  const autoNextToggle = document.getElementById('autoNextToggle');
  autoNextToggle.addEventListener('click', () => {
    const switchEl = autoNextToggle.querySelector('.switch');
    switchEl.classList.toggle('active');
    switchEl.style.backgroundColor = switchEl.classList.contains('active') ? 'var(--red)' : '#666';
  });

  // --- Back button ---
  document.getElementById('backBtn').addEventListener('click', () => {
    window.location.href = 'anirush-detail.html?title=Kagerou%20no%20Yami';
  });

  // --- Episode list navigation ---
  const miniEps = document.querySelectorAll('.mini-ep');
  miniEps.forEach(ep => {
    ep.addEventListener('click', () => {
      const title = ep.querySelector('.mini-title').textContent;
      const epNum = title.match(/EP (\d+)/)[1];
      window.location.href = `anirush-player.html?ep=${epNum}`;
    });
  });

  // --- Next/Prev buttons ---
  const nextBtn = document.getElementById('nextBtn');
  nextBtn.addEventListener('click', () => {
    const url = new URL(window.location.href);
    let ep = parseInt(url.searchParams.get('ep') || '12');
    ep = Math.min(ep + 1, 24);
    window.location.href = `anirush-player.html?ep=${ep}`;
  });

  const prevBtn = document.getElementById('prevBtn');
  prevBtn.addEventListener('click', () => {
    const url = new URL(window.location.href);
    let ep = parseInt(url.searchParams.get('ep') || '12');
    ep = Math.max(ep - 1, 1);
    window.location.href = `anirush-player.html?ep=${ep}`;
  });

  // --- Comments ---
  const commentsData = [
    { user: 'shirokage_', time: '2j lalu', text: 'Episode ini gila! 😭', likes: 12 },
    { user: 'demonfan88', time: '5j lalu', text: 'Plot twist parah!', likes: 34 }
  ];

  function renderComments() {
    const commentList = document.getElementById('commentList');
    commentList.innerHTML = commentsData.map(c => `
      <div class="comment">
        <div class="c-avatar">${c.user.slice(0, 2).toUpperCase()}</div>
        <div class="comment-body">
          <div class="comment-head"><span class="comment-user">${c.user}</span><span class="comment-time">${c.time}</span></div>
          <div class="comment-text">${c.text}</div>
          <div class="comment-actions">
            <button><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-6 0v4H4l1 11h14l1-11h-4z"/></svg> ${c.likes}</button>
            <button>Reply</button>
            <button>Report</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  renderComments();

  const postBtn = document.getElementById('postCommentBtn');
  const input = document.getElementById('commentInput');
  postBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) return;
    commentsData.unshift({ user: 'ryu', time: 'Baru saja', text: text, likes: 0 });
    renderComments();
    input.value = '';
  });

  // --- Countdown auto-next ---
  let cd = 8;
  const cdEl = document.getElementById('countdown');
  const timer = setInterval(() => {
    cd--;
    cdEl.textContent = String(Math.max(cd, 0)).padStart(2, '0');
    if (cd <= 0) {
      clearInterval(timer);
      if (autoNextToggle.classList.contains('active')) {
        nextBtn.click();
      }
    }
  }, 1000);

  // --- Initialize timeline ---
  updateTimeline();
}

// ============================================================
// BROWSE PAGE
// ============================================================
const isBrowse = !!document.getElementById('animeGrid');
if (isBrowse) {
  // --- Navigation sidebar ---
  const navItems = document.querySelectorAll('.nav-item');
  const navIcons = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>',
    browse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
    watching: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
    fav: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
    profile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1z"/></svg>',
    premium: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9-6.2-3.3-6.2 3.3 1.2-6.9-5-4.9 6.9-1z"/></svg>',
    support: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>'
  };
  navItems.forEach(item => {
    const key = item.getAttribute('data-icon');
    const text = item.textContent.trim();
    item.innerHTML = navIcons[key] + ' ' + text;
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      if (text === 'Home') window.location.href = 'anirush-home.html';
      else if (text === 'Browse') window.scrollTo(0,0);
      else alert('Halaman ' + text + ' belum dibuat (simulasi)');
    });
  });

  // --- Mobile bottom nav ---
  document.querySelectorAll('.bn-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const href = item.getAttribute('href');
      if (href) window.location.href = href;
      else e.preventDefault();
    });
  });

  // --- Data anime (mock) ---
  const animeList = [
    { title: 'Kagerou no Yami', genre: 'Dark Fantasy', rating: 8.9, ep: '24 Ep', quality: '1080p', type: 'series', season: '2', status: 'ongoing' },
    { title: 'Crimson Fang Chronicle', genre: 'Action', rating: 8.6, ep: '12 Ep', quality: '1080p', type: 'series', season: '1', status: 'ongoing' },
    { title: 'Voidwalker Century', genre: 'Sci-Fi', rating: 8.4, ep: '18 Ep', quality: '720p', type: 'series', season: '1', status: 'ongoing' },
    { title: 'Nightbound Requiem', genre: 'Supernatural', rating: 9.1, ep: '09 Ep', quality: '1080p', type: 'series', season: '1', status: 'ongoing' },
    { title: 'Ashfall Genesis', genre: 'Shounen', rating: 8.2, ep: '30 Ep', quality: '1080p', type: 'series', season: '1', status: 'completed' },
    { title: 'Ronin Zero', genre: 'Historical', rating: 8.7, ep: '15 Ep', quality: '720p', type: 'series', season: '1', status: 'ongoing' },
    { title: 'Ember Prince', genre: 'Fantasy', rating: 8.3, ep: '21 Ep', quality: '1080p', type: 'series', season: '1', status: 'completed' },
    { title: 'Hollow Static', genre: 'Psychological', rating: 8.8, ep: '11 Ep', quality: '1080p', type: 'series', season: '1', status: 'ongoing' },
    { title: 'Wraith Circuit', genre: 'Cyberpunk', rating: 8.5, ep: '14 Ep', quality: '1080p', type: 'series', season: '1', status: 'ongoing' },
    { title: 'Solstice Blade', genre: 'Adventure', rating: 8.1, ep: '26 Ep', quality: '720p', type: 'series', season: '2', status: 'completed' },
    { title: 'Onyx Requiem', genre: 'Dark Fantasy', rating: 8.9, ep: '08 Ep', quality: '1080p', type: 'movie', season: '-', status: 'completed' },
    { title: 'Iron Lotus', genre: 'Action', rating: 8.0, ep: '19 Ep', quality: '480p', type: 'series', season: '1', status: 'completed' },
    { title: 'Pale Ember', genre: 'Romance', rating: 7.9, ep: '13 Ep', quality: '720p', type: 'series', season: '1', status: 'ongoing' },
    { title: 'Kagerou: Eternal Dusk', genre: 'Dark Fantasy', rating: 9.0, ep: 'Movie', quality: '1080p', type: 'movie', season: '-', status: 'completed' },
    { title: 'Crimson Fang: Origins', genre: 'Action', rating: 8.7, ep: 'Movie', quality: '1080p', type: 'movie', season: '-', status: 'completed' },
    { title: 'Thornveil Saga', genre: 'Dark Fantasy', rating: null, ep: 'Coming Soon', quality: '-', type: 'series', season: '1', status: 'upcoming' },
    { title: 'Glasswing Order', genre: 'Fantasy', rating: null, ep: 'Coming Soon', quality: '-', type: 'series', season: '1', status: 'upcoming' }
  ];

  const grid = document.getElementById('animeGrid');
  const emptyState = document.getElementById('emptyState');

  function renderGrid(list) {
    if (list.length === 0) {
      grid.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }
    emptyState.style.display = 'none';
    grid.innerHTML = list.map(cardHTML).join('');
    attachGridListeners();
  }

  function cardHTML(anime) {
    if (anime.status === 'upcoming') {
      return `<div class="grid-card" data-title="${anime.title}">
        <div class="poster">
          <div class="coming-soon">
            <div class="label">COMING SOON</div>
            <button class="notify-btn" onclick="event.stopPropagation(); alert('Notifikasi untuk ${anime.title} telah diaktifkan!')">Notify Me</button>
          </div>
        </div>
        <div class="title">${anime.title}</div>
        <div class="sub">${anime.genre} · TBA</div>
      </div>`;
    }
    const bg = `linear-gradient(150deg, ${anime.title.length % 2 ? '#5a1414' : '#3a0a12'}, #0f0f0f)`;
    return `<div class="grid-card" data-title="${anime.title}">
      <div class="poster" style="background:${bg}">
        <div class="fade"></div>
        ${anime.quality !== '-' ? `<div class="qbadge">${anime.quality}</div>` : ''}
        ${anime.rating ? `<div class="rate"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01z"/></svg> ${anime.rating}</div>` : ''}
        <div class="ep-pill">${anime.ep}</div>
      </div>
      <div class="title">${anime.title}</div>
      <div class="sub">${anime.genre} · ${anime.season !== '-' ? 'S'+anime.season : 'Movie'}</div>
    </div>`;
  }

  function attachGridListeners() {
    document.querySelectorAll('.grid-card').forEach(card => {
      card.addEventListener('click', () => {
        const title = card.getAttribute('data-title');
        window.location.href = `anirush-detail.html?title=${encodeURIComponent(title)}`;
      });
    });
  }

  // --- Filter logic ---
  const searchInput = document.getElementById('searchInput');
  const typeSelect = document.getElementById('filterType');
  const seasonSelect = document.getElementById('filterSeason');
  const genreSelect = document.getElementById('filterGenre');
  const statusSelect = document.getElementById('filterStatus');

  function applyFilters() {
    const q = searchInput.value.toLowerCase().trim();
    const type = typeSelect.value;
    const season = seasonSelect.value;
    const genre = genreSelect.value;
    const status = statusSelect.value;

    const filtered = animeList.filter(anime => {
      // search
      if (q && !anime.title.toLowerCase().includes(q)) return false;
      // type
      if (type !== 'all' && anime.type !== type) return false;
      // season
      if (season !== 'all') {
        if (anime.season === '-') return false;
        if (season === 'final' && anime.season !== 'final') return false;
        if (season !== 'final' && anime.season !== season) return false;
      }
      // genre (case-insensitive, partial match)
      if (genre !== 'all' && !anime.genre.toLowerCase().includes(genre.replace(/-/g, ' '))) return false;
      // status
      if (status !== 'all') {
        if (status === 'ongoing' && anime.status !== 'ongoing') return false;
        if (status === 'completed' && anime.status !== 'completed') return false;
      }
      return true;
    });
    renderGrid(filtered);
  }

  searchInput.addEventListener('input', applyFilters);
  typeSelect.addEventListener('change', applyFilters);
  seasonSelect.addEventListener('change', applyFilters);
  genreSelect.addEventListener('change', applyFilters);
  statusSelect.addEventListener('change', applyFilters);

  // Initial render
  renderGrid(animeList);
}
