/* =========================================================
   CALVAROZ HQ // EASY EDIT CONFIG
   Main group is already connected:
   Group ID: 34922741
   Group URL: https://www.roblox.com/communities/34922741/Calvaroz#!/about
========================================================= */
const SITE_CONFIG={
  CLAN_NAME:"Calvaroz",
  CLAN_SHORT_NAME:"Calvaroz",
  TAGLINE:"BUILD. FIGHT. DOMINATE.",
  GROUP_ID:34922741,
  GROUP_URL:"https://www.roblox.com/communities/34922741/Calvaroz#!/about",
  NON_MEMBER_TEXT:"Player is not Calvarozian",

  /* Manual Calvaroz-specific data.
     CP/Merit/Stats are intentionally manual until you connect a database. */
  PLAYER_DATA:{
    /* "123456789":{cp:250,merit:90,stats:{KOS:12,SERVICE:31,TRAINING:8},note:"Ready for review."} */
  },

  /* Manual CP requirement by rank. If a rank is not listed here, 300 CP is used.
     Example:
     RANK_REQUIREMENTS:{
       "PRIVATE":300,
       "SERGEANT":500
     } */
  RANK_REQUIREMENTS:{},

  /* Fallback only. The live Roblox group roles replace this list after loading. */
  RANKS:[
    {name:"RECRUIT",category:"GROUP ROLE",department:"ROBLOX GROUP",cpRequired:300,nextRank:"—"}
  ],

  /* Manual organization tree. Replace userId/rank entries with your real command structure. */
  ORGANIZATION:{
    commander:{userId:0,rank:"COMMANDER"},
    departments:[
      {name:"SUPREME EMPIRE",description:"Central leadership and command.",divisions:[
        {name:"HIGH COMMAND",description:"Senior command staff.",members:[{userId:1816618479,rank:"EMPEROR"}]}
      ]},
      {name:"OPERATIONS DEPARTMENT",description:"Operational personnel and field divisions.",divisions:[
        {name:"FIELD OPERATIONS",description:"Main operational division.",members:[{userId:0,rank:"CAPTAIN"}]},
        {name:"TRAINING DIVISION",description:"Training and recruitment.",members:[{userId:0,rank:"SERGEANT"}]}
      ]}
    ]
  },

  MEDALS:[
    {code:"M01",name:"MEDAL OF HONOR",description:"Exceptional service and conduct.",criteria:"Exceptional service"},
    {code:"M02",name:"SERVICE CROSS",description:"Outstanding service to the clan.",criteria:"Outstanding service"},
    {code:"M03",name:"VALOR MEDAL",description:"Notable courage during clan operations.",criteria:"Notable valor"},
    {code:"M04",name:"LONG SERVICE MEDAL",description:"Sustained and reliable service.",criteria:"Long-term service"},
    {code:"M05",name:"TRAINING MERIT",description:"Exceptional training performance.",criteria:"Training excellence"},
    {code:"M06",name:"COMMAND DISTINCTION",description:"Exceptional leadership.",criteria:"Leadership"}
  ],

  /* Add as many uniform groups/ranks as you need. */
  UNIFORMS:[
    {category:"ENLISTED",department:"GENERAL",items:[
      {rank:"RECRUIT",shirtId:0,pantsId:0},
      {rank:"PRIVATE",shirtId:0,pantsId:0},
      {rank:"CORPORAL",shirtId:0,pantsId:0}
    ]},
    {category:"NCO",department:"GENERAL",items:[{rank:"SERGEANT",shirtId:0,pantsId:0}]},
    {category:"OFFICER",department:"COMMAND",items:[
      {rank:"LIEUTENANT",shirtId:0,pantsId:0},
      {rank:"CAPTAIN",shirtId:0,pantsId:0},
      {rank:"MAJOR",shirtId:0,pantsId:0}
    ]},
    {category:"HIGH COMMAND",department:"COMMAND",items:[
      {rank:"COLONEL",shirtId:0,pantsId:0},
      {rank:"GENERAL",shirtId:0,pantsId:0},
      {rank:"FIELD MARSHAL",shirtId:0,pantsId:0}
    ]}
  ],

  BLACKLIST:[
    /* {userId:123456789,reason:"Reason",date:"2026-09-28"} */
  ]
};

