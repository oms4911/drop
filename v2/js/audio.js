// WebAudio: 128 BPM four-layer loop (mixer targets), random 4-bar loops, UI sfx.
(()=>{let ctx,master,an,buf,bus=[],timer,step=0,next=0,fd;
let D=60/128/4;const A=G.audio={pulse:new Array(23).fill(0),lvl:0,seed:0,eng:0,on:false,
init(){if(ctx){ctx.resume();return}ctx=new(window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=.8;an=ctx.createAnalyser();an.fftSize=128;fd=new Uint8Array(an.frequencyBinCount);
master.connect(an);an.connect(ctx.destination);buf=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate);const d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
for(let i=0;i<G.NCH;i++){const g=ctx.createGain();g.connect(master);bus.push(g)}A.ctx=ctx;A.bus=bus;A.on=true;A.mix()},
mix(){if(!ctx)return;for(let i=0;i<G.NCH;i++){const m=i<4&&A.mapDemo?A.mapDemo[i]:i;bus[i].gain.setTargetAtTime(G.mute[m]?0:Math.pow(10,G.db[m]/20)*(m>=7&&m<=14?1:.7),ctx.currentTime,.03)}},
level(){if(!an)return 0;an.getByteFrequencyData(fd);let s=0;for(let i=0;i<24;i++)s+=fd[i];return s/24/255},
setLoop(v){G.loop=v;if(v){A.init();if(!timer){step=0;next=ctx.currentTime+.06;timer=setInterval(sched,25)}}else if(timer){clearInterval(timer);timer=null}document.getElementById('bLoop').setAttribute('aria-pressed',v)}};
const ns=()=>{const s=ctx.createBufferSource();s.buffer=buf;s.loop=true;return s};
const env=(g,t,a,d,p)=>{g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(p,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+d)};
const osc=(ty,f,t,d,dst,p=.5,a=.005)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type=ty;o.frequency.setValueAtTime(f,t);env(g,t,a,d,p);o.connect(g);g.connect(dst);o.start(t);o.stop(t+a+d+.05);return o};
const hit=(ms,i)=>setTimeout(()=>{A.pulse[i]=1},ms);
function sched(){while(next<ctx.currentTime+.12){if(A.cfg)play64(step,next);else play(step,next);next+=D;step=(step+1)%(A.cfg?64:16)}}
function play(s,t){const ms=Math.max(0,(t-ctx.currentTime)*1e3);
if(s%4==0){const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(42,t+.12);env(g,t,.003,.3,.95);o.connect(g);g.connect(bus[0]);o.start(t);o.stop(t+.4);hit(ms,0)}
if(s%2==1){const n=ns(),f=ctx.createBiquadFilter(),g=ctx.createGain();f.type='highpass';f.frequency.value=7000;env(g,t,.002,.04,.3);n.connect(f);f.connect(g);g.connect(bus[0]);n.start(t,Math.random());n.stop(t+.1)}
if(s==4||s==12){const n=ns(),f=ctx.createBiquadFilter(),g=ctx.createGain();f.type='bandpass';f.frequency.value=1900;env(g,t,.002,.16,.5);n.connect(f);f.connect(g);g.connect(bus[0]);n.start(t,Math.random());n.stop(t+.25)}
const bn={0:0,3:0,6:3,10:0,13:-2};if(s in bn){const f=55*Math.pow(2,bn[s]/12),o=osc('sawtooth',f,t,.2,(()=>{const l=ctx.createBiquadFilter();l.type='lowpass';l.frequency.value=420;l.Q.value=6;l.connect(bus[1]);return l})(),.55);hit(ms,1)}
if(s%2==0){const sc=[0,3,7,10,12,15,10,7],f=220*Math.pow(2,sc[(s/2)%8]/12);osc('square',f,t,.16,(()=>{const l=ctx.createBiquadFilter();l.type='lowpass';l.frequency.value=2400;l.connect(bus[2]);return l})(),.16);hit(ms,2)}
if(s==0){for(const k of[0,3,7]){for(const dt of[-7,7]){const o=ctx.createOscillator(),g=ctx.createGain(),l=ctx.createBiquadFilter();o.type='sawtooth';o.frequency.value=110*Math.pow(2,k/12);o.detune.value=dt;l.type='lowpass';l.frequency.value=700;env(g,t,.8,1.1,.07);o.connect(l);l.connect(g);g.connect(bus[3]);o.start(t);o.stop(t+2.1)}}hit(ms,3)}
A.step=s}

// ---- random 4-bar loop (drums, bass, synth, pad all follow the mixer buses) ----
const SCALES={MINOR:[0,2,3,5,7,8,10],DORIAN:[0,2,3,5,7,9,10],PHRYGIAN:[0,1,3,5,7,8,10],HARMONIC:[0,2,3,5,7,8,11],PENTA:[0,3,5,7,10]},KEYS=['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
const GEN=[[0,'DOWNTEMPO'],[112,'DEEP HOUSE'],[124,'MELODIC TECHNO'],[134,'DARK TECHNO']],MOOD=['DARK','HYPNOTIC','DREAMY','AGGRESSIVE','ETHEREAL','NOSTALGIC','COLD','EUPHORIC'],INST=['SUB BASS','ACID 303','PLUCK SYNTH','GLITCH PERCUSSION','ANALOG PAD','FM BELLS','NOISE SWEEPS','DETUNED SAWS'];
const deg=(sc,d)=>sc[((d%sc.length)+sc.length)%sc.length]+12*Math.floor(d/sc.length);
A.newLoop=(seed)=>{A.init();seed=seed==null?crypto.getRandomValues(new Uint32Array(1))[0]:seed;const r=G.rng(seed),rb=p=>r()<p;
const bpm=100+Math.floor(r()*40),root=Math.floor(r()*12),sn=Object.keys(SCALES),scn=sn[Math.floor(r()*sn.length)],sc=SCALES[scn];
const prog=[0,...[0,0,0].map(()=>[0,3,4,5,6,2][Math.floor(r()*6)])];prog[3]=rb(.5)?4:prog[3];
const cfg={seed,bpm,root,scn,key:KEYS[root],prog,k:[],h:[],sn:[],bs:[],ld:[],ch:[]};
const dens=.3+r()*.4,hd=.3+r()*.6;
for(let b=0;b<4;b++){const k=[],h=[],sn2=[],bs=[];for(let i=0;i<16;i++){k.push(i%4==0||(i%4==2&&rb(.18))||(b==3&&i>=12&&rb(.4)));h.push(i%2==1?rb(.7+hd*.3):rb(hd*.35));sn2.push(i==4||i==12||(b==3&&i>12&&rb(.35))||(i%4==3&&rb(.07)));
const on=[0,3,6,10,13].includes(i)?rb(.9):rb(.2);bs.push(on?deg(sc,prog[b]+(rb(.2)?4:0)):null)}
cfg.k.push(k);cfg.h.push(h);cfg.sn.push(sn2);cfg.bs.push(bs);cfg.ch.push([0,2,4].map(o=>deg(sc,prog[b]+o)))}
for(let s=0;s<64;s++){const b=s>>4;cfg.ld.push(s%2==0&&rb(dens)||rb(dens*.25)?deg(sc,prog[b]+[0,2,4,7,9,11][Math.floor(r()*6)]):null)}
cfg.gen=GEN.filter(g=>bpm>=g[0]).pop()[1];cfg.mood=MOOD[Math.floor(r()*8)];const ins=[...INST].sort(()=>r()-.5).slice(0,3);cfg.ins=ins;
cfg.prompt=`Instrumental ${cfg.gen.toLowerCase()} loop, ${bpm} BPM, ${cfg.key} ${scn.toLowerCase()}, exactly 4 bars, seamless loop, ${cfg.mood.toLowerCase()} mood, ${ins.join(', ').toLowerCase()}, no vocals`;
A.cfg=cfg;D=60/bpm/4;if(timer){step=0;next=ctx.currentTime+.06}else A.setLoop(true);G.emit('loop',cfg);return cfg};
function play64(s,t){const c=A.cfg,b=s>>4,i=s&15,ms=Math.max(0,(t-ctx.currentTime)*1e3),lp=(f,dst,q=1)=>{const l=ctx.createBiquadFilter();l.type='lowpass';l.frequency.value=f;l.Q.value=q;l.connect(dst);return l};
if(c.k[b][i]){const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(42,t+.12);env(g,t,.003,.3,.95);o.connect(g);g.connect(bus[0]);o.start(t);o.stop(t+.4);hit(ms,0)}
if(c.h[b][i]){const n=ns(),f=ctx.createBiquadFilter(),g=ctx.createGain();f.type='highpass';f.frequency.value=7000;env(g,t,.002,.04,.3);n.connect(f);f.connect(g);g.connect(bus[0]);n.start(t,Math.random());n.stop(t+.1)}
if(c.sn[b][i]){const n=ns(),f=ctx.createBiquadFilter(),g=ctx.createGain();f.type='bandpass';f.frequency.value=1900;env(g,t,.002,.16,.5);n.connect(f);f.connect(g);g.connect(bus[0]);n.start(t,Math.random());n.stop(t+.25)}
const bn=c.bs[b][i];if(bn!=null){osc('sawtooth',55*Math.pow(2,(c.root+bn)/12),t,.2,lp(420,bus[1],6),.55);hit(ms,1)}
const ld=c.ld[s];if(ld!=null){osc('square',220*Math.pow(2,(c.root+ld)/12),t,.16,lp(2400,bus[2]),.16);hit(ms,2)}
if(i==0){for(const k of c.ch[b]){for(const dt of[-7,7]){const o=ctx.createOscillator(),g=ctx.createGain(),l=ctx.createBiquadFilter();o.type='sawtooth';o.frequency.value=110*Math.pow(2,(c.root+k)/12);o.detune.value=dt;l.type='lowpass';l.frequency.value=700;env(g,t,.8,Math.min(3,D*16-.9),.07);o.connect(l);l.connect(g);g.connect(bus[3]);o.start(t);o.stop(t+D*16);}}hit(ms,3)}
A.step=i}
G.on('mixer',()=>A.mix());
A.sfx=n=>{if(!ctx||!A.on)return;const t=ctx.currentTime+.005,o=ctx.createGain();o.gain.value=.5;o.connect(master);
if(n=='blip'){osc('sine',660,t,.08,o,.4);osc('sine',990,t+.07,.12,o,.4)}
else if(n=='hang'){osc('triangle',300,t,.06,o,.4)}
else if(n=='tab'){const s=osc('sawtooth',200,t,.25,o,.2);s.frequency.exponentialRampToValueAtTime(1600,t+.2)}
else if(n=='slam'){const s=osc('sine',140,t,.25,o,.9);s.frequency.exponentialRampToValueAtTime(40,t+.2)}
else if(n=='splash'){const q=ctx.createBiquadFilter(),g=ctx.createGain(),x=ns();q.type='lowpass';q.frequency.setValueAtTime(3000,t);q.frequency.exponentialRampToValueAtTime(300,t+.3);env(g,t,.01,.3,.35);x.connect(q);q.connect(g);g.connect(o);x.start(t);x.stop(t+.4)}
else if(n=='tick'){osc('square',1200,t,.02,o,.15,.001)}};
})();
