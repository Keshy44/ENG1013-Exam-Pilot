/* Regression tests for timed competency, AFK pauses and exam-safe progress. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const main=html.match(/<script>\s*\/\* ENG1013 Exam Pilot([\s\S]*?)<\/script>/);
assert(main,'Main script must exist');
const includes=['question-bank.js','diagrams.js','speed-rankings.js'].map(n=>fs.readFileSync(path.join(root,n),'utf8'));
const els={};const handlers={};
function el(id){
 if(els[id])return els[id];
 const classes=new Set(['hidden']);
 return els[id]={id,value:'',textContent:'',innerHTML:'',disabled:false,isConnected:true,style:{},
  classList:{add(c){classes.add(c)},remove(c){classes.delete(c)},contains(c){return classes.has(c)}},
  addEventListener(type,fn){handlers[id+':'+type]=fn},focus(){},scrollIntoView(){},setSelectionRange(){},selectionStart:0,selectionEnd:0};
}
const document={visibilityState:'visible',getElementById:el,querySelector(sel){return el(sel)},
 addEventListener(type,fn){handlers['document:'+type]=fn}};
const window={addEventListener(type,fn){handlers['window:'+type]=fn},scrollTo(){}};
const storage={getItem(){return null},setItem(){}};
const sandbox={document,window,localStorage:storage,location:{hash:'#dashboard'},history:{replaceState(){}},
 navigator:{},console,Date,Intl,setInterval(){},setTimeout(){},clearTimeout(){},
 requestAnimationFrame(fn){fn()},confirm(){return true}};
vm.createContext(sandbox);
vm.runInContext(includes.join('\n')+'\n'+main[0].slice(8,-9),sandbox,{timeout:20000});
function run(expr){return vm.runInContext(expr,sandbox,{timeout:10000});}
const checks=[];
function verify(name,fn){fn();checks.push(name);}

verify('Starting a question starts its timer',()=>{
 run("beginPractice('S3')");
 assert(run('speedClock && !speedClock.paused && !speedClock.stopped'));
 assert(el('view').innerHTML.includes('practiceSpeedTime'));
});
verify('Inactivity automatically pauses and displays an explicit resume prompt',()=>{
 run("speedClock.resumedAt=Date.now()-120000;speedClock.lastActivity=Date.now()-95000;speedTick()");
 assert.equal(run('speedClock.paused'),'idle');
 assert.equal(el('speedPauseOverlay').classList.contains('hidden'),false);
 const value=run('speedElapsedMs()');
 assert.equal(run('speedElapsedMs()'),value);
});
verify('A paused question cannot be submitted',()=>{
 run('practice.answer=practice.q.expected;submitPractice()');
 assert.equal(run('state.history.length'),0);
 assert.equal(run('practice.marked'),false);
});
verify('Only an explicit action resumes the timer',()=>{
 run('speedActivity()');
 assert.equal(run('speedClock.paused'),'idle');
 run('speedResumeClock()');
 assert.equal(run('speedClock.paused'),null);
 assert.equal(el('speedPauseOverlay').classList.contains('hidden'),true);
});
verify('Timed attempts preserve their duration without altering grading',()=>{
 run("speedClock.resumedAt=Date.now()-20000;submitPractice()");
 assert.equal(run('practice.marked'),true);
 assert.equal(run('state.history[0].correct'),true);
 assert(run('state.history[0].elapsedSeconds')>=30);
 assert(run('state.history[0].elapsedSeconds')<95); // AFK time beyond the grace period was excluded
});
verify('If still solving, keep all idle time rather than granting free speed points',()=>{
 run("beginPractice('S5');speedClock.resumedAt=Date.now()-120000;speedClock.lastActivity=Date.now()-95000;speedTick()");
 assert.equal(run('speedClock.paused'),'idle');
 const prior=run('speedElapsedMs()');
 run("speedClock.pausedAt-=10000;speedResumeClock('working')");
 assert(run('speedElapsedMs()')>=prior+9000);
});
verify('First movement after a long gap pauses instead of silently resuming',()=>{
 run("beginPractice('S6');speedClock.resumedAt=Date.now()-120000;speedClock.lastActivity=Date.now()-95000;speedActivity()");
 assert.equal(run('speedClock.paused'),'idle');
 run("speedResumeClock('away')");
 assert.equal(run('speedClock.paused'),null);
});
verify('Three distinct correct unhinted questions earn points once',()=>{
 run("beginPractice('S3');speedClock.resumedAt=Date.now()-40000;practice.answer=practice.q.expected;submitPractice()");
 assert.equal(run('!!state.speedRecords.S3'),false);
 run("beginPractice('S3');speedClock.resumedAt=Date.now()-35000;practice.answer=practice.q.expected;submitPractice()");
 assert.equal(run('!!state.speedRecords.S3'),true);
 const first=run('state.speedRecords.S3.points');
 assert(first>0);
 for(let k=0;k<5;k++)run("beginPractice('S3');speedClock.resumedAt=Date.now()-25000;practice.answer=practice.q.expected;submitPractice()");
 assert.equal(run('state.speedRecords.S3.points'),first);
 assert.equal(run('Object.keys(state.speedRecords).length'),1);
});
verify('Hints and repeating one skill cannot generate scores',()=>{
 const a={topic:'S2',source:'practice',correct:true,hinted:false,variant:'x',elapsedSeconds:25,level:1,code:''};
 assert.equal(run('speedMakeAward("S2","Software",'+JSON.stringify([a,a,a])+',Date.now())'),null);
 const b=[{...a,variant:'x'}, {...a,variant:'y',hinted:true}, {...a,variant:'z'}];
 assert.equal(run('speedMakeAward("S2","Software",'+JSON.stringify(b)+',Date.now())'),null);
});
verify('Faster performance earns more points at equal difficulty',()=>{
 function sample(sec,level){return ['a','b','c'].map((variant,i)=>({topic:'S2',source:'practice',correct:true,hinted:false,variant,elapsedSeconds:sec,level,code:''}));}
 const fast=run('speedMakeAward("S2","Software",'+JSON.stringify(sample(20,2))+',Date.now()).points');
 const slow=run('speedMakeAward("S2","Software",'+JSON.stringify(sample(90,2))+',Date.now()).points');
 const hard=run('speedMakeAward("S2","Software",'+JSON.stringify(sample(40,3))+',Date.now()).points');
 const easy=run('speedMakeAward("S2","Software",'+JSON.stringify(sample(40,1))+',Date.now()).points');
 assert(fast>slow);assert(hard>easy);
});
verify('Switching tabs pauses, mouse activity cannot restart timer',()=>{
 run("beginPractice('S4');speedClock.resumedAt=Date.now()-20000;document.visibilityState='hidden';speedPauseClock('tab')");
 assert.equal(run('speedClock.paused'),'tab');
 run("document.visibilityState='visible';speedActivity()");
 assert.equal(run('speedClock.paused'),'tab');
 run("speedResumeClock()");
 assert.equal(run('speedClock.paused'),null);
});
verify('Navigating away pauses, returning shows the prompt',()=>{
 run("navigate('dashboard')");
 assert.equal(run('speedClock.paused'),'left');
 run("navigate('practice')");
 assert.equal(el('speedPauseOverlay').classList.contains('hidden'),false);
});
verify('Mock exams remain 40 questions and never award speed points',()=>{
 const count=run('mockQuestions().length');
 assert.equal(count,40);
 const before=run('Object.keys(state.speedRecords).length');
 run("const q=makeQuestion('D1',1);recordAttempt(q,q.expected,true,false,'mock');");
 assert.equal(run('Object.keys(state.speedRecords).length'),before);
});
verify('Older backups import and preserve existing progress',()=>{
 const old=run('(()=>{const backup=seed();delete backup.speedRecords;return JSON.stringify(backup);})()');
 const outcome=run('safeImport('+JSON.stringify(old)+')');
 assert.equal(outcome,null);
 assert.equal(run('typeof state.speedRecords'),'object');
 assert.equal(run('state.progress.E1.mastery'),38);
});
console.log('PASS '+checks.length+' timer, pause, scoring, progress and mock safeguards');
checks.forEach((c,i)=>console.log(String(i+1).padStart(2,'0')+'. '+c));