const PAGES=[
  ["home","HOME"],["organization","ORGANIZATION"],["ranks","RANKS"],
  ["medals","MEDALS"],["uniforms","UNIFORMS"],["search","PLAYER SEARCH"],["blacklist","BLACKLIST"]
];

let currentPage=null,busy=false;
let LIVE_RANKS=[];
let GROUP_INFO=null;

async function api(url,opt={}){
  const r=await fetch(url,opt),d=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(d.error||`Request failed: ${r.status}`);
  return d;
}

const profile=id=>`https://www.roblox.com/users/${id}/profile`;
const avatar=id=>`/api/roblox/avatar/${id}`;
const esc=v=>String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
const playerData=id=>SITE_CONFIG.PLAYER_DATA[String(id)]||{cp:0,merit:0,stats:{KOS:0,SERVICE:0,TRAINING:0},note:"No manual record added."};

function buildNav(){
  const d=document.getElementById("desktopMenu"),m=document.getElementById("mobileMenu");
  d.innerHTML="";m.innerHTML="";
  PAGES.forEach(([id,label])=>{
    const a=document.createElement("a");a.href="#"+id;a.className="nav-link page-link";a.dataset.page=id;a.textContent=label;d.appendChild(a);
    const b=document.createElement("a");b.href="#"+id;b.className="page-link";b.dataset.page=id;b.textContent=label;m.appendChild(b);
  });
}
function activeNav(id){document.querySelectorAll(".nav-link").forEach(x=>x.classList.toggle("active",x.dataset.page===id));}

async function navigate(id,hash=true){
  if(!PAGES.some(x=>x[0]===id))id="home";
  if(busy||currentPage===id)return;
  playClick();
  busy=true;
  document.getElementById("pageTransition").classList.add("show");
  await new Promise(r=>setTimeout(r,170));
  document.querySelectorAll(".page").forEach(x=>x.classList.remove("active-page"));
  document.getElementById(id).classList.add("active-page");
  currentPage=id;activeNav(id);
  if(hash)history.replaceState(null,"","#"+id);
  window.scrollTo({top:0,behavior:"instant"});
  await new Promise(r=>setTimeout(r,220));
  document.getElementById("pageTransition").classList.remove("show");
  document.getElementById("mobileMenu").classList.remove("open");
  busy=false;
}

document.addEventListener("click",e=>{
  const a=e.target.closest(".page-link");
  if(!a)return;
  const id=a.dataset.page||(a.getAttribute("href")||"").replace("#","");
  if(!id)return;
  e.preventDefault();
  navigate(id);
});
window.addEventListener("popstate",()=>navigate(location.hash.replace("#","")||"home",false));

async function loadGroup(){
  const url=SITE_CONFIG.GROUP_URL;
  document.getElementById("groupLinkFooter").href=url;
  document.getElementById("heroGroupButton").href=url;
  document.getElementById("brandLink").href=url;
  document.getElementById("heroLogoLink").href=url;
  document.getElementById("floatingGroupButton").href=url;

  try{
    const g=await api(`/api/roblox/group/${SITE_CONFIG.GROUP_ID}`);
    GROUP_INFO=g;
    const n=g.name||SITE_CONFIG.CLAN_NAME;
    document.title=`${n} // OFFICIAL CLAN HQ`;
    document.getElementById("brandName").textContent=SITE_CONFIG.CLAN_SHORT_NAME;
    document.getElementById("footerName").textContent=SITE_CONFIG.CLAN_NAME;
    document.getElementById("heroTitle").textContent=SITE_CONFIG.CLAN_NAME;
    if(Number.isFinite(Number(g.memberCount))){
      document.getElementById("heroMemberCount").textContent=Number(g.memberCount).toLocaleString("en-US");
    }
    const roles=Array.isArray(g.roles)?g.roles:[];
    LIVE_RANKS=roles.filter(x=>Number(x.rank)>0).sort((a,b)=>Number(a.rank)-Number(b.rank));
    document.getElementById("heroRankCount").textContent=LIVE_RANKS.length||"—";
    document.getElementById("connectionStatus").textContent="ONLINE";
    document.getElementById("memberUpdateTime").textContent="LIVE";
    document.getElementById("rankSyncNotice").textContent=`LIVE ROBLOX GROUP ROLES • ${LIVE_RANKS.length} RANKS • UPDATED ${new Date().toLocaleTimeString()}`;
    loadRanks();
  }catch(e){
    console.warn(e);
    document.getElementById("connectionStatus").textContent="RETRYING";
    document.getElementById("memberUpdateTime").textContent="OFFLINE";
    document.getElementById("rankSyncNotice").textContent="LIVE ROLE SYNC FAILED — USING LOCAL FALLBACK";
    loadRanks();
  }
}

