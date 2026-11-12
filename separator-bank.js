/* Original, deliberately difficult ENG1013 practice; based on provided problem sheets, workshop slides, lab manuals, Python sheets and exam-style image question bank. Not official exam questions. */
const SEPARATOR_SOURCES={
  "E1": "Week 5 Electrical Problem Sheet: P1.14, P1.20, P1.24",
  "E2": "Week 5 Electrical Problem Sheet: P2.1, P2.3",
  "E3": "Week 5 Electrical Problem Sheet: P2.36–39, M5.6",
  "E4": "Week 5 Electrical Problem Sheet: P1.37, P2.34–35",
  "E5": "Week 6 Electrical Problem Sheet: P2.48–49, P2.56, M7.1",
  "E6": "Week 6 Electrical Problem Sheet: P2.94–95",
  "E7": "Week 5 Electrical Problem Sheet: M5.4",
  "E8": "Week 6 Electrical Problem Sheet: P2.80, P2.84, P2.88, M7.2",
  "E9": "Week 7 Electrical Problem Sheet: M8.1–4",
  "E10": "Week 7 Electrical Problem Sheet: M8.11–12",
  "E11": "Week 7 Electrical Problem Sheet: M8.13–15",
  "E12": "Week 8 Electrical Problem Sheet: P3.24, M10.1",
  "E13": "Week 8 Electrical Problem Sheet: P3.5, 6.10",
  "E14": "Week 8 Electrical Problem Sheet: P4.3, P4.23, M10.0",
  "E15": "Week 8 Workshop: periodic waveforms and PWM",
  "S1": "Python Problem Sheet 1 and exam-style question-bank flowchart images",
  "S2": "Python Problem Sheet 2 and exam-style question-bank code output images",
  "S3": "Python Problem Sheet 3: multi-condition classifications",
  "S4": "Python Problem Sheet 4: loops and sequences",
  "S5": "Python Problem Sheet 7 and exam-style question-bank tracing",
  "S6": "Python Problem Sheet 6: functions and weighted GPA",
  "S7": "Python Problem Sheet 5: validation",
  "S8": "Python Problem Sheet 7: algorithms",
  "S9": "Exam-style question-bank images: multi-step program tracing",
  "S10": "ENG1013 Laboratory Manuals Weeks 6–7: Firmata and Pymata",
  "M1": "Week 9 Materials Problem Sheet Q1–6 and Week 9 Workshop",
  "M2": "Week 9 Materials Problem Sheet Q7–8; Week 9 Workshop",
  "M3": "Week 9 Materials Problem Sheet Q6; Week 10 Workshop",
  "M4": "Week 10 Workshop: junctions and devices",
  "D1": "Week 11 Law & Ethics slides: bias, consent, privacy, accountability"
};
function separatorQuestion(id,avoidVariants=[]){
 const a=[],r=xs=>pick(xs);
 function n(key,prompt,value,unit,why,hint,precision=2){
  const q=num(id,prompt,value,unit,why,hint,4,{precision});
  q.variant="sep-"+key;a.push(q);
 }
 function m(key,prompt,right,wrong,why,hint,code=""){
  const q=mcq(id,prompt,String(right),wrong.map(String),why,hint,4,code);
  q.variant="sep-"+key;a.push(q);
 }
 switch(id){
 case 'E1':{
  const V=r([12,24,36]),I=r([2,3,4]),t=r([1.5,2,2.5]),eta=r([70,80,90]);
  n("battery-energy",`A ${V} V battery supplies ${I} A for ${t} hours at ${eta}% useful-energy efficiency. How many kJ of USEFUL energy are delivered? Show the conversion of hours to seconds.`,V*I*t*3.6*eta/100,"kJ",`Useful energy = VI×t×3600×η = ${(V*I*t*3.6*eta/100).toFixed(2)} kJ.`,"Use E=Pt; convert hours to seconds; account for efficiency.");
  const R=r([4,6,8]);n("parallel-power",`A ${V} V ideal source is connected to TWO identical ${R} Ω resistors in PARALLEL. Find total source power in W.`,2*V*V/R,"W",`Each resistor receives ${V} V. Total power is 2V²/R = ${2*V*V/R} W.`,"Parallel resistors have the same voltage.");
  break;}
 case 'E2':{
  const w=r([2,4,5]),x=r([2,3,4]),y=r([3,4,6]),z=r([3,6,9]);const rp=(x+y)*z/(x+y+z);
  n("nested-equivalent",`Between terminals a and b: a ${w} kΩ resistor is SERIES with two PARALLEL branches. Branch 1 is ${x} kΩ in series with ${y} kΩ; branch 2 is ${z} kΩ. Find total resistance Rab in kΩ.`,w+rp,"kΩ",`Branch 1=${x+y} kΩ. Parallel=${rp.toFixed(3)} kΩ. Rab=${(w+rp).toFixed(3)} kΩ.`,"Reduce inside the parallel branches first.");
  const V=r([12,18,24]),Rt=r([2,4,6]),R1=r([3,6,9]),R2=r([3,6]);const p=R1*R2/(R1+R2);const ib=V*p/(Rt+p)/R2;
  n("network-branch-current",`A ${V} V source drives ${Rt} kΩ in SERIES with a parallel pair ${R1} kΩ || ${R2} kΩ. Find current in the ${R2} kΩ BRANCH, in mA.`,ib,"mA",`Rparallel=${p.toFixed(3)} kΩ; Vparallel=${(V*p/(Rt+p)).toFixed(3)} V; Ibranch=${ib.toFixed(3)} mA.`,"Find voltage across parallel network before calculating branch current.");
  break;}
 case 'E3':{
  const Vs=r([12,15,18,24]),Rt=r([3,4,6]),Rb=r([4,6,8]),Rl=r([4,6,12]),Rp=Rb*Rl/(Rb+Rl),V=Vs*Rp/(Rt+Rp);
  n("loaded-divider-voltage",`Loaded divider: ${Vs} V supply → Rtop=${Rt} kΩ → Vout; Rbottom=${Rb} kΩ and load RL=${Rl} kΩ both connect Vout to ground. Find Vout in V.`,V,"V",`Rbottom||RL=${Rp.toFixed(3)} kΩ; loaded Vout=${V.toFixed(3)} V.`,"Load is parallel to Rbottom.");
  n("loaded-divider-load-current",`For a ${Vs} V divider with Rtop=${Rt} kΩ, Rbottom=${Rb} kΩ, and load RL=${Rl} kΩ across output to ground, find CURRENT through RL in mA.`,V/Rl,"mA",`Vout=${V.toFixed(3)} V; IL=Vout/${Rl} kΩ=${(V/Rl).toFixed(3)} mA.`,"Supply current is not the same as load current.");
  break;}
 case 'E4':{
  const enter=r([13,15,18]),out1=r([3,4,6]),out2=r([2,5,7]);
  n("signed-kcl",`At a node ${enter} mA enters. Currents of ${out1} mA and ${out2} mA LEAVE. A fourth current Ix is defined as LEAVING. Find signed Ix in mA.`,enter-out1-out2,"mA",`KCL: ${enter}−${out1}−${out2}−Ix=0. Ix=${enter-out1-out2} mA.`,"Keep the defined sign of Ix.");
  const Vs=r([18,24,30]),opp=r([4,6,8]),drop=r([3,5,7]);
  n("opposing-kvl",`In one loop there is a ${Vs} V rise, an OPPOSING ${opp} V source drop, and a resistor drop of ${drop} V. The remaining drop is Vx. Find Vx in V.`,Vs-opp-drop,"V",`KVL: +${Vs}−${opp}−${drop}−Vx=0, hence ${Vs-opp-drop} V.`,"Sources with opposite polarities have opposite signs.");
  break;}
 case 'E5':{
  const Vs=r([10,12,15]),Ra=r([2,3]),Rg=r([4,6]),Rm=r([2,4]),Rb=r([3,6]),I=r([1,2]);
  const gA=1/Ra+1/Rg+1/Rm,gB=1/Rm+1/Rb,gM=1/Rm,d=gA*gB-gM*gM;
  const VA=(Vs/Ra*gB+gM*I)/d,VB=(gA*I+gM*Vs/Ra)/d;
  const statement=`TWO-NODE circuit: ${Vs} V source through ${Ra} kΩ to VA; ${Rg} kΩ VA→ground; ${Rm} kΩ VA↔VB; ${Rb} kΩ VB→ground; ${I} mA source injects INTO VB from ground.`;
  const why=`KCL A: (VA−${Vs})/${Ra}+VA/${Rg}+(VA−VB)/${Rm}=0. KCL B: (VB−VA)/${Rm}+VB/${Rb}=${I}. Solving: VA=${VA.toFixed(3)} V, VB=${VB.toFixed(3)} V.`;
  n("two-node-unknown",statement+" Find VA in volts.",VA,"V",why,"Write a simultaneous KCL equation for EACH node.");
  n("two-node-branch",statement+` Find current through the ${Rm} kΩ link POSITIVE FROM VA to VB, in mA.`,(VA-VB)/Rm,"mA",why+` I=(VA−VB)/${Rm}=${((VA-VB)/Rm).toFixed(3)} mA.`,"Calculate both node voltages before the branch current.");
  break;}
 case 'E6':{
  const Vs=r([9,12,15,18]),Ra=r([2,3,4]),Rb=r([3,4,6]),I=r([1,1.5,2]),sign=r([-1,1]);
  const Rp=Ra*Rb/(Ra+Rb),Vsource=Vs*Rb/(Ra+Rb),Vcurrent=sign*I*Rp,V=Vsource+Vcurrent;
  const statement=`A ${Vs} V source connects through ${Ra} kΩ to node V; ${Rb} kΩ connects V to ground; a ${I} mA independent source ${sign>0?'INJECTS into V from ground':'DRAWS current OUT OF V to ground'}.`;
  const why=`Voltage-only contribution=${Vsource.toFixed(3)} V; current-only contribution=${Vcurrent.toFixed(3)} V using Rparallel=${Rp.toFixed(3)} kΩ. Vtotal=${V.toFixed(3)} V.`;
  n("sources-signed-node",statement+" Find node V using superposition, in V.",V,"V",why,"Open the current source and short the voltage source; add signed contributions.");
  n("sources-signed-branch",statement+` Find current in the ${Rb} kΩ branch, POSITIVE DOWNWARDS, in mA.`,V/Rb,"mA",why+` Idown=V/${Rb}=${(V/Rb).toFixed(3)} mA.`,"Compute the node voltage first, then current including sign.");
  break;}
 case 'E7':{
  const R=r([2,3,5]),V=r([8,12,16]),k=r([0.2,0.3]);const val=(V/R)/(2/R-k);
  n("dependent-active",`BONUS TOPIC: ${V} V source via ${R} kΩ to V; a ${R} kΩ resistor V→ground; a dependent current source injects kV mA from ground to V, k=${k} mA/V. Find V in V (do NOT deactivate the dependent source).`,val,"V",`KCL (V−${V})/${R}+V/${R}−${k}V=0; V=${val.toFixed(3)} V.`,"Keep controlled sources active in nodal analysis.");
  break;}
 case 'E8':{
  const Vs=r([12,18,24]),Rt=r([2,3,6]),Rb=r([3,6,9]),Rl=r([2,4,8]);
  const Vth=Vs*Rb/(Rt+Rb),Rth=Rt*Rb/(Rt+Rb),IL=Vth/(Rth+Rl);
  const setup=`A ${Vs} V source feeds Rtop=${Rt} kΩ into terminal a; Rbottom=${Rb} kΩ connects a to b (ground).`;
  n("thevenin-loaded-current",setup+` A ${Rl} kΩ load is connected from a to b. Find LOAD CURRENT using Thévenin, in mA.`,IL,"mA",`Vth=${Vth.toFixed(3)} V, Rth=${Rth.toFixed(3)} kΩ; IL=Vth/(Rth+${Rl})=${IL.toFixed(3)} mA.`,"Disconnect load to find Vth and Rth; reconnect it afterwards.");
  n("norton-short",setup+" Short terminals a and b with an ideal wire. Find short-circuit Norton current in mA.",Vs/Rt,"mA",`A short bypasses Rbottom. IN=Vs/Rtop=${Vs}/${Rt}=${(Vs/Rt).toFixed(3)} mA.`,"The short bypasses the lower resistor.");
  break;}
 case 'E9':{
  const Vs=r([9,12,15]),R=r([180,220,330]),drops=r([[2,2.1,2.2],[1.8,2,2.4],[2,2,2]]),sum=drops.reduce((s,x)=>s+x,0);
  const vr=Vs-sum;
  n("three-series-led",`THREE series LEDs drop ${drops.join(', ')} V respectively. A ${R} Ω resistor limits current from a ${Vs} V supply. Find LED current in mA.`,vr/R*1000,"mA",`Resistor voltage=${vr.toFixed(2)} V. I=VR/R×1000=${(vr/R*1000).toFixed(3)} mA.`,"Subtract ALL diode drops before Ohm's law.");
  n("led-resistor-power",`Same circuit: LEDs drop ${drops.join(', ')} V, supply ${Vs} V, resistor ${R} Ω. Find resistor power in mW.`,vr*vr/R*1000,"mW",`P=VR²/R=(${vr.toFixed(2)})²/${R} W=${(vr*vr/R*1000).toFixed(3)} mW.`,"Resistor power uses its OWN voltage drop.");
  break;}
 case 'E10':{
  const Vcc=r([5,9,12]),R=r([100,150,220]),Ron=r([1,2]),Vf=r([2,2.2]),Vgs=r([0,5]),Vth=r([2,2.5]);
  const on=Vgs>Vth,cur=on?1000*(Vcc-Vf)/(R+Ron):0;
  n("mosfet-led-switch",`BONUS TOPIC: N-MOSFET low-side switch: VGS=${Vgs} V, threshold=${Vth} V, RDS,on=${Ron} Ω. A ${Vf} V-drop LED and ${R} Ω resistor are in series to ${Vcc} V supply. Find drain current in mA with the simple on/off model.`,cur,"mA",on?`VGS>Vth; I=(${Vcc}−${Vf})/(${R}+${Ron})=${cur.toFixed(3)} mA.`:"VGS≤Vth; ideal switch off; ID=0 mA.","Check the gate threshold before calculating current.");
  break;}
 case 'E11':{
  const A=r([0,1]),B=r([0,1]),C=r([0,1]),val=Number((A===1&&B===0)||(B===1&&C===1));
  m("three-input-logic",`For O = (A AND NOT B) OR (B AND C), evaluate A=${A}, B=${B}, C=${C}. What is O?`,val,[1-val,"High impedance","Insufficient information"],`Compute NOT B, then each AND, then OR. Result=${val}.`,"Evaluate intermediate gates separately.");
  const xor=Number(A!==B);
  m("nand-or-xor",`O=(A NAND B) AND (A OR B). With A=${A} and B=${B}, what is output O?`,xor,[1-xor,5,"Undefined"],`The combination is XOR; XOR=${xor} for ${A},${B}.`,"Construct both intermediate gate outputs.");
  break;}
 case 'E12':{
  const C1=r([4,6,8]),C2=r([4,6,12]),C3=r([2,3,5]),Vs=r([6,12,18]),series=C1*C2/(C1+C2);
  n("three-cap-network",`C1=${C1} µF and C2=${C2} µF are in SERIES. This branch is in PARALLEL with C3=${C3} µF. Find Ceq in µF.`,series+C3,"µF",`Cseries=${series.toFixed(3)} µF, then add parallel C3: total=${(series+C3).toFixed(3)} µF.`,"For capacitors, series is reciprocal and parallel adds.");
  n("series-voltage-split",`Two capacitors C1=${C1} µF and C2=${C2} µF are in SERIES across ${Vs} V. Find VOLTAGE across C1 in V.`,Vs*C2/(C1+C2),"V",`Same charge Q: V1=Vs×C2/(C1+C2)=${(Vs*C2/(C1+C2)).toFixed(3)} V.`,"Series capacitors share charge, not voltage.");
  break;}
 case 'E13':{
  const C=r([100,200,330,470]),Vi=r([3,5,8]),Vf=r([-2,0,1]),dt=r([2,4,5]);
  n("signed-slope",`A ${C} µF capacitor changes voltage LINEARLY from ${Vi} V to ${Vf} V in ${dt} ms. Find signed capacitor current in mA, positive entering its positive terminal.`,C*(Vf-Vi)/dt,"mA",`i=C×ΔV/Δt=${C}×(${Vf}−${Vi})/${dt}=${(C*(Vf-Vi)/dt).toFixed(3)} mA.`,"A negative slope gives negative current.");
  const u=r([50,75,100]),v=r([9,12]),cap=r([500,1000]);
  n("constant-discharge-time",`A ${cap} µF capacitor initially at ${v} V discharges under a CONSTANT ${u} µA current. How long in seconds until it reaches zero V?`,cap*v/u,"s",`t=CΔV/I=(${cap} µF×${v} V)/${u} µA=${(cap*v/u).toFixed(3)} s.`,"µF × V / µA gives seconds.");
  break;}
 case 'E14':{
  const R=r([2,4,6]),C=r([50,100,200]),Vi=r([10,12,15]),Vf=r([0,3]),target=r([4,6,8]),tau=R*C;
  const ratio=(target-Vf)/(Vi-Vf);
  if(ratio>0&&ratio<1){
   const time=-tau*Math.log(ratio);
   n("rc-threshold",`Capacitor begins at ${Vi} V, tends to final ${Vf} V through Rth=${R} kΩ and C=${C} µF. At what time t (ms) does VC reach ${target} V?`,time,"ms",`τ=${tau} ms. t=−τ ln[(Vtarget−Vfinal)/(Vinitial−Vfinal)] = ${time.toFixed(3)} ms.`,"Rearrange the exponential using ln.");
  }
  const after=Vf+(Vi-Vf)*Math.exp(-2);
  n("rc-nonzero-final",`Capacitor begins at ${Vi} V and tends to ${Vf} V. Find VC after 2 time constants in V.`,after,"V",`VC=Vf+(Vi−Vf)e^(−2)=${after.toFixed(3)} V.`,"Include nonzero final voltage.");
  break;}
 case 'E15':{
  const hi=r([3.3,5]),on=r([2,3,4]),off=r([3,5,6]);
  n("pwm-average",`BONUS TOPIC: A ${hi} V PWM signal is ON for ${on} ms and OFF for ${off} ms. Find mean output voltage in V.`,hi*on/(on+off),"V",`Duty=${on}/(${on}+${off}); Vmean=${(hi*on/(on+off)).toFixed(3)} V.`,"Duty means on-time divided by total period.");
  n("pwm-frequency",`BONUS TOPIC: PWM ON for ${on} ms, OFF for ${off} ms. Find frequency in Hz.`,1000/(on+off),"Hz",`T=${on+off} ms, f=1000/Tms=${(1000/(on+off)).toFixed(3)} Hz.`,"Period is on-time PLUS off-time.");
  break;}
 case 'S1':{
  const N=r([5,6,7,8]),step=r([2,3]);let total=0;for(let x=0;x<N;x++)if(x%step===0)total+=x;
  m("flowchart-loop-trace",`Algorithm: x=0, total=0; WHILE x<${N}: IF x divisible by ${step}, add x to total; then x=x+1; after loop print total. What is printed?`,total,[total+step,N,Math.floor(N/step)],`Trace x from 0 to ${N-1}; multiples of ${step} contribute. Total=${total}.`,"Count loop iterations and conditional additions separately.");
  m("decision-before-process","A flowchart checks x>8 BEFORE executing x=x+3, and loops to the decision after the process. Initial x=1. How many times does the process execute?",3,[2,4,"Infinite"],"The process runs for x=1,4,7, producing 4,7,10; the next condition is true.","Do not count the final decision as a process execution.");
  break;}
 case 'S2':{
  const A=r([5,6,7]),B=r([2,3,4]),val=A*B-Math.floor(A/B)+(A%B);
  m("mixed-precedence","Evaluate the exact Python printed value.",val,[A*B,val+A,val-1],`Product ${A*B}; floor division ${Math.floor(A/B)}; remainder ${A%B}; total ${val}.`,"Calculate * // % before addition/subtraction.",`a = ${A}\nb = ${B}\nprint(a * b - a // b + a % b)`);
  const N=r([10,11,14,15]),D=r([3,4]),floor=Math.floor(-N/D),mod=-N-floor*D;
  m("negative-floor",`Give BOTH printed lines in order as 'first then second'.`,`${floor} then ${mod}`,[`${Math.trunc(-N/D)} then ${mod}`,`${floor} then ${-mod}`,`${Math.round(-N/D)} then ${mod}`],`Python floor division is toward negative infinity: -${N}//${D}=${floor}; -${N}%${D}=${mod}.`,"Negative floor division does not truncate toward zero.",`print(-${N} // ${D})\nprint(-${N} % ${D})`);
  break;}
 case 'S3':{
  const x=r([8,10,12]),y=r([3,4,5]);let val=x;if(val>9)val-=y;if(val>=5)val*=2;else val+=10;
  m("two-independent-ifs","What is printed after BOTH if statements execute?",val,[x,x*2,x-y],`First if may modify x, then the second if tests the updated x. Result=${val}.`,"The else belongs only to the second if.",`x = ${x}\ny = ${y}\nif x > 9:\n    x -= y\nif x >= 5:\n    x *= 2\nelse:\n    x += 10\nprint(x)`);
  const A=r([5,6,7]),B=r([3,4,5]),out=!((A>B)&&(B%2===0))||A===6;
  m("boolean-precedence","What Boolean value prints?",out?'True':'False',[out?'False':'True',"0","1"],`Compute comparisons and AND under NOT first; then OR. Result ${out}.`,"Follow parentheses and Boolean precedence.",`a = ${A}\nb = ${B}\nprint(not (a > b and b % 2 == 0) or a == 6)`);
  break;}
 case 'S4':{
  const N=r([3,4,5]),M=r([4,5,6]);let sum=0;for(let i=1;i<=N;i++)for(let j=0;j<M;j++)if((i+j)%3!==0)sum+=i;
  m("nested-loops-continue","Nested loops with continue: what is printed?",sum,[sum+N,sum-M,sum*2],`i=1..${N}, j=0..${M-1}; skip pairs when (i+j)%3=0. Sum=${sum}.`,"Continue skips one INNER-loop iteration.",`total = 0\nfor i in range(1, ${N+1}):\n    for j in range(${M}):\n        if (i + j) % 3 == 0:\n            continue\n        total += i\nprint(total)`);
  const start=r([11,14,17]);let val=start,steps=0;while(val>2){val=Math.floor(val/2);steps++;}
  m("while-floor-loop","Repeated floor division in a while loop. What prints?",steps,[val,steps+1,start],`Start ${start}; repeatedly halve using // until n≤2. ${steps} iterations.`,"Check while condition again after every update.",`n = ${start}\nsteps = 0\nwhile n > 2:\n    n //= 2\n    steps += 1\nprint(steps)`);
  break;}
 case 'S5':{
  const idx=r([2,3,4]);const code=`data = [1, 2, 3, 4, 5, 6]\nother = data\na = data[1:5:2]\nother[${idx}] = 20\nprint(sum(a) + data[${idx}])`;
  m("alias-versus-slice","Slicing and aliasing: what is printed?",26,[6,20,46],"a is a NEW slice [2,4]. other refers to data and sets data[index]=20; 2+4+20=26.","Slice creates a list; aliasing does not.",code);
  const N=r([5,6,7]),vals=[...Array(N).keys()];vals.splice(1,3,9,8);const v=vals.length+vals[vals.length-2];
  m("slice-length-mutation","The list slice is replaced with a shorter list. What is printed?",v,[N,v+1,v-2],`New list ${JSON.stringify(vals)}; len=${vals.length}, second-last=${vals[vals.length-2]}, sum=${v}.`,"Slice assignment may alter list length.",`values = list(range(${N}))\nvalues[1:4] = [9, 8]\nprint(len(values) + values[-2])`);
  break;}
 case 'S6':{
  const N=r([4,5,6]);const expect=N%2===0?`${N+1} then None`:String(N*2);
  m("print-versus-return","Give the complete console output, in order, using 'then' for successive lines.",expect,[`${N+1} then ${N+1}`,String(N+1),`${N*2} then None`],N%2===0?`Function prints ${N+1} then implicitly returns None; caller prints None.`:`Function returns ${N*2}; caller prints one line.`,"A print statement does NOT return a value.",`def calc(x):\n    if x % 2 == 0:\n        print(x + 1)\n    else:\n        return x * 2\nresult = calc(${N})\nprint(result)`);
  const grades=r([[4,3,2],[3,4,2],[4,4,1]]),credits=r([[6,12,6],[3,6,9]]),avg=grades.reduce((s,x,i)=>s+x*credits[i],0)/credits.reduce((s,x)=>s+x,0);
  m("weighted-gpa","A function calculates credit-weighted GPA. Grade values A=4,B=3,C=2,D=1,F=0; grades ["+grades.join(",")+"]; credits ["+credits.join(",")+"]. What is GPA to 3 decimal places?",avg.toFixed(3),[(grades.reduce((s,x)=>s+x,0)/3).toFixed(3),(avg+0.5).toFixed(3),(avg-0.5).toFixed(3)],`Σ(grade×credit)/Σ(credit)=${avg.toFixed(3)}. Don't use a simple mean.`,"Multiply each grade by its credits before summing.");
  break;}
 case 'S7':{
  const code=`values = ["7", "bad", "4.5", "-2"]\ntotal = 0\nfor item in values:\n    try:\n        n = int(item)\n        if n < 0:\n            raise ValueError("negative")\n    except ValueError:\n        continue\n    total += n\nprint(total)`;
  m("validation-continue","Trace conversion, explicit raise and continue. What prints?",7,[9,5,11],"Only '7' passes; 'bad' and '4.5' raise ValueError during int(); -2 explicitly raises ValueError.","Continue skips remaining body of current loop iteration.",code);
  const code2=`def convert(s):\n    try:\n        n = int(s)\n    except ValueError:\n        return -1\n    if n % 2:\n        return n + 1\n    return n\nprint(convert("11") + convert("x"))`;
  m("validation-function-return","Two calls return different values. What prints?",11,[12,13,-1],"convert('11')=12; convert('x')=-1; sum=11.","Follow both branches and add the returned values.",code2);
  break;}
 case 'S8':{
  const N=r([15,31,63]),comparisons=Math.ceil(Math.log2(N+1));
  m("binary-search-steps",`BONUS TOPIC: sorted list of ${N} distinct elements. What is the worst-case midpoint comparison count for standard binary search?`,comparisons,[N,comparisons+1,Math.floor(N/2)],`Halving ${N} possibilities gives ${comparisons} comparisons in the worst case.`,"Think logarithmically, not linearly.");
  break;}
 case 'S9':{
  const K=r([3,4,5]),items=[1,2,K,4],out=items.map((v,i)=>i%2===0?2*v:items[i-1]+v),sum=out.slice(1).reduce((s,x)=>s+x,0);
  m("index-loop-slice","Trace indexed looping, append and final slicing. What prints?",sum,[out.reduce((s,x)=>s+x,0),sum+K,sum-4],`Generated output list ${JSON.stringify(out)}; sum of [1:] is ${sum}.`,"Build the intermediate output list before slicing.",`numbers = [1, 2, ${K}, 4]\noutput = []\nfor i in range(len(numbers)):\n    if i % 2 == 0:\n        output.append(numbers[i] * 2)\n    else:\n        output.append(numbers[i-1] + numbers[i])\nprint(sum(output[1:]))`);
  const total=10+2*K;
  m("mutating-function-alias","Trace list mutation, aliasing and a return value. What prints?",total,[total-K,total+K,8+K],`First item changes from 2 to ${2+K}; function returns ${8+K}, then x[0]=${2+K}; total=${total}.`,"x and y refer to the same mutable list.",`def change(items):\n    items[0] += ${K}\n    return items[0] + items[-1]\nx = [2, 4, 6]\ny = x\nz = change(y)\nprint(z + x[0])`);
  const N=r([5,6,7]);let a=0;for(let i=1;i<=N;i++){if(i%2===0)a+=i;else if(i>3)a-=1;else a+=2;}
  m("conditional-accumulator","Trace if/elif/else inside a loop. What prints?",a,[a+N,a-2,a+1],`Exactly one branch per iteration; final acc=${a}.`,"Table n, branch and running acc.",`acc = 0\nfor n in range(1, ${N+1}):\n    if n % 2 == 0:\n        acc += n\n    elif n > 3:\n        acc -= 1\n    else:\n        acc += 2\nprint(acc)`);
  break;}
 case 'S10':{
  m("sonar-setup","BONUS TOPIC: Pymata4 reads an HC-SR04 sensor. Which configuration order is valid?","Upload FirmataExpress, connect board, set sonar pin mode, then read distances",["Set digital_write on echo without setup","Read analogue mode from TRIG only","Unplug USB before Python readings"],"Firmware, pin modes and Python communications have distinct roles.","Set sonar mode before trying sonar_read().");
  break;}
 case 'M1':{
  m("intrinsic-temperature","With increasing temperature, what is the usual trend for an INTRINSIC semiconductor?","Electron–hole pairs increase and resistivity generally decreases",["Only electrons exist and resistivity rises","Conduction occurs only by holes","Bandgap disappears immediately"],"Thermal excitation creates electron–hole pairs; carrier concentration increases.","Both electrons and holes contribute in intrinsic conduction.");
  m("ge-si-gap","At similar room temperature, which intrinsic semiconductor generally has MORE thermally generated carriers if all else is comparable?","Ge with a smaller bandgap than Si",["Si because its bandgap is larger","Neither: intrinsic materials have zero carriers","Both identical, independent of bandgap"],"Smaller energy barrier permits more thermal excitation.","Compare bandgap sizes, not only the material labels.");
  break;}
 case 'M2':{
  const e=r([2,3,4]),h=r([1,2]),muE=r([0.2,0.3,0.4]),muH=r([0.1,0.15,0.2]);
  const sigma=1.602e-19*(e*1e21*muE+h*1e21*muH);
  n("both-carrier-conductivity",`Carrier densities ne=${e}×10^21 m^-3, nh=${h}×10^21 m^-3; mobilities µe=${muE}, µh=${muH} m²/(V·s); charge magnitude 1.602×10^-19 C. Find conductivity σ in S/m, including BOTH carriers.`,sigma,"S/m",`σ=q(neµe+nhµh)=${sigma.toFixed(3)} S/m.`,"Neither electrons nor holes can be ignored.");
  const Eg=r([1.11,1.4,1.8,2]),lambda=r([500,650,850,1100]),en=1240/lambda,passes=en>=Eg;
  m("optical-bandgap-compare",`A semiconductor has Eg=${Eg} eV. A photon with λ=${lambda} nm arrives. In the simplified band-to-band model, which claim holds?`,passes?"Photon has enough energy for excitation":"Photon is below the band-to-band threshold",passes?["Photon is below the band-to-band threshold","Bandgap has units of nm","Photons have zero energy"]:["Photon has enough energy for excitation","Bandgap has units of nm","Photons have zero energy"],`Eph=1240/${lambda}=${en.toFixed(3)} eV; compare with Eg=${Eg} eV. Actual absorption may have additional effects.`,"Convert wavelength into photon energy before comparing.");
  break;}
 case 'M3':{
  const atom=r(["phosphorus","arsenic","antimony","boron","gallium","aluminium"]),donor=["phosphorus","arsenic","antimony"].includes(atom);
  const right=donor?"n-type; electrons majority; holes minority":"p-type; holes majority; electrons minority";
  m("dopant-majority-minority",`Silicon is doped with ${atom}. In the EXTRINSIC region, identify semiconductor type, MAJORITY mobile carrier and MINORITY mobile carrier.`,right,[donor?"p-type; holes majority; electrons minority":"n-type; electrons majority; holes minority","Protons majority; neutrons minority","Only one kind of mobile carrier can exist"],`${atom} is a ${donor?"pentavalent donor":"trivalent acceptor"}; ${right}.`,"Dopants do not create protons or neutrons as mobile carriers.");
  m("high-temp-extrinsic","N-doped Ge is heated far above the extrinsic temperature region. Which mechanism becomes important?","Thermal generation of both electrons and holes across the bandgap",["Only the original dopants can provide all electrons","The crystal necessarily becomes p-type","Electrons turn into neutrons"],"Intrinsic electron–hole generation dominates at sufficiently high temperatures.","The high-temperature regime differs from ordinary room-temperature extrinsic conduction.");
  break;}
 case 'M4':{
  m("pn-bias","BONUS TOPIC: Which statement correctly describes a typical p–n junction?","Forward bias reduces the barrier; reverse bias usually widens depletion",["Forward bias always widens depletion","Reverse bias always gives large forward current","Doping type swaps on every voltage reversal"],"Forward bias facilitates diffusion; reverse bias extends depletion and suppresses current.","Compare depletion-barrier changes.");
  break;}
 case 'D1':{
  m("data-representativeness","A pedestrian-detection AI trains mostly on affluent daytime footage and misses dark rural roads. What is the BEST predeployment action?","Collect representative consent-compliant data and validate subgroup outcomes",["Hide subgroup failure rates","Release first, test only average accuracy","Scrape identifying video without permission"],"Training bias is reproduced in predictions; subgroup tests and consent mitigate distinct harms.","Identify which people are underrepresented and who is harmed.");
  m("privacy-opacity","A team scrapes identifiable social media photos for hiring AI without consent and cannot explain rejections. Which concern is MOST COMPLETE?","Privacy/consent, algorithmic bias and accountability",["Only code speed","Only storage size","No issue if average accuracy is high"],"Week 11 covers consent/privacy, biased data and opaque decision accountability.","Multiple simultaneous ethical duties can be relevant.");
  break;}
 default:m("scope","Which is the strongest method for an unfamiliar ENG1013 question?","Identify the model and verify units",["Ignore units","Guess from answer length","Assume familiar values"],"Use actual taught model and units.");
 }
 for(const q of a){q.level=4;q.separator=true;q.sourceNote=SEPARATOR_SOURCES[id]||"ENG1013 workshop source";}
 const available=a.filter(q=>!avoidVariants.includes(q.variant));
 return pick(available.length?available:a);
}
