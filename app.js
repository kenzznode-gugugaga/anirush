// =====================================================
// ANIRUSH FRONTEND - Connect ke Backend Sendiri
// =====================================================

// ========== KONFIGURASI ==========
// Ganti dengan URL backend lo setelah deploy
const BASE = 'http://localhost:3000';

// ========== STATE GLOBAL ==========
let currentUser = null;
let currentAnime = null;
let currentEpisodes = [];

// ========== ICON HELPER ==========
function starIcon(){return '<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01z"/></svg>';}
function heartIcon(){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z"/></svg>';}
function bellIcon(){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/></svg>';}

// ========== TOAST ==========
function showToast(msg){
    const c=document.getElementById('toastContainer');
    const t=document.createElement('div');
    t.className='toast';
    t.textContent=msg;
    c.appendChild(t);
    setTimeout(()=>{t.style.opacity='0';t.style.transform='translateX(100%)';setTimeout(()=>t.remove(),300);},3000);
}

// ========== AUTH (LocalStorage) ==========
let authMode='login';

function loadState(){
    const u=localStorage.getItem('anirush_currentUser');
    if(u){currentUser=JSON.parse(u);updateAuthUI();loadProfilePage();}
}

function saveUser(){
    if(currentUser){
        localStorage.setItem('anirush_currentUser',JSON.stringify(currentUser));
        const all=JSON.parse(localStorage.getItem('anirush_users')||'[]');
        const idx=all.findIndex(x=>x.email===currentUser.email);
        if(idx>-1)all[idx]=currentUser;
        else all.push(currentUser);
        localStorage.setItem('anirush_users',JSON.stringify(all));
    }
}

function openAuthModal(mode='login'){
    authMode=mode;
    document.getElementById('authTitle').textContent=mode==='login'?'Login':'Register';
    document.getElementById('authSubmitBtn').textContent=mode==='login'?'Login':'Create Account';
    document.getElementById('nameGroup').style.display=mode==='register'?'block':'none';
    document.getElementById('authSwitchText').textContent=mode==='login'?"Don't have an account?":"Already have an account?";
    document.getElementById('switchAuth').textContent=mode==='login'?'Register':'Login';
    document.getElementById('authError').classList.remove('show');
    document.getElementById('authForm').reset();
    showModal('authModal');
}

function switchAuth(){
    authMode=authMode==='login'?'register':'login';
    openAuthModal(authMode);
}

function handleAuth(e){
    e.preventDefault();
    const email=document.getElementById('authEmail').value.trim();
    const password=document.getElementById('authPassword').value;
    const username=document.getElementById('authUsername').value.trim();
    const err=document.getElementById('authError');
    err.classList.remove('show');

    if(authMode==='register'){
        if(!username||!email||!password){
            err.textContent='Fill all fields';err.classList.add('show');return;
        }
        const users=JSON.parse(localStorage.getItem('anirush_users')||'[]');
        if(users.find(u=>u.email===email)){
            err.textContent='Email already registered';err.classList.add('show');return;
        }
        currentUser={
            username:username,email:email,password:password,
            premium:false,quality:'480p',bio:'',
            favorites:[],watchlist:[],history:[],comments:[]
        };
        saveUser();updateAuthUI();loadProfilePage();
        closeModal('authModal');
        showToast('Welcome, '+username+'! 🎉');
    } else {
        const users=JSON.parse(localStorage.getItem('anirush_users')||'[]');
        const user=users.find(u=>u.email===email&&u.password===password);
        if(!user){
            err.textContent='Invalid email or password';err.classList.add('show');return;
        }
        currentUser=user;saveUser();updateAuthUI();loadProfilePage();
        closeModal('authModal');
        showToast('Logged in as '+user.username);
    }
}

function updateAuthUI(){
    const avatar=document.getElementById('avatarBtn');
    const dd=document.querySelector('.dd-user');
    const login=document.getElementById('loginLink');
    const prof=document.getElementById('profileLink');
    const upg=document.getElementById('upgradeLink');
    const out=document.getElementById('logoutLink');

    if(currentUser){
        const ini=currentUser.username.charAt(0).toUpperCase();
        avatar.textContent=ini;
        dd.querySelector('.name').textContent=currentUser.username;
        dd.querySelector('.rank').textContent=currentUser.premium?'Premium Member':'Free Crew';
        login.style.display='none';prof.style.display='block';
        upg.style.display=currentUser.premium?'none':'block';out.style.display='block';
    } else {
        avatar.textContent='GU';
        dd.querySelector('.name').textContent='Guest';
        dd.querySelector('.rank').textContent='Not logged in';
        login.style.display='block';prof.style.display='none';
        upg.style.display='none';out.style.display='none';
    }
}

function logout(){
    currentUser=null;
    localStorage.removeItem('anirush_currentUser');
    updateAuthUI();loadProfilePage();
    showToast('Logged out');
}

// ========== MODAL HELPERS ==========
function showModal(id){document.getElementById(id).classList.add('show');}
function closeModal(id){document.getElementById(id).classList.remove('show');}

// ========== PREMIUM ==========
let selectedPlan=null;
function selectPlan(el){
    document.querySelectorAll('.plan-card').forEach(c=>c.classList.remove('selected'));
    el.classList.add('selected');
    selectedPlan=el.dataset;
}
function confirmPremium(){
    if(!currentUser)return;
    if(!selectedPlan){showToast('Please select a plan');return;}
    currentUser.premium=true;
    saveUser();updateAuthUI();loadProfilePage();
    closeModal('premiumModal');
    showToast('Premium activated! 🏆');
}

// =====================================================
// API CONNECT KE BACKEND SENDIRI
// =====================================================

// 1. Get Homepage/Trending
async function fetchTrending(){
    const grid=document.getElementById('trendingGrid');
    try{
        const res=await fetch(`${BASE}/api/home`);
        const data=await res.json();
        // Anilist trending format: data.results
        const results=(data.results || []).slice(0,12);
        grid.innerHTML=results.map(a=>`
            <div class="card">
                <div class="poster" style="background:url('${a.cover || a.image}') center/cover no-repeat;">
                    <div class="rank-badge">★</div>
                    <button class="like-btn" data-id="${a.id}">${heartIcon()}</button>
                    <div class="ep-badge">${a.totalEpisodes ? 'EP '+a.totalEpisodes : ''}</div>
                </div>
                <div class="card-body">
                    <div class="card-title">${a.title?.english || a.title?.romaji || a.title}</div>
                    <div class="card-foot">
                        <div class="stars">${starIcon()} ${a.score || 'N/A'}</div>
                        <div class="genre-tag">${a.type || 'Sub'}</div>
                    </div>
                    <button class="watch-btn" style="width:100%;margin-top:8px;" 
                        onclick="handleWatch('${a.id}','${(a.title?.english||a.title?.romaji||a.title).replace(/'/g,"\\'")}')">
                        Watch
                    </button>
                </div>
            </div>
        `).join('');
    }catch(error){
        console.error('Trending error:',error);
        grid.innerHTML='<p style="color:var(--muted);">Gagal load data. Backend belum jalan?</p>';
    }
}

// Handle watch dari trending (Anilist ID → cari di AnimePahe)
async function handleWatch(anilistId, title){
    // Karena trending dari Anilist, kita perlu cari slug AnimePahe
    // Fallback: coba search langsung dengan title
    try{
        const searchRes = await fetch(`${BASE}/api/search?q=${encodeURIComponent(title)}`);
        const searchData = await searchRes.json();
        const firstResult = searchData.results?.[0];
        if(firstResult){
            openPlayer(firstResult.id, title);
        } else {
            showToast('Anime tidak ditemukan');
        }
    } catch(e) {
        showToast('Gagal mencari anime');
    }
}

// 2. Search Anime
async function searchAnime(query){
    const res=await fetch(`${BASE}/api/search?q=${encodeURIComponent(query)}`);
    const data=await res.json();
    return data.results || [];
}

// 3. Get Anime Info
async function getAnimeInfo(animeId){
    const res=await fetch(`${BASE}/api/info/${animeId}`);
    return await res.json();
}

// 4. Get Stream URL
async function getStreamUrl(episodeId){
    const res=await fetch(`${BASE}/api/watch/${episodeId}`);
    const data=await res.json();
    return data.sources?.[0]?.url || null;
}

// ========== OPEN PLAYER ==========
async function openPlayer(animeId, title){
    showModal('playerModal');
    const video=document.getElementById('playerVideo');
    video.src='';video.poster='';video.load();

    const info=await getAnimeInfo(animeId);
    if(!info||!info.episodes||!info.episodes.length){
        video.src='https://www.w3schools.com/html/mov_bbb.mp4';
        video.play();
        showToast('Episodes not found, menggunakan video demo');
        return;
    }

    currentAnime={id:animeId,title:info.title,episodes:info.episodes};
    currentEpisodes=info.episodes;

    const epList=document.getElementById('episodeList');
    epList.innerHTML=currentEpisodes.map((ep,i)=>`
        <button class="ep-btn" data-ep-id="${ep.id}" 
            style="display:block;width:100%;padding:8px;margin-bottom:4px;background:rgba(255,255,255,0.05);border:1px solid var(--border);border-radius:8px;color:var(--text);text-align:left;cursor:pointer;transition:background .2s;">
            Episode ${ep.number}
        </button>
    `).join('');

    document.querySelectorAll('.ep-btn').forEach(btn=>{
        btn.addEventListener('click',async function(){
            const epId=this.dataset.epId;
            const streamUrl=await getStreamUrl(epId);
            if(!streamUrl){showToast('Failed to load stream');return;}
            video.src=streamUrl;video.play();
            if(currentUser&&currentAnime){
                if(!currentUser.history.includes(animeId)){currentUser.history.push(animeId);saveUser();}
            }
        });
    });

    // Auto play episode pertama
    if(currentEpisodes.length>0){
        const firstEp=currentEpisodes[0];
        const streamUrl=await getStreamUrl(firstEp.id);
        if(streamUrl){video.src=streamUrl;video.play();}
        else{showToast('Streaming failed, mencoba video demo');video.src='https://www.w3schools.com/html/mov_bbb.mp4';video.play();}
    }

    loadComments(animeId);
}

function changeQuality(val){showToast('Quality set to '+val);}

// ========== COMMENTS ==========
function getComments(id){
    const all=JSON.parse(localStorage.getItem('anirush_comments')||'{}');
    return all[id]||[];
}
function saveComment(id,c){
    const all=JSON.parse(localStorage.getItem('anirush_comments')||'{}');
    if(!all[id])all[id]=[];
    all[id].push(c);
    localStorage.setItem('anirush_comments',JSON.stringify(all));
    loadComments(id);
}
function loadComments(id){
    const list=document.getElementById('commentList');
    const comments=getComments(id);
    if(comments.length===0){
        list.innerHTML='<p style="color:var(--muted);font-size:13px;">No comments yet.</p>';
    } else {
        list.innerHTML=comments.map((c,i)=>`
            <div class="comment-item">
                <div class="avatar">${c.username.charAt(0).toUpperCase()}</div>
                <div class="c-content">
                    <div class="c-user">${c.username}</div>
                    <div class="c-text">${c.text}</div>
                    <div class="c-meta">${c.time} <span class="c-reply" onclick="replyComment(${i})">Reply</span></div>
                </div>
            </div>
        `).join('');
    }
}
function submitComment(){
    if(!currentUser){openAuthModal('login');return;}
    const input=document.getElementById('commentInput');
    const text=input.value.trim();
    if(!text)return;
    const c={username:currentUser.username,text:text,time:new Date().toLocaleString()};
    saveComment(currentAnime.id,c);
    input.value='';
    showToast('Comment added');
}
function replyComment(index){
    const input=document.getElementById('commentInput');
    input.focus();
    input.value='@'+getComments(currentAnime.id)[index].username+' ';
}

// ========== SEARCH ==========
let searchTimeout;
const searchInput=document.getElementById('searchInput');
const searchResults=document.getElementById('searchResults');

searchInput.addEventListener('input',function(){
    clearTimeout(searchTimeout);
    const q=this.value.trim();
    if(q.length===0){searchResults.style.display='none';return;}
    searchTimeout=setTimeout(async()=>{
        try{
            const results=await searchAnime(q);
            if(results.length===0){
                searchResults.innerHTML='<div style="padding:12px;color:var(--muted);">No results</div>';
            } else {
                searchResults.innerHTML=results.map(a=>`
                    <div style="padding:10px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--border);">
                        <img src="${a.image}" style="width:32px;height:32px;object-fit:cover;border-radius:6px;" onerror="this.style.display='none'">
                        <div style="flex:1;">
                            <strong>${a.title}</strong>
                            <div style="font-size:12px;color:var(--muted);">${a.type||'Sub'}</div>
                        </div>
                        <button class="watch-btn" style="padding:6px 12px;font-size:12px;" 
                            onclick="openPlayer('${a.id}','${a.title.replace(/'/g,"\\'")}')">Watch</button>
                    </div>
                `).join('');
            }
            searchResults.style.display='block';
        }catch(error){
            console.error('Search error:',error);
            searchResults.innerHTML='<div style="padding:12px;color:var(--muted);">Search failed</div>';
            searchResults.style.display='block';
        }
    },500);
});

searchInput.addEventListener('focus',function(){if(this.value.trim().length>0)searchResults.style.display='block';});
document.addEventListener('click',function(e){if(!e.target.closest('.search-box'))searchResults.style.display='none';});

// ========== COMING SOON (Dummy) ==========
const upcomingData=[
    {id:'u1',title:'Reef Reckoning',date:'Sep 12, 2026',target:'2026-09-12T00:00:00',colors:['#0e2f3a','#0d0d0d']},
    {id:'u2',title:'The Marooned King',date:'Sep 20, 2026',target:'2026-09-20T00:00:00',colors:['#241100','#0d0d0d']},
    {id:'u3',title:'Fathom & Fire',date:'Oct 3, 2026',target:'2026-10-03T00:00:00',colors:['#3B0764','#0d0d0d']},
    {id:'u4',title:'Northwind Requiem',date:'Oct 15, 2026',target:'2026-10-15T00:00:00',colors:['#12002b','#062b33']}
];

function renderComingSoon(){
    const strip=document.getElementById('comingStrip');
    strip.innerHTML+=upcomingData.map(a=>`
        <div class="cs-card" data-target="${a.target}">
            <div class="cs-top">
                <div class="cs-thumb" style="background:linear-gradient(160deg,${a.colors[0]},${a.colors[1]});"></div>
                <div>
                    <div class="cs-title">${a.title}</div>
                    <div class="cs-date">Sets sail ${a.date}</div>
                </div>
            </div>
            <div class="countdown" data-i="${a.id}">
                <div class="cd-unit"><div class="num d">--</div><div class="lbl">Days</div></div>
                <div class="cd-unit"><div class="num h">--</div><div class="lbl">Hrs</div></div>
                <div class="cd-unit"><div class="num m">--</div><div class="lbl">Min</div></div>
                <div class="cd-unit"><div class="num s">--</div><div class="lbl">Sec</div></div>
            </div>
            <button class="notify-btn" data-id="${a.id}">${bellIcon()} Notify Me</button>
        </div>
    `).join('');

    document.querySelectorAll('.notify-btn').forEach(btn=>{
        btn.addEventListener('click',function(){
            if(!currentUser){openAuthModal('login');return;}
            const id=this.dataset.id;
            if(!currentUser.watchlist)currentUser.watchlist=[];
            if(!currentUser.watchlist.includes(id)){
                currentUser.watchlist.push(id);this.innerHTML='✓ Added';showToast('Added to whitelist');
            } else {
                currentUser.watchlist=currentUser.watchlist.filter(w=>w!==id);
                this.innerHTML=bellIcon()+' Notify Me';showToast('Removed from whitelist');
            }
            saveUser();loadProfilePage();
        });
    });

    function updateCountdowns(){
        document.querySelectorAll('.cs-card').forEach(card=>{
            const target=new Date(card.dataset.target).getTime();
            const now=Date.now();
            let diff=Math.max(0,target-now);
            const d=Math.floor(diff/86400000);
            const h=Math.floor((diff%86400000)/3600000);
            const m=Math.floor((diff%3600000)/60000);
            const s=Math.floor((diff%60000)/1000);
            card.querySelector('.d').textContent=String(d).padStart(2,'0');
            card.querySelector('.h').textContent=String(h).padStart(2,'0');
            card.querySelector('.m').textContent=String(m).padStart(2,'0');
            card.querySelector('.s').textContent=String(s).padStart(2,'0');
        });
    }
    updateCountdowns();setInterval(updateCountdowns,1000);
}

// ========== EVENTS (Dummy) ==========
const eventData=[
    {id:'e1',title:'Watch Party',desc:'Join live watch party!',date:'Aug 30, 2026'},
    {id:'e2',title:'Anime Vote 2026',desc:'Vote for your favorite series',date:'Sep 1, 2026'},
    {id:'e3',title:'Kuis Berhadiah',desc:'Answer trivia and win premium!',date:'Sep 5, 2026'},
    {id:'e4',title:'Gift Code Drop',desc:'Redeem exclusive gift codes',date:'Sep 10, 2026'}
];

function renderEvents(){
    const grid=document.getElementById('eventGrid');
    grid.innerHTML=eventData.map(e=>`
        <div class="event-card">
            <h3>${e.title}</h3>
            <p>${e.desc}</p>
            <div class="event-timer">Starts: ${e.date}</div>
            <button class="join-btn" data-event="${e.id}">Join Event</button>
        </div>
    `).join('');

    document.querySelectorAll('.join-btn').forEach(btn=>{
        btn.addEventListener('click',function(){
            if(!currentUser){openAuthModal('login');return;}
            showToast('You have joined '+this.dataset.event);
        });
    });
}

// ========== PROFILE PAGE ==========
function showProfilePage(){
    if(!currentUser){openAuthModal('login');return;}
    document.getElementById('home').style.display='none';
    document.getElementById('movies').style.display='none';
    document.getElementById('my-list').style.display='none';
    document.getElementById('profilePage').style.display='block';
    loadProfilePage();
}

function loadProfilePage(){
    if(!currentUser)return;
    document.getElementById('profileAvatar').textContent=currentUser.username.charAt(0).toUpperCase();
    document.getElementById('profileName').textContent=currentUser.username;
    document.getElementById('profileEmail').textContent=currentUser.email;
    document.getElementById('profilePremiumBadge').style.display=currentUser.premium?'inline-block':'none';
    document.getElementById('statFav').textContent=currentUser.favorites?currentUser.favorites.length:0;
    document.getElementById('statWatch').textContent=currentUser.history?currentUser.history.length:0;
    document.getElementById('statComments').textContent=currentUser.comments?currentUser.comments.length:0;

    const favGrid=document.getElementById('favGrid');
    if(currentUser.favorites&&currentUser.favorites.length>0){
        favGrid.innerHTML=currentUser.favorites.map(id=>`
            <div class="card">
                <div class="poster" style="background:linear-gradient(160deg,#3B0764,#0d0d0d);">
                    <div class="ep-badge">Saved</div>
                </div>
                <div class="card-body">
                    <div class="card-title">${id}</div>
                    <button class="watch-btn" style="width:100%;margin-top:8px;" onclick="openPlayer('${id}','${id.replace(/'/g,"\\'")}')">Watch</button>
                </div>
            </div>
        `).join('');
    } else {
        favGrid.innerHTML='<p style="color:var(--muted);">No favorites yet.</p>';
    }

    const watchGrid=document.getElementById('watchGrid');
    if(currentUser.watchlist&&currentUser.watchlist.length>0){
        watchGrid.innerHTML=currentUser.watchlist.map(id=>`
            <div class="card">
                <div class="poster" style="background:linear-gradient(160deg,#241100,#0d0d0d);">
                    <div class="ep-badge">Watchlist</div>
                </div>
                <div class="card-body">
                    <div class="card-title">${id}</div>
                    <button class="watch-btn" style="width:100%;margin-top:8px;" onclick="openPlayer('${id}','${id.replace(/'/g,"\\'")}')">Watch</button>
                </div>
            </div>
        `).join('');
    } else {
        watchGrid.innerHTML='<p style="color:var(--muted);">No watchlist items.</p>';
    }

    const uc=document.getElementById('userComments');
    if(currentUser.comments&&currentUser.comments.length>0){
        uc.innerHTML=currentUser.comments.map(c=>`
            <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px;margin-bottom:8px;">
                <strong>${c.animeTitle}</strong><br>${c.text}
            </div>
        `).join('');
    } else {
        uc.innerHTML='<p style="color:var(--muted);">No comments yet.</p>';
    }

    document.getElementById('defaultQuality').value=currentUser.quality||'480p';
    document.getElementById('bio').value=currentUser.bio||'';
}

// ========== NAVIGATION ==========
document.querySelectorAll('.nav-links a').forEach(link=>{
    link.addEventListener('click',function(e){
        e.preventDefault();
        const target=this.getAttribute('href').replace('#','');
        document.getElementById('home').style.display='none';
        document.getElementById('movies').style.display='none';
        document.getElementById('my-list').style.display='none';
        document.getElementById('profilePage').style.display='none';
        if(target==='home'){document.getElementById('home').style.display='block';}
        else if(target==='trending'){document.getElementById('home').style.display='block';document.getElementById('trending').scrollIntoView({behavior:'smooth'});}
        else if(target==='coming-soon'){document.getElementById('home').style.display='block';document.getElementById('coming-soon').scrollIntoView({behavior:'smooth'});}
        else if(target==='events'){document.getElementById('home').style.display='block';document.getElementById('events').scrollIntoView({behavior:'smooth'});}
        else if(target==='movies'){document.getElementById('movies').style.display='block';}
        else if(target==='my-list'){document.getElementById('my-list').style.display='block';renderMyList();}
        document.querySelectorAll('.nav-links a').forEach(a=>a.classList.remove('active'));
        this.classList.add('active');
    });
});

function renderMyList(){
    const grid=document.getElementById('myListGrid');
    if(!currentUser){grid.innerHTML='<p>Please login to see your list.</p>';return;}
    const watchlist=currentUser.watchlist||[];
    const favs=currentUser.favorites||[];
    const allIds=[...new Set([...watchlist,...favs])];
    if(allIds.length===0){grid.innerHTML='<p>Your list is empty.</p>';return;}
    grid.innerHTML=allIds.map(id=>`
        <div class="card">
            <div class="poster" style="background:linear-gradient(160deg,#1a0b2e,#0d0d0d);">
                <div class="ep-badge">Saved</div>
            </div>
            <div class="card-body">
                <div class="card-title">${id}</div>
                <button class="watch-btn" style="width:100%;margin-top:8px;" onclick="openPlayer('${id}','${id.replace(/'/g,"\\'")}')">Watch</button>
            </div>
        </div>
    `).join('');
}

// ========== SETUP EVENT LISTENERS ==========
function setupEventListeners(){
    document.getElementById('switchAuth').addEventListener('click',(e)=>{e.preventDefault();switchAuth();});
    document.getElementById('loginLink').addEventListener('click',(e)=>{e.preventDefault();openAuthModal('login');});
    document.getElementById('logoutLink').addEventListener('click',(e)=>{e.preventDefault();logout();});
    document.getElementById('premiumBtn').addEventListener('click',()=>{if(!currentUser){openAuthModal('login');return;}showModal('premiumModal');});
    document.getElementById('upgradeLink').addEventListener('click',(e)=>{e.preventDefault();showModal('premiumModal');});
    document.getElementById('profileLink').addEventListener('click',(e)=>{e.preventDefault();showProfilePage();});
    document.querySelectorAll('.modal-close').forEach(btn=>{
        btn.addEventListener('click',function(){this.closest('.modal-overlay').classList.remove('show');});
    });
    document.querySelectorAll('.modal-overlay').forEach(ov=>{
        ov.addEventListener('click',function(e){if(e.target===ov)this.classList.remove('show');});
    });
    document.querySelectorAll('.plan-card').forEach(card=>{
        card.addEventListener('click',function(){selectPlan(this);});
    });
    document.getElementById('confirmPremium').addEventListener('click',confirmPremium);
    document.getElementById('saveSettings').addEventListener('click',function(){
        if(!currentUser)return;
        currentUser.quality=document.getElementById('defaultQuality').value;
        currentUser.bio=document.getElementById('bio').value;
        saveUser();showToast('Settings saved');
    });
    document.querySelectorAll('.tab-btn').forEach(btn=>{
        btn.addEventListener('click',function(){
            document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
            this.classList.add('active');
            const tab=this.dataset.tab;
            document.querySelectorAll('.tab-panel').forEach(p=>p.style.display='none');
            document.getElementById('tab-'+tab).style.display='block';
        });
    });
    document.getElementById('burgerBtn').addEventListener('click',function(){
        const nav=document.querySelector('.nav-links');
        if(nav.style.display==='none')nav.style.display='flex';
        else nav.style.display='none';
    });
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded',()=>{
    loadState();
    fetchTrending();
    renderComingSoon();
    renderEvents();
    setupEventListeners();
});