async function refreshGroupStats(){
  try{
    const g=await api(`/api/roblox/group/${SITE_CONFIG.GROUP_ID}`);
    GROUP_INFO=g;
    if(Number.isFinite(Number(g.memberCount))){
      document.getElementById("heroMemberCount").textContent=Number(g.memberCount).toLocaleString("en-US");
      document.getElementById("memberUpdateTime").textContent=`SYNC ${new Date().toLocaleTimeString()}`;
    }
    const roles=Array.isArray(g.roles)?g.roles:[];
    const fresh=roles.filter(x=>Number(x.rank)>0).sort((a,b)=>Number(a.rank)-Number(b.rank));
    if(fresh.length){
      LIVE_RANKS=fresh;
      document.getElementById("heroRankCount").textContent=fresh.length;
      loadRanks();
    }
  }catch(e){console.warn("Group refresh failed:",e)}
}

async function user(id){
  try{return await api(`/api/roblox/user/${id}`)}
  catch{return {name:"UNKNOWN",displayName:"UNKNOWN"}}
}

async function orgNode(x){
  const u=await user(x.userId),a=document.createElement("a");
  a.className="org-node";a.href=profile(x.userId);a.target="_blank";a.rel="noopener";
  a.innerHTML=`<img class="org-avatar" src="${avatar(x.userId)}"><div class="org-info"><small>${esc(x.rank||"COMMAND")}</small><h3>${esc(u.displayName||u.name)}</h3><p>@${esc(u.name)}</p><span class="org-link">ROBLOX PROFILE →</span></div>`;
  return a;
}
async function loadOrg(){
  const root=document.getElementById("organizationContent");root.innerHTML="";
  if(SITE_CONFIG.ORGANIZATION.commander.userId){
    const w=document.createElement("div");w.className="org-command";w.append(await orgNode(SITE_CONFIG.ORGANIZATION.commander));root.append(w);
    const c=document.createElement("div");c.className="org-connector";root.append(c);
  }
  for(const dep of SITE_CONFIG.ORGANIZATION.departments){
    const box=document.createElement("article");box.className="org-department";
    box.innerHTML=`<h3>${esc(dep.name)}</h3><p>${esc(dep.description||"")}</p><div class="org-divisions"></div>`;
    const grid=box.querySelector(".org-divisions");
    for(const div of dep.divisions||[]){
      const d=document.createElement("div");d.className="org-division";
      d.innerHTML=`<h4>${esc(div.name)}</h4><small>${esc(div.description||"")}</small><div class="org-members"></div>`;
      const mm=d.querySelector(".org-members");
      for(const x of div.members||[])if(x.userId){
        const u=await user(x.userId),a=document.createElement("a");
        a.className="org-member";a.href=profile(x.userId);a.target="_blank";a.textContent=`${u.displayName||u.name} • ${x.rank||""}`;mm.append(a);
      }
      grid.append(d);
    }
    root.append(box);
  }
}

