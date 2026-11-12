/* ENG1013 Exam Pilot — competency-first timed ranking.
   Scoring never awards points for question volume, hints, retries or mock submissions. */
function speedFormatDuration(seconds){
 if(!Number.isFinite(seconds)||seconds<0)return '—';
 const whole=Math.max(0,Math.floor(seconds));
 const h=Math.floor(whole/3600),m=Math.floor((whole%3600)/60),s=whole%60;
 return h?(h+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')):(String(m).padStart(2,'0')+':'+String(s).padStart(2,'0'));
}
function speedQuestionDifficulty(q){
 // Difficulty is calculated from the QUESTION, never from a manually hardcoded topic tier.
 const level=Math.max(1,Math.min(3,Number(q.level)||1));
 const lines=String(q.code||'').split('\n').filter(line=>line.trim()&& !line.trim().startsWith('#')).length;
 const branches=(String(q.code||'').match(/^\s*(?:if|elif|else|for|while|except)\b/gm)||[]).length;
 const steps=Math.min(0.36,Math.max(0,lines-2)*0.045+branches*0.045);
 return Math.round((1+(level-1)*0.36+steps)*100)/100;
}
function speedMakeAward(topic,section,history,when){
 if(!Array.isArray(history)||history.length!==3)return null;
 const seen=new Set();
 let sum=0,difficultySum=0;
 for(const h of history){
   if(!h||h.topic!==topic||h.source!=='practice'||!h.correct||h.hinted)return null;
   const variant=h.variant||null;
   if(!variant||seen.has(variant))return null;
   seen.add(variant);
   if(!Number.isFinite(h.elapsedSeconds)||h.elapsedSeconds<0)return null;
   // Human-scale floor avoids accidental zero-second times dominating the leaderboard.
   sum+=Math.max(6,h.elapsedSeconds);
   difficultySum+=speedQuestionDifficulty(h);
 }
 const difficulty=Math.round(difficultySum/3*100)/100;
 const totalSeconds=Math.round(sum*10)/10;
 const meanSeconds=sum/3;
 // Complex questions earn a higher multiplier and a more realistic time target.
 const targetPerQuestion=45+25*(difficulty-1);
 const speedFactor=Math.max(0.65,Math.min(1.45,Math.sqrt(targetPerQuestion/Math.max(8,meanSeconds))));
 const roundedSpeed=Math.round(speedFactor*100)/100;
 const points=Math.max(1,Math.round(100*difficulty*speedFactor));
 return {topic,section,totalSeconds,meanSeconds:Math.round(meanSeconds*10)/10,difficulty,pace:roundedSpeed,points,earnedAt:when,evidenceCount:3,formulaVersion:1};
}

/* Restore a fair, clearly labelled estimate for old saved question attempts.
   Never write into elapsedSeconds: that field is reserved for actually measured time.
   A backfilled time uses the user's mean measured post-timer practice pace. */
function speedHistoricalPace(state){
 const history=Array.isArray(state?.history)?state.history:[];
 const measured=history.filter(h=>h&&h.source==='practice'&&Number.isFinite(h.elapsedSeconds)&&h.elapsedSeconds>0&&h.elapsedSeconds<=1800).map(h=>h.elapsedSeconds);
 if(measured.length){
  const mean=Math.round(measured.reduce((a,b)=>a+b,0)/measured.length*10)/10;
  return {seconds:Math.max(6,mean),samples:measured.length,basis:'question-history'};
 }
 const old=Object.values(state?.speedRecords||{}).filter(r=>r&&!r.estimated&&Number.isFinite(r.meanSeconds)&&r.meanSeconds>0);
 if(old.length)return {seconds:Math.max(6,Math.round(old.reduce((a,b)=>a+b.meanSeconds,0)/old.length*10)/10),samples:old.length,basis:'previous-timed-awards'};
 return null;
}
function speedLegacyAward(topic,section,history,progress,pace){
 if(!pace||!progress?.completedAt)return null;
 const answered=history.filter(h=>h.topic===topic&&h.source==='practice'&&h.correct&&!h.hinted);
 const evidence=answered.slice(-3);
 const count=evidence.length;
 const difficulty=count?Math.round(evidence.reduce((sum,h)=>sum+speedQuestionDifficulty(h),0)/count*100)/100:1;
 const totalSeconds=Math.round(3*pace.seconds*10)/10;
 const targetPerQuestion=45+25*(difficulty-1);
 const factor=Math.max(.65,Math.min(1.45,Math.sqrt(targetPerQuestion/Math.max(8,pace.seconds))));
 return {
  topic,section,totalSeconds,meanSeconds:pace.seconds,difficulty,pace:Math.round(factor*100)/100,
  points:Math.max(1,Math.round(100*difficulty*factor)),
  earnedAt:progress.completedAt, evidenceCount:count, formulaVersion:1,
  estimated:true, legacy:true, sampleCount:pace.samples,
  note:count<3?'Previous completion status; incomplete individual question detail':'Earlier saved completion; time estimated from later attempts'
 };
}
function speedBackfillHistorical(state,topicMap){
 if(!state||!Array.isArray(state.history)||!state.progress)return {estimated:0,awards:0,pace:null};
 if(!state.speedRecords||typeof state.speedRecords!=='object')state.speedRecords={};
 const pace=speedHistoricalPace(state);
 if(!pace)return {estimated:0,awards:0,pace:null};
 let estimated=0,awards=0;
 for(const h of state.history){
  if(!h||!['practice','mock'].includes(h.source))continue;
  if(Number.isFinite(h.elapsedSeconds)&&h.elapsedSeconds>0)continue;
  // Retain a stable documented estimate rather than overwriting the actual duration field.
  if(!Number.isFinite(h.estimatedElapsedSeconds)||h.estimatedElapsedSeconds<=0){
   h.estimatedElapsedSeconds=pace.seconds;h.speedTimeEstimated=true;estimated++;
  }
 }
 for(const [id,p] of Object.entries(state.progress)){
  if(!p?.completedAt||state.speedRecords[id]||!topicMap[id])continue;
  const rec=speedLegacyAward(id,topicMap[id].section,state.history,p,pace);
  if(rec){state.speedRecords[id]=rec;awards++;}
 }
 state.speedBackfill={version:1,estimatedQuestionCount:state.history.filter(h=>h&&h.speedTimeEstimated).length,
  measuredSampleCount:pace.samples,meanMeasuredSeconds:pace.seconds,lastApplied:Date.now()};
 return {estimated,awards,pace};
}

function speedRankData(state,activeTopics){
 const records=state.speedRecords||{};
 const scores=Object.values(records).filter(r=>r&&Number.isFinite(r.points)&&Number.isFinite(r.totalSeconds));
 const estimatedScores=scores.filter(r=>r.estimated);
 const groups=['Electrical','Software','Materials','Ethics'].map(section=>{
  const active=activeTopics(section);
  const earned=active.map(t=>records[t.id]).filter(r=>r&&Number.isFinite(r.points));
  const count=earned.length;
  const points=earned.reduce((n,r)=>n+r.points,0);
  const seconds=earned.reduce((n,r)=>n+r.totalSeconds,0);
  const complete=active.length>0&&count===active.length;
  const mean=complete?seconds/count:null;
  const difficulty=complete?earned.reduce((n,r)=>n+r.difficulty,0)/count:null;
  return {section,active:active.length,count,points,totalSeconds:Math.round(seconds*10)/10,meanSeconds:mean,meanDifficulty:difficulty,complete};
 });
 return {scores,estimatedScores,totalPoints:scores.reduce((n,r)=>n+r.points,0),groups,
   completedSections:groups.filter(g=>g.complete).sort((a,b)=>a.meanSeconds-b.meanSeconds),
   fastestTopics:[...scores].sort((a,b)=>a.totalSeconds-b.totalSeconds)};
}
function speedRankingsHTML(state,activeTopics,topicMap,esc){
 const data=speedRankData(state,activeTopics);
 const ranked=data.completedSections;
 const progress=data.groups;
 const pace=speedHistoricalPace(state);
 const rows=(records,mode)=>records.map((r,i)=>'<div class="speed-board-row"><span class="speed-rank-no">'+(i+1)+'</span><div class="speed-entry"><strong>'+
   esc(mode==='sections'?r.section:r.topic+' · '+(topicMap[r.topic]?.title||'Topic'))+'</strong><small>'+
   (mode==='sections'?r.count+' topics · total '+speedFormatDuration(r.totalSeconds):
     'Difficulty ×'+r.difficulty.toFixed(2)+' · Pace ×'+r.pace.toFixed(2)+(r.estimated?' · Estimated historical pace':' · Measured'))+'</small></div><div class="speed-board-result"><strong>'+
   speedFormatDuration(mode==='sections'?r.meanSeconds:r.totalSeconds)+'</strong><small>'+r.points+' pts</small></div></div>').join('');
 return '<div class="speed-intro"><h2>Speed rankings</h2><p>Speed matters after independent mastery. New awards require three different correct unhinted questions; completed historical topics may also receive a <strong>labelled estimated score</strong> based on your later measured average. One score per topic, no extra points for repeats.</p>'+
   '<div class="speed-metrics"><div><strong>'+data.totalPoints.toLocaleString()+'</strong><span>Total earned points</span></div><div><strong>'+data.scores.length+'</strong><span>Topics ranked (including estimates)</span></div><div><strong>'+ranked.length+'/4</strong><span>Full sections ranked</span></div></div></div>'+
   '<div class="speed-two-cols"><div class="card"><h2>Fastest completed sections</h2><p class="muted tiny">Ranked by average time per topic so larger sections are comparable. All prioritised topics in a section must have a recorded completion. Historical times are labelled estimates.</p>'+
   (ranked.length?'<div class="speed-board">'+rows(ranked,'sections')+'</div>':'<p class="muted">No complete section has enough measured or estimated evidence to rank yet.</p>')+
   '<h3 style="margin-top:22px">Section progress</h3><div class="speed-board">'+progress.map(r=>'<div class="speed-board-row"><div class="speed-entry"><strong>'+esc(r.section)+'</strong><small>'+r.count+'/'+r.active+' timed topics · '+r.points+' pts</small></div><strong>'+Math.round(100*r.count/Math.max(1,r.active))+'%</strong></div>').join('')+'</div></div>'+
   '<div class="card"><h2>Fastest topic completions</h2><p class="muted tiny">Verified records show measured time. Backfilled records represent earlier completed topics with estimated time, not measured speed.</p>'+
   (data.fastestTopics.length?'<div class="speed-board">'+rows(data.fastestTopics,'topics')+'</div>':'<p class="muted">Complete topics independently and answer timed questions to build your ranking.</p>')+
   '</div></div><div class="speed-formula card"><h2>How points are earned</h2>'+
   '<p><strong>Topic points = 100 × question difficulty × speed factor</strong>, rounded to the nearest point.</p>'+
   '<p class="muted tiny">Difficulty is calculated from your three passing questions: their generated levels, number of code steps and branching complexity. The speed factor compares your measured solving time with a difficulty-adjusted target, capped between 0.65× and 1.45×. A minimum time per question prevents zero-second scores from being rewarded.</p>'+
   '<p class="muted tiny">Points are motivational, not predicted exam marks. Estimated historical times use the arithmetic mean of actually timed practice questions (or earlier measured awards where question times are unavailable). Measured durations are never overwritten. If no measured pace exists, historical completions remain complete without a fabricated speed score.</p></div>';
}
function speedSummaryHTML(state,activeTopics,topicMap,esc){
 const data=speedRankData(state,activeTopics),fast=data.fastestTopics;
 return '<div class="card"><div class="goal"><strong>Timed competency rankings</strong><strong>'+data.totalPoints.toLocaleString()+' pts</strong></div>'+
  '<p class="muted tiny">'+data.scores.length+' ranked topics ('+data.estimatedScores.length+' estimated) · '+data.completedSections.length+' full sections ranked. Correctness and question variety unlock points; extra drills earn none.</p>'+
  (fast.length?'<p class="tiny"><strong>Fastest:</strong> '+esc(fast[0].topic+' · '+(topicMap[fast[0].topic]?.title||''))+' in '+speedFormatDuration(fast[0].totalSeconds)+(fast[0].estimated?' (estimated)':' (measured)')+' · '+fast[0].points+' pts</p>':'<p class="muted tiny">Your first qualifying topic completion will appear here.</p>')+
  '<button class="btn small" data-nav="rankings">View speed leaderboard →</button></div>';
}
