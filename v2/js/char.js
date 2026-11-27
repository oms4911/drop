// Symbiote avatar: one amorphous line-body with eight fluid tendrils (legs). All world-space line segments, rebuilt each frame.
(()=>{const T=THREE,C=G.C;
const src=new T.IcosahedronGeometry(1,2).attributes.position.array,nV=src.length/3,nT=nV/3;
const D=new Float32Array(nV*3),bp=new Float32Array(nT*18),bg=new T.BufferGeometry();bg.setAttribute('position',new T.BufferAttribute(bp,3));
const body=new T.LineSegments(bg,G.mat(0xd8d8d8,.55));body.frustumCulled=false;const fg=new T.BufferGeometry();fg.setAttribute('position',new T.BufferAttribute(D,3));const bfill=new T.Mesh(fg,new T.MeshBasicMaterial({color:0x0a0a0a,side:T.DoubleSide,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1}));bfill.frustumCulled=false;
const SC=1.4,N=8,M=9,J=new Float32Array(N*M*3),SEG=2*(M-1)+M+1,tp=new Float32Array(N*SEG*6),tg=new T.BufferGeometry();tg.setAttribute('position',new T.BufferAttribute(tp,3));
const tend=new T.LineSegments(tg,G.mat(0x9a9a9a,.8));tend.frustumCulled=false;const tf=new Float32Array(N*(M-1)*18),tfg=new T.BufferGeometry();tfg.setAttribute('position',new T.BufferAttribute(tf,3));const tfill=new T.Mesh(tfg,new T.MeshBasicMaterial({color:0x0a0a0a,side:T.DoubleSide,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1}));tfill.frustumCulled=false;
const ep=new Float32Array(2*7*6),eg=new T.BufferGeometry();eg.setAttribute('position',new T.BufferAttribute(ep,3));const eyes=new T.LineSegments(eg,G.mat(0xffffff,1));eyes.frustumCulled=false;
const sh=G.poly(1.4,28,C.cyan,.55);sh.rotation.x=-Math.PI/2;
G.scene.add(bfill,tfill,body,tend,eyes,sh);let primed=false;
G.char={parts:[bfill,tfill,body,tend,eyes],fills:[bfill,tfill],bp,tp,update(P){const{x,y,z,yaw,mode,t,dt,phase=0,k=0,sx=1,sy=1,sz=1,ret=0,anchor=null,agit=0,snap=false}=P,s=Math.sin(yaw),c=Math.cos(yaw),rot=(a,b)=>[a*c+b*s,-a*s+b*c];
const kk=mode==='walk'?k:0,bob=Math.sin(phase*2)*.07*kk,cx=x,cy=y+.95*sy*SC+bob,cz=z;
for(let i=0;i<nV;i++){const vx=src[i*3],vy=src[i*3+1],vz=src[i*3+2],n=Math.sin(vx*3.1+t*2.3)*Math.sin(vy*2.7-t*1.9)*Math.sin(vz*3.3+t*2.1),amp=.1+.12*k+.3*agit,sp=agit>0?Math.max(0,Math.sin(i*12.9+t*9))*agit*.55:0,f=1+n*amp+sp,
[rx,rz]=rot(vx*.8*sx*f*SC,vz*sz*f*SC);D[i*3]=cx+rx;D[i*3+1]=cy+vy*.62*sy*f*SC;D[i*3+2]=cz+rz}
for(let q=0;q<nT;q++){const a=q*9,b=a+3,d=a+6,o=q*18;for(let m=0;m<3;m++){bp[o+m]=D[a+m];bp[o+3+m]=D[b+m];bp[o+6+m]=D[b+m];bp[o+9+m]=D[d+m];bp[o+12+m]=D[d+m];bp[o+15+m]=D[a+m]}}bg.attributes.position.needsUpdate=true;fg.attributes.position.needsUpdate=true;
let e=0;for(const sd of[-1,1]){const pts=[[.04*sd,-.14],[.32*sd,.16],[.02*sd,.1]];const L=pts.map(([lx,ly])=>{const[ax,az]=rot((.3*sd+lx)*.8*sx*SC,.98*sz*SC);return[cx+ax,cy+(.28+ly)*.62*sy*1.6*SC,cz+az]});
const sg=(A,B)=>{ep.set([A[0],A[1],A[2],B[0],B[1],B[2]],e);e+=6};for(let m=0;m<3;m++)sg(L[m],L[(m+1)%3]);const lp=(A,B,q)=>[A[0]+(B[0]-A[0])*q,A[1]+(B[1]-A[1])*q,A[2]+(B[2]-A[2])*q];for(let u=1;u<=4;u++)sg(lp(L[0],L[1],u/5),lp(L[2],L[1],u/5))}eg.attributes.position.needsUpdate=true;
let o=0,fo=0;for(let kI=0;kI<N;kI++){const a=kI/N*6.2832+.52,[hx,hz]=rot(Math.cos(a)*.6*sx*SC,Math.sin(a)*.6*sz*SC),hip=[cx+hx,cy-.1*sy*SC,cz+hz];let fx,fy,fz,arch=1,wob=.14,vw=0;
if(mode==='walk'||mode==='idle'){const[rx,rz]=rot(Math.cos(a)*2.7,Math.sin(a)*2.7),ph=phase+(kI%2)*Math.PI+kI*.15,st=Math.sin(ph)*.9*kk,lf=Math.max(0,Math.cos(ph))*.7*kk;fx=x+rx+s*st;fy=y+.05+lf;fz=z+rz+c*st;arch=1.5+lf*1.1;wob=.14+.1*(1-kk)}
else if(mode==='held'){const an=a+t*2.4+kI,len=3.4+Math.sin(t*3+kI)*.5;fx=hip[0]+Math.cos(an)*len;fy=hip[1]+.4+Math.sin(t*3.1+kI*2.1)*1.5;fz=hip[2]+Math.sin(an)*len;arch=0;wob=.4;vw=.5}
else if(mode==='hang'&&anchor){if(kI===0||kI===4){fx=anchor.x+(kI?.3:-.3);fy=anchor.y;fz=anchor.z;arch=0;wob=.06}else{fx=hip[0]+Math.cos(a)*.5;fy=hip[1]-1.9;fz=hip[2]+Math.sin(a)*.5;arch=0;wob=.22}}
else{const[rx,rz]=rot(Math.cos(a)*3.4,Math.sin(a)*3.4);fx=x+rx;fy=y+.05;fz=z+rz;arch=.35;wob=.05}
fx=hip[0]+(fx-hip[0])*(1-ret);fy=hip[1]+(fy-hip[1])*(1-ret);fz=hip[2]+(fz-hip[2])*(1-ret);arch*=1-ret;
let px=-(fz-hip[2]),pz=fx-hip[0];const pl=Math.hypot(px,pz)||1;px/=pl;pz/=pl;
for(let j=0;j<M;j++){const u=j/(M-1),w=Math.sin(t*3.3+kI*1.7+u*7)*wob*u*(1-.35*u),i3=(kI*M+j)*3,ar=arch*Math.pow(Math.sin(Math.PI*u),.8);
const tx=hip[0]+(fx-hip[0])*u+px*w,ty=hip[1]+(fy-hip[1])*u+ar+Math.sin(t*4+kI+u*5)*vw*u,tz=hip[2]+(fz-hip[2])*u+pz*w;
if(!primed||snap||j===0){J[i3]=tx;J[i3+1]=ty;J[i3+2]=tz}else{const r=Math.min(1,dt*(28-19*u));J[i3]+=(tx-J[i3])*r;J[i3+1]+=(ty-J[i3+1])*r;J[i3+2]+=(tz-J[i3+2])*r}}
const wd=.22*(1-ret*.7),sd=(j)=>{const b=(kI*M+j)*3;return[J[b],J[b+1],J[b+2]]};let pl2=null,pr=null,prevL=null,prevR=null;
for(let j=0;j<M;j++){const p0=sd(Math.max(0,j-1)),p1=sd(Math.min(M-1,j+1));let dx=p1[0]-p0[0],dz=p1[2]-p0[2];let sx2=-dz,sz2=dx;const sl=Math.hypot(sx2,sz2);if(sl<.05){sx2=1;sz2=0}else{sx2/=sl;sz2/=sl}
const u=j/(M-1),w=wd*Math.pow(1-u,.8)+.012,p=sd(j),Lp=[p[0]+sx2*w,p[1],p[2]+sz2*w],Rp=[p[0]-sx2*w,p[1],p[2]-sz2*w];
if(prevL){tp.set([...prevL,...Lp,...prevR,...Rp],o);o+=12;tf.set([...prevL,...Lp,...Rp,...prevL,...Rp,...prevR],fo);fo+=18}tp.set([...Lp,...Rp],o);o+=6;prevL=Lp;prevR=Rp}
const pa=sd(M-2),pb=sd(M-1),dl=Math.hypot(pb[0]-pa[0],pb[1]-pa[1],pb[2]-pa[2])||1;tp.set([...pb,pb[0]+(pb[0]-pa[0])/dl*.4,pb[1]+(pb[1]-pa[1])/dl*.4,pb[2]+(pb[2]-pa[2])/dl*.4],o);o+=6}
tg.attributes.position.needsUpdate=true;tf.fill(0,fo);tfg.attributes.position.needsUpdate=true;primed=true;
sh.visible=mode==='walk'||mode==='idle'||mode==='slam';sh.position.set(x,y+.06,z);sh.scale.setScalar((.8+sx*.3)*1.5)}};
})();
