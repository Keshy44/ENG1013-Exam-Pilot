/* ENG1013 Exam Pilot — expanded question bank and variation control.
   New conceptual variants supplement existing course-aligned numeric and coding problems. */
function extraTopicQuestions(id,level){
 const a=[];
 const add=(key,q)=>a.push({...q,variant:key});
 const C=(key,prompt,answer,wrong,explanation,hint)=>add(key,mcq(id,prompt,answer,wrong,explanation,hint,level));
 const P=(key,prompt,code,answer,wrong,explanation,hint)=>add(key,codeq(id,prompt,code,String(answer),wrong,explanation,hint,level));
 switch(id){
 case 'E2':
  C('series-current','Which quantity is always the same through resistors connected in series?','Current',['Voltage across each resistor','Resistance of each resistor','Power dissipated by each resistor'],'A series path has a single current through every component.','One path means one current.');
  C('parallel-voltage','Which quantity is the same across every resistor connected directly in parallel?','Voltage',['Current','Resistance','Power'],'Parallel components connect across the same pair of nodes.','Parallel branches share the same two nodes.');
  break;
 case 'E3':
  C('divider-resistance','In an unloaded voltage divider, Rtop is fixed and Rbottom increases. What happens to Vout measured across Rbottom?','Vout increases',['Vout decreases','Vout always stays constant','Vout becomes negative'],'Vout=Vs×Rbottom/(Rtop+Rbottom); a larger bottom resistor takes a larger fraction.','Look at the fraction across the bottom resistor.');
  C('divider-load','If a load resistor is connected from an ideal divider output to ground, how does Vout generally change?','Vout decreases',['Vout increases','Vout stays exactly the same','Vout becomes equal to Vs'],'The load appears in parallel with Rbottom, making its equivalent resistance smaller.','The load is in parallel with the bottom resistor.');
  break;
 case 'E4':
  C('kcl-law','At a circuit node, which statement is KCL?','Total current entering equals total current leaving',['Voltage rises equal resistance','Current is the same in every parallel branch','Power entering equals voltage'],'KCL is conservation of charge at a junction.','Think conservation of current at a node.');
  C('kvl-law','For a closed circuit loop, which statement is KVL?','The algebraic sum of voltages is zero',['The algebraic sum of currents is zero','Every resistor has equal voltage','Each branch current must be equal'],'KVL states that voltage rises and drops sum to zero around a closed loop.','Go around the whole closed loop.');
  break;
 case 'E5':
  C('entering-current-sign','Using the convention "all currents LEAVING the node are positive", what sign is a 2 mA source injecting current INTO that node?','−2 mA',['+2 mA','0 mA','+2 A'],'An entering current is negative when the node equation counts outgoing currents as positive.','The source arrow points in, not out.');
  C('node-resistor-current','A resistor R connects unknown node VA to a known voltage VB. Which expression is the current leaving VA through R?','(VA − VB)/R',['(VA + VB)/R','VB/R','(VB − VA)/R'],'Resistor current leaving the chosen node is (node voltage − other-end voltage)/resistance.','Start from the voltage at the node you are analysing.');
  break;
 case 'E6':
  C('open-current-source','When using superposition and analysing a voltage source by itself, what replaces another ideal independent CURRENT source?','An open circuit',['A short circuit','A resistor of 1 Ω','An ideal voltage source'],'A deactivated ideal independent current source supplies zero current, represented by an open circuit.','Zero current means no conducting path.');
  C('short-voltage-source','When using superposition and analysing a current source by itself, what replaces another ideal independent VOLTAGE source?','A short circuit',['An open circuit','An inductor','A current source'],'An ideal independent voltage source set to zero volts is equivalent to a short circuit.','Zero voltage difference between its terminals.');
  C('signed-sum','Two sources individually produce +3 V and −5 V at the same measured node (relative to ground). How do you combine the contributions?','Add algebraically, including signs',['Add their absolute values','Multiply the contributions','Average the contributions'],'Superposition adds the individual linear responses with their directions/signs.','A negative contribution must remain negative.');
  break;
 case 'E7':
  C('dependent-control','What determines the output of a dependent voltage or current source?','Another voltage or current elsewhere in the circuit',['Only the battery voltage','Only the circuit temperature','The source is always zero'],'A dependent source is controlled by a circuit variable such as a specified voltage or current.','Controlled source is another name for dependent source.');
  C('dependent-test-source','If a network contains dependent sources and you need equivalent resistance, which approach may be necessary?','Apply a test voltage or current at the terminals',['Switch off all sources including dependent ones','Assume all resistors are in series','Ignore the controlled source'],'A test source can determine resistance while dependent sources remain active.','Keep dependent sources active.');
  break;
 case 'E9':
  C('forward-bias','A diode conducts in its usual forward-bias approximation when…','Its anode is at higher potential than its cathode',['Its cathode is always at higher potential','Its current-limiting resistor is removed','It is connected to ground at both terminals'],'Forward bias means the anode is positive relative to the cathode (by sufficient forward voltage).','Think polarity across the diode.');
  C('led-resistor','The supply voltage is fixed. If the series current-limiting resistor value INCREASES, what happens to LED current?','It decreases',['It increases','It must stay constant','It always reverses direction'],'Using I=(Vs−ΣVf)/R, increasing R decreases current when the diode drops are approximately constant.','Use I=V/R.');
  break;
 case 'E10':
  C('nmos-on','For an idealised enhancement N-MOSFET used as a switch, what is needed to begin conduction?','VGS above the threshold voltage',['VGS below zero regardless of threshold','A negative gate current','A short between gate and drain'],'When VGS exceeds the threshold the channel can form. This alone does not guarantee saturation.','Compare VGS with the threshold.');
  C('mosfet-gate','Why can a MOSFET be controlled with little steady-state gate current?','Its gate is insulated from the channel',['Its gate behaves as a large load resistor','The gate is always connected to ground','It requires current to flow through the gate'],'A MOSFET has an insulated gate, so it is voltage-controlled with little DC gate current.','Remember the insulated gate.');
  break;
 case 'E12':
  C('cap-series-bound','Two positive capacitors are connected in series. Their equivalent capacitance is…','Smaller than either capacitance',['Larger than their sum','Equal to their sum','Always exactly half their sum'],'For series capacitors 1/Ceq=1/C1+1/C2, so Ceq is smaller than the smaller capacitor.','Capacitors in series behave like parallel resistors for combining values.');
  C('cap-parallel-bound','A second capacitor is added in parallel across a first one. What happens to the equivalent capacitance?','It increases',['It decreases','It becomes zero','It must remain unchanged'],'Capacitances in parallel add: Ceq=C1+C2.','Capacitors in parallel add.');
  break;
 case 'E13':
  C('capacitor-constant-voltage','For an ideal capacitor, if the voltage across it is constant over time, what is its current?','0 A',['1 A','Infinite','Equal to CV'],'i=C×dV/dt; constant voltage has zero time derivative.','Think about the slope of voltage versus time.');
  C('double-capacitance','For the same voltage V, doubling capacitor C causes stored charge Q=CV to…','Double',['Halve','Stay the same','Become zero'],'Q is proportional to C when V is fixed.','Q=CV.');
  break;
 case 'E14':{
  const final=pick([6,9,12,15]),time=pick([1,2,3]),fraction=1-Math.exp(-time),voltage=final*fraction;
  add('charging-at-multiple-tau',num(id,'An initially uncharged RC capacitor charges toward '+final+' V. What is Vc after '+time+' time constant'+(time===1?'':'s')+'? Give V to 1 decimal place.',voltage,'V','Vc=Vfinal×(1−e^(−t/τ)) = '+final+'×(1−e^(−'+time+')) = '+round(voltage,1)+' V.','Use t/τ = '+time+' in the charging formula.',2));
  C('discharge-one-tau','A charged capacitor discharges through a resistor. Approximately what percentage of its STARTING voltage remains after one time constant?','36.8%',['63.2%','0%','100%'],'During ideal discharge V=V0 e^(−t/τ), and e^(−1)≈0.368.','For discharge, 63.2% of the initial voltage has been lost after one τ.');
  C('slower-rc','R doubles and C stays constant. What happens to the RC charging time constant?','It doubles',['It halves','It stays unchanged','It becomes zero'],'τ=RC, so doubling R doubles τ and slows charging.','Time constant is directly proportional to R.');
  break;
 }
 case 'E15':
  C('pwm-duty','A 5 V PWM waveform is HIGH for 25% of each cycle. What is its average voltage in the ideal approximation?','1.25 V',['5 V','2.5 V','0.25 V'],'Average ideal PWM voltage ≈ duty fraction × high level = 0.25×5=1.25 V.','Multiply HIGH voltage by duty cycle.');
  C('pwm-definition','A PWM signal is HIGH for 3 ms in a period of 10 ms. What is its duty cycle?','30%',['3%','70%','300%'],'Duty cycle = ON time ÷ period ×100% = 3/10×100%=30%.','Duty cycle measures the percentage of time HIGH.');
  break;
 case 'S2':
  P('true-division','What does Python print?','print(7 / 2)','3.5',['3','4','2'],'The / operator performs true division, producing a float.','/ is different from //.');
  P('type-input','What does this print?','value = "5"\nprint(type(value).__name__)','str',['int','float','bool'],'A quoted number is a string; type(value).__name__ is str.','Quotes make a string.');
  P('arithmetic-precedence','What does this code print?','print(2 + 3 * 4)','14',['20','24','11'],'Multiplication is evaluated before addition: 2+12=14.','Apply operator precedence.');
  break;
 case 'S4':{
  const step=pick([2,3]),stop=pick([8,9,11]),seq=[];for(let k=1;k<stop;k+=step)seq.push(k);
  P('range-step','What is the final value of total?', 'total = 0\nfor i in range(1, '+stop+', '+step+'):\n    total += i\nprint(total)',String(seq.reduce((sum,k)=>sum+k,0)),[String(seq.length),String(stop),String(seq.reduce((sum,k)=>sum+k,0)+stop)],'range starts at 1, advances by '+step+', and stops before '+stop+'. Values: '+seq.join(', ')+'.','List the actual values of range before summing.');
  const max=pick([3,4,5]),base=pick([0,1]);
  P('while-counter','How many times does the body of the while loop run?','n = '+base+'\ncount = 0\nwhile n < '+max+':\n    n += 1\n    count += 1\nprint(count)',String(max-base),[String(max),String(max+1),String(base)],'The loop runs until n reaches '+max+', so there are '+(max-base)+' iterations.','Track the value at the END of each iteration.');
  P('continue','What does this Python code print?', 'total = 0\nfor i in range(1, 6):\n    if i % 2 == 0:\n        continue\n    total += i\nprint(total)','9',['15','6','3'],'continue skips even numbers; only 1+3+5 contribute, giving 9.','Even numbers are skipped before addition.');
  break;
 }
 case 'S5':
  P('negative-index','What does this code print?','values = [3, 6, 9, 12]\nprint(values[-2])','9',['6','12','3'],'Index -1 is the last item, and -2 is the second-last item, 9.','Negative indices count backward from the end.');
  P('append-mutate','What does this code print?','items = [2, 4]\nitems.append(6)\nitems[0] = 1\nprint(items)','[1, 4, 6]',['[2, 4, 6]','[1, 4]','[2, 4]'],'append adds 6, then assigning index 0 replaces 2 with 1.','Apply operations in order.');
  P('string-slice','What does this Python snippet print?','word = "traffic"\nprint(word[1:4])','raf',['tra','raff','aff'],'Slice positions 1, 2, 3 in "traffic" are r, a, f; stop index 4 is excluded.','Slice excludes the stop index.');
  break;
 case 'S6':
  P('return-versus-print','What does this code print?','def f(x):\n    print(x + 2)\n\nresult = f(3)\nprint(result)','5 then None',['5 only','7','None only'],'The function prints 5 but returns None by default; then result prints as None.','A function that only prints does not return a value.');
  P('default-parameter','What does this code print?','def multiply(a, b=2):\n    return a * b\n\nprint(multiply(4))','8',['4','6','TypeError'],'The default b=2 is used when the second argument is omitted.','A missing optional argument uses its default.');
  P('parameter-swap','What does this function call print?','def subtract(a, b):\n    return a - b\n\nprint(subtract(10, 4))','6',['−6','14','4'],'Arguments bind left to right: a=10 and b=4, so 10−4=6.','Order of function arguments matters.');
  break;
 case 'S7':
  P('valid-integer-conversion','What does Python print?','try:\n    n = int("12")\n    print(n + 3)\nexcept ValueError:\n    print("Invalid")','15',['12','Invalid','TypeError'],'int("12") succeeds so the try block prints 15.','Not every conversion raises ValueError.');
  P('zero-division','What does this code print?','try:\n    answer = 6 / 0\nexcept ZeroDivisionError:\n    print("Cannot divide")','Cannot divide',['0','6','ValueError'],'Dividing by zero raises ZeroDivisionError, which the specific handler catches.','Identify the exact exception raised.');
  P('float-conversion','What does this code print?','try:\n    x = float("2.5")\n    print(x * 2)\nexcept ValueError:\n    print("Invalid")','5.0',['5','Invalid','2.5'],'float("2.5") produces 2.5, whose product with 2 is the float 5.0.','A string with a decimal point is valid for float(), not for int().');
  break;
 case 'S8':
  C('binary-search-order','Binary search requires the collection to be…','Sorted',['Randomly ordered','All positive','Without duplicate values'],'Binary search uses ordered halves, so input must be sorted.','Think about which half can safely be discarded.');
  C('linear-search','A linear search checks a list by…','Examining elements in sequence',['Repeatedly halving a sorted array','Only examining the middle element','Always sorting first'],'Linear search checks successive elements until a match or the end.','Linear means sequential.');
  break;
 case 'S9':
  P('trace-while','What does this program print?','n = 1\nwhile n < 8:\n    n = n * 2\nprint(n)','8',['4','16','7'],'n changes 1→2→4→8; the loop condition then becomes false.','Trace n after each iteration.');
  P('trace-nested-loops','What does this code print?','total = 0\nfor i in range(2):\n    for j in range(3):\n        total += 1\nprint(total)','6',['2','3','5'],'The inner loop runs three times for each of two outer iterations: 2×3=6.','For each outer iteration, count inner iterations.');
  P('trace-aliasing','What does this code print?','a = [1, 2]\nb = a\nb[0] = 9\nprint(a)','[9, 2]',['[1, 2]','[1, 9]','[9, 1]'],'b and a refer to the same list; changing b changes the list seen through a.','Assignment to a list name does not automatically make a copy.');
  break;
 case 'S10':
  C('pymata-output-mode','Before using Pymata4 digital_write() on an Arduino output pin, the pin must be configured as…','Digital output',['Digital input','Sonar echo only','Analogue input'],'Pin mode must be set to digital output before writing a HIGH/LOW state.','digital_write drives an output.');
  C('sonar-reading','In a Pymata4 sonar reading returned as [distance, timestamp], which index stores distance?','0',['1','2','−1 only'],'List index 0 stores the distance value; index 1 is the timestamp.','Python uses zero-based indexing.');
  break;
 case 'M1':
  C('bandgap-definition','What is an electronic bandgap?','The energy range separating valence and conduction bands without allowed electron states',['The voltage across any resistor','The current in a metal wire','The mass of a free electron'],'The bandgap is the forbidden energy interval between bands.','Think of valence and conduction bands.');
  C('temperature-carriers','When temperature rises in an intrinsic semiconductor, what generally happens to thermally generated electron–hole pairs?','Their number increases',['Their number becomes zero','Only holes disappear','The bandgap becomes a wire'],'Greater thermal energy generally excites more carriers into the conduction band.','Heat can generate electron-hole pairs.');
  break;
 case 'M3':
  C('donor-dopant','Adding a pentavalent donor impurity such as phosphorus to silicon primarily makes it…','n-type',['p-type','intrinsic','an insulator'],'Pentavalent donors supply electrons, producing n-type material.','Donor atoms provide electrons.');
  C('acceptor-dopant','Adding a trivalent acceptor impurity such as boron to silicon primarily makes it…','p-type',['n-type','intrinsic','a metal'],'Trivalent acceptors create holes, producing p-type material.','An acceptor creates holes.');
  break;
 case 'M4':
  C('reverse-bias-barrier','Under reverse bias, the depletion region of a typical p–n junction generally…','Widens',['Narrows to zero','Becomes a conductor','Stops having electric field'],'Reverse bias generally widens the depletion region and suppresses current.','Reverse bias pulls mobile carriers away from the junction.');
  C('forward-bias-barrier','Under forward bias, the potential barrier of a typical p–n junction generally…','Decreases',['Increases without limit','Must stay unchanged','Converts to magnetic energy'],'Forward bias reduces the junction barrier, allowing more diffusion current.','Forward bias encourages carrier transport.');
  break;
 }
 return a;
}
function generatedQuestionVariant(q){
 if(q.variant)return q.variant;
 const topic=q.topic;
 const content=String(q.prompt||'')+' \n'+String(q.code||'');
 // Classify by underlying method rather than the numerical values or literal code constants.
 const normalized=content.replace(/(?:\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)/g,'#')
  .replace(/\b(?:True|False)\b/g,'BOOL').replace(/(?:\s+)/g,' ').trim();
 if(topic==='S2')return 'S2-'+(q.code.includes('**')?'power':q.code.includes('//')?'floor':q.code.includes('%')?'remainder':'other');
 if(topic==='E11'){const m=q.prompt.match(/For a (\w+) gate/);return 'gate-'+(m?m[1]:'other');}
 if(topic==='S1'){const m=q.prompt.match(/represents a ([^?]+)/);return 'flowchart-'+(m?m[1]:'other');}
 return topic+'-'+normalized;
}
function pickExpandedQuestion(id,level,avoid,legacyMaker){
 const candidates=[];
 for(let i=0;i<16;i++){
  const q=legacyMaker(id,level,avoid);
  q.variant=generatedQuestionVariant(q);
  candidates.push(q);
 }
 for(const q of extraTopicQuestions(id,level))candidates.push(q);
 const groups=new Map();
 for(const q of candidates){
  if(!groups.has(q.variant))groups.set(q.variant,[]);
  groups.get(q.variant).push(q);
 }
 const variants=[...groups.keys()];
 const eligible=variants.filter(k=>!avoid.includes(k));
 const chosen=pick(eligible.length?eligible:variants);
 return pick(groups.get(chosen));
}
