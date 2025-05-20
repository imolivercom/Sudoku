const gridEl=document.getElementById('grid');
const winEl=document.getElementById('win');
const newBtn=document.getElementById('newGame');
let jwt=localStorage.getItem('jwt')||null;

const BASE=[[5,3,4,6,7,8,9,1,2],[6,7,2,1,9,5,3,4,8],[1,9,8,3,4,2,5,6,7],
            [8,5,9,7,6,1,4,2,3],[4,2,6,8,5,3,7,9,1],[7,1,3,9,2,4,8,5,6],
            [9,6,1,5,3,7,2,8,4],[2,8,7,4,1,9,6,3,5],[3,4,5,2,8,6,1,7,9]];
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
function permute(){let b=BASE.map(r=>r.slice());const d=shuffle([1,2,3,4,5,6,7,8,9]);b=b.map(r=>r.map(v=>d[v-1]));
 [0,1,2].forEach(bn=>{const rows=[0,1,2].map(i=>b[bn*3+i]);shuffle(rows);rows.forEach((row,i)=>b[bn*3+i]=row);});
 const bands=[b.slice(0,3),b.slice(3,6),b.slice(6,9)];shuffle(bands);b=[...bands[0],...bands[1],...bands[2]];
 let cols=b[0].map((_,i)=>b.map(r=>r[i]));[0,1,2].forEach(st=>{const seg=[0,1,2].map(i=>cols[st*3+i]);shuffle(seg);seg.forEach((c,i)=>cols[st*3+i]=c);});
 const stacks=[cols.slice(0,3),cols.slice(3,6),cols.slice(6,9)];shuffle(stacks);cols=[...stacks[0],...stacks[1],...stacks[2]];
 return cols[0].map((_,i)=>cols.map(c=>c[i]));}
function generate(){const solved=permute();const puzzle=solved.map(r=>r.map(v=>Math.random()<0.5?v:0));return{puzzle,solved};}
let solution=[],popup=null;
function build(){const{puzzle,solved}=generate();solution=solved;gridEl.innerHTML='';
 for(let r=0;r<9;r++){for(let c=0;c<9;c++){const cell=document.createElement('div');cell.className='cell';
   if(r%3===0)cell.dataset.top='';if(c%3===0)cell.dataset.left='';cell.dataset.row=r;cell.dataset.col=c;
   const v=puzzle[r][c];if(v){cell.textContent=v;cell.classList.add('prefilled');}else{cell.onclick=()=>select(cell);}gridEl.appendChild(cell);}}}
function select(cell){if(popup)popup.remove();const wrap=document.querySelector('.board-wrapper');const rect=wrap.getBoundingClientRect();
 const size=Math.min(rect.width*0.35,160);popup=document.createElement('div');popup.className='popup';popup.style.width=popup.style.height=size+'px';
 for(let i=1;i<=9;i++){const b=document.createElement('button');b.textContent=i;b.onclick=e=>{e.stopPropagation();set(cell,i);popup.remove();popup=null;};popup.appendChild(b);}
 wrap.appendChild(popup);const cRect=cell.getBoundingClientRect();let l=cRect.left-rect.left,t=cRect.top-rect.top;
 if(l+size>rect.width)l=rect.width-size;if(t+size>rect.height)t=rect.height-size;if(l<0)l=0;if(t<0)t=0;popup.style.left=l+'px';popup.style.top=t+'px';}
function set(cell,val){const r=+cell.dataset.row,c=+cell.dataset.col;cell.textContent=val;const ok=val==solution[r][c];
 cell.classList.toggle('correct',ok);cell.classList.toggle('incorrect',!ok);
 if(ok&&[...gridEl.children].every(el=>el.classList.contains('prefilled')||el.classList.contains('correct'))){winEl.classList.add('show');sendScore().finally(()=>setTimeout(()=>{winEl.classList.remove('show');build();},1500));}}
async function sendScore(){if(!jwt)return;await fetch('/api/score',{method:'POST',headers:{Authorization:'Bearer '+jwt}}).catch(console.error);}
newBtn.onclick=()=>build();build();
