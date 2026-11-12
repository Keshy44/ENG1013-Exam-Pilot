
/* ENG1013 circuit diagrams. Rendered as responsive SVG, generated from each question's actual inputs.
   Circuit figures show givens and unknowns, never calculated answers. */
function circuitDiagram(q){
 // Hard questions specify new topologies in prose; don't show a generic diagram that may be wrong.
 if(q?.separator)return '';
 if(!q||!q.prompt||!/^E(?:1|2|3|4|5|6|8|9|11|12|13|14)$/.test(q.topic))return '';
 const p=q.prompt, t=q.topic, ink='#243343',aqua='#175d82',white='#172733',muted='#4c5c68';
 const L=(x,y,u,v,c=ink)=>'<line x1="'+x+'" y1="'+y+'" x2="'+u+'" y2="'+v+'" stroke="'+c+'" stroke-width="2.5" stroke-linecap="round"/>';
 const T=(x,y,v,c=white,size=15,anchor='middle')=>'<text x="'+x+'" y="'+y+'" font-size="'+size+'" font-family="Arial,system-ui,sans-serif" font-weight="600" fill="'+c+'" text-anchor="'+anchor+'">'+esc(v)+'</text>';
 const B=(x,y,w,h)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="2" stroke="'+ink+'" stroke-width="2.5" fill="#ffffff"/>';
 const RH=(x,y,v)=>B(x,y-14,76,28)+T(x+38,y-24,v);
 const RV=(x,y,v)=>B(x-14,y,28,60)+T(x+27,y+34,v,white,14,'start');
 const CH=(x,y,v)=>L(x,y-22,x,y+22)+L(x+16,y-22,x+16,y+22)+T(x+8,y-30,v);
 const CV=(x,y,v)=>L(x-23,y,x+23,y)+L(x-23,y+14,x+23,y+14)+T(x+38,y+10,v,white,14,'start');
 const G=(x,y)=>L(x,y,x,y+7)+L(x-19,y+7,x+19,y+7)+L(x-12,y+13,x+12,y+13)+L(x-5,y+19,x+5,y+19);
 const N=(x,y,name)=>'<circle cx="'+x+'" cy="'+y+'" r="5" fill="'+aqua+'"/>'+(name?T(x,y-19,name,aqua,17):'');
 const P=(x,y)=>'<circle cx="'+x+'" cy="'+y+'" r="5.5" stroke="'+aqua+'" stroke-width="2" fill="#ffffff"/>';
 const A=(x,y,u,v)=>L(x,y,u,v,aqua)+L(u,v,u-9+(v-y)*.1,v-9-(u-x)*.1,aqua)+L(u,v,u-9-(v-y)*.1,v+9-(u-x)*.1,aqua);
 const VS=(x,y,v)=>'<circle cx="'+x+'" cy="'+y+'" r="24" stroke="'+ink+'" stroke-width="2.5" fill="#ffffff"/>'+T(x,y-6,'+',aqua,17)+T(x,y+15,'−',aqua,20)+T(x-30,y-38,v,white,14,'start');
 const IS=(x,y,v)=>'<circle cx="'+x+'" cy="'+y+'" r="24" stroke="'+ink+'" stroke-width="2.5" fill="#ffffff"/>'+A(x,y+12,x,y-12)+T(x,y+44,v);
 const SOURCE=(v,x=64)=>VS(x,111,v)+L(x,48,x,87)+L(x,135,x,182);
 let h='',description='';
 if(t==='E1'){
  const x=p.match(/resistor of ([\d.]+) Ω has ([\d.]+) V/),y=p.match(/resistor has ([\d.]+) V across it and carries ([\d.]+) A/),z=p.match(/resistor experiences ([\d.]+) V and ([\d.]+) A/);
  const v=x?x[2]:y?y[1]:z?z[1]:null;
  const r=x?x[1]:y?round(+y[1]/+y[2],1):z?round(+z[1]/+z[2],1):null;
  if(!v||!r)return '';
  h=SOURCE(v+' V')+L(64,48,185,48)+RH(185,48,r+' Ω')+L(261,48,402,48)+L(402,48,402,182)+L(402,182,64,182);
  description='A resistor connected to a DC voltage source';
 }
 else if(t==='E2'||t==='E12'){
  const isCap=t==='E12',unit=isCap?'µF':'Ω';
  const m=isCap?p.match(/([\d.]+) µF and ([\d.]+) µF capacitors are connected in (PARALLEL|SERIES)/):p.match(/Resistors of ([\d.]+) Ω and ([\d.]+) Ω are connected in (SERIES|PARALLEL)/);
  if(!m)return '';
  const part=(x,y,v)=>isCap?CH(x,y,v+' '+unit):RH(x,y,v+' '+unit);
  const w=isCap?16:76;
  if(m[3]==='SERIES'){
   h=P(65,108)+L(71,108,172,108)+part(172,108,m[1])+L(172+w,108,348,108)+part(348,108,m[2])+L(348+w,108,610,108)+P(616,108);
   description=(isCap?'Capacitors':'Resistors')+' in series between two terminals';
  }else{
   h=P(66,108)+L(72,108,156,108)+L(156,48,156,170)+L(156,48,312,48)+part(312,48,m[1])+L(312+w,48,530,48)+L(156,170,312,170)+part(312,170,m[2])+L(312+w,170,530,170)+L(530,48,530,170)+L(530,108,610,108)+P(616,108);
   description=(isCap?'Capacitors':'Resistors')+' in parallel across the same two nodes';
  }
 }
 else if(t==='E3'||t==='E8'){
  const th=p.match(/Vth=([\d.]+) V and Rth=([\d.]+) kΩ/);
  if(th){
   h=SOURCE(th[1]+' V')+L(64,48,172,48)+RH(172,48,th[2]+' kΩ')+L(248,48,574,48)+P(574,48)+L(64,182,574,182)+P(574,182);
   description='Thévenin equivalent circuit with open output terminals';
  }else{
   let m=p.match(/Vs = ([\d.]+) V, Rtop = ([\d.]+) kΩ and Rbottom = ([\d.]+) kΩ/);
   let vs,top,bottom;
   if(m){vs=m[1];top=m[2];bottom=m[3];}
   else if(m=p.match(/Two resistors ([\d.]+) kΩ and ([\d.]+) kΩ are in series across ([\d.]+) V/)){top=m[1];bottom=m[2];vs=m[3];}
   else if(m=p.match(/A ([\d.]+) V source feeds Rtop=([\d.]+) kΩ in series with Rbottom=([\d.]+) kΩ/)){vs=m[1];top=m[2];bottom=m[3];}
   else if(m=p.match(/Rtop=([\d.]+) kΩ from a voltage source.*Rbottom=([\d.]+) kΩ/)){vs='Vs';top=m[1];bottom=m[2];}
   else return '';
   h=SOURCE(vs==='Vs'?vs:vs+' V')+L(64,48,173,48)+RH(173,48,top+' kΩ')+L(249,48,385,48)+N(385,48,'Vout')+L(385,48,385,85)+RV(385,85,bottom+' kΩ')+L(385,145,385,182)+L(385,182,64,182)+G(385,182);
   if(t==='E8')h+=L(385,48,569,48)+P(569,48)+L(385,182,569,182)+P(569,182);
   description=t==='E8'?'Original voltage-divider network at the output terminals':'Unloaded voltage divider with Vout measured to ground';
  }
 }
 else if(t==='E4'){
  const k=p.match(/KCL: ([\d.]+) mA enters a node\. ([\d.]+) mA and ([\d.]+) mA leave/),v=p.match(/KVL: a ([\d.]+) V source drives a loop with drops of ([\d.]+) V, ([\d.]+) V, and Vx/);
  if(k){
   h=N(340,108,'V')+L(116,108,334,108)+A(202,108,312,108)+T(192,88,k[1]+' mA enters',aqua);
   h+=L(346,108,565,108)+A(404,108,503,108)+T(490,89,k[2]+' mA leaves',aqua);
   h+=L(340,103,340,37)+A(340,98,340,48)+T(366,45,k[3]+' mA leaves',aqua,14,'start');
   h+=L(340,114,340,185)+A(340,125,340,174)+T(367,181,'I = ? leaves',aqua,14,'start');
   description='KCL: all labelled currents enter or leave the same junction';
  }else if(v){
   h=SOURCE(v[1]+' V')+L(64,48,145,48)+B(145,34,95,28)+T(192,24,v[2]+' V drop',14)+L(240,48,287,48)+B(287,34,95,28)+T(334,24,v[3]+' V drop',14)+L(382,48,429,48)+B(429,34,95,28)+T(477,24,'Vx drop',14,aqua)+L(524,48,582,48)+L(582,48,582,182)+L(582,182,64,182);
   description='KVL: the voltage source and three labelled drops form one loop';
  }else return '';
 }
 else if(t==='E5'||t==='E6'){
  const two=t==='E5'?p.match(/a ([\d.]+) V source connects through ([\d.]+) kΩ to VA; ([\d.]+) kΩ connects VA to VB; ([\d.]+) kΩ connects VB to ground/):null;
  if(two){
   h=SOURCE(two[1]+' V')+L(64,48,121,48)+RH(121,48,two[2]+' kΩ')+L(197,48,250,48)+N(250,48,'VA')+L(250,48,306,48)+RH(306,48,two[3]+' kΩ')+L(382,48,448,48)+N(448,48,'VB')+L(448,48,448,85)+RV(448,85,two[4]+' kΩ')+L(448,145,448,182)+L(448,182,64,182)+G(448,182);
   description='Two unknown node voltages: apply KCL separately at VA and VB';
  }else{
   const m=t==='E5'?p.match(/Unknown node V connects to ([\d.]+) V through ([\d.]+) kΩ and to ground through ([\d.]+) kΩ/):p.match(/Node V has a ([\d.]+) V source through ([\d.]+) kΩ, a ([\d.]+) kΩ path to ground and a ([\d.]+) mA/);
   if(!m)return '';
   const inject=t==='E6'?+m[4]:+((p.match(/A ([\d.]+) mA current source also injects/)||[])[1]||0);
   h=SOURCE(m[1]+' V')+L(64,48,166,48)+RH(166,48,m[2]+' kΩ')+L(242,48,379,48)+N(379,48,'V')+L(379,48,379,85)+RV(379,85,m[3]+' kΩ')+L(379,145,379,182)+L(379,182,64,182)+G(379,182);
   if(inject){h+=L(379,48,557,48)+L(557,48,557,89)+IS(557,113,inject+' mA')+L(557,137,557,182)+L(557,182,379,182);}
   description='Nodal circuit'+(inject?' with a current source injecting into the upper node':' with a resistor path to ground');
  }
 }
 else if(t==='E9'){
  const m=p.match(/([\d.]+) V supplies ([\d.]+) forward-biased LED.*each dropping ([\d.]+) V, through a ([\d.]+) Ω resistor/);
  if(!m)return '';
  h=SOURCE(m[1]+' V')+L(64,48,141,48)+RH(141,48,m[4]+' Ω')+L(217,48,276,48);
  const n=+m[2];for(let i=0;i<n;i++){
   const x=276+129*i;
   h+='<polygon points="'+(x+6)+',28 '+(x+6)+',68 '+(x+44)+',48" stroke="'+aqua+'" stroke-width="2.4" fill="#ffffff"/>'+L(x+47,27,x+47,69,aqua)+L(x+47,48,x+125,48)+T(x+26,88,m[3]+' V',muted,13);
  }
  const end=276+n*129-4;h+=L(end,48,609,48)+L(609,48,609,182)+L(609,182,64,182);
  description='LEDs in series with one current-limiting resistor';
 }
 else if(t==='E11'){
  const m=p.match(/For a (AND|OR|NAND|NOR|XOR) gate with A=([01]) and B=([01])/);
  if(!m)return '';
  h=L(116,65,288,65)+L(116,142,288,142)+B(288,44,149,120)+L(437,103,605,103)+P(605,103)+T(112,55,'A = '+m[2],aqua,15,'end')+T(112,145,'B = '+m[3],aqua,15,'end')+T(363,111,m[1],white,23)+T(601,90,'Output = ?',aqua,15,'end');
  description='Logic-gate diagram with the given binary inputs';
 }
 else if(t==='E13'){
  const x=p.match(/A ([\d.]+) µF capacitor has ([\d.]+) V across it/),y=p.match(/Voltage across a ([\d.]+) µF capacitor increases linearly by ([\d.]+) V in ([\d.]+) ms/);
  if(!x&&!y)return '';
  const c=(x||y)[1];
  h=SOURCE(x?x[2]+' V':'V(t)')+L(64,48,380,48)+L(380,48,380,93)+CV(380,93,c+' µF')+L(380,107,380,182)+L(380,182,64,182)+G(380,182);
  if(y)h+=T(510,101,'ΔV = '+y[2]+' V',aqua)+T(510,131,'Δt = '+y[3]+' ms',aqua);
  description='Capacitor with voltage applied across its two plates';
 }
 else if(t==='E14'){
  const m=p.match(/R=([\d.]+) kΩ and C=([\d.]+) µF/);
  h=SOURCE('DC supply')+L(64,48,170,48)+RH(170,48,(m?m[1]:'R')+(m?' kΩ':''))+L(246,48,379,48)+N(379,48,'Vc(t)')+L(379,48,379,93)+CV(379,93,(m?m[2]:'C')+(m?' µF':''))+L(379,107,379,182)+L(379,182,64,182)+G(379,182);
  description='Resistor-capacitor charging circuit (no calculated answer shown)';
 }
 if(!h)return '';
 return '<figure class="circuit-figure"><svg class="circuit-svg" viewBox="0 0 700 220" role="img" aria-label="'+esc(description)+'" xmlns="http://www.w3.org/2000/svg">'+h+'</svg><figcaption>'+esc(description)+'</figcaption></figure>';
}
