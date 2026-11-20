// MOCK UP metering to broadcast standards, drawn on the song screen (2D page + 3D wall) and on the 3D fader LEDs.
//  RTA  : 1/3-octave bands (IEC 61260, ISO 266 centres 20 Hz - 20 kHz), dBFS sine-referenced, F time weighting (125 ms) + peak hold.
//  PPM  : sample peak per stem and L/R master, IEC 60268-18 ballistics (instant attack, 20 dB in 1.7 s return), 2 s peak hold.
//  LOUD : ITU-R BS.1770-4 K-weighting, EBU R128 / Tech 3341 momentary 400 ms, short-term 3 s, gated integrated (-70 LUFS abs, -10 LU rel).
(()=>{const A=G.audio,M=G.media;if(!A||!M)return;
const ISO=['20','25','31.5','40','50','63','80','100','125','160','200','250','315','400','500','630','800','1k','1.25k','1.6k','2k','2.5k','3.15k','4k','5k','6.3k','8k','10k','12.5k','16k','20k'];
const NB=ISO.length,FC=ISO.map((_,k)=>1000*Math.pow(2,(k-17)/3)),FALL=20/1.7,HOLD=2,SHORT={'VIOLIN 1':'VN1','VIOLIN 2':'VN2','VIOLA':'VLA','CELLO':'VC'};
const ANA={};fetch('media/manifest.json').then(r=>r.ok?r.json():null).then(m=>{if(m)for(const k in m)if(m[k].analysis)ANA[k]=m[k].analysis}).catch(()=>{});
const db=p=>p>1e-12?10*Math.log10(p):-120;
// Blackman window (the AnalyserNode window) power correction: a full-scale sine reads 0 dBFS in its band
const CORR=(()=>{const N=8192;let s=0;for(let n=0;n<N;n++){const w=.42-.5*Math.cos(2*Math.PI*n/N)+.08*Math.cos(4*Math.PI*n/N);s+=w*w}return 4/(s/N)})();
A.ppm=A.ppm||{};
const meterObj=(an)=>({an,buf:new Float32Array(an.fftSize),pk:-120,hold:-120,ht:0,max:-120});
function reset(r){r.acc=[0,0];r.n=0;r.blocks=[];r.gate=[];r.M=r.S=r.I=-Infinity;r.lt=null;[...r.stem,...r.out].forEach(o=>{o.max=-120;o.hold=-120})}
function setup(s){if(s.mr)return s.mr;if(!A.ctx||!s.routed)return null;const c=A.ctx,r=s.mr={sr:c.sampleRate};
r.sum=c.createGain();
r.stem=s.bi.map(bi=>{const an=c.createAnalyser();an.fftSize=2048;A.bus[bi].connect(an);A.bus[bi].connect(r.sum);return Object.assign(meterObj(an),{bi})});
const sp=c.createChannelSplitter(2);r.sum.connect(sp);r.out=[0,1].map(k=>{const an=c.createAnalyser();an.fftSize=2048;sp.connect(an,k);return meterObj(an)});
r.rta=c.createAnalyser();r.rta.fftSize=8192;r.rta.smoothingTimeConstant=0;r.sum.connect(r.rta);r.fb=new Float32Array(4096);
const bw=c.sampleRate/8192;r.bins=FC.map(f=>{const a=Math.max(1,Math.round(f*Math.pow(2,-1/6)/bw)),b=Math.min(4095,Math.round(f*Math.pow(2,1/6)/bw)-1);return[a,Math.max(a,b)]});
r.band=new Float64Array(NB).fill(1e-12);r.bh=new Float32Array(NB).fill(-120);r.bht=new Float32Array(NB);
// K-weighting: stage 1 high shelf (+4 dB above ~1.7 kHz), stage 2 RLB high-pass (38 Hz)
const hs=c.createBiquadFilter();hs.type='highshelf';hs.frequency.value=1681.97;hs.gain.value=4;
const hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=38.14;hp.Q.value=.5;
r.sum.connect(hs);hs.connect(hp);const ks=c.createChannelSplitter(2);hp.connect(ks);
r.k=[0,1].map(k=>{const an=c.createAnalyser();an.fftSize=2048;ks.connect(an,k);return{an,buf:new Float32Array(2048)}});
reset(r);return r}
M.meterReset=id=>{const s=M.sets[id];if(s&&s.mr)reset(s.mr)};
function peakOf(o){o.an.getFloatTimeDomainData(o.buf);let m=0;const b=o.buf;for(let i=0;i<b.length;i++){const v=b[i]<0?-b[i]:b[i];if(v>m)m=v}return m>1e-6?20*Math.log10(m):-120}
function ball(o,v,dt){o.pk=v>=o.pk?v:Math.max(-120,o.pk-FALL*dt);if(v>=o.hold){o.hold=v;o.ht=0}else{o.ht+=dt;if(o.ht>HOLD)o.hold=Math.max(o.pk,o.hold-FALL*dt)}if(v>o.max)o.max=v}
const mean=a=>a.reduce((p,c)=>p+c,0)/a.length,LU=p=>-.691+db(p);
function update(s,dt){const r=setup(s);if(!r)return;const live=s.on&&!s.demo,mm=s.a.find((a,i)=>s.has[i]);
if(live&&mm){const ct=mm.currentTime;if(r.lt!=null&&(ct<r.lt-.5||ct>r.lt+2))reset(r);r.lt=ct}
for(const o of[...r.stem,...r.out])ball(o,live?peakOf(o):-120,dt);
r.stem.forEach(o=>{A.ppm[o.bi]=live||o.pk>-60?o.pk:null});
const a=1-Math.exp(-dt/.125);
if(live){const n=Math.min(2048,Math.max(1,Math.round(dt*r.sr)));
r.k.forEach((o,k)=>{o.an.getFloatTimeDomainData(o.buf);let q=0;for(let i=2048-n;i<2048;i++)q+=o.buf[i]*o.buf[i];r.acc[k]+=q});r.n+=n;
if(r.n>=r.sr*.1){r.blocks.push((r.acc[0]+r.acc[1])/r.n);r.acc=[0,0];r.n=0;if(r.blocks.length>30)r.blocks.shift();
const b=r.blocks;r.M=b.length>=4?LU(mean(b.slice(-4))):-Infinity;r.S=b.length>=30?LU(mean(b)):-Infinity;
if(b.length>=4){const p=mean(b.slice(-4));if(LU(p)>-70)r.gate.push(p);if(r.gate.length){const rel=LU(mean(r.gate))-10,g=r.gate.filter(q=>LU(q)>rel);r.I=g.length?LU(mean(g)):-Infinity}}}
r.rta.getFloatFrequencyData(r.fb)}
for(let b=0;b<NB;b++){let p=1e-12;if(live){const[i0,i1]=r.bins[b];p=0;for(let i=i0;i<=i1;i++)p+=Math.pow(10,r.fb[i]/10);p=p*CORR||1e-12}
r.band[b]+=(p-r.band[b])*a;const d=db(r.band[b]);if(d>=r.bh[b]){r.bh[b]=d;r.bht[b]=0}else{r.bht[b]+=dt;if(r.bht[b]>1.5)r.bh[b]=Math.max(d,r.bh[b]-FALL*dt)}}
if(!live&&r.blocks.length){r.M=r.S=-Infinity;r.blocks=[];r.acc=[0,0];r.n=0}}
G.ticks.push(dt=>{for(const id in M.sets){const s=M.sets[id];if(s.title&&s.routed)update(s,dt)}});
// ---------- drawing (1280 x 720 canvas) ----------
const F=(w,px,fam)=>`${w} ${px}px ${fam==='d'?'"Chakra Petch","Noto Sans KR",sans-serif':'"JetBrains Mono",ui-monospace,monospace'}`;
const fmt=t=>{t=Math.max(0,t||0);return String(Math.floor(t/60)).padStart(2,'0')+':'+String(Math.floor(t%60)).padStart(2,'0')};
const f1=v=>isFinite(v)&&v>-119?(v>0?'+':'')+v.toFixed(1):'--.-';
G.meterDraw=(s,cv,t,m)=>{if(!s.title)return false;const r=s.mr,x=cv.getContext('2d'),W=1280,on=s.on&&!s.demo,ana=ANA[s.id]||{};
x.fillStyle='#0a0a0a';x.fillRect(0,0,W,720);x.strokeStyle='#fff';x.lineWidth=2;x.strokeRect(24,24,W-48,672);x.textBaseline='alphabetic';
// header
x.fillStyle='#fff';x.textAlign='left';x.font=F(700,50,'d');x.fillText(s.title.toUpperCase(),56,88);
x.fillStyle='#9a9a9a';x.font=F(500,15);const L=s.labs.map((n,k)=>s.has[k]?(SHORT[n]||n):null).filter(Boolean);x.fillText('MOCK UP · STRING STEMS · '+L.join(' + '),400,86);
x.textAlign='right';x.font=F(600,20);const ts=fmt(m&&m.currentTime)+' / '+fmt(m&&isFinite(m.duration)?m.duration:0),tw=x.measureText(ts).width,stt=on?'NOW PLAYING':'PRESS PLAY',sx=W-56-tw-30;x.fillStyle='#fff';x.fillText(ts,W-56,86);
x.fillStyle=on?'#fff':'#9a9a9a';x.fillText(stt,sx,86);if(on&&Math.floor(t*2)%2===0){x.beginPath();x.arc(sx-x.measureText(stt).width-16,79,6,0,6.3);x.fill()}
const pr=m&&isFinite(m.duration)&&m.duration?m.currentTime/m.duration:0;x.fillStyle='#3a3a3a';x.fillRect(56,106,W-112,3);x.fillStyle='#fff';x.fillRect(56,106,(W-112)*pr,3);
// RTA
const X0=104,X1=836,Y0=158,Y1=516,TOP=0,BOT=-84,yR=d=>Y0+(TOP-Math.max(BOT,Math.min(TOP,d)))/(TOP-BOT)*(Y1-Y0),bw=(X1-X0)/NB;
x.textAlign='left';x.fillStyle='#bdbdbd';x.font=F(600,15);x.fillText('RTA · 1/3 OCT · IEC 61260 · dBFS (SINE = 0) · F 125 ms',56,142);
x.font=F(500,14);x.textAlign='right';x.lineWidth=1;for(let d=0;d>=BOT;d-=12){const y=yR(d);x.strokeStyle=d===0?'#6a6a6a':'#2c2c2c';x.beginPath();x.moveTo(X0,y);x.lineTo(X1,y);x.stroke();x.fillStyle='#9a9a9a';x.fillText(String(d),X0-10,y+5)}
for(let b=0;b<NB;b++){const bx=X0+b*bw+2,d=r?db(r.band[b]):-120,y=yR(d);if(d>BOT){x.fillStyle='#e6e6e6';x.fillRect(bx,y,bw-4,Y1-y)}
const h=r?r.bh[b]:-120;if(h>BOT){x.fillStyle='#fff';x.fillRect(bx,yR(h)-1,bw-4,2)}}
if(ana.ltas){x.strokeStyle='#8a8a8a';x.lineWidth=2;x.setLineDash([6,5]);x.beginPath();ana.ltas.forEach((d,b)=>{const px=X0+(b+.5)*bw,py=yR(d);b?x.lineTo(px,py):x.moveTo(px,py)});x.stroke();x.setLineDash([]);x.fillStyle='#8a8a8a';x.textAlign='right';x.font=F(600,13);x.fillText('- - FILE AVERAGE (LTAS)',X1,Y0+16)}
x.fillStyle='#9a9a9a';x.textAlign='center';x.font=F(500,14);[2,5,8,11,14,17,20,23,26,29].forEach(b=>x.fillText(ISO[b],X0+(b+.5)*bw,Y1+22));
x.textAlign='right';x.fillText('Hz',X1,Y1+40);
// PPM
const PY0=158,PY1=516,yP=d=>PY0+(-Math.max(-60,Math.min(0,d)))/60*(PY1-PY0),bars=[];r?r.stem.forEach((o,i)=>bars.push([L[i]||'CH'+(i+1),o])):L.forEach(n=>bars.push([n,null]));
bars.push(['L',r&&r.out[0]],['R',r&&r.out[1]]);
x.textAlign='left';x.fillStyle='#bdbdbd';x.font=F(600,15);x.fillText('PEAK dBFS · IEC 60268-18',880,142);
x.textAlign='right';x.font=F(500,13);x.lineWidth=1;[0,-3,-6,-9,-12,-18,-24,-30,-40,-50,-60].forEach(d=>{const y=yP(d);x.fillStyle='#9a9a9a';x.fillText(String(d),912,y+4);x.strokeStyle='#2c2c2c';x.beginPath();x.moveTo(918,y);x.lineTo(1224,y);x.stroke()});
x.strokeStyle='#fff';x.setLineDash([4,4]);x.beginPath();x.moveTo(918,yP(-1));x.lineTo(1224,yP(-1));x.stroke();x.setLineDash([]);
bars.forEach(([n,o],i)=>{const bx=928+i*46+(i>=bars.length-2?16:0),w=28;x.strokeStyle='#4a4a4a';x.strokeRect(bx-.5,PY0-.5,w+1,PY1-PY0+1);
if(o){const y=yP(o.pk);x.fillStyle='#f0f0f0';for(let yy=PY1-4;yy>=y;yy-=5)x.fillRect(bx+2,yy,w-4,4);if(o.hold>-60){x.fillStyle='#fff';x.fillRect(bx,yP(o.hold)-1,w,3)}
if(o.max>-1){x.fillStyle='#fff';x.fillRect(bx,PY0-12,w,7)}}
x.textAlign='center';x.fillStyle='#fff';x.font=F(600,14);x.fillText(n,bx+w/2,PY1+22);x.fillStyle='#9a9a9a';x.font=F(500,12);x.fillText(o?f1(o.hold):'--.-',bx+w/2,PY1+40)});
// loudness
x.strokeStyle='#4a4a4a';x.beginPath();x.moveTo(56,566);x.lineTo(W-56,566);x.stroke();
x.textAlign='left';x.fillStyle='#bdbdbd';x.font=F(600,15);x.fillText('LOUDNESS · ITU-R BS.1770-4 · EBU R128',56,594);
const val=(lab,v,u,px)=>{x.fillStyle='#9a9a9a';x.font=F(600,16);x.fillText(lab,px,632);x.fillStyle='#fff';x.font=F(700,30,'d');x.fillText(f1(v),px+(lab.length*11+8),634);x.fillStyle='#9a9a9a';x.font=F(500,13);x.fillText(u,px+(lab.length*11+8)+86,634)};
const tp=r?Math.max(r.out[0].max,r.out[1].max):-120;
val('M',r?r.M:-Infinity,'LUFS',56);val('S',r?r.S:-Infinity,'LUFS',220);val('I',r?r.I:-Infinity,'LUFS',384);val('PEAK',tp,'dBFS',548);
const LX0=820,LX1=W-56,LY=612,lx=d=>LX0+(Math.max(-40,Math.min(0,d))+40)/40*(LX1-LX0);
x.strokeStyle='#4a4a4a';x.strokeRect(LX0,LY,LX1-LX0,18);if(r&&isFinite(r.S)){x.fillStyle='#e6e6e6';x.fillRect(LX0+1,LY+1,lx(r.S)-LX0-1,16)}
if(r&&isFinite(r.M)){x.fillStyle='#fff';x.fillRect(lx(r.M)-1,LY-4,3,26)}
[[-23,'R128 -23'],[-14,'STREAM -14']].forEach(([d,n])=>{x.strokeStyle='#fff';x.setLineDash([3,3]);x.beginPath();x.moveTo(lx(d),LY-6);x.lineTo(lx(d),LY+24);x.stroke();x.setLineDash([]);x.fillStyle='#bdbdbd';x.font=F(500,12);x.textAlign='center';x.fillText(n,lx(d),LY+40)});
x.textAlign='left';x.fillStyle='#9a9a9a';x.font=F(500,12);x.fillText('-40',LX0,LY+40);x.textAlign='right';x.fillText('0 LUFS',LX1,LY+40);
if(ana.mix){const a=ana.mix,st=ana.stems||[];x.textAlign='left';x.fillStyle='#8a8a8a';x.font=F(500,14);
x.fillText(`FILE ANALYSIS  MIX I ${a.I.toFixed(1)} LUFS · LRA ${a.LRA.toFixed(1)} LU · TP ${a.TP.toFixed(1)} dBTP   |   `+st.map((v,i)=>`${L[i]||''} ${v.I.toFixed(1)}`).join(' · ')+' LUFS',56,676)}
return true};
})();
