// Collectible helix pieces (one in each of the four work maps + one locked in CONTACT) and the C-key skills they unlock.
(()=>{const T=THREE,W=G.world,A=G.audio,ch=G.ch,ZY=G.ZY,INK=0x000000,$=id=>document.getElementById(id);
const N=5,KEY='drop.helix.v1',R=.9,TURNS=3,H=1.5;let got=[0,0,0,0,0];
try{localStorage.removeItem(KEY)}catch(e){}
const save=()=>{},count=()=>got.reduce((a,b)=>a+b,0),ready=()=>count()===N;
G.items={got,count,ready,reset(){got.fill(0);save();pieces.forEach(p=>p.root.visible=true);hud()}};
const SK={spider:'DASH',pubg:'GRENADE',maple:'SHURIKEN',lineage:'SPEAR',marble:'DICE PET'},skName=()=>SK[G.theme||'spider'];
// ---- geometry
const hx=(t0,t1,yc,sc,steps)=>{const q=[],P=(t,k)=>{const a=t*TURNS*6.2832+k*Math.PI;return[Math.cos(a)*R*sc,(t-yc)*N*H*sc,Math.sin(a)*R*sc]};
for(let s=0;s<steps;s++){const ta=t0+(t1-t0)*s/steps,tb=t0+(t1-t0)*(s+1)/steps;for(const k of[0,1])q.push(...P(ta,k),...P(tb,k));if(s%2===0)q.push(...P(ta,0),...P(ta,1))}return q};
const ring=(r,y,op)=>{const m=G.poly(r,40,INK,op);m.rotation.x=-Math.PI/2;m.position.y=y;return m};
// ---- pieces: [area, local x, local z]
const SPOTS=[[0,-14,-8],[1,-10,-8],[2,-8,-10],[3,-6,-10],[4,-24,-10]],pieces=[];
SPOTS.forEach(([a,x,z],i)=>{const g=W.zones[a];if(!g)return;const root=new T.Group();root.position.set(x,0,z);root.scale.setScalar(1.7);g.add(root);
const fl=new T.Group();fl.position.y=2.6;root.add(fl);const body=G.lineset(hx(i/N,(i+1)/N,(i+.5)/N,1,16),INK,1);fl.add(body);
const ghost=G.lineset(hx(0,1,(i+.5)/N,1,70),INK,.12);fl.add(ghost);
root.add(ring(1.8,.06,.9),ring(1.1,.06,.6));root.add(G.lineset([0,.1,0,0,2.1,0,0,3.2,0,0,6,0],INK,.45));
let lock=null;if(i===N-1){lock=new T.Group();const b=G.box(1.3,1,.6,INK,1,0xf4f4f4);b.position.y=-.1;lock.add(b);const q=[];for(let k=0;k<12;k++){const u=k/12*Math.PI,v=(k+1)/12*Math.PI;q.push(Math.cos(u)*.42,.4+Math.sin(u)*.5,0,Math.cos(v)*.42,.4+Math.sin(v)*.5,0)}lock.add(G.lineset(q,INK,1));fl.add(lock);body.material.opacity=.3}
const p={i,a,x,z,root,fl,body,ghost,lock,open:i<N-1};pieces.push(p);if(got[i])root.visible=false});
// ---- themed look: helix for the default character, a character-specific object for every other theme
const alt=(k)=>{const g=new T.Group();
if(k==='pubg'){const b=G.edges(new T.CylinderGeometry(.34,.34,1.2,12),INK,1,20,null),t=G.edges(new T.ConeGeometry(.34,.7,12),INK,1,20,null);t.position.y=.95;b.position.y=-.1;const r=G.edges(new T.CylinderGeometry(.4,.4,.16,12),INK,1,20,null);r.position.y=-.78;g.add(b,t,r);g.scale.setScalar(1.7)}
else if(k==='maple'){const s=G.lineset(star(1.35),INK,1);s.rotation.x=Math.PI/2;g.add(s);g.rotation.z=.5;g.scale.setScalar(1.5)}
else if(k==='lineage'){const s=G.lineset(spearGeo(),INK,1);s.rotation.x=-Math.PI/2;g.add(s);g.scale.setScalar(.6);g.rotation.z=.25}
else if(k==='marble'){const b=G.box(1.5,1.5,1.5,INK,1,0xf4f4f4);g.add(b);if(G.dieFaces)G.dieFaces(g,1.5,0);g.rotation.x=.5;g.rotation.z=.4}
g.visible=false;return g};
const setOp=(g,o)=>g.traverse(n=>{if((n.isLine||n.isLineSegments)&&n.material){n.material.transparent=true;n.material.opacity=o}});
const ALTS=['pubg','maple','lineage','marble'];
pieces.forEach(p=>{p.alts={};ALTS.forEach(k=>{const a=alt(k);p.fl.add(a);p.alts[k]=a})});
function look(){const k=G.theme||'spider';pieces.forEach(p=>{const he=k==='spider'||!p.alts[k];p.body.visible=he;p.ghost.visible=he;for(const n in p.alts)p.alts[n].visible=n===k})}
G.on('theme',look);
// ---- effects registry (world-space, removed when the area changes)
const fxs=[],add=(f,...o)=>{o.forEach(x=>G.scene.add(x));fxs.push({f,o})},drop=e=>e.o.forEach(o=>{G.scene.remove(o);o.traverse(n=>{if(n.geometry)n.geometry.dispose();if(n.material)n.material.dispose()})});
const fade=(o,k)=>o.traverse(n=>{if(n.material&&n.material.transparent){if(n.userData.o0===undefined)n.userData.o0=n.material.opacity;n.material.opacity=n.userData.o0*k}});
const clearFx=()=>{fxs.forEach(drop);fxs.length=0};G.on('travel',clearFx);
const gnd=(x,z)=>W.ground(x,z,ch.area),flash=()=>{let f=$('flash');if(!f){f=document.createElement('div');f.id='flash';f.style.cssText='position:fixed;inset:0;background:#fff;pointer-events:none;z-index:40;opacity:0;transition:opacity .35s';document.body.appendChild(f)}f.style.transition='none';f.style.opacity='.75';requestAnimationFrame(()=>{f.style.transition='opacity .35s';f.style.opacity='0'})};
const burst=(x,y,z,n,sp,life,col=INK)=>{const q=new Float32Array(n*6),d=[];for(let i=0;i<n;i++){const a=Math.random()*6.283,e=(Math.random()-.2)*1.4;d.push([Math.cos(a)*Math.cos(e),Math.sin(e),Math.sin(a)*Math.cos(e),sp*(.5+Math.random())])}
const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(q,3));const m=new T.LineSegments(geo,G.mat(col,1));m.frustumCulled=false;let t=0;
add(dt=>{t+=dt;d.forEach((v,i)=>{const s0=v[3]*t,s1=s0+.5*(1-t/life);q.set([x+v[0]*s0,y+v[1]*s0-4*t*t,z+v[2]*s0,x+v[0]*s1,y+v[1]*s1-4*t*t,z+v[2]*s1],i*6)});geo.attributes.position.needsUpdate=true;fade(m,Math.max(0,1-t/life));return t<life},m)};
// ---- HUD
const st=document.createElement('style');st.textContent='#frag{position:absolute;z-index:24;top:60px;right:14px;display:flex;align-items:center;gap:4px;padding:5px 8px;background:var(--panel);border:1px solid var(--ink);font:600 10px var(--fm);letter-spacing:.06em;pointer-events:none}#frag i{width:9px;height:14px;border:1px solid var(--ink);background:transparent;transform:skewX(-18deg)}#frag i.on{background:#000}#frag b{margin-left:4px}#frag u{text-decoration:none;background:#000;color:#fff;padding:1px 5px;margin-left:6px}@media (pointer:coarse){#frag{top:56px;padding:4px 6px}#frag .sk{display:none}}';document.head.appendChild(st);
const fr=document.createElement('div');fr.id='frag';fr.hidden=true;document.body.appendChild(fr);
const sb=document.createElement('button');sb.className='big';sb.id='skillBtn';sb.textContent='SKILL';sb.hidden=true;sb.style.touchAction='none';const row=document.querySelector('#acts .r');if(row)row.appendChild(sb);
function hud(){fr.innerHTML=got.map(v=>`<i class="${v?'on':''}"></i>`).join('')+`<b>${count()}/${N}</b>`+(ready()?`<span class="sk"><u>C</u> ${skName()}</span>`:'');sb.hidden=!ready();sb.textContent=skName()}
G.on('theme',hud);hud();look();
// ---- pickup
let lastArea=-9,hint4=false;
function collect(p){got[p.i]=1;save();p.root.visible=false;A.sfx('tab');const wx=G.O(p.a).x+p.x,wz=p.z;W.ripple(wx,wz,0x000000,5,ZY);burst(wx,ZY+2.6,wz,28,9,.9);hud();
if(ready()){flash();A.sfx('splash');burst(wx,ZY+2.6,wz,60,16,1.4);G.toast('HELIX 5/5  ·  C 키 스킬 해금 — '+skName())}
else if(count()===4)G.toast('HELIX 4/5  ·  CONTACT 에 잠겨 있던 마지막 조각이 열립니다');else G.toast('HELIX '+count()+'/5  ·  다른 맵에서 조각을 더 찾아보세요')}
// ---- skills
let cd=0;const dir=()=>[Math.sin(ch.yaw),Math.cos(ch.yaw)];
function dash(){const[fx,fz]=dir(),p=ch.pos;ch.dashT=.3;A.sfx('tab');const full=G.lineset(hx(0,1,.5,.35,60),INK,1),g=new T.Group();g.add(full);let t=0,rt=0;
add(dt=>{t+=dt;rt-=dt;const q=ch.pos;g.position.set(q.x,q.y+2,q.z);g.rotation.y+=dt*14;fade(g,Math.max(0,1-t/.55));if(rt<=0&&t<.35){rt=.04;W.ripple(q.x,q.z,0x000000,2.2,gnd(q.x,q.z));const s=G.poly(1.1,6,INK,.8);s.position.set(q.x,q.y+1.6,q.z);s.rotation.y=ch.yaw+Math.PI/2;let u=0;add(d2=>{u+=d2;s.scale.setScalar(1+u*2);fade(s,Math.max(0,1-u/.35));return u<.35},s)}return t<.55},g);
const sp=[];for(let i=0;i<8;i++){const o=(i-3.5)*.35;sp.push(p.x-fx*.5+fz*o,p.y+1.2+(i%3)*.5,p.z-fz*.5-fx*o,p.x-fx*5-fx*i*.3+fz*o,p.y+1.2+(i%3)*.5,p.z-fz*5-fz*i*.3-fx*o)}const sl=G.lineset(sp,INK,1);let u=0;add(d=>{u+=d;fade(sl,Math.max(0,1-u/.3));return u<.3},sl)}
function explode(x,y,z){A.sfx('slam');flash();W.ripple(x,z,0x000000,9,y);W.ripple(x,z,0x000000,5,y);burst(x,y+.6,z,36,18,.8);
const s=G.edges(new T.IcosahedronGeometry(1,2),INK,1,20,null);s.position.set(x,y+1,z);const r1=G.poly(1,48,INK,1);r1.rotation.x=-Math.PI/2;r1.position.set(x,y+.1,z);let t=0;
add(dt=>{t+=dt;const k=t/.5;s.scale.setScalar(.4+Math.sqrt(Math.min(1,k))*4.6);r1.scale.setScalar(1+k*9);fade(s,Math.max(0,1-k));fade(r1,Math.max(0,1-k*.9));return t<.55},s,r1)}
function grenade(){const[fx,fz]=dir(),p=ch.pos,g=new T.Group();g.add(G.edges(new T.IcosahedronGeometry(.45,1),INK,1,20,null));g.add(G.lineset([0,.45,0,0,.66,0,0,.66,0,.3,.62,0,.22,.52,0,.22,.82,0,-.3,.2,.1,-.3,.7,.1],INK,1));
g.position.set(p.x+fx*1.5,p.y+2.3,p.z+fz*1.5);let vx=fx*15,vz=fz*15,vy=8,t=0;A.sfx('tick');
add(dt=>{t+=dt;vy-=26*dt;g.position.x+=vx*dt;g.position.z+=vz*dt;g.position.y+=vy*dt;g.rotation.x+=dt*9;g.rotation.z+=dt*5;const gy=gnd(g.position.x,g.position.z)+.45;if(g.position.y<gy){g.position.y=gy;if(vy<-3){vy=-vy*.42;vx*=.6;vz*=.6;A.sfx('tick')}else{vy=0;vx*=.88;vz*=.88}}
if(t>=1.4){explode(g.position.x,gy-.45,g.position.z);return false}return true},g)}
function star(r){const q=[],pt=k=>{const a=k*Math.PI/4,rr=k%2?r*.3:r;return[Math.cos(a)*rr,0,Math.sin(a)*rr]};for(let k=0;k<8;k++)q.push(...pt(k),...pt(k+1));for(let k=0;k<12;k++){const a=k/12*6.2832,b=(k+1)/12*6.2832;q.push(Math.cos(a)*r*.12,0,Math.sin(a)*r*.12,Math.cos(b)*r*.12,0,Math.sin(b)*r*.12)}return q}
function shuriken(){const p=ch.pos;A.sfx('tick');for(const da of[-.2,0,.2]){const a=ch.yaw+da,fx=Math.sin(a),fz=Math.cos(a),g=new T.Group(),s=G.lineset(star(.7),INK,1);g.add(s);const tr=G.lineset([0,0,0,-fx*3,0,-fz*3],INK,.6);g.add(tr);
g.position.set(p.x+fx*1.4,p.y+2,p.z+fz*1.4);tr.position.set(0,0,0);let v=34,t=0;
add(dt=>{t+=dt;v*=Math.exp(-1.1*dt);g.position.x+=fx*v*dt;g.position.z+=fz*v*dt;s.rotation.y+=dt*28;tr.visible=t<.9;if(t>.9){g.position.y+=(gnd(g.position.x,g.position.z)+.3-g.position.y)*Math.min(1,dt*8)}if(t>1.1)fade(g,Math.max(0,1-(t-1.1)/.4));return t<1.5},g)}}
function spearGeo(){const q=[0,0,-3,0,0,2.6,0,0,2.6,.28,0,2.1,0,0,2.6,-.28,0,2.1,0,0,2.6,0,.28,2.1,0,0,2.6,0,-.28,2.1,.28,0,2.1,0,0,3.5,-.28,0,2.1,0,0,3.5,0,.28,2.1,0,0,3.5,0,-.28,2.1,0,0,3.5,0,0,-3,.35,0,-3.5,0,0,-3,-.35,0,-3.5,0,0,-2.4,.3,0,-2.9,0,0,-2.4,-.3,0,-2.9];return q}
function spear(){const[fx,fz]=dir(),p=ch.pos,g=new T.Group();g.add(G.lineset(spearGeo(),INK,1));g.position.set(p.x+fx*1.8,p.y+2.2,p.z+fz*1.8);let vx=fx*34,vz=fz*34,vy=4.5,t=0,stuck=0;A.sfx('tab');
add(dt=>{if(!stuck){t+=dt;vy-=16*dt;g.position.x+=vx*dt;g.position.z+=vz*dt;g.position.y+=vy*dt;g.lookAt(g.position.x+vx,g.position.y+vy,g.position.z+vz);const gy=gnd(g.position.x,g.position.z);if(g.position.y<gy+.2||t>2){g.position.y=Math.max(g.position.y,gy+.2);stuck=.0001;A.sfx('slam');W.ripple(g.position.x,g.position.z,0x000000,2.4,gy);burst(g.position.x,gy+.3,g.position.z,10,6,.45)}return true}
stuck+=dt;if(stuck>2)fade(g,Math.max(0,1-(stuck-2)/.5));return stuck<2.5},g)}
// dice pet (marble)
let pet=null,petRoll=null,pvx=0,hopP=0;
function mkPet(){const g=new T.Group(),b=G.box(1.4,1.4,1.4,INK,1,0xf4f4f4);g.add(b);if(G.dieFaces)G.dieFaces(g,1.4,0);const e=new T.MeshBasicMaterial({color:0x111111});for(const x of[-.28,.28]){const m=new T.Mesh(new T.CircleGeometry(.1,10),e);m.position.set(x,.15,.71);g.add(m)}g.visible=false;G.scene.add(g);return g}
function petSkill(){if(!pet||!pet.visible)return;const[fx,fz]=dir();petRoll={t:0,x0:pet.position.x,z0:pet.position.z,x1:ch.pos.x+fx*8,z1:ch.pos.z+fz*8};A.sfx('tab')}
function fire(){if(G.view!=='3d'||!G.started||ch.state!=='walk')return;if(!ready()){G.toast('HELIX '+count()+'/5  ·  5개를 모두 모으면 C 스킬이 열립니다');return}if(cd>0)return;
const k=G.theme||'spider';cd={spider:.7,pubg:.9,maple:.35,lineage:.7,marble:.9}[k];({spider:dash,pubg:grenade,maple:shuriken,lineage:spear,marble:petSkill})[k]()}
addEventListener('keydown',e=>{if(e.code!=='KeyC'||e.repeat||e.ctrlKey||e.metaKey||e.altKey)return;const t=e.target.tagName;if(t==='INPUT'||t==='TEXTAREA')return;fire()});
sb.addEventListener('pointerdown',e=>{e.preventDefault();fire()});
// ---- tick
G.ticks.push((dt,t)=>{cd=Math.max(0,cd-dt);const show=G.started&&G.view==='3d';fr.hidden=!show;
if(ch.area!==lastArea){lastArea=ch.area;if(ch.area===4&&count()===4&&!hint4){hint4=true;G.toast('CONTACT 의 잠금이 풀렸어요  ·  마지막 조각을 가져가세요')}}
for(const p of pieces){if(!got[p.i]){p.fl.rotation.y+=dt*1.3;p.fl.position.y=2.6+Math.sin(t*2+p.i)*.25;const open=p.i<N-1||count()===N-1;if(p.lock){p.lock.visible=!open;p.body.material.opacity=open?1:.3;{const a=p.alts[G.theme||'spider'];if(a)setOp(a,open?1:.3)}p.lock.rotation.y=-p.fl.rotation.y}
if(open&&show&&ch.area===p.a&&(ch.state==='walk'||ch.state==='fall')&&Math.hypot(ch.pos.x-(G.O(p.a).x+p.x),ch.pos.z-p.z)<3.4)collect(p)}}
for(let i=fxs.length-1;i>=0;i--){const e=fxs[i];if(!e.f(dt,t)){drop(e);fxs.splice(i,1)}}
// pet
if(G.theme==='marble'&&ready()&&show){if(!pet)pet=mkPet();const p=ch.pos,[fx,fz]=dir(),was=pet.visible;
if(!was||pet.userData.area!==ch.area){pet.position.set(p.x-fx*2,gnd(p.x,p.z)+.7,p.z-fz*2);pet.userData.area=ch.area}pet.visible=true;
const gy=gnd(pet.position.x,pet.position.z)+.7;
if(petRoll){petRoll.t+=dt/.9;const k=Math.min(1,petRoll.t),e=k*k*(3-2*k);pet.position.x=petRoll.x0+(petRoll.x1-petRoll.x0)*e;pet.position.z=petRoll.z0+(petRoll.z1-petRoll.z0)*e;pet.position.y=gy+Math.sin(k*Math.PI)*4;pet.rotation.x=k*12.566;if(k>=1){petRoll=null;pet.rotation.set(0,pet.rotation.y,0);W.ripple(pet.position.x,pet.position.z,0x000000,2.6,gy-.7);A.sfx('slam')}}
else{const tx=p.x-fx*2.8+fz*1.8,tz=p.z-fz*2.8-fx*1.8,dx=tx-pet.position.x,dz=tz-pet.position.z,d=Math.hypot(dx,dz),r=Math.min(1,dt*3.5);
if(d>14){pet.position.x=tx;pet.position.z=tz}else{pet.position.x+=dx*r;pet.position.z+=dz*r}const mv=d>.6?Math.min(1,(d-.6)/2.5):0;pvx+=(mv-pvx)*Math.min(1,dt*5);hopP+=dt*(4+pvx*5);
pet.position.y=gy+Math.abs(Math.sin(hopP))*pvx*1.1+Math.sin(t*2.2)*.05*(1-pvx);pet.rotation.x*=.9;
if(d>1.2){const ty=Math.atan2(dx,dz);pet.rotation.y+=((ty-pet.rotation.y+Math.PI*3)%(Math.PI*2)-Math.PI)*Math.min(1,dt*5)}}}
else if(pet)pet.visible=false});
G.items.pieces=pieces;
})();
