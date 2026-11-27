// Open-world hub: grid pond, five entrance wells, decor, travel effects (crater, falling streaks), shared registries.
(()=>{const T=THREE,C=G.C;
const R=new T.WebGLRenderer({canvas:document.getElementById('gl'),antialias:true});R.setClearColor(C.bg,1);
const scene=new T.Scene();scene.fog=new T.FogExp2(C.bg,.0052);const cam=new T.PerspectiveCamera(48,1,.1,500);
G.R=R;G.scene=scene;G.cam=cam;
G.resize=()=>{const w=innerWidth,h=innerHeight;R.setPixelRatio(Math.min(devicePixelRatio||1,1.5));R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();G.W=w;G.H=h};
addEventListener('resize',G.resize);G.resize();
const W=G.world={},V=T.Vector3;G.ZY=-80;G.area=-1;G.E=[[-60,-12],[-30,-12],[0,-12],[30,-12],[60,-12]];G.O=i=>({x:i*100,z:0});
G.anchors={faders:[],pads:[]};G.inter=[];G.slabs=[];G.zoneTick=[];G.faders=[];G.baseY=()=>G.area<0?0:G.ZY;
W.ground=(x,z,a)=>{let y=a<0?0:G.ZY;for(const s of G.slabs)if(s.area===a&&x>s.x0&&x<s.x1&&z>s.z0&&z<s.z1)y=Math.max(y,s.y);return y};
scene.add(new T.AmbientLight(0xffffff,.6));const dl=new T.DirectionalLight(0xffffff,.45);dl.position.set(-30,60,40);scene.add(dl);
const hub=new T.Group(),zones=[],spin=[];scene.add(hub);W.hub=hub;W.zones=zones;W.spin=spin;
W.setArea=a=>{G.area=a;hub.visible=a<0;zones.forEach((z,i)=>z.visible=a===i)};
// water
const bp=[],GS=2.5,GR=100;for(let x=-GR;x<=GR;x+=GS)for(let z=-GR;z<GR;z+=GS)bp.push(x,z,x,z+GS);for(let z=-GR;z<=GR;z+=GS)for(let x=-GR;x<GR;x+=GS)bp.push(x,z,x+GS,z);
const wp=new Float32Array(bp.length/2*3),wg=new T.BufferGeometry();wg.setAttribute('position',new T.BufferAttribute(wp,3));const wl=new T.LineSegments(wg,G.mat(C.dim,.9));hub.add(wl);{const q=[],O=320;for(let x=-O;x<=O;x+=GS){if(Math.abs(x)>GR)q.push(x,-.02,-O,x,-.02,O);else q.push(x,-.02,-O,x,-.02,-GR,x,-.02,GR,x,-.02,O)}for(let z=-O;z<=O;z+=GS){if(Math.abs(z)>GR)q.push(-O,-.02,z,O,-.02,z);else q.push(-O,-.02,z,-GR,-.02,z,GR,-.02,z,O,-.02,z)}hub.add(G.lineset(q,C.dim,.9))}const sea=new T.Mesh(new T.PlaneGeometry(800,800),G.fillMat(0xececec,true));sea.rotation.x=-Math.PI/2;sea.position.y=-.35;hub.add(sea);
W.waterY=(x,z,t)=>.12*Math.sin(x*.35+t*1.2)*Math.cos(z*.3+t*.9)+.06*Math.sin(x*.9-t*2);
// ripples
const rp=[];for(let i=0;i<20;i++){const m=G.poly(1,36,C.lime,0);m.rotation.x=-Math.PI/2;m.visible=false;m.userData={t:9,r:2};scene.add(m);rp.push(m)}let ri=0;
W.ripple=(x,z,col=C.lime,r=2.2,y)=>{const m=rp[ri++%rp.length];m.position.set(x,(y??G.baseY())+.05,z);m.userData={t:0,r};m.material.color.setHex(col);m.visible=true};
// crater + falling streaks
const cr=new T.Group();cr.visible=false;scene.add(cr);cr.userData={t:0,dir:1};
for(let i=0;i<7;i++){const k=i/6,p=G.poly(3*(1-k*.88),28,C.lime,.9);p.rotation.x=-Math.PI/2;p.position.y=-2.6*Math.pow(k,1.2);cr.add(p)}
{const q=[];for(let a=0;a<10;a++){const an=a/10*6.283;q.push(Math.cos(an)*3,0,Math.sin(an)*3,Math.cos(an)*.36,-2.6,Math.sin(an)*.36)}cr.add(G.lineset(q,C.lime,.8))}
W.crater=(x,z,y)=>{cr.position.set(x,y,z);cr.userData={t:0,dir:1};cr.visible=true;cr.scale.setScalar(.1)};W.craterClose=()=>{cr.userData.dir=-1};
const sk=[],sp=[];for(let i=0;i<46;i++){const a=Math.random()*6.283,r=3+Math.random()*16,L=4+Math.random()*9;sk.push({x:Math.cos(a)*r,z:Math.sin(a)*r,b:Math.random()*48-24,L});sp.push(0,0,0,0,0,0)}
const sg=new T.BufferGeometry();sg.setAttribute('position',new T.BufferAttribute(new Float32Array(sp),3));const stk=new T.LineSegments(sg,G.mat(C.lime,.55));stk.visible=false;stk.frustumCulled=false;scene.add(stk);let sOff=0;
W.streak=(on,x,y,z)=>{stk.visible=on;if(on)stk.position.set(x,y,z)};
// entrance sculptures
const objGeo=[()=>{const g=new T.Group();g.add(G.box(1.8,1.8,1.8,C.cyan,.9),G.box(.9,.9,.9,C.lime,.9));return g},
()=>{const g=new T.Group();g.add(G.edges(new T.OctahedronGeometry(1.1),C.lime,.9),G.edges(new T.TorusGeometry(1.5,.08,5,24),C.cyan,.8));return g},
()=>{const g=new T.Group();const a=G.edges(new T.CylinderGeometry(1.3,1.3,.3,12),C.cyan,.9);a.rotation.x=Math.PI/2;const b=G.edges(new T.CylinderGeometry(.35,.35,.4,6),C.lime,.9);b.rotation.x=Math.PI/2;g.add(a,b);return g},
()=>{const g=new T.Group();[[1.4,16,5],[1.1,12,4],[.8,9,3],[.5,7,3]].forEach(([r,n,k],i)=>{g.add(G.poly(r,n,i%2?C.lime:C.cyan,.5));const p=[];let f=null;for(let s=0;s<n;s++)if((s*k)%n<k){const a=s/n*6.2832,q=[Math.cos(a)*r,Math.sin(a)*r,0];if(f)p.push(...f,...q);f=q}g.add(G.lineset(p,C.lime,.9))});return g},
()=>{const g=new T.Group();g.add(G.wire(new T.IcosahedronGeometry(1.3,1),C.cyan,.7),G.wire(new T.IcosahedronGeometry(.5,0),C.lime,.9));return g}];
W.obj=i=>objGeo[i]();
W.portalRing=(parent,x,z,y,r)=>{const g=new T.Group();g.position.set(x,y,z);for(const k of[1,.76,.52]){const p=G.poly(r*k,32,C.lime,k==1?1:.7);p.rotation.x=-Math.PI/2;g.add(p)}
const d=[];for(let i=0;i<12;i++){const a=i/12*6.283,b=a+.2;d.push(Math.cos(a)*r*1.25,0,Math.sin(a)*r*1.25,Math.cos(b)*r*1.25,0,Math.sin(b)*r*1.25)}const dm=G.lineset(d,C.cyan,.9);g.add(dm);spin.push({o:dm,s:.6});
for(let i=0;i<4;i++){const a=i*1.5708;g.add(G.lineset([Math.cos(a)*r*1.6,0,Math.sin(a)*r*1.6,Math.cos(a)*r*1.1,0,Math.sin(a)*r*1.1],C.lime,.9))}parent.add(g);return g};
G.E.forEach(([ex,ez],i)=>{const g=new T.Group();g.position.set(ex,0,ez);g.scale.setScalar(1.5);hub.add(g);W.portalRing(g,0,0,.05,2.4);const vd=G.panel(5.8,5.4,0x0a0a0a);vd.position.set(0,2.7,-3.05);g.add(vd);for(const sx of[-1,1]){const pl=G.box(.8,5.8,1.2,C.lime,1);pl.position.set(sx*3.1,2.9,-3);g.add(pl)}const bm=G.box(7.2,.9,1.2,C.lime,1);bm.position.set(0,6.1,-3);g.add(bm);
const arch=[];for(let k=0;k<16;k++){const a=k/16*3.1416,b=(k+1)/16*3.1416;arch.push(Math.cos(a)*2.9,5.2+Math.sin(a)*2.9,-3,Math.cos(b)*2.9,5.2+Math.sin(b)*2.9,-3)}arch.push(-2.9,0,-3,-2.9,5.2,-3,2.9,0,-3,2.9,5.2,-3,-3.3,0,-3,-3.3,5.2,-3,3.3,0,-3,3.3,5.2,-3);g.add(G.lineset(arch,C.lime,1));

const t=G.text(G.modes[i].id,1.3,C.lime,1);t.position.set(0,9.7,-3);g.add(t);

G.inter.push({area:-1,x:ex,z:ez,r:4.1,kind:'portal',id:G.modes[i].id,label:G.modes[i].id+'(으)로 이동',dest:i})});

// hub scenery: filled lily pads, rocks and reeds (kept clear of the door row)
{const hs=new T.Group();hub.add(hs);W.hubScenery=hs;const r=G.rng(11),ok=(x,z)=>!(Math.abs(z+12)<14&&Math.abs(x)<76)&&Math.hypot(x,z-8)>9;
for(let q=0;q<170;q++){const x=-260+r()*520,z=-230+r()*500;if(Math.abs(x)<70&&Math.abs(z)<70)continue;const R=1+r()*3,t=Math.floor(r()*3),g=new T.Group();g.position.set(x,0,z);if(t===0){const f=new T.Mesh(new T.CircleGeometry(R,24),G.fillMat(0xdadada,true));f.rotation.x=-Math.PI/2;f.position.y=.26;g.add(f);const o=G.poly(R,24,C.lime,1);o.rotation.x=-Math.PI/2;o.position.y=.27;g.add(o)}else if(t===1){const k=G.edges(new T.DodecahedronGeometry(R,0),C.lime,1,20,0xe4e4e4);k.position.y=R*.6;k.scale.y=.7;g.add(k)}else{const h=4+r()*8,k=G.box(1+r()*1.5,h,1+r()*1.5,C.lime,1);k.position.y=h/2;g.add(k)}hs.add(g)}let n=0,tries=0;
while(n<16&&tries++<400){const x=-72+r()*144,z=-40+r()*100;if(!ok(x,z))continue;n++;const R=1.2+r()*2,g=new T.Group();g.position.set(x,.26,z);const f=new T.Mesh(new T.CircleGeometry(R,24),G.fillMat(0xdadada,true));f.rotation.x=-Math.PI/2;g.add(f);const o=G.poly(R,24,C.lime,1);o.rotation.x=-Math.PI/2;o.position.y=.02;g.add(o);hs.add(g)}
n=0;tries=0;while(n<9&&tries++<400){const x=-72+r()*144,z=-40+r()*100;if(!ok(x,z)||Math.abs(z-8)<10&&Math.abs(x)<30)continue;n++;const R=.8+r()*1.4,k=G.edges(new T.DodecahedronGeometry(R,0),C.lime,1,20,0xe4e4e4);k.position.set(x,R*.6,z);k.rotation.set(r()*3,r()*3,r()*3);k.scale.y=.7;hs.add(k)}
n=0;tries=0;while(n<12&&tries++<400){const x=-72+r()*144,z=-40+r()*100;if(!ok(x,z))continue;n++;const g=new T.Group();g.position.set(x,0,z);for(let q=0;q<3;q++){const h=3+r()*3,dx=(r()-.5)*1.4,dz=(r()-.5)*1.4;g.add(G.lineset([dx,0,dz,dx+(r()-.5)*.8,h,dz],C.lime,1));const c=G.box(.28,.9,.28,C.lime,1,0x1a1a1a);c.position.set(dx+(r()-.5)*.2,h+.2,dz);g.add(c)}hs.add(g)}}// sky analyzer: four euclidean rings
const sky=new T.Group();scene.add(sky);const rings=[];[[16,5,13],[12,4,9.5],[9,3,6.5],[7,3,4]].forEach(([n,k,r],i)=>{const pg=new T.Group();pg.add(G.poly(r,n,C.dim,1));const m=G.lineset([0,0,0,0,0,0],i%2?C.cyan:C.lime,1);pg.add(m);sky.add(pg);rings.push({pg,m,n,k,r})});
W.euc=seed=>{const rr=G.rng(seed);rings.forEach(R=>{R.k=1+Math.floor(rr()*(R.n-2));const rot=Math.floor(rr()*R.n),p=[];let f=null,f0=null;
for(let s=0;s<R.n;s++)if(((s+rot)*R.k)%R.n<R.k){const a=s/R.n*6.2832,q=[Math.cos(a)*R.r,Math.sin(a)*R.r];p.push(q[0],q[1],0,q[0]*1.1,q[1]*1.1,0);if(f)p.push(f[0],f[1],0,q[0],q[1],0);else f0=q;f=q}
if(f&&f0)p.push(f[0],f[1],0,f0[0],f0[1],0);R.m.geometry.dispose();R.m.geometry=G.lineset(p.length?p:[0,0,0,0,0,0],0).geometry})};W.euc(20260101);
W.pressPad=p=>{p.press=1;if(p.fn)p.fn();W.ripple(p.x,p.z,C.lime,2.5,p.y)};
W.update=(dt,t)=>{const a=G.audio,pl=a.pulse;for(let i=0;i<pl.length;i++)pl[i]*=Math.exp(-dt*5);if(a.mapDemo)for(let j=0;j<4;j++){const m=a.mapDemo[j];if(m>3)pl[m]=Math.max(pl[m],pl[j])}
if(hub.visible){const amp=1+pl[1]*.8;let k=0;for(let i=0;i<bp.length;i+=2){const x=bp[i],z=bp[i+1];wp[k++]=x;wp[k++]=W.waterY(x,z,t)*amp;wp[k++]=z}wg.attributes.position.needsUpdate=true}
rp.forEach(m=>{if(!m.visible)return;const u=m.userData;u.t+=dt;const q=u.t/1.2;if(q>=1){m.visible=false;return}m.scale.setScalar(.2+q*u.r);m.material.opacity=(1-q)*.9});
spin.forEach((s,i)=>{s.o.rotation.y+=dt*s.s;if(s.tilt)s.o.rotation.x=Math.sin(t*.5+i)*.3});
if(cr.visible){const u=cr.userData;u.t=Math.max(0,Math.min(1,u.t+u.dir*dt*(u.dir>0?2.4:1.6)));const e=u.t*u.t*(3-2*u.t);cr.scale.setScalar(.1+.9*e);if(u.dir<0&&u.t<=0)cr.visible=false}
if(stk.visible){sOff=(sOff+dt*70)%48;const P=sg.attributes.position.array;sk.forEach((s,i)=>{const y=((s.b-sOff)%48+72)%48-24;P.set([s.x,y,s.z,s.x,y+s.L,s.z],i*6)});sg.attributes.position.needsUpdate=true}
sky.visible=G.area>=0;sky.position.set(cam.position.x,cam.position.y+45,cam.position.z-120);sky.scale.setScalar(2.2+pl[0]*.1);rings.forEach((R,i)=>{R.pg.rotation.z+=dt*(.08+i*.06)*(i%2?-1:1);R.pg.scale.setScalar(1+pl[i]*.08)});
G.anchors.pads.forEach(p=>{p.press=Math.max(0,p.press-dt*3);p.g.position.y=(p.base??.4)-.1*Math.sin(Math.min(1,p.press*2)*1.57);p.b.material.color.setHex(p.press>.05?0xaaaaaa:C.cyan)});
G.zoneTick.forEach(f=>f(dt,t))};
})();
