// The five destination zones, each a platform far below the hub (entered by slamming into an entrance well).
(()=>{const T=THREE,C=G.C,W=G.world,ZY=G.ZY,A=G.audio;
const tx=(g,s,h,x,y,z,c=C.lime,o=1,al='center')=>{const m=G.text(s,h,c,o,al);m.position.set(x,y,z);g.add(m);return m};
const flat=(g,s,h,x,z,c=C.lime,al='center')=>{const m=tx(g,s,h,x,.07,z,c,1,al);m.rotation.x=-Math.PI/2;return m};
const use=(i,x,z,r,label,fn)=>G.inter.push({area:i,x:G.O(i).x+x,z,r,kind:'use',label,fn});
const lvl=i=>G.mute[i]?0:Math.min(1,Math.pow(10,G.db[i]/20)*1.3);
const Z=[],SHOWS=[["PACHELBEL'S CANON"]],O2=G.O;
for(let i=0;i<6;i++){const O=G.O(i),g=new T.Group();g.position.set(O.x,ZY,0);g.visible=false;G.scene.add(g);W.zones.push(g);Z.push(g);
const p=[];for(let x=-36;x<=36;x+=4)p.push(x,0,-24,x,0,22);for(let z=-24;z<=22;z+=4)p.push(-36,0,z,36,0,z);
{const p=[];for(let x=-220;x<=220;x+=2)p.push(x,.01,-24,x,.01,170);for(let zz=-24;zz<=170;zz+=2)p.push(-220,.01,zz,220,.01,zz);g.add(G.lineset(p,C.dim,.9))}
const rim=G.box(440,.7,194,C.lime,1);rim.position.set(0,-.35,73);g.add(rim);
{const sc=new T.Group();g.add(sc);(W.zsc=W.zsc||[])[i]=sc;const r=G.rng(i*7+50);let n=0,t=0;while(n<150&&t++<2500){const x=-210+r()*420,zz=-22+r()*190;if(Math.abs(x)<38&&zz<24)continue;n++;const kind=Math.floor(r()*3),e=new T.Group();e.position.set(x,0,zz);
if(kind===0){const h=2+r()*9,k=G.box(1.5+r()*3,h,1.5+r()*3,C.lime,1);k.position.y=h/2;e.add(k)}else if(kind===1){const R=1+r()*2.4,k=G.edges(new T.DodecahedronGeometry(R,0),C.lime,1,20,0xe4e4e4);k.position.y=R*.6;k.scale.y=.7;e.add(k)}else{for(let q=0;q<3;q++){const h=3+r()*6,k=G.box(.9,h,.9,C.lime,1);k.position.set(q*2.2-2.2,h/2,(r()-.5)*2);e.add(k)}}sc.add(e)}}
{const hd=i<5?[G.modes[i].id,G.modes[i].sub]:[SHOWS[i-5][0],'NOW SHOWING'];const hy=39;tx(g,hd[0],hd[0].length>8?2.6:3.4,0,hy,-24);tx(g,hd[1],1.1,0,hy-3,-24,C.cyan,.9)}

W.portalRing(g,0,11,.05,2.2);flat(g,i<5?'HUB':'BACK',.9,0,8.2);
G.inter.push({area:i,x:O.x,z:11,r:2.5,kind:'portal',id:'EXIT',label:i<5?'허브로 돌아가기':'목업 목록으로 돌아가기',dest:i<5?-1:2,from:i})}
const info=(g,rows)=>rows.forEach(([s,h,x,y,col,al])=>tx(g,s,h*1.4,x*1.4,2.25+(y-1.75)*1.4,-24,col===C.cyan?0xbdbdbd:0xffffff,1,al||'left'));
// 0 PROFILE: everything lives on the big screen
info(Z[0],[['OH MINSEO  /  202303099',1.5,-19,17.3],['CORE COMPETENCIES',.9,-19,14.6,C.cyan],
['01 VIDEO ENGINEERING',1.2,-19,12.5],['    + SOUND DESIGN',1.2,-19,10.5],['02 DAW COMPOSITION',1.2,-19,8.5],['03 DAW MIX + MASTER',1.2,-19,6.5],['MASTER TOOL   LOGIC PRO X',.9,-19,4.5,C.cyan],
['HISTORY',.9,7.5,14.6,C.cyan],['2023-PRESENT',.9,7.5,12.7],['BAEKSEOK ARTS',.9,7.5,11.1],['UNIVERSITY',.9,7.5,9.5],['2024.04-2025.10',.85,7.5,7.5],['3RD CORPS BAND',.9,7.5,5.9],['PERCUSSION',.9,7.5,4.3]]);
const lvl2=i=>lvl(i);W.capZ=i=>9+(G.db[i]+48)/54*-18;
const mkMixer=(zi,title,MX=12,ids=[0,1,2,3])=>{const g=Z[zi],O=G.O(zi),ZN=9,ZF=-9;
const pf=G.rect(20,28,C.lime,1);pf.rotation.x=-Math.PI/2;pf.position.set(MX,.06,1);g.add(pf);flat(g,title,.8,MX,-14.6);
ids.forEach((i,j)=>{const x=MX+(j-(ids.length-1)/2)*4.6,f={i,area:zi,x:O.x+x,zmin:ZN,zmax:ZF,lx:x};
g.add(G.lineset([x-.18,.07,ZN,x-.18,.07,ZF,x+.18,.07,ZN,x+.18,.07,ZF,x-.18,.07,ZN,x+.18,.07,ZN,x-.18,.07,ZF,x+.18,.07,ZF],C.lime,1));
const tk=[];for(let k=0;k<=9;k++){const z=ZN+(ZF-ZN)*k/9;tk.push(x-1.7,.07,z,x-.7,.07,z)}g.add(G.lineset(tk,C.cyan,1));
flat(g,G.chName(i,zi,true),.6,x,-11.2);
const cap=G.box(3,.3,2.4,C.lime,1);g.add(cap);const gr=[];for(let k=-4;k<=4;k++)gr.push(-1.4,.16,k*.25,1.4,.16,k*.25);cap.add(G.lineset(gr,C.lime,1));
const led=G.lineset([0,.07,0,0,.07,-1],C.lime,1);led.position.set(x+2,0,ZN);g.add(led);
const db=flat(g,'',.7,x,-12.7);f.cap=cap;f.led=led;f.db=db;f.last=null;G.faders.push(f)});
W.syncMixer()};
W.syncMixer=()=>G.faders.forEach(f=>{f.cap.position.set(f.lx,.2,W.capZ(f.i));const key=G.mute[f.i]?'M':G.db[f.i];if(f.last!==key){f.last=key;G.setText(f.db,G.mute[f.i]?'MUTE':Math.round(G.db[f.i])+' DB',.7,C.lime,1)}});
G.on('mixer',()=>W.syncMixer());
G.zoneTick.push(()=>{if(!G.faders.some(f=>f.area===G.area))return;G.faders.forEach(f=>{if(f.area===G.area){const pp=A.ppm&&A.ppm[f.i];f.led.scale.z=pp!=null?Math.max(.05,(Math.max(-60,pp)+60)/60*18):Math.max(.05,((G.loop||(G.media&&G.media.playing()))?A.pulse[f.i]:0)*lvl(f.i)*18)}})});
// 1 GAME: mixer wall + gameplay monitor
{const g=Z[1];mkMixer(1,'MIXER',12,[4,5,6]);

}
// 2 VIDEO lobby: three posters, each with a floor button that opens its own single-video map (zones 5-7)
{const g=Z[2];SHOWS.forEach(([n],k)=>{const x=-18+k*6;W.portalRing(g,x,-3,.05,2.2);if(n.length>10){const i=n.lastIndexOf(' ');flat(g,n.slice(0,i),.5,x,.2);flat(g,n.slice(i+1),.5,x,1.3)}else flat(g,n,.6,x,.4);G.inter.push({area:2,x:O2(2).x+x,z:-3,r:2.6,kind:'portal',id:'SHOW'+k,label:n+' 맵으로 들어가기',dest:5+k,from:2})})}
[[2,7],[5,11]].forEach(([i,b])=>mkMixer(i,'MIXER',12,[b,b+1,b+2,b+3]));
info(Z[2],[['GENERATIVE PRODUCTION',1.6,-18.5,17.5],['STEP INTO A CIRCLE TO OPEN A SHOW',1.1,-18.5,14,C.cyan],['MAIN PLAYER ON THIS SCREEN  /  SHOWS BEHIND THE CIRCLES',1.1,-18.5,11.8]]);
// 3 CREATIVE: synth slab with pads
{const g=Z[3],O=G.O(3);
mkMixer(3,'MIXER',21);
{const L=-26,t1=tx(g,'RND LOOP LAB',2.6,L,30,-24,0xffffff,1,'left'),mkl=(h,y,col)=>tx(g,'--',h,L,y,-24,col,1,'left'),a1=mkl(1.8,25.5,0xbdbdbd),a2=mkl(1.8,23,0xffffff),a3=mkl(1.8,20.5,0xffffff),a4=mkl(1.8,18,0xffffff);
tx(g,'SUNO PROMPT',1.4,L,13.8,-24,0xbdbdbd,1,'left');const pr=[0,1,2,3].map(i=>mkl(1.35,11.6-i*2,0xffffff));tx(g,'NEW LOOP = RANDOM 4 BARS · SUNO = COPY PROMPT AND OPEN SUNO',1.1,L,4.2,-24,0xbdbdbd,1,'left');
const wrap=(s,n)=>{const o=[];let l='';for(const w of s.split(' ')){if((l+' '+w).trim().length>n){o.push(l);l=w}else l=(l+' '+w).trim()}o.push(l);return o};
G.on('loop',c=>{G.setText(a1,'SEED '+c.seed.toString(16).toUpperCase().padStart(8,'0')+'  '+c.gen,1.8,0xbdbdbd,1,'left');G.setText(a2,c.bpm+' BPM   KEY '+c.key.toUpperCase()+' '+c.scn,1.8,0xffffff,1,'left');G.setText(a3,'MOOD '+c.mood+'   '+c.ins[0],1.8,0xffffff,1,'left');G.setText(a4,'CHORDS '+c.prog.map(d=>d+1).join(' - ')+'   4 BARS',1.8,0xffffff,1,'left');const w=wrap(c.prompt.toUpperCase(),34);pr.forEach((m,i)=>G.setText(m,w[i]||' ',1.35,0xffffff,1,'left'));W.euc(c.seed)})}
{const pg=new T.Group();pg.position.set(-14,0,5);g.add(pg);const b=G.box(5,.3,5,C.lime,1);b.position.y=.15;pg.add(b);flat(g,'NEW LOOP',.9,-14,8.6);
const p={id:'LOOP',eng:-9,x:O.x-14,z:5,y:ZY,r:2.6,g:pg,b,press:0,base:0,fn:()=>A.newLoop()};G.anchors.pads.push(p);G.inter.push({area:3,x:p.x,z:5,r:2.6,kind:'pad',id:'LOOP',label:'엉덩방아로 랜덤 4마디 루프 만들기',pad:p});
const sb=G.rect(8,3.2,C.lime,1);sb.rotation.x=-Math.PI/2;sb.position.set(-14,.07,-4);g.add(sb);flat(g,'SUNO',1.1,-14,-4);use(3,-14,-4,3,'SUNO 프롬프트 복사하고 열기',()=>G.suno())}
flat(g,'SIT ON A PAD + SPACE',.6,0,6.4,C.cyan);
{const pd=(z,t1,t2,label,fn)=>{const sb=G.rect(9,3.2,C.lime,1);sb.rotation.x=-Math.PI/2;sb.position.set(3,.07,z);g.add(sb);flat(g,t1,1,3,z);flat(g,t2,.55,3,z+2.2,C.cyan);use(3,3,z,3,label,fn)};
pd(-4,'EAR GYM','SPACE = OPEN','EAR GYM 귀 훈련 열기',()=>G.trainOpen&&G.trainOpen());pd(-11,'WORKOUT','SPACE = START','오늘의 귀 훈련 워크아웃 시작',()=>G.trainOpen&&G.trainOpen('workout'))}}
// 4 CONTACT: everything lives on the big screen
info(Z[4],[['READY TO CONNECT_',2,-18.5,19.5],['INSTAGRAM',1.1,-18.5,14,C.cyan],['DH._.ALSTJ',1.6,-18.5,11.8],['KAKAOTALK',1.1,-18.5,7.8,C.cyan],['ID: DHALSTJ._.',1.6,-18.5,5.6],['EMAIL',1.1,3,14,C.cyan],['OMS4911 AT',1.6,3,11.8],['GMAIL.COM',1.6,3,9.4],['AI AGENT',1.1,3,6.4,C.cyan],['DOUBLE CLICK AVATAR',.95,3,4.4]]);
{const g=Z[4],sb=G.rect(11,3.6,C.lime,1);sb.rotation.x=-Math.PI/2;sb.position.set(-14,.07,-4);g.add(sb);flat(g,'INSTAGRAM',1.1,-14,-4);flat(g,'SPACE = OPEN',.6,-14,-1.6,C.cyan);use(4,-14,-4,3.2,'인스타그램 열기',()=>G.openLink('https://www.instagram.com/dh._.alstj/'))}
{const g=Z[4],sb=G.rect(11,3.6,C.lime,1);sb.rotation.x=-Math.PI/2;sb.position.set(0,.07,-4);g.add(sb);flat(g,'EMAIL',1.1,0,-4);flat(g,'SPACE = OPEN',.6,0,-1.6,C.cyan);use(4,0,-4,3.2,'메일 보내기',()=>G.openLink('mailto:oms4911@gmail.com'))}
{const g=Z[4],seg=(q,...p)=>{for(let i=0;i+3<p.length;i+=2)q.push(p[i],p[i+1],0,p[i+2],p[i+3],0)},arc=(q,r,cx,cy,a0,a1,n)=>{for(let i=0;i<n;i++){const a=a0+(a1-a0)*i/n,b=a0+(a1-a0)*(i+1)/n;q.push(cx+Math.cos(a)*r,cy+Math.sin(a)*r,0,cx+Math.cos(b)*r,cy+Math.sin(b)*r,0)}};
const ICON={pubg:q=>{arc(q,1.05,0,-.1,0,Math.PI,18);arc(q,.92,0,-.1,.12,Math.PI-.12,16);seg(q,-1.28,-.1,1.28,-.1,-1.22,-.28,1.22,-.28,-1.28,-.1,-1.22,-.28,1.28,-.1,1.22,-.28,0,.95,0,.4);for(let k=0;k<3;k++)seg(q,-.28,.1+k*.14,.28,.1+k*.14);seg(q,-.78,-.28,-.7,-.78,-.4,-1.05,.4,-1.05,.7,-.78,.78,-.28,-.62,-.46,.62,-.46,.62,-.46,.62,-.7,.62,-.7,-.62,-.7,-.62,-.7,-.62,-.46,-.7,-.78,-.9,-.5,.7,-.78,.9,-.5)},
maple:q=>{seg(q,0,1.45,-1.15,-.1,0,1.45,1.15,-.1,-1.15,-.1,1.15,-.1,-1.15,-.1,-1.25,-.28,1.15,-.1,1.25,-.28,-1.25,-.28,1.25,-.28,-.4,-.28,-.4,-1.05,.4,-.28,.4,-1.05,-.4,-1.05,.4,-1.05,-.5,.4,-.2,.55);arc(q,.17,.45,.1,0,6.2832,8);arc(q,.14,-.45,.2,0,6.2832,8);arc(q,.12,0,.75,0,6.2832,8);for(const x of[-.7,-.35,0,.35,.7])seg(q,x*.4,.0,x,-.1)},
lineage:q=>{seg(q,-.85,.9,.85,.9,.85,.9,.85,-.1,.85,-.1,0,-1.05,0,-1.05,-.85,-.1,-.85,-.1,-.85,.9,-.07,1.45,-.07,-.2,.07,1.45,.07,-.2,-.07,1.45,.07,1.45,-.45,.45,.45,.45,0,1.45,0,1.6,-.12,-.2,.12,-.2)},
marble:q=>{const f=(x0,y0,x1,y1)=>seg(q,x0,y0,x1,y1);const A=[-.9,-.75],B=[.35,-.75],C=[.35,.5],D=[-.9,.5],dx=.55,dy=.5;f(...A,...B);f(...B,...C);f(...C,...D);f(...D,...A);f(A[0]+dx,A[1]+dy,B[0]+dx,B[1]+dy);f(B[0]+dx,B[1]+dy,C[0]+dx,C[1]+dy);f(D[0]+dx,D[1]+dy,C[0]+dx,C[1]+dy);f(A[0],A[1],A[0]+dx,A[1]+dy);f(B[0],B[1],B[0]+dx,B[1]+dy);f(C[0],C[1],C[0]+dx,C[1]+dy);f(D[0],D[1],D[0]+dx,D[1]+dy);for(const[px,py]of[[-.45,.05],[-.05,-.35],[-.45,-.35],[-.05,.05],[-.25,-.15]])arc(q,.07,px,py,0,6.2832,6)}};
const pad=(id,x,z,lines,sz,label)=>{const sb=G.rect(11,3.6,C.lime,1);sb.rotation.x=-Math.PI/2;sb.position.set(x,.07,z);g.add(sb);const q=[];ICON[id](q);const ic=G.lineset(q,C.lime,1);ic.rotation.x=-Math.PI/2;ic.position.set(x-3.3,.09,z+.15);ic.scale.setScalar(1.15);g.add(ic);
lines.forEach((s,i)=>flat(g,s,sz,x+2.1,z+(lines.length>1?(i?.62:-.62):0)));flat(g,'SPACE = SWITCH',.6,x,z+2.4,C.cyan);use(4,x,z,3.4,label+' 전환',()=>G.setTheme(G.theme===id?null:id))};
pad('pubg',14,-4,['PUBG'],1.3,'PUBG');pad('maple',-14,3.4,['MAPLESTORY'],.68,'MAPLESTORY');pad('lineage',0,3.4,['LINEAGE'],1.0,'LINEAGE');pad('marble',14,3.4,['MODU','MARBLE'],.85,'MODU MARBLE');
{const x=14,z=-11,sb=G.rect(11,3.6,C.lime,1);sb.rotation.x=-Math.PI/2;sb.position.set(x,.07,z);g.add(sb);const q=[];
seg(q,-1.3,.6,1.3,.6,1.45,.3,1.45,-.45,.4,-.62,.18,-.3,-.18,-.3,-.4,-.62,-1.45,-.45,-1.45,.3,-1.3,.6);arc(q,.36,-.68,0,0,6.2832,12);arc(q,.36,.68,0,0,6.2832,12);seg(q,-1.45,.1,-1.85,.3);seg(q,1.45,.1,1.85,.3);seg(q,-.9,.85,.9,.85);
const ic=G.lineset(q,C.lime,1);ic.rotation.x=-Math.PI/2;ic.position.set(x-3.1,.09,z+.1);ic.scale.setScalar(1.15);g.add(ic);
flat(g,'VR VIEW',1.1,x+2.1,z);flat(g,'SPACE = 1ST PERSON',.6,x,z+2.4,C.cyan);use(4,x,z,3.4,'VR 1인칭 시점 켜기 / 끄기',()=>G.toggleFP())}}
})();
