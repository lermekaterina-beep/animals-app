const W=2297,H=1596,IMG={"start": "assets/screens/start.jpg", "dir": "assets/screens/dir.jpg", "post": "assets/screens/post.jpg", "pre": "assets/screens/pre.jpg", "ex1": "assets/screens/ex1.jpg", "ex2": "assets/screens/ex2.jpg", "ex3": "assets/screens/ex3.jpg", "ex4": "assets/screens/ex4.jpg", "ex5": "assets/screens/ex5.jpg", "ex6": "assets/screens/ex6.jpg"};
const st=document.getElementById('stage');
const SC={x:[[310,680],[746,1115],[1181,1551],[1617,1986]],y:[[400,770],[836,1206]],o:['bear','dog','rabbit','cow','sheep','hedgehog','cat','fox']};
const GR={x:[[307,677],[719,1089],[1202,1572],[1614,1984]],y:[[432,801],[843,1213]],o:['cow','dog','bear','rabbit','sheep','cat','hedgehog','fox']};
const AN={bear:['Медведь',0],dog:['Собака',1],rabbit:['Заяц',0],cow:['Корова',1],sheep:['Овца',1],hedgehog:['Ёж',0],cat:['Кошка',1],fox:['Лиса',0]};
let mute=false,rec=null,ex=1,code='',rating='',mem=[];
const P=b=>`left:${b[0]/W*100}%;top:${b[1]/H*100}%;width:${(b[2]-b[0])/W*100}%;height:${(b[3]-b[1])/H*100}%`;
function hot(b,fn,cls){const e=document.createElement('button');e.className='h '+(cls||'');e.style.cssText=P(b);e.onclick=fn;st.appendChild(e);return e}
function scr(img){st.innerHTML='';st.style.backgroundImage=img?`url(${IMG[img]})`:'none'}
function say(t){try{if(mute)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='ru-RU';u.rate=.9;speechSynthesis.speak(u)}catch(e){}}
function hdr(o){hot([51,51,185,185],()=>go('dir'));
 if(o.p)hot([652,75,900,163],()=>go('org'));
 if(o.g)hot([2112,51,2245,185],()=>go('org'));
 if(o.s){const e=hot([2112,51,2245,185],()=>{mute=!mute;if(mute)try{speechSynthesis.cancel()}catch(x){}e.classList.toggle('muted',mute)},'snd');e.classList.toggle('muted',mute)}}
