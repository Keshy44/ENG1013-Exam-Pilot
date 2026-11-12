/* ENG1013 circuit-standard-style figures: white paper, IEC rectangular components,
   unique labels, orthogonal wiring and clear current arrows. Each separator
   figure comes from the live problem values; no answer is drawn. */
function diagramParts(){
 const f={
 line:(x,y,X,Y)=>`<path d="M${x} ${y} L${X} ${Y}" fill="none" stroke="#192330" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`,
 text:(x,y,t,small=false,anchor="middle")=>`<text x="${x}" y="${y}" text-anchor="${anchor}" fill="#192330" font-family="Arial,sans-serif" font-size="${small?13:16}" font-weight="${small?500:650}">${esc(t)}</text>`,
 node:(x,y,name)=>`<circle cx="${x}" cy="${y}" r="4.5" fill="#192330"/>${name?f.text(x+12,y-12,name,true,"start"):""}`,
 terminal:(x,y,name)=>`<circle cx="${x}" cy="${y}" r="5" fill="white" stroke="#192330" stroke-width="2.2"/>${name?f.text(x+13,y-9,name,true,"start"):""}`,
 ground:(x,y)=>f.line(x,y,x,y+12)+f.line(x-18,y+12,x+18,y+12)+f.line(x-11,y+18,x+11,y+18)+f.line(x-5,y+24,x+5,y+24),
 hR:(x,y,X,label)=>{const center=(x+X)/2,w=Math.min(65,(X-x)-25);return f.line(x,y,center-w/2,y)+`<rect x="${center-w/2}" y="${y-12}" width="${w}" height="24" fill="#fff" stroke="#192330" stroke-width="2.4"/>`+f.line(center+w/2,y,X,y)+f.text(center,y-22,label,true);},
 vR:(x,y,Y,label,side="right")=>{const mid=(y+Y)/2,h=Math.min(65,Y-y-25);return f.line(x,y,x,mid-h/2)+`<rect x="${x-12}" y="${mid-h/2}" width="24" height="${h}" fill="#fff" stroke="#192330" stroke-width="2.4"/>`+f.line(x,mid+h/2,x,Y)+f.text(x+(side==="right"?24:-24),mid+4,label,true,side==="right"?"start":"end");},
 hC:(x,y,X,label)=>{const m=(x+X)/2;return f.line(x,y,m-9,y)+f.line(m-9,y-18,m-9,y+18)+f.line(m+9,y-18,m+9,y+18)+f.line(m+9,y,X,y)+f.text(m,y-27,label,true);},
 vC:(x,y,Y,label)=>{const m=(y+Y)/2;return f.line(x,y,x,m-9)+f.line(x-19,m-9,x+19,m-9)+f.line(x-19,m+9,x+19,m+9)+f.line(x,m+9,x,Y)+f.text(x+24,m+4,label,true,"start");},
 vs:(x,y,Y,label)=>{const m=(y+Y)/2;return f.line(x,y,x,m-26)+`<circle cx="${x}" cy="${m}" r="26" fill="white" stroke="#192330" stroke-width="2.4"/>`+f.line(x,m+26,x,Y)+f.text(x,m-6,"+",false)+f.text(x,m+15,"−",false)+f.text(x-18,m-39,label,true,"end");},
 is:(x,y,Y,label,up=true,dep=false)=>{const m=(y+Y)/2,c=dep?`<path d="M${x} ${m-29} L${x+27} ${m} L${x} ${m+29} L${x-27} ${m} Z" fill="white" stroke="#192330" stroke-width="2.4"/>`:`<circle cx="${x}" cy="${m}" r="26" fill="white" stroke="#192330" stroke-width="2.4"/>`;const a=up?m+12:m-12,b=up?m-12:m+12;return f.line(x,y,x,m-29)+c+f.line(x,m+29,x,Y)+f.line(x,a,x,b)+`<path d="M${x-7} ${b+(up?8:-8)} L${x} ${b} L${x+7} ${b+(up?8:-8)}" fill="none" stroke="#192330" stroke-width="2.2"/>`+f.text(x+39,m-9,label,true,"start");},
 diode:(x,y,X,label)=>{const m=(x+X)/2;return f.line(x,y,m-20,y)+`<path d="M${m-20} ${y-18} L${m+13} ${y} L${m-20} ${y+18} Z" stroke="#192330" fill="white" stroke-width="2.1"/>`+f.line(m+17,y-21,m+17,y+21)+f.line(m+17,y,X,y)+f.line(m+5,y-22,m+20,y-38)+`<path d="M${m+11} ${y-36} L${m+20} ${y-38} L${m+18} ${y-29}" fill="none" stroke="#192330" stroke-width="1.6"/>`+f.text(m,y-51,label,true);},
 arrow:(x,y,X,Y,label)=>{const ang=Math.atan2(Y-y,X-x),a=9;return f.line(x,y,X,Y)+`<path d="M${X-a*Math.cos(ang-.47)} ${Y-a*Math.sin(ang-.47)} L${X} ${Y} L${X-a*Math.cos(ang+.47)} ${Y-a*Math.sin(ang+.47)}" fill="none" stroke="#192330" stroke-width="2"/>`+(label?f.text((x+X)/2,(y+Y)/2-10,label,true):"");},
 wrap:(inner,title,caption,extra='')=>`<figure class="circuit-figure exam-figure"><div class="exam-figure-toolbar"><strong>${esc(title)}</strong><span>ENG1013 circuit schematic</span></div><svg class="circuit-svg" viewBox="0 0 800 330" role="img" aria-label="${esc(caption)}" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="798" height="328" rx="2" fill="white" stroke="#d8dce1"/>${inner}${extra}</svg><figcaption>${esc(caption)} · Values shown are the given values, not the solution.</figcaption></figure>`
 };
 return f;
}

function parseNum(s,re){const m=s.match(re);return m?m.slice(1).map(Number):null;}

function advancedCircuitDiagram(q){
 if(!q||!q.separator||!q.topic?.startsWith('E'))return '';
 const p=q.prompt,v=q.variant||"",f=diagramParts(),{line:L,text:T,node:N,terminal:P,ground:G,hR:HR,vR:VR,hC:HC,vC:VC,vs:VS,is:IS,diode:D,arrow:A,wrap:W}=f;
 const groundRail=(xs)=>L(Math.min(...xs),260,Math.max(...xs),260)+xs.map(x=>G(x,260)).join('');
 let b="",caption="",title="",m;
 try{
 if(q.topic==='E1'){
   if(v.includes('battery-energy')){m=parseNum(p,/A (\d+) V battery supplies (\d+) A for ([\d.]+) hours at (\d+)%/);
    if(!m)return '';const [vs,i,hrs,eff]=m;
    b=VS(130,70,260,vs+' V')+L(130,70,345,70)+HR(345,70,520,'R1 · load')+L(520,70,650,70)+L(650,70,650,260)+L(130,260,650,260)+G(650,260)+A(250,45,315,45,'I = '+i+' A')+T(400,165,'η = '+eff+'%')+T(400,197,'t = '+hrs+' h');title="DC source and load";caption="Find useful energy using the indicated current, duration and efficiency";
   }else{m=parseNum(p,/A (\d+) V ideal source is connected to TWO identical (\d+) Ω resistors/);if(!m)return '';const [vs,r]=m;
    b=VS(130,70,260,'V1 = '+vs+' V')+L(130,70,650,70)+VR(375,70,260,'R1 = '+r+' Ω')+VR(590,70,260,'R2 = '+r+' Ω')+L(130,260,650,260)+G(375,260)+N(375,70)+N(590,70);title="Parallel resistive loads";caption="Two identical resistors across one ideal voltage source";
   }
 }else if(q.topic==='E2'){
  if(v.includes("nested-equivalent")){m=parseNum(p,/a (\d+) kΩ resistor is SERIES.*?Branch 1 is (\d+) kΩ in series with (\d+) kΩ; branch 2 is (\d+) kΩ/);if(!m)return '';const [outer,r1,r2,r3]=m;
   b=P(70,172,'a')+L(70,172,145,172)+HR(145,172,260,'R1 = '+outer+' kΩ')+L(260,172,320,172)+L(320,100,320,245)+L(320,100,365,100)+HR(365,100,470,'R2 = '+r1+' kΩ')+HR(470,100,575,'R3 = '+r2+' kΩ')+L(575,100,670,100)+L(320,245,420,245)+HR(420,245,560,'R4 = '+r3+' kΩ')+L(560,245,670,245)+L(670,100,670,245)+L(670,172,735,172)+P(735,172,'b')+N(320,172)+N(670,172);
   title="Series–parallel resistor network";caption="Equivalent resistance measured between terminals a and b";
  }else{m=parseNum(p,/A (\d+) V source drives (\d+) kΩ in SERIES with a parallel pair (\d+) kΩ \|\| (\d+) kΩ/);if(!m)return '';const [vs,rt,r1,r2]=m;
   b=VS(105,65,260,'V1 = '+vs+' V')+L(105,65,160,65)+HR(160,65,305,'R1 = '+rt+' kΩ')+L(305,65,660,65)+VR(420,65,260,'R2 = '+r1+' kΩ')+VR(660,65,260,'R3 = '+r2+' kΩ')+L(105,260,660,260)+G(420,260)+N(420,65)+N(660,65)+A(655,115,655,160,'I3 ↓');title="Resistor network with branch current";caption="The requested current is through R3, not the total supply current";
  }
 }else if(q.topic==='E3'){
  m=parseNum(p,/(\d+) V (?:supply|divider) .*?Rtop=(\d+) kΩ.*?Rbottom=(\d+) kΩ.*?RL=(\d+) kΩ/);
  if(!m){m=parseNum(p,/For a (\d+) V divider with Rtop=(\d+) kΩ, Rbottom=(\d+) kΩ, and load RL=(\d+) kΩ/);}if(!m)return '';
  const [vs,rt,rb,rl]=m;
  b=VS(115,70,260,'V1 = '+vs+' V')+L(115,70,170,70)+HR(170,70,300,'R1 = '+rt+' kΩ')+L(300,70,480,70)+VR(480,70,260,'R2 = '+rb+' kΩ')+VR(665,70,260,'RL = '+rl+' kΩ')+L(480,70,665,70)+L(115,260,665,260)+G(480,260)+N(480,70,'Vout')+N(665,70);
  title="Loaded voltage divider";caption="The load RL is parallel to the lower divider resistor R2";
 }else if(q.topic==='E4'){
  if(v.includes('kcl')){m=parseNum(p,/At a node (\d+) mA enters\. Currents of (\d+) mA and (\d+) mA LEAVE/);if(!m)return '';
   const [ent,a,c]=m;
   b=N(390,160,'J1')+L(120,160,390,160)+L(390,160,690,160)+L(390,55,390,265)+A(160,145,330,145,'I1 = '+ent+' mA')+A(430,145,570,145,'Ix ?')+A(405,115,405,70,'I2 = '+a+' mA')+A(405,195,405,235,'I3 = '+c+' mA');title="Kirchhoff current law";caption="Current arrows define the signs; Ix points out of the junction";
  }else{m=parseNum(p,/there is a (\d+) V rise, an OPPOSING (\d+) V source drop, and a resistor drop of (\d+) V/);if(!m)return '';
   const [v1,v2,vr]=m;
   b=VS(135,70,260,'V1 = '+v1+' V')+L(135,70,190,70)+HR(190,70,325,'R1 · '+vr+' V drop')+L(325,70,390,70)+HR(390,70,520,'R2 · Vx drop')+L(520,70,650,70)+VS(650,70,260,'V2 = '+v2+' V (opposes)')+L(135,260,650,260)+A(320,230,455,230,'KVL loop');title="Kirchhoff voltage law";caption="Two opposing voltage sources and the labelled resistor drops";
  }
 }else if(q.topic==='E5'){
  m=parseNum(p,/TWO-NODE circuit: (\d+) V source through (\d+) kΩ to VA; (\d+) kΩ VA→ground; (\d+) kΩ VA↔VB; (\d+) kΩ VB→ground; (\d+) mA source/);
  if(!m)return '';const [vs,ra,rg,rm,rb,inj]=m;
  b=VS(105,75,260,'V1 = '+vs+' V')+L(105,75,140,75)+HR(140,75,270,'R1 = '+ra+' kΩ')+L(270,75,350,75)+HR(375,75,510,'R3 = '+rm+' kΩ')+L(350,75,375,75)+L(510,75,555,75)+VR(350,75,260,'R2 = '+rg+' kΩ','left')+VR(555,75,260,'R4 = '+rb+' kΩ','left')+L(555,75,690,75)+IS(690,110,260,'I1 = '+inj+' mA',true)+L(690,75,690,110)+L(105,260,690,260)+G(555,260)+N(350,75,'VA')+N(555,75,'VB');
  title="Two-node nodal analysis";caption="Two unknown node voltages, four resistors and a current source entering VB";
 }else if(q.topic==='E6'){
  m=parseNum(p,/A (\d+) V source connects through (\d+) kΩ to node V; (\d+) kΩ connects V to ground; a ([\d.]+) mA independent source (INJECTS into V from ground|DRAWS current OUT OF V to ground)/);
  if(!m)return '';const [vs,ra,rb,i]=m,up=m[5].startsWith('INJECTS');
  b=VS(105,75,260,'V1 = '+vs+' V')+L(105,75,160,75)+HR(160,75,315,'R1 = '+ra+' kΩ')+L(315,75,440,75)+VR(440,75,260,'R2 = '+rb+' kΩ')+L(440,75,670,75)+L(670,75,670,110)+IS(670,110,260,'I1 = '+i+' mA',up)+L(105,260,670,260)+G(440,260)+N(440,75,'V')+(up?'':T(670,308,'Source extracts current',true));
  title="Superposition with signed current";caption=`The independent current source points ${up?'towards':'away from'} node V`;
 }else if(q.topic==='E7'){
  m=parseNum(p,/BONUS TOPIC: (\d+) V source via (\d+) kΩ to V; a (\d+) kΩ resistor V→ground; a dependent current source injects kV mA from ground to V, k=([\d.]+) mA\/V/);if(!m)return '';const [vs,r1,r2,k]=m;
  b=VS(110,75,260,'V1 = '+vs+' V')+L(110,75,160,75)+HR(160,75,310,'R1 = '+r1+' kΩ')+L(310,75,440,75)+VR(440,75,260,'R2 = '+r2+' kΩ')+L(440,75,635,75)+L(635,75,635,110)+IS(635,110,260,'k · V mA',true,true)+L(110,260,635,260)+G(440,260)+N(440,75,'V')+T(645,306,'k = '+k+' mA/V',true);
  title="Circuit with dependent current source";caption="The diamond denotes a controlled source; keep it active in nodal analysis";
 }else if(q.topic==='E8'){
  m=parseNum(p,/A (\d+) V source feeds Rtop=(\d+) kΩ into terminal a; Rbottom=(\d+) kΩ connects a to b \(ground\)/);if(!m)return '';const [vs,rt,rb]=m;
  let load=0;const lm=p.match(/A (\d+) kΩ load is connected/);if(lm)load=+lm[1];
  const short=v.includes('norton-short');
  b=VS(110,75,260,'V1 = '+vs+' V')+L(110,75,160,75)+HR(160,75,305,'R1 = '+rt+' kΩ')+L(305,75,445,75)+VR(445,75,260,'R2 = '+rb+' kΩ')+L(110,260,695,260)+G(445,260)+L(445,75,695,75)+N(445,75,'a')+P(695,75,'a')+P(695,260,'b');
  if(load)b+=VR(695,75,260,'RL = '+load+' kΩ');
  if(short)b+=L(695,75,695,260)+T(675,185,'SHORT',true,'end');
  title=short?'Norton short-circuit measurement':'Thévenin source with load';
  caption=short?'The short between a and b bypasses R2':'Find the load current via the Thévenin equivalent seen at a–b';
 }else if(q.topic==='E9'){
  m=parseNum(p,/THREE series LEDs drop ([\d.]+), ([\d.]+), ([\d.]+) V respectively\. A (\d+) Ω resistor limits current from a (\d+) V supply/);
  if(!m){m=parseNum(p,/LEDs drop ([\d.]+), ([\d.]+), ([\d.]+) V, supply (\d+) V, resistor (\d+) Ω/);if(!m)return '';m=[m[0],m[1],m[2],m[3],m[5],m[4]];}
  const [vf1,vf2,vf3,R,vs]=m;
  b=VS(80,90,260,'V1 = '+vs+' V')+L(80,90,118,90)+HR(118,90,242,'R1 = '+R+' Ω')+L(242,90,280,90)+D(280,90,390,'D1 · '+vf1+' V')+D(390,90,500,'D2 · '+vf2+' V')+D(500,90,610,'D3 · '+vf3+' V')+L(610,90,690,90)+L(690,90,690,260)+L(80,260,690,260)+G(690,260);
  title="Three-LED series string";caption="All three LED forward drops reduce the voltage across R1";
 }else if(q.topic==='E10'){
  m=parseNum(p,/VGS=([\d.]+) V, threshold=([\d.]+) V, RDS,on=([\d.]+) Ω\. A ([\d.]+) V-drop LED and (\d+) Ω resistor are in series to (\d+) V supply/);if(!m)return '';const [vgs,vth,ron,vf,R,vs]=m;
  b=VS(90,75,260,'VDD = '+vs+' V')+L(90,75,180,75)+HR(180,75,305,'R1 = '+R+' Ω')+D(305,75,420,'D1 · '+vf+' V')+L(420,75,520,75)+L(520,75,520,140)+`<rect x="481" y="140" width="78" height="72" rx="2" fill="#fff" stroke="#192330" stroke-width="2.5"/>`+T(520,165,'Q1',true)+T(520,189,'nMOS',true)+L(520,212,520,260)+L(90,260,520,260)+G(520,260)+L(405,178,481,178)+T(400,164,'Gate',true,'end')+T(387,193,'VGS='+vgs+' V',true,'end')+T(520,304,`Vth=${vth} V   RDS(on)=${ron} Ω`,true);
  title="N-MOSFET low-side LED switch";caption="Simplified three-terminal Q1 switching symbol; apply the stated on/off model";
 }else if(q.topic==='E11'){
  const logic=p.match(/For O = \(A AND NOT B\) OR \(B AND C\), evaluate A=(\d+), B=(\d+), C=(\d+)/);
  const xor=p.match(/O=\(A NAND B\) AND \(A OR B\)\. With A=(\d+) and B=(\d+)/);
  if(!logic&&!xor)return '';
  const vals=logic?logic.slice(1).join(', '):xor.slice(1).join(', ');
  const first=logic?'A1 · AND / NOT':'A1 · NAND',second=logic?'A2 · AND':'A2 · OR',third=logic?'A3 · OR':'A3 · AND';
  b=`<rect x="180" y="55" width="162" height="67" fill="#fff" stroke="#192330" stroke-width="2.4"/>`+T(261,94,first,true)+`<rect x="180" y="200" width="162" height="67" fill="#fff" stroke="#192330" stroke-width="2.4"/>`+T(261,239,second,true)+`<rect x="540" y="128" width="155" height="72" fill="#fff" stroke="#192330" stroke-width="2.4"/>`+T(618,170,third,true)+L(342,89,430,89)+L(430,89,430,150)+L(430,150,540,150)+L(342,234,430,234)+L(430,234,430,182)+L(430,182,540,182)+L(695,165,735,165)+P(735,165,'O')+T(90,166,logic?'A, B, C = '+vals:'A, B = '+vals,true);
  title="Combined logic gates";caption="The gates are connected in two branches then combined at the output";
 }else if(q.topic==='E12'){
  const matched=v.includes('three-cap')?parseNum(p,/C1=(\d+) µF and C2=(\d+) µF are in SERIES\. This branch is in PARALLEL with C3=(\d+) µF/):null;
  if(matched){
   const [c1,c2,c3]=matched;
   b=P(115,155,'a')+L(115,155,170,155)+L(170,100,170,215)+L(170,100,270,100)+HC(270,100,400,'C1 = '+c1+' µF')+HC(400,100,530,'C2 = '+c2+' µF')+L(530,100,650,100)+L(170,215,340,215)+HC(340,215,505,'C3 = '+c3+' µF')+L(505,215,650,215)+L(650,100,650,215)+L(650,155,710,155)+P(710,155,'b')+N(170,155)+N(650,155);
   title="Capacitance series–parallel network";caption="C1 and C2 share one series branch; C3 is across the whole branch";
  }else{m=parseNum(p,/Two capacitors C1=(\d+) µF and C2=(\d+) µF are in SERIES across (\d+) V/);if(!m)return '';
   const [c1,c2,vs]=m;
   b=VS(105,70,260,'V1 = '+vs+' V')+L(105,70,185,70)+HC(185,70,385,'C1 = '+c1+' µF')+HC(385,70,585,'C2 = '+c2+' µF')+L(585,70,690,70)+L(690,70,690,260)+L(105,260,690,260)+G(690,260);
   title="Two series capacitors";caption="Find voltage across C1; both capacitors carry the same charge";
  }
 }else if(q.topic==='E13'){
  m=parseNum(p,/A (\d+) µF capacitor changes voltage LINEARLY from (-?[\d.]+) V to (-?[\d.]+) V in (\d+) ms/);
  if(m){const [c,vi,vf,t]=m;b=VC(400,80,230,'C1 = '+c+' µF')+L(400,80,400,50)+L(400,230,400,260)+G(400,260)+A(305,223,305,110,'iC (passive sign)')+T(550,110,'Vi = '+vi+' V',true)+T(550,150,'Vf = '+vf+' V',true)+T(550,190,'Δt = '+t+' ms',true)+T(280,80,'+',false)+T(280,252,'−',false);title="Time-varying capacitor voltage";caption="The sign of iC follows i=C(dV/dt), with the indicated passive polarity";
  }else{m=parseNum(p,/A (\d+) µF capacitor initially at (\d+) V discharges under a CONSTANT (\d+) µA current/);if(!m)return '';const [c,vi,i]=m;
    b=VC(415,80,235,'C1 = '+c+' µF')+L(415,80,415,55)+L(415,235,415,260)+G(415,260)+A(325,110,325,230,'I = '+i+' µA')+T(550,100,'VC(0) = '+vi+' V',true)+T(550,145,'VC(final) = 0 V',true);title="Constant-current capacitor discharge";caption="Use charge removed by constant current to calculate discharge time";
  }
 }else if(q.topic==='E14'){
  m=parseNum(p,/Capacitor begins at (\d+) V, tends to final (\d+) V through Rth=(\d+) kΩ and C=(\d+) µF/);
  if(!m){m=parseNum(p,/Capacitor begins at (\d+) V and tends to (\d+) V/);if(!m)return '';const [vi,vf]=m;b=VS(100,80,260,'Vf = '+vf+' V')+L(100,80,190,80)+HR(190,80,365,'Rth')+L(365,80,550,80)+VC(550,80,225,'C1')+L(550,225,550,260)+L(100,260,550,260)+G(550,260)+N(550,80,'VC(t)')+T(400,306,'VC(0) = '+vi+' V',true);title="RC charging/discharging transient";caption="Use VC(t)=Vf+(Vi−Vf)e^(−t/τ)";
  }else{const [vi,vf,R,C]=m;
   b=VS(100,80,260,'Vf = '+vf+' V')+L(100,80,190,80)+HR(190,80,365,'R1 = '+R+' kΩ')+L(365,80,550,80)+VC(550,80,225,'C1 = '+C+' µF')+L(550,225,550,260)+L(100,260,550,260)+G(550,260)+N(550,80,'VC(t)')+T(400,306,'VC(0) = '+vi+' V',true);title="RC transient threshold";caption="Initial and final voltages differ; find time using the exponential law";
  }
 }else if(q.topic==='E15'){
  m=parseNum(p,/A ([\d.]+) V PWM signal is ON for (\d+) ms and OFF for (\d+) ms/);
  if(!m){m=parseNum(p,/PWM ON for (\d+) ms, OFF for (\d+) ms/);if(!m)return '';m=[m[0],'VH',m[1],m[2]];}
  const [hi,on,off]=m;
  const x0=130,x1=380,x2=650,yt=85,yb=235;
  b=L(110,60,110,275)+L(90,yb,690,yb)+L(x0,yb,x0,yt)+L(x0,yt,x1,yt)+L(x1,yt,x1,yb)+L(x1,yb,x2,yb)+L(x2,yb,x2,yt)+L(x2,yt,685,yt)+T(80,90,hi+' V',true,'end')+T(80,239,'0 V',true,'end')+T(260,68,'Ton = '+on+' ms',true)+T(512,263,'Toff = '+off+' ms',true)+T(680,298,'time →',true,'end');
  title="Pulse-width modulation waveform";caption="Period T=Ton+Toff; average voltage is set by duty cycle";
 }
 if(!b)return '';
 return W(b,title,caption);
 }catch(err){return '';}
}
const baselineCircuitDiagram=circuitDiagram;
circuitDiagram=function(q){return q?.separator?advancedCircuitDiagram(q):baselineCircuitDiagram(q);};
