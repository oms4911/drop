// THE DEEP: a 2D pixel-art underground hub below the pond (a Dave-the-Diver-like vertical abyss, monochrome + sound-gear theme),
// plus a pixel-art room for each work map (PROFILE / GAME / MOCK UP / CREATIVE / CONTACT) behind the five doors on the abyss floor.
// Free swim with WASD. Hold SPACE to charge a leg, release to fire it; it sticks into rock or gear; SPACE again reels you in (ODM-gear style).
(()=>{const T=THREE,A=G.audio,W=G.world,$=id=>document.getElementById(id),coarse=matchMedia('(pointer:coarse)').matches;
const VH=270,PIT={x:54,z:50},HW=576,HH=1470,HFY=HH-96,DOORS=[0,1,2,3,4].map(i=>({i,x:64+i*112}));
let WW=HW,WH=HH,FY=HFY,mask=null,S=null;
const U=G.under={active:false};G.uActive=()=>U.active;G.uRoom=null;
// ---------- DOM ----------
const css=document.createElement('style');css.textContent=`#under{position:absolute;inset:0;width:100%;height:100%;z-index:6;display:none;image-rendering:pixelated;image-rendering:crisp-edges;background:#000;touch-action:none;cursor:crosshair}
@media (pointer:coarse){body.under #hint{font-size:10px;line-height:1.35;padding:3px 7px;max-width:min(55%,360px);opacity:.92}body.under #hint b{padding:0 3px}body.under #acts button[data-k=mute]{display:inline-block!important;width:58px;height:40px;border-radius:0;font-size:11px}}
#acts .aimk{display:none}@media (pointer:coarse){body.under #acts button[data-k=enter]{position:relative;overflow:visible;background:rgba(255,255,255,.8);box-shadow:inset 0 0 0 10px rgba(0,0,0,.06)}body.under #acts .aimk{display:block;position:absolute;left:50%;top:50%;width:30px;height:30px;margin:-15px 0 0 -15px;border:2px solid #000;border-radius:50%;background:rgba(0,0,0,.28);pointer-events:none}}
#uHi{position:absolute;z-index:7;pointer-events:none;display:none}body.v2d #uHi{display:none!important}#bUp{display:none}body.under #bUp{display:inline-block}body.under #under{display:block}body.under #gl{visibility:hidden}body.under #map,body.under #bFP{display:none!important}body.v2d #under{display:none!important}
body.rot #app{position:fixed;left:0;top:0;width:var(--rw);height:var(--rh);transform:rotate(90deg) translateY(-100%);transform-origin:top left}
#dropAsk{position:absolute;inset:0;z-index:45;display:grid;place-items:center;background:rgba(255,255,255,.35)}#dropAsk[hidden]{display:none}
#dropAsk .dq{background:#fff;border:2px solid #000;padding:22px 26px 20px;min-width:min(320px,calc(100% - 40px));text-align:center;box-shadow:6px 6px 0 rgba(0,0,0,.3)}
#dropAsk b{display:block;font:800 52px/1 var(--fd);letter-spacing:.06em}#dropAsk p{margin:10px 0 18px;font:500 13px var(--fb);color:#333}
#dropAsk .yn{display:flex;gap:10px;justify-content:center}#dropAsk .yn button{min-width:96px;height:44px;border:2px solid #000;font:700 14px var(--fm);letter-spacing:.14em;background:#fff}#dropAsk .yn button.sel{background:#000;color:#fff}`;
document.head.appendChild(css);
const bUp=document.createElement('button');bUp.id='bUp';bUp.textContent='▲ 지상';bUp.title='지상 허브로 바로 올라가기';{const tl=document.querySelector('#top .tools'),bc=$('bChat');if(tl)tl.insertBefore(bUp,bc)}
const hv=document.createElement('canvas');hv.id='uHi';hv.setAttribute('aria-hidden','true');const hx=hv.getContext('2d'),cc=document.createElement('canvas');cc.width=cc.height=40;const ccx=cc.getContext('2d');
{const fr=$('frag');if(fr&&fr.parentNode!==$('app'))$('app').appendChild(fr)}
const cv=document.createElement('canvas');cv.id='under';cv.setAttribute('aria-label','지하 허브 THE DEEP');$('app').insertBefore(cv,$('top'));$('app').insertBefore(hv,$('top'));const cx=cv.getContext('2d');
const ask=document.createElement('div');ask.id='dropAsk';ask.hidden=true;ask.setAttribute('role','dialog');ask.innerHTML='<div class="dq"><b>drop?</b><p>지하 허브 THE DEEP 으로 떨어집니다</p><div class="yn"><button data-yn="1" class="sel">YES</button><button data-yn="0">NO</button></div></div>';$('app').appendChild(ask);
let sel=1;const ynB=[...ask.querySelectorAll('[data-yn]')],setSel=v=>{sel=v;ynB.forEach(b=>b.classList.toggle('sel',+b.dataset.yn===v))};
// ---------- 3x5 pixel font ----------
const FONT={A:'010101111101101',B:'110101110101110',C:'011100100100011',D:'110101101101110',E:'111100110100111',F:'111100110100100',G:'011100101101011',H:'101101111101101',I:'111010010010111',J:'001001001101010',K:'101101110101101',L:'100100100100111',M:'101111111101101',N:'110101101101101',O:'010101101101010',P:'110101110100100',Q:'010101101110011',R:'110101110101101',S:'011100010001110',T:'111010010010010',U:'101101101101111',V:'101101101101010',W:'101101111111101',X:'101101010101101',Y:'101101010010010',Z:'111001010100111',
'0':'111101101101111','1':'010110010010111','2':'110001010100111','3':'110001010001110','4':'101101111001001','5':'111100110001110','6':'011100111101111','7':'111001010010010','8':'111101111101111','9':'111101111001110','?':'110001010000010','.':'000000000000010','-':'000000111000000','/':'001001010100100',':':'000010000010000','·':'000000010000000',' ':'000000000000000',
'_':'000000000000111','@':'011101111100011','(':'010100100100010',')':'010001001001010','+':'000010111010000','#':'101111101111101',"'":'010010000000000',',':'000000000010100','!':'010010010000010','%':'101001010100101','>':'100010001010100','<':'001010100010001','=':'000111000111000'};
const ptext=(c,s,x,y,k,col,al)=>{s=String(s).toUpperCase();const w=s.length*4*k-k;x=Math.round(al==='c'?x-w/2:al==='r'?x-w:x);c.fillStyle=col;for(const ch of s){const g=FONT[ch]||FONT[' '];for(let i=0;i<15;i++)if(g[i]==='1')c.fillRect(x+(i%3)*k,y+((i/3)|0)*k,k,k);x+=4*k}};
const ptextS=(c,s,x,y,k,col,al)=>{ptext(c,s,x+1,y+1,k,'rgba(0,0,0,.6)',al);ptext(c,s,x,y,k,col,al)};
// ---------- pixel kit ----------
const gv=v=>{v=Math.max(0,Math.min(255,v|0));return(0xff000000|(v<<16)|(v<<8)|v)>>>0};
const B4=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5],qz=(v,x,y,st)=>Math.round((v+(B4[(y&3)*4+(x&3)]/16-.5)*st)/st)*st;
const hash=(a,b)=>{let h=Math.imul((a*374761393)^(b*668265263),1274126177);h^=h>>>13;h=Math.imul(h,1103515245);return((h>>>0)%10000)/10000};
const sst=(a,b,x)=>{x=Math.max(0,Math.min(1,(x-a)/(b-a)));return x*x*(3-2*x)};
const K=gv(12);
function kit(w,h){const m=new Uint8Array(w*h),img=new ImageData(w,h),FB=new Uint32Array(img.data.buffer);
const P=(x,y,c,s)=>{x|=0;y|=0;if(x<0||y<0||x>=w||y>=h)return;const i=y*w+x;FB[i]=c;if(s)m[i]=2};
const Rf=(x,y,ww,hh,c,s)=>{for(let j=0;j<hh;j++)for(let i=0;i<ww;i++)P(x+i,y+j,c,s)},Bx=(x,y,ww,hh,f,s=1)=>{Rf(x,y,ww,hh,K,s);Rf(x+1,y+1,ww-2,hh-2,f,s)};
const Ci=(a,b,rd,c,s)=>{for(let j=-rd;j<=rd;j++)for(let i=-rd;i<=rd;i++)if(i*i+j*j<=rd*rd+rd*.8)P(a+i,b+j,c,s)};
const Ri=(a,b,rd,c)=>{for(let t=0;t<6.2832;t+=.45/rd)P(a+Math.round(Math.cos(t)*rd),b+Math.round(Math.sin(t)*rd),c)};
const Ln=(x0,y0,x1,y1,c,s)=>{x0|=0;y0|=0;x1|=0;y1|=0;const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;for(;;){P(x0,y0,c,s);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx}if(e2<=dx){e+=dx;y0+=sy}}};
const txt=(s,x,y,k,v,al='c')=>{ptext({fillStyle:'',fillRect:(a,b,ww,hh)=>Rf(a|0,b|0,ww,hh,gv(v),0)},s,x,y,k,'',al)};
const arch=(x,F,l1,l2)=>{const top=F-66;Rf(x-25,top+14,6,52,gv(88));Rf(x+19,top+14,6,52,gv(88));for(let a=0;a<=Math.PI;a+=.02)for(let rr=19;rr<=25;rr++)P(x+Math.round(Math.cos(a)*rr),top+16-Math.round(Math.sin(a)*rr),gv(rr===25||rr===19?30:88));
for(let j=0;j<52;j++)for(let i=-18;i<=18;i++){if(j<2&&Math.abs(i)>17)continue;P(x+i,top+14+j,gv(6))}for(let a=0;a<=Math.PI;a+=.03)for(let rr=0;rr<19;rr++)P(x+Math.round(Math.cos(a)*rr),top+16-Math.round(Math.sin(a)*rr),gv(6));txt(l1,x,top-22,1,200);txt(l2,x,top-14,1,170)};
const shade=(F,depthT)=>{for(let y=0;y<h;y++){const t=depthT?y/h:.35;for(let x=0;x<w;x++){const i=y*w+x;if(m[i]!==1)continue;let v=44+64*(1-t)+(hash(x>>2,y>>2)-.5)*16+(hash(x>>3,(y>>3)+50)-.5)*10;
if(y>0&&!m[i-w])v+=52;else if(y>1&&!m[i-2*w])v+=28;else if((x>0&&!m[i-1])||(x<w-1&&!m[i+1]))v+=18;if(y<h-1&&!m[i+w])v-=16;if(y>=F&&y<F+4&&(y===F||m[i-w*(y-F)]))v=y===F?190:150-(y-F)*14;FB[i]=gv(qz(v,x,y,10))}}};
const toCanvas=im=>{const c=document.createElement('canvas');c.width=im.width;c.height=im.height;c.getContext('2d').putImageData(im,0,0);return c};
return{m,img,FB,P,Rf,Bx,Ci,Ri,Ln,txt,arch,shade,toCanvas}}
// ---------- hub world ----------
let HUB=null;
function buildHub(){if(HUB)return HUB;const w=HW,h=HH,r=G.rng(4242),k=kit(w,h),{m,P,Rf,Bx,Ci,Ri,Ln,txt}=k;
const LX=new Float32Array(h),RX=new Float32Array(h);
for(let y=0;y<h;y++){let c=w/2+46*Math.sin(y/200)+18*Math.sin(y/97+2),hw=160+48*Math.sin(y/130+1)+22*Math.sin(y/47)+10*Math.sin(y/19);
const top=sst(0,150,y);hw=40+(hw-40)*Math.pow(top,1.25);c=w/2+(c-w/2)*top;const bot=sst(h-380,h-200,y);hw=hw+(w/2-8-hw)*bot;c=c+(w/2-c)*bot;
const j=(hash(y>>2,7)-.5)*4+(hash(y>>3,9)-.5)*5;LX[y]=Math.max(6,c-hw+j);RX[y]=Math.min(w-6,c+hw-j*.7+(hash(y>>2,13)-.5)*4)}
for(let y=0;y<h;y++){const l=LX[y],rr=RX[y],o=y*w;for(let x=0;x<w;x++)if(x<l||x>rr||y>=HFY)m[o+x]=1}
const setM=(x,y)=>{x|=0;y|=0;if(x>=0&&y>=0&&x<w&&y<h)m[y*w+x]=1};
for(let y=230,side=0;y<h-420;y+=100+r()*70,side^=1){const len=26+r()*64,th=8+r()*10,y0=y|0;for(let q=0;q<th;q++){const yy=y0+q,tp=1-Math.pow(q/th,2)*.65;if(side===0)for(let x=LX[yy]-2;x<LX[yy]+len*tp;x++)setM(x,yy);else for(let x=RX[yy]-len*tp;x<RX[yy]+2;x++)setM(x,yy)}}
const free=(x,y,ww,hh)=>{for(let j=-6;j<hh+6;j+=3)for(let i=-6;i<ww+6;i+=3){const xx=x+i,yy=y+j;if(xx<0||xx>=w||yy<0||yy>=h||m[yy*w+xx])return false}return true};
const fillOf=y=>gv(236-y/h*90),midOf=y=>gv(150-y/h*80);
const ST={
speaker(x,y){const F=fillOf(y),M=midOf(y);Bx(x,y,36,48,F);Ci(x+18,y+16,10,K,1);Ci(x+18,y+16,8,M,1);Ci(x+18,y+16,4,K,1);P(x+18,y+16,F);Ci(x+18,y+36,6,K,1);Ci(x+18,y+36,4,M,1);[[3,3],[32,3],[3,44],[32,44]].forEach(([a,b])=>P(x+a,y+b,K))},
cassette(x,y){const F=fillOf(y),M=midOf(y);Bx(x,y,58,34,F);Rf(x+6,y+5,46,9,M,1);Ln(x+9,y+9,x+48,y+9,K,1);Bx(x+15,y+17,28,11,gv(40));Ri(x+21,y+22,3,F);Ri(x+37,y+22,3,F);Ln(x+10,y+33,x+14,y+29,K,1);Ln(x+48,y+33,x+44,y+29,K,1);Ln(x+14,y+29,x+44,y+29,K,1)},
vinyl(x,y){const a=x+24,b=y+24;Ci(a,b,24,K,1);[21,18,15,12].forEach(q=>Ri(a,b,q,gv(70)));Ci(a,b,7,fillOf(y),1);P(a,b,K);Ln(a+9,b-15,a+16,b-9,gv(140))},
fader(x,y){const F=fillOf(y),M=midOf(y);Rf(x,y,7,100,K,1);Rf(x+2,y+2,3,96,M,1);for(let q=0;q<=10;q++){Ln(x-6,y+4+q*9,x-2,y+4+q*9,K);Ln(x+9,y+4+q*9,x+12,y+4+q*9,K)}const ky=y+14+(r()*66|0);Bx(x-7,ky,21,10,F);Ln(x-4,ky+5,x+10,ky+5,K,1)},
bridge(x,y){const ww=96+(r()*60|0),F=fillOf(y),M=midOf(y);Bx(x,y,ww,7,F);Bx(x-6,y-2,8,11,M);Bx(x+ww-2,y-2,8,11,M);for(let q=0;q<3;q++){const a=x+8+r()*(ww-30),b=a+12+r()*24,sg=10+r()*16;for(let t=0;t<=1;t+=.02)P(a+(b-a)*t,y+7+Math.sin(t*Math.PI)*sg,K)}},
mic(x,y){const F=fillOf(y);Rf(x+2,y,4,72,K,1);Ci(x+4,y-6,8,K,1);Ci(x+4,y-6,6,F,1);for(let j=-4;j<=2;j+=2)for(let i=-3;i<=3;i+=2)P(x+4+i,y-6+j,K);Bx(x-10,y+72,28,6,F)},
keys(x,y){const F=fillOf(y);Bx(x,y,84,15,F);for(let q=1;q<12;q++)Ln(x+q*7,y+1,x+q*7,y+13,K,1);[0,1,3,4,5,7,8,10].forEach(q=>Rf(x+5+q*7,y+1,4,8,K,1))}};
const ORDER=['speaker','bridge','cassette','fader','vinyl','keys','mic','bridge'];let n=0;
for(let y=200;y<h-380;y+=110+r()*50){const L=LX[y|0],RR=RX[y|0],t=ORDER[n%ORDER.length],ww=t==='bridge'?160:t==='keys'?84:60,hh=t==='fader'?100:t==='mic'?90:50;
for(let tries=0;tries<8;tries++){const x=(L+14+r()*Math.max(1,RR-L-28-ww))|0,yy=y|0;if(free(x,yy,ww,hh)){ST[t](x,yy);n++;break}}}
DOORS.forEach(d=>k.arch(d.x,HFY,'0'+(d.i+1),G.modes[d.i].id));txt('THE DEEP',w/2,HFY-150,3,120);txt('UNDER HUB',w/2,HFY-126,1,110);
k.shade(HFY,true);
const gI=new ImageData(w,h),GB=new Uint32Array(gI.data.buffer);for(let y=0;y<h;y++){const t=y/h,base=10+214*Math.pow(1-t,1.55),fd=Math.max(0,1-y/700);for(let x=0;x<w;x++){const ray=Math.pow(Math.sin((x*.8+y*.48)/21)*.5+.5,3)*30*fd+Math.pow(Math.sin((x*.5-y*.3)/33)*.5+.5,4)*18*fd;GB[y*w+x]=gv(qz(base+ray,x,y,8))}}
const SILH=Math.ceil(h*.6+420),sil=document.createElement('canvas');sil.width=w;sil.height=SILH;const sc=sil.getContext('2d'),r2=G.rng(99);sc.fillStyle='rgba(120,120,120,.22)';
for(let q=0;q<18;q++){const x=r2()*w,ww=18+r2()*46,y=r2()*SILH,hh=60+r2()*220;sc.fillRect(x|0,y|0,ww|0,hh|0);if(r2()<.6)for(let z=0;z<hh/40-1;z++){const cy=y+20+z*40,rad=Math.min(ww/2-3,12);sc.clearRect((x+ww/2-rad)|0,(cy-rad)|0,(rad*2)|0,(rad*2)|0);sc.fillRect((x+ww/2-rad/2)|0,(cy-rad/2)|0,rad|0,rad|0)}}
sc.fillStyle='rgba(120,120,120,.28)';for(let q=0;q<28;q++){const x0=r2()*w,y0=r2()*SILH,x1=x0+(r2()-.5)*200,sg=20+r2()*60;for(let t=0;t<=1;t+=.004)sc.fillRect((x0+(x1-x0)*t)|0,(y0+Math.sin(t*Math.PI)*sg)|0,1,1)}
return HUB={kind:'hub',WW:w,WH:h,FY:HFY,mask:m,fg:k.toCanvas(k.img),grad:k.toCanvas(gI),sil}}
// ---------- pixel rooms (one per work map; no character-switch pads) ----------
const SETS=()=>G.media&&G.media.sets||{},poster=new Image();poster.src='../media/game-poster.jpg';
const ROOMS=[
{scr:'profile',pads:[['2D PAGE',()=>G.setView('2d')],['AI CHAT',()=>G.openChat&&G.openChat()]],faders:[]},
{scr:'game',pads:[['PLAY',()=>G.media.toggle('game'),()=>SETS().game&&SETS().game.on?'PAUSE':'PLAY'],['2D PAGE',()=>G.setView('2d')]],faders:[4,5,6]},
{scr:'mock',pads:[['PLAY',()=>G.media.toggle('video'),()=>SETS().video&&SETS().video.on?'PAUSE':'PLAY'],['2D PAGE',()=>G.setView('2d')]],faders:[7,8,9,10]},
{scr:'loop',pads:[['NEW LOOP',()=>A.newLoop()],['SUNO',()=>G.suno&&G.suno()],['STOP',()=>A.setLoop(false)],['EAR GYM',()=>G.trainOpen&&G.trainOpen()]],faders:[0,1,2,3]},
{scr:'contact',pads:[['INSTAGRAM',()=>G.openLink('https://www.instagram.com/dh._.alstj/')],['EMAIL',()=>G.openLink('mailto:oms4911@gmail.com')],['AI CHAT',()=>G.openChat&&G.openChat()]],faders:[]}];
const SHORT=['DRM','BASS','SYN','AMB','AMB','MUS','FX','VN1','VN2','VLA','VC'];
const RM=[];
function buildRoom(i){if(RM[i])return RM[i];const w=640,h=330,F=h-72,k=kit(w,h),{m,P,Rf,Bx,Ln,txt}=k,cfg=ROOMS[i];
for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(x<10||x>=w-10||y<22||y>=F)m[y*w+x]=1;
const ledge=(x,y,ww)=>{Bx(x,y,ww,7,gv(206));Bx(x-5,y-2,7,11,gv(130));Bx(x+ww-2,y-2,7,11,gv(130));for(let q=0;q<2;q++){const a=x+8+q*(ww/2),b=a+16;for(let t=0;t<=1;t+=.03)P(a+(b-a)*t,y+7+Math.sin(t*Math.PI)*10,K)}};
ledge(28,138,84);ledge(w-112,138,84);
k.shade(F,false);
const SX=w/2-118,SY=32,SW=236,SH=134;Rf(SX-3,SY-3,SW+6,SH+6,gv(214),0);Rf(SX-2,SY-2,SW+4,SH+4,gv(150),0);Rf(SX,SY,SW,SH,gv(10),0);Rf(w/2-34,SY+SH+3,6,F-SY-SH-3,gv(70),0);Rf(w/2+28,SY+SH+3,6,F-SY-SH-3,gv(70),0);
k.arch(44,F,'THE DEEP','BACK');txt('0'+(i+1),w-60,30,2,190);txt(G.modes[i].id,w-60,44,1,160);txt('UNDER EDITION',w-60,52,1,120);
const gI=new ImageData(w,h),GB=new Uint32Array(gI.data.buffer);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const cx2=x%24,cy2=y%24,wedge=(cx2<12)===(cy2<12)?(cy2%12)/12:(cx2%12)/12,v=28+42*(1-y/h)+wedge*16+((cx2===0||cy2===0)?-10:0);GB[y*w+x]=gv(qz(v,x,y,6))}
const pads=cfg.pads.map(([label,fn,dyn],j)=>({x:124+j*78,label,fn,dyn,t:0})),faders=cfg.faders.map((ch,j)=>({ch,x:w-46-j*40,top:F-80,bot:F-14}));
return RM[i]={kind:'room',i,WW:w,WH:h,FY:F,mask:m,fg:k.toCanvas(k.img),grad:k.toCanvas(gI),sil:null,exit:{x:44},pads,faders,scr:{x:SX+6,y:SY+5,w:SW-12,h:SH-10,kind:cfg.scr}}}
const knobY=f=>f.bot-(G.db[f.ch]+48)/54*(f.bot-f.top),faderAt=(x,y)=>S&&S.kind==='room'?S.faders.find(f=>Math.abs(x-f.x)<6&&y>f.top-6&&y<f.bot+6):null;
const use=sc=>{S=sc;WW=sc.WW;WH=sc.WH;FY=sc.FY;mask=sc.mask};
const solid=(x,y)=>{x|=0;y|=0;if(x<0||x>=WW)return 1;if(y<0)return S&&S.kind==='hub'?0:1;if(y>=WH)return 1;return mask[y*WW+x]};
// ---------- player ----------
const P0={x:HW/2,y:12,vx:0,vy:0,face:1,gr:false,st:'free',ph:0,land:0,fader:null};let p=Object.assign({},P0);
const hook={st:'none',x:0,y:0,dx:0,dy:0,dist:0,R:0},I={l:0,r:0,u:0,d:0,sh:0,q:0,e:0};let charging=false,chg=0,rope=0,fade=1,fadeTo=0,fadeCb=null,title=0,titleTxt=['',''],mouse={x:0,y:0,t:-9},cam={x:0,y:0},VW=360,ox=0,tm=0,near=null,dragF=null;
const HB=(x,y)=>{for(let i=-5;i<=5;i+=2.5)for(const j of[-4,0,3.9])if(solid(x+i,y+j))return true;return false};
const parts=[],fish=[],motes=[],drips=[];
for(let i=0;i<10;i++)fish.push({x:Math.random()*HW,y:260+Math.random()*(HH-500),d:Math.random()<.5?-1:1,s:14+Math.random()*22,ph:Math.random()*6,l:8+(Math.random()*7|0)});
for(let i=0;i<90;i++)motes.push({x:Math.random()*HW,y:Math.random()*HH,s:4+Math.random()*10,a:Math.random()*6});
const burst=(x,y,n=8,v=60)=>{for(let i=0;i<n;i++){const a=Math.random()*6.28,s=v*(.3+Math.random());parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:.4+Math.random()*.3})}};
// ---------- grapple ----------
let aimHeld=false;const stick={on:false,x:0,y:0,m:0};function aimDir(){if(stick.on&&stick.m>.3)return[stick.x,stick.y];let dx=0,dy=0;if(aimHeld||tm-mouse.t<(coarse?.8:3)){dx=mouse.x-p.x;dy=mouse.y-p.y}else{dx=I.r-I.l;dy=I.d-I.u;if(!dx&&!dy){dx=p.face*.55;dy=-.85}}const l=Math.hypot(dx,dy)||1;return[dx/l,dy/l]}
const range=()=>70+270*chg;
function fire(){charging=false;const[dx,dy]=aimDir();hook.st='fly';hook.x=p.x+dx*4;hook.y=p.y+dy*4;hook.dx=dx;hook.dy=dy;hook.dist=0;hook.R=range();if(Math.abs(dx)>.15)p.face=dx>0?1:-1;A.sfx&&A.sfx('tab')}
function toCling(){p.fader=hook.st==='stuck'&&hook.fader?hook.fader:null;hook.fader=null;p.st='cling';hook.st='none';p.vx=p.vy=0;p.stall=0;unstick();A.sfx&&A.sfx('hang')}
function useNear(){const n=near;if(!n)return false;if(n.k==='door'){goRoom(n.i);return true}if(n.k==='exit'){goHub(S.i);return true}if(n.k==='pad'){n.o.t=.25;A.sfx&&A.sfx('blip');burst(n.o.x,FY-4,8,50);n.o.fn();return true}return false}
function press(k){if(fadeTo||!U.active)return;
if(k==='space'){if(p.st==='attached'){p.st='reeling';A.sfx&&A.sfx('tick');return}if(p.st==='reeling'){p.st='free';hook.st='back';return}
if(near&&near.k!=='fader'&&hook.st==='none'&&useNear())return;if(hook.st==='none'||hook.st==='back'){charging=true;chg=0;A.sfx&&A.sfx('tick')}return}
if(k==='up'){if(p.st==='cling'&&!p.fader)p.st='free';else if(p.st==='reeling'){p.st='free';hook.st='back'}return}
if(k==='down'){if(p.st==='attached'||p.st==='reeling'){p.st='free';hook.st='back'}else if(p.st==='cling'&&!p.fader)p.st='free';return}
if(k==='mute'&&(p.fader||near&&near.k==='fader')){G.toggleMute((p.fader||near.o).ch);A.sfx&&A.sfx('tick')}}
function release(k){if(k==='space'&&charging&&U.active)fire()}
// ---------- scenes ----------
function orient(){const want=U.active&&coarse;const so=screen.orientation;try{if(so&&so.lock)so.lock(want?'landscape':'portrait').catch(()=>{})}catch(e){}
const rot=want&&matchMedia('(orientation: portrait)').matches;document.documentElement.style.setProperty('--rw',innerHeight+'px');document.documentElement.style.setProperty('--rh',innerWidth+'px');
if(rot!==!!G.rot){G.rot=rot;document.body.classList.toggle('rot',rot);setTimeout(()=>dispatchEvent(new Event('resize')),30)}}
addEventListener('resize',()=>{if(coarse)orient()});addEventListener('orientationchange',()=>setTimeout(orient,200));
function show(on){U.active=on;document.body.classList.toggle('under',on);if(!on)G.uRoom=null;orient()}
function resetP(){Object.assign(p,P0);hook.st='none';charging=false;p.st='free';near=null;dragF=null}
function placeCam(){cam.x=Math.max(0,Math.min(Math.max(0,WW-VW),p.x-VW/2));cam.y=Math.max(0,Math.min(WH-VH,p.y-VH*.45))}
function enterHub(o){use(buildHub());G.uRoom=null;resetP();if(o.door>=0){const d=DOORS[o.door];p.x=d.x;p.y=HFY-5;title=0;burst(p.x,p.y,16,90)}else{p.x=HW/2;p.y=10;p.vy=90;title=2.6;titleTxt=['THE DEEP','HOLD SPACE · FIRE A LEG · SPACE AGAIN TO REEL'];burst(p.x,4,14,70)}placeCam()}
function enterRoom(i){use(buildRoom(i));G.uRoom=i;resetP();p.x=72;p.y=FY-5;title=2.2;titleTxt=[G.modes[i].id,'UNDER EDITION · '+G.modes[i].sub];burst(p.x,p.y,14,80);placeCam();G.setMode(i,true)}
const stopRoomMedia=()=>{const s=SETS();['game','video'].forEach(id=>{if(s[id]&&s[id].on)G.media.toggle(id)})};
U.enter=(o={})=>{G.fp=false;G.emit&&G.emit('fp',false);show(true);G.ch.state='walk';G.ch.vx=G.ch.vz=0;fade=1;fadeTo=0;enterHub(o);A.sfx&&A.sfx('splash')};
function leave(cb){if(fadeTo)return;fadeTo=1;fadeCb=cb}
function goRoom(i){leave(()=>{stopRoomMedia();enterRoom(i)})}
function goHub(door){leave(()=>{stopRoomMedia();enterHub({door})})}
U.toZone=i=>{if(!U.active)return;if(G.view==='2d'){stopRoomMedia();enterRoom(i);fade=0;return}if(S.kind==='room'&&S.i===i)return;goRoom(i)};
U.surface=()=>{if(U.active&&!fadeTo)exitTop()};bUp.addEventListener('click',()=>U.surface());
function exitTop(){leave(()=>{stopRoomMedia();show(false);G.teleport(-1,PIT.x,PIT.z-6.5);G.ch.state='fall';G.ch.vy=14;W.ripple(PIT.x,PIT.z,0x000000,4,0);A.sfx&&A.sfx('splash')})}
U.hint=()=>{const b=s=>`<b>${s}</b>`,SP=coarse?'ACT':'SPACE';
if(coarse){if(near&&near.k==='door')return`${b('ACT')} ${G.modes[near.i].id}`;if(near&&near.k==='exit')return`${b('ACT')} 돌아가기`;if(near&&near.k==='pad')return`${b('ACT')} ${near.o.dyn?near.o.dyn():near.o.label}`;
if(p.fader){const c=p.fader.ch;return`${G.mute[c]?'MUTE':Math.round(G.db[c])+'dB'} · ${b('▲▼')} 볼륨 · ${b('◀▶')} 내리기`}if(near&&near.k==='fader')return`페이더 · ${b('ACT')} 끌어 조준 → 발사`;
if(p.st==='attached')return`${b('ACT')} 끌려가기`;if(p.st==='reeling')return`${b('ACT')} 놓기`;if(p.st==='cling')return`${b('ACT 길게')} 다음 발사`;return`${b('조이스틱')} 이동 · ${b('ACT')} 누른 채 끌어 조준 → 떼면 발사`}
if(near&&near.k==='door')return`${b(SP)} ${G.modes[near.i].id} 도트 맵으로 들어가기`;
if(near&&near.k==='exit')return`${b(SP)} THE DEEP 으로 돌아가기`;
if(near&&near.k==='pad')return`${b(SP)} ${near.o.dyn?near.o.dyn():near.o.label}`;
if(p.fader){const c=p.fader.ch;return`${b(G.chName(c))} ${G.mute[c]?'MUTE':G.fmtDb(G.db[c])} · ${b(coarse?'▲ ▼':'W S')} 볼륨 · ${b(coarse?'MUTE':'M')} 음소거 · ${b(coarse?'◀ ▶':'A D')} 내려오기`}
if(near&&near.k==='fader'){const c=near.o.ch;return`${b(G.chName(c))} ${G.mute[c]?'MUTE':G.fmtDb(G.db[c])} · ${b(coarse?'ACT 길게':'SPACE 길게')} 페이더에 다리 발사 → 박히면 ${b(SP)} 달라붙기`}
if(p.st==='attached')return`${b(SP)} 끌려가기 · ${b(coarse?'▼':'S')} 놓기`;
if(p.st==='reeling')return`${b(SP)} / ${b(coarse?'▲':'W')} 놓고 날아가기`;
if(p.st==='cling')return`${b(coarse?'ACT 길게':'SPACE 길게')} 다음 다리 발사 · ${b(coarse?'조이스틱':'WASD')} 움직이면 놓기`;
return coarse?`조이스틱 자유 이동·조준 · ${b('ACT 길게')} 다리 차징 → 놓으면 발사 · 박히면 ${b('ACT')} 끌려가기`:`${b('WASD')} 자유 이동 · ${b('SHIFT')} 빠르게 · ${b('SPACE 길게')} 다리 차징 → 놓으면 발사 · ${b('마우스')} 조준`+(S&&S.kind==='hub'?' · 맨 위로 올라가면 지상':'')};
U.act=(n,d)=>{if(n==='mute'){if(d)press('mute');return}const m={left:'l',right:'r',up:'u',down:'d'}[n];if(m){const was=I[m];I[m]=d?1:0;if(d&&!was&&(m==='u'||m==='d'))press(n)}};
// ---------- surface pit (3D, hub corner) ----------
{const hub=W.hub,g=new T.Group();g.position.set(PIT.x,.05,PIT.z);hub.add(g);
const disc=new T.Mesh(new T.CircleGeometry(4.4,40),new T.MeshBasicMaterial({color:0x050505}));disc.rotation.x=-Math.PI/2;disc.position.y=.06;disc.renderOrder=2;g.add(disc);
[5,5.6,6.4].forEach((rr,i)=>{const m=G.poly(rr,48,0x000000,1-i*.28);m.rotation.x=-Math.PI/2;m.position.y=.08;g.add(m)});
const sp=new T.Group();for(let q=0;q<3;q++){const qq=[];for(let t=0;t<1;t+=.02){const a=t*7+q*2.09,rr=4.2*(1-t)+.3,b=a+.14,r3=4.2*(1-t-.02)+.3;qq.push(Math.cos(a)*rr,0,Math.sin(a)*rr,Math.cos(b)*r3,0,Math.sin(b)*r3)}sp.add(G.lineset(qq,0xbdbdbd,.9))}sp.position.y=.1;g.add(sp);
const tx=G.text('DROP?',1.3,0x000000,1);tx.rotation.x=-Math.PI/2;tx.position.set(0,.09,-7.4);g.add(tx);const tx2=G.text('SPACE = LOOK INSIDE',.55,0x2b2b2b,1);tx2.rotation.x=-Math.PI/2;tx2.position.set(0,.09,7.6);g.add(tx2);
if(W.hubScenery)W.hubScenery.children.forEach(c=>{if(Math.hypot(c.position.x-PIT.x,c.position.z-PIT.z)<11)c.visible=false});
G.inter.push({area:-1,x:PIT.x,z:PIT.z,r:4.6,kind:'use',label:'구덩이 들여다보기 (drop?)',fn:()=>U.ask()});
G.ticks.push(dt=>{if(G.area<0)sp.rotation.y-=dt*.9})}
// ---------- drop? dialog ----------
U.ask=()=>{if(U.active||!ask.hidden)return;setSel(1);ask.hidden=false;A.sfx&&A.sfx('blip')};
const closeAsk=yes=>{ask.hidden=true;if(yes&&G.startPortal&&G.ch.state==='walk')G.startPortal({x:PIT.x,z:PIT.z,kind:'portal',dest:'under',from:-1})};
ynB.forEach(b=>b.addEventListener('click',()=>closeAsk(b.dataset.yn==='1')));ask.addEventListener('click',e=>{if(e.target===ask)closeAsk(false)});
addEventListener('keydown',e=>{if(ask.hidden)return;const c=e.code;if(['ArrowLeft','ArrowRight','KeyA','KeyD','Tab'].includes(c))setSel(sel?0:1);else if(c==='Space'||c==='Enter')closeAsk(!!sel);else if(c==='Escape')closeAsk(false);else return;e.preventDefault();e.stopImmediatePropagation()},true);
// ---------- input ----------
const KM={KeyA:'l',ArrowLeft:'l',KeyD:'r',ArrowRight:'r',KeyW:'u',ArrowUp:'u',KeyS:'d',ArrowDown:'d'};
addEventListener('keydown',e=>{if(!U.active||G.view!=='3d')return;const t=e.target.tagName;if(t==='INPUT'||t==='TEXTAREA')return;const c=e.code;
if(c in KM){const k=KM[c];if(!I[k]&&(k==='u'||k==='d'))press(k==='u'?'up':'down');I[k]=1}else if(c==='Space'){if(!e.repeat)press('space')}else if(c==='ShiftLeft'||c==='ShiftRight')I.sh=1;else if(c==='KeyM'){if(!e.repeat)press('mute')}else if(c!=='KeyV')return;e.preventDefault();e.stopImmediatePropagation()},true);
addEventListener('keyup',e=>{if(!U.active)return;const c=e.code;if(c in KM)I[KM[c]]=0;else if(c==='Space')release('space');else if(c==='ShiftLeft'||c==='ShiftRight')I.sh=0;else return;e.stopImmediatePropagation()},true);
addEventListener('blur',()=>{for(const k in I)I[k]=0;if(charging)fire()});
const local=e=>{if(G.rot)return{x:e.clientY,y:innerWidth-e.clientX};const b=cv.getBoundingClientRect();return{x:e.clientX-b.left,y:e.clientY-b.top}};
const toWorld=e=>{const l=local(e);return{x:l.x/cv.clientWidth*VW+cam.x-ox,y:l.y/cv.clientHeight*VH+cam.y}};
const faderHit=w=>S&&S.kind==='room'?S.faders.find(f=>Math.abs(w.x-f.x)<10&&w.y>f.top-8&&w.y<f.bot+8):null;
const setFader=(f,y)=>{const t=Math.max(0,Math.min(1,(f.bot-y)/(f.bot-f.top)));G.setDb(f.ch,-48+t*54,'drag')};
cv.addEventListener('pointermove',e=>{const w=toWorld(e);if(dragF){setFader(dragF,w.y);return}if(e.pointerType!=='mouse'&&!charging)return;mouse.x=w.x;mouse.y=w.y;mouse.t=tm});
cv.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;cv.setPointerCapture(e.pointerId);const w=toWorld(e);const f=faderHit(w);if(f){dragF=f;setFader(f,w.y);return}mouse.x=w.x;mouse.y=w.y;mouse.t=tm;aimHeld=true;press('space')});
const pu=()=>{if(dragF){dragF=null;return}release('space');aimHeld=false};cv.addEventListener('pointerup',pu);cv.addEventListener('pointercancel',pu);
{const ab=document.querySelector('#acts button[data-k="enter"]');if(ab){const kn=document.createElement('i');kn.className='aimk';ab.appendChild(kn);
const sv=e=>{const r=ab.getBoundingClientRect();let x=(e.clientX-r.left-r.width/2)/(r.width/2),y=(e.clientY-r.top-r.height/2)/(r.height/2);if(G.rot){const q=x;x=y;y=-q}const m=Math.hypot(x,y);stick.m=m;if(m>0){stick.x=x/m;stick.y=y/m}const k=Math.min(1,m);kn.style.transform=`translate(${stick.x*k*30}px,${stick.y*k*30}px)`};
ab.addEventListener('pointerdown',e=>{if(!U.active)return;stick.on=true;stick.m=0;sv(e);press('space')});ab.addEventListener('pointermove',e=>{if(U.active&&stick.on)sv(e)});
const u=()=>{if(!U.active)return;release('space');stick.on=false;stick.m=0;kn.style.transform=''};ab.addEventListener('pointerup',u);ab.addEventListener('pointercancel',u)}}
const hs=G.headScreen;G.headScreen=()=>{if(!U.active)return hs();const k=cv.clientHeight/VH;return{x:(p.x-cam.x+ox)*k,y:(p.y-cam.y-8)*k}};
// ---------- simulation ----------
function unstick(){if(!HB(p.x,p.y))return;for(let r=1;r<=12;r++)for(let q=0;q<16;q++){const a=q/16*6.2832,x=p.x+Math.round(Math.cos(a)*r),y=p.y+Math.round(Math.sin(a)*r);if(!HB(x,y)){p.x=x;p.y=y;return}}}
function step(dt){unstick();const ax=I.r-I.l;if(charging)chg=Math.min(1,chg+dt/.85);
if(hook.st==='fly'){let s=980*dt;while(s>0){const st=Math.min(2,s);s-=st;hook.x+=hook.dx*st;hook.y+=hook.dy*st;hook.dist+=st;{const f=faderAt(hook.x,hook.y);if(f){hook.fader=f;hook.x=f.x;hook.y=knobY(f);hook.st='stuck';p.st='attached';p.fader=null;rope=Math.max(8,Math.hypot(hook.x-p.x,hook.y-p.y));A.sfx&&A.sfx('slam');burst(hook.x,hook.y,10,50);break}}if(solid(hook.x,hook.y)){hook.fader=null;p.fader=null;hook.x-=hook.dx*1.5;hook.y-=hook.dy*1.5;hook.st='stuck';p.st='attached';rope=Math.max(8,Math.hypot(hook.x-p.x,hook.y-p.y));A.sfx&&A.sfx('slam');burst(hook.x,hook.y,10,50);break}if(hook.dist>=hook.R||hook.y<-30){hook.st='back';break}}}
else if(hook.st==='stuck'&&hook.fader){hook.x=hook.fader.x;hook.y=knobY(hook.fader)}
else if(hook.st==='back'){const dx=p.x-hook.x,dy=p.y-hook.y,d=Math.hypot(dx,dy),m=1500*dt;if(d<=m)hook.st='none';else{hook.x+=dx/d*m;hook.y+=dy/d*m}}
if(p.st==='cling'){p.vx=p.vy=0;if(p.fader){const f=p.fader,dv=I.u-I.d;if(dv)G.setDb(f.ch,G.db[f.ch]+dv*30*dt,'key');p.x=f.x;p.y=knobY(f)-8;if(ax&&!charging){p.st='free';p.fader=null}}else if((ax||I.u||I.d)&&!charging)p.st='free'}
else if(p.st==='reeling'){const dx=hook.x-p.x,dy=hook.y-p.y,d=Math.hypot(dx,dy);if(d<7){toCling()}else{p.vx+=dx/d*2000*dt;p.vy+=dy/d*2000*dt;const sp=Math.hypot(p.vx,p.vy);if(sp>540){p.vx*=540/sp;p.vy*=540/sp}}}
else{const ay=I.d-I.u;let mx=ax,my=ay;const ml=Math.hypot(mx,my);if(ml){mx/=ml;my/=ml}
if(p.st==='attached'){p.vx+=mx*300*dt;p.vy+=my*300*dt;p.vx*=Math.pow(.4,dt);p.vy*=Math.pow(.4,dt)}
else{const sp=I.sh?175:115,k=Math.min(1,dt*(ml?6:3));p.vx+=(mx*sp-p.vx)*k;p.vy+=(my*sp-p.vy)*k}}
const wasGr=p.gr;let dx=p.vx*dt,dy=p.vy*dt;const n=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))/1.5));dx/=n;dy/=n;let hitY=false;if(p.fader&&p.st!=='cling')p.fader=null;
const x0=p.x,y0=p.y;for(let i=0;i<n&&p.st!=='cling';i++){let bx=false,by=false;if(!HB(p.x+dx,p.y))p.x+=dx;else if((wasGr||p.st==='reeling')&&!HB(p.x+dx,p.y-3)){p.x+=dx;p.y-=3}else{bx=true;p.vx=0;dx=0}
if(!HB(p.x,p.y+dy))p.y+=dy;else if(p.st==='reeling'&&!HB(p.x+Math.sign(hook.x-p.x||1)*2,p.y+dy)){p.x+=Math.sign(hook.x-p.x||1)*2;p.y+=dy}else{by=true;if(dy>0)hitY=true;p.vy=0;dy=0}
if(p.st==='reeling'&&bx&&by){toCling();break}}
if(p.st==='reeling'){const mv=Math.hypot(p.x-x0,p.y-y0);p.stall=mv<.3?(p.stall||0)+dt:0;if(p.stall>.12)toCling()}
p.gr=p.st!=='cling'&&(hitY||HB(p.x,p.y+1));if(p.gr&&!wasGr&&p.land>.15){burst(p.x,p.y+4,6,40);A.sfx&&A.sfx('tick')}p.land=p.gr?0:p.land+dt;
if(p.st==='attached'){const ddx=p.x-hook.x,ddy=p.y-hook.y,d=Math.hypot(ddx,ddy);if(d>rope){const nx=ddx/d,ny=ddy/d,tx=hook.x+nx*rope,ty=hook.y+ny*rope;if(!HB(tx,ty)){p.x=tx;p.y=ty}const vr=p.vx*nx+p.vy*ny;if(vr>0){p.vx-=nx*vr;p.vy-=ny*vr}}}
if(Math.abs(p.vx)>6&&p.st!=='cling')p.face=p.vx>0?1:-1;if(charging){const[a]=aimDir();if(Math.abs(a)>.15)p.face=a>0?1:-1}
p.ph+=dt*(p.gr?Math.abs(p.vx)*.18:4);
// what is the player standing next to?
near=null;const low=p.y>FY-44;
if(S.kind==='hub'){if(low)DOORS.forEach(d=>{if(Math.abs(p.x-d.x)<16)near={k:'door',i:d.i}});if(p.y<3&&!fadeTo)exitTop()}
else{if(low&&Math.abs(p.x-S.exit.x)<16)near={k:'exit'};if(low)S.pads.forEach(o=>{if(Math.abs(p.x-o.x)<26)near={k:'pad',o}});if(p.y>FY-110)S.faders.forEach(o=>{if(Math.abs(p.x-o.x)<20)near={k:'fader',o}});
S.pads.forEach(o=>o.t=Math.max(0,o.t-dt))}
if(S.kind==='hub'){for(const f of fish){f.x+=f.d*f.s*dt;f.ph+=dt*6;if(f.x<-20)f.x=WW+20;if(f.x>WW+20)f.x=-20}
for(const m of motes){m.y-=m.s*dt*.4;m.x+=Math.sin(tm*.6+m.a)*dt*4;if(m.y<0)m.y+=WH}
if(Math.random()<dt*1.6)drips.push({x:WW/2+(Math.random()-.5)*60,y:2,vy:40});for(let i=drips.length-1;i>=0;i--){const d=drips[i];d.vy+=500*dt;d.y+=d.vy*dt;if(solid(d.x,d.y)||d.y>WH){burst(d.x,d.y-2,4,30);drips.splice(i,1)}}}else drips.length=0;
for(let i=parts.length-1;i>=0;i--){const q=parts[i];q.l-=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=120*dt;if(q.l<=0)parts.splice(i,1)}}
// ---------- drawing ----------
let DC=cx,DX=0,DY=0;const D=(x,y,w=1,h=1)=>DC.fillRect(Math.round(x-cam.x+ox+DX),Math.round(y-cam.y+DY),w,h);
function lineW(x0,y0,x1,y1){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))|0;for(let i=0;i<=n;i++){const t=n?i/n:0;D(x0+(x1-x0)*t,y0+(y1-y0)*t)}}
function drawChar(){const X=p.x,Y=p.y,f=p.face,sq=p.st==='cling'?.9:charging?1-chg*.15:1,cx=DC;
cx.fillStyle='#0d0d0d';const legs=[];for(let s=-1;s<=1;s+=2)for(let q=0;q<4;q++){const bx=X+s*(1+q*1.3),by=Y+1;let ex,ey,kx,ky;
if(p.st==='cling'){ex=X+s*(6+q*1.5);ey=Y+(q-1.5)*3;kx=(bx+ex)/2+s*2;ky=Math.min(by,ey)-3}
else if(p.gr){const lift=Math.max(0,Math.sin(p.ph+q*1.6+(s>0?0:3.14)))*2.5;ex=X+s*(6+q*1.6);ey=Y+4-lift;kx=X+s*(5+q*1.1);ky=Y-1-lift*.5}
else{ex=X+s*(5+q*1.4);ey=Y+6+Math.sin(tm*8+q)*.8;kx=X+s*(6+q);ky=Y+1}legs.push([bx,by,kx,ky,ex,ey])}
legs.forEach(([a,b,c,d2,e,g])=>{lineW(a,b,c,d2);lineW(c,d2,e,g)});
for(let j=-4;j<=4;j++)for(let i=-6;i<=6;i++){if(i*i/36+j*j/(16*sq*sq)>1)continue;cx.fillStyle=(i*i/36+(j-1)*(j-1)/(16*sq*sq)>1&&j<0)?'#6a6a6a':'#0d0d0d';D(X+i,Y+j*sq)}
{const dk=S.kind==='hub'?sst(250,1000,Y):.5;if(dk>.2){cx.fillStyle=`rgba(220,220,220,${Math.min(.9,dk)})`;for(let j=-5;j<=5;j++)for(let i=-7;i<=7;i++){const o=i*i/49+j*j/25,n=i*i/36+j*j/16;if(o<=1.05&&n>1)D(X+i,Y+j*sq)}}}
cx.fillStyle='#ffffff';D(X+f*1,Y-2);D(X+f*2,Y-2);D(X+f*2,Y-1);D(X+f*4,Y-2);D(X+f*5,Y-2);D(X+f*4,Y-1)}
const fmt=t=>{t=Math.max(0,t||0);return String(Math.floor(t/60)).padStart(2,'0')+':'+String(Math.floor(t%60)).padStart(2,'0')};
const wrap=(s,n)=>{const o=[];let l='';for(const w of String(s).split(' ')){if((l+' '+w).trim().length>n){o.push(l);l=w}else l=(l+' '+w).trim()}o.push(l);return o};
const ldb=v=>v>1e-12?10*Math.log10(v):-120;
function drawScreen(t){const s=S.scr,X=Math.round(s.x-cam.x+ox),Y=Math.round(s.y-cam.y),w=s.w,h=s.h,L=(str,i,col='#e6e6e6',k=1)=>ptext(cx,str,X+6,Y+6+i*9,k,col);
cx.fillStyle='#0b0b0b';cx.fillRect(X,Y,w,h);
if(s.kind==='profile'){ptext(cx,'OH MINSEO / 202303099',X+6,Y+6,2,'#fff');L('CORE COMPETENCIES',2,'#9a9a9a');L('01 VIDEO ENGINEERING + SOUND DESIGN',3);L('02 DAW COMPOSITION',4);L('03 DAW MIX + MASTER',5);L('MASTER TOOL  LOGIC PRO X',6,'#bdbdbd');
L('HISTORY',8,'#9a9a9a');L('2023 - PRESENT   BAEKSEOK ARTS UNIVERSITY',9);L('2024.04 - 2025.10   3RD CORPS BAND · PERCUSSION',10);L('AI CHAT PAD = ASK ME ANYTHING',12,'#8a8a8a')}
else if(s.kind==='contact'){ptext(cx,'READY TO CONNECT_',X+6,Y+6,2,'#fff');L('INSTAGRAM',2,'#9a9a9a');L('@DH._.ALSTJ',3);L('KAKAOTALK',5,'#9a9a9a');L('ID: DHALSTJ._.',6);L('EMAIL',8,'#9a9a9a');L('OMS4911@GMAIL.COM',9);L('AI AGENT · PRESS THE AI CHAT PAD',11,'#bdbdbd')}
else if(s.kind==='loop'){const c=A.cfg;ptext(cx,'RND LOOP LAB',X+6,Y+6,2,'#fff');if(!c){L('PRESS THE NEW LOOP PAD',2,'#bdbdbd');L('RANDOM 4 BARS · DRUM BASS SYNTH AMBIENT',3,'#8a8a8a')}
else{L('SEED '+c.seed.toString(16).toUpperCase().padStart(8,'0')+'  '+c.gen,2,'#9a9a9a');L(c.bpm+' BPM   KEY '+c.key+' '+c.scn,3);L('MOOD '+c.mood+'   '+c.ins[0],4);L('CHORDS '+c.prog.map(d=>d+1).join(' - ')+'   4 BARS',5);L('SUNO PROMPT',7,'#9a9a9a');wrap(c.prompt.toUpperCase(),52).slice(0,3).forEach((q,i)=>L(q,8+i,'#d6d6d6'))}
for(let q=0;q<4;q++){const v=G.loop?Math.min(1,(A.pulse[q]||0))*(G.mute[q]?0:1):0,bh=Math.round(4+v*18);cx.fillStyle=G.loop?'#fff':'#444';cx.fillRect(X+w-60+q*13,Y+h-6-bh,9,bh);ptext(cx,SHORT[q][0],X+w-58+q*13,Y+h-4,1,'#777')}}
else if(s.kind==='game'){const st=SETS().game;
if(!(st&&st.on)){cx.fillStyle='rgba(0,0,0,.55)';cx.fillRect(X,Y+h-16,w,16);ptext(cx,'DIABLO · PRESS THE PLAY PAD',X+w/2,Y+h-11,1,'#fff','c')}else{const m=st.v;cx.fillStyle='rgba(0,0,0,.55)';cx.fillRect(X,Y+h-10,w,10);cx.fillStyle='#fff';if(m){cx.fillRect(X+2,Y+h-4,(w-4)*(m.duration?m.currentTime/m.duration:0),2);ptext(cx,fmt(m.currentTime),X+3,Y+h-9,1,'#fff')}}}
else if(s.kind==='mock'){const st=SETS().video,r=st&&st.mr;ptext(cx,(st&&st.title||'AIR IN G').toUpperCase(),X+6,Y+6,2,'#fff');ptext(cx,st&&st.on?'NOW PLAYING':'PRESS THE PLAY PAD',X+w-6,Y+8,1,st&&st.on?'#fff':'#8a8a8a','r');
const bx=X+6,by=Y+92,bh=66;cx.fillStyle='#262626';for(let d=0;d>=-84;d-=12){const yy=by-Math.round((d+84)/84*bh);cx.fillRect(bx,yy,124,1)}
for(let b=0;b<31;b++){const d=r?ldb(r.band[b]):-120,hh=Math.max(0,Math.round((Math.max(-84,Math.min(0,d))+84)/84*bh));cx.fillStyle='#e6e6e6';if(hh)cx.fillRect(bx+b*4,by-hh,3,hh);const hd=r?r.bh[b]:-120;if(hd>-84){cx.fillStyle='#fff';cx.fillRect(bx+b*4,by-Math.round((Math.min(0,hd)+84)/84*bh),3,1)}}
ptext(cx,'RTA 1/3 OCT',bx,by+4,1,'#8a8a8a');
const px=X+142;const meters=r?[...r.stem.map((o,i)=>[SHORT[7+i],o]),['L',r.out[0]],['R',r.out[1]]]:[['VN1'],['VN2'],['VLA'],['VC'],['L'],['R']];
meters.forEach(([n,o],i)=>{const xx=px+i*12+(i>=4?6:0);cx.fillStyle='#262626';cx.fillRect(xx,by-bh,8,bh);if(o){const hh=Math.round((Math.max(-60,Math.min(0,o.pk))+60)/60*bh);cx.fillStyle='#f0f0f0';for(let yy=0;yy<hh;yy+=2)cx.fillRect(xx+1,by-1-yy,6,1);if(o.hold>-60){cx.fillStyle='#fff';cx.fillRect(xx,by-Math.round((Math.min(0,o.hold)+60)/60*bh),8,1)}}ptext(cx,n[0],xx+2,by+4,1,'#8a8a8a')});
const f1=v=>isFinite(v)&&v>-119?v.toFixed(1):'--.-';ptext(cx,'M '+f1(r?r.M:-Infinity)+'  S '+f1(r?r.S:-Infinity)+'  I '+f1(r?r.I:-Infinity)+' LUFS',X+6,Y+h-8,1,'#d6d6d6')}}
function drawRoomGear(t){S.pads.forEach((o,j)=>{const on=near&&near.k==='pad'&&near.o===o,pr=o.t>0?2:0,X=o.x-22,Y=FY-5+pr;cx.fillStyle='#0d0d0d';D(X,Y,44,5-pr);cx.fillStyle=pr?'#0d0d0d':on?'#ffffff':'#d8d8d8';D(X+1,Y+1,42,3-pr);
const lb=o.dyn?o.dyn():o.label;ptextS(cx,lb,o.x-cam.x+ox,FY-16-cam.y,1,on?'#fff':'#cfcfcf','c');if(on&&Math.floor(t*3)%2===0){cx.fillStyle='#fff';D(X-2,Y-2,48,1)}});
S.faders.forEach(f=>{const on=near&&near.k==='fader'&&near.o===f||dragF===f||p.fader===f,c=f.ch,X=f.x;cx.fillStyle='#0d0d0d';D(X-1,f.top,3,f.bot-f.top);cx.fillStyle='#5a5a5a';for(let q=0;q<=9;q++){D(X-6,f.top+q*(f.bot-f.top)/9,3,1);D(X+4,f.top+q*(f.bot-f.top)/9,3,1)}
const kt=(G.db[c]+48)/54,ky=f.bot-kt*(f.bot-f.top);cx.fillStyle='#0d0d0d';D(X-7,ky-3,15,7);cx.fillStyle=G.mute[c]?'#555':on?'#ffffff':'#d8d8d8';D(X-6,ky-2,13,5);cx.fillStyle='#0d0d0d';D(X-4,ky,9,1);
const pp=A.ppm&&A.ppm[c]!=null?(Math.max(-60,A.ppm[c])+60)/60:(G.loop&&c<4?(A.pulse[c]||0):0);if(pp>0){cx.fillStyle='#fff';const hh=Math.round(pp*(f.bot-f.top));D(X+9,f.bot-hh,2,hh)}
ptextS(cx,SHORT[c],X-cam.x+ox,f.top-16-cam.y,1,on?'#fff':'#bdbdbd','c');ptextS(cx,G.mute[c]?'MUTE':String(Math.round(G.db[c])),X-cam.x+ox,f.top-9-cam.y,1,on?'#fff':'#9a9a9a','c')})}
function frame(dt,t){tm=t;if(!S)return;const bw=cv.clientWidth,bh0=cv.clientHeight;if(!bh0)return;const ar=bw/bh0;VW=Math.max(160,Math.round(VH*ar));if(cv.width!==VW||cv.height!==VH){cv.width=VW;cv.height=VH}cx.imageSmoothingEnabled=false;
if(G.view==='3d'&&!fadeTo)step(dt);ox=VW>WW?Math.floor((VW-WW)/2):0;
const tx=VW>=WW?0:Math.max(0,Math.min(WW-VW,p.x-VW/2)),ty=Math.max(0,Math.min(WH-VH,p.y-VH*.45));cam.x+=(tx-cam.x)*Math.min(1,dt*7);cam.y+=(ty-cam.y)*Math.min(1,dt*7);
cx.fillStyle='#000';cx.fillRect(0,0,VW,VH);const sx=Math.round(cam.x),sy=Math.round(cam.y),vw=Math.min(VW,WW),vh=Math.min(VH,WH);
cx.drawImage(S.grad,sx,sy,vw,vh,ox,0,vw,vh);if(S.sil)cx.drawImage(S.sil,Math.round(sx*.85),Math.round(sy*.6),vw,vh,ox,0,vw,vh);
cx.fillStyle='#d8d8d8';for(const d of drips)D(d.x,d.y,1,2);
cx.drawImage(S.fg,sx,sy,vw,vh,ox,0,vw,vh);
if(S.kind==='room'){drawScreen(t);drawRoomGear(t)}
if(hook.st!=='none'){cx.fillStyle='#8a8a8a';lineW(p.x,p.y+1,hook.x,hook.y+1);cx.fillStyle='#0d0d0d';lineW(p.x,p.y,hook.x,hook.y);cx.fillStyle=hook.st==='stuck'?'#fff':'#0d0d0d';D(hook.x-1,hook.y-1,3,3)}
drawChar();
if(S.kind==='hub'){for(const f of fish){const yy=f.y-cam.y;if(yy<-10||yy>VH+10)continue;const a=.35+.55*sst(150,800,f.y);cx.fillStyle=`rgba(235,235,235,${a})`;for(let q=0;q<f.l;q++)D(f.x-f.d*q,f.y+Math.round(Math.sin(f.ph-q*.9)*1.6));D(f.x+f.d,f.y-1);D(f.x+f.d,f.y+1)}
for(const m of motes){const yy=m.y-cam.y;if(yy<0||yy>VH)continue;const a=(.15+.35*sst(150,900,m.y))*(.6+.4*Math.sin(t*2+m.a));cx.fillStyle=`rgba(240,240,240,${a})`;D(m.x,m.y)}}
cx.fillStyle='rgba(245,245,245,.9)';for(const q of parts)D(q.x,q.y);
const glow=(x,on,i)=>{const top=FY-66;if(top-cam.y>VH||top-cam.y<-80)return;for(let q=0;q<3;q++){const rr=6+q*5+((t*10+q*5)%5),a=(on?.9:.5)*(1-q/3);cx.fillStyle=`rgba(240,240,240,${a})`;for(let z=0;z<6.283;z+=.5/rr)D(x+Math.cos(z)*rr*.8,top+36+Math.sin(z)*rr)}};
if(S.kind==='hub')DOORS.forEach(d=>glow(d.x,near&&near.k==='door'&&near.i===d.i,d.i));else glow(S.exit.x,near&&near.k==='exit',0);
if(charging){const[ax,ay]=aimDir(),R=range();cx.fillStyle='rgba(255,255,255,.9)';let hit=null;for(let s=6;s<=R;s+=2){const x=p.x+ax*s,y=p.y+ay*s;const f=faderAt(x,y);if(f){hit=[f.x,knobY(f)];break}if(solid(x,y)){hit=[x,y];break}if(s%6===0)D(x,y)}
if(hit){cx.fillStyle='#fff';D(hit[0]-2,hit[1]-2);D(hit[0]+2,hit[1]-2);D(hit[0]-2,hit[1]+2);D(hit[0]+2,hit[1]+2);D(hit[0],hit[1])}
const n=Math.round(chg*24);for(let q=0;q<n;q++){const a=-Math.PI/2+q/24*6.283;D(p.x+Math.cos(a)*11,p.y+Math.sin(a)*11)}}
// HUD
const hud=S.kind==='hub'?'UNDER HUB · THE DEEP':'THE DEEP · 0'+(S.i+1)+' '+G.modes[S.i].id;ptextS(cx,hud,5,26,1,'#f2f2f2');
if(S.kind==='hub'){const dep='DEPTH '+String(Math.max(0,Math.round(p.y/8))).padStart(3,'0')+'M';ptextS(cx,dep,VW-8,52,1,'#f2f2f2','r');const bh=VH-100,yy=62+bh*Math.min(1,p.y/WH);cx.fillStyle='rgba(240,240,240,.5)';cx.fillRect(VW-4,62,1,bh);cx.fillStyle='#fff';cx.fillRect(VW-6,yy|0,5,2)}
if(title>0){title-=dt;const a=Math.min(1,title/.6),tk=VW<420||coarse?3:4;ptext(cx,titleTxt[0],VW/2,VH*.36,tk,`rgba(255,255,255,${a})`,'c');ptext(cx,titleTxt[1],VW/2,VH*.36+28,1,`rgba(235,235,235,${a})`,'c')}
if(fadeTo){fade=Math.min(1,fade+dt/.4);if(fade>=1){const c=fadeCb;fadeTo=0;fadeCb=null;c&&c()}}else fade=Math.max(0,fade-dt/.5);
if(fade>0){cx.fillStyle=`rgba(0,0,0,${fade})`;cx.fillRect(0,0,VW,VH)}}
function hiScreen(){const on=U.active&&S&&S.kind==='room'&&S.scr.kind==='game'&&G.view==='3d';if(!on){if(hv.style.display!=='none')hv.style.display='none';return}
const s=S.scr,k=cv.clientHeight/VH,L=(s.x-cam.x+ox)*k,T=(s.y-cam.y)*k,Wd=s.w*k,Hd=s.h*k,dpr=Math.min(2,devicePixelRatio||1),cw=Math.round(Wd*dpr),chh=Math.round(Hd*dpr),q=k*dpr;
hv.style.display='block';hv.style.left=L+'px';hv.style.top=T+'px';hv.style.width=Wd+'px';hv.style.height=Hd+'px';if(hv.width!==cw||hv.height!==chh){hv.width=cw;hv.height=chh}
hx.imageSmoothingEnabled=true;hx.imageSmoothingQuality='high';hx.fillStyle='#000';hx.fillRect(0,0,cw,chh);
const st=SETS().game,fit=(img,iw,ih)=>{const sc=Math.min(cw/iw,chh/ih),dw=iw*sc,dh=ih*sc;hx.drawImage(img,(cw-dw)/2,(chh-dh)/2,dw,dh)};let drew=false;
if(st&&st.hasV&&st.v.readyState>=2&&(st.on||st.v.currentTime>.3)){try{fit(st.v,st.v.videoWidth||16,st.v.videoHeight||9);drew=true}catch(e){}}
if(!drew&&poster.complete&&poster.naturalWidth)fit(poster,poster.naturalWidth,poster.naturalHeight);
if(!(st&&st.on)){hx.fillStyle='rgba(0,0,0,.55)';hx.fillRect(0,chh-16*q,cw,16*q);ptext(hx,'DIABLO · PRESS THE PLAY PAD',cw/2,chh-11*q,q,'#fff','c')}
else if(st.v){const m=st.v;hx.fillStyle='rgba(0,0,0,.45)';hx.fillRect(0,chh-10*q,cw,10*q);hx.fillStyle='#fff';hx.fillRect(2*q,chh-4*q,(cw-4*q)*(m.duration?m.currentTime/m.duration:0),2*q);ptext(hx,fmt(m.currentTime),3*q,chh-9*q,q,'#fff')}
// keep the pixel character in front of the screen when it swims past
const px=p.x-cam.x+ox,py=p.y-cam.y,sx0=s.x-cam.x+ox,sy0=s.y-cam.y;if(px+10>sx0&&px-10<sx0+s.w&&py+10>sy0&&py-10<sy0+s.h){ccx.clearRect(0,0,40,40);DC=ccx;DX=20-px;DY=20-py;try{drawChar()}finally{DC=cx;DX=DY=0}hx.imageSmoothingEnabled=false;hx.drawImage(cc,(px-20-sx0)*q,(py-20-sy0)*q,40*q,40*q)}
if(fade>0){hx.fillStyle=`rgba(0,0,0,${fade})`;hx.fillRect(0,0,cw,chh)}}
U.frame=(dt,t)=>{frame(dt,t);hiScreen()};U._t={p,hook,I,press,release,solid,mouse,DOORS,get FY(){return FY},get WH(){return WH},get WW(){return WW},get S(){return S},near:()=>near};
})();