const load=()=>{try{return JSON.parse(localStorage.getItem('an_sess')||'[]')}catch(e){return mem}};
const save=a=>{mem=a;try{localStorage.setItem('an_sess',JSON.stringify(a))}catch(e){}};
const S={
 start(){scr('start');hot([197,935,788,1078],()=>go('dir'));say('Привет! Давай учиться вместе')},
 dir(){scr('dir');hdr({p:1,g:1});hot([1590,305,2235,720],()=>go('org'))},
 org(){scr(null);st.innerHTML=`<div class="org"><h1>Для организатора</h1><div>Код участника</div><input id="code" placeholder="например, 07" value="${code}"><div>Выберите упражнение</div><div class="row">${[1,2,3,4,5,6].map(n=>`<button class="num" data-n="${n}">${n}</button>`).join('')}</div><div class="row"><button class="btn l" id="r">Результаты</button><button class="btn l" id="b">← К игре</button></div></div>`;
  st.querySelectorAll('.num').forEach(b=>b.onclick=()=>{code=document.getElementById('code').value.trim();ex=+b.dataset.n;go('pre')});
  document.getElementById('r').onclick=()=>go('res');document.getElementById('b').onclick=()=>go('dir')},
 pre(){scr('pre');hdr({p:1,s:1});hot([1278,1199,1887,1359],begin);say('Привет! Давай найдем домашних и диких животных')},
 ex(){scr('ex'+ex);hdr({s:1});
  const p=document.createElement('div');p.className='prompt';p.id='pr';p.style.cssText=P([240,262,2050,392]);st.appendChild(p);setPrompt();
  const L=ex<=3?SC:GR;L.o.forEach((k,i)=>hot([L.x[i%4][0],L.y[i>>2][0],L.x[i%4][1],L.y[i>>2][1]],e=>tap(k,e.currentTarget)));
  hot([1690,1230,2270,1560],next)},
 post(){scr('post');hdr({p:1,s:1});rating='';
  [['Легко',492],['Нормально',951],['Трудно',1409]].forEach(([n,x])=>{const e=hot([x,727,x+394,1120],()=>{rating=n;st.querySelectorAll('.card').forEach(c=>c.classList.remove('sel'));e.classList.add('sel')},'card')});
  hot([849,1198,1458,1358],finish);say('Молодец! Выбери, как ты прошёл это задание')},
 res(){scr(null);const r=load();
  const rows=r.map(x=>`<tr><td>${x.when.slice(0,16).replace('T',' ')}</td><td>${x.code}</td><td>${x.ex}</td><td>${(x.total/1000).toFixed(1)}</td><td>${x.errors}</td><td>${x.found}/8</td><td>${x.rating}</td></tr>`).join('');
  const csv=['дата,код,упражнение,время_мс,ошибок,найдено_из_8,завершено,оценка,№_клика,животное,задание,результат,от_старта_мс,от_прошлого_клика_мс'].concat(r.flatMap(x=>(x.taps.length?x.taps:[{}]).map((t,i)=>[x.when,x.code,x.ex,x.total,x.errors,x.found,x.done?1:0,x.rating,t.a?i+1:'',t.a||'',t.s||'',t.ok===undefined?'':t.ok,t.t===undefined?'':t.t,t.d===undefined?'':t.d].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')))).join('\n');
  st.innerHTML=`<div class="org"><h1>Результаты</h1><div class="tw"><table><tr><th>Дата</th><th>Код</th><th>№</th><th>Время, с</th><th>Ошибок</th><th>Найдено</th><th>Оценка</th></tr>${rows||'<tr><td colspan=7>Пока пусто</td></tr>'}</table></div><textarea id="csv" readonly></textarea><div class="row"><button class="btn l" id="cp">Копировать CSV</button><button class="btn l" id="cl">Очистить</button><button class="btn l" id="bk">← Назад</button></div></div>`;
  const ta=document.getElementById('csv');ta.value=csv;
  document.getElementById('cp').onclick=async e=>{try{await navigator.clipboard.writeText(csv)}catch(x){ta.select();document.execCommand('copy')}e.target.textContent='Скопировано ✓'};
  document.getElementById('cl').onclick=e=>{if(e.target.dataset.s){save([]);go('res')}else{e.target.dataset.s=1;e.target.textContent='Точно очистить?'}};
  document.getElementById('bk').onclick=()=>go('org')}
};
function go(n){S[n]()}
function begin(){const t=performance.now();rec={ex,code,t0:t,last:t,stage:0,found:new Set(),taps:[],errors:0,done:false};go('ex');say('Найди домашних животных')}
function setPrompt(){const e=document.getElementById('pr');if(e)e.textContent=rec.done?'Молодец! Нажми «Далее»':rec.stage?'Найди диких животных':'Найди домашних животных'}
function tap(k,el){const now=performance.now(),t=Math.round(now-rec.t0),d=Math.round(now-rec.last);rec.last=now;
 const need=rec.stage===0?1:0,s=rec.stage?'дикие':'домашние',dom=AN[k][1];
 if(rec.found.has(k)&&dom===need){rec.taps.push({a:AN[k][0],s,ok:'повтор',t,d});return}
 if(dom===need){rec.found.add(k);rec.taps.push({a:AN[k][0],s,ok:1,t,d});el.classList.add('found');el.innerHTML='<span class="ok">✓</span>';
  if([...rec.found].filter(x=>AN[x][1]===need).length===4){if(rec.stage===0){rec.stage=1;say('Теперь найди диких животных')}else{rec.done=true;say('Молодец! Нажми далее')}setPrompt()}}
 else{rec.errors++;rec.taps.push({a:AN[k][0],s,ok:0,t,d});el.classList.remove('bad');void el.offsetWidth;el.classList.add('bad')}}
function next(){rec.total=Math.round(performance.now()-rec.t0);go('post')}
function finish(){rec.rating=rating;rec.when=new Date().toISOString();rec.found=rec.found.size;const a=load();a.push(rec);save(a);rec=null;go('org')}
/* v2: без озвучки, задание только на домашних, сессии участников */
let act=null;try{act=localStorage.getItem('an_act')}catch(e){}
function setAct(id){act=id;try{id?localStorage.setItem('an_act',id):localStorage.removeItem('an_act')}catch(e){}}
function curS(){return load().find(s=>s.id===act&&!s.closed)}
const NEED=1; // 1 = искать домашних, 0 = искать диких
const VOICE={"stay":"assets/audio/stay.mp3","err": "assets/audio/error.mp3", "Молодец! Выбери, как ты прошёл это задание": "assets/audio/rate-exercise.mp3", "2": "assets/audio/two-correct.mp3", "Привет! Давай найдем домашних и диких животных": "assets/audio/pre-exercise.mp3", "Привет! Давай учиться вместе": "assets/audio/greeting.mp3"};
const AUD=new Audio();
function say(t,ok){try{if(mute)return;const s=VOICE[t];if(!s)return;AUD.pause();AUD.src=s;AUD.currentTime=0;AUD.play().then(ok||(()=>{})).catch(()=>{})}catch(e){}}
function go(n){window._sc=n;S[n]()}
const G="Привет! Давай учиться вместе";
S.start=function(){scr('start');
 hot([197,935,788,1078],()=>{if(window._v1)go('dir');else{window._v1=1;say(G);setTimeout(()=>go('dir'),3200)}});
 if(!window._v1)say(G,()=>{window._v1=1})};
st.addEventListener("click",()=>{if(window._sc==='start'&&!window._v1){window._v1=1;say(G)}});
function setPrompt(){const e=document.getElementById('pr');if(e)e.textContent=rec.done?'Молодец! Нажми «Далее»':(NEED?'Найди домашних животных':'Найди диких животных')}
function begin(){const t=performance.now();rec={ex,t0:t,last:t,found:new Set(),taps:[],errors:0,done:false};go('ex');say('Найди домашних животных')}
function tap(k,el){const now=performance.now(),t=Math.round(now-rec.t0),d=Math.round(now-rec.last);rec.last=now;
 if(rec.found.has(k)){rec.taps.push({a:AN[k][0],ok:'повтор',t,d});return}
 if(AN[k][1]===NEED){rec.found.add(k);rec.taps.push({a:AN[k][0],ok:1,t,d});el.classList.add('found');el.innerHTML='<span class="ok">✓</span>';if(rec.found.size===2)say('2');if(rec.found.size===4){rec.done=true;setPrompt();setTimeout(()=>next(true),700)}}
 else{rec.errors++;if(!window._e||now-window._e>4000){window._e=now;say('err')};rec.taps.push({a:AN[k][0],ok:0,t,d});el.classList.remove('bad');void el.offsetWidth;el.classList.add('bad');el.innerHTML='<span class="no">✕</span>';setTimeout(()=>{el.classList.remove('bad');if(!el.classList.contains('found'))el.innerHTML=''},1000)}}
function finish(){rec.rating=rating;rec.when=new Date().toISOString();rec.found=rec.found.size;const a=load(),s=a.find(x=>x.id===act);if(s){s.runs.push(rec);save(a)}rec=null;go('org')}
S.org=function(){scr(null);const s=curS();
 const body=s?`<div>Участник: <b>${s.code}</b> · сессия от ${s.started.slice(0,16).replace('T',' ')}</div><div>Выберите упражнение</div><div class="row">${[1,2,3,4,5,6].map(n=>`<button class="num${s.runs.some(r=>r.ex===n)?' dn':''}" data-n="${n}">${n}</button>`).join('')}</div><div class="row"><button class="btn l" id="r">Результаты</button><button class="btn l" id="e">Завершить сессию</button><button class="btn l" id="b">← К игре</button></div>`
 :`<div>Код участника</div><input id="code" placeholder="например, 07"><div class="row"><button class="btn" id="n">Начать сессию</button></div><div class="row"><button class="btn l" id="r">Результаты</button><button class="btn l" id="b">← К игре</button></div>`;
 st.innerHTML=`<div class="org"><h1>Для организатора</h1>${body}</div>`;
 const q=i=>document.getElementById(i);
 st.querySelectorAll('.num').forEach(b=>b.onclick=()=>{ex=+b.dataset.n;go('pre')});
 if(q('n'))q('n').onclick=()=>{const c=q('code').value.trim();if(!c){q('code').style.outline='4px solid #e5484d';return}const a=load(),id=Date.now()+'';a.push({id,code:c,started:new Date().toISOString(),runs:[]});save(a);setAct(id);go('org')};
 if(q('e'))q('e').onclick=()=>{const a=load();a.find(x=>x.id===act).closed=new Date().toISOString();save(a);setAct(null);go('org')};
 q('r').onclick=()=>go('res');q('b').onclick=()=>go('dir')};
S.res=function(){scr(null);const A=load(),runs=A.flatMap(s=>s.runs.map(r=>({s,r})));
 const rows=runs.map(({s,r})=>`<tr><td>${s.code}</td><td>${r.when.slice(0,16).replace('T',' ')}</td><td>${r.ex}</td><td>${(r.total/1000).toFixed(1)}</td><td>${r.errors}</td><td>${r.found}/4</td><td>${r.rating}</td></tr>`).join('');
 const csv=['сессия,код_участника,начало_сессии,упражнение,время_мс,ошибок,найдено_из_4,оценка,№_клика,животное,результат,от_старта_мс,от_прошлого_клика_мс'].concat(runs.flatMap(({s,r})=>(r.taps.length?r.taps:[{}]).map((t,i)=>[s.id,s.code,s.started,r.ex,r.total,r.errors,r.found,r.rating,t.a?i+1:'',t.a||'',t.ok??'',t.t??'',t.d??''].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')))).join('\n');
 st.innerHTML=`<div class="org"><h1>Результаты</h1><div class="tw"><table><tr><th>Код</th><th>Дата</th><th>№</th><th>Время, с</th><th>Ошибок</th><th>Найдено</th><th>Оценка</th></tr>${rows||'<tr><td colspan=7>Пока пусто</td></tr>'}</table></div><textarea id="csv" readonly></textarea><div class="row"><button class="btn l" id="cp">Копировать CSV</button><button class="btn l" id="cl">Очистить всё</button><button class="btn l" id="bk">← Назад</button></div></div>`;
 const ta=document.getElementById('csv');ta.value=csv;
 document.getElementById('cp').onclick=async e=>{try{await navigator.clipboard.writeText(csv)}catch(x){ta.select();document.execCommand('copy')}e.target.textContent='Скопировано ✓'};
 document.getElementById('cl').onclick=e=>{if(e.target.dataset.s){save([]);setAct(null);go('res')}else{e.target.dataset.s=1;e.target.textContent='Точно очистить?'}};
 document.getElementById('bk').onclick=()=>go('org')};
/* v3: код участника после каждого упражнения, время каждого шага */
function next(ev){const auto=ev===true;if(!rec||rec.leaving)return;if(!auto&&!rec.done){say('stay');return}rec.leaving=1;const now=auto?rec.last:performance.now();if(!auto)rec.taps.push({a:'Кнопка «Далее»',ok:'',t:Math.round(now-rec.t0),d:Math.round(now-rec.last)});rec.total=Math.round(now-rec.t0);go('post')}
function finish(){rec.rating=rating;rec.when=new Date().toISOString();rec.found=rec.found.size;
 let last='';try{last=localStorage.getItem('an_last')||''}catch(e){}
 const m=document.createElement('div');m.className='org';m.style.background='rgba(20,30,90,.85)';
 m.innerHTML=`<h1>Код участника</h1><div>Впишите код и сохраните результат</div><input id="mc" value="${last}" placeholder="например, 07"><button class="btn" id="ms">Сохранить</button>`;
 st.appendChild(m);const i=m.querySelector('#mc');
 m.querySelector('#ms').onclick=()=>{const c=i.value.trim();if(!c){i.style.outline='4px solid #e5484d';return}
  try{localStorage.setItem('an_last',c)}catch(e){}
  const a=load();let s=a.find(x=>x.code===c);if(!s){s={id:Date.now()+'',code:c,started:rec.when,runs:[]};a.push(s)}
  s.runs.push(rec);save(a);rec=null;go('org')}}
S.org=function(){scr(null);
 st.innerHTML=`<div class="org"><h1>Для организатора</h1><div>Выберите упражнение</div><div class="row">${[1,2,3,4,5,6].map(n=>`<button class="num" data-n="${n}">${n}</button>`).join('')}</div><div class="row"><button class="btn l" id="r">Результаты</button><button class="btn l" id="b">← К игре</button></div></div>`;
 st.querySelectorAll('.num').forEach(b=>b.onclick=()=>{ex=+b.dataset.n;go('pre')});
 document.getElementById('r').onclick=()=>go('res');document.getElementById('b').onclick=()=>go('dir')};
S.res=function(sel){scr(null);const A=load(),runs=A.flatMap(s=>s.runs.map(r=>({s,r})));
 if(typeof sel!=='number')sel=runs.length-1;
 const rows=runs.map(({s,r},i)=>`<tr data-i="${i}" style="cursor:pointer;${i===sel?'background:#dfe8ff':''}"><td>${s.code}</td><td>${r.when.slice(0,16).replace('T',' ')}</td><td>${r.ex}</td><td>${(r.total/1000).toFixed(1)}</td><td>${r.errors}</td><td>${r.found}/4</td><td>${r.rating}</td></tr>`).join('');
 const R=runs[sel];
 const steps=R?`<div><b>Участник ${R.s.code}, упражнение ${R.r.ex}:</b> всего ${(R.r.total/1000).toFixed(1)} с, ошибок ${R.r.errors}</div><div class="tw" style="max-height:14cqw"><table><tr><th>Шаг</th><th>Действие</th><th>Результат</th><th>Время шага, с</th><th>От старта, с</th></tr>${R.r.taps.map((t,i)=>`<tr><td>${i+1}</td><td>${t.a}</td><td>${t.ok===1?'✓ верно':t.ok===0?'✗ ошибка':t.ok||'—'}</td><td>${(t.d/1000).toFixed(2)}</td><td>${(t.t/1000).toFixed(2)}</td></tr>`).join('')}</table></div>`:'';
 const csv=['сессия,код_участника,начало_сессии,упражнение,время_мс,ошибок,найдено_из_4,оценка,шаг,действие,результат,время_шага_мс,от_старта_мс'].concat(runs.flatMap(({s,r})=>(r.taps.length?r.taps:[{}]).map((t,i)=>[s.id,s.code,s.started,r.ex,r.total,r.errors,r.found,r.rating,t.a?i+1:'',t.a||'',t.ok??'',t.d??'',t.t??''].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')))).join('\n');
 st.innerHTML=`<div class="org"><h1 style="font-size:3cqw">Результаты</h1><div class="tw" style="max-height:14cqw"><table><tr><th>Код</th><th>Дата</th><th>№</th><th>Время, с</th><th>Ошибок</th><th>Найдено</th><th>Оценка</th></tr>${rows||'<tr><td colspan=7>Пока пусто</td></tr>'}</table></div>${steps}<textarea id="csv" readonly style="height:5cqw"></textarea><div class="row"><button class="btn l" id="cp">Копировать CSV</button><button class="btn l" id="cl">Очистить всё</button><button class="btn l" id="bk">← Назад</button></div></div>`;
 st.querySelectorAll('tr[data-i]').forEach(tr=>tr.onclick=()=>S.res(+tr.dataset.i));
 const ta=document.getElementById('csv');ta.value=csv;
 document.getElementById('cp').onclick=async e=>{try{await navigator.clipboard.writeText(csv)}catch(x){ta.select();document.execCommand('copy')}e.target.textContent='Скопировано ✓'};
 document.getElementById('cl').onclick=e=>{if(e.target.dataset.s){save([]);go('res')}else{e.target.dataset.s=1;e.target.textContent='Точно очистить?'}};
 document.getElementById('bk').onclick=()=>go('org')};
const _ex=S.ex;
S.ex=function(){_ex();const hb=st.querySelector('.h');let tm;
 hb.onclick=()=>say('stay');
 hb.onpointerdown=()=>{tm=setTimeout(()=>{rec=null;go('org')},2000)};
 hb.onpointerup=hb.onpointerleave=hb.onpointercancel=()=>clearTimeout(tm)};
const COWIMG='assets/sprites/cow-card.jpg';
const _pre=S.pre;
const HANDIMG='assets/sprites/hand.png';
S.pre=function(){_pre();const d=document.createElement('div');d.style.cssText='position:absolute;inset:0;pointer-events:none';
 const a=-4.2*Math.PI/180,R=30,hh=184,pts=[];
 [[1,1,0],[-1,1,90],[-1,-1,180],[1,-1,270]].forEach(([sx,sy,s])=>{for(let i=0;i<=6;i++){const t=(s+i*15)*Math.PI/180,x=sx*hh+R*Math.cos(t),y=sy*hh+R*Math.sin(t);
  pts.push(((1352+x*Math.cos(a)-y*Math.sin(a))/W*100).toFixed(2)+'% '+((947+x*Math.sin(a)+y*Math.cos(a))/H*100).toFixed(2)+'%')}});
 d.style.clipPath=d.style.webkitClipPath='polygon(evenodd,0 0,100% 0,100% 100%,0 100%,0 0,'+pts.join(',')+','+pts[0]+')';
 d.innerHTML=`<div class="dm-b" style="background-image:url(${COWIMG})"><i class="dm-c"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></i></div><img class="dm-h" src="${HANDIMG}" alt="">`;
 st.appendChild(d)};
IMG.org="assets/screens/org.jpg";IMG.res="assets/screens/res.jpg";
const msk=iso=>{const p=new Intl.DateTimeFormat('ru-RU',{timeZone:'Europe/Moscow',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date(iso)).reduce((a,x)=>(a[x.type]=x.value,a),{});return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}`};
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function dv(b,c,t){const e=document.createElement('div');e.className='dv '+(c||'');e.style.cssText=P(b);e.innerHTML=t;st.appendChild(e);return e}
function flash(b,t,ms){const e=dv(b,'fl',t);setTimeout(()=>e.remove(),ms);return e}
S.org=function(){scr('org');
 hot([51,51,185,185],()=>go('dir'));
 [[317,574],[598,855],[880,1136],[1161,1417],[1442,1698],[1723,1980]].forEach((x,i)=>hot([x[0],662,x[1],918],()=>{ex=i+1;go('pre')}));
 hot([847,1133,1136,1226],()=>go('dir'));hot([1160,1135,1451,1223],()=>go('res'));
 const i=document.createElement('input');i.className='cf';i.style.cssText=P([322,984,1975,1067])+';background:#80a2fd';i.placeholder='Введите код участника';
 try{i.value=localStorage.getItem('an_last')||''}catch(e){}
 i.oninput=()=>{window._code=i.value.trim();try{localStorage.setItem('an_last',i.value.trim())}catch(e){}};st.appendChild(i)};
S.res=function(sel){scr('res');hot([51,51,185,185],()=>go('dir'));
 const A=load(),runs=A.flatMap(s=>s.runs.map(r=>({s,r})));
 if(typeof sel!=='number')sel=runs.length-1;
 const R=runs[sel],when=r=>msk(r.when);
 const sl=document.createElement('select');sl.className='cf';sl.style.cssText=P([58,444,2150,503])+';background:#678bfc';
 sl.innerHTML=runs.length?runs.map(({s,r},i)=>`<option value="${i}"${i===sel?' selected':''}>${esc(s.code)} · упр. ${r.ex} · ${when(r)}</option>`).join(''):'<option>Нет данных</option>';
 sl.onchange=()=>S.res(+sl.value);st.appendChild(sl);
 if(R){const X=[52,168,617,781,1042,1320,1766,2241],v=[esc(R.s.code),when(R.r),R.r.ex,(R.r.total/1000).toFixed(1),R.r.errors,R.r.found+'/4',R.r.rating||'—'];
  v.forEach((t,i)=>dv([X[i],603,X[i+1],662],'',t));
  const dt=document.createElement('div');dt.className='dt';dt.style.cssText=P([77,888,2223,1280]);
  dt.innerHTML=R.r.taps.map((t,i)=>`<div class="r"><span>${i+1}</span><span>${esc(t.a)}</span><span${t.ok===0?' style="color:#e5484d"':''}>${t.ok===1?'✓ верно':t.ok===0?'✗ ошибка':t.ok||'—'}</span><span>${(t.d/1000).toFixed(2)}</span><span>${(t.t/1000).toFixed(2)}</span></div>`).join('');st.appendChild(dt)}
 const csv=['сессия,код_участника,начало_сессии,упражнение,время_мс,ошибок,найдено_из_4,оценка,шаг,действие,результат,время_шага_мс,от_старта_мс'].concat(runs.flatMap(({s,r})=>(r.taps.length?r.taps:[{}]).map((t,i)=>[s.id,s.code,msk(s.started),r.ex,r.total,r.errors,r.found,r.rating,t.a?i+1:'',t.a||'',t.ok??'',t.d??'',t.t??''].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')))).join('\n');
 hot([656,1348,945,1441],()=>go('org'));
 let armed=0;hot([970,1350,1260,1439],()=>{if(armed){save([]);go('res')}else{armed=1;flash([970,1350,1260,1439],'Точно очистить?',3000);setTimeout(()=>armed=0,3000)}});
 hot([1284,1350,1642,1439],async()=>{try{await navigator.clipboard.writeText(csv)}catch(x){const t=document.createElement('textarea');t.value=csv;document.body.appendChild(t);t.select();document.execCommand('copy');t.remove()}flash([1284,1350,1642,1439],'Скопировано ✓',1500)})};
const WINK="assets/sprites/wink.png";
const _st=S.start;
S.start=function(){_st();const w=document.createElement('img');w.className='wk';w.src=WINK;w.alt='';w.style.cssText='left:73.98%;top:34.39%;width:7.80%;height:12.20%';st.appendChild(w)};
function finish(){rec.rating=rating;rec.when=new Date().toISOString();rec.found=rec.found.size;
 let c='';try{c=localStorage.getItem('an_last')||''}catch(e){}c=(window._code||c||'').trim()||'без кода';
 const a=load();let s=a.find(x=>x.code===c);if(!s){s={id:Date.now()+'',code:c,started:rec.when,runs:[]};a.push(s)}
 s.runs.push(rec);save(a);rec=null;go('org')}
VOICE.d1="assets/audio/dir-alphabet.mp3";VOICE.d2="assets/audio/dir-digits.mp3";VOICE.d3="assets/audio/dir-music.mp3";VOICE.d4="assets/audio/dir-drawing.mp3";
const TILES=["assets/sprites/tile-1.webp", "assets/sprites/tile-2.webp", "assets/sprites/tile-3.webp", "assets/sprites/tile-4.webp"];
TILES.push("assets/sprites/tile-5.webp");
S.dir=function(){scr('dir');hdr({p:1,g:1});
 [[55,305,715,745],[815,305,1480,755],[1590,303,2237,722],[62,930,722,1375],[825,915,1493,1368]].forEach((b,i)=>{
  const q=[b[0]-12,b[1]-12,b[2]+12,b[3]+12],sp=document.createElement('img');sp.className='tl';sp.src=TILES[i];sp.alt='';sp.style.cssText=P(q);st.appendChild(sp);
  hot(q,()=>{sp.classList.add('on');say('d'+(i+1));if(i===2)setTimeout(()=>go('org'),1100);else setTimeout(()=>sp.classList.remove('on'),1100)})})};
VOICE.d5=VOICE.d4;VOICE.d4=VOICE.d3;delete VOICE.d3;
S.dir=function(){scr('dir');hdr({p:1,g:1});
 [[55,305,715,745],[815,305,1480,755],[1590,303,2237,722],[62,930,722,1375],[825,915,1493,1368]].forEach((b,i)=>{
  const q=[b[0]-12,b[1]-12,b[2]+12,b[3]+12],sp=document.createElement('img');sp.className='tl';sp.src=TILES[i];sp.alt='';sp.style.cssText=P(q);st.appendChild(sp);
  const e=hot(q,()=>{if(i===2){sp.classList.add('on');setTimeout(()=>go('org'),400)}});
  e.onpointerenter=()=>{sp.classList.add('on');say('d'+(i+1))};
  e.onpointerleave=()=>sp.classList.remove('on')})};
VOICE.d3="assets/audio/dir-animals.mp3";
S.dir=function(){scr('dir');hdr({p:1,g:1});
 [[55,305,715,745],[815,305,1480,755],[1590,303,2237,722],[62,930,722,1375],[825,915,1493,1368]].forEach((b,i)=>{
  const q=[b[0]-12,b[1]-12,b[2]+12,b[3]+12],sp=document.createElement('img');sp.className='tl';sp.src=TILES[i];sp.alt='';sp.style.cssText=P(q);st.appendChild(sp);
  const e=hot(q,()=>{say('d'+(i+1));sp.classList.add('on');sp.classList.remove('clk');void sp.offsetWidth;sp.classList.add('clk');if(i===2)setTimeout(()=>go('org'),600);else setTimeout(()=>sp.classList.remove('on'),1100)});
  e.onpointerenter=()=>{sp.classList.add('on')};
  e.onpointerleave=()=>sp.classList.remove('on')})};
go('start');

Object.values(VOICE).forEach(u=>{const a=new Audio();a.preload='auto';a.src=u});
Object.values(IMG).forEach(u=>{new Image().src=u});
