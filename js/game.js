// Avatar state machine (walk, grab, fader hang, butt-slam, portal melt/warp), input, camera, render loop.
(()=>{const T=THREE,V=T.Vector3,A=G.audio,W=G.world,cam=G.cam,ch=G.ch={pos:new V(0,0,8),area:-1,vx:0,vz:0,yaw:0,state:'walk',anchor:null,k:0,phase:0,ptr:null,held:null,lastTap:0,rt:0,over:null,leap:null,inter:null,ret:0,vy:0,auto:null,tK:0,slamK:0,hit:false,pend:false,sprint:false};
const K={up:false,down:false,left:false,right:false},coarse=matchMedia('(pointer:coarse)').matches,$=id=>document.getElementById(id),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),ease=k=>k*k*(3-2*k);
const bnd=a=>a<0?{x0:-68,x1:68,z0:-68,z1:68}:{x0:G.O(a).x-33,x1:G.O(a).x+33,z0:-20,z1:19};
const gnd=()=>W.ground(ch.pos.x,ch.pos.z,ch.area),capPos=f=>new V(f.x,G.ZY+.35,W.capZ(f.i)),hangPos=f=>new V(f.x,G.ZY+.35,W.capZ(f.i));
const FD=()=>G.faders.filter(f=>f.area===ch.area);let cp=new V(0,0,8),snap=true,time=0,fpK=0,fpPitch=0,lm={x:0,in:false};G.fp=false;const LK={l:0,r:0,u:0,d:0},LKM={ArrowLeft:'l',ArrowRight:'r',ArrowUp:'u',ArrowDown:'d'};
G.toggleFP=on=>{G.fp=on===undefined?!G.fp:!!on;fpPitch=0;A.sfx('tab');if(!G.fp&&document.pointerLockElement)try{document.exitPointerLock()}catch(_){}G.toast(G.fp?(coarse?'VR 1인칭 · 화면을 드래그해 둘러보기 · 조이스틱 이동':'VR 1인칭 · 화면을 클릭하면 마우스로 둘러보기 · WASD 이동 · ESC 해제'):'3인칭 시점으로 돌아왔어요');G.emit('fp',G.fp)};$('bFP').onclick=()=>{if(G.started&&G.view==='3d')G.toggleFP()};G.fpHooks={startPortal:it=>startPortal(it),leap:f=>{ch.leap={f,from:ch.pos.clone(),t:0};ch.state='leap';A.sfx('tab')}};
const dest=it=>{if(it.dest==='under')return{under:true,door:-1};if(it.dest>=0)return{area:it.dest,x:G.O(it.dest).x,z:5};const f=it.from??0;if(G.hubOrigin==='under'&&it.from!=null&&it.from>=0&&it.from<5)return{under:true,door:f};return{area:-1,x:G.E[f][0],z:G.E[f][1]+5}};
function startPortal(it){ch.inter=it;ch.state='slam';ch.slamK=0;ch.hit=false;ch.auto=null}
function hangAt(f){ch.anchor=f;ch.state='hang';ch.vy=0;A.sfx('hang');W.ripple(f.x,W.capZ(f.i),0x000000,1.6,G.ZY)}
function nearFader(p,m){if(!FD().length)return null;let b=null,bd=m;for(const f of FD()){const d=p.y>G.ZY+7?1e9:Math.hypot(f.x-p.x,W.capZ(f.i)-p.z);if(d<bd){bd=d;b=f}}return b}
function doJump(){if(G.view!=='3d'||!G.started)return;if(ch.state==='hang'){ch.state='fall';ch.vy=0;ch.anchor=null;return}
if(ch.state!=='walk')return;let b=null,bd=3.6;for(const f of FD()){const d=Math.hypot(f.x-ch.pos.x,W.capZ(f.i)-ch.pos.z);if(d<bd){bd=d;b=f}}
if(b){ch.leap={f:b,from:ch.pos.clone(),t:0};ch.state='leap';A.sfx('tab')}else{ch.vy=8;ch.state='fall';A.sfx('tick')}}
function doEnter(){if(G.view!=='3d'||!G.started)return;if(G.fp&&G.fpTarget&&(ch.state==='walk'||ch.state==='hang')){G.fpClick&&G.fpClick();return}if(ch.state==='walk'&&!ch.over&&FD().length){const f=FD().find(f=>Math.hypot(f.x-ch.pos.x,W.capZ(f.i)-ch.pos.z)<2.8);if(f){ch.leap={f,from:ch.pos.clone(),t:0};ch.state='leap';return}}if(ch.state==='hang'){doJump();return}
if(ch.state==='walk'&&ch.over){const o=ch.over;if(o.kind==='use'){A.sfx('blip');o.fn()}else startPortal(o)}}
function doMute(){if(G.view==='3d'&&ch.state==='hang'){G.toggleMute(ch.anchor.i);A.sfx('tick')}}
function edge(n){if(G.view==='3d'&&ch.state==='hang'&&(n==='left'||n==='right')){const L=FD(),j=clamp(L.indexOf(ch.anchor)+(n==='left'?-1:1),0,L.length-1);if(L[j]!==ch.anchor){ch.anchor=L[j];A.sfx('hang')}}}
function act(n,d){if((G.uActive&&G.uActive())){G.under.act(n,d);return}if(n in K){const was=K[n];K[n]=d;if(d&&!was){ch.auto=null;edge(n)}return}if(d){if(n==='enter')doEnter();else if(n==='mute')doMute()}}G.act=act;
const KM={ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',Space:'enter',KeyM:'mute'};
addEventListener('keydown',e=>{const t=e.target.tagName;if(t==='INPUT'||t==='TEXTAREA'){if(e.key==='Escape')e.target.blur();return}
if(e.code==='Tab'){e.preventDefault();if(G.started)G.toggleView();return}if(e.code==='Escape'){G.closeChat&&G.closeChat();return}
if(e.key==='Shift')ch.sprint=true;if(G.view!=='3d')return;if(e.code==='KeyV'&&!e.repeat&&G.started){G.toggleFP();return}if(G.fp&&e.code in LKM){e.preventDefault();const q=LKM[e.code];if(!LK[q]){if(q==='l'||q==='r'){ch.yaw-=(q==='r'?1:-1)*.06;ch.fpYaw=ch.yaw}else fpPitch=clamp(fpPitch+(q==='u'?.05:-.05),-1.1,1.1)}LK[q]=1;return}const n=KM[e.code];if(n){e.preventDefault();if(n==='enter'&&document.activeElement&&document.activeElement!==document.body)document.activeElement.blur();if(!e.repeat)act(n,true)}});
addEventListener('keyup',e=>{if(e.code in LKM)LK[LKM[e.code]]=0;if(e.key==='Shift')ch.sprint=false;const n=KM[e.code];if(n&&n in K)act(n,false)});addEventListener('blur',()=>{for(const k in LK)LK[k]=0;for(const k in K)K[k]=false;ch.sprint=false});
const joy=$('joy'),knob=$('knob');let jid=null;
const jmove=e=>{const r=joy.getBoundingClientRect();let x=(e.clientX-r.left-r.width/2)/(r.width/2),y=(e.clientY-r.top-r.height/2)/(r.height/2);if(G.rot){const q=x;x=y;y=-q}const m=Math.hypot(x,y),s=m>1?1/m:1;knob.style.transform=`translate(${x*s*35}px,${y*s*35}px)`;ch.sprint=m>1.15;act('left',x<-.35);act('right',x>.35);act('up',y<-.35);act('down',y>.35)};
joy.addEventListener('pointerdown',e=>{jid=e.pointerId;joy.setPointerCapture(jid);jmove(e)});joy.addEventListener('pointermove',e=>{if(e.pointerId===jid)jmove(e)});
const jend=e=>{if(e.pointerId!==jid)return;jid=null;knob.style.transform='';ch.sprint=false;['left','right','up','down'].forEach(k=>act(k,false))};joy.addEventListener('pointerup',jend);joy.addEventListener('pointercancel',jend);
document.querySelectorAll('#acts button').forEach(b=>{const k=b.dataset.k;b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);if(k!=='enter')act(k,true)});const u=()=>{if(k in K)act(k,false);else if(k==='enter')act(k,true)};b.addEventListener('pointerup',u);b.addEventListener('pointercancel',u)});
// pointer
const cv=$('gl'),sp=v=>{const p=v.clone().project(cam);return{x:(p.x+1)/2*G.W,y:(1-p.y)/2*G.H}};const ray=new T.Raycaster(),pl=new T.Plane();let drag=null;
const chScreen=()=>{const c=sp(ch.pos.clone().add(new V(0,1,0))),e=sp(ch.pos.clone().add(new V(1.8,1,0)));return{x:c.x,y:c.y,r:Math.max(coarse?44:32,Math.abs(e.x-c.x)*1.05)}};
G.footScreen=()=>sp(ch.pos.clone().add(new V(0,.25,0)));
G.headScreen=()=>sp(ch.pos.clone().add(new V(0,2.6,0)));
function ptrWorld(e){const n=new V();cam.getWorldDirection(n);pl.setFromNormalAndCoplanarPoint(n,ch.pos.clone().add(new V(0,1,0)));ray.setFromCamera({x:e.clientX/G.W*2-1,y:-(e.clientY/G.H)*2+1},cam);const o=new V();return ray.ray.intersectPlane(pl,o)?o:null}
cv.addEventListener('pointerdown',e=>{if(G.view!=='3d'||!G.started)return;if(G.fp&&document.pointerLockElement===cv){G.fpClick&&G.fpClick();return}if(G.fp&&e.pointerType==='mouse'&&document.pointerLockElement!==cv){try{const r=cv.requestPointerLock();r&&r.catch&&r.catch(()=>{})}catch(_){}}cv.setPointerCapture(e.pointerId);const m={x:e.clientX,y:e.clientY},c=chScreen();
if(!G.fp&&Math.hypot(m.x-c.x,m.y-c.y)<c.r&&(ch.state==='walk'||ch.state==='hang'||ch.state==='fall')){ch.ptr={id:e.pointerId,sx:m.x,sy:m.y,moved:false};return}
for(const f of FD()){const s=sp(capPos(f));if(Math.hypot(m.x-s.x,m.y-s.y)<(coarse?40:30)){drag={f,sx:m.x,sy:m.y,moved:false};return}}
drag={click:true,sx:m.x,sy:m.y,lx:m.x,ly:m.y}});
cv.addEventListener('pointerleave',()=>{lm.in=false});
cv.addEventListener('pointermove',e=>{const m={x:e.clientX,y:e.clientY};lm.x=m.x;lm.in=true;
if(G.fp&&G.view==='3d'&&G.started&&document.pointerLockElement===cv&&!(drag&&drag.f)){ch.yaw-=(e.movementX||0)*.0028;ch.fpYaw=ch.yaw;fpPitch=clamp(fpPitch-(e.movementY||0)*.0024,-1.1,1.1);return}
if(ch.ptr&&e.pointerId===ch.ptr.id){if(!ch.ptr.moved&&Math.hypot(m.x-ch.ptr.sx,m.y-ch.ptr.sy)>8){ch.ptr.moved=true;ch.state='held';ch.anchor=null;ch.vy=0;ch.auto=null;ch.leap=null;A.sfx('tick')}
if(ch.state==='held'){const w=ptrWorld(e),b=bnd(ch.area),by=G.baseY();if(w)ch.held={x:clamp(w.x,b.x0,b.x1),y:clamp(w.y-1,by-.2,by+11),z:clamp(w.z,b.z0,b.z1)}}return}
if(drag&&drag.click&&G.fp){const ddx=m.x-drag.lx,ddy=m.y-drag.ly;drag.lx=m.x;drag.ly=m.y;ch.yaw-=ddx*.006;ch.fpYaw=ch.yaw;fpPitch=clamp(fpPitch-ddy*.004,-1.1,1.1);return}
if(drag&&drag.f){const f=drag.f,b=sp(new V(f.x,G.ZY+.3,f.zmin)),t=sp(new V(f.x,G.ZY+.3,f.zmax)),dx=t.x-b.x,dy=t.y-b.y,u=clamp(((m.x-b.x)*dx+(m.y-b.y)*dy)/(dx*dx+dy*dy),0,1);drag.moved=true;G.setDb(f.i,-48+u*54,'drag')}});
function up(e){if(ch.ptr&&e.pointerId===ch.ptr.id){const p=ch.ptr;ch.ptr=null;if(!p.moved){const n=performance.now();if(n-ch.lastTap<450){ch.lastTap=0;G.openChat&&G.openChat()}else ch.lastTap=n;return}
const f=nearFader(ch.pos.clone().add(new V(0,1,0)),2.9);ch.held=null;if(f)hangAt(f);else{ch.state='fall';ch.vy=0}return}
if(drag){const d=drag;drag=null;if(d.click&&document.pointerLockElement===cv)return;if(d.f&&d.moved)return;if(d.f){G.toggleMute(d.f.i);return}if(Math.hypot(e.clientX-d.sx,e.clientY-d.sy)>10)return;clickAt(e.clientX,e.clientY)}}
cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
function clickAt(x,y){let b=null,bd=coarse?54:40;for(const it of G.inter){if(it.area!==ch.area)continue;const s=sp(new V(it.x,W.ground(it.x,it.z,it.area)+.6,it.z)),d=Math.hypot(x-s.x,y-s.y);if(d<bd){bd=d;b=it}}
if(!b)return;if(b.kind==='pad'){W.pressPad(b.pad);return}if(ch.state==='walk'){ch.auto={x:b.x,z:b.z};ch.pend=true}}
// modes / views / travel
G.setMode=(i,q)=>{G.mode=i;if(!q)A.sfx('blip');G.emit('mode',i)};
G.setView=v=>{if(G.view===v)return;G.view=v;document.body.classList.toggle('v2d',v==='2d');for(const k in K)K[k]=false;if(v==='2d')ch.ptr=null;$('view2d').hidden=v!=='2d';$('touch').hidden=!(v==='3d'&&coarse);$('dock').hidden=v!=='2d';$('map').hidden=v!=='3d';A.sfx('tab');G.emit('view',v)};
G.toggleView=()=>G.setView(G.view==='3d'?'2d':'3d');
G.arriveAt=d=>{ch.area=d.area;W.setArea(d.area);const p=ch.pos;p.set(d.x,W.ground(d.x,d.z,d.area)+27,d.z);ch.vy=0;ch.dg=0;ch.lock=false;ch.ret=.9;ch.state='warp';snap=true;W.craterClose();W.streak(true,p.x,p.y,p.z);if(d.area>=0)G.setMode(d.area<5?d.area:2,true);G.emit('travel',d.area)};
G.startPortal=it=>startPortal(it);
G.teleport=(area,x,z)=>{ch.area=area;W.setArea(area);ch.pos.set(x,W.ground(x,z,area),z);ch.state='walk';ch.ret=0;ch.vx=ch.vz=0;ch.anchor=null;snap=true;W.streak(false);W.craterClose()};
G.goStation=i=>{if((G.uActive&&G.uActive())){G.under.toZone(i);return}if(G.view==='2d'){if(ch.area!==i){if(ch.area===-1)G.hubOrigin='surface';const d=dest({dest:i});G.teleport(d.area,d.x,d.z)}G.setMode(i);return}
if(ch.area===i){G.setMode(i);return}if(ch.state==='hang'){ch.state='fall';ch.anchor=null}if(ch.state==='walk'||ch.state==='fall')startPortal({x:ch.pos.x,z:ch.pos.z,kind:'portal',dest:i,from:ch.area<0?0:ch.area,silent:true})};
G.dive=()=>{if(ch.state!=='walk'||G.view!=='3d')return;ch.state='dive';ch.tK=0;ch.dv=ch.pos.clone();ch.auto=null;A.sfx('tab')};
G.dropSpawn=()=>{ch.state='drop';ch.ret=1;ch.pos.set(0,300,8);cp.set(0,300,8);ch.lock=true;ch.vx=ch.vz=0;snap=true};
G.dropRelease=()=>{const p=ch.pos,H=300,T=1.5;p.set(0,H,8);ch.vy=0;ch.dg=2*H/(T*T);ch.lock=true;ch.ret=.9;ch.state='warp';W.streak(true,p.x,p.y-8,p.z)};
G.dropLand=()=>{const p=ch.pos;ch.state='reform';ch.tK=0;ch.ret=1;W.ripple(p.x,p.z,0x000000,3.6,0);setTimeout(()=>W.ripple(p.x,p.z,0x000000,5.5,0),160);A.sfx('splash')};
G.start=()=>{G.started=true;G.setView('3d');$('touch').hidden=!coarse;$('map').hidden=false;G.setMode(0,true)};
G.isMediaArea=a=>(G.uActive&&G.uActive())?(G.uRoom===1||G.uRoom===2):(a===1||a===2||a>=5);
G.on('mixer',e=>{if(G.started&&G.view==='3d'&&e.src&&!G.loop&&!G.isMediaArea(ch.area)&&!(G.media&&G.media.has()))A.setLoop(true)});
// hint
let lh='';const hint=$('hint'),mn=n=>`<b>${n}</b>`;
function setHint(){let h='';const s=ch.state;if((G.uActive&&G.uActive())){h=G.view==='3d'?G.under.hint():'';if(h!==lh){lh=h;hint.innerHTML=h;hint.hidden=!h}return}if(G.view==='3d'&&G.started){
if(s==='hang')h=`${mn(G.chName(ch.anchor.i,ch.area))} ${G.fmtDb(G.db[ch.anchor.i])}${G.mute[ch.anchor.i]?' MUTE':''} · ${mn('↑ ↓')} 조절 · ${mn(coarse?'MUTE':'M')} 음소거 · ◀▶ 채널 · ${mn('SPACE')} 내려오기`;
else if(s==='held')h=FD().length?'페이더 위에 놓으면 올라탑니다':'놓으면 물 위로 떨어집니다';
else if(s==='walk'&&G.fp&&G.fpTarget)h=`${mn(coarse?'ACT':'클릭 / SPACE')} ${G.fpTarget.label}`;
else if(s==='walk'&&ch.over)h=`${mn(coarse?'ACT':'SPACE')} ${ch.over.label}`;
else if(s==='walk'&&FD().some(f=>Math.hypot(f.x-ch.pos.x,W.capZ(f.i)-ch.pos.z)<3.6))h=`${mn(coarse?'ACT':'SPACE')} 페이더 위로 올라가기`;
else if(s==='walk'&&G.fp)h=coarse?'VR 1인칭 · 드래그로 조준 · ACT 조준한 버튼 사용 · 조이스틱 이동':(document.pointerLockElement===cv?`VR 1인칭 · ${mn('마우스')} 조준 · ${mn('클릭')} 조준한 버튼 사용 · ${mn('WASD')} 이동 · ${mn('방향키')} 시점 · ${mn('ESC')} 해제`:`VR 1인칭 · ${mn('클릭')} 마우스로 둘러보기 · ${mn('WASD')} 이동 · ${mn('방향키')} 시점 · ${mn('V')} 끄기`);
else if(s==='walk')h=coarse?'조이스틱 이동 · 원형 입구에서 ACT · 캐릭터 드래그 · 두 번 탭 AI':`${mn('WASD')} 이동 · ${mn('SHIFT')} 달리기 · 원형 입구에서 ${mn('SPACE')} · 캐릭터 ${mn('드래그')} · ${mn('더블클릭')} AI · ${mn('TAB')} 2D`}
if(h!==lh){lh=h;hint.innerHTML=h;hint.hidden=!h}}
// frame
let prev=performance.now();
function frame(now){requestAnimationFrame(frame);const dt=Math.min(.05,(now-prev)/1e3);prev=now;time+=dt;if((G.uActive&&G.uActive())){G.under.frame(dt,time);G.ticks.forEach(f=>f(dt,time));setHint();return}const t=time,p=ch.pos,m3=G.view==='3d'&&G.started,b=bnd(ch.area);
let mode='walk',sx=1,sy=1,sz=1,agit=0,ret=ch.ret,anchor=null,gy=gnd(),spd=0;
const st=ch.state;
if(st==='walk'){let dx=(K.right?1:0)-(K.left?1:0),dz=(K.down?1:0)-(K.up?1:0);if(G.fp&&m3){const fw=-dz,sd=dx,sn=Math.sin(ch.yaw),cs=Math.cos(ch.yaw);dx=sn*fw-cs*sd;dz=cs*fw+sn*sd}if(ch.dashT>0){ch.dashT-=dt;if(!dx&&!dz){dx=Math.sin(ch.yaw);dz=Math.cos(ch.yaw)}}
if(m3&&ch.auto&&!dx&&!dz){const ax=ch.auto.x-p.x,az=ch.auto.z-p.z,d=Math.hypot(ax,az);if(d<.5)ch.auto=null;else{dx=ax/d;dz=az/d}}if(!m3){dx=dz=0}
const l=Math.hypot(dx,dz);if(l>0){dx/=l;dz/=l}const mx=(ch.area<0?15:11)*(ch.sprint?1.8:1)*(ch.dashT>0?3.4:1),ax=1-Math.exp(-dt*(ch.dashT>0?40:8));ch.vx+=(dx*mx-ch.vx)*ax;ch.vz+=(dz*mx-ch.vz)*ax;
p.x=clamp(p.x+ch.vx*dt,b.x0,b.x1);p.z=clamp(p.z+ch.vz*dt,b.z0,b.z1);spd=Math.hypot(ch.vx,ch.vz);
if(spd>.5&&(!G.fp||ch.auto))ch.yaw+=((Math.atan2(ch.vx,ch.vz)-ch.yaw+Math.PI*3)%(Math.PI*2)-Math.PI)*Math.min(1,dt*10);
gy=gnd();p.y+=(gy-p.y)*Math.min(1,dt*14);ch.k=Math.min(1.4,spd/12);ch.phase+=dt*(3+ch.k*8);mode=spd>.6?'walk':'idle';
ch.rt-=dt;if(spd>2&&ch.rt<=0){ch.rt=.4;W.ripple(p.x,p.z,0x000000,1.3,gy)}
ch.fpYaw=ch.yaw;ch.over=null;let bd=1e9;for(const it of G.inter){if(it.area!==ch.area)continue;const d=Math.hypot(p.x-it.x,p.z-it.z);if(d<it.r&&d<bd){bd=d;ch.over=it}}
if(ch.pend&&!ch.auto){ch.pend=false;if(ch.over)doEnter()}}
else if(st==='fall'){ch.vy-=26*dt;p.y+=ch.vy*dt;const b2=bnd(ch.area);p.x=clamp(p.x,b2.x0,b2.x1);gy=gnd();if(p.y<=gy&&ch.vy<=0){p.y=gy;ch.state='walk';ch.vx=ch.vz=0;if(ch.area<0){W.ripple(p.x,p.z,0x000000,2.8,0);A.sfx('splash')}else A.sfx('slam')}mode='held';agit=.5}
else if(st==='leap'){const L=ch.leap;L.t+=dt/.4;const k=Math.min(1,L.t),e=ease(k),tg=hangPos(L.f);p.set(L.from.x+(tg.x-L.from.x)*e,L.from.y+(tg.y-L.from.y)*e+Math.sin(k*3.14)*1.8,L.from.z+(tg.z-L.from.z)*e);mode='held';agit=.6;if(k>=1)hangAt(L.f)}
else if(st==='hang'){const f=ch.anchor,dy=(K.up?1:0)-(K.down?1:0);if(dy&&m3)G.setDb(f.i,G.db[f.i]+dy*16*dt,'key');const tg=hangPos(f);p.x+=(tg.x-p.x)*Math.min(1,dt*14);p.y=tg.y;p.z+=(tg.z-p.z)*Math.min(1,dt*14);ch.yaw+=(0-ch.yaw)*Math.min(1,dt*8);mode='idle';ch.k=0;agit=.15;if(G.fp)ch.yaw=ch.fpYaw??ch.yaw}
else if(st==='held'){if(ch.held){const r=Math.min(1,dt*16);p.x+=(ch.held.x-p.x)*r;p.y+=(ch.held.y-p.y)*r;p.z+=(ch.held.z-p.z)*r}mode='held';agit=1;sy=1.12;if(!G.fp)ch.yaw+=(0-ch.yaw)*Math.min(1,dt*6)}
else if(st==='slam'){const it=ch.inter,s=ch.slamK=Math.min(1.001,ch.slamK+dt/.85);p.x+=(it.x-p.x)*Math.min(1,dt*12);p.z+=(it.z-p.z)*Math.min(1,dt*12);if(!G.fp)ch.yaw+=(0-ch.yaw)*Math.min(1,dt*10);gy=gnd();
const hop=s<.4?Math.sin(s/.4*Math.PI)*1.6:0,sq=s>=.4?1-(s-.4)/.6:0;p.y=gy+hop;sy=1-.55*sq+(s<.4?.2*Math.sin(s/.4*Math.PI):0);sx=sz=1+.4*sq;mode='slam';
if(!ch.hit&&s>=.4){ch.hit=true;A.sfx('slam');if(it.kind==='pad'){W.pressPad(it.pad)}else{W.crater(it.x,it.z,gy);W.ripple(it.x,it.z,0x000000,3.4,gy)}}
if(s>=1){if(it.kind==='pad')ch.state='walk';else{ch.state='melt';ch.tK=0;A.sfx('splash')}}}
else if(st==='melt'){ch.tK=Math.min(1,ch.tK+dt/.75);const e=ease(ch.tK);ch.ret=ret=e;sx=sz=1-.5*e;sy=1-.15*e;p.y=gy-2.3*e;mode='slam';
if(ch.tK>=1){const d=dest(ch.inter);if(d.under){ch.state='walk';ch.ret=0;ret=0;W.craterClose();G.under.enter({door:d.door})}else{if(ch.area===-1)G.hubOrigin='surface';ch.area=d.area;W.setArea(d.area);p.set(d.x,W.ground(d.x,d.z,d.area)+27,d.z);ch.vy=0;ch.state='warp';snap=true;W.craterClose();W.streak(true,p.x,p.y,p.z);if(d.area>=0)G.setMode(d.area<5?d.area:2,true);G.emit('travel',d.area)}}}
else if(st==='dive'){ch.tK=Math.min(1.7,ch.tK+dt/1.0);const k=ch.tK,e=(k>1?1:k)*(k>1?1:k)*(3-2*(k>1?1:k)),f=ch.dv,tx2=clamp(f.x-G.O(ch.area).x,-24,24)+G.O(ch.area).x;p.x=f.x+(tx2-f.x)*e;p.z=f.z+(-23.2-f.z)*e;p.y=f.y+(G.ZY+(G.screenY||18)-f.y)*e+Math.sin(Math.min(1,k*1.15)*Math.PI)*4.5;if(!ch.rg){ch.rg=[0,1,2,3].map(()=>{const r=G.poly(1,56,0,1);r.visible=false;r.frustumCulled=false;G.scene.add(r);return r})}
const wy=G.ZY+(G.screenY||18);ch.rg.forEach((r,i)=>{const u=(k-.7)/.9,v=Math.max(0,Math.min(1,u-i*.16));r.visible=v>0&&v<1;r.position.set(tx2,wy,-23.6);r.scale.setScalar(1+v*18);r.material.opacity=(1-v)*.95});if(k>.9&&k<1.3&&Math.random()<.5)W.ripple(tx2+(Math.random()-.5)*8,-20.5,0x000000,3.2,G.ZY);if(k<.2&&!ch.rp){ch.rp=1;W.ripple(f.x,f.z,0x000000,3.4,G.ZY)}
if(k<1.001){}else if(k<1.3){mode='held';sx=sy=sz=.001}ch.yaw+=((Math.PI-ch.yaw+Math.PI*3)%(Math.PI*2)-Math.PI)*Math.min(1,dt*10);const sc=1-.8*e;sx=sy=sz=sc;mode='held';agit=.7;ret=ch.ret=e*.5;
if(k>=1.7){ch.rg.forEach(r=>r.visible=false);ch.rp=0;const pg=ch.area<5?ch.area:2;ch.state='walk';ch.ret=0;ch.vx=ch.vz=0;p.set(f.x,gnd(),-17);ch.yaw=Math.PI;snap=true;A.sfx('splash');G.setMode(pg,true);G.setView('2d')}}
else if(st==='drop'){sx=sy=sz=.001;ret=ch.ret=1;mode='held'}
else if(st==='warp'){ch.vy-=(ch.dg||62)*dt;p.y+=ch.vy*dt;gy=gnd();ret=ch.ret=.9;sx=sz=.5;sy=1.4;mode=p.y>gy+2?'held':'idle';W.streak(true,p.x,p.y-8,p.z);if(p.y<=gy){p.y=gy;ch.lock=false;ch.dg=0;ch.state='reform';ch.tK=0;W.streak(false);A.sfx('splash');W.ripple(p.x,p.z,0x000000,3.6,gy);setTimeout(()=>W.ripple(p.x,p.z,0x000000,5.5,gy),160)}}
else if(st==='reform'){ch.tK=Math.min(1,ch.tK+dt/.65);const e=ease(ch.tK);ret=ch.ret=1-e;sx=sz=.55+.45*e+Math.sin(e*3.14)*.25;sy=.7+.3*e;p.y=gnd();mode='idle';if(ch.tK>=1){ch.state='walk';ch.ret=0;ch.vx=ch.vz=0}}
if(fpK>.55){sx*=.001;sy*=.001;sz*=.001}
G.char.update({x:p.x,y:p.y,z:p.z,yaw:ch.yaw,mode,t,dt,phase:ch.phase,k:ch.k,sx,sy,sz,ret,anchor,agit,snap:false});if(fpK>.55)G.char.parts.forEach(m=>m.visible=false);
// camera
const asp=G.W/G.H,D=clamp(10.5/(Math.tan(24*Math.PI/180)*asp)*1.2*1.5,30,64),H=D*(ch.area>=0?.62:.52),r=snap||ch.lock?1:Math.min(1,dt*((st==='warp'||st==='melt')?9:4));snap=false;
cp.x+=(p.x-cp.x)*r;cp.y+=(p.y-cp.y)*r;cp.z+=(p.z-cp.z)*r;if(G.fp&&m3&&(LK.l||LK.r||LK.u||LK.d)){ch.yaw-=(LK.r-LK.l)*dt*2.2;ch.fpYaw=ch.yaw;fpPitch=clamp(fpPitch+(LK.u-LK.d)*dt*1.3,-1.1,1.1)}
if(!m3&&document.pointerLockElement===cv)try{document.exitPointerLock()}catch(_){}
fpK+=((G.fp&&m3&&st!=='drop'?1:0)-fpK)*Math.min(1,dt*4.5);if(fpK<.002)fpK=0;if(fpK>.998)fpK=1;
const L3=new V(cp.x,cp.y+1.8+(ch.area>=0?7:0),cp.z-D*.2);
G.fpK=fpK;if(fpK>0){const e=ease(fpK),fc=G.fpCam?G.fpCam(ch,dt,t,st):{eye:2.1,by:Math.sin(ch.phase*2)*.07*ch.k,bx:0,roll:0,fov:0},fx=Math.sin(ch.yaw),fz=Math.cos(ch.yaw),ex=p.x-fz*fc.bx,ez=p.z+fx*fc.bx,ey=p.y+fc.eye+fc.by,pt=fpPitch+(fc.pitch||0),cq=Math.cos(pt),Lf=new V(ex+fx*cq*10,ey+Math.sin(pt)*10,ez+fz*cq*10);cam.position.set(cp.x+(ex-cp.x)*e,cp.y+H+(ey-cp.y-H)*e,cp.z+D+(ez-cp.z-D)*e);cam.lookAt(L3.lerp(Lf,e));if(fc.roll)cam.rotateZ(fc.roll*e);G._fva=(fc.fov||0)*e}else{G._fva=0;cam.position.set(cp.x,cp.y+H,cp.z+D);cam.lookAt(L3)}
{const fv=48+22*ease(fpK)+(G._fva||0);if(Math.abs(cam.fov-fv)>.01){cam.fov=fv;cam.updateProjectionMatrix()}}
{const bf=$('bFP');if(bf){if(bf.hidden===m3)bf.hidden=!m3;const ap=String(G.fp);if(bf.getAttribute('aria-pressed')!==ap)bf.setAttribute('aria-pressed',ap)}}
W.update(dt,t);G.ticks.forEach(f=>f(dt,t));G.R.render(G.scene,cam);setHint()}
W.setArea(-1);requestAnimationFrame(frame);
})();