function loadRanks(){
  const r=document.getElementById("rankContent");r.innerHTML="";
  const list=LIVE_RANKS.length?LIVE_RANKS:SITE_CONFIG.RANKS;
  list.forEach((x,i)=>{
    const rankName=x.name||"UNKNOWN";
    const rankValue=x.rank??x.rankId??"—";
    const d=document.createElement("div");d.className="rank-row";
    d.innerHTML=`<div class="rank-index">${String(i+1).padStart(2,"0")}</div><div><div class="rank-name">${esc(rankName)}</div><div class="rank-kicker">${LIVE_RANKS.length?"LIVE ROBLOX ROLE":"LOCAL FALLBACK"}</div></div><div class="rank-dept">ROLE ID: ${esc(rankValue)}</div><div class="rank-cp">${LIVE_RANKS.length?"GROUP RANK: "+esc(x.rank):"CP: <b>300</b>"}</div><div class="rank-next">${LIVE_RANKS.length?"ROBLOX ORDER":"NEXT → EDIT CONFIG"}</div>`;
    r.append(d);
  });
}

function loadMedals(){
  const r=document.getElementById("medalContent");r.innerHTML="";
  SITE_CONFIG.MEDALS.forEach((x,i)=>{
    const d=document.createElement("article");d.className="medal-card";
    d.innerHTML=`<small>${esc(x.code||"M"+(i+1))}</small><div class="medal-icon">◆</div><h3>${esc(x.name)}</h3><p>${esc(x.description)}</p><p><b>CRITERIA:</b> ${esc(x.criteria)}</p>`;
    r.append(d);
  });
}

function asset(label,id){
  if(!id){const s=document.createElement("span");s.textContent=`${label} — SET ID`;return s}
  const a=document.createElement("a");a.href=`https://www.roblox.com/catalog/${id}`;a.target="_blank";a.rel="noopener";a.textContent=`${label} →`;return a;
}
function loadUniforms(){
  const r=document.getElementById("uniformContent");r.innerHTML="";
  SITE_CONFIG.UNIFORMS.forEach(g=>{
    const sec=document.createElement("section");sec.className="uniform-dept";
    sec.innerHTML=`<div class="uniform-title"><h3>${esc(g.category)} / ${esc(g.department)}</h3><span>SHIRT + PANTS</span></div><div class="uniform-grid"></div>`;
    const grid=sec.querySelector(".uniform-grid");
    g.items.forEach(x=>{
      const d=document.createElement("article");d.className="uniform-card";
      d.innerHTML=`<div class="uniform-preview">◈</div><div><h4>${esc(x.rank)}</h4><p>Rank uniform</p><div class="uniform-links"></div></div>`;
      d.querySelector(".uniform-links").append(asset("SHIRT",x.shirtId),asset("PANTS",x.pantsId));grid.append(d);
    });
    r.append(sec);
  });
}

async function loadBlacklist(){
  const r=document.getElementById("blacklistContent");r.innerHTML="";
  if(!SITE_CONFIG.BLACKLIST.length){r.innerHTML=`<div class="empty-result">NO BLACKLIST RECORDS</div>`;return}
  for(const x of SITE_CONFIG.BLACKLIST){
    const u=await user(x.userId),d=document.createElement("article");d.className="blacklist-card";
    d.innerHTML=`<div class="blacklist-icon">!</div><div><h3>${esc(u.name)}</h3><p>${esc(x.reason||"")}</p><small>${esc(x.date||"")}</small></div><a href="${profile(x.userId)}" target="_blank" rel="noopener">PROFILE →</a>`;
    r.append(d);
  }
}

function requirement(rank,cp){
  const key=Object.keys(SITE_CONFIG.RANK_REQUIREMENTS).find(
    k=>k.toLowerCase()===String(rank).toLowerCase()
  );
  const required=key?Number(SITE_CONFIG.RANK_REQUIREMENTS[key])||300:300;

  let next="MAX RANK";
  const idx=LIVE_RANKS.findIndex(r=>String(r.name).toLowerCase()===String(rank).toLowerCase());
  if(idx>=0 && LIVE_RANKS[idx+1])next=LIVE_RANKS[idx+1].name;

  return {required,remaining:Math.max(0,required-Number(cp||0)),next};
}

