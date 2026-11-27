// Shared state, event bus, line-font and line-geometry helpers. Everything in the world is built from line segments.
const G={mode:0,view:'3d',started:false,loop:false,
NCH:23,db:new Array(23).fill(0),mute:new Array(23).fill(false),names:['DRUMS','BASS','SYNTH','AMBIENT'],gnames:['AMBIENT','MUSIC','FX'],vnames:['바이올린 1','바이올린 2','비올라','첼로'],venames:['VIOLIN 1','VIOLIN 2','VIOLA','CELLO'],chName(i,area,en){if(i>=7)return(en?this.venames:this.vnames)[(i-7)%4];return i<4?this.names[i]:this.gnames[i-4]},
modes:[{id:'PROFILE',ko:'프로필',sub:'CORE COMPETENCIES'},{id:'GAME',ko:'게임',sub:'PLAYABLE SHOWREEL'},{id:'MOCK UP',ko:'목업',sub:'GENERATIVE PRODUCTION'},{id:'CREATIVE',ko:'크리에이티브',sub:'SOUND RND LAB'},{id:'CONTACT',ko:'연락',sub:'NETWORK HUB'}],
STEP:15,ticks:[],_ev:{},
C:{cyan:0x2b2b2b,lime:0x000000,hot:0x000000,white:0x0a0a0a,dim:0xb2b2b2,bg:0xffffff}};
G.cx=i=>i*G.STEP;
G.on=(e,f)=>{(G._ev[e]=G._ev[e]||[]).push(f)};
G.emit=(e,a)=>{(G._ev[e]||[]).forEach(f=>f(a))};
G.setDb=(i,db,src)=>{db=Math.max(-48,Math.min(6,db));G.db[i]=Math.round(db*10)/10;G.emit('mixer',{i,src})};
G.toggleMute=i=>{G.mute[i]=!G.mute[i];G.emit('mixer',{i})};
G.fmtDb=db=>(db>0?'+':'')+db.toFixed(1)+' dB';
G.toast=m=>{const t=document.getElementById('toast');t.textContent=m;t.classList.add('on');clearTimeout(G._tt);G._tt=setTimeout(()=>t.classList.remove('on'),2200)};
G.mat=(c,o=1)=>new THREE.LineBasicMaterial({color:c,transparent:true,opacity:o,depthWrite:false});
G.lineset=(pos,c,o=1)=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));return new THREE.LineSegments(g,G.mat(c,o))};
G.fillMat=(c,basic)=>new THREE[basic?'MeshBasicMaterial':'MeshLambertMaterial']({color:c,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1,side:THREE.DoubleSide});
G.edges=(geo,c,o=1,ang=20,fill=0xeeeeee)=>{const l=new THREE.LineSegments(new THREE.EdgesGeometry(geo,ang),G.mat(c,o));if(fill!==null){const m=new THREE.Mesh(geo,G.fillMat(fill));l.add(m)}return l};
G.panel=(w,h,c)=>new THREE.Mesh(new THREE.PlaneGeometry(w,h),G.fillMat(c,true));
G.wire=(geo,c,o=1)=>new THREE.LineSegments(new THREE.WireframeGeometry(geo),G.mat(c,o));
G.box=(w,h,d,c,o,fill)=>G.edges(new THREE.BoxGeometry(w,h,d),c,o,20,fill===undefined?0xeeeeee:fill);
G.poly=(r,n,c,o=1,rot=0)=>{const p=[];for(let i=0;i<n;i++){const a=rot+i/n*6.2832,b=rot+(i+1)/n*6.2832;p.push(Math.cos(a)*r,Math.sin(a)*r,0,Math.cos(b)*r,Math.sin(b)*r,0)}return G.lineset(p,c,o)};
G.rect=(w,h,c,o=1,fill=true)=>{const x=w/2,y=h/2,l=G.lineset([-x,-y,0,x,-y,0,x,-y,0,x,y,0,x,y,0,-x,y,0,-x,y,0,-x,-y,0],c,o);if(fill)l.add(G.panel(w,h,0xffffff));return l};
G.ellipsoid=(rx,ry,rz,c,o=1,n=18)=>{const p=[];const ci=f=>{for(let i=0;i<n;i++){p.push(...f(i/n*6.2832),...f((i+1)/n*6.2832))}};
ci(a=>[Math.cos(a)*rx,Math.sin(a)*ry,0]);ci(a=>[Math.cos(a)*rx,0,Math.sin(a)*rz]);ci(a=>[0,Math.cos(a)*ry,Math.sin(a)*rz]);
for(const s of[-.55,.55]){const k=Math.sqrt(1-s*s);ci(a=>[Math.cos(a)*rx*k,s*ry,Math.sin(a)*rz*k])}return G.lineset(p,c,o)};
// 3x4 stroke font: each glyph is a list of polylines [x,y,x,y,...]
const F={A:[[0,0,0,3,1,4,2,3,2,0],[0,2,2,2]],B:[[0,0,0,4,1.5,4,2,3.3,1.5,2,0,2],[1.5,2,2,.7,1.5,0,0,0]],C:[[2,4,0,4,0,0,2,0]],D:[[0,0,0,4,1,4,2,3,2,1,1,0,0,0]],
E:[[2,4,0,4,0,0,2,0],[0,2,1.5,2]],F:[[2,4,0,4,0,0],[0,2,1.5,2]],G:[[2,4,0,4,0,0,2,0,2,2,1,2]],H:[[0,0,0,4],[2,0,2,4],[0,2,2,2]],I:[[0,4,2,4],[1,4,1,0],[0,0,2,0]],
J:[[2,4,2,0,0,0,0,1]],K:[[0,0,0,4],[2,4,0,2,2,0]],L:[[0,4,0,0,2,0]],M:[[0,0,0,4,1,2,2,4,2,0]],N:[[0,0,0,4,2,0,2,4]],O:[[0,0,0,4,2,4,2,0,0,0]],
P:[[0,0,0,4,2,4,2,2,0,2]],Q:[[0,0,0,4,2,4,2,0,0,0],[1,1,2,0]],R:[[0,0,0,4,2,4,2,2,0,2],[1,2,2,0]],S:[[2,4,0,4,0,2,2,2,2,0,0,0]],T:[[0,4,2,4],[1,4,1,0]],
U:[[0,4,0,0,2,0,2,4]],V:[[0,4,1,0,2,4]],W:[[0,4,0,0,1,2,2,0,2,4]],X:[[0,0,2,4],[0,4,2,0]],Y:[[0,4,1,2,2,4],[1,2,1,0]],Z:[[0,4,2,4,0,0,2,0]],
'0':[[0,0,0,4,2,4,2,0,0,0],[0,0,2,4]],'1':[[.5,3,1,4,1,0]],'2':[[0,4,2,4,2,2,0,2,0,0,2,0]],'3':[[0,4,2,4,2,0,0,0],[.5,2,2,2]],'4':[[0,4,0,2,2,2],[2,4,2,0]],
'5':[[2,4,0,4,0,2,2,2,2,0,0,0]],'6':[[2,4,0,4,0,0,2,0,2,2,0,2]],'7':[[0,4,2,4,0,0]],'8':[[0,0,0,4,2,4,2,0,0,0],[0,2,2,2]],'9':[[2,2,0,2,0,4,2,4,2,0,0,0]],
'-':[[0,2,2,2]],'.':[[.8,0,1.2,0]],'_':[[0,0,2,0]],'/':[[0,0,2,4]],':':[[1,1,1,1.2],[1,3,1,3.2]],'+':[[0,2,2,2],[1,1,1,3]],'@':[[2,0,0,0,0,4,2,4,2,1,1,1,1,3,2,3]],',':[[1,0,.7,-.7]],"'":[[1,4,1,3]],'>':[[0,4,2,2,0,0]],'@':[[2,1,2,3,.4,3,.4,1,2,1],[2,3,2,0,0,0]],'&':[[2,0,0,3,1,4,2,3,0,0]],'!':[[1,4,1,1.4],[1,.4,1,.2]],'?':[[0,3,0,4,2,4,2,2,1,2,1,1.2],[1,.4,1,.2]],',':[[1,.6,.8,0]],'(':[[1.6,4,.8,3,.8,1,1.6,0]],')':[[.4,4,1.2,3,1.2,1,.4,0]]};
G.text=(s,h,c,o=1,al='center')=>{const u=h/4,adv=3.7*u,w=s.length*adv-1.7*u;const ox=al==='center'?-w/2:al==='right'?-w:0;const p=[];let x=0;
for(const ch of s.toUpperCase()){const g=F[ch];if(g)for(const q of g)for(let k=0;k+3<q.length;k+=2)p.push(ox+x+q[k]*u,q[k+1]*u-h/2,0,ox+x+q[k+2]*u,q[k+3]*u-h/2,0);x+=adv}
if(!p.length)p.push(0,0,0,0,0,0);const d=h*.03,q=[];for(let i=0;i<p.length;i+=6)for(const[ox,oy]of[[0,0],[d,0],[-d,0],[0,d],[0,-d]])q.push(p[i]+ox,p[i+1]+oy,p[i+2],p[i+3]+ox,p[i+4]+oy,p[i+5]);return G.lineset(q,c,o)};
G.setText=(m,s,h,c,o,al)=>{const t=G.text(s,h,c,o,al);m.geometry.dispose();m.geometry=t.geometry;t.material.dispose()};
G.rng=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};

G.bill=[];G.camYaw=0;
G.sign=(s,h,c,o,al,x,y,z)=>{const g=new THREE.Group();g.add(G.text(s,h,c,o,al));g.position.set(x,y,z);G.bill.push(g);return g};
