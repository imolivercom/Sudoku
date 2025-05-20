const grid=document.getElementById('grid'),win=document.getElementById('win'),btn=document.getElementById('newGame');
const BASE=[[5,3,4,6,7,8,9,1,2],[6,7,2,1,9,5,3,4,8],[1,9,8,3,4,2,5,6,7],[8,5,9,7,6,1,4,2,3],[4,2,6,8,5,3,7,9,1],[7,1,3,9,2,4,8,5,6],[9,6,1,5,3,7,2,8,4],[2,8,7,4,1,9,6,3,5],[3,4,5,2,8,6,1,7,9]];
const rand=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
function permute(){let b=BASE.map(r=>r.slice());const d=rand([1,2,3,4,5,6,7,8,9]);b=b.map(r=>r.map(v=>d[v-1]));
 [0,1,2].forEach(bn=>{const rows=[0,1,2].map(i=>b[bn*3+i]);rand(rows);rows.forEach((row,i)=>b[bn*3+i]=row);});
 const bands=[b.slice(0,3),b.slice(3,6),b.slice(6,9)];rand(bands);b=[...bands[0],...bands[1],...bands[2]];
 let cols=b[0].map((_,i)=>b.map(r=>r[i]));[0,1,2].forEach(st=>{const seg=[0,1,2].map(i=>cols[st*3+i]);rand(seg);seg.forEach((c,i)=>cols[st*3+i]=c);});
 const stacks=[cols.slice(0,3),cols.slice(3,6),cols.slice(6,9)];rand(stacks);cols=[...stacks[0],...stacks[1],...stacks[2]];
 return cols[0].map((_,i)=>cols.map(c=>c[i]));}
function gen(){const s=permute();return{solved:s,puzzle:s.map(r=>r.map(v=>Math.random()<.5?v:0))};}
let sol=[],pop=null;jwt=localStorage.getItem('jwt')||null;
function build(){const{puzzle,solved}=gen();sol=solved;grid.innerHTML='';
 for(let r=0;r<9;r++){for(let c=0;c<9;c++){const cell=document.createElement('div');cell.className='cell';
  if(r%3===0)cell.dataset.t='';if(c%3===0)cell.dataset.l='';cell.dataset.r=r;cell.dataset.c=c;
  const v=puzzle[r][c];if(v){cell.textContent=v;cell.classList.add('prefilled');}else cell.onclick=()=>sel(cell);
  grid.appendChild(cell);}}}
function sel(cell){if(pop)pop.remove();const wrap=grid.getBoundingClientRect(),s=Math.min(wrap.width*.35,160);
 pop=document.createElement('div');pop.className='popup';pop.style.width=pop.style.height=s+'px';
 for(let i=1;i<=9;i++){const b=document.createElement('button');b.textContent=i;b.onclick=e=>{e.stopPropagation();set(cell,i);pop.remove();pop=null;};pop.appendChild(b);}
 grid.parentElement.appendChild(pop);const cr=cell.getBoundingClientRect();let l=cr.left-wrap.left,t=cr.top-wrap.top;
 if(l+s>wrap.width)l=wrap.width-s;if(t+s>wrap.height)t=wrap.height-s;if(l<0)l=0;if(t<0)t=0;pop.style.left=l+'px';pop.style.top=t+'px';}
function set(cell,val){const r=+cell.dataset.r,c=+cell.dataset.c;cell.textContent=val;const ok=val==sol[r][c];
 cell.classList.toggle('correct',ok);cell.classList.toggle('incorrect',!ok);
 if(ok&&[...grid.children].every(el=>el.classList.contains('prefilled')||el.classList.contains('correct'))){win.classList.add('show');send().finally(()=>setTimeout(()=>{win.classList.remove('show');build();},1500));}}
async function send(){if(!jwt)return;await fetch('/api/score',{method:'POST',headers:{Authorization:'Bearer '+jwt}}).catch(console.error);}
btn.onclick=()=>build();
window.initSudoku=build;