async function searchPlayer(){
  const input=document.getElementById("playerSearchInput"),r=document.getElementById("searchResult"),name=input.value.trim();
  if(!name)return;
  playClick();
  r.className="search-result empty-result";r.innerHTML=`<div class="result-placeholder">SEARCHING ROBLOX...</div>`;
  try{
    const d=await api("/api/roblox/search",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:name})});
    if(!d.user){r.innerHTML=`<div class="not-member"><strong>PLAYER NOT FOUND</strong><span>No Roblox account matched this username.</span></div>`;return}
    if(!d.groupMember){
      r.className="search-result";
      r.innerHTML=`<div class="not-member"><strong>${esc(SITE_CONFIG.NON_MEMBER_TEXT)}</strong><span>@${esc(d.user.name)} is not a member of ${esc(SITE_CONFIG.CLAN_NAME)}.</span></div>`;
      return;
    }
    const u=d.user,m=playerData(u.id),q=requirement(d.rank,m.cp);
    r.className="search-result";
    r.innerHTML=`<div class="player-result">
      <div class="player-main">
        <img class="player-avatar" src="${avatar(u.id)}">
        <div><h3>${esc(u.displayName||u.name)}</h3><div class="username">@${esc(u.name)}</div>
        <div class="member-status">CALVAROZIAN • ${esc(d.rank)}</div>
        <div class="username">ROBLOX USER ID: ${u.id}</div>
        <a class="org-link" href="${profile(u.id)}" target="_blank" rel="noopener">OPEN ROBLOX PROFILE →</a></div>
      </div>
      <div class="player-data-grid">
        <div class="data-box"><small>MERIT</small><b>${m.merit}</b></div>
        <div class="data-box"><small>CALVAROZ POINTS</small><b>${m.cp}</b></div>
        <div class="data-box"><small>GROUP RANK</small><b>${esc(d.rank)}</b></div>
        <div class="data-box"><small>KOS</small><b>${m.stats.KOS||0}</b></div>
        <div class="data-box"><small>SERVICE</small><b>${m.stats.SERVICE||0}</b></div>
        <div class="data-box"><small>TRAINING</small><b>${m.stats.TRAINING||0}</b></div>
      </div>
      <div class="requirements"><h4>REQUIREMENTS / NEXT RANK</h4>
        <div class="req-item"><span>Current CP</span><b>${m.cp}</b></div>
        <div class="req-item"><span>CP Required</span><b>${q.required}</b></div>
        <div class="req-item"><span>Remaining</span><b>${q.remaining}</b></div>
        <div class="req-item"><span>Next Rank</span><b>${esc(q.next)}</b></div>
        <div class="req-item"><span>Manual Note</span><b>${esc(m.note)}</b></div>
      </div>
    </div>`;
  }catch(e){r.innerHTML=`<div class="not-member"><strong>SEARCH ERROR</strong><span>${esc(e.message)}</span></div>`}
}

document.getElementById("playerSearchButton").addEventListener("click",searchPlayer);
document.getElementById("playerSearchInput").addEventListener("keydown",e=>{if(e.key==="Enter")searchPlayer()});
document.getElementById("mobileMenuBtn").addEventListener("click",()=>{
  playClick();
  document.getElementById("mobileMenu").classList.toggle("open");
});

