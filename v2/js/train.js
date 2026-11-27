// CREATIVE · EAR GYM: ear training built on published listening-test practice.
// - Frequencies: ISO 266 preferred octave / 1/3-octave centres (IEC 61260-1 bands).
// - Level matching for A/B judgements: ITU-R BS.1770-4 K-weighted loudness, so "louder" can't give the answer away.
// - Protocol: blind, randomised forced choice (as in ITU-R BS.1116-3 / ABX practice); chance level is shown.
// - Threshold test: adaptive 2-down/1-up staircase (Levitt 1971) -> 70.7 % point, mean of the last 6 reversals.
// - Statistics: exact one-sided binomial test per session; Wilson 95 % interval per skill.
(()=>{const $=id=>document.getElementById(id),A=G.audio,root=document.querySelector('[data-train]');if(!root)return;
const PAGE=3,KEY='drop-train-v2',blank=()=>({xp:0,best:{},lvl:{},cat:{},days:[],rounds:0,jnd:[],cal:false});
const S=(()=>{try{return Object.assign(blank(),JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){return blank()}})();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const dstr=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'),today=()=>dstr(new Date());
const CATS=[['EQ','EQUALIZATION'],['DYN','DYNAMICS'],['SPC','SPACE & TIME'],['QLT','QUALITY']];
const fk=f=>f>=1000?(f/1000)+' kHz':f+' Hz',sgn=v=>(v>0?'+':'')+v,pick=a=>a[Math.random()*a.length|0];
// ISO 266 preferred frequencies
const OCT=[125,250,500,1000,2000,4000,8000],THIRD=[125,250,500,1000,2000,3150,4000,6300,8000];
// ---------- statistics ----------
const lnC=(n,k)=>{let s=0;for(let i=1;i<=k;i++)s+=Math.log(n-k+i)-Math.log(i);return s};
const binomTail=(c,n,p)=>{let t=0;for(let k=c;k<=n;k++)t+=Math.exp(lnC(n,k)+k*Math.log(p)+(n-k)*Math.log(1-p));return Math.min(1,t)};
const wilson=(c,n,z=1.96)=>{if(!n)return[0,0];const p=c/n,d=1+z*z/n,m=(p+z*z/(2*n))/d,h=z*Math.sqrt(p*(1-p)/n+z*z/(4*n*n))/d;return[Math.max(0,m-h),Math.min(1,m+h)]};
const pfmt=p=>p<.001?'p < 0.001':'p = '+p.toFixed(3);
// ---------- games ----------
const bq=(ac,type,f,gain,Q)=>{const n=ac.createBiquadFilter();n.type=type;n.frequency.value=f;if(gain!=null)n.gain.value=gain;if(Q!=null)n.Q.value=Q;return n};
const eqGame=(freqs,gainOf,Q,q)=>lv=>{const fs=typeof freqs==='function'?freqs(lv):freqs,ans=Math.random()*fs.length|0,gn=gainOf(lv);
return{q,opts:fs.map(fk),ans,kind:'id',wire(ac,inp,a,b,N){inp.connect(a);const f=bq(ac,'peaking',fs[ans],gn,Q);N.push(f);inp.connect(f);f.connect(b);this.curve=[f]},reveal:fk(fs[ans])+' '+sgn(gn)+' dB · Q '+Q}};
const GAMES=[
{id:'peak',name:'PEAK HUNT',cat:'EQ',ko:'부스트된 주파수 대역을 찾아요 (ISO 266 중심 주파수)',icon:'M2 26 H16 C20 26 21 6 24 6 C27 6 28 26 32 26 H46',
 build:eqGame(lv=>lv<3?OCT:THIRD,lv=>[18,15,12][lv-1],1.4,'B에서 부스트된 주파수는?')},
{id:'cut',name:'CUT FINDER',cat:'EQ',ko:'깎여 나간 주파수 대역을 찾아요',icon:'M2 6 H16 C20 6 21 26 24 26 C27 26 28 6 32 6 H46',
 build:eqGame(OCT,lv=>[-30,-24,-18][lv-1],1.6,'B에서 깎인 주파수는?')},
{id:'bass',name:'LOW END',cat:'EQ',ko:'50–400 Hz 저역 부스트를 찾아요 (1/3 옥타브)',icon:'M2 8 C8 8 10 26 18 26 H46',
 build:eqGame(lv=>lv<2?[50,100,200,400]:[50,80,125,200,315,400],lv=>[18,15,12][lv-1],1.8,'B에서 부스트된 저역 주파수는?')},
{id:'filter',name:'FILTER ID',cat:'EQ',ko:'어떤 필터가 걸렸는지 맞혀요',icon:'M2 10 H24 C32 10 34 26 46 30',
 build(lv){const T=lv<2?[['lowpass','LOW-PASS'],['highpass','HIGH-PASS'],['bandpass','BAND-PASS'],['notch','NOTCH']]:[['lowpass','LOW-PASS'],['highpass','HIGH-PASS'],['bandpass','BAND-PASS'],['notch','NOTCH'],['lowshelf','LOW SHELF'],['highshelf','HIGH SHELF']];
 const ans=Math.random()*T.length|0,f=pick([500,630,800,1000,1250,1600,2000,2500,3150]),sh=[18,15,12][lv-1],t=T[ans][0];
 return{q:'B에 걸린 필터 종류는?',opts:T.map(x=>x[1]),ans,kind:'id',wire(ac,inp,a,b,N){inp.connect(a);const n=bq(ac,t,f,/shelf/.test(t)?sh:null,t==='bandpass'?.9:t==='notch'?1.2:.8);N.push(n);inp.connect(n);n.connect(b);this.curve=[n]},reveal:T[ans][1]+' @ '+fk(f)}}},
{id:'level',name:'DB STEP',cat:'DYN',ko:'볼륨이 몇 dB 바뀌었는지 맞혀요',icon:'M2 26 H14 V18 H26 V10 H38 V4 H46',
 build(lv){const st=[[-6,-3,3,6],[-6,-3,-2,2,3,6],[-3,-2,-1,1,2,3]][lv-1],ans=Math.random()*st.length|0;
 return{q:'A와 비교해 B의 볼륨 변화는?',opts:st.map(v=>sgn(v)+' dB'),ans,kind:'id',wire(ac,inp,a,b,N){const g=ac.createGain(),r=ac.createGain();g.gain.value=Math.pow(10,st[ans]/20)*.7;r.gain.value=.7;N.push(g,r);inp.connect(r);r.connect(a);inp.connect(g);g.connect(b)},reveal:sgn(st[ans])+' dB'}}},
{id:'jnd',name:'LEVEL JND',cat:'DYN',src:'noise',adaptive:true,ko:'적응형 계단법으로 내 음량 변별 역치(JND)를 dB로 측정해요',icon:'M2 28 H10 V20 H18 V24 H26 V16 H34 V19 H46',
 build(lv,ses){const d=ses.st.d,ans=Math.random()<.5?0:1;
 return{q:'둘 중 더 큰 소리는? (차이 '+d.toFixed(2)+' dB)',opts:['A','B'],ans,kind:'ab',wire(ac,inp,a,b,N){const ga=ac.createGain(),gb=ac.createGain(),up=Math.pow(10,d/20)*.6;ga.gain.value=ans===0?up:.6;gb.gain.value=ans===1?up:.6;N.push(ga,gb);inp.connect(ga);ga.connect(a);inp.connect(gb);gb.connect(b)},reveal:(ans?'B':'A')+' 가 '+d.toFixed(2)+' dB 더 큼'}}},
{id:'comp',name:'SQUEEZE A/B',cat:'DYN',ko:'BS.1770 라우드니스를 맞춘 두 소리 중 압축된 쪽을 골라요',icon:'M2 30 L22 10 L46 4',
 build(lv){const ans=Math.random()<.5?0:1,th=[-38,-30,-24][lv-1],ra=[12,6,3.5][lv-1];
 return{q:'라우드니스는 같아요. 컴프레서가 걸린 쪽은?',opts:['A','B'],ans,kind:'ab',match:true,wire(ac,inp,a,b,N){const c=ac.createDynamicsCompressor();c.threshold.value=th;c.ratio.value=ra;c.knee.value=4;c.attack.value=.004;c.release.value=.12;N.push(c);inp.connect(c);c.connect(ans?b:a);inp.connect(ans?a:b)},reveal:(ans?'B':'A')+' · '+th+' dB / '+ra+':1'}}},
{id:'pan',name:'PAN SPOT',cat:'SPC',ko:'소리의 좌우 위치를 맞혀요',icon:'M4 16 H44 M24 10 V22 M10 16 m-3 0 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0',
 build(lv){const P=[[-1,-.5,0,.5,1],[-1,-.66,-.33,0,.33,.66,1],[-1,-.75,-.5,-.25,0,.25,.5,.75,1]][lv-1],lab=v=>v===0?'C':(v<0?'L':'R')+Math.round(Math.abs(v)*100),ans=Math.random()*P.length|0;
 return{q:'A는 가운데예요. B의 좌우 위치는?',opts:P.map(lab),ans,kind:'id',wire(ac,inp,a,b,N){const m=ac.createGain();m.channelCount=1;m.channelCountMode='explicit';m.channelInterpretation='speakers';const p=ac.createStereoPanner();p.pan.value=P[ans];N.push(m,p);inp.connect(m);m.connect(a);m.connect(p);p.connect(b)},reveal:lab(P[ans])}}},
{id:'delay',name:'ECHO TIME',cat:'SPC',ko:'딜레이 시간을 ms 단위로 맞혀요',src:'drums',icon:'M6 28 V6 M20 28 V14 M34 28 V20 M2 28 H46',
 build(lv){const T=[[80,160,320,640],[60,120,200,300,450,600],[40,80,120,160,240,320,400,500]][lv-1],ans=Math.random()*T.length|0;
 return{q:'B에 걸린 딜레이 시간은?',opts:T.map(v=>v+' ms'),ans,kind:'id',wire(ac,inp,a,b,N){inp.connect(a);const d=ac.createDelay(1.5);d.delayTime.value=T[ans]/1000;const w=ac.createGain();w.gain.value=.6;N.push(d,w);inp.connect(b);inp.connect(d);d.connect(w);w.connect(b)},reveal:T[ans]+' ms'}}},
{id:'width',name:'WIDTH SENSE',cat:'SPC',ko:'스테레오 폭이 얼마인지 맞혀요 (M/S)',icon:'M4 16 H44 M4 16 L10 10 M4 16 L10 22 M44 16 L38 10 M44 16 L38 22',
 build(lv){const W=[[0,100,200],[0,50,100,150,200],[0,25,50,75,100,125,150]][lv-1],ans=Math.random()*W.length|0;
 return{q:'A는 원래 폭(100%)이에요. B의 스테레오 폭은?',opts:W.map(v=>v===0?'MONO':v+'%'),ans,kind:'id',wire(ac,inp,a,b,N){inp.connect(a);const w=W[ans]/100,sp=ac.createChannelSplitter(2),mg=ac.createChannelMerger(2),k1=(1+w)/2,k2=(1-w)/2,gs=[k1,k2,k2,k1].map(v=>{const g=ac.createGain();g.gain.value=v;return g});
 N.push(sp,mg,...gs);inp.connect(sp);sp.connect(gs[0],0);gs[0].connect(mg,0,0);sp.connect(gs[1],1);gs[1].connect(mg,0,0);sp.connect(gs[2],0);gs[2].connect(mg,0,1);sp.connect(gs[3],1);gs[3].connect(mg,0,1);mg.connect(b)},reveal:W[ans]===0?'MONO':W[ans]+'%'}}},
{id:'dist',name:'GRIT A/B',cat:'QLT',ko:'BS.1770 라우드니스를 맞춘 두 소리 중 왜곡된 쪽을 골라요',icon:'M2 16 C6 4 10 4 12 6 H18 C20 4 22 28 24 26 H30 C32 28 34 4 36 6 H42 L46 16',
 build(lv){const ans=Math.random()<.5?0:1,k=[9,4,2.2][lv-1];
 return{q:'라우드니스는 같아요. 디스토션이 걸린 쪽은?',opts:['A','B'],ans,kind:'ab',match:true,wire(ac,inp,a,b,N){const ws=ac.createWaveShaper(),n=2048,c=new Float32Array(n),t=Math.tanh(k);for(let i=0;i<n;i++){const x=i/(n-1)*2-1;c[i]=Math.tanh(k*x)/t}ws.curve=c;ws.oversample='4x';const pre=ac.createGain();pre.gain.value=1.6;N.push(ws,pre);inp.connect(pre);pre.connect(ws);ws.connect(ans?b:a);inp.connect(ans?a:b)},reveal:(ans?'B':'A')+' · drive '+k}}}];
const GI=Object.fromEntries(GAMES.map(g=>[g.id,g]));
const BADGES=[['peak','EQ EAR','PEAK HUNT 80%+'],['level','DB SENSE','DB STEP 80%+'],['comp','COMP EYE','SQUEEZE A/B 80%+'],['filter','FILTER PRO','FILTER ID 80%+'],['jnd','1 dB EAR','LEVEL JND ≤ 1 dB']];
const badgeOn=id=>id==='jnd'?S.jnd.some(j=>j.t<=1):(S.best[id]||0)>=80;
// ---------- stats ----------
const lvOf=id=>S.lvl[id]||1,level=()=>Math.floor(Math.sqrt(S.xp/60))+1,nextXp=l=>l*l*60;
const streak=()=>{const set=new Set(S.days);let d=new Date(),n=0;if(!set.has(dstr(d)))d.setDate(d.getDate()-1);while(set.has(dstr(d))){n++;d.setDate(d.getDate()-1)}return n};
const catPct=c=>{const v=S.cat[c];return v&&v.n?v.c/v.n:0};
const bestJnd=()=>S.jnd.length?Math.min(...S.jnd.map(j=>j.t)):null;
const workoutIds=()=>{const r=G.rng(+today().replace(/-/g,'')),o=[];for(const c of['EQ','DYN','SPC']){const p=GAMES.filter(g=>g.cat===c&&!g.adaptive);o.push(p[r()*p.length|0].id)}const rest=GAMES.filter(g=>!g.adaptive&&!o.includes(g.id));o.push(rest[r()*rest.length|0].id);return o};
G.trainStats=()=>({level:level(),xp:S.xp,streak:streak(),rounds:S.rounds,today:S.days.includes(today()),cats:CATS.map(([c,n])=>[n,catPct(c)])});
// ---------- audio engine ----------
const MS={strings:['../media/mock-violin1.mp3',2],ambient:['../media/game-music.mp3',3]},SRCN={strings:'STRINGS',ambient:'DARK AMBIENT',noise:'PINK NOISE',drums:'DRUMS'};
let els={},ac=null,inp,out,ana,gA,gB,tA,tB,mA,mB,bufNode=null,srcG=null,src='strings',playing=false,listen='B',N=[],R=null,vol=.8,matchOn=false,bufs={};
// K-weighting (ITU-R BS.1770-4): high shelf +4 dB @ 1681 Hz, high-pass 38 Hz, both ahead of the loudness meter
const kw=(ac,node)=>{const s=bq(ac,'highshelf',1681.97,3.9998,null),h=bq(ac,'highpass',38.135,null,.5003);node.connect(s);s.connect(h);return h};
function ensure(){A.init();ac=A.ctx;if(out)return;inp=ac.createGain();out=ac.createGain();out.gain.value=vol;const lim=ac.createDynamicsCompressor();lim.threshold.value=-2;lim.knee.value=0;lim.ratio.value=20;lim.attack.value=.001;lim.release.value=.08;ana=ac.createAnalyser();ana.fftSize=8192;ana.smoothingTimeConstant=.8;out.connect(lim);lim.connect(ana);ana.connect(ac.destination);
const mk=()=>{const t=ac.createGain(),g=ac.createGain(),m=ac.createAnalyser();m.fftSize=4096;kw(ac,t).connect(m);t.connect(g);g.connect(out);return[t,g,m]};[tA,gA,mA]=mk();[tB,gB,mB]=mk();
const sr=ac.sampleRate;{const n=sr*6,b=ac.createBuffer(2,n,sr);for(let ch=0;ch<2;ch++){const d=b.getChannelData(ch);let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;for(let i=0;i<n;i++){const w=Math.random()*2-1;b0=.99886*b0+w*.0555179;b1=.99332*b1+w*.0750759;b2=.969*b2+w*.153852;b3=.8665*b3+w*.3104856;b4=.55*b4+w*.5329522;b5=-.7616*b5-w*.016898;d[i]=(b0+b1+b2+b3+b4+b5+b6+w*.5362)*.06;b6=w*.115926}}bufs.noise=b}
{const L=2.4,n=Math.round(sr*L),b=ac.createBuffer(2,n,sr),D=[b.getChannelData(0),b.getChannelData(1)],add=(t0,f)=>{const s=Math.round(t0*sr);for(let i=0;i<sr*.6&&s+i<n;i++){const v=f(i/sr);D[0][s+i]+=v;D[1][s+i]+=v}};
[0,1.2].forEach(t=>add(t,x=>Math.sin(2*Math.PI*(45*x+2*(1-Math.exp(-x*30))))*Math.exp(-x*9)*.8));[.6,1.8].forEach(t=>add(t,x=>(Math.random()*2-1)*Math.exp(-x*22)*.45+Math.sin(2*Math.PI*190*x)*Math.exp(-x*30)*.3));
let prev=0;for(let k=0;k<16;k++)add(k*.15,x=>{const w=Math.random()*2-1,v=(w-prev)*Math.exp(-x*(k%2?120:60))*.22;prev=w;return v});bufs.drums=b}}
function el(k){if(!els[k]){const a=new Audio(MS[k][0]);a.loop=true;a.preload='auto';els[k]={a,n:ac.createMediaElementSource(a)}}return els[k]}
function stopSrc(){for(const k in els){try{els[k].a.pause()}catch(e){}try{els[k].n.disconnect()}catch(e){}}if(bufNode){try{bufNode.stop()}catch(e){}bufNode.disconnect();bufNode=null}if(srcG){srcG.disconnect();srcG=null}}
function startSrc(){stopSrc();srcG=ac.createGain();srcG.connect(inp);if(MS[src]){const e=el(src),m=e.a;srcG.gain.value=MS[src][1];e.n.connect(srcG);if(m.duration>40&&isFinite(m.duration))m.currentTime=10+Math.random()*(m.duration-40);m.play().catch(()=>{})}else{bufNode=ac.createBufferSource();bufNode.buffer=bufs[src];bufNode.loop=true;bufNode.connect(srcG);bufNode.start()}}
function stopOthers(){A.setLoop(false);const m=G.media;if(m&&m.sets)for(const id in m.sets)if(m.sets[id].on)m.toggle(id)}
function setPlay(on){ensure();if(on){stopOthers();ac.resume();startSrc()}else stopSrc();playing=on;ui.play()}
function setListen(w){listen=w;if(!ac)return;const t=ac.currentTime;gA.gain.setTargetAtTime(w==='A'?1:0,t,.012);gB.gain.setTargetAtTime(w==='B'?1:0,t,.012);ui.ab()}
let ra=0,rb=0;
function wireRound(){ensure();N.forEach(n=>{try{n.disconnect()}catch(e){}});N=[];try{inp.disconnect()}catch(e){}for(const t of[tA,tB]){t.gain.cancelScheduledValues(0);t.gain.setValueAtTime(1,ac.currentTime)}ra=rb=0;inp.gain.value=ses&&ses.game.cat==='EQ'?.35:1;R.wire(ac,inp,tA,tB,N);matchOn=!!R.match;setListen(R.kind==='ab'?'A':'B')}
// K-weighted loudness match (slow, so it never pumps): B follows A
const tb=new Float32Array(4096),msq=an=>{an.getFloatTimeDomainData(tb);let s=0;for(let i=0;i<tb.length;i++)s+=tb[i]*tb[i];return s/tb.length};
G.ticks.push(dt=>{if(!ac||!playing||!matchOn)return;const x=msq(mA),y=msq(mB)/Math.max(1e-6,tB.gain.value*tB.gain.value),k=Math.min(1,dt*1.2);ra+=(x-ra)*k;rb+=(y-rb)*k;if(ra>1e-8&&rb>1e-8)tB.gain.setTargetAtTime(Math.max(.2,Math.min(5,Math.sqrt(ra/rb))),ac.currentTime,.3)});
const lufsGap=()=>ra>1e-8&&rb>1e-8?Math.abs(10*Math.log10(ra/(rb*tB.gain.value*tB.gain.value))):null;
// ---------- listening check ----------
function checkTone(which){ensure();stopOthers();ac.resume();setPlay(false);const s=ac.createBufferSource(),g=ac.createGain(),p=ac.createStereoPanner();s.buffer=bufs.noise;p.pan.value=which==='L'?-1:which==='R'?1:0;g.gain.value=Math.pow(10,-20/20)/.18*vol;s.connect(g);g.connect(p);p.connect(ac.destination);s.start();s.stop(ac.currentTime+(which==='C'?4:1.2));
if(which==='C'){S.cal=true;save();G.toast('기준 핑크 노이즈 재생 중 · 편하게 대화하는 정도(약 70 dB SPL)로 맞추고 그대로 두세요.')}}
// ---------- session ----------
let ses=null;
function startGame(id,opt={}){const g=GI[id];ses=Object.assign(ses&&opt.keep?ses:{},{game:g,round:0,rounds:g.adaptive?60:(opt.rounds||10),correct:0,lv:lvOf(id),trials:[]});if(g.adaptive)ses.st={d:6,step:2,run:0,dir:0,rev:[]};src=g.src||'strings';view('game');nextRound();if(!playing)setPlay(true)}
function nextRound(){ses.round++;ses.answered=false;R=ses.game.build(ses.lv,ses);R.curve=null;wireRound();ui.round()}
function answer(i){if(!ses||ses.answered)return;ses.answered=true;const ok=i===R.ans;if(ok)ses.correct++;ses.trials.push(ok);const c=ses.game.cat,v=S.cat[c]||(S.cat[c]={c:0,n:0});v.n++;if(ok)v.c++;S.rounds++;if(ok)S.xp+=10*ses.lv;
if(ses.game.adaptive)stair(ok);save();ui.answered(i,ok);A.sfx&&A.sfx(ok?'blip':'tab')}
// Levitt (1971) transformed up-down: 2 correct in a row -> harder, 1 wrong -> easier; step 2 dB until 2 reversals, then 0.5 dB
function stair(ok){const st=ses.st;let move=0;if(ok){st.run++;if(st.run>=2){move=-1;st.run=0}}else{move=1;st.run=0}
if(move){if(st.dir&&move!==st.dir)st.rev.push(st.d);st.dir=move;if(st.rev.length>=2)st.step=.5;st.d=Math.max(.25,Math.min(12,st.d+move*st.step))}}
const stairDone=()=>ses.st.rev.length>=8||ses.round>=ses.rounds;
function proceed(){if(!ses||!ses.answered)return;if(ses.game.adaptive?!stairDone():ses.round<ses.rounds){nextRound();return}finishGame()}
function finishGame(){const g=ses.game,n=ses.trials.length,c=ses.correct,pct=Math.round(c/Math.max(1,n)*100),k=R?R.opts.length:2,p0=1/k,pv=binomTail(c,n,p0),prev=S.best[g.id]||0;
let res={id:g.id,pct,correct:c,rounds:n,lv:ses.lv,p0,pv,best:pct>prev&&pct>0};
if(g.adaptive){const r=ses.st.rev.slice(-6),t=r.length?r.reduce((a,b)=>a+b,0)/r.length:ses.st.d,sd=r.length>1?Math.sqrt(r.reduce((a,b)=>a+(b-t)*(b-t),0)/(r.length-1)):0;res.jnd={t:+t.toFixed(2),sd:+sd.toFixed(2),rev:ses.st.rev.length};S.jnd.push({t:res.jnd.t,sd:res.jnd.sd,d:today()});S.jnd=S.jnd.slice(-50)}
else{S.best[g.id]=Math.max(prev,pct);if(pct>=80&&pv<.05&&lvOf(g.id)<3){S.lvl[g.id]=lvOf(g.id)+1;res.up=true}}
if(ses.workout){ses.results.push(res);if(ses.gi<ses.ids.length-1){save();ui.done(res,true);return}if(!S.days.includes(today()))S.days.push(today());S.days=S.days.slice(-400)}save();ui.done(res,false)}
function startWorkout(){ses={workout:true,ids:workoutIds(),gi:0,results:[]};startGame(ses.ids[0],{rounds:6,keep:true})}
function nextWorkoutGame(){ses.gi++;startGame(ses.ids[ses.gi],{rounds:6,keep:true})}
function quit(){setPlay(false);ses=null;view('dash')}
// ---------- UI ----------
const svg=(d,s=48)=>`<svg viewBox="0 0 48 32" width="${s}" height="${s*2/3}" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="square"/></svg>`;
const CATN=Object.fromEntries(CATS);
function dash(){const l=level(),x0=nextXp(l-1),x1=nextXp(l),wid=workoutIds(),done=S.days.includes(today()),dd=new Date(),bj=bestJnd();
root.innerHTML=`<div class="tr-head"><span class="mono">CREATIVE · EAR TRAINING</span><b>EAR GYM</b><span class="tr-std mono">ISO 266 · ITU-R BS.1770 · BS.1116 · LEVITT 1971</span></div>
<div class="box tr-cal${S.cal?' ok':''}"><div><span class="mono">STEP 0 · LISTENING CHECK</span><b>${S.cal?'청취 환경 확인됨':'시작 전에 청취 환경을 맞춰 주세요'}</b><p>헤드폰 권장. 좌·우 채널을 확인하고, 기준 노이즈(−20 dBFS 핑크 노이즈)를 편한 대화 정도 크기로 맞춘 뒤 볼륨을 고정하면 매 세션 결과를 같은 조건에서 비교할 수 있어요.</p></div>
<div class="tr-calb"><button class="btn" data-cal="L">◀ LEFT</button><button class="btn" data-cal="R">RIGHT ▶</button><button class="btn tr-go" data-cal="C">기준 노이즈 4초</button></div></div>
<div class="tr-top"><div class="box tr-today"><span class="mono">TODAY'S WORKOUT · ${dd.getMonth()+1}.${dd.getDate()}</span><b>${done?'오늘 워크아웃 완료':'4 GAMES · 24 ROUNDS'}</b>
<ol class="tr-wl">${wid.map(id=>`<li>${svg(GI[id].icon,30)}<span>${GI[id].name}</span><i class="mono">${GI[id].cat}</i></li>`).join('')}</ol>
<button class="btn tr-go" data-tr="workout">${done?'한 번 더 하기':'START WORKOUT'} →</button><p class="tr-note">모든 문제는 정답 위치·A/B 배치가 무작위인 블라인드 강제선택 방식이에요.</p></div>
<div class="box tr-me"><div class="tr-kpi"><div><span class="mono">LEVEL</span><b>${l}</b></div><div><span class="mono">STREAK</span><b>${streak()}<small>일</small></b></div><div><span class="mono">LEVEL JND</span><b>${bj!=null?bj.toFixed(2)+'<small>dB</small>':'—'}</b></div></div>
<div class="tr-xp"><span class="mono">XP ${S.xp} / ${x1} · ROUNDS ${S.rounds}</span><div class="bar"><i style="width:${Math.round((S.xp-x0)/(x1-x0)*100)}%"></i></div></div>
<h2>SKILLS · 정답률 (95% 신뢰구간)</h2>${CATS.map(([c,n])=>{const v=S.cat[c],p=catPct(c),ci=v?wilson(v.c,v.n):[0,0];return`<div class="tr-sk"><span class="mono">${n}</span><div class="bar"><i style="width:${Math.round(p*100)}%"></i>${v&&v.n?`<s style="left:${ci[0]*100}%;width:${(ci[1]-ci[0])*100}%"></s>`:''}</div><output>${v&&v.n?Math.round(p*100)+'% <small>'+Math.round(ci[0]*100)+'–'+Math.round(ci[1]*100)+' · n'+v.n+'</small>':'—'}</output></div>`}).join('')}</div></div>
<h2 class="tr-h">BADGES</h2><div class="tr-badges">${BADGES.map(([id,n,how])=>{const on=badgeOn(id);return`<div class="tr-badge${on?' on':''}" title="${how}">${svg(GI[id].icon,34)}<b>${n}</b><span>${on?'획득':how}</span></div>`}).join('')}</div>
<h2 class="tr-h">EAR TRAINING GAMES</h2><div class="tr-games">${GAMES.map(g=>`<div class="box tr-card${g.adaptive?' tr-test':''}">${svg(g.icon)}<div><b>${g.name}</b><span class="mono">${g.adaptive?'THRESHOLD TEST · ':''}${CATN[g.cat]}</span><p>${g.ko}</p><span class="tr-best">${g.adaptive?'BEST '+(bj!=null?bj.toFixed(2)+' dB':'—')+' · 2-DOWN/1-UP':'BEST '+(S.best[g.id]!=null?S.best[g.id]+'%':'—')+' · LV '+lvOf(g.id)}</span></div><button class="btn" data-tr="play" data-id="${g.id}">ENTER →</button></div>`).join('')}</div>
<details class="notes"><summary>METHOD · 공신력 근거</summary>
<ul class="tr-method"><li><b>세기</b> EQ 게임의 부스트·컷은 LV1 기준 +18 dB / −30 dB로 크게 걸고, 헤드룸을 확보한 뒤 출력에 안전 리미터(−2 dBFS)를 둬서 클리핑 없이 들리게 해요. 스펙트럼은 답을 고른 뒤에만 열려 귀로만 판단하게 해요.</li><li><b>주파수</b> ISO 266 우선 주파수(옥타브·1/3 옥타브 중심, IEC 61260-1 대역)를 정답 보기로 써요.</li>
<li><b>음량 맞춤</b> A/B 비교 게임은 ITU-R BS.1770-4 K-가중치로 측정한 라우드니스를 실시간으로 맞춰, “더 큰 쪽”이 단서가 되지 않게 해요.</li>
<li><b>블라인드</b> 처리음이 A인지 B인지, 정답이 몇 번 보기인지 매 문제 무작위예요(ITU-R BS.1116-3, ABX 청취 시험의 원칙).</li>
<li><b>역치 측정</b> LEVEL JND는 2-down/1-up 적응형 계단법(Levitt, 1971)으로 70.7% 정답 지점을 찾고, 마지막 6번 반전값의 평균을 역치로 보고해요. 숙련된 청취자의 광대역 음량 변별은 보통 0.5–1 dB 수준이에요.</li>
<li><b>통계</b> 세션마다 정확 이항 검정으로 “찍어서 이 점수 이상 나올 확률(p)”을 보여 주고, p&lt;0.05일 때만 난이도가 올라가요. 분야별 정답률은 Wilson 95% 신뢰구간과 함께 표시해요.</li>
<li><b>한계</b> 브라우저와 사용자의 출력 장치는 보정되지 않으므로, 절대 SPL이나 임상 청력 검사가 아닌 <i>훈련용 상대 지표</i>예요. 같은 장치·볼륨으로 반복 측정할 때 의미가 있어요.</li></ul>
<p class="tr-ref mono">ISO 266:1997 · IEC 61260-1:2014 · ITU-R BS.1770-4 (2015) · ITU-R BS.1116-3 (2015) · H. Levitt, J. Acoust. Soc. Am. 49(2B), 1971</p>
<p>기록은 이 기기의 브라우저에만 저장돼요. <button class="btn" data-tr="reset">기록 초기화</button></p></details>`}
function gameView(){const g=ses.game;root.innerHTML=`<div class="tr-gh"><button class="btn" data-tr="quit">← GYM</button><div class="tr-gt"><span class="mono">${g.adaptive?'THRESHOLD TEST · 2-DOWN/1-UP':CATN[g.cat]+' · LV <i data-f="lv"></i>'}${ses.workout?` · WORKOUT ${ses.gi+1}/${ses.ids.length}`:''}</span><b>${g.name}</b></div>
<div class="tr-sc"><div><span class="mono">${g.adaptive?'TRIAL':'ROUND'}</span><b data-f="rd"></b></div><div><span class="mono">${g.adaptive?'REVERSALS':'SCORE'}</span><b data-f="sc"></b></div></div></div>
<div class="box tr-stage"><p class="tr-q" data-f="q"></p><canvas class="tr-rta" aria-hidden="true"></canvas>
<div class="tr-tp"><button class="tr-play" data-tr="toggle" aria-label="재생 / 정지 (Space)"></button><div class="seg tr-ab" role="group" aria-label="A B 전환"><button data-ab="A" aria-pressed="false">A<small data-f="la"></small></button><button data-ab="B" aria-pressed="false">B<small data-f="lb"></small></button></div>
<label class="tr-src"><span class="mono">SOURCE</span><select data-tr="src">${Object.entries(SRCN).map(([k,n])=>`<option value="${k}">${n}</option>`).join('')}</select></label>
<label class="tr-vol"><span class="mono">VOL</span><input type="range" min="0" max="1" step="0.01" data-tr="vol" aria-label="트레이닝 볼륨"></label><span class="mono tr-lufs" data-f="lufs"></span></div>
<div class="tr-opts" data-f="opts"></div><div class="tr-fb" data-f="fb" aria-live="polite"></div><button class="btn tr-next" data-tr="next" hidden>NEXT →</button>
<p class="tr-keys mono">SPACE 재생 · A / B 전환 · 1–9 답 · ENTER 다음 · 찍을 확률 <span data-f="chance"></span></p></div>`;
root.querySelector('[data-tr=src]').value=src;root.querySelector('[data-tr=vol]').value=vol;rta=root.querySelector('.tr-rta');ui.play();ui.round()}
const F=k=>root.querySelector(`[data-f="${k}"]`);let rta=null,mode='dash';
const ui={
play(){const b=root.querySelector('.tr-play');if(b){b.textContent=playing?'■ STOP':'▶ PLAY';b.setAttribute('aria-pressed',playing)}},
ab(){root.querySelectorAll('[data-ab]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.ab===listen))},
round(){if(!ses||mode!=='game'||!F('rd')||!R||ses.round<1)return;const g=ses.game;if(F('lv'))F('lv').textContent=ses.lv;F('rd').textContent=g.adaptive?ses.round:ses.round+' / '+ses.rounds;F('sc').textContent=g.adaptive?ses.st.rev.length+' / 8':ses.correct;F('q').textContent=R.q;
F('la').textContent=R.kind==='ab'?'':' · 원음';F('lb').textContent=R.kind==='ab'?'':' · 처리음';F('chance').textContent=Math.round(100/R.opts.length)+'%';
F('opts').innerHTML=R.opts.map((o,i)=>`<button data-ans="${i}"><i>${i+1}</i>${o}</button>`).join('');{const n=R.opts.length;F('opts').style.setProperty('--n',n>6?Math.ceil(n/2):n);F('opts').style.setProperty('--m',n===2?2:n===4?2:3)}
F('fb').textContent='';root.querySelector('[data-tr=next]').hidden=true;this.ab()},
answered(i,ok){root.querySelectorAll('[data-ans]').forEach(b=>{const k=+b.dataset.ans;b.disabled=true;if(k===R.ans)b.classList.add('right');else if(k===i)b.classList.add('wrong')});const g=ses.game;F('sc').textContent=g.adaptive?ses.st.rev.length+' / 8':ses.correct;
F('fb').innerHTML=(ok?'<b>정답!</b> ':'<b>아쉬워요.</b> ')+'정답 · '+R.reveal+(g.adaptive?' · 다음 차이 '+ses.st.d.toFixed(2)+' dB':R.kind==='id'?' — A/B를 다시 비교해 보세요.':'');const n=root.querySelector('[data-tr=next]');n.hidden=false;n.textContent=(g.adaptive?!stairDone():ses.round<ses.rounds)?'NEXT →':'RESULT →';n.focus({preventScroll:true})},
done(r,more){setPlay(false);const g=GI[r.id],sig=r.pv<.05;root.innerHTML=`<div class="tr-gh"><button class="btn" data-tr="quit">← GYM</button><div class="tr-gt"><span class="mono">${ses.workout?'WORKOUT '+(ses.gi+1)+'/'+ses.ids.length:'RESULT'}</span><b>${g.name}</b></div></div>
<div class="box tr-res">${r.jnd?`<b class="tr-pct">${r.jnd.t.toFixed(2)}<small> dB</small></b><p>음량 변별 역치(JND) · 70.7% 정답 지점 · 반전 ${r.jnd.rev}회 · 표준편차 ±${r.jnd.sd.toFixed(2)} dB</p><p class="tr-up">${r.jnd.t<=1?'숙련 청취자 수준(≤ 1 dB)이에요.':r.jnd.t<=2?'일반적인 범위예요. 반복하면 1 dB 이하로 내려갈 수 있어요.':'조용한 곳에서 헤드폰으로 다시 측정해 보세요.'}</p>`
:`<b class="tr-pct">${r.pct}%</b><p>${r.correct} / ${r.rounds} 정답 · LV ${r.lv}${r.best?' · 최고 기록!':''}</p>`}
<p class="tr-stat mono">찍었을 때 기대 정답률 ${Math.round(r.p0*100)}% · 이항 검정 ${pfmt(r.pv)} · ${sig?'<b>우연이 아님 (p &lt; 0.05)</b>':'아직 우연과 구분되지 않음'}</p>
${r.up?`<p class="tr-up">80% 이상 + 유의미 — ${g.name} 난이도가 LV ${lvOf(r.id)}로 올라갔어요.</p>`:''}
${!more&&ses.workout?`<p class="tr-up">오늘의 워크아웃 완료 · 연속 ${streak()}일</p><ol class="tr-sum">${ses.results.map(x=>`<li><span>${GI[x.id].name}</span><b>${x.pct}% <small>${pfmt(x.pv)}</small></b></li>`).join('')}</ol>`:''}
<div class="tr-acts">${more?`<button class="btn" data-tr="nextgame">NEXT GAME · ${GI[ses.ids[ses.gi+1]].name} →</button>`:`<button class="btn" data-tr="again" data-id="${r.id}">다시 하기</button>`}<button class="btn" data-tr="quit">GYM으로</button></div></div>`;mode='res';const b=root.querySelector('.tr-acts .btn');b&&b.focus({preventScroll:true})}};
function view(v){mode=v;if(v==='dash'){dash();rta=null}else gameView();try{root.scrollIntoView({block:'start'})}catch(e){}}
root.addEventListener('click',e=>{const c=e.target.closest('[data-cal]');if(c){checkTone(c.dataset.cal);if(c.dataset.cal==='C')setTimeout(()=>{if(mode==='dash')dash()},300);return}
const b=e.target.closest('[data-tr],[data-ab],[data-ans]');if(!b)return;if(b.dataset.ab){ensure();setListen(b.dataset.ab);if(!playing)setPlay(true);return}if(b.dataset.ans!=null){answer(+b.dataset.ans);return}
const t=b.dataset.tr;if(t==='workout')startWorkout();else if(t==='play'||t==='again'){ses=null;startGame(b.dataset.id)}else if(t==='toggle')setPlay(!playing);else if(t==='next')proceed();else if(t==='nextgame')nextWorkoutGame();else if(t==='quit')quit();
else if(t==='reset'){if(confirmReset()){Object.assign(S,blank());save();dash()}}});
let rs=0;function confirmReset(){if(Date.now()-rs<3000)return true;rs=Date.now();G.toast('한 번 더 누르면 기록이 지워져요.');return false}
root.addEventListener('change',e=>{if(e.target.dataset.tr==='src'){src=e.target.value;if(playing)startSrc()}});
root.addEventListener('input',e=>{if(e.target.dataset.tr==='vol'){vol=+e.target.value;if(out)out.gain.setTargetAtTime(vol,ac.currentTime,.02)}});
addEventListener('keydown',e=>{if(G.view!=='2d'||G.page!==PAGE||mode!=='game'||!ses)return;const tg=e.target.tagName;if(tg==='INPUT'||tg==='SELECT'||tg==='TEXTAREA')return;
if(e.code==='Space'){e.preventDefault();setPlay(!playing);return}if(e.code==='KeyA'||e.code==='KeyB'){ensure();setListen(e.code==='KeyA'?'A':'B');if(!playing)setPlay(true);return}
if(e.code==='Enter'&&ses.answered){e.preventDefault();proceed();return}const d=/^Digit([1-9])$|^Numpad([1-9])$/.exec(e.code);if(d){const i=+(d[1]||d[2])-1;if(R&&i<R.opts.length){e.preventDefault();answer(i)}}});
// spectrum (1/6-octave bands) + the round's filter response once answered + live loudness gap for matched games
G.ticks.push(()=>{if(!rta||!rta.offsetParent||G.view!=='2d')return;const dpr=Math.min(devicePixelRatio||1,2),w=rta.clientWidth,h=rta.clientHeight;if(rta.width!==Math.round(w*dpr)){rta.width=Math.round(w*dpr);rta.height=Math.round(h*dpr)}
const x=rta.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);x.fillStyle='#0b0b0b';x.fillRect(0,0,w,h);if(ses&&!ses.answered){x.fillStyle='#777';x.font='600 12px ui-monospace,monospace';x.textAlign='center';x.fillText(playing?'귀로만 판단하세요 · 답을 고르면 스펙트럼과 EQ 곡선이 열려요':'PRESS PLAY',w/2,h/2+4);x.textAlign='left';x.fillStyle=playing?'#fff':'#777';x.fillText(playing?(listen==='A'?'A':'B')+' · '+SRCN[src]:'',8,14);return}const fx=f=>Math.log(f/20)/Math.log(1000)*w;
x.strokeStyle='#2a2a2a';x.lineWidth=1;x.fillStyle='#777';x.font='600 10px ui-monospace,monospace';for(const f of[31.5,63,125,250,500,1000,2000,4000,8000,16000]){const X=fx(f)|0;x.beginPath();x.moveTo(X+.5,0);x.lineTo(X+.5,h);x.stroke();x.fillText(f>=1000?f/1000+'k':f,X+3,h-4)}
if(ac&&playing){const n=ana.frequencyBinCount,d=new Float32Array(n);ana.getFloatFrequencyData(d);const bw=ac.sampleRate/2/n;x.fillStyle='#f2f2f2';for(let k=0;k<60;k++){const f0=20*Math.pow(2,k/6),f1=f0*Math.pow(2,1/6);let s=0,c=0;for(let i=Math.max(1,Math.floor(f0/bw));i<=Math.min(n-1,Math.ceil(f1/bw));i++){s+=Math.pow(10,d[i]/10);c++}const db=c?10*Math.log10(s):-120,v=Math.max(0,Math.min(1,(db+90)/80)),X0=fx(f0),X1=fx(f1);x.fillRect(X0+1,h-16-v*(h-26),Math.max(1,X1-X0-2),v*(h-26))}}
if(ses&&ses.answered&&R&&R.curve){const M=200,fr=new Float32Array(M),mg=new Float32Array(M),ph=new Float32Array(M);for(let i=0;i<M;i++)fr[i]=20*Math.pow(1000,i/(M-1));R.curve[0].getFrequencyResponse(fr,mg,ph);const y=db=>h/2-db/36*(h/2-14);
x.strokeStyle='#fff';x.lineWidth=2;x.beginPath();for(let i=0;i<M;i++){const X=i/(M-1)*w,Y=y(20*Math.log10(Math.max(1e-4,mg[i])));i?x.lineTo(X,Y):x.moveTo(X,Y)}x.stroke();x.strokeStyle='#555';x.setLineDash([3,4]);x.beginPath();x.moveTo(0,h/2);x.lineTo(w,h/2);x.stroke();x.setLineDash([])}
x.fillStyle=playing?'#fff':'#777';x.fillText(playing?(listen==='A'?'A':'B')+' · '+SRCN[src]:'PRESS PLAY',8,14);
const lf=F('lufs');if(lf){const gp=matchOn&&playing?lufsGap():null;lf.textContent=matchOn?(gp!=null?'K-WEIGHTED Δ '+gp.toFixed(1)+' dB':'K-WEIGHTED MATCH'):''}});
// stop the trainer when leaving its page or the 2D view
G.on('mode',i=>{if(i!==PAGE&&playing)setPlay(false)});G.on('view',v=>{if(v!=='2d'&&playing)setPlay(false)});
// entry points: CREATIVE page chips, 3D pads, underground pads
G.trainOpen=a=>{if(G.page!==PAGE)G.setMode(PAGE,true);if(G.view!=='2d')G.setView('2d');if(a==='workout')startWorkout();else if(a==='random')startGame(pick(GAMES.filter(g=>!g.adaptive)).id);else{if(mode!=='game')view('dash');else try{root.scrollIntoView({block:'start'})}catch(e){}}};
document.addEventListener('click',e=>{const j=e.target.closest('[data-crjump]');if(!j)return;e.preventDefault();const t=document.getElementById(j.dataset.crjump==='gym'?'cr-gym':'cr-loop');t&&t.scrollIntoView({block:'start',behavior:'smooth'})});
dash();
})();
