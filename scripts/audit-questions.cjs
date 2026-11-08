/* Question-bank accuracy audit. Run with: node scripts/audit-questions.cjs
 * Uses real Python to verify every sampled Python code-tracing answer. */
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),cp=require('node:child_process'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const bank=fs.readFileSync(path.join(root,'question-bank.js'),'utf8');
const main=html.match(/<script>\s*\/\* ENG1013 Exam Pilot([\s\S]*?)<\/script>/);
if(!main)throw Error('Cannot locate main study engine script');
const stub={innerHTML:'',textContent:'',style:{},classList:{add(){},remove(){}},addEventListener(){},focus(){},value:''};
const context={document:{getElementById(){return {...stub}},addEventListener(){},querySelector(){return {...stub}}},window:{addEventListener(){},scrollTo(){}},localStorage:{getItem(){return null},setItem(){}},location:{hash:'#dashboard'},history:{replaceState(){}},navigator:{},setInterval(){},setTimeout(){},clearTimeout(){},requestAnimationFrame(fn){fn()},console,Date,Intl};
vm.createContext(context);
vm.runInContext(bank+'\n'+main[0].slice(8,-9),context,{timeout:15000});
const run=code=>vm.runInContext(code,context,{timeout:15000});
const topics=run('TOPICS.map(x=>x.id)');
const errors=[],counts={};
let pythonExecutions=0,numericChecks=0,questionsChecked=0;
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
  }else errors.push(id+' unknown question kind: '+q.kind);
 }
 counts[id]={distinct:seen.size,families:Object.keys(families).length};
}
const checker=run('(()=>{const q=makeOriginalQuestion("S3",2,["independent-if","if-elif-else","and","or","not","chained-comparison","precedence","nested","variable-update","short-circuit"]);return q})()');
if(checker.variant==='not-equal'&&!['Valid','Invalid'].includes(checker.expected))errors.push('Unexpected even-number answer');
const result={topics:topics.length,questionsChecked,pythonExecutions,numericChecks,errors:errors.slice(0,40),totalErrors:errors.length,topicFamilies:counts};
console.log(JSON.stringify(result,null,2));
if(errors.length)process.exitCode=1;
