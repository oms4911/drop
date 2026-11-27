// Themes (3D only): the line-avatar morphs into PUBG / MapleStory / Lineage / Seven Knights style characters and the world is rebuilt as a matching line-art map.
(()=>{const T=THREE,W=G.world,A=G.audio,V=T.Vector3;
G.theme=null;G.battle=false;
const INK=0x111111,FILL=0xeaeaea,DARK=0x262626,LIGHT=0xdedede;
const ss=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
const THEMES=G.THEMES={};G.regTheme=(id,d)=>{THEMES[id]=d};
G.TH={INK,FILL,DARK,LIGHT,ss,cur:null,onTick:f=>{const r=G.TH.cur;if(r)(r.userData.tick=r.userData.tick||[]).push(f)}};
let actKey=false,actCool=0,actT=-1;
const spaceOK=e=>e.code==='Space'&&G.theme&&G.view==='3d'&&G.ch&&G.ch.state==='walk'&&!G.ch.over&&!(G.fp&&G.fpTarget)&&!['INPUT','TEXTAREA'].includes(e.target.tagName);
addEventListener('keydown',e=>{if(spaceOK(e)){if(!actKey&&actCool<=0&&actT<0){actT=0;actCool=.5}actKey=true}});addEventListener('keyup',e=>{if(e.code==='Space')actKey=false});addEventListener('blur',()=>{actKey=false});
{const ab=document.querySelector('#acts button[data-k="enter"]');if(ab){ab.addEventListener('pointerdown',()=>{if(G.theme&&G.view==='3d'&&G.ch&&G.ch.state==='walk'&&!G.ch.over){if(!actKey&&actCool<=0&&actT<0){actT=0;actCool=.5}actKey=true}});const u=()=>{actKey=false};ab.addEventListener('pointerup',u);ab.addEventListener('pointercancel',u)}}
// ---------- rig factory: a humanoid built from filled boxes with light edges; joints are plain groups ----------
const mkRig=(def)=>{const hipY=def.hipY,g=new T.Group();g.visible=false;G.scene.add(g);const piv=new T.Group();piv.position.y=hipY;g.add(piv);const up=new T.Group();up.position.y=-hipY;piv.add(up);
const R={g,piv,up,hipY,legs:[],def};
R.mk=(w,h,d,x,y,z,par=up,rx=0,ry=0,rz=0,fill=DARK,edge=LIGHT)=>{const b=G.box(w,h,d,edge,1,fill);b.position.set(x,y,z);b.rotation.set(rx,ry,rz);par.add(b);return b};
R.limb=(a,b,wd=.2,par=up)=>{const v=new V(b[0]-a[0],b[1]-a[1],b[2]-a[2]),L=v.length(),m=G.box(wd,wd,L,LIGHT,1,DARK);m.position.set((a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2);m.lookAt(m.position.clone().add(v));par.add(m)};
R.leg=(sx,o={})=>{const{x=.3,tl=.9,sl=.85,w=.34,d=.36,ft=[.34,.2,.56]}=o;const h=new T.Group();h.position.set(sx*x,hipY,0);g.add(h);R.mk(w,tl,d,0,-tl/2,0,h);const k=new T.Group();k.position.y=-tl;h.add(k);R.mk(w*.9,sl,d*.9,0,-sl/2,0,k);R.mk(ft[0],ft[1],ft[2],0,-sl+ft[1]/2,ft[2]*.18,k);const Lg={h,k};R.legs.push(Lg);return Lg};
R.arm=(sx,x,y,o={})=>{const{ua=.55,la=.5,w=.22}=o;const s=new T.Group();s.position.set(x,y,0);up.add(s);R.mk(w,ua,w,0,-ua/2,0,s);const e=new T.Group();e.position.y=-ua;s.add(e);R.mk(w*.9,la,w*.9,0,-la/2,0,e);const hand=new T.Group();hand.position.y=-la;e.add(hand);R.mk(w*1.15,w*1.15,w*1.15,0,0,0,hand);return{s,e,hand}};
def.build(R);
R.lines=[];g.traverse(o=>{if(o.isLineSegments&&!o.userData.nomorph)R.lines.push(o)});R.ns=0;R.lines.forEach(o=>R.ns+=o.geometry.attributes.position.count/2);
R.mats=[];g.traverse(o=>{if(o.isMesh)R.mats.push(o.material)});return R};
// ---------- PUBG soldier ----------
const buildPubg=R=>{const{mk,limb,up}=R;const L0=R.leg(-1),L1=R.leg(1);mk(.12,.42,.3,.24,-.36,.02,L1.h);mk(.34,.28,.14,0,-.02,.2,L0.k);mk(.34,.28,.14,0,-.02,.2,L1.k);
mk(1.05,1.25,.56,0,2.32,0);mk(.86,.7,.12,0,2.4,.33);mk(1.1,.16,.62,0,1.78,0);mk(.3,.3,.3,0,3.02,0);
mk(.5,.56,.5,0,3.3,0);
{const dome=new T.SphereGeometry(1,14,4,0,6.2832,0,1.5708),hy=3.38,hr=[.62,.5,.66];
const d=new T.Group();d.position.set(0,hy,0);d.scale.set(hr[0],hr[1],hr[2]);d.add(new T.Mesh(dome,G.fillMat(0x2e2e2e,true)),new T.LineSegments(new T.WireframeGeometry(dome),G.mat(LIGHT,.8)));up.add(d);
const ring=(r,y)=>{const p=[];for(let i=0;i<24;i++){const a=i/24*6.2832,b=(i+1)/24*6.2832;p.push(Math.cos(a)*hr[0]*r,y,Math.sin(a)*hr[2]*r,Math.cos(b)*hr[0]*r,y,Math.sin(b)*hr[2]*r)}up.add(G.lineset(p,0xffffff,1))};
ring(1.04,hy+.02);ring(1.06,hy-.05);
{const p=[];for(let i=0;i<14;i++){const a=i/14*Math.PI-Math.PI/2,b=(i+1)/14*Math.PI-Math.PI/2;for(const q of[-.03,.03])p.push(q,hy+Math.cos(a)*hr[1]*1.03,Math.sin(a)*hr[2]*1.03,q,hy+Math.cos(b)*hr[1]*1.03,Math.sin(b)*hr[2]*1.03)}up.add(G.lineset(p,0xffffff,1))}
for(let k=0;k<3;k++){const h=hy+.12+k*.11,zz=hr[2]*Math.sqrt(Math.max(0,1-Math.pow((h-hy)/hr[1],2)))+.02;up.add(G.lineset([-.17,h,zz,.17,h,zz,-.17,h+.035,zz,.17,h+.035,zz],0xffffff,1))}
for(const q of[-1,1])up.add(G.lineset([q*.6,hy,.02,q*.27,3.02,.2,q*.27,3.02,.2,q*.1,3.1,.32],LIGHT,1))}
mk(1.05,1.4,.6,0,2.36,-.62);mk(.26,.7,.5,-.66,2.1,-.62);mk(.26,.7,.5,.66,2.1,-.62);mk(.8,.46,.4,0,1.85,-.72);mk(.9,.2,.5,0,3.1,-.62);
for(const q of[-1,1]){mk(.14,1.1,.1,q*.34,2.5,.3);mk(.14,.12,.6,q*.34,3.02,-.15)}
// frying pan on the pack
{const pan=G.edges(new T.CylinderGeometry(.44,.44,.07,18),LIGHT,1,20,0x3a3a3a);pan.rotation.x=Math.PI/2;pan.position.set(0,2.32,-1.0);up.add(pan);mk(.1,.62,.06,0,2.98,-1.0)}
// vest: straps, pouches, radio, level badge
for(const q of[-1,1])mk(.2,.12,.64,q*.36,2.97,0);
for(const x of[-.32,0,.32])mk(.24,.34,.14,x,2.02,.4);
mk(.14,.42,.14,-.52,3.04,.12);up.add(G.lineset([-.52,3.25,.12,-.5,3.8,.12],LIGHT,1));
{const t=G.text('3',.34,0xffffff,1);t.position.set(0,2.5,.4);up.add(t)}
// face: goggles + mask, NVG mount on the helmet
mk(.58,.17,.1,0,3.32,.27);mk(.52,.22,.1,0,3.08,.27);mk(.28,.16,.16,0,3.6,.62);
{const p=[];for(let i=0;i<20;i++){const a=i/20*6.2832,b=(i+1)/20*6.2832;p.push(Math.cos(a)*.28,3.32,Math.sin(a)*.28,Math.cos(b)*.28,3.32,Math.sin(b)*.28)}up.add(G.lineset(p,0xffffff,1))}
// camo patches (line blobs) on torso and legs
{const R=G.rng(5),patch=(par,cx,cy,cz,w,h,n)=>{const q=[];for(let i=0;i<n;i++){const px=cx+(R()-.5)*w,py=cy+(R()-.5)*h,m=6+Math.floor(R()*3),r=.07+R()*.12,ph=R()*6;let f=null,l=null;for(let j=0;j<=m;j++){const a=ph+j/m*6.2832,rr=r*(.6+.8*R()),pt=[px+Math.cos(a)*rr*1.3,py+Math.sin(a)*rr,cz];if(l)q.push(...l,...pt);else f=pt;l=pt}q.push(...l,...f)}par.add(G.lineset(q,LIGHT,.9))};
patch(up,0,2.1,.285,.9,.5,5);patch(up,0,2.5,-.285,.9,1.0,8);patch(L0.h,0,-.45,.185,.28,.7,4);patch(L1.h,0,-.45,.185,.28,.7,4);patch(L0.k,0,-.4,.165,.24,.65,4);patch(L1.k,0,-.4,.165,.24,.65,4)}

// rifle shouldered: stock in the right shoulder pocket, optic at cheek height, left hand on the handguard
const rifle=new T.Group();rifle.position.set(.34,2.86,.42);rifle.scale.setScalar(.8);up.add(rifle);
mk(.34,.4,1.5,0,0,1.15,rifle);mk(.3,.3,1.1,0,-.02,2.35,rifle);mk(.1,.1,1.1,0,.04,3.45,rifle);mk(.18,.18,.28,0,.04,4.1,rifle);
mk(.3,.5,.95,0,-.12,.12,rifle,.12);mk(.2,.5,.22,0,-.42,.85,rifle,-.25);mk(.22,.75,.3,0,-.52,1.6,rifle,.22);mk(.22,.2,.5,0,.3,1.25,rifle);mk(.06,.26,.06,0,.2,3.1,rifle);
limb([.62,2.8,0],[.78,2.36,-.02],.2);limb([.78,2.36,-.02],[.36,2.52,1.08],.18);
limb([-.62,2.8,0],[-.3,2.42,1.0],.2);limb([-.3,2.42,1.0],[.34,2.84,2.3],.18);mk(.26,.26,.3,.34,2.55,1.12);mk(.26,.26,.3,.34,2.84,2.34);
const mf=G.lineset([0,0,-.2,0,0,.9,-.3,0,.3,.3,0,.3,0,-.3,.3,0,.3,.3,-.2,.2,.2,.2,-.2,.4],0xffffff,1);mf.userData.nomorph=true;mf.position.set(0,.06,4.45);mf.visible=false;rifle.add(mf);
const trP=new Float32Array(12*6),trG=new T.BufferGeometry();trG.setAttribute('position',new T.BufferAttribute(trP,3));const trL=new T.LineSegments(trG,G.mat(0x111111,.9));trL.frustumCulled=false;G.scene.add(trL);
const tr=[];let fcd=0,recoil=0,flash=0;
R.idle=()=>{trL.visible=false;tr.length=0};
R.pose=c=>{const{kk,t,dt,phase,mode,armed}=c;trL.visible=true;rifle.rotation.x=-.02+Math.sin(phase*2)*.012*kk;rifle.position.y=2.86+Math.sin(t*1.7)*.008;
fcd-=dt;recoil=Math.max(0,recoil-dt*12);flash=Math.max(0,flash-dt);mf.visible=flash>0&&armed;
if(armed&&actKey&&fcd<=0){fcd=.1;recoil=1;flash=.05;R.g.updateMatrixWorld(true);const m0=rifle.localToWorld(new V(0,.06,4.4)),d0=new V(0,0,1).transformDirection(rifle.matrixWorld);tr.push({t:0,o:m0,d:d0});if(tr.length>12)tr.shift();A.sfx('tick')}
if(recoil>0){R.piv.rotation.x-=recoil*.035;rifle.rotation.x-=recoil*.05}
trP.fill(0);tr.forEach((q,i)=>{q.t+=dt;const h=q.t*170,tl=Math.max(0,h-10);trP.set([q.o.x+q.d.x*h,q.o.y+q.d.y*h,q.o.z+q.d.z*h,q.o.x+q.d.x*tl,q.o.y+q.d.y*tl,q.o.z+q.d.z*tl],i*6)});while(tr.length&&tr[0].t>.5)tr.shift();trG.attributes.position.needsUpdate=true}};
const tagPubg=()=>{const tag=new T.Group();
{const nm=G.text('OMS',.5,INK,1);nm.position.set(0,1.0,0);tag.add(nm);
const hb=G.rect(2.6,.2,INK,1,false);hb.position.set(0,.55,0);tag.add(hb);const fl=G.panel(2.5,.12,0x1a1a1a);fl.position.set(-.0,.55,.01);fl.scale.x=1;tag.add(fl);
const ic=[];const arc=(r,cx,cy,a0,a1,n=10)=>{const p=[];for(let i=0;i<n;i++){const a=a0+(a1-a0)*i/n,b=a0+(a1-a0)*(i+1)/n;p.push(cx+Math.cos(a)*r,cy+Math.sin(a)*r,0,cx+Math.cos(b)*r,cy+Math.sin(b)*r,0)}return p};
const L=(...p)=>{const o=[];for(let i=0;i+3<p.length;i+=2)o.push(p[i],p[i+1],0,p[i+2],p[i+3],0);return o};
const icons=[[...arc(.22,0,-.02,0,3.1416),...L(-.26,-.02,.26,-.02)],L(-.2,.2,-.1,.2,0,.08,.1,.2,.2,.2,.2,-.2,-.2,-.2,-.2,.2),[...L(-.17,-.2,.17,-.2,.17,.12,-.17,.12,-.17,-.2),...arc(.1,0,.12,0,3.1416,8)]];
icons.forEach((p,i)=>{const x=(i-1)*1.0;const g=G.lineset(p,INK,1);g.position.set(x,-.05,0);tag.add(g);const d=G.text('3',.3,INK,1);d.position.set(x,-.5,0);tag.add(d)});tag.userData.fill=fl}
return tag};

// ---------- PUBG ruined street map ----------
const sandbag=(n,rows,g)=>{for(let r=0;r<rows;r++)for(let i=0;i<n-(r%2);i++){const b=G.box(1.5,.55,.8,INK,1,0xe2e2e2);b.position.set((i-(n-1)/2+(r%2)*.5)*1.55,.28+r*.56,(i%2)*.04);b.rotation.y=(i*37%7-3)*.015;g.add(b)}};
const wall=(w,h,rng,tall)=>{const g=new T.Group(),st=Math.max(3,Math.round(w/2.2)),hs=[];for(let k=0;k<st;k++)hs.push(h*(.3+.7*rng()));if(tall)hs[Math.floor(rng()*st)]=h;
const s=new T.Shape();s.moveTo(0,0);s.lineTo(w,0);for(let k=st-1;k>=0;k--){const x1=(k+1)/st*w,x0=k/st*w;s.lineTo(x1,hs[k]);s.lineTo(x0,hs[k]*(.7+.3*rng()))}s.lineTo(0,0);
const fh=4.2,mh=x=>{const k=Math.max(0,Math.min(st-1,Math.floor(x/w*st)));return Math.min(hs[k],hs[Math.max(0,k-1)],hs[Math.min(st-1,k+1)])*.7};
const cw=3.6,nc=Math.max(1,Math.floor(w/cw));for(let r=0;r*fh+4.9<h;r++)for(let c=0;c<nc;c++){const cx=(c+.5)*(w/nc),cy=r*fh+2.7;if(cy+1.2>mh(cx)||rng()<.22)continue;const p=new T.Path();p.moveTo(cx-.85,cy-1.1);p.lineTo(cx+.85,cy-1.1);p.lineTo(cx+.85,cy+1.1);p.lineTo(cx-.85,cy+1.1);p.lineTo(cx-.85,cy-1.1);s.holes.push(p)}
const geo=new T.ExtrudeGeometry(s,{depth:.7,bevelEnabled:false});g.add(G.edges(geo,INK,1,25,rng()<.35?0xd6d6d6:FILL));
const q=[];for(let i=0;i<3;i++){const bx=1+rng()*(w-2),by=1+rng()*Math.min(5,mh(bx)),n=4+Math.floor(rng()*3);for(let j=0;j<n;j++){const a=rng()*6.2832,r=.25+rng()*.5,x=bx+Math.cos(a)*r,y=by+Math.sin(a)*r,e=.07+rng()*.06;for(let m=0;m<5;m++){const a1=m/5*6.2832,a2=(m+1)/5*6.2832;q.push(x+Math.cos(a1)*e,y+Math.sin(a1)*e,.72,x+Math.cos(a2)*e,y+Math.sin(a2)*e,.72)}}}
g.add(G.lineset(q,INK,.8));return g};
const rubble=(rng,n=7,sp=3)=>{const g=new T.Group();for(let i=0;i<n;i++){const R=.35+rng()*.9,k=rng()<.5?G.edges(new T.DodecahedronGeometry(R,0),INK,1,20,0xe0e0e0):G.box(R*1.8,R*.9,R*1.3,INK,1,0xe0e0e0);k.position.set((rng()-.5)*sp*2,R*.5,(rng()-.5)*sp*2);k.rotation.set(rng()*3,rng()*3,rng()*3);g.add(k)}return g};
const building=(w,d,h,rng)=>{const g=new T.Group();
[[0,0,0,w],[0,-d,0,w],[0,0,Math.PI/2,d],[w,0,Math.PI/2,d]].forEach(([x,z,ry,len],i)=>{if(i!==1&&rng()<.22)return;const ln=len*(i===1?1:.55+.45*rng()),m=wall(ln,h*(i===1?1:.55+.45*rng()),rng,i===1);m.position.set(x,0,z);m.rotation.y=ry;g.add(m)});
const fl=1+Math.floor(rng()*2);for(let f=1;f<=fl;f++){const sl=G.box(w*(.5+.4*rng()),.3,d*(.4+.4*rng()),INK,1,0xdcdcdc);sl.position.set(w*(.3+.3*rng()),f*4.2,-d*.5);sl.rotation.set((rng()-.5)*.35,0,(rng()-.5)*.35);g.add(sl)}
const rb=rubble(rng,9,Math.max(w,d)*.4);rb.position.set(w/2,0,d*.35);g.add(rb);return g};
const hedgehog=()=>{const g=new T.Group();for(const[rx,ry,rz]of[[0,0,.8],[.8,0,0],[0,.8,.8]]){const b=G.box(.28,.28,3.2,INK,1,0xdedede);b.rotation.set(rx,ry,rz);b.position.y=1.1;g.add(b)}return g};
const crate=rng=>{const g=new T.Group(),s=1.6+rng()*.8,b=G.box(s,s,s,INK,1,0xe6e6e6);b.position.y=s/2;g.add(b);g.add(G.lineset([-s/2,0,s/2+.01,s/2,s,s/2+.01,s/2,0,s/2+.01,-s/2,s,s/2+.01],INK,1));return g};
const wreck=rng=>{const g=new T.Group();const b=G.box(4.6,1,2.1,INK,1,0xdcdcdc);b.position.y=.85;const c=G.box(2.4,.85,1.9,INK,1,0xe6e6e6);c.position.set(-.2,1.75,0);g.add(b,c);for(const[x,z]of[[-1.5,1.06],[1.5,1.06],[-1.5,-1.06],[1.5,-1.06]]){const w=G.poly(.48,10,INK,1);w.position.set(x,.48,z);g.add(w)}if(rng()<.4){g.rotation.z=Math.PI;g.position.y=1.7}g.rotation.y=rng()*6.28;return g};
const barrel=()=>{const b=G.edges(new T.CylinderGeometry(.55,.55,1.5,10),INK,1,20,0xdadada);b.position.y=.75;return b};
const lamp=rng=>{const g=new T.Group(),h=8+rng()*3,d=(rng()-.5)*3;g.add(G.lineset([0,0,0,0,h*.7,0,0,h*.7,0,d,h,0,d,h,0,d+2.2,h-.5,0],INK,1));return g};
const smokes=[];
const smoke=(g,x,z)=>{const m=G.lineset(new Array(24*6).fill(0),0x555555,.5);m.frustumCulled=false;g.add(m);smokes.push({m,x,z,ph:Math.random()*9,g})};
const pubgMap=(a)=>{const rng=G.rng(a*71+900),root=new T.Group(),put=(o,x,z,ry=0)=>{o.position.x=x;o.position.z=z;o.rotation.y+=ry;root.add(o)};
if(a>=0){
for(const s of[-1,1]){const B=(w,d,h,x,z,ry=0)=>put(building(w,d,h,rng),s>0?x:x-w,z,ry);
for(let i=0;i<2;i++)B(12+rng()*5,12,24+rng()*14,43+i*19+rng()*4,-30-rng()*10,(rng()-.5)*.2);
for(let i=0;i<3;i++)B(13+rng()*8,12+rng()*6,14+rng()*10,42+rng()*8+(i%2)*14,-10+i*20+rng()*6,(rng()-.5)*.2);
for(let i=0;i<4;i++)B(16+rng()*10,14+rng()*8,20+rng()*16,84+rng()*30,-8+i*30+rng()*10,(rng()-.5)*.3);
for(let z=-18;z<=20;z+=9){const w=wall(7+rng()*4,5+rng()*4,rng,false);put(w,s*34.6,z+rng()*2,Math.PI/2*(s<0?1:-1))}
for(let i=0;i<3;i++){const sb=new T.Group();sandbag(5,2,sb);put(sb,s*(38+rng()*3),-16+i*14+rng()*4,Math.PI/2)}
put(crate(rng),s*(40+rng()*4),-5+rng()*8);put(hedgehog(),s*(42+rng()*6),8+rng()*12,rng()*3);put(wreck(rng),s*(50+rng()*8),14+rng()*12);put(barrel(),s*38.5,2+rng()*4);put(lamp(rng),s*44,-18+rng()*30)}
for(let i=0;i<3;i++)smoke(root,(rng()<.5?-1:1)*(50+rng()*70),-4+rng()*50);
}else{
const ok=(x,z)=>!(Math.abs(z+12)<16&&Math.abs(x)<80)&&Math.hypot(x,z-8)>13;
for(let i=0;i<9;i++)put(building(18+rng()*10,13+rng()*7,18+rng()*16,rng),-120+i*30+rng()*10,-52-rng()*30,(rng()-.5)*.25);
for(const s of[-1,1])for(let i=0;i<5;i++){let x=s*(92+rng()*70),z=-40+i*36+rng()*14;put(building(16+rng()*10,13+rng()*8,16+rng()*18,rng),x,z,(rng()-.5)*.4)}
for(let i=0;i<46;i++){const x=-95+rng()*190,z=14+rng()*62;if(!ok(x,z))continue;const k=Math.floor(rng()*6);let o;if(k===0){o=new T.Group();sandbag(4+Math.floor(rng()*3),2,o)}else if(k===1)o=crate(rng);else if(k===2)o=hedgehog();else if(k===3)o=wreck(rng);else if(k===4)o=barrel();else o=wall(6+rng()*5,3+rng()*3,rng,false);put(o,x,z,rng()*6.28)}
for(let i=0;i<4;i++)smoke(root,-80+rng()*160,-30+rng()*80)}
return root};

const pubgAmbient=(dt,t)=>{for(const s of smokes){if(!s.g.visible||!s.g.parent||!s.g.parent.visible)continue;const p=s.m.geometry.attributes.position.array;let k=0;for(let i=0;i<24;i++){const u=i/24,v=(i+1)/24,f=a=>[s.x+Math.sin(a*6+t*.9+s.ph)*a*5,2+a*28,s.z+Math.cos(a*5+t*.7+s.ph)*a*4];const A0=f(u),B0=f(v);p[k++]=A0[0];p[k++]=A0[1];p[k++]=A0[2];p[k++]=B0[0];p[k++]=B0[1];p[k++]=B0[2]}s.m.geometry.attributes.position.needsUpdate=true}};
G.regTheme('pubg',{label:'PUBG',hint:'HOLD SPACE TO FIRE',hipY:1.7,build:buildPubg,map:pubgMap,tag:tagPubg,ambient:pubgAmbient,fog:.0068,flat:true,l0:.07,l1:.24,H:1.05,bob:.13,sc:.95,tagY:4.45,kneeK:1.4});
// layout shared by the other themes (objects are centred on their own origin)
G.layoutMap=(a,rng,F,root)=>{const put=(o,x,z,ry=0)=>{o.position.x=x;o.position.z=z;o.rotation.y+=ry;root.add(o)};
if(a>=0){for(const s of[-1,1]){for(let i=0;i<2;i++)put(F.tall(rng),s*(50+i*20+rng()*5),-32-rng()*8,(rng()-.5)*.3);
for(let i=0;i<3;i++)put(F.tall(rng),s*(50+rng()*10+(i%2)*14),-8+i*20+rng()*6,(rng()-.5)*.3);
for(let i=0;i<4;i++)put(F.tall(rng),s*(92+rng()*28),-8+i*30+rng()*10,(rng()-.5)*.4);
for(let z=-18;z<=20;z+=9)put(F.mid(rng),s*34.8,z+rng()*2,Math.PI/2);
for(let i=0;i<5;i++)put(F.low(rng),s*(38+rng()*14),-16+i*9+rng()*4,rng()*6.28)}}
else{const ok=(x,z)=>!(Math.abs(z+12)<16&&Math.abs(x)<80)&&Math.hypot(x,z-8)>13;
for(let i=0;i<9;i++)put(F.tall(rng),-120+i*30+rng()*10,-55-rng()*30,(rng()-.5)*.3);
for(const s of[-1,1])for(let i=0;i<5;i++)put(F.tall(rng),s*(92+rng()*70),-40+i*36+rng()*14,(rng()-.5)*.4);
for(let i=0;i<46;i++){const x=-95+rng()*190,z=14+rng()*62;if(!ok(x,z))continue;put(rng()<.3?F.mid(rng):F.low(rng),x,z,rng()*6.28)}}};
// ---------- morph engine ----------
const SYM={n:0,idx:null,fill(out){const bp=G.char.bp,tp=G.char.tp;out.set(bp,0);let n=bp.length;for(const i of this.idx){out.set(tp.subarray(i,i+6),n);n+=6}}};
const symInit=()=>{if(SYM.idx)return;const bp=G.char.bp,tp=G.char.tp;SYM.idx=[];for(let i=0;i<tp.length;i+=6)if(Math.abs(tp[i])+Math.abs(tp[i+1])+Math.abs(tp[i+2])>.01)SYM.idx.push(i);SYM.n=bp.length/6+SYM.idx.length};
const collect=(R,out)=>{R.g.updateMatrixWorld(true);let n=0;const v=new V();for(const o of R.lines){const p=o.geometry.attributes.position.array;for(let i=0;i<p.length;i+=3){v.set(p[i],p[i+1],p[i+2]).applyMatrix4(o.matrixWorld);out[n++]=v.x;out[n++]=v.y;out[n++]=v.z}}};
const rigOf=id=>{const d=THEMES[id];if(!d.R){const R=mkRig(d);d.R=R}return d.R};
const formOf=id=>{if(id==null){symInit();return{n:SYM.n,fill:o=>SYM.fill(o)}}const R=rigOf(id);return{n:R.ns,fill:o=>collect(R,o)}};
const CAP=4200,MPOS=new Float32Array(CAP*6),mg=new T.BufferGeometry();mg.setAttribute('position',new T.BufferAttribute(MPOS,3));
const mlm=G.mat(LIGHT,1),ml=new T.LineSegments(mg,mlm);ml.frustumCulled=false;ml.visible=false;ml.userData.nomorph=true;G.scene.add(ml);
let from=null,to=null,bm=1,fS=null,fT=null,srcBuf=null,tgtBuf=null,si=null,ti=null,rr=null,off=null,K=0;
const prep=()=>{fS=formOf(from);fT=formOf(to);const S=fS.n,Nt=fT.n;K=Math.min(CAP,Math.max(S,Nt));srcBuf=new Float32Array(S*6+6);tgtBuf=new Float32Array(Nt*6+6);const R0=G.rng((Math.random()*1e9)|0),sh=n=>{const p=[...Array(n).keys()];for(let i=n-1;i>0;i--){const j=Math.floor(R0()*(i+1));[p[i],p[j]]=[p[j],p[i]]}return p},ps=sh(S),pt=sh(Nt);si=new Int32Array(K);ti=new Int32Array(K);rr=new Float32Array(K);off=new Float32Array(K*3);
for(let k=0;k<K;k++){si[k]=ps[k%S];ti[k]=pt[k%Nt];rr[k]=R0();off[k*3]=(R0()-.5)*5;off[k*3+1]=R0()*3.4+.4;off[k*3+2]=(R0()-.5)*5}mg.setDrawRange(0,K*2)};
const setFills=(ms,op)=>ms.forEach(m=>{m.transparent=op<1;m.opacity=op});
const tags={};const tagOf=id=>{if(!tags[id]){const g=THEMES[id].tag();g.visible=false;G.scene.add(g);tags[id]=g}return tags[id]};
const u0=G.char.update;
const poseRig=(R,P,c)=>{const d=R.def,{x,y,z,yaw,phase=0,sx=1,sy=1,sz=1}=P,{kk,mode,held}=c;
R.g.position.set(x,y+Math.abs(Math.sin(phase))*d.bob*kk+(held?.4:0),z);R.g.rotation.y=yaw;R.g.scale.set(sx*d.sc,sy*d.sc,sz*d.sc);
R.piv.rotation.x=(held?0:d.l0+d.l1*kk)+Math.sin(phase*2)*.025*kk;
const a0=phase,a1=phase+Math.PI,H=held?.3:d.H*kk,K1=d.kneeK||1.4;
if(R.legs[0]){R.legs[0].h.rotation.x=Math.sin(a0)*H;R.legs[1].h.rotation.x=Math.sin(a1)*H;R.legs[0].k.rotation.x=Math.max(0,-Math.cos(a0+.3))*K1*kk+(held?.6:0);R.legs[1].k.rotation.x=Math.max(0,-Math.cos(a1+.3))*K1*kk+(held?.6:0)}
R.pose&&R.pose(c);
// grabbed with the mouse: every character squirms, kicks and flails in its own way
if(held){R._h=1;const t=c.t,w=Math.sin(t*9),w2=Math.sin(t*6.3+1.2);R.piv.rotation.z=w*.2;R.piv.rotation.x+=w2*.14;
if(R.legs[0]){R.legs[0].h.rotation.x=Math.sin(t*11)*.8;R.legs[1].h.rotation.x=-Math.sin(t*11)*.8;R.legs[0].k.rotation.x=.5+Math.sin(t*11+1)*.4;R.legs[1].k.rotation.x=.5-Math.sin(t*11+1)*.4}
if(R.aR&&R.aL){R.aR.s.rotation.x=-2.3+Math.sin(t*12)*.5;R.aL.s.rotation.x=-2.3-Math.sin(t*12)*.5;R.aR.s.rotation.z=.5+Math.sin(t*10)*.35;R.aL.s.rotation.z=-.5-Math.sin(t*10)*.35}
if(R.def&&R.up){const j=Math.sin(t*14)*.09;R.up.scale.set(1+j,1-j,1+j)}}
else if(R._h){R._h=0;R.piv.rotation.z=0;if(R.aR&&R.aL){R.aR.s.rotation.z=0;R.aL.s.rotation.z=0}if(R.up)R.up.scale.set(1,1,1)}};
G.char.update=P=>{u0(P);const{x,y,z,yaw,phase=0,k=0,sx=1,sy=1,sz=1,mode,t,dt=.016}=P,P0=G.char.parts;
if(bm<1)bm=Math.min(1,bm+dt/1.3);
actCool=Math.max(0,actCool-dt);if(actT>=0){actT+=dt/.42;if(actT>1.15)actT=-1}
const kk=mode==='walk'?k:0,tiny=sx*sy*sz<.05,held=mode==='held';
const involved=new Set([from,to]);
const c={P,kk,t,dt,phase,mode,held,armed:false,actP:actT>=0?Math.min(1,actT):-1};
const draw=(id,on,op,solid)=>{if(id==null){P0[0].visible=P0[1].visible=on;if(on)setFills([P0[0].material,P0[1].material],op);P0[2].visible=P0[3].visible=P0[4].visible=on&&solid}else{const R=THEMES[id].R;R.g.visible=on&&!tiny;if(R.g.visible)setFills(R.mats,op)}};
if(bm>=1){if(from!==to)draw(from,false,1,false);draw(to,true,1,true)}else{draw(from,bm<.4,1-ss(bm/.4),bm===0);draw(to,bm>.68,ss((bm-.68)/.3),false)}
if(!involved.has(null)){P0[0].visible=P0[1].visible=P0[2].visible=P0[3].visible=P0[4].visible=false}
for(const id in THEMES){const R=THEMES[id].R;if(!R)continue;if(!involved.has(id)){R.g.visible=false;R.idle&&R.idle()}}
for(const id of involved){if(id==null)continue;const R=THEMES[id].R;c.armed=bm>=1&&id===to&&!tiny&&G.view==='3d'&&!held;poseRig(R,P,{...c})}
ml.visible=bm<1&&to!==from;
if(ml.visible){fS.fill(srcBuf);fT.fill(tgtBuf);const e0=bm*1.5;
for(let q=0;q<K;q++){const e=ss(e0-rr[q]*.5),arc=Math.sin(e*Math.PI)*.9,a=si[q]*6,b=ti[q]*6;for(let m=0;m<6;m++){const cc=m%3;MPOS[q*6+m]=srcBuf[a+m]+(tgtBuf[b+m]-srcBuf[a+m])*e+off[q*3+cc]*arc*(cc===1?1:.7)}}
mg.attributes.position.needsUpdate=true;const d=ss(bm/.25)*(1-ss((bm-.75)/.25));mlm.color.setHex(((0xdc+(0x22-0xdc)*d)|0)*0x10101)}
// status tag above the head
for(const id in tags)tags[id].visible=false;
if(to!=null&&bm>=1&&!tiny){const g=tagOf(to),d=THEMES[to];g.visible=true;g.position.set(x,y+(d.tagY+Math.abs(Math.sin(phase))*d.bob*kk)*d.sc*sy,z);g.rotation.y=Math.atan2(G.cam.position.x-x,G.cam.position.z-z);g.scale.setScalar(.9)}};
// ---------- map switching ----------
const built={};let mapTheme=null;
const buildMap=(id,a)=>{built[id]=built[id]||{};if(built[id][a])return;const d=THEMES[id],root=new T.Group(),rng=G.rng(a*71+900+id.length*13);root.userData.tick=[];G.TH.cur=root;const r=d.map(a,rng,root)||root;G.TH.cur=null;if(r!==root)root.add(r);(a>=0?W.zones[a]:W.hub).add(root);root.visible=false;built[id][a]=root};
const applyMap=()=>{const on=mapTheme!=null;if(W.hubScenery)W.hubScenery.visible=!on;(W.zsc||[]).forEach(s=>s&&(s.visible=!on));if(on)buildMap(mapTheme,G.area);for(const id in built)for(const a in built[id])built[id][a].visible=id===mapTheme;G.scene.fog.density=on?(THEMES[mapTheme].fog||.0052):.0052};
const sa=W.setArea;W.setArea=a=>{sa(a);if(mapTheme!=null){buildMap(mapTheme,a);built[mapTheme][a].visible=true}};
const wy=W.waterY;W.waterY=(x,z,t)=>(mapTheme&&THEMES[mapTheme].flat)?0:wy(x,z,t);
G.setTheme=id=>{id=id||null;if(id===to)return;if(!G.char.bp)return;
if(bm<1&&id===from){const f=from;from=to;to=f;bm=1-bm}else{if(bm<1)from=to;else from=to;to=id;bm=0}
prep();G.theme=to;G.battle=to==='pubg';W.ripple(G.ch.pos.x,G.ch.pos.z,0x000000,4,G.baseY());
setTimeout(()=>{mapTheme=G.theme;applyMap()},550);
G.toast(to?THEMES[to].label+' ON  ·  '+THEMES[to].hint:'ORIGINAL FORM');G.emit('theme',to)};
G.setBattle=on=>G.setTheme(on?'pubg':null);
G.ticks.push((dt,t)=>{if(!mapTheme)return;const d=THEMES[mapTheme];d.ambient&&d.ambient(dt,t);const bt=built[mapTheme];if(bt)for(const a in bt){const r=bt[a];if(!r.visible||!r.parent||!r.parent.visible)continue;const tk=r.userData.tick;if(tk)for(const f of tk)f(dt,t)}});
})();
