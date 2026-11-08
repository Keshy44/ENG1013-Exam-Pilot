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
function speedRankData(state,activeTopics){
 const records=state.speedRecords||{};
 const scores=Object.values(records).filter(r=>r&&Number.isFinite(r.points)&&Number.isFinite(r.totalSeconds));
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
 return {scores,totalPoints:scores.reduce((n,r)=>n+r.points,0),groups,
   completedSections:groups.filter(g=>g.complete).sort((a,b)=>a.meanSeconds-b.meanSeconds),
   fastestTopics:[...scores].sort((a,b)=>a.totalSeconds-b.totalSeconds)};
}
function speedRankingsHTML(state,activeTopics,topicMap,esc){
 const data=speedRankData(state,activeTopics);
 const ranked=data.completedSections;
 const progress=data.groups;
 const rows=(records,mode)=>records.map((r,i)=>'<div class="speed-board-row"><span class="speed-rank-no">'+(i+1)+'</span><div class="speed-entry"><strong>'+
   esc(mode==='sections'?r.section:r.topic+' · '+(topicMap[r.topic]?.title||'Topic'))+'</strong><small>'+
   (mode==='sections'?r.count+' topics · total '+speedFormatDuration(r.totalSeconds):
     'Difficulty ×'+r.difficulty.toFixed(2)+' · Pace ×'+r.pace.toFixed(2))+'</small></div><div class="speed-board-result"><strong>'+
   speedFormatDuration(mode==='sections'?r.meanSeconds:r.totalSeconds)+'</strong><small>'+r.points+' pts</small></div></div>').join('');
 return '<div class="speed-intro"><h2>Speed rankings</h2><p>Speed matters only <strong>after demonstrating mastery</strong>: three different correct questions in a row, without hints. One award per topic, ever. No XP for repeated easy questions.</p>'+
   '<div class="speed-metrics"><div><strong>'+data.totalPoints.toLocaleString()+'</strong><span>Total earned points</span></div><div><strong>'+data.scores.length+'</strong><span>Timed topics cleared</span></div><div><strong>'+ranked.length+'/4</strong><span>Full sections ranked</span></div></div></div>'+
   '<div class="speed-two-cols"><div class="card"><h2>Fastest completed sections</h2><p class="muted tiny">Ranked by average time per topic so larger sections are comparable. All prioritised topics in a section must have a timed completion.</p>'+
   (ranked.length?'<div class="speed-board">'+rows(ranked,'sections')+'</div>':'<p class="muted">No entire section has been completed under the new timer yet. Each topic you clear moves you closer.</p>')+
   '<h3 style="margin-top:22px">Section progress</h3><div class="speed-board">'+progress.map(r=>'<div class="speed-board-row"><div class="speed-entry"><strong>'+esc(r.section)+'</strong><small>'+r.count+'/'+r.active+' timed topics · '+r.points+' pts</small></div><strong>'+Math.round(100*r.count/Math.max(1,r.active))+'%</strong></div>').join('')+'</div></div>'+
   '<div class="card"><h2>Fastest topic completions</h2><p class="muted tiny">Only your first qualifying, unhinted mastery pass counts. Retests and mocks never produce extra points.</p>'+
   (data.fastestTopics.length?'<div class="speed-board">'+rows(data.fastestTopics,'topics')+'</div>':'<p class="muted">Finish three different questions correctly without hints to put your first topic on the board.</p>')+
   '</div></div><div class="speed-formula card"><h2>How points are earned</h2>'+
   '<p><strong>Topic points = 100 × question difficulty × speed factor</strong>, rounded to the nearest point.</p>'+
   '<p class="muted tiny">Difficulty is calculated from your three passing questions: their generated levels, number of code steps and branching complexity. The speed factor compares your measured solving time with a difficulty-adjusted target, capped between 0.65× and 1.45×. A minimum time per question prevents zero-second scores from being rewarded.</p>'+
   '<p class="muted tiny">Points are for motivation, not estimated exam marks. Prior completions without verified question times remain completed in your study progress but do not get invented leaderboard scores. Timers use elapsed wall-clock time.</p></div>';
}
function speedSummaryHTML(state,activeTopics,topicMap,esc){
 const data=speedRankData(state,activeTopics),fast=data.fastestTopics;
 return '<div class="card"><div class="goal"><strong>Timed competency rankings</strong><strong>'+data.totalPoints.toLocaleString()+' pts</strong></div>'+
  '<p class="muted tiny">'+data.scores.length+' timed topics completed · '+data.completedSections.length+' full sections ranked. Correctness and question variety unlock points; extra drills earn none.</p>'+
  (fast.length?'<p class="tiny"><strong>Fastest:</strong> '+esc(fast[0].topic+' · '+(topicMap[fast[0].topic]?.title||''))+' in '+speedFormatDuration(fast[0].totalSeconds)+' · '+fast[0].points+' pts</p>':'<p class="muted tiny">Your first qualifying topic completion will appear here.</p>')+
  '<button class="btn small" data-nav="rankings">View speed leaderboard →</button></div>';
}
