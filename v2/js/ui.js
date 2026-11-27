// 2D pages, navigation, shared mixer UI, wireframe gameplay screens, 2D synth pads.
(()=>{const $=id=>document.getElementById(id),A=G.audio,W=G.world;
const mixer=(ids=[0,1,2,3])=>`<div class="mix">${ids.map(i=>[G.chName(i),i]).map(([n,i])=>`<div class="ch"><label for="mx${i}-§">${n}</label><input type="range" id="mx${i}-§" data-i="${i}" min="-48" max="6" step="0.1" aria-label="${n} 볼륨"><output data-o="${i}"></output><button class="m" data-m="${i}" aria-pressed="false" aria-label="${n} 음소거">M</button></div>`).join('')}</div>`;
const P=[];let uid=0;
P[0]=`<div class="apphead"><span class="mono">PROFILE</span><b>CORE COMPETENCIES</b></div>
<div class="box hero"><canvas id="pav" class="pav" width="320" height="320" role="button" tabindex="0" aria-label="내 캐릭터: 눌러서 인사하기, 두 번 누르면 AI 채팅"></canvas><div><span class="mono">TAP ME</span><b>오민서</b><p id="pline">캐릭터를 눌러 보세요. 두 번 누르면 AI와 대화할 수 있어요.</p></div></div>
<div class="grid"><div class="box"><h2>Core Competencies</h2><ul class="list"><li><i>01</i>영상 엔지니어링 및 사운드 디자인</li><li><i>02</i>디지털 오디오 워크스테이션 기반 작곡</li><li><i>03</i>디지털 오디오 워크스테이션 기반 믹스 및 마스터</li></ul></div>
<div class="box"><h2>Brief History</h2><div class="tl"><div><span class="y">2023 - PRESENT</span><b>백석예술대학교</b>재학</div><div><span class="y">2024.04 - 2025.10</span><b>3군단 군악대</b>타악병 복무</div><div class="blank"></div></div></div></div>
<div class="box" style="margin-top:16px"><h2>Mastered Tools</h2><div class="chips">${['Logic Pro X'].map(t=>`<span>${t}</span>`).join('')}</div></div>
<p><button class="btn" data-toast="이력서 PDF는 아직 연결되지 않았습니다. oms4911@gmail.com 으로 요청해 주세요.">DOWNLOAD ATTACHMENT · Full Resume &amp; Portfolio pdf →</button></p>`;
P[1]=`<div class="apphead"><span class="mono">GAME</span><b>DIABLO</b></div>
<div class="box wide app"><div class="vslot" data-vslot="game"></div></div>
<div class="box wide app"><h2>Mixer · AMBIENT MUSIC FX</h2>${mixer([4,5,6])}</div>
<div class="box wide app lgbox" data-logicbox><h2>Logic Pro Session · 디아블로</h2><p class="mono lgnote">게임 영상과 같이 재생돼요 · 소리는 위 영상에서</p></div>
<details class="notes"><summary>PROJECT NOTES</summary><p>음악은 Logic Pro X로 직접 제작했고, FX와 Ambient 사운드는 Splice를 통해 직접 작업했습니다. 믹서에서 각 레이어를 조절해 장면의 분위기를 바꿔 볼 수 있습니다.</p></details>`;
P[2]=`<div class="apphead"><span class="mono">MOCK UP</span><b>GENERATIVE PRODUCTION</b></div>
<div class="seg" role="tablist">${[['video','MAIN'],['show1',"PACHELBEL'S CANON"]].map(([id,n],i)=>`<button role="tab" data-vtab="${id}" aria-selected="${i==0}">${n}</button>`).join('')}</div>
${['video','show1'].map((id,i)=>`<div class="box wide app" data-vpanel="${id}"${i?' hidden':''}><div class="vslot" data-vslot="${id}"></div></div>`).join('')}
${['video','show1'].map((id,i)=>`<div class="box wide app" data-vpanel="${id}"${i?' hidden':''}><h2>Mixer · 바이올린 1 · 바이올린 2 · 비올라 · 첼로</h2>${mixer([7+4*i,8+4*i,9+4*i,10+4*i])}</div>`).join('')}
<details class="notes"><summary>PROJECT NOTES</summary><p>영상의 콘셉트, 편집 리듬, 사운드 타이밍을 하나의 쇼릴로 연결합니다. 장면 전환과 음악 레이어를 함께 설계해 연출력과 후반작업 역량을 보여줍니다.</p>
<div class="grid"><div class="box"><h2>PROMPT_INPUT</h2><div class="code">/generate <em>music_style:</em> "Cyberpunk Melodic Techno"\n<em>bpm:</em> 128  <em>mood:</em> "Dark, Energetic"\n<em>layers:</em> [Sub_Bass, Glitch_Perc, Ethereal_Pad]</div><p class="chips" style="margin-top:12px"><span>VIDEO_SYNC · FRAME MATCHING</span><span>AUDIO_ENGINE · LAYER CONTROL</span></p></div>
</div>
<h2 style="margin-top:24px">Prompt Direction · PROMPTER PROJECT</h2>
<div class="grid"><div class="box"><h2>PROMPT_TO_FRAME / PREVIEW</h2><canvas class="screen" data-scene="frame"></canvas><div class="code" style="margin-top:12px;white-space:pre-wrap"><em>SUBJECT</em>  a lone figure walking through a neon industrial city\n<em>CAMERA</em>   slow dolly in, low angle, anamorphic framing\n<em>LIGHT</em>    cyan practical lights, acid lime reflections, deep shadow</div></div>
<div class="box"><h2>Prompt Direction</h2><p>단순히 이미지를 생성하는 것이 아니라 장면의 목적과 감정에 맞춰 프롬프트를 구조화하고 반복 개선하는 과정을 프로젝트로 보여줍니다.</p><ol class="steps"><li><b>01 / DEFINE</b>콘셉트, 무드, 카메라 언어 정의</li><li><b>02 / GENERATE</b>이미지·영상 프롬프트 생성 및 변주</li><li><b>03 / EDIT</b>음악, 편집, 색감으로 최종 쇼릴 완성</li></ol></div></div></details>`;
P[3]=`<div class="apphead"><span class="mono">CREATIVE</span><b>LOOP LAB + EAR GYM</b></div>
<p class="crjump"><a href="#cr-loop" data-crjump="loop">RANDOM LOOP LAB</a><a href="#cr-gym" data-crjump="gym">EAR GYM · 귀 훈련</a></p><div id="cr-loop"></div>
<div class="grid"><div class="box"><h2>Random 4-Bar Loop</h2><div class="pads"><button class="rnd" data-loopnew>NEW LOOP · 랜덤 4마디</button><button class="rnd sub" data-suno>SUNO · 프롬프트 복사</button></div><div class="code loopout" style="margin-top:12px;white-space:pre-wrap">NEW LOOP 을 눌러 4마디 루프를 만드세요.</div></div>
<div class="box"><h2>Sound Mixer · DRUM BASS SYNTH AMBIENT</h2>${mixer()}</div></div>
<section class="crgym" id="cr-gym" aria-label="EAR GYM 귀 훈련"><div data-train></div></section>`;
P[4]=`<div class="apphead"><span class="mono">CONTACT</span><b>READY TO CONNECT</b></div>
<div class="grid"><div class="box contact"><div class="row"><span class="mono">Social · Instagram</span><a class="ig" href="https://www.instagram.com/dh._.alstj/" target="_blank" rel="noopener"><b>@dh._.alstj ↗</b></a></div><div class="row"><span class="mono">Messenger · KakaoTalk</span><b>ID: dhalstj._.</b></div><div class="row"><span class="mono">Email · Official Mail</span><a class="ig" href="mailto:oms4911@gmail.com"><b>oms4911@gmail.com ↗</b></a></div><div class="row"><span class="mono">Document · Resume CV</span><button class="btn" data-toast="이력서 PDF는 아직 연결되지 않았습니다.">DOWNLOAD_PDF</button></div></div>
<div class="box"><h2>AI Agent · <span style="color:var(--lime)">ONLINE</span></h2><p>안녕하세요, 작업을 보고 궁금한 점이 있으시면 무엇이든 물어보세요. AI 챗봇은 나의 작업 데이터를 바탕으로 부재 중에도 프로젝트 상담과 이력 정보를 답변합니다.</p><button class="btn" id="openChat2">CHAT 열기</button></div></div>`;
$('pages').innerHTML=P.map((h,i)=>`<section class="page" data-p="${i}" hidden>${h.replace(/§/g,'p'+i)}</section>`).join('');
$('nav').innerHTML=G.modes.map((m,i)=>`<button data-i="${i}"><b><i>0${i+1} </i>${m.id}</b><span>${m.ko}</span></button>`).join('');
$('nav').onclick=e=>{const b=e.target.closest('button');if(!b)return;G.goStation(+b.dataset.i)};
const showMode=i=>{G.page=i;document.querySelectorAll('.page').forEach(p=>p.hidden=+p.dataset.p!==i);document.querySelectorAll('#nav button').forEach(b=>b.setAttribute('aria-current',+b.dataset.i===i));$('view2d').scrollTop=0};
G.on('mode',showMode);showMode(0);
// mixer sync + delegation
const sync=()=>{document.querySelectorAll('input[data-i]').forEach(r=>{const i=+r.dataset.i;if(document.activeElement!==r||+r.value!==G.db[i])r.value=G.db[i]});document.querySelectorAll('output[data-o]').forEach(o=>{const i=+o.dataset.o;o.textContent=G.mute[i]?'MUTE':G.fmtDb(G.db[i])});document.querySelectorAll('button[data-m]').forEach(b=>b.setAttribute('aria-pressed',G.mute[+b.dataset.m]))};
G.on('mixer',sync);sync();
const pg=$('pages');pg.addEventListener('input',e=>{const r=e.target.closest('input[data-i]');if(r)G.setDb(+r.dataset.i,+r.value,'ui')});
pg.addEventListener('click',e=>{const vt=e.target.closest('[data-vtab]');if(vt){document.querySelectorAll('[data-vtab]').forEach(b=>b.setAttribute('aria-selected',b===vt));document.querySelectorAll('[data-vpanel]').forEach(p=>p.hidden=p.dataset.vpanel!==vt.dataset.vtab);return}
const m=e.target.closest('button[data-m]');if(m){G.toggleMute(+m.dataset.m);return}
if(e.target.closest('[data-loopnew]')){A.newLoop();return}if(e.target.closest('[data-suno]')){G.suno();return}
const t=e.target.closest('[data-toast]');if(t){G.toast(t.dataset.toast);return}if(e.target.id==='openChat2')G.openChat()});
G.openLink=u=>{try{const a=document.createElement("a");a.href=u;a.target="_blank";a.rel="noopener";document.body.appendChild(a);a.click();a.remove()}catch(e){window.open(u,"_blank")}G.toast(/^mailto/.test(u)?"메일 앱을 열어요":"인스타그램으로 이동해요")};
G.suno=()=>{const c=A.cfg;if(!c){G.toast('먼저 NEW LOOP 로 루프를 만드세요.');return}try{navigator.clipboard.writeText(c.prompt).then(()=>G.toast('프롬프트를 복사했어요. Suno 에 붙여넣으세요.'),()=>G.toast(c.prompt))}catch(e){G.toast(c.prompt)}window.open('https://suno.com/create','_blank','noopener')};
G.on('loop',c=>document.querySelectorAll('.loopout').forEach(s=>s.innerHTML=`<em>seed</em> ${c.seed.toString(16).toUpperCase()} · <em>${c.bpm} BPM</em> · <em>${c.key} ${c.scn.toLowerCase()}</em> · ${c.gen}\n<em>prompt</em> ${c.prompt}`));
// toolbar
$('bView').onclick=()=>{if(!G.started)return;if(G.view==='2d')G.setView('3d');else if(G.ch.area<0)G.setView('2d');else G.dive()};$('bLoop').onclick=()=>{if(!G.started)return;if(G.isMediaArea(G.ch.area)){G.toast('이 맵에서는 영상 소리를 위해 배경음악이 꺼져 있어요.');return}A.newLoop()};$('bStop').onclick=()=>A.setLoop(false);
let bgm2d=false;G.on('view',v=>{if(v==='2d'){if(G.loop){bgm2d=true;A.setLoop(false)}}else if(bgm2d){bgm2d=false;if(!G.isMediaArea(G.ch.area)&&!G.media.playing())A.setLoop(true)}});
let resume=false;G.ticks.push(()=>{if(!G.started)return;const a=G.ch.area,pl=G.media.playing();if(G.isMediaArea(a)){if(G.loop&&!pl){A.setLoop(false);resume=true}}else if(resume&&!pl){resume=false;A.setLoop(true)}$('bStop').hidden=!G.loop;const bv=$('bView'),tx=G.view==='2d'?'3D':'2D';bv.hidden=false;if(bv.textContent!==tx)bv.textContent=tx});
// wireframe gameplay / frame canvases
const gl=i=>G.mute[i]?0:Math.min(1,Math.pow(10,G.db[i]/20)*1.3);
function draw(c,t){const d=Math.min(devicePixelRatio||1,2),w=c.clientWidth,h=c.clientHeight;if(!w)return;if(c.width!==Math.round(w*d)){c.width=Math.round(w*d);c.height=Math.round(h*d)}
const x=c.getContext('2d');x.setTransform(d,0,0,d,0,0);x.fillStyle='#000';x.fillRect(0,0,w,h);const play=c.dataset.scene==='play',pl=A.pulse,hz=h*.52,sp=play?(.25+gl(1)*1.4):.35;
x.lineWidth=1;x.strokeStyle='rgba(190,190,190,'+(.25+gl(3)*.5)+')';
for(let i=0;i<9;i++){const y=hz+Math.pow((i+(t*sp)%1)/9,2.2)*(h-hz);x.beginPath();x.moveTo(0,y);x.lineTo(w,y);x.stroke()}
for(let i=-10;i<=10;i++){x.beginPath();x.moveTo(w/2+i*w*.015,hz);x.lineTo(w/2+i*w*.17,h);x.stroke()}
const r=G.rng(7);for(let i=0;i<14;i++){const bw=w*(.05+r()*.05),bx=i/14*w,bh=h*(.12+r()*.28)*(1+(play?pl[0]*gl(0)*.25:0)+gl(0)*.15);x.strokeStyle=i%3?'rgba(190,190,190,.8)':'rgba(255,255,255,.85)';x.strokeRect(bx,hz-bh,bw,bh);
const n=Math.floor(gl(2)*5);for(let k=0;k<n;k++){const wy=hz-bh+6+k*9;if(wy<hz-4){x.beginPath();x.moveTo(bx+4,wy);x.lineTo(bx+bw-4,wy);x.stroke()}}}
x.strokeStyle='rgba(255,255,255,'+(.1+gl(3)*.5)+')';for(let i=0;i<5;i++){const y=hz-i*h*.03-(t*8)%12;x.beginPath();x.moveTo(0,y);x.lineTo(w,y);x.stroke()}
const px=w/2+(play?Math.sin(t*.8)*w*.18:w*.12),py=h*.78;x.strokeStyle='#f2f2f2';x.beginPath();x.ellipse(px,py,10,6,0,0,6.3);x.stroke();for(const s of[-1,1])for(let k=0;k<3;k++){x.beginPath();x.moveTo(px+s*6,py);x.lineTo(px+s*(18+k*4),py-10+Math.sin(t*6+k+s)*3);x.lineTo(px+s*(26+k*6),py+8);x.stroke()}}
const cvs=[...document.querySelectorAll('canvas[data-scene]')];G.ticks.push((dt,t)=>{if(G.view==='2d')for(const c of cvs)if(c.offsetParent)draw(c,t)});

// minimap
const mc=$('map'),mx=mc.getContext('2d');
G.ticks.push(()=>{if(G.view!=='3d'||!G.started)return;const c=G.ch,a=c.area,S=224;mx.clearRect(0,0,S,S);mx.strokeStyle='#000';mx.fillStyle='#000';mx.lineWidth=2;mx.font='700 20px monospace';
const sc=a<0?S/150:S/76,ox=a<0?0:G.O(a).x,P=(x,z)=>[S/2+(x-ox)*sc,S/2+z*sc];
if(a>=0){mx.strokeRect(S/2-36*sc,S/2-24*sc,72*sc,46*sc)}
for(const it of G.inter){if(it.area!==a)continue;const[X,Y]=P(it.x,it.z);if(it.kind==='portal'){mx.strokeRect(X-8,Y-8,16,16);if(a<0)mx.fillText(it.dest+1,X-6,Y-12)}else{mx.beginPath();mx.arc(X,Y,4,0,6.3);mx.stroke()}}
const[X,Y]=P(c.pos.x,c.pos.z),s=Math.sin(c.yaw),co=Math.cos(c.yaw);mx.beginPath();mx.moveTo(X+s*10,Y+co*10);mx.lineTo(X-s*6+co*6,Y-co*6-s*6);mx.lineTo(X-s*6-co*6,Y-co*6+s*6);mx.closePath();mx.fill()});
})();
