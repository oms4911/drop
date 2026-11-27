// First-person extras: a per-character reticle, aim-to-interact with a glowing outline on the aimed button,
// and per-character view models + camera motion (PUBG rifle, MapleStory gloves + shuriken, Lineage sword + shield, Modu Marble dice, symbiote tendrils).
(()=>{const T=THREE,W=G.world,A=G.audio,cam=G.cam,ch=G.ch,$=id=>document.getElementById(id),cv=$('gl'),coarse=matchMedia('(pointer:coarse)').matches;
const locked=()=>document.pointerLockElement===cv,TH=()=>G.theme||'spider',clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
if(!cam.parent)G.scene.add(cam);
// ---------- reticle ----------
const css=document.createElement('style');css.textContent=`#ret{position:absolute;z-index:23;left:50%;top:50%;width:64px;height:64px;margin:-32px 0 0 -32px;pointer-events:none;mix-blend-mode:difference;color:#fff;opacity:0;transition:opacity .2s}
#ret svg{width:64px;height:64px;overflow:visible;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
#ret .br{opacity:0;transform:scale(1.6);transition:opacity .15s,transform .18s}#ret.on .br{opacity:1;transform:scale(1)}
#ret .core{transition:transform .15s}#ret.on .core{transform:scale(1.18)}#ret.fire .core{transform:scale(.88)}
#ret b{position:absolute;left:50%;top:58px;transform:translateX(-50%);white-space:nowrap;font:600 11px var(--fm);letter-spacing:.06em;opacity:0;transition:opacity .15s}#ret.on b{opacity:1}`;
document.head.appendChild(css);
const tend=Array.from({length:6},(_,k)=>{const a=k/6*6.2832+.26,P=(r,o)=>`${(Math.cos(a+o)*r).toFixed(2)},${(Math.sin(a+o)*r).toFixed(2)}`;return`<path d="M${P(4.5,0)} Q${P(8,.38)} ${P(10.5,.12)}"/>`}).join('');
const SV={spider:`<circle r="1.5" fill="currentColor" stroke="none"/>${tend}`,
pubg:`<circle r="1" fill="currentColor" stroke="none"/><g class="sp" data-d="0,-1"><path d="M0,-5V-11"/></g><g class="sp" data-d="0,1"><path d="M0,5V11"/></g><g class="sp" data-d="-1,0"><path d="M-5,0H-11"/></g><g class="sp" data-d="1,0"><path d="M5,0H11"/></g>`,
maple:`<path d="M0,-9Q1.3,-1.3 9,0Q1.3,1.3 0,9Q-1.3,1.3 -9,0Q-1.3,-1.3 0,-9Z"/><circle r="13" stroke-dasharray="2 4.8"/>`,
lineage:`<path d="M0,-11L5,-6M6,-5L11,0L6,5M5,6L0,11L-5,6M-6,5L-11,0L-6,-5M-5,-6L0,-11"/><circle r="1.3" fill="currentColor" stroke="none"/><path d="M0,-4V-7M0,4V7"/>`,
marble:`<path d="M-9,-5V-9H-5M5,-9H9V-5M9,5V9H5M-5,9H-9V5"/><circle r="2" fill="currentColor" stroke="none"/><circle cx="-4.5" cy="-4.5" r="1" fill="currentColor" stroke="none"/><circle cx="4.5" cy="4.5" r="1" fill="currentColor" stroke="none"/>`};
const ret=document.createElement('div');ret.id='ret';ret.innerHTML='<svg viewBox="-32 -32 64 64"><g class="core"></g><g class="br"><path d="M-21,-14V-21H-14M14,-21H21V-14M21,14V21H14M-14,21H-21V14"/></g></svg><b></b>';$('app').appendChild(ret);
const core=ret.querySelector('.core'),lab=ret.querySelector('b');let curT=null,spl=[];
const setRet=id=>{if(curT===id)return;curT=id;core.innerHTML=SV[id]||SV.spider;spl=[...core.querySelectorAll('.sp')].map(g=>({g,d:g.dataset.d.split(',').map(Number)}))};
// ---------- aiming ----------
const ray=new T.Raycaster(),cen=new T.Vector2(0,0),grp=a=>a<0?W.hub:W.zones[a];
function sizeOf(it){if(it._sz)return it._sz;let sz=null;
if(it.kind==='portal')sz={c:1,r:Math.min(it.r,2.6)};else if(it.kind==='pad')sz={w:it.r*2,h:it.r*2};
else{const g=grp(it.area);let best=0;if(g)g.children.forEach(c=>{if(!c.isLineSegments||Math.abs(c.rotation.x+Math.PI/2)>.01)return;const wx=g.position.x+c.position.x,wz=g.position.z+c.position.z;if(Math.abs(wx-it.x)>.35||Math.abs(wz-it.z)>.35)return;
if(!c.geometry.boundingBox)c.geometry.computeBoundingBox();const b=c.geometry.boundingBox,w=b.max.x-b.min.x,h=b.max.y-b.min.y;if(w*h>best&&w<30&&h<30){best=w*h;sz={w,h}}})}
return it._sz=sz||{c:1,r:it.r}}
function pick(){if(!(G.fp&&G.view==='3d'&&G.started&&(G.fpK||0)>.85))return null;if(!['walk','hang'].includes(ch.state))return null;
ray.setFromCamera(cen,cam);const o=ray.ray.origin,d=ray.ray.direction;if(d.y>-.015)return null;let best=null,bt=90;
const test=(y,cx,cz,sz,obj)=>{const t=(y-o.y)/d.y;if(t<0||t>bt)return;const hx=o.x+d.x*t-cx,hz=o.z+d.z*t-cz,m=.4;
if(sz.c?Math.hypot(hx,hz)<sz.r+m:Math.abs(hx)<sz.w/2+m&&Math.abs(hz)<sz.h/2+m){bt=t;best=Object.assign(obj,{y,cx,cz,sz})}};
for(const it of G.inter){if(it.area!==ch.area||it===ch.over)continue;test(W.ground(it.x,it.z,it.area)+.07,it.x,it.z,sizeOf(it),{it,label:it.label})}
for(const f of G.faders){if(f.area!==ch.area||f===ch.anchor)continue;test(G.ZY+.35,f.x,W.capZ(f.i),{w:3.2,h:2.6},{f,label:G.chName(f.i,f.area)+' 페이더 올라타기'})}
return best}
// glowing outline on the aimed button
const hl=new T.Group();hl.visible=false;hl.renderOrder=6;G.scene.add(hl);let hlKey=null,flash=0;
const LY=[[0,1],[.18,.7],[.42,.42],[.75,.2],[1.15,.08]];
function rectPts(w,h){const x=w/2,z=h/2;return[-x,0,-z,x,0,-z,x,0,-z,x,0,z,x,0,z,-x,0,z,-x,0,z,-x,0,-z]}
function ringPts(r){const p=[];for(let i=0;i<48;i++){const a=i/48*6.2832,b=(i+1)/48*6.2832;p.push(Math.cos(a)*r,0,Math.sin(a)*r,Math.cos(b)*r,0,Math.sin(b)*r)}return p}
function buildHL(sz){hl.children.slice().forEach(c=>{hl.remove(c);c.geometry.dispose();c.material.dispose()});
LY.forEach(([k,op])=>{const m=G.lineset(sz.c?ringPts(sz.r+k):rectPts(sz.w+k*2,sz.h+k*2),0x000000,op);m.material.depthTest=false;m.renderOrder=6;m.userData.op=op;hl.add(m)});
const e=sz.c?sz.r+1.6:0,cw=sz.c?e:sz.w/2+1.5,chh=sz.c?e:sz.h/2+1.5,L=.9,q=[];for(const[sx,sz2]of[[-1,-1],[1,-1],[1,1],[-1,1]]){const X=sx*cw,Z=sz2*chh;q.push(X,0,Z,X-sx*L,0,Z,X,0,Z,X,0,Z-sz2*L)}
const br=G.lineset(q,0x000000,1);br.material.depthTest=false;br.renderOrder=7;br.userData.br=1;br.userData.op=1;hl.add(br)}
// ---------- view models (children of the camera; fog-free, lines + light fills like the rest of the world) ----------
const INK=0x111111,FILL=0xeaeaea,DARK=0x2a2a2a,MID=0xc9c9c9,WHITE=0xf7f7f7;
const LM=()=>new T.LineBasicMaterial({color:INK,fog:false}),FM=c=>new T.MeshBasicMaterial({color:c,fog:false,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1});
const solid=(geo,f=FILL)=>{const g=new T.Group(),m=new T.Mesh(geo,FM(f)),l=new T.LineSegments(new T.EdgesGeometry(geo,24),LM());m.renderOrder=l.renderOrder=10;g.add(m,l);return g};
const at=(o,x,y,z,rx=0,ry=0,rz=0)=>{o.position.set(x,y,z);o.rotation.set(rx,ry,rz);return o};
const box=(w,h,d,f)=>solid(new T.BoxGeometry(w,h,d),f),cyl=(r,h,f,n=10)=>solid(new T.CylinderGeometry(r,r,h,n),f),ball=(r,f,d=1)=>solid(new T.IcosahedronGeometry(r,d),f);
const vm=new T.Group();vm.visible=false;cam.add(vm);const VM={};let cur=null;
const B={
pubg(){const g=new T.Group(),gun=new T.Group();g.add(gun);
gun.add(at(box(.05,.075,.34),0,0,0),at(cyl(.022,.13,MID),0,.066,-.02,Math.PI/2),at(box(.018,.03,.02,DARK),0,.04,-.07),at(box(.018,.03,.02,DARK),0,.04,.03),
at(box(.056,.06,.22,MID),0,-.005,-.27),at(cyl(.011,.2,DARK,8),0,.005,-.48,Math.PI/2),at(cyl(.017,.05,DARK,8),0,.005,-.6,Math.PI/2),
at(box(.035,.13,.06,DARK),0,-.09,-.06,.25),at(box(.032,.085,.04,DARK),0,-.075,.09,-.35),at(box(.04,.07,.16),0,-.015,.25),
at(box(.062,.056,.09,DARK),0,-.085,.1),at(box(.075,.075,.32,MID),.05,-.15,.27,-.42),at(box(.07,.05,.1,DARK),-.004,-.056,-.3),at(box(.075,.075,.36,MID),-.11,-.16,-.13,-.3,.55));
const fl=new T.Group(),q=[];for(let k=0;k<7;k++){const a=k/7*6.2832,r=.05+(k%2)*.04;q.push(0,0,0,Math.cos(a)*r,Math.sin(a)*r,-.03)}const fm=new T.LineSegments(new T.BufferGeometry().setAttribute('position',new T.Float32BufferAttribute(q,3)),LM());fm.renderOrder=10;fl.add(fm,at(ball(.022,WHITE,0),0,0,0));fl.position.set(0,.005,-.65);fl.visible=false;gun.add(fl);
gun.scale.setScalar(.62);g.userData={gun,fl};return g},
maple(){const g=new T.Group(),hand=(s)=>{const h=new T.Group();h.add(at(ball(.065,WHITE),0,0,0),at(ball(.028,WHITE),-s*.06,.03,-.02),at(cyl(.05,.07,MID,12),s*.02,-.05,.07,.9));h.children[0].scale.set(1,.85,1.12);return h};
const R=at(hand(1),.23,-.22,-.5),L=at(hand(-1),-.26,-.24,-.52);R.scale.setScalar(.72);L.scale.setScalar(.72);
const sh=new T.Shape();for(let i=0;i<8;i++){const a=i/8*6.2832-Math.PI/2,r=i%2?.016:.055;i?sh.lineTo(Math.cos(a)*r,Math.sin(a)*r):sh.moveTo(Math.cos(a)*r,Math.sin(a)*r)}
const star=solid(new T.ExtrudeGeometry(sh,{depth:.008,bevelEnabled:false}),DARK),sp=new T.Group();sp.add(star);star.add(at(solid(new T.CylinderGeometry(.012,.012,.012,10),WHITE),0,0,.004,Math.PI/2));sp.position.set(.18,-.16,-.52);sp.scale.setScalar(.8);
g.add(R,L,sp);g.userData={R,L,sp};return g},
lineage(){const g=new T.Group(),sw=new T.Group();sw.add(at(box(.07,.07,.1,DARK),0,0,0),at(box(.16,.022,.03,DARK),0,.05,0),at(box(.028,.52,.009,WHITE),0,.31,0),at(box(.008,.48,.011,MID),0,.31,0),at(ball(.022,DARK,0),0,-.06,0));sw.scale.setScalar(.85);
sw.position.set(.22,-.24,-.46);sw.rotation.set(-.85,0,-.18);const sd=new T.Group();sd.add(at(box(.34,.44,.03,FILL),0,0,0),at(box(.32,.02,.035,DARK),0,0,0),at(box(.02,.42,.035,DARK),0,0,0));sd.position.set(-.47,-.37,-.62);sd.rotation.set(.05,.6,.12);sd.scale.setScalar(.4);
g.add(sw,sd);g.userData={sw,sd};return g},
marble(){const g=new T.Group(),d=box(.085,.085,.085,WHITE),pip=(x,y,z,ax)=>{const m=at(solid(new T.CylinderGeometry(.009,.009,.003,10),DARK),x,y,z);if(ax==='x')m.rotation.z=Math.PI/2;if(ax==='z')m.rotation.x=Math.PI/2;d.add(m)};
pip(0,.044,0);[[-.02,-.02],[.02,.02]].forEach(([a,b])=>pip(a,b,.044,'z'));[[-.02,-.02],[0,0],[.02,.02]].forEach(([a,b])=>pip(.044,a,b,'x'));
const dd=new T.Group();dd.add(d);dd.position.set(.2,-.19,-.5);dd.scale.setScalar(.68);const hand=at(box(.09,.05,.11,FILL),.21,-.228,-.49,.1);hand.scale.setScalar(.68);const card=at(box(.11,.16,.004,FILL),-.32,-.27,-.52,-.3,.35,.2);card.scale.setScalar(.6);
card.add(at(box(.09,.025,.006,DARK),0,.055,0));g.add(dd,hand,card);g.userData={dd,d,card};return g},
spider(){const g=new T.Group(),T4=[];for(let k=0;k<4;k++){const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(new Float32Array(11*3),3));const l=new T.Line(geo,new T.LineBasicMaterial({color:INK,fog:false}));l.frustumCulled=false;l.renderOrder=10;g.add(l);
const l2=new T.Line(geo,new T.LineBasicMaterial({color:INK,fog:false,transparent:true,opacity:.35}));l2.position.set(.003,-.003,0);l2.frustumCulled=false;g.add(l2);T4.push(geo)}g.userData={T4};return g}};
function useVM(id){if(cur===id)return;if(VM[cur])VM[cur].visible=false;cur=id;if(!VM[id]&&B[id]){VM[id]=B[id]();vm.add(VM[id])}if(VM[id])VM[id].visible=true}
// ---------- helix pieces: monochrome double outline (black core + white halo) while in first person ----------
let hxOn=null,hxT=0;
function helixHalo(on){const P=G.items&&G.items.pieces;if(!P)return;P.forEach(p=>p.root.traverse(o=>{if(o.userData.isHalo||!(o.isLineSegments||o.isLine)||!o.material||!o.material.color)return;
if(o.userData.hx0==null)o.userData.hx0=o.material.color.getHex();let h=o.userData.halo;
if(on&&!h){h=new (o.isLineSegments?T.LineSegments:T.Line)(o.geometry,new T.LineBasicMaterial({color:0xffffff,transparent:true,depthWrite:false}));h.userData.isHalo=1;h.scale.setScalar(1.035);h.renderOrder=(o.renderOrder||0)-1;h.frustumCulled=false;o.add(h);o.userData.halo=h}
if(h){h.visible=on;if(on)h.material.opacity=Math.min(1,(o.material.opacity??1)*1.2)}o.material.color.setHex(on?0x000000:o.userData.hx0)}))}
G.ticks.push(dt=>{const on=!!(G.fp&&G.view==='3d'&&(G.fpK||0)>.5);hxT-=dt;if(on!==hxOn||(on&&hxT<=0)){hxOn=on;hxT=.4;helixHalo(on)}});
// ---------- motion ----------
let sprintK=0,act=0,actId=null,firing=false,fireCd=0,prevYaw=0,sway=0,recoil=0;
const kick=()=>{act=1;actId=TH();if(actId==='pubg')recoil=1};
addEventListener('keydown',e=>{if(e.code==='Space'&&G.fp&&TH()==='pubg'&&G.view==='3d'&&!G.fpTarget&&!ch.over&&!['INPUT','TEXTAREA'].includes(e.target.tagName))firing=true});
addEventListener('keyup',e=>{if(e.code==='Space')firing=false});addEventListener('blur',()=>{firing=false});
const EYE={spider:1.55,pubg:3.25,maple:3.15,lineage:3.55,marble:2.95},FC={eye:2.1,by:0,bx:0,roll:0,fov:0,pitch:0};
G.fpCam=(c,dt,t)=>{const id=TH(),k=c.state==='walk'?c.k:0,ph=c.phase,sp=sprintK;let by=0,bx=0,roll=0,fov=0;
if(id==='pubg'){by=Math.sin(ph*2)*(.05+.1*sp)*k;bx=Math.sin(ph)*(.03+.07*sp)*k;roll=Math.sin(ph)*.012*(1+sp)*k;fov=7*sp}
else if(id==='maple'){by=Math.abs(Math.sin(ph))*.24*k;roll=Math.sin(ph)*.008*k}
else if(id==='lineage'){by=Math.sin(ph*2)*.1*k;roll=Math.sin(ph)*.03*k;fov=-3}
else if(id==='marble'){by=Math.abs(Math.sin(ph))*.36*k}
else{by=Math.sin(ph*4)*.035*k+Math.sin(t*9)*.004;roll=Math.sin(ph*2)*.014*k;fov=4}
FC.eye=EYE[id]||2.1;FC.by=0;FC.bx=0;FC.roll=0;FC.fov=fov;FC.pitch=0;return FC};
G.fpClick=()=>{const tg=G.fpTarget;kick();if(!tg)return;flash=1;A.sfx('blip');const H=G.fpHooks||{};
if(tg.f){if(ch.state==='hang'){ch.anchor=tg.f;A.sfx('hang')}else if(ch.state==='walk'&&H.leap)H.leap(tg.f);return}
const it=tg.it;W.ripple(it.x,it.z,0x000000,2.6,tg.y);if(it.kind==='use')it.fn();else if(it.kind==='pad')W.pressPad(it.pad);else if(it.kind==='portal'&&ch.state==='walk'&&H.startPortal)H.startPortal(it)};
G.ticks.push((dt,t)=>{const on=G.fp&&G.view==='3d'&&G.started&&(G.fpK||0)>.7&&!['drop','warp','melt','dive'].includes(ch.state),id=TH();
// target + outline
const tg=on?pick():null;G.fpTarget=tg;const key=tg?(tg.it||tg.f):null;
if(key!==hlKey){hlKey=key;if(tg){buildHL(tg.sz);flash=Math.max(flash,.6)}}
hl.visible=!!tg;if(tg){hl.position.set(tg.cx,tg.y+.03,tg.cz);const p=.5+.5*Math.sin(t*7);hl.scale.setScalar(1+flash*.12);hl.children.forEach(c=>{c.material.opacity=c.userData.br?.55+.45*p:c.userData.op*(.55+.45*p)*(1+flash)})}
flash=Math.max(0,flash-dt*2.6);
// reticle
setRet(id);ret.style.opacity=on?(locked()||coarse?.95:.45):0;ret.classList.toggle('on',!!tg&&on);ret.classList.toggle('fire',act>.5);if(tg&&lab.textContent!==tg.label)lab.textContent=tg.label;
const moving=ch.state==='walk'?ch.k:0;sprintK+=(((ch.sprint&&moving>.5)?1:0)-sprintK)*Math.min(1,dt*7);
if(spl.length){const g=3*moving+9*sprintK+5*act;spl.forEach(s=>s.g.style.transform=`translate(${s.d[0]*g}px,${s.d[1]*g}px)`)}
// view model
vm.visible=on;if(!on)return;useVM(id);const m=VM[id];if(!m)return;const u=m.userData,ph=ch.phase,k=moving;
let dy=ch.yaw-prevYaw;dy=((dy+Math.PI*3)%(Math.PI*2))-Math.PI;prevYaw=ch.yaw;sway+=(clamp(-dy/Math.max(dt,1e-3)*.012,-.08,.08)-sway)*Math.min(1,dt*10);
if(firing&&id==='pubg'){fireCd-=dt;if(fireCd<=0){fireCd=.095;kick()}}
act=Math.max(0,act-dt*(id==='pubg'?9:3.2));recoil=Math.max(0,recoil-dt*8);
const bobX=Math.sin(ph)*.012*k,bobY=-Math.abs(Math.cos(ph))*.012*k,breathe=Math.sin(t*1.7)*.004*(1-Math.min(1,k));
m.position.set(bobX+sway*.25,bobY+breathe,0);m.rotation.set(0,sway,0);
if(id==='pubg'){const gun=u.gun,s=sprintK,r=recoil;gun.position.set(.15+.06*s+Math.sin(ph)*.008*k*(1+s),-.17-.08*s+Math.abs(Math.sin(ph))*-.012*k*(1+2*s),-.42+.05*s+r*.03);
gun.rotation.set(.35*s+r*.13+Math.sin(ph*2)*.02*k,.04+.55*s,.45*s+Math.sin(ph)*.03*k);u.fl.visible=r>.55&&s<.5;if(u.fl.visible)u.fl.rotation.z=Math.random()*6.28}
else if(id==='maple'){const hop=Math.abs(Math.sin(ph))*.03*k;u.R.position.y=-.22+hop;u.L.position.y=-.24+Math.abs(Math.sin(ph+1.5))*.03*k;const a=act,throwK=Math.sin(Math.min(1,1-a)*Math.PI);
u.sp.position.set(.18-throwK*.16,-.16+hop+throwK*.1,-.52-throwK*1.6);u.sp.rotation.z+=dt*(2+a*30);u.R.rotation.x=-throwK*.5}
else if(id==='lineage'){const a=act,sl=Math.sin((1-a)*Math.PI)*(a>0?1:0);u.sw.rotation.set(-.85+sl*.6,sl*.5,-.18-sl*1.3);u.sw.position.set(.22-sl*.12,-.24+Math.sin(ph*2)*.01*k,-.46);u.sd.position.y=-.37+Math.sin(ph*2+1)*.012*k;u.sd.rotation.z=.12+Math.sin(ph)*.03*k}
else if(id==='marble'){const a=act,toss=Math.sin((1-a)*Math.PI)*(a>0?1:0);u.dd.position.y=-.19+toss*.1+Math.abs(Math.sin(ph))*.02*k;u.d.rotation.x+=dt*(.4+a*18);u.d.rotation.y+=dt*(.6+a*14);u.card.rotation.z=.2+Math.sin(t*1.3)*.03}
else{const a=act;u.T4.forEach((geo,i)=>{const s=i<2?1:-1,f=i%2,p=geo.attributes.position.array,x0=s*(.42+f*.05),y0=-.36+f*.06,tx=s*(.13+f*.05)*(1-a*.8),ty=-.17+f*.05+a*.1,tz=-.45-a*.25;
for(let j=0;j<=10;j++){const v=j/10,w=Math.sin(t*5+i*1.7+v*5)*.025*(1-v*.4)+Math.sin(ph*2+i)*.01*k;p[j*3]=x0+(tx-x0)*v+w*s;p[j*3+1]=y0+(ty-y0)*Math.pow(v,.7)+Math.sin(v*Math.PI)*.04+w;p[j*3+2]=-.35+(tz+.35)*v}geo.attributes.position.needsUpdate=true})}});
})();