/* =========================================================
   SOUND — clips extracted from the uploaded reference video
========================================================= */
let soundReady=false;
const clickSound=new Audio("assets/sfx/click.mp3");
const hoverSound=new Audio("assets/sfx/hover.mp3");
clickSound.preload="auto";hoverSound.preload="auto";clickSound.volume=.34;hoverSound.volume=.16;
function primeSounds(){
  if(soundReady)return;
  soundReady=true;
  clickSound.load();hoverSound.load();
}
function playClick(){
  primeSounds();
  try{clickSound.currentTime=0;clickSound.play().catch(()=>{})}catch{}
}
function playHover(){
  if(!soundReady)return;
  try{hoverSound.currentTime=0;hoverSound.play().catch(()=>{})}catch{}
}
document.addEventListener("pointerdown",primeSounds,{once:false,passive:true});
document.addEventListener("pointerover",e=>{
  if(e.target.closest(".btn,.nav-link,.home-panel,.brand,.floating-group,.org-node,.org-member,.uniform-links a,.blacklist-card a"))playHover();
},{passive:true});

/* =========================================================
   FUTURISTIC PARTICLE FIELD + POINTER PARALLAX
========================================================= */
function startFx(){
  const canvas=document.getElementById("fxCanvas"),ctx=canvas.getContext("2d");
  let dpr=Math.min(window.devicePixelRatio||1,2),w=0,h=0,particles=[];
  const pointer={x:.5,y:.5,tx:.5,ty:.5};
  function resize(){
    dpr=Math.min(window.devicePixelRatio||1,2);w=innerWidth;h=innerHeight;
    canvas.width=Math.floor(w*dpr);canvas.height=Math.floor(h*dpr);canvas.style.width=w+"px";canvas.style.height=h+"px";ctx.setTransform(dpr,0,0,dpr,0,0);
    const count=Math.min(85,Math.max(38,Math.floor(w/22)));
    particles=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.4+.25,vx:(Math.random()-.5)*.18,vy:Math.random()*.35+.04,a:Math.random()*.55+.1,p:Math.random()*Math.PI*2}));
  }
  function draw(t){
    pointer.x+=(pointer.tx-pointer.x)*.035;pointer.y+=(pointer.ty-pointer.y)*.035;
    ctx.clearRect(0,0,w,h);
    for(const p of particles){
      p.y+=p.vy;p.x+=p.vx;if(p.y>h+5){p.y=-5;p.x=Math.random()*w}if(p.x>w+5)p.x=-5;if(p.x<-5)p.x=w+5;
      const pulse=.35+.65*Math.sin(t*.0015+p.p)*.5;
      ctx.beginPath();ctx.arc(p.x+(pointer.x-.5)*10,p.y+(pointer.y-.5)*8,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,35,55,${Math.max(.04,p.a*pulse)})`;ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  addEventListener("resize",resize);
  addEventListener("pointermove",e=>{pointer.tx=e.clientX/innerWidth;pointer.ty=e.clientY/innerHeight},{passive:true});
  resize();requestAnimationFrame(draw);
}

async function start(){
  document.getElementById("brandName").textContent=SITE_CONFIG.CLAN_SHORT_NAME;
  document.getElementById("footerName").textContent=SITE_CONFIG.CLAN_NAME;
  document.getElementById("heroTitle").textContent=SITE_CONFIG.CLAN_NAME;
  document.getElementById("heroTagline").textContent=SITE_CONFIG.TAGLINE;
  document.getElementById("heroMemberCount").textContent="SYNC";
  document.getElementById("heroRankCount").textContent="SYNC";
  document.getElementById("groupLinkFooter").href=SITE_CONFIG.GROUP_URL;
  document.getElementById("heroGroupButton").href=SITE_CONFIG.GROUP_URL;
  document.getElementById("brandLink").href=SITE_CONFIG.GROUP_URL;
  document.getElementById("heroLogoLink").href=SITE_CONFIG.GROUP_URL;
  document.getElementById("floatingGroupButton").href=SITE_CONFIG.GROUP_URL;

  buildNav();loadRanks();loadMedals();loadUniforms();await loadBlacklist();await loadOrg();await loadGroup();
  const first=location.hash.replace("#","")||"home";
  currentPage=first;document.getElementById(first)?.classList.add("active-page");activeNav(first);
  startFx();

  /* Keeps the public member count and group rank order refreshed automatically. */
  setInterval(refreshGroupStats,60000);
}
start();
