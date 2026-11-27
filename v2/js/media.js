// Media: one clip for GAME and one per show map, plus four stems (drums, bass, synth, ambient) routed through the mixer buses.
(()=>{const T=THREE,C=G.C,A=G.audio,W=G.world,ZY=G.ZY,SW=96,SH=54,LAB=['DRUMS','BASS','SYNTH','AMBIENT'],$=id=>document.getElementById(id);
const sets={game:{zi:1,labs:['AMBIENT','MUSIC','FX'],bi:[4,5,6]},video:{zi:2,title:'Air in G',bi:[7,8,9,10]},show1:{zi:5,k:0,bi:[11,12,13,14]}};
for(const id in sets){const s=sets[id];s.labs=s.labs||G.venames;s.bi=s.bi||[0,1,2,3];s.id=id;s.v=document.createElement('video');s.v.playsInline=true;s.v.muted=true;s.v.preload='auto';s.v.className='screen';s.v.hidden=true;s.a=s.labs.map(()=>{const a=new Audio();a.preload='auto';return a});s.hasV=false;s.has=s.labs.map(()=>false);s.on=false;s.url={}}
{const g=sets.game,v=g.lg=document.createElement('video');v.playsInline=true;v.muted=true;v.preload='auto';v.className='screen lg';v.setAttribute('aria-label','Logic Pro 세션 화면 (게임 영상과 동기화)');g.lgOk=false}
const M=G.media={sets,has:()=>Object.values(sets).some(s=>s.hasV||s.has.some(Boolean)),playing:()=>Object.values(sets).some(s=>s.on),toggle:id=>{const s=sets[id];s.on?stop(s):play(s)}};
const any=s=>s.has.some(Boolean),master=s=>s.hasV?s.v:s.a.find((a,i)=>s.has[i]),els=s=>[s.hasV&&s.v,s.lgOk&&s.lg,...s.a.filter((a,i)=>s.has[i])].filter(Boolean);
function route(s){if(s.routed||!A.ctx)return;s.routed=true;s.an=[];s.buf=new Uint8Array(256);s.a.forEach((a,i)=>{const n=A.ctx.createMediaElementSource(a),an=A.ctx.createAnalyser();an.fftSize=256;n.connect(an);an.connect(A.bus[s.bi[i]]);s.an[i]=an})}
async function play(s){for(const o of Object.values(sets))if(o!==s&&o.on)stop(o);
if(!s.hasV&&!any(s)){A.init();try{await A.ctx.resume()}catch(e){}s.demo=true;s.on=true;A.mapDemo=s.id==='game'?[5,5,6,4]:s.bi.slice(0,4);A.mix();A.setLoop(true);G.toast('내 영상이 아직 없어서 데모 영상이 재생됩니다. 왼쪽 FILM · 음원 버튼으로 교체하세요.');upd();return}
s.demo=false;A.init();A.setLoop(false);const L=els(s),m=master(s),t=m.currentTime;s.v.muted=true;L.forEach(e=>{if(e!==m)try{e.currentTime=t}catch(_){}});
const pr=L.map(e=>e.play().catch(()=>{}));try{await A.ctx.resume()}catch(e){}route(s);await Promise.all(pr);
L.forEach(e=>{if(e.paused)e.play().catch(()=>{})});
s.on=true;clearInterval(s.tm);s.tm=setInterval(()=>{const mm=master(s);if(mm)L.forEach(e=>{if(e!==mm&&Math.abs(e.currentTime-mm.currentTime)>.15)e.currentTime=mm.currentTime})},400);upd()}
function stop(s){if(s.demo){s.demo=false;A.mapDemo=null;A.mix();A.setLoop(false)}s.on=false;clearInterval(s.tm);[s.v,s.lg,...s.a].forEach(e=>e&&e.pause());upd()}
const fmt=t=>{t=Math.max(0,t||0);return String(Math.floor(t/60)).padStart(2,'0')+':'+String(Math.floor(t%60)).padStart(2,'0')};
function poster(s){if(s.k==null||!s.hasV||s.v.readyState<2)return;const sl=G.wallSlot(2,s.k);if(!sl)return;c2.drawImage(s.v,0,0,SW,SH);const px=c2.getImageData(0,0,SW,SH).data,w=G.slotDims(2,s.k).w,h=G.slotDims(2,s.k).h,amp=h/SH*2.4,p=[];for(let r=0;r<SH;r++){const y0=h*(1-(r+.5)/SH)-h/2;let a=null;for(let c=0;c<SW;c++){const i=(r*SW+c)*4,l=(.3*px[i]+.59*px[i+1]+.11*px[i+2])/255,x=-w/2+c/(SW-1)*w,y=y0+l*amp;if(a)p.push(a[0],a[1],0,x,y,0);a=[x,y]}}sl.geometry.dispose();sl.geometry=G.lineset(p,0).geometry}
function setSrc(s,k,url){if(s.on)stop(s);const key=k==='video'?'video':'s'+k,old=s.url[key];if(old&&old.startsWith('blob:'))URL.revokeObjectURL(old);s.url[key]=url;
if(k==='video'){s.v.addEventListener('loadeddata',()=>{if(!s.on&&!s.v.poster)try{s.v.currentTime=.05}catch(e){}},{once:true});s.v.src=url;s.hasV=true;s.v.hidden=false;s.v.load()}else{s.a[k].src=url;s.has[k]=true;s.a[k].load()}upd()}
for(const id in sets){const s=sets[id];s.v.addEventListener('loadeddata',()=>poster(s))}
for(const id in sets){const s=sets[id];[s.v,...s.a].forEach(e=>e.addEventListener('ended',()=>{if(s.on&&e===master(s)){stop(s);[s.v,s.lg,...s.a].forEach(x=>{try{x&&(x.currentTime=0)}catch(_){}});upd()}}))}
// leaving a media map (or its 2D page) stops whatever is playing there
const leave=a=>{for(const k in sets){const o=sets[k];if(o.on&&o.zi!==a)stop(o)}};G.on('travel',a=>leave(a));G.on('mode',()=>leave(G.ch.area));
// 2D controls
document.querySelectorAll('.vslot').forEach(el=>{const s=sets[el.dataset.vslot];el.innerHTML=`<canvas class="screen" data-art width="1280" height="720" hidden></canvas><div class="vph mono" data-vph>NO VIDEO · 아래 FILM + 버튼으로 영상을 넣으세요</div><div class="mctl"><button class="btn" data-mplay>▶ PLAY</button><button class="btn" data-mfull aria-label="전체 화면">⛶</button><input type="range" id="mseek-${s.id}" data-mseek min="0" max="1000" value="0" aria-label="재생 위치"><span class="mono" data-mtime>00:00</span></div>
<div class="mpick"><button data-mk="video">영상 +</button>${s.labs.map((n,i)=>`<button data-mk="${i}">${n} +</button>`).join('')}</div><p class="mono" data-mnote></p>`;el.prepend(s.v);if(s.title)s.art=el.querySelector('[data-art]')});
{const b=document.querySelector('[data-logicbox]');if(b)b.prepend(sets.game.lg)}
const dc=document.createElement('canvas');dc.width=SW;dc.height=SH;const dx=dc.getContext('2d');
function demoDraw(t){dx.fillStyle='#000';dx.fillRect(0,0,SW,SH);const b=A.pulse?(A.pulse[0]||0):0;dx.fillStyle='#fff';for(let i=0;i<6;i++){const r=6+i*5+b*8,x=SW/2+Math.cos(t*.7+i)*SW*.28,y=SH/2+Math.sin(t*.9+i*1.3)*SH*.25;dx.globalAlpha=.9-i*.1;dx.beginPath();dx.arc(x,y,r,0,6.3);dx.fill()}dx.globalAlpha=1;for(let i=0;i<12;i++){const h=(Math.sin(t*3+i)*.5+.5)*SH*.35*(.4+(A.pulse?A.pulse[i%4]||0:0));dx.fillRect(i*8+2,SH-h,5,h)}c2.drawImage(dc,0,0)}
const pick=document.createElement('input');pick.type='file';pick.id='mediapick';pick.hidden=true;document.body.appendChild(pick);let pend=null;
document.addEventListener('click',e=>{const v=e.target.closest('.vslot');if(!v)return;const s=sets[v.dataset.vslot];if(e.target.closest('[data-mplay]')){s.on?stop(s):play(s);return}if(e.target.closest('[data-mfull]')){const t=s.hasV?s.v:v.querySelector('canvas,video');try{t&&t.requestFullscreen&&t.requestFullscreen()}catch(_){}return}
const b=e.target.closest('[data-mk]');if(b){const k=b.dataset.mk==='video'?'video':+b.dataset.mk;pend={s,k};pick.accept=k==='video'?'video/*':'audio/*';pick.click()}});
M.pick=(id,k)=>{pend={s:sets[id],k};pick.accept=k==='video'?'video/*':'audio/*';pick.click()};
pick.onchange=()=>{const f=pick.files[0];pick.value='';if(f&&pend)setSrc(pend.s,pend.k,URL.createObjectURL(f))};
document.addEventListener('input',e=>{const r=e.target.closest('[data-mseek]');if(!r)return;const s=sets[r.closest('.vslot').dataset.vslot],m=master(s);if(!m||!isFinite(m.duration))return;const t=r.value/1000*m.duration;els(s).forEach(x=>{try{x.currentTime=t}catch(_){}})});
function upd(){for(const id in sets){const s=sets[id],cv=document.querySelector('canvas[data-scene="play"]');if(id==='game'&&cv)cv.hidden=s.hasV;
document.querySelectorAll(`.vslot[data-vslot="${id}"]`).forEach(el=>{el.querySelector('[data-mplay]').textContent=s.on?'❚❚ PAUSE':'▶ PLAY';el.querySelectorAll('[data-mk]').forEach(b=>{const k=b.dataset.mk==='video'?'video':+b.dataset.mk,on=k==='video'?s.hasV:s.has[k];b.dataset.on=on;b.textContent=(k==='video'?'FILM':s.labs[k])+(on?' ✓':' +')});
const ar=!!s.title&&!s.hasV&&any(s);s.isArt=ar;if(s.art)s.art.hidden=!ar;el.querySelector('[data-vph]').hidden=s.hasV||id==='game'||ar;el.querySelector('[data-mnote]').textContent=''});
if(s.plane){s.plane.visible=s.hasV;if(s.ptex){const w=(s.on||s.v.currentTime>.5)?s.vt:s.ptex;if(s.plane.material.map!==w){s.plane.material.map=w;s.plane.material.needsUpdate=true}}if(s.aplane)s.aplane.visible=!!s.isArt;if(s.lplane){s.lplane.visible=s.lgOk;if(s.lptex){const w=(s.on||s.lg.currentTime>.5)?s.lvt:s.lptex;if(s.lplane.material.map!==w){s.lplane.material.map=w;s.lplane.material.needsUpdate=true}}}const sl=G.wallSlot&&G.wallSlot(s.zi,1);if(sl)sl.visible=!(s.hasV||s.isArt)}if(s.pad)s.pad.icons.forEach((m,i)=>m.visible=i===(s.on?1:0))}}
// 3D: play pad under each screen, live line relief on the wall
const ctx2=document.createElement('canvas');ctx2.width=SW;ctx2.height=SH;const c2=ctx2.getContext('2d',{willReadFrequently:true}),buf=new Float32Array(6*(SW-1)*SH),lbuf=new Uint8Array(256);
for(const id in sets){const s=sets[id],g=W.zones[s.zi],O=G.O(s.zi),pg=new T.Group();pg.position.set(0,0,-13);g.add(pg);const b=G.box(3.2,.3,3.2,C.lime,1);b.position.y=.15;pg.add(b);
const play=G.poly(.9,3,C.lime,1,0);play.rotation.x=-Math.PI/2;play.position.y=.32;pg.add(play);const pause=new T.Group();for(const x of[-.5,.5]){const r=G.rect(.4,1.5,C.lime,1);r.rotation.x=-Math.PI/2;r.position.set(x,.32,0);pause.add(r)}pause.visible=false;pg.add(pause);
const lb=G.text('PLAY',.8,C.lime,1);lb.rotation.x=-Math.PI/2;lb.position.set(0,.08,-11);g.add(lb);
{const dm=G.slotDims(s.zi,1),vp=new T.Mesh(new T.PlaneGeometry(dm.w,dm.h),new T.MeshBasicMaterial({map:(s.vt=new T.VideoTexture(s.v)),fog:false}));vp.position.set(0,G.screenY||18,-23.9);vp.visible=false;g.add(vp);s.plane=vp;if(s.title&&s.art){s.tex=new T.CanvasTexture(s.art);s.tex.minFilter=T.LinearFilter;const ap=new T.Mesh(new T.PlaneGeometry(dm.w,dm.h),new T.MeshBasicMaterial({map:s.tex,fog:false}));ap.position.set(0,G.screenY||18,-23.9);ap.visible=false;g.add(ap);s.aplane=ap}}
const p={id:'PLAY',eng:-9,x:O.x,z:-13,y:ZY,r:1.7,g:pg,b,press:0,base:0,icons:[play,pause],fn:()=>M.toggle(id)};s.pad=p;G.anchors.pads.push(p);
['FILM',...s.labs].forEach((n,k)=>{const z=-9+k*4.6,r=G.rect(9,3.2,C.lime,1);r.rotation.x=-Math.PI/2;r.position.set(-27,.07,z);g.add(r);const t=G.text(n+' +',.8,C.lime,1);t.rotation.x=-Math.PI/2;t.position.set(-27,.08,z);g.add(t);G.inter.push({area:s.zi,x:O.x-27,z,r:2.8,kind:'use',label:(k?n+' 음원':'내 영상')+' 파일 넣기',fn:()=>M.pick(id,k?k-1:'video')})});
G.inter.push({area:s.zi,x:O.x,z:-13,r:1.7,kind:'pad',id:'PLAY',label:'엉덩방아로 영상 재생·정지',pad:p})
if(s.lg){const dm=G.slotDims(s.zi,1),w=19,h=w*724/1280,lg=new T.Group();lg.position.set(dm.w/2+2.6+w/2*Math.cos(.38),(G.screenY||18)-dm.h/2+h/2+1.2,-23.2+w/2*Math.sin(.38));lg.rotation.y=-.38;g.add(lg);
const fr=G.rect(w+.6,h+.6,C.lime,1,false);lg.add(fr);const f2=G.rect(w,h,C.cyan,.6,false);lg.add(f2);const bk=G.panel(w,h,0x0a0a0a);bk.position.z=-.05;lg.add(bk);
s.lvt=new T.VideoTexture(s.lg);const lp=new T.Mesh(new T.PlaneGeometry(w-.3,h-.3),new T.MeshBasicMaterial({map:s.lvt,fog:false}));lp.position.z=.06;lp.visible=false;lg.add(lp);s.lplane=lp;
const tl=G.text('LOGIC PRO SESSION',.75,C.lime,1,'left');tl.position.set(-w/2,h/2+1.1,0);lg.add(tl);const st=G.text('SYNCED WITH GAMEPLAY',.45,C.cyan,1,'left');st.position.set(-w/2,h/2+.3,0);lg.add(st)}}
// audio-only screen: song title + live spectrum (used when a set has a title, no video, and at least one stem)
const fq=new Uint8Array(128);
function drawArt(s,t){if(G.meterDraw&&G.meterDraw(s,s.art,t,master(s))){if(s.tex)s.tex.needsUpdate=true;return}const cv=s.art,x=cv.getContext('2d'),W=1280,H=720,L=s.labs.map((n,k)=>k).filter(k=>s.has[k]);
if(!s.bars)s.bars=new Float32Array(56);
x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);x.strokeStyle='#fff';x.lineWidth=2;x.strokeRect(24,24,W-48,H-48);
x.fillStyle='#bdbdbd';x.font='500 26px "JetBrains Mono",ui-monospace,monospace';x.textBaseline='alphabetic';x.textAlign='left';x.fillText('MOCK UP  ·  '+L.map(k=>s.labs[k]).join(' + '),64,86);
x.fillStyle='#fff';x.font='700 190px "Chakra Petch","Noto Sans KR",sans-serif';x.fillText(s.title,60,300);
const on=s.on&&!s.demo;x.font='600 26px "JetBrains Mono",ui-monospace,monospace';x.textAlign='right';
if(on){if(Math.floor(t*2)%2===0){x.beginPath();x.arc(W-64-190,76,8,0,6.3);x.fill()}x.fillText('NOW PLAYING',W-64,86)}else{x.fillStyle='#bdbdbd';x.fillText('PRESS PLAY',W-64,86)}
x.textAlign='left';
let ok=false;const acc=s.acc||(s.acc=new Float32Array(128));acc.fill(0);if(on&&s.an)for(const k of L){if(!s.an[k])continue;s.an[k].getByteFrequencyData(fq);const gk=G.mute[s.bi[k]]?0:Math.min(1.6,Math.pow(10,G.db[s.bi[k]]/20)*1.6);for(let f=0;f<128;f++)acc[f]+=fq[f]/255*gk;ok=true}
const N=s.bars.length,bw=(W-128)/N;
for(let k=0;k<N;k++){const f=Math.floor(Math.pow(k/N,1.6)*72),v=ok?Math.min(1,acc[f]):0,idle=.05+.03*Math.sin(t*1.6+k*.45)+.02*Math.sin(t*.9+k*1.3),tg=ok?Math.max(idle*.6,v):idle*.7;s.bars[k]+=(tg-s.bars[k])*.35;
const h=Math.max(4,s.bars[k]*230);x.fillStyle='#fff';x.fillRect(64+k*bw,640-h,bw-6,h)}
x.fillStyle='#fff';x.fillRect(64,646,W-128,2);
const m=master(s),pr=m&&isFinite(m.duration)&&m.duration?m.currentTime/m.duration:0;x.fillStyle='#4a4a4a';x.fillRect(64,664,W-128,6);x.fillStyle='#fff';x.fillRect(64,664,(W-128)*pr,6);
x.fillStyle='#bdbdbd';x.font='500 22px "JetBrains Mono",ui-monospace,monospace';x.fillText(fmt(m?m.currentTime:0),64,700);x.textAlign='right';x.fillText(fmt(m&&isFinite(m.duration)?m.duration:0),W-64,700);x.textAlign='left';
if(s.tex)s.tex.needsUpdate=true}
G.ticks.push((d,t)=>{for(const id in sets){const s=sets[id];if(!s.isArt||!s.art)continue;const vis=G.view==='3d'?G.area===s.zi:!!s.art.offsetParent;if(vis)drawArt(s,t)}});
G.ticks.push(()=>{for(const id in sets){const s=sets[id];if(!s.on)continue;
if(s.an){const gain=i=>G.mute[s.bi[i]]?0:Math.pow(10,G.db[s.bi[i]]/20);s.an.forEach((an,i)=>{if(!s.has[i])return;an.getByteTimeDomainData(lbuf);let q=0;for(let k=0;k<256;k++){const d=(lbuf[k]-128)/128;q+=d*d}A.pulse[s.bi[i]]=Math.max(A.pulse[s.bi[i]],Math.min(1,Math.sqrt(q/256)*5*gain(i)*1.3))})}
if(G.area===s.zi&&s.demo&&!s.hasV){const slot=G.wallSlot(s.zi,1),dm=G.slotDims(s.zi,1);if(!s.geo){s.geo=new T.BufferGeometry();s.geo.setAttribute('position',new T.BufferAttribute(buf,3))}if(slot.geometry!==s.geo){slot.geometry.dispose();slot.geometry=s.geo}
if(s.demo)demoDraw(performance.now()/1000);else c2.drawImage(s.v,0,0,SW,SH);const px=c2.getImageData(0,0,SW,SH).data,w=dm.w,h=dm.h,amp=h/SH*2.4;let o=0;for(let r=0;r<SH;r++){const y0=h*(1-(r+.5)/SH)-h/2;let px0=0,py0=0;for(let c=0;c<SW;c++){const i=(r*SW+c)*4,l=(.3*px[i]+.59*px[i+1]+.11*px[i+2])/255,x=-w/2+c/(SW-1)*w,y=y0+l*amp;if(c){buf[o++]=px0;buf[o++]=py0;buf[o++]=0;buf[o++]=x;buf[o++]=y;buf[o++]=0}px0=x;py0=y}}s.geo.attributes.position.needsUpdate=true}}
document.querySelectorAll('.vslot').forEach(el=>{const s=sets[el.dataset.vslot],m=master(s);if(!m||!el.offsetParent)return;el.querySelector('[data-mtime]').textContent=fmt(m.currentTime)+' / '+fmt(m.duration);if(document.activeElement!==el.querySelector('[data-mseek]')&&isFinite(m.duration))el.querySelector('[data-mseek]').value=m.currentTime/m.duration*1000})});
upd();
fetch('media/manifest.json',{cache:'no-cache'}).then(r=>r.ok?r.json():null).then(m=>{if(!m)return;for(const id in m){const s=sets[id];if(!s)continue;if(m[id].poster){s.v.poster=m[id].poster;new T.TextureLoader().load(m[id].poster,tx=>{s.ptex=tx;upd()})}if(m[id].video)setSrc(s,'video',m[id].video);if(m[id].logic&&s.lg){s.lg.poster=m[id].logic.poster||'';s.lg.src=m[id].logic.video;s.lgOk=true;s.lg.load();if(m[id].logic.poster)new T.TextureLoader().load(m[id].logic.poster,tx=>{s.lptex=tx;upd()});upd()}(m[id].stems||[]).forEach((u,i)=>u&&setSrc(s,i,u))}}).catch(()=>{});
})();
