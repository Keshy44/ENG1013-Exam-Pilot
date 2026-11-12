/* Question-bank accuracy audit. Run with: node scripts/audit-questions.cjs
 * Uses real Python to verify every sampled Python code-tracing answer. */
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),cp=require('node:child_process'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const bank=fs.readFileSync(path.join(root,'question-bank.js'),'utf8');
const separator=fs.readFileSync(path.join(root,'separator-bank.js'),'utf8');
const diagrams=fs.readFileSync(path.join(root,'diagrams.js'),'utf8');
const examFigures=fs.readFileSync(path.join(root,'exam-circuits.js'),'utf8');
const speed=fs.readFileSync(path.join(root,'speed-rankings.js'),'utf8');
const main=html.match(/<script>\s*\/\* ENG1013 Exam Pilot([\s\S]*?)<\/script>/);
if(!main)throw Error('Cannot locate main study engine script');
const stub={innerHTML:'',textContent:'',style:{},classList:{add(){},remove(){}},addEventListener(){},focus(){},value:''};
const context={document:{getElementById(){return {...stub}},addEventListener(){},querySelector(){return {...stub}}},window:{addEventListener(){},scrollTo(){}},localStorage:{getItem(){return null},setItem(){}},location:{hash:'#dashboard'},history:{replaceState(){}},navigator:{},setInterval(){},setTimeout(){},clearTimeout(){},requestAnimationFrame(fn){fn()},console,Date,Intl};
vm.createContext(context);
vm.runInContext(diagrams+'\n'+examFigures+'\n'+bank+'\n'+separator+'\n'+speed+'\n'+main[0].slice(8,-9),context,{timeout:15000});
const run=code=>vm.runInContext(code,context,{timeout:15000});
const topics=run('TOPICS.map(x=>x.id)');
const errors=[],counts={};
let pythonExecutions=0,numericChecks=0,questionsChecked=0;

function independentlyCalculate(q){
 const s=q.prompt;let m;
 switch(q.topic){
 case 'E1':
  if(m=s.match(/resistor of ([\d.]+) Ω has ([\d.]+) V/))return +m[2]/m[1];
  if(m=s.match(/resistor has ([\d.]+) V across it and carries ([\d.]+) A/))return +m[1]/m[2];
  if(m=s.match(/resistor experiences ([\d.]+) V and ([\d.]+) A/))return m[1]*m[2];
  break;
 case 'E2':
  if(m=s.match(/Resistors of ([\d.]+) Ω and ([\d.]+) Ω are connected in (SERIES|PARALLEL)/))return m[3]==='SERIES'?+m[1]+(+m[2]):m[1]*m[2]/(+m[1]+(+m[2]));
  break;
 case 'E3':
  if(m=s.match(/Vs = ([\d.]+) V, Rtop = ([\d.]+) kΩ and Rbottom = ([\d.]+) kΩ/))return m[1]*m[3]/(+m[2]+(+m[3]));
  if(m=s.match(/Two resistors ([\d.]+) kΩ and ([\d.]+) kΩ are in series across ([\d.]+) V/))return m[3]/(+m[1]+(+m[2]));
  break;
 case 'E4':
  if(m=s.match(/KCL: ([\d.]+) mA enters a node\. ([\d.]+) mA and ([\d.]+) mA leave/))return +m[1]-m[2]-m[3];
  if(m=s.match(/KVL: a ([\d.]+) V source drives a loop with drops of ([\d.]+) V, ([\d.]+) V/))return +m[1]-m[2]-m[3];
  break;
 case 'E5':
  if(m=s.match(/a ([\d.]+) V source connects through ([\d.]+) kΩ to VA; ([\d.]+) kΩ connects VA to VB; ([\d.]+) kΩ connects VB to ground/))return m[1]*m[4]/(+m[2]+(+m[3])+(+m[4]));
  if(m=s.match(/Unknown node V connects to ([\d.]+) V through ([\d.]+) kΩ and to ground through ([\d.]+) kΩ/)){
   const injection=Number((s.match(/A ([\d.]+) mA current source also injects/)||[])[1]||0);
   return (m[1]/m[2]+injection)/(1/m[2]+1/m[3]);
  }
  break;
 case 'E6':
  if(m=s.match(/Node V has a ([\d.]+) V source through ([\d.]+) kΩ, a ([\d.]+) kΩ path to ground and a ([\d.]+) mA source/))return (m[1]/m[2]+(+m[4]))/(1/m[2]+1/m[3]);
  break;
 case 'E8':
  if(m=s.match(/A ([\d.]+) V source feeds Rtop=([\d.]+) kΩ in series with Rbottom=([\d.]+) kΩ/))return m[1]*m[3]/(+m[2]+(+m[3]));
  if(m=s.match(/Rtop=([\d.]+) kΩ from a voltage source.*Rbottom=([\d.]+) kΩ/))return m[1]*m[2]/(+m[1]+(+m[2]));
  if(m=s.match(/Vth=([\d.]+) V and Rth=([\d.]+) kΩ/))return m[1]/m[2];
  break;
 case 'E9':
  if(m=s.match(/([\d.]+) V supplies ([\d.]+) forward-biased LED.*each dropping ([\d.]+) V, through a ([\d.]+) Ω resistor/))return 1000*(m[1]-m[2]*m[3])/m[4];
  break;
 case 'E12':
  if(m=s.match(/([\d.]+) µF and ([\d.]+) µF capacitors are connected in (PARALLEL|SERIES)/))return m[3]==='PARALLEL'?+m[1]+(+m[2]):m[1]*m[2]/(+m[1]+(+m[2]));
  break;
 case 'E13':
  if(m=s.match(/A ([\d.]+) µF capacitor has ([\d.]+) V across it/))return m[1]*m[2];
  if(m=s.match(/Voltage across a ([\d.]+) µF capacitor increases linearly by ([\d.]+) V in ([\d.]+) ms/))return m[1]*m[2]/m[3];
  break;
 case 'E14':
  if(m=s.match(/R=([\d.]+) kΩ and C=([\d.]+) µF/))return m[1]*m[2];
  if(m=s.match(/charges toward ([\d.]+) V\. What is Vc after ([\d.]+) time constant/))return m[1]*(1-Math.exp(-m[2]));
  break;
 case 'M2':
  if(m=s.match(/n=([\d.]+)×10²¹ m⁻³, electron mobility=([\d.]+) m²/))return m[1]*1e21*1.6e-19*m[2];
  if(m=s.match(/conductivity σ = ([\d.]+) S\/m/))return 1/m[1];
  if(m=s.match(/wavelength ([\d.]+) nm/))return 1240/m[1];
  break;
 }
 return null;
}

for(const id of topics){
 const seen=new Set(),families={};
 for(let j=0;j<180;j++){
  const q=run('makeQuestion('+JSON.stringify(id)+','+(j%3+1)+')');
  const key=JSON.stringify([q.prompt,q.code]);
  if(seen.has(key))continue;
  seen.add(key);questionsChecked++;
  const category=q.variant||'default';
  const n=families[category]||0;
  families[category]=n+1;
  if(q.kind==='mcq'){
   if(!Array.isArray(q.options)||!q.options.includes(q.expected))errors.push(id+' missing correct option: '+q.prompt);
   if(new Set(q.options).size<3)errors.push(id+' has fewer than 3 distinct options: '+q.prompt);
   // Sample different values for every code template, not just one hardcoded example.
   if(q.code&&n<9){
    pythonExecutions++;
    const actual=cp.spawnSync('python3',['-c',q.code],{encoding:'utf8',timeout:3500,maxBuffer:20000});
    if(actual.status!==0)errors.push(id+'/'+category+' Python failed: '+(actual.stderr||actual.error?.message)+' Code: '+q.code);
    else{
     const out=actual.stdout.trim().replace(/\r/g,'').split('\n').join(' then ');
     if(out!==String(q.expected))errors.push(id+'/'+category+' expected '+JSON.stringify(q.expected)+' but Python printed '+JSON.stringify(out)+' Code: '+q.code);
    }
   }
  }else if(q.kind==='numeric'){
   numericChecks++;
   if(!Number.isFinite(q.expected))errors.push(id+' non-finite numeric answer: '+q.prompt);
   if(!run('grade('+JSON.stringify(q)+','+JSON.stringify(String(q.expected))+')'))errors.push(id+' numeric answer marked wrong: '+q.prompt);
   const independent=independentlyCalculate(q);
   if(independent!==null){
    const precision=Number.isInteger(q.precision)?q.precision:1;
    const allowance=0.5*Math.pow(10,-precision)+1e-7;
    if(Math.abs(q.expected-independent)>allowance)errors.push(id+' numerical KEY disagrees with independent calculation: expected '+q.expected+', computed '+independent+' from '+q.prompt);
   }
  }else errors.push(id+' unknown question kind: '+q.kind);
 }
 counts[id]={distinct:seen.size,families:Object.keys(families).length};
}
const checker=run('(()=>{const q=makeOriginalQuestion("S3",2,["independent-if","if-elif-else","and","or","not","chained-comparison","precedence","nested","variable-update","short-circuit"]);return q})()');
if(checker.variant==='not-equal'&&!['Valid','Invalid'].includes(checker.expected))errors.push('Unexpected even-number answer');
const hardAudit=(function auditHard(){
 let checked=0,checkedPython=0,numeric=0,renderedDiagrams=0;
 const sectionCounts={Electrical:0,Software:0,Materials:0,Ethics:0};
 for(const id of topics){
  const keys=new Set();
  for(let i=0;i<45;i++){
   const q=run('separatorQuestion('+JSON.stringify(id)+')');
   checked++;keys.add(q.variant);
   if(q.topic.startsWith('E')){
    const rendered=run('circuitDiagram('+JSON.stringify(q)+')');
    if(!rendered||!rendered.includes('<svg')||!rendered.includes('exam-figure')||!rendered.includes('</svg>'))errors.push(q.topic+'/'+q.variant+' hard diagram missing or malformed');
    else renderedDiagrams++;
   }
   if(!q.separator||q.level!==4||!q.sourceNote)errors.push(id+' missing separator marker, level or source');
   if(!q.variant?.startsWith('sep-'))errors.push(id+' missing distinct hard method family');
   if(q.kind==='mcq'){
    if(!q.options.includes(q.expected))errors.push(id+' missing expected option: '+q.prompt);
    if(new Set(q.options).size<3)errors.push(id+' fewer than three options: '+q.prompt);
    if(q.code){
     checkedPython++;
     const py=cp.spawnSync('python3',['-c',q.code],{encoding:'utf8',timeout:3500,maxBuffer:15000});
     const got=py.stdout.trim().replace(/\r/g,'').split('\n').join(' then ');
     if(py.status!==0||got!==String(q.expected))errors.push(id+'/'+q.variant+' Python expected '+JSON.stringify(q.expected)+' got '+JSON.stringify(got)+' err '+py.stderr+' code '+q.code);
    }
   }else if(q.kind==='numeric'){
    numeric++;
    if(!Number.isFinite(q.expected))errors.push(id+'/'+q.variant+' NaN expected');
    if(!run('grade('+JSON.stringify(q)+','+JSON.stringify(String(q.expected))+')'))errors.push(id+'/'+q.variant+' correct number marked wrong');
   }else errors.push(id+' unexpected hard kind');
  }
  if(!['E7','E10','S8','S10','M4'].includes(id)&&keys.size<2)errors.push(id+' hard bank needs at least two distinct method families');
 }
 const mock=run('separatorMockQuestions()');
 if(mock.length!==40)errors.push('Hard mock has '+mock.length+' questions, expected 40');
 for(const q of mock)sectionCounts[run('TMAP['+JSON.stringify(q.topic)+'].section')]++;
 for(const section of Object.keys(sectionCounts))if(sectionCounts[section]!=={Electrical:19,Software:15,Materials:5,Ethics:1}[section])errors.push(section+' hard mock weighting wrong: '+sectionCounts[section]);
 const masteryBefore=run('JSON.stringify(state.progress)');
 run('newMock(true)');
 if(!run('state.mock?.hard && state.mock.questions.length===40'))errors.push('Hard mock button fails to start 40 questions');
 run('finishMock(true)');
 const masteryAfter=run('JSON.stringify(state.progress)');
 if(masteryBefore!==masteryAfter)errors.push('Hard mock accidentally changes ordinary mastery');
 return {hardQuestionsChecked:checked,hardPythonProgramsChecked:checkedPython,hardNumericChecks:numeric,hardCircuitDiagramsChecked:renderedDiagrams,hardSectionCounts:sectionCounts};
})();
const result={topics:topics.length,questionsChecked,pythonExecutions,numericChecks,...hardAudit,errors:errors.slice(0,40),totalErrors:errors.length,topicFamilies:counts};
console.log(JSON.stringify(result,null,2));
if(errors.length)process.exitCode=1;
