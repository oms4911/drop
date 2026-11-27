// MapleStory-, Lineage- and Seven Knights-style themes: original line-art characters and maps (no borrowed characters or logos).
(()=>{const T=THREE,TH=G.TH,{INK,DARK,LIGHT}=TH,V=T.Vector3;
const E=(geo,fill=0xeaeaea,ang=25)=>G.edges(geo,INK,1,ang,fill);
const Rn=(r,a,b)=>a+(b-a)*r(),tick=f=>TH.onTick(f);
const seg=(...p)=>{const o=[];for(let i=0;i+3<p.length;i+=2)o.push(p[i],p[i+1],0,p[i+2],p[i+3],0);return o};
const arcP=(r,cx,cy,a0,a1,n=12)=>{const p=[];for(let i=0;i<n;i++){const a=a0+(a1-a0)*i/n,b=a0+(a1-a0)*(i+1)/n;p.push(cx+Math.cos(a)*r,cy+Math.sin(a)*r,0,cx+Math.cos(b)*r,cy+Math.sin(b)*r,0)}return p};
const star7=(r,cx=0,cy=0,rot=Math.PI/2)=>{const p=[];for(let k=0;k<7;k++){const a=rot+k*6.2832/7,b=rot+((k+2)%7)*6.2832/7;p.push(cx+Math.cos(a)*r,cy+Math.sin(a)*r,0,cx+Math.cos(b)*r,cy+Math.sin(b)*r,0)}return p};
const leafPts=(s=1)=>{const half=[[0,1.15],[.2,.75],[.42,.85],[.45,.45],[.78,.55],[.7,.2],[1,.05],[.72,-.2],[.78,-.5],[.4,-.4],[.08,-.55]],p=[];const P=half.concat([[0,-.5]]),Q=half.map(([x,y])=>[-x,y]);for(let i=0;i+1<half.length;i++){p.push(half[i][0]*s,half[i][1]*s,0,half[i+1][0]*s,half[i+1][1]*s,0,Q[i][0]*s,Q[i][1]*s,0,Q[i+1][0]*s,Q[i+1][1]*s,0)}p.push(half[10][0]*s,half[10][1]*s,0,0,-.5*s,0,Q[10][0]*s,Q[10][1]*s,0,0,-.5*s,0,0,-.5*s,0,0,-1.1*s,0,0,-.4*s,0,0,1*s,0);return p};
const tagBase=(extra)=>{const g=new T.Group(),nm=G.text('OMS',.5,INK,1);nm.position.set(0,1.0,0);g.add(nm);const hb=G.rect(2.6,.2,INK,1,false);hb.position.set(0,.55,0);g.add(hb);const fl=G.panel(2.5,.12,0x1a1a1a);fl.position.set(0,.55,.01);g.add(fl);extra(g);return g};
// shared: sword slash arc that sweeps while the act key is pressed
const mkArc=(R,r,cy,cz,col=0xffffff)=>{const p=[];const n=24;for(let i=0;i<n;i++){const a=-1.4+i/n*2.6,b=-1.4+(i+1)/n*2.6;p.push(0,cy+Math.sin(a)*r,cz+Math.cos(a)*r,0,cy+Math.sin(b)*r,cz+Math.cos(b)*r)}const l=G.lineset(p,col,1);l.userData.nomorph=true;l.visible=false;R.up.add(l);return l};
const swing=(arm,c,base,wind,hit)=>{if(c.actP>=0){const k=TH.ss(c.actP);arm.s.rotation.x=wind+(hit-wind)*k;arm.e.rotation.x=-.2}else{arm.s.rotation.x=base;}};
// ================= MAPLE: chibi adventurer =================
const buildMaple=R=>{const{up}=R,MC=0x303030,CY=1.55,RX=1.95,RY=1.3;
// hopping mushroom: no legs, a stout stem body and a big spotted cap
const stem=G.edges(new T.CylinderGeometry(.78,.92,1.5,16),LIGHT,1,20,MC);stem.position.y=.8;up.add(stem);
const foot=G.edges(new T.CylinderGeometry(.96,.96,.1,16),LIGHT,1,20,0x3a3a3a);foot.position.y=.07;up.add(foot);
const dome=new T.SphereGeometry(1,20,8,0,6.2832,0,1.5708),cp=new T.Group();cp.position.set(0,CY,0);cp.scale.set(RX,RY,RX);cp.add(new T.Mesh(dome,G.fillMat(MC,true)),new T.LineSegments(new T.WireframeGeometry(dome),G.mat(LIGHT,.8)));up.add(cp);
const rim=G.edges(new T.CylinderGeometry(RX,RX,.12,20),LIGHT,1,20,0x3a3a3a);rim.position.y=CY;up.add(rim);
for(const[ax,ay]of[[.5,.95],[1.9,.95],[3.3,.95],[4.7,.95],[6.0,.95],[1.2,.45],[3.0,.5],[5.2,.45],[0,1.4],[2.4,1.15],[4.1,1.1]]){const nx=Math.sin(ay)*Math.cos(ax),ny=Math.cos(ay),nz=Math.sin(ay)*Math.sin(ax),sg=new T.Group();sg.position.set(nx*RX*.97,CY+ny*RY*.97,nz*RX*.97);sg.lookAt(sg.position.x*2,CY+(sg.position.y-CY)*2,sg.position.z*2);const q=[];for(let i=0;i<12;i++){const a=i/12*6.2832,b2=(i+1)/12*6.2832;q.push(Math.cos(a)*.3,Math.sin(a)*.3,.02,Math.cos(b2)*.3,Math.sin(b2)*.3,.02)}sg.add(G.lineset(q,0xffffff,1));up.add(sg)}
// face on the stem
const fz=.86,sm=[];for(let i=0;i<8;i++){const a=.25+i/8*(Math.PI-.5),b=.25+(i+1)/8*(Math.PI-.5);sm.push(Math.cos(a)*.2,.78-Math.sin(a)*.14,fz,Math.cos(b)*.2,.78-Math.sin(b)*.14,fz)}
up.add(G.lineset([-.27,.98,fz,-.27,1.2,fz,-.26,.98,fz,-.26,1.2,fz,.27,.98,fz,.27,1.2,fz,.26,.98,fz,.26,1.2,fz,...sm],0xffffff,1));
R.aR=R.arm(1,.9,1.15,{ua:.3,la:.25,w:.2});R.aL=R.arm(-1,-.9,1.15,{ua:.3,la:.25,w:.2});
// spin ring shown while the action key is held
const rg=[];for(let i=0;i<40;i++){const a=i/40*6.2832,b=(i+1)/40*6.2832;rg.push(Math.cos(a)*2.4,0,Math.sin(a)*2.4,Math.cos(b)*2.4,0,Math.sin(b)*2.4)}
const ring=G.lineset(rg,0xffffff,1);ring.position.y=CY+.35;ring.userData.nomorph=true;ring.visible=false;up.add(ring);R.fx=ring;
let spinA=0,spinW=0;
R.pose=c=>{const{kk,phase,t,dt=.016}=c,h=Math.abs(Math.sin(phase)),air=kk*h;
// squash on landing, stretch in the air, gentle breathing when idle
const sy=1+air*.16-kk*.22*Math.pow(1-h,6)+(1-kk)*Math.sin(t*2.2)*.025,sxz=1/Math.sqrt(sy);up.scale.set(sxz,sy,sxz);
const ap=c.actP>=0,d2=Math.min(.05,dt);if(ap)spinW+=(15-spinW)*Math.min(1,d2*7);else{spinW*=Math.exp(-d2*2.6);if(spinW<2)spinA+=(Math.round(spinA/6.2832)*6.2832-spinA)*Math.min(1,d2*3.5)}spinA+=spinW*d2;if(!ap&&spinW<.05&&Math.abs(spinA-Math.round(spinA/6.2832)*6.2832)<.01){spinA=0;spinW=0}up.rotation.y=spinA;
R.fx.visible=ap;if(ap){R.fx.scale.setScalar(.8+c.actP*.5);R.fx.material.opacity=1-c.actP*.7}
const fl=.25+air*.9+(ap?.8:0);R.aR.s.rotation.z=fl;R.aL.s.rotation.z=-fl;R.aR.s.rotation.x=R.aL.s.rotation.x=0}};
// ================= LINEAGE: plate knight =================
const buildLineage=R=>{const{mk,up}=R;const o={w:.42,d:.44,ft:[.42,.22,.7]};const L0=R.leg(-1,o),L1=R.leg(1,o);for(const L of[L0,L1])mk(.46,.3,.2,0,-.05,.24,L.k);
mk(1.2,1.3,.66,0,2.35,0);up.add(G.lineset([0,1.75,.34,0,2.95,.34,-.5,2.45,.34,.5,2.45,.34],0xffffff,1));mk(1.3,.45,.72,0,1.78,0);mk(.76,.26,.62,0,3.0,0);
for(const s of[-1,1]){mk(.62,.42,.84,s*.92,2.95,0,up,0,0,s*.25);mk(.56,.2,.78,s*.97,2.76,0)}
R.cape=mk(1.1,2.0,.08,0,2.0,-.44,up,.1);up.add(G.lineset([0,1.3,.4,0,2.9,.4,-.4,2.4,.4,.4,2.4,.4,-.55,1.5,.4,.55,1.5,.4,-.55,1.5,.4,0,1.15,.4,.55,1.5,.4,0,1.15,.4],0xffffff,1));for(let i=-2;i<=2;i++)mk(.22,.5,.5,i*.26,1.35,0,up);{const q=[];for(let i=0;i<6;i++)q.push(0,4.3,-.35-i*.12,0,4.55-i*.1,-.45-i*.16);up.add(G.lineset(q,0xffffff,1))}
mk(.66,.8,.68,0,3.5,0);up.add(G.lineset([-.22,3.55,.35,.22,3.55,.35,0,3.35,.35,0,3.75,.35,-.2,3.38,.35,.2,3.38,.35],0xffffff,1));mk(.1,.5,.9,0,4.05,0);mk(.72,.12,.72,0,3.12,0);
R.aR=R.arm(1,.98,2.9,{ua:.6,la:.6,w:.3});R.aL=R.arm(-1,-.98,2.9,{ua:.6,la:.6,w:.3});
const sw=new T.Group();R.aR.hand.add(sw);R.mk(.16,2.7,.07,0,-1.55,0,sw,0,0,0,0xf4f4f4,INK);R.mk(.9,.14,.16,0,-.22,0,sw);R.mk(.14,.5,.14,0,0,0,sw);
const sh=R.mk(.12,1.5,1.0,-.22,-.3,.1,R.aL.hand,0,0,0,0x3a3a3a);sh.add(G.lineset([-.07,-.7,0,-.07,.7,0,-.07,.2,-.4,-.07,.2,.4].map((v,i)=>v),0xffffff,1));
R.fx=mkArc(R,2.8,2.6,.5);
R.pose=c=>{const{kk,phase,t}=c;const s0=Math.sin(phase)*.8*kk;R.cape.rotation.x=.1+kk*.35+Math.sin(t*3)*.03;R.aL.s.rotation.x=-.2-s0*.6;R.aL.e.rotation.x=-.3;
R.fx.visible=c.actP>=0;if(c.actP>=0){R.fx.material.opacity=1-c.actP*.8;swing(R.aR,c,0,-2.7,.7)}else{R.aR.s.rotation.x=-1.1+s0*.4;R.aR.e.rotation.x=-.3}}};
// ================= MARBLE: a living die (original board-game dice character) =================
const PIPS={1:[[0,0]],2:[[-.5,.5],[.5,-.5]],3:[[-.5,.5],[0,0],[.5,-.5]],4:[[-.5,-.5],[-.5,.5],[.5,-.5],[.5,.5]],5:[[-.5,-.5],[-.5,.5],[0,0],[.5,-.5],[.5,.5]],6:[[-.5,-.5],[-.5,0],[-.5,.5],[.5,-.5],[.5,0],[.5,.5]]};
const dieFaces=(par,s,cy,skip=[])=>{const h=s/2+.012,cfg=[['front',1,[0,0,h],[0,0,0]],['back',6,[0,0,-h],[0,Math.PI,0]],['right',3,[h,0,0],[0,Math.PI/2,0]],['left',4,[-h,0,0],[0,-Math.PI/2,0]],['top',5,[0,h,0],[-Math.PI/2,0,0]]],mat=new T.MeshBasicMaterial({color:0x111111,side:T.DoubleSide,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1});
for(const[nm,n,p,r]of cfg){if(skip.includes(nm))continue;const g=new T.Group();g.position.set(p[0],p[1]+cy,p[2]);g.rotation.set(r[0],r[1],r[2]);for(const[x,y]of PIPS[n]){const m=new T.Mesh(new T.CircleGeometry(s*.1,12),mat);m.position.set(x*s*.62,y*s*.62,0);g.add(m)}par.add(g)}};
G.dieFaces=dieFaces;
const buildMarble=R=>{const{mk,up}=R;const o={x:.38,tl:.42,sl:.36,w:.28,d:.3,ft:[.42,.14,.54]};R.leg(-1,o);R.leg(1,o);
mk(1.8,1.8,1.8,0,1.65,0,up,0,0,0,0xf4f4f4,INK);dieFaces(up,1.8,1.65,['front']);
// face on the front: two pip eyes, smile, blush ticks
const em=new T.MeshBasicMaterial({color:0x111111,side:T.DoubleSide,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1});for(const x of[-.42,.42]){const m=new T.Mesh(new T.CircleGeometry(.17,12),em);m.position.set(x,1.95,.92);up.add(m)}
{const q=[];for(let i=0;i<10;i++){const a=.35+i/10*2.45,b=.35+(i+1)/10*2.45;q.push(Math.cos(a)*.4,1.45-Math.sin(a)*.3+.2,.92,Math.cos(b)*.4,1.45-Math.sin(b)*.3+.2,.92)}q.push(-.7,1.7,.92,-.55,1.7,.92,.55,1.7,.92,.7,1.7,.92);const l=G.lineset(q,INK,1);l.userData.nomorph=false;up.add(l)}
R.aR=R.arm(1,1.12,1.9,{ua:.4,la:.35,w:.24});R.aL=R.arm(-1,-1.12,1.9,{ua:.4,la:.35,w:.24});
R.pose=c=>{const{kk,phase,t}=c;const s0=Math.sin(phase)*.9*kk;R.aL.s.rotation.x=-.3-s0;R.aR.s.rotation.x=-.3+s0;R.aL.s.rotation.z=-.5;R.aR.s.rotation.z=.5;up.rotation.z=Math.sin(phase)*.1*kk+Math.sin(t*2)*.02;
if(c.actP>=0){R.piv.rotation.x+=TH.ss(c.actP)*6.2832;R.g.position.y+=Math.sin(c.actP*Math.PI)*2.4;R.aL.s.rotation.z=R.aR.s.rotation.z=-2.2*(0)+(c.actP<.5?-1.2:.5)*(R.aL.s===R.aL.s?1:1)}}};
// ================= maps =================
// --- MAPLE: round trees, floating grass islands, rope ladders, drifting leaves ---
const tree=(r,h=Rn(r,10,18),rad=Rn(r,5,8))=>{const g=new T.Group(),tr=E(new T.CylinderGeometry(.9,1.4,h,8),0xe0e0e0);tr.position.y=h/2;g.add(tr);for(let i=0;i<3;i++){const s=E(new T.IcosahedronGeometry(rad*(i?.7:1),1),0xf2f2f2,1);s.position.set(i?(i%2?1:-1)*rad*.8:0,h+(i?-rad*.2:rad*.3),i?(r()-.5)*rad:0);g.add(s)}return g};
const grassTufts=(g,r,w,d,y,n=16)=>{const p=[];for(let i=0;i<n;i++){const x=(r()-.5)*w,z=(r()-.5)*d,h=.5+r()*.6;p.push(x,y,z,x+.2,y+h,z,x,y,z,x-.2,y+h*.8,z)}g.add(G.lineset(p,INK,1))};
const island=(r,w=Rn(r,10,18),d=Rn(r,8,12),y=Rn(r,7,14))=>{const g=new T.Group(),top=G.box(w,1.4,d,INK,1,0xf2f2f2);top.position.y=y;g.add(top);const c=G.edges(new T.ConeGeometry(Math.min(w,d)*.55,4.5,4,1),INK,1,20,0xdcdcdc);c.rotation.x=Math.PI;c.rotation.y=Math.PI/4;c.scale.x=w/d;c.position.y=y-2.9;g.add(c);grassTufts(g,r,w*.9,d*.9,y+.7);
const v=[];for(let i=0;i<7;i++){const x=(r()-.5)*w,z=d/2*(r()<.5?-1:1)*.95;v.push(x,y-.7,z,x+(r()-.5),y-2-r()*3,z)}g.add(G.lineset(v,INK,1));return g};
const ladder=(h,x=0,z=0)=>{const p=[x-.5,0,z,x-.5,h,z,x+.5,0,z,x+.5,h,z];for(let y=1;y<h;y+=1)p.push(x-.5,y,z,x+.5,y,z);return G.lineset(p,INK,1)};
const mapleTall=r=>{if(r()<.55)return tree(r);const g=new T.Group(),y=Rn(r,7,14),w=Rn(r,10,16);g.add(island(r,w,Rn(r,8,11),y));const t=tree(r,5,3);t.position.set((r()-.5)*w*.5,y+.7,0);g.add(t);g.add(ladder(y,w/2+.8,0));return g};
const fence=(r)=>{const g=new T.Group(),n=5;for(let i=0;i<n;i++){const p=G.box(.3,1.8,.3,INK,1,0xe6e6e6);p.position.set((i-2)*1.8,.9,0);g.add(p)}g.add(G.lineset([-3.6,1.5,0,3.6,1.5,0,-3.6,.9,0,3.6,.9,0],INK,1));return g};
const bush=r=>{const g=new T.Group(),k=Rn(r,1.1,1.8),b=E(new T.IcosahedronGeometry(k,1),0xf0f0f0,1);b.position.y=k*.7;b.scale.y=.75;g.add(b);return g};
const flowers=r=>{const g=new T.Group(),p=[];for(let i=0;i<7;i++){const x=(r()-.5)*4,z=(r()-.5)*4,h=.8+r()*.7;p.push(x,0,z,x,h,z);const f=G.poly(.3,5,INK,1,r()*3);f.rotation.x=-Math.PI/2;f.position.set(x,h,z);g.add(f)}g.add(G.lineset(p,INK,1));return g};
const sign=r=>{const g=new T.Group(),p=G.box(.3,3,.3,INK,1,0xe6e6e6);p.position.y=1.5;g.add(p);for(const[y,s]of[[2.8,1],[1.9,-1]]){const b=G.box(2.4,.7,.16,INK,1,0xf2f2f2);b.position.set(s*.4,y,0);g.add(b)}return g};
const mapleLow=r=>{const k=r();return k<.3?bush(r):k<.55?flowers(r):k<.8?sign(r):portalRing(r)};
const portalRing=r=>{const g=new T.Group(),a=G.poly(1.9,28,INK,1),b=G.poly(1.4,24,INK,.8),c=G.lineset(Array.from({length:10},(_,i)=>{const t=i/10*6.28;return[Math.cos(t)*1.9,Math.sin(t)*1.9,0,Math.cos(t+.5)*1.1,Math.sin(t+.5)*1.1,0]}).flat(),INK,.9);for(const m of[a,b,c])m.position.y=2.2,g.add(m);tick((dt,t)=>{c.rotation.z=t*1.2});return g};
const leaves=(root,n,box)=>{const geo=new T.BufferGeometry(),arr=new Float32Array(n*4*6);geo.setAttribute('position',new T.BufferAttribute(arr,3));const m=new T.LineSegments(geo,G.mat(INK,.9));m.frustumCulled=false;root.add(m);const R0=G.rng(4),S=Array.from({length:n},()=>({x:(R0()-.5)*box[0],z:(R0()-.5)*box[1]+box[2],y:R0()*box[3],v:1+R0()*1.6,ph:R0()*9,s:R0()*3}));
tick((dt,t)=>{S.forEach((l,i)=>{l.y-=l.v*dt;if(l.y<0)l.y+=box[3];const cx=l.x+Math.sin(t*.8+l.ph)*2.4,cz=l.z+Math.cos(t*.6+l.ph)*2,a=t*1.5+l.s,ca=Math.cos(a),sa=Math.sin(a),P=[[0,.5],[.3,0],[0,-.5],[-.3,0]];for(let k=0;k<4;k++){const A=P[k],B=P[(k+1)%4],o=(i*4+k)*6;arr[o]=cx+A[0]*ca*.9;arr[o+1]=l.y+A[1]*sa*.6;arr[o+2]=cz+A[1]*ca*.9;arr[o+3]=cx+B[0]*ca*.9;arr[o+4]=l.y+B[1]*sa*.6;arr[o+5]=cz+B[1]*ca*.9}});geo.attributes.position.needsUpdate=true})};
G.regTheme('maple',{label:'MAPLESTORY',hint:'HOLD SPACE TO SPIN',hipY:.9,build:buildMaple,tag:()=>tagBase(g=>{const t=G.text('LV.200',.36,INK,1);t.position.set(0,.12,0);g.add(t)}),
map:(a,rng,root)=>{G.layoutMap(a,rng,{tall:mapleTall,mid:fence,low:mapleLow},root);leaves(root,a>=0?36:60,a>=0?[120,70,5,40]:[200,120,10,40])},fog:.0046,flat:false,l0:0,l1:.04,H:0,bob:1.15,sc:1.05,tagY:4.1,kneeK:1.5});
// --- LINEAGE: stone castle, towers, torches ---
const merlons=(g,len,y,dz,rng,gapP=.15)=>{const n=Math.floor(len/2.2);for(let i=0;i<n;i++){if(rng()<gapP)continue;const m=G.box(1.2,1.1,dz,INK,1,0xe2e2e2);m.position.set((i-(n-1)/2)*2.2,y,0);g.add(m)}};
const tower=r=>{const g=new T.Group(),h=Rn(r,20,32),rad=Rn(r,3.5,5),b=E(new T.CylinderGeometry(rad,rad*1.12,h,12),0xe6e6e6);b.position.y=h/2;g.add(b);
const hd=E(new T.CylinderGeometry(rad*1.25,rad*1.1,2.2,12),0xdcdcdc);hd.position.y=h+1.1;g.add(hd);for(let i=0;i<10;i++){const a=i/10*6.2832;if(r()<.12)continue;const m=G.box(1.3,1.3,1.1,INK,1,0xe2e2e2);m.position.set(Math.cos(a)*rad*1.2,h+2.85,Math.sin(a)*rad*1.2);m.rotation.y=-a;g.add(m)}
if(r()<.5){const c=G.edges(new T.ConeGeometry(rad*1.4,rad*1.8,12),INK,1,20,0xd0d0d0);c.position.y=h+2.2+rad*.9;g.add(c)}
for(let i=0;i<4;i++){const s=G.panel(.55,1.8,0x161616);const a=i*1.5708+.4;s.position.set(Math.cos(a)*(rad*1.121),h*(.3+.18*i),Math.sin(a)*(rad*1.121));s.rotation.y=Math.PI/2-a;g.add(s)}
const rim=[];for(let i=0;i<24;i++){const a=i/24*6.2832,b2=(i+1)/24*6.2832;rim.push(Math.cos(a)*rad*1.1,h*.45,Math.sin(a)*rad*1.1,Math.cos(b2)*rad*1.1,h*.45,Math.sin(b2)*rad*1.1)}g.add(G.lineset(rim,INK,1));return g};
const keep=r=>{const g=new T.Group(),w=Rn(r,16,22),h=Rn(r,14,20),b=G.box(w,h,12,INK,1,0xe8e8e8);b.position.y=h/2;g.add(b);const t=new T.Group();t.position.y=h+.55;merlons(t,w,0,12.4,r);g.add(t);const ar=[];for(let i=0;i<14;i++){const a=i/14*3.1416,c=(i+1)/14*3.1416;ar.push(Math.cos(a)*2.2,Math.sin(a)*2.2+2.6,6.05,Math.cos(c)*2.2,Math.sin(c)*2.2+2.6,6.05)}ar.push(-2.2,0,6.05,-2.2,2.6,6.05,2.2,0,6.05,2.2,2.6,6.05);g.add(G.lineset(ar,INK,1));const d=G.panel(4.4,2.6,0x161616);d.position.set(0,1.3,6.04);g.add(d);for(const s of[-1,1]){const tw=tower(r);tw.scale.setScalar(.75);tw.position.set(s*(w/2+1),0,0);g.add(tw)}return g};
const lineageTall=r=>r()<.65?tower(r):keep(r);
const cwall=r=>{const g=new T.Group(),len=Rn(r,10,14),w=G.box(len,Rn(r,6,9),2.4,INK,1,0xe6e6e6);w.position.y=w.geometry.parameters.height/2;g.add(w);const t=new T.Group();t.position.y=w.geometry.parameters.height+.55;merlons(t,len,0,2.5,r,.25);g.add(t);for(let i=0;i<3;i++){const s=G.panel(.4,1.4,0x161616);s.position.set((i-1)*3,w.geometry.parameters.height*.6,1.21);g.add(s)}return g};
const torch=r=>{const g=new T.Group(),p=G.box(.25,3.2,.25,INK,1,0xdedede);p.position.y=1.6;g.add(p);const bw=G.edges(new T.ConeGeometry(.55,.7,8),INK,1,20,0x3a3a3a);bw.rotation.x=Math.PI;bw.position.y=3.4;g.add(bw);const fl=G.lineset(new Array(24).fill(0),INK,1);fl.position.y=3.7;g.add(fl);const ph=r()*9;tick((dt,t)=>{const a=fl.geometry.attributes.position;const pts=[[0,0,0,.1,.9+Math.sin(t*9+ph)*.25,0],[-.25,0,0,-.15,.6+Math.sin(t*7+ph)*.2,0],[.25,0,0,.2,.55+Math.sin(t*8+ph)*.2,0],[0,0,.2,0,.7+Math.sin(t*10+ph)*.25,.1]];pts.forEach((s,i)=>{for(let k=0;k<6;k++)a.array[i*6+k]=s[k]});a.needsUpdate=true});return g};
const barrel2=r=>{const b=G.edges(new T.CylinderGeometry(.7,.7,1.6,10),INK,1,20,0xdadada);b.position.y=.8;const g=new T.Group();g.add(b);return g};
const spikes=r=>{const g=new T.Group();for(let i=0;i<7;i++){const p=G.box(.22,2.2,.22,INK,1,0xdedede);p.position.set((i-3)*.8,1,0);p.rotation.z=(i%2?.35:-.35);g.add(p)}return g};
const bannerPole=r=>{const g=new T.Group(),p=G.box(.25,8,.25,INK,1,0xdedede);p.position.y=4;g.add(p);const c=G.panel(2.2,3.6,0x161616);c.position.set(1.2,5.8,0);g.add(c);g.add(G.lineset(seg(0,0,0,0).length?[.2,4.4,.01,2.2,7.2,.01,2.2,4.4,.01,.2,7.2,.01]:[],0xffffff,1));return g};
const lineageLow=r=>{const k=r();return k<.35?torch(r):k<.55?barrel2(r):k<.75?spikes(r):bannerPole(r)};
const embers=(root,n,box)=>{const geo=new T.BufferGeometry(),arr=new Float32Array(n*6);geo.setAttribute('position',new T.BufferAttribute(arr,3));const m=new T.LineSegments(geo,G.mat(INK,.9));m.frustumCulled=false;root.add(m);const R0=G.rng(8),S=Array.from({length:n},()=>({x:(R0()-.5)*box[0],z:(R0()-.5)*box[1]+box[2],y:R0()*box[3],v:2+R0()*3}));tick((dt,t)=>{S.forEach((s,i)=>{s.y+=s.v*dt;if(s.y>box[3])s.y=0;const o=i*6;arr[o]=s.x+Math.sin(t+i)*1.2;arr[o+1]=s.y;arr[o+2]=s.z;arr[o+3]=arr[o]+.1;arr[o+4]=s.y+.5;arr[o+5]=s.z});geo.attributes.position.needsUpdate=true})};
G.regTheme('lineage',{label:'LINEAGE',hint:'HOLD SPACE TO SLASH',hipY:1.7,build:buildLineage,tag:()=>tagBase(g=>{const t=G.text('CLAN OMS',.34,INK,1);t.position.set(0,.12,0);g.add(t)}),
map:(a,rng,root)=>{G.layoutMap(a,rng,{tall:lineageTall,mid:cwall,low:lineageLow},root);embers(root,a>=0?50:70,a>=0?[120,70,5,36]:[200,120,10,36])},fog:.0062,flat:true,l0:.06,l1:.14,H:.85,bob:.1,sc:.95,tagY:4.85,kneeK:1.1});
const sparkles=(root,n,box)=>{const geo=new T.BufferGeometry(),arr=new Float32Array(n*12);geo.setAttribute('position',new T.BufferAttribute(arr,3));const m=new T.LineSegments(geo,G.mat(INK,.9));m.frustumCulled=false;root.add(m);const R0=G.rng(12),S=Array.from({length:n},()=>({x:(R0()-.5)*box[0],z:(R0()-.5)*box[1]+box[2],y:R0()*box[3],v:1+R0()*2}));tick((dt,t)=>{S.forEach((s,i)=>{s.y+=s.v*dt;if(s.y>box[3])s.y=0;const o=i*12,k=.35+.2*Math.sin(t*4+i);arr.set([s.x-k,s.y,s.z,s.x+k,s.y,s.z,s.x,s.y-k,s.z,s.x,s.y+k,s.z],o)});geo.attributes.position.needsUpdate=true})};
// --- MARBLE: board-game world — dice, hotels, houses, tiles and coins ---
const dieBlock=(sz)=>{const g=new T.Group(),c=G.box(sz,sz,sz,INK,1,0xf4f4f4);g.add(c);dieFaces(g,sz,0);return g};
const hotel=r=>{const g=new T.Group(),w=Rn(r,5,7),h=Rn(r,14,24);let y=0,ww=w;for(let i=0;i<3;i++){const hh=h*(i?.3:.5),b=G.box(ww,hh,ww,INK,1,0xf0f0f0);b.position.y=y+hh/2;g.add(b);const win=[];for(let k=0;k<4;k++)for(let m=0;m<Math.floor(hh/2.4);m++){win.push(-ww/2+.8+k*(ww-1.6)/3,y+1.5+m*2.4,ww/2+.01,-ww/2+1.3+k*(ww-1.6)/3,y+2.3+m*2.4,ww/2+.01)}const wp=[];for(let k=0;k<win.length;k+=6)wp.push(win[k],win[k+1],win[k+2],win[k+3],win[k+1],win[k+2],win[k+3],win[k+1],win[k+2],win[k+3],win[k+4],win[k+5],win[k+3],win[k+4],win[k+5],win[k],win[k+4],win[k+5],win[k],win[k+4],win[k+5],win[k],win[k+1],win[k+2]);g.add(G.lineset(wp,INK,1));y+=hh;ww*=.72}
const rf=G.edges(new T.ConeGeometry(ww*.9,ww*.9,4),INK,1,20,0xdcdcdc);rf.rotation.y=Math.PI/4;rf.position.y=y+ww*.45;g.add(rf);return g};
const house=r=>{const g=new T.Group(),b=G.box(3,2.4,3,INK,1,0xf0f0f0);b.position.y=1.2;g.add(b);const rf=G.edges(new T.ConeGeometry(2.6,1.6,4),INK,1,20,0xdcdcdc);rf.rotation.y=Math.PI/4;rf.position.y=3.2;g.add(rf);return g};
const houses=r=>{const g=new T.Group();for(let i=0;i<3;i++){const h=house(r);h.position.set((i-1)*4,0,(r()-.5)*2);h.scale.setScalar(.8+r()*.8);g.add(h)}return g};
const bigDie=r=>{const sz=Rn(r,5,8),g=new T.Group(),d=dieBlock(sz),y0=sz*.75+Rn(r,1,6),ph=r()*9;d.position.y=y0;g.add(d);const sh=G.poly(sz*.75,4,INK,.7,Math.PI/4);sh.rotation.x=-Math.PI/2;sh.position.y=.08;g.add(sh);tick((dt,t)=>{d.position.y=y0+Math.sin(t*1.1+ph)*.8;d.rotation.set(t*.35+ph,t*.5,t*.22)});return g};
const marbleTall=r=>{const k=r();return k<.45?hotel(r):k<.8?bigDie(r):houses(r)};
const tiles=r=>{const g=new T.Group(),cols=[0xf4f4f4,0xe0e0e0];for(let i=0;i<3;i++){const t=G.box(4.4,.5,6,INK,1,cols[i%2]);t.position.set((i-1)*4.6,.25,0);g.add(t);const p=[(i-1)*4.6-1.6,.52,-2.4,(i-1)*4.6+1.6,.52,-2.4,(i-1)*4.6-1.6,.52,-1.6,(i-1)*4.6+1.6,.52,-1.6];g.add(G.lineset(p,INK,1))}return g};
const coins=r=>{const g=new T.Group(),n=3+Math.floor(r()*4);for(let i=0;i<n;i++){const c=G.edges(new T.CylinderGeometry(1.1,1.1,.28,16),INK,1,20,0xf4f4f4);c.position.y=.14+i*.3;g.add(c)}return g};
const pawn=r=>{const g=new T.Group(),b=G.edges(new T.ConeGeometry(.9,2.2,12),INK,1,20,0xf0f0f0);b.position.y=1.1;g.add(b);const h=E(new T.IcosahedronGeometry(.6,1),0xf4f4f4,1);h.position.y=2.5;g.add(h);return g};
const smallDie=r=>{const g=dieBlock(1.8);g.position.y=.9;const o=new T.Group();o.add(g);o.rotation.y=r()*6;return o};
const marbleLow=r=>{const k=r();return k<.3?coins(r):k<.55?pawn(r):k<.8?smallDie(r):house(r)};
G.regTheme('marble',{label:'MODU MARBLE',hint:'HOLD SPACE TO ROLL',hipY:.8,build:buildMarble,tag:()=>tagBase(g=>{const t=G.text('LUCKY 6',.34,INK,1);t.position.set(0,.12,0);g.add(t)}),
map:(a,rng,root)=>{G.layoutMap(a,rng,{tall:marbleTall,mid:tiles,low:marbleLow},root);sparkles(root,a>=0?36:56,a>=0?[120,70,5,36]:[200,120,10,36])},fog:.0050,flat:true,l0:.05,l1:.12,H:1.1,bob:.4,sc:1.0,tagY:3.9,kneeK:1.3});
})();
