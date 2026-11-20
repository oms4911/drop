// AI agent speech bubble (Claude via sample capability, local fallback), 2D avatar dock, intro.
(()=>{const $=id=>document.getElementById(id),A=G.audio,bub=$('bubble'),log=$('log'),cin=$('cin'),dock=$('dock');let open=false,hist=[],busy=false;
const CTX=`당신은 크리에이터 오민서(학번 202303099)의 포트폴리오 사이트 속 소금쟁이 아바타 AI 에이전트입니다. 방문자 질문에 한국어로 친근하게 최대 3문장으로 답하세요. 아래 정보에 없는 내용은 지어내지 말고 oms4911@gmail.com 으로 문의하도록 안내하세요.
[정보] 핵심 역량: 영상 엔지니어링 및 사운드 디자인 / 디지털 오디오 워크스테이션 기반 작곡 / 디지털 오디오 워크스테이션 기반 믹스 및 마스터. 이력: 2023~현재 백석예술대학교 재학, 2024.04~2025.10 3군단 군악대 타악병 복무(군에서 디지털·아날로그 믹서도 맡아 운용). 툴: Logic Pro X. 현악(스트링) 작업: Air in G의 바이올린 1·2, 비올라, 첼로 파트는 Kontakt의 Chris Hein Strings 라이브러리를 사용했습니다. 프로젝트: 디아블로(Diablo)(게임 플레이 영상 작업. 음악은 Logic Pro X로 직접 제작, FX와 Ambient는 Splice를 통해 직접 작업), 영상 프로젝트(콘셉트·편집 리듬·사운드 타이밍 연결), Prompter 프로젝트(DEFINE→GENERATE→EDIT 프롬프트 연출). 크리에이티브 R&D: CYMA FORMA RND 복각 신디사이저(버튼 하나로 약 42억 가지 사운드 아이디어, 8개 합성 엔진, 4트랙 유클리디안 시퀀싱, USB-C 4트랙 출력, MIDI/아날로그 싱크). 연락처: 인스타그램 @dh._.alstj, 카카오톡 ID dhalstj._., 이메일 oms4911@gmail.com.`;
const add=(t,me)=>{const p=document.createElement('p');p.textContent=t;p.style.whiteSpace='pre-line';if(me)p.className='me';log.appendChild(p);log.scrollTop=log.scrollHeight;return p};
const local=q=>{q=q.toLowerCase();const m=(...k)=>k.some(x=>q.includes(x));
if(m('메일','mail','이메일'))return'이메일은 oms4911@gmail.com 입니다. 프로젝트 제안은 언제든 보내 주세요.';
if(m('인스타','instagram'))return'인스타그램은 @dh._.alstj 입니다.';if(m('카카오','kakao'))return'카카오톡 ID는 dhalstj._. 입니다.';
if(m('연락','contact'))return'인스타그램 @dh._.alstj, 카카오톡 dhalstj._., 이메일 oms4911@gmail.com 으로 연락할 수 있어요.';
if(m('스트링','string','현악','바이올린','비올라','첼로','violin','viola','cello','kontakt','컨택트','콘택트','크리스','헤인','hein','air in g','에어'))return'Air in G의 바이올린 1·2, 비올라, 첼로 파트는 Kontakt의 Chris Hein Strings로 작업했어요. MOCK UP 맵에서 파트별 믹서로 직접 들어보세요.';
if(m('툴','도구','tool','logic','로직'))return'주로 Logic Pro X로 작곡과 믹스, 마스터를 합니다.';if(m('능력','역량','잘하','할 수','뭐 해','뭐해'))return'영상 엔지니어링과 사운드 디자인, 그리고 디지털 오디오 워크스테이션 기반의 작곡, 믹스 및 마스터를 합니다.';
if(m('군대','군악','군 ','복무','타악','병역','믹서','mixer','military','army'))return'2024년 4월부터 2025년 10월까지 3군단 군악대에서 보직은 타악병으로 복무했어요. 군에서는 디지털 믹서와 아날로그 믹서도 함께 맡았습니다.';
if(m('경력','이력','history','경험','학교','대학','학력'))return'2023년부터 지금까지 백석예술대학교에 재학 중이고, 2024년 4월부터 2025년 10월까지 3군단 군악대에서 타악병으로 복무하며 디지털·아날로그 믹서도 맡았어요.';
if(m('게임','game','neon','디아블로','diablo'))return'디아블로(Diablo)는 게임 플레이 영상에 음악을 입힌 작업이에요. 음악은 Logic Pro X로 직접 만들었고, FX와 Ambient는 Splice를 통해 직접 작업했어요. GAME 모드에서 믹서로 레이어를 조절해 볼 수 있어요.';
if(m('영상','video','목업','mock','프롬프트','prompt'))return'영상 프로젝트는 콘셉트, 편집 리듬, 사운드 타이밍을 하나로 잇고, 프롬프트는 DEFINE → GENERATE → EDIT 순서로 다듬습니다.';
if(m('신디','rnd','사운드','sound','synth','루프','loop'))return'CREATIVE 모드에서는 버튼 하나로 랜덤 4마디 루프를 만들고, 드럼·베이스·신스·Ambient를 믹서로 조절할 수 있어요. 마음에 드는 루프는 Suno 프롬프트로도 이어집니다.';
return'작업, 이력, 사용 툴, 연락처에 대해 물어보세요. 더 자세한 상담은 oms4911@gmail.com 으로 부탁드려요.'};
const CT='\n\n더 자세한 내용은 이메일(oms4911@gmail.com), 인스타그램(@dh._.alstj), 카카오톡(dhalstj._.)으로 직접 문의해 주세요.',tail=a=>a.includes('oms4911')?a:a+CT;
async function ask(q){try{const s=window.claude&&await window.claude.use('sample');if(s){const inp=hist.slice(-8).map((m,i,a)=>({role:m.r,content:(i===0?CTX+'\n\n방문자 대화:\n':'')+m.c}));if(inp[0].role!=='user')inp.shift();const r=await s(inp,{cache:false,modelTier:'quick'});if(r&&r.text)return tail(r.text.trim())}}catch(e){}return tail(local(q))}
$('cform').onsubmit=async e=>{e.preventDefault();const q=cin.value.trim();if(!q||busy)return;cin.value='';add(q,true);hist.push({r:'user',c:q});busy=true;const w=add('…');w.style.color='var(--dim)';const a=await ask(q);w.textContent=a;w.style.color='';hist.push({r:'assistant',c:a});busy=false;A.sfx('blip');log.scrollTop=log.scrollHeight};
G.openChat=()=>{if(open){cin.focus();return}open=true;bub.hidden=false;if(!log.children.length)add('안녕하세요! 작업을 보고 궁금한 점이 있으시면 무엇이든 물어보세요.');A.sfx('blip');place();setTimeout(()=>cin.focus({preventScroll:true}),50)};
G.closeChat=()=>{open=false;bub.hidden=true;cin.blur()};$('bx').onclick=G.closeChat;$('bChat').onclick=()=>{if(G.started)open?G.closeChat():G.openChat()};
function place(){if(!open)return;const w=bub.offsetWidth,h=bub.offsetHeight;let ax,ay;
if(G.view==='3d'){const s=G.headScreen();ax=s.x;ay=s.y-8}else{const pa=$('pav'),r=(pa&&G.page===0&&pa.offsetParent?pa:dock).getBoundingClientRect();ax=r.left+r.width/2;ay=r.top-6}
const L=Math.max(10,Math.min(G.W-w-10,ax-w/2)),Tp=Math.max(52,ay-h-12);bub.style.left=L+'px';bub.style.top=Tp+'px';bub.style.setProperty('--tail',Math.max(18,Math.min(w-18,ax-L))+'px')}
// 2D dock avatar: symbiote blob with tendrils (lines only)
let dt=0,dtap=0;dock.addEventListener('pointerup',()=>{const n=performance.now();if(n-dtap<450){dtap=0;G.openChat()}else dtap=n});
function drawAv(x,t,re,lx,ly){x.lineWidth=2;x.lineJoin='round';x.strokeStyle='#000';const L=1+re*.45,by0=Math.sin(t*3)*2-re*6;
for(let k=0;k<6;k++){const a=k/6*6.28+.5,bx=84+Math.cos(a)*22,by=96+Math.sin(a)*8;x.beginPath();x.moveTo(bx,by);for(let j=1;j<=8;j++){const u=j/8;x.lineTo(bx+Math.cos(a)*u*46*L+Math.sin(t*3+k+u*6+re*8)*(6+re*8)*u,by+Math.sin(a)*u*14*L+u*30*(Math.abs(Math.cos(a))*.8)+Math.cos(t*3+k)*3*u)}x.stroke()}
x.beginPath();for(let i=0;i<=24;i++){const a=i/24*6.283,r=1+Math.sin(a*3+t*2.5)*.08+re*.12*Math.sin(a*5+t*14),px=84+Math.cos(a)*32*r,py=82+Math.sin(a)*26*r*(1+re*.1)+by0;i?x.lineTo(px,py):x.moveTo(px,py)}x.stroke();
x.beginPath();x.ellipse(84,82+by0,18,13,0,0,6.28);x.stroke();x.fillStyle='#fff';for(const s of[-1,1]){const ex=lx*3,ey=by0+ly*2;x.beginPath();x.moveTo(84+s*5+ex,86+ey);x.lineTo(84+s*24+ex,70+ey);x.lineTo(84+s*8+ex,76+ey);x.closePath();x.fill();x.stroke()}}
// profile avatar: follows the pointer with its eyes, reacts when tapped, double-tap opens the AI chat
const PR={re:0,lx:0,ly:0,tx:0,ty:0,wired:false,tap:0,i:-1},LINES=['안녕하세요, 오민서예요.','영상과 사운드를 만들고 있어요.','간질간질해요!','Logic Pro X로 작곡하고 믹스, 마스터까지 해요.','더 눌러도 괜찮아요.','두 번 누르면 AI와 대화할 수 있어요.'];
function hit(){PR.re=1;const pv=$('pav'),n=performance.now();A.sfx('blip');let k;do{k=Math.floor(Math.random()*LINES.length)}while(k===PR.i);PR.i=k;$('pline').textContent=LINES[k];
try{pv.animate([{transform:'scale(1)'},{transform:'scale(1.1,.9)'},{transform:'scale(.96,1.05)'},{transform:'scale(1)'}],{duration:320})}catch(e){}
if(n-PR.tap<380){PR.tap=0;G.openChat()}else PR.tap=n}
function wire(pv){PR.wired=true;pv.addEventListener('pointerup',hit);pv.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();hit()}});
addEventListener('pointermove',e=>{const r=pv.getBoundingClientRect();PR.tx=Math.max(-1,Math.min(1,(e.clientX-r.left-r.width/2)/260));PR.ty=Math.max(-1,Math.min(1,(e.clientY-r.top-r.height/2)/260))})}
G.ticks.push((d,t)=>{place();if(G.view!=='2d')return;const pg0=G.page===0,pv=$('pav');dock.style.display=pg0?'none':'';
if(!pg0){const x=dock.getContext('2d');x.clearRect(0,0,168,168);drawAv(x,t,0,0,0)}
else if(pv&&pv.offsetParent){if(!PR.wired)wire(pv);PR.re=Math.max(0,PR.re-d*1.6);PR.lx+=(PR.tx-PR.lx)*Math.min(1,d*8);PR.ly+=(PR.ty-PR.ly)*Math.min(1,d*8);
const x=pv.getContext('2d');x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,320,320);const S=320/168*1.1;x.scale(S,S);x.translate(160/S-84,168/S-92);drawAv(x,t,PR.re,PR.lx,PR.ly)}});
// intro
let dropped=false;
$('dropper').onclick=()=>{if(dropped)return;dropped=true;const dr=$('dropper'),drop=$('drop'),reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const tip=dr.querySelector('#tip').getBoundingClientRect(),x=tip.left+tip.width/2,y=tip.top;drop.style.left=x+'px';drop.style.top=y+'px';
try{A.newLoop()}catch(e){}dr.classList.add('go');
const land=()=>{drop.style.display='none';G.dropLand();$('intro').classList.add('out')};
if(reduce){G.start();G.dropLand();$('intro').classList.add('out');return}
requestAnimationFrame(()=>drop.classList.add('grow'));
setTimeout(()=>{G.start();G.dropSpawn()},280);
setTimeout(()=>{drop.style.transition='opacity .15s';drop.style.opacity=0;G.dropRelease();$('intro').classList.add('reveal');dr.classList.add('fade');$('ititle').classList.add('fade');setTimeout(()=>$('intro').classList.add('out'),900)},900)};
setTimeout(()=>{$('intro').addEventListener('transitionend',()=>{if($('intro').classList.contains('out'))$('intro').hidden=true})},0);
})();
