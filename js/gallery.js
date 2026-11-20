// Wide showcase wall at the back of every zone. Each slot draws an image as scanline relief (lines only); Space at the slot loads your own image.
(()=>{const T=THREE,C=G.C,W=G.world,SW=96,SH=54;
const NAMES=[['RESUME','PORTFOLIO PDF','TOOLKIT'],['GAMEPLAY 01','DIABLO','GAMEPLAY 03'],["PACHELBEL'S CANON"],['LOOP LAB 01','LOOP LAB 02','LOOP LAB 03'],['COLLAB 01','COLLAB 02','COLLAB 03'],[0,"PACHELBEL'S CANON",0]];
const key=(z,k)=>`wall-${z}-${k}`,slots={};
function holder(z,k){const d=new Uint8Array(SW*SH),r=G.rng(z*10+k+3),a=1+r()*2,b=1+r()*2,ph=r()*6;for(let y=0;y<SH;y++)for(let x=0;x<SW;x++){const u=x/SW,v=y/SH,ring=Math.exp(-Math.pow(Math.hypot((u-.5)*1.8,v-.5)-.28,2)*60),w=.5+.25*Math.sin(u*6.28*a+ph)*Math.cos(v*6.28*b);d[y*SW+x]=Math.min(255,255*(w*.5+ring*.9))}return d}
function relief(d,w,h){const p=[],amp=h/SH*2.4;for(let r=0;r<SH;r++){const y0=h*(1-(r+.5)/SH)-h/2;let px=null;for(let c=0;c<SW;c++){const x=-w/2+c/(SW-1)*w,y=y0+d[r*SW+c]/255*amp;if(px)p.push(px[0],px[1],0,x,y,0);px=[x,y]}}return p}
const dims={};G.slotDims=(z,k)=>dims[z+'-'+k]||{w:16.4,h:8.6,y:5.8};
function draw(z,k,d){const m=slots[z+'-'+k],q=G.slotDims(z,k);m.geometry.dispose();m.geometry=G.lineset(relief(d,q.w,q.h),0xf2f2f2).geometry}
function load(z,k){try{const s=localStorage.getItem(key(z,k));if(s)return Uint8Array.from(atob(s),c=>c.charCodeAt(0))}catch(e){}return null}
function save(z,k,d){try{localStorage.setItem(key(z,k),btoa(String.fromCharCode(...d)))}catch(e){}}
const inp=document.createElement('input');inp.type='file';inp.accept='image/*';inp.hidden=true;inp.id='wallpick';document.body.appendChild(inp);let cur=null;
inp.onchange=()=>{const f=inp.files[0];inp.value='';if(!f||!cur)return;const c0=cur,img=new Image(),u=URL.createObjectURL(f);
img.onload=()=>{const c=document.createElement('canvas');c.width=SW;c.height=SH;const x=c.getContext('2d'),s=Math.max(SW/img.width,SH/img.height);x.drawImage(img,(SW-img.width*s)/2,(SH-img.height*s)/2,img.width*s,img.height*s);
const px=x.getImageData(0,0,SW,SH).data,d=new Uint8Array(SW*SH);let lo=255,hi=0;for(let i=0;i<d.length;i++){const l=.3*px[i*4]+.59*px[i*4+1]+.11*px[i*4+2];d[i]=l;lo=Math.min(lo,l);hi=Math.max(hi,l)}
for(let i=0;i<d.length;i++)d[i]=(d[i]-lo)/(hi-lo||1)*255;URL.revokeObjectURL(u);draw(c0.z,c0.k,d);save(c0.z,c0.k,d);G.toast('이미지를 선 그림으로 바꿨어요. 이 브라우저에만 저장됩니다.')};img.onerror=()=>G.toast('이미지를 불러오지 못했습니다.');img.src=u};
W.zones.forEach((g,zi)=>{const O=G.O(zi),big=true,wall=G.rect(62,38,C.lime,1,false);wall.position.set(0,19,-24);g.add(wall);const wp=G.panel(460,38,0xf1f1f1);wp.position.set(0,19,-24.15);g.add(wp);
const fl=[];for(let x=-30;x<=30;x+=4)fl.push(x,0,-16,x,0,-24);for(let z=-16;z>=-24;z-=2)fl.push(-30,0,z,30,0,z);
for(let k=0;k<3;k++){if(k!==1)continue;const info=zi===0||zi===2||zi===3||zi===4;const x=(k-1)*20,vid=zi===2||zi>=5||(zi===1&&k===1),SWd=56,SHd=31.5,cy=18;G.screenY=cy;dims[zi+'-'+k]={w:SWd-.6,h:SHd-.8,y:cy};const fr=G.rect(SWd+.6,SHd+.6,C.lime,1,false);fr.position.set(x,cy,-24);g.add(fr);const f2=G.rect(SWd,SHd,C.cyan,.6,false);f2.position.set(x,cy,-24);g.add(f2);const pn=G.panel(SWd,SHd,0x0a0a0a);pn.position.set(x,cy,-24.05);g.add(pn);
if(!big){const t=G.text(NAMES[zi][k],1,C.lime,1);t.position.set(x,12.3,-24);g.add(t)}if(!vid&&!info){const sm=G.text('SPACE AT FLOOR MARK = ADD IMAGE',.4,C.cyan,1);sm.position.set(x,big?.8:11.3,-24);g.add(sm)}
{const b2=G.rect(8,3.4,C.lime,1);b2.rotation.x=-Math.PI/2;b2.position.set(0,.07,-19);g.add(b2);const t2=G.text('2D',1.2,C.lime,1);t2.rotation.x=-Math.PI/2;t2.position.set(0,.08,-19);g.add(t2);const bw=G.rect(10,1.2,C.cyan,.7);bw.rotation.x=-Math.PI/2;bw.position.set(0,.07,-21.2);g.add(bw);
G.inter.push({area:zi,x:O.x,z:-19,r:3.4,kind:'use',label:'화면 속으로 뛰어들어 2D 보기',fn:()=>G.dive()})}
const m=G.lineset([0,0,0,0,0,0],0xf2f2f2,.9);m.position.set(x,cy,-24);g.add(m);slots[zi+'-'+k]=m;if(!info)draw(zi,k,load(zi,k)||holder(zi,k));
if(vid||info)continue;const mk=G.rect(7,2.2,C.lime,1);mk.rotation.x=-Math.PI/2;mk.position.set(x,.07,-14);g.add(mk);const ft=G.text('WALL '+(k+1),.8,C.lime,1);ft.rotation.x=-Math.PI/2;ft.position.set(x,.08,-14);g.add(ft);
G.inter.push({area:zi,x:O.x+x,z:-14,r:3.2,kind:'use',label:NAMES[zi][k]+' 에 내 이미지 넣기',fn:()=>{cur={z:zi,k};inp.click()}})}});
G.wallSlot=(z,k)=>slots[z+'-'+k];
})();
