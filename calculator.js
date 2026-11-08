/* ENG1013 Exam Pilot scientific calculator — independent of study progress */
(function(){
  'use strict';
  const root=document.getElementById('calculatorPanel');
  const input=document.getElementById('calcExpression');
  const output=document.getElementById('calcResult');
  const status=document.getElementById('calcStatus');
  const modeButton=document.getElementById('calcMode');
  const launcher=document.getElementById('calcLauncher');
  const closeButton=document.getElementById('calcClose');
  if(!root||!input||!output||!launcher)return;

  let degrees=true,answer=0,calculated=false,lastAnswerInput=null;
  const isEditable=el=>el&&(el.matches&&el.matches('input,textarea,[contenteditable="true"]')||el.isContentEditable);
  const isNarrow=()=>window.matchMedia('(max-width: 1200px)').matches;
  const show=()=>{
    root.classList.add('calc-open');
    launcher.setAttribute('aria-expanded','true');
    input.focus();
  };
  const hide=()=>{
    root.classList.remove('calc-open');
    launcher.setAttribute('aria-expanded','false');
    launcher.focus();
  };
  launcher.addEventListener('click',()=>root.classList.contains('calc-open')?hide():show());
  closeButton.addEventListener('click',hide);
  document.addEventListener('focusin',e=>{
    if(e.target&&(e.target.id==='numericAnswer'||e.target.matches?.('input[data-mock-input]')))lastAnswerInput=e.target;
  });

  function tokenize(expression){
    const source=String(expression).replace(/π/g,'pi').replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-');
    if(source.length>260)throw Error('Expression is too long.');
    const rx=/\s*(?:(\d+(?:\.\d*)?|\.\d+)([eE][+-]?\d+)?|([a-zA-Z]+)|([+\-*/^()%!,]))/gy;
    const tokens=[];
    let pos=0;
    while(pos<source.length){
      if(/^\s*$/.test(source.slice(pos)))break;
      rx.lastIndex=pos;
      const m=rx.exec(source);
      if(!m)throw Error('Unrecognised character at position '+(pos+1)+'.');
      if(m[1])tokens.push({type:'number',value:Number(m[1]+(m[2]||''))});
      else if(m[3])tokens.push({type:'name',value:m[3].toLowerCase()});
      else tokens.push({type:m[4]});
      pos=rx.lastIndex;
      if(tokens.length>160)throw Error('Expression is too complex.');
    }
    return tokens;
  }

  function compute(expression){
    const tokens=tokenize(expression);
    if(!tokens.length)throw Error('Enter a calculation.');
    let position=0;
    const look=()=>tokens[position]||{type:'end'};
    const take=key=>{if(look().type===key){position++;return true;}return false;};
    const need=key=>{if(!take(key))throw Error('Expected '+key+'.');};
    function primary(){
      const next=look();
      if(take('(')){const n=add();need(')');return n;}
      if(next.type==='number'){position++;return next.value;}
      if(next.type==='name'){
        position++;
        const name=next.value;
        if(name==='pi')return Math.PI;
        if(name==='e')return Math.E;
        if(name==='ans')return answer;
        const funcs={
          sqrt:x=>Math.sqrt(x),abs:x=>Math.abs(x),
          ln:x=>Math.log(x),log:x=>Math.log10(x),exp:x=>Math.exp(x),
          sin:x=>Math.sin(degrees?x*Math.PI/180:x),
          cos:x=>Math.cos(degrees?x*Math.PI/180:x),
          tan:x=>Math.tan(degrees?x*Math.PI/180:x),
          asin:x=>{const n=Math.asin(x);return degrees?n*180/Math.PI:n;},
          acos:x=>{const n=Math.acos(x);return degrees?n*180/Math.PI:n;},
          atan:x=>{const n=Math.atan(x);return degrees?n*180/Math.PI:n;}
        };
        if(!funcs[name])throw Error('Unknown function: '+name+'.');
        need('(');const n=add();need(')');
        return funcs[name](n);
      }
      throw Error('A number or opening bracket is missing.');
    }
    function postfix(){
      let n=primary();
      while(true){
        if(take('%'))n/=100;
        else if(take('!')){
          if(!Number.isInteger(n)||n<0||n>170)throw Error('Factorial requires an integer from 0 to 170.');
          let v=1;for(let k=2;k<=n;k++)v*=k;n=v;
        }else break;
      }
      return n;
    }
    function power(){let n=postfix();if(take('^'))n=Math.pow(n,unary());return n;}
    function unary(){if(take('+'))return unary();if(take('-'))return -unary();return power();}
    function multiply(){
      let n=unary();
      while(true){
        if(take('*'))n*=unary();
        else if(take('/')){const rhs=unary();if(rhs===0)throw Error('Cannot divide by zero.');n/=rhs;}
        else break;
      }
      return n;
    }
    function add(){
      let n=multiply();
      while(true){
        if(take('+'))n+=multiply();
        else if(take('-'))n-=multiply();
        else break;
      }
      return n;
    }
    const n=add();
    if(position<tokens.length)throw Error('Check the expression near '+tokens[position].type+'.');
    if(!Number.isFinite(n))throw Error('Result is undefined or outside the calculator range.');
    return Math.abs(n)<1e-14?0:n;
  }
  function displayNumber(n){
    if(n===0)return '0';
    return Number(n.toPrecision(12)).toString();
  }
  function report(msg,isError=false){
    status.textContent=msg;
    status.classList.toggle('calc-error',isError);
  }
  function evaluate(){
    try{
      const value=compute(input.value);
      answer=value;
      const formatted=displayNumber(value);
      output.textContent=formatted;
      report('Calculated • Ans updated');
      calculated=true;
      return formatted;
    }catch(e){
      output.textContent='—';
      report(e.message||'Invalid expression',true);
      calculated=false;
      return null;
    }
  }
  function replaceExpression(value){
    input.value=value;
    calculated=false;
    input.focus();
    input.setSelectionRange(input.value.length,input.value.length);
  }
  function insert(value){
    if(calculated){
      const operator=/^[+\-*/^%!]/.test(value);
      const base=operator?displayNumber(answer):'';
      input.value=base;
      calculated=false;
    }
    const start=input.selectionStart??input.value.length;
    const end=input.selectionEnd??input.value.length;
    input.setRangeText(value,start,end,'end');
    report('Keyboard: + − * / ^ ( ) • Enter =');
    input.focus();
  }
  function command(cmd){
    if(cmd==='equals'){evaluate();input.focus();return;}
    if(cmd==='clear'){input.value='';output.textContent='0';calculated=false;report('Cleared');input.focus();return;}
    if(cmd==='delete'){
      if(calculated){replaceExpression(displayNumber(answer));}
      const start=input.selectionStart??input.value.length,end=input.selectionEnd??start;
      if(start!==end)input.setRangeText('',start,end,'end');
      else if(start>0)input.setRangeText('',start-1,start,'end');
      calculated=false;input.focus();return;
    }
    if(cmd==='mode'){
      degrees=!degrees;
      modeButton.textContent=degrees?'DEG':'RAD';
      modeButton.setAttribute('aria-label','Angle mode: '+(degrees?'degrees':'radians')+'. Switch angle mode.');
      report(degrees?'Trig functions use degrees':'Trig functions use radians');
      input.focus();return;
    }
    if(cmd==='square'){replaceExpression('('+((calculated?displayNumber(answer):input.value)||'0')+')^2');return;}
    if(cmd==='reciprocal'){replaceExpression('1/('+((calculated?displayNumber(answer):input.value)||'1')+')');return;}
    if(cmd==='sign'){replaceExpression('-('+((calculated?displayNumber(answer):input.value)||'0')+')');return;}
    if(cmd==='copy'){
      const value=output.textContent;
      if(value==='—'||!value)return;
      if(navigator.clipboard&&navigator.clipboard.writeText){
        navigator.clipboard.writeText(value).then(()=>report('Result copied')).catch(()=>report('Select the result to copy it',true));
      }else report('Select the result to copy it',true);
      return;
    }
    if(cmd==='useAnswer'){
      const value=output.textContent;
      if(value==='—'||!value)return;
      let target=lastAnswerInput;
      if(!target||!target.isConnected||target.disabled){
        target=document.querySelector('#numericAnswer:not(:disabled),input[data-mock-input]:not(:disabled)');
      }
      if(!target){report('Open a numerical question before using this result.',true);return;}
      target.value=value;
      target.dispatchEvent(new Event('input',{bubbles:true}));
      target.focus();
      report('Result placed in answer field. Submit it when ready.');
      if(isNarrow()){root.classList.remove('calc-open');launcher.setAttribute('aria-expanded','false');}
    }
  }
  root.addEventListener('click',e=>{
    const el=e.target.closest('button[data-calc-insert],button[data-calc-command]');
    if(!el)return;
    if(el.dataset.calcInsert!==undefined)insert(el.dataset.calcInsert);
    else command(el.dataset.calcCommand);
  });
  input.addEventListener('input',()=>{calculated=false;report('Press Enter or = to calculate');});
  input.addEventListener('keydown',e=>{
    if(e.key==='Enter'||e.key==='='){
      e.preventDefault();e.stopPropagation();evaluate();
    }else if(e.key==='Escape'&&isNarrow()){
      e.preventDefault();hide();
    }
  });
  document.addEventListener('keydown',e=>{
    if(e.ctrlKey||e.metaKey||e.isComposing)return;
    if(e.altKey&&e.key.toLowerCase()==='c'){
      e.preventDefault();show();return;
    }
    if(e.altKey)return;
    if(e.key==='Escape'&&root.classList.contains('calc-open')&&isNarrow()){hide();return;}
    if(isEditable(e.target)||e.target.closest?.('[role="textbox"]'))return;
    if(/^[0-9.+\-*/^()%]$/.test(e.key)){
      e.preventDefault();show();insert(e.key);
    }
  });
  window.addEventListener('resize',()=>{if(!isNarrow()){root.classList.remove('calc-open');launcher.setAttribute('aria-expanded','false');}});
  report('Keyboard: + − * / ^ ( ) • Enter =');
})();