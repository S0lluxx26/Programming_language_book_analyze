// Section-aware local reference: no document text leaves the page.
(() => {
  const entries=window.BOOK_NOTATION||[],article=document.querySelector('article'),rail=document.querySelector('.on-this-page');
  if(!entries.length||!article||!rail)return;
  const mobile=matchMedia('(max-width:1200px)');
  const nav=document.createElement('details');nav.className='reference-contents';
  const navTitle=document.createElement('summary');navTitle.textContent='On this page';
  const old=document.createElement('div');while(rail.firstChild)old.append(rail.firstChild);
  nav.append(navTitle,old);
  const panel=document.createElement('section');panel.className='notation-panel';panel.setAttribute('aria-label','Syntax beside your reading');
  const toggle=document.createElement('button');toggle.className='notation-toggle';toggle.type='button';toggle.setAttribute('aria-controls','notation-body');
  const body=document.createElement('div');body.id='notation-body';
  const section=document.createElement('p');section.className='notation-section';
  const label=document.createElement('label');label.htmlFor='notation-search';label.textContent='Find a symbol or OCaml term';
  const search=document.createElement('input');search.id='notation-search';search.type='search';search.placeholder='↦, ::, let rec, fold…';
  const mode=document.createElement('select');mode.setAttribute('aria-label','Reference scope');
  for(const [value,text] of [['section','In this section'],['all','All symbols']]){const option=document.createElement('option');option.value=value;option.textContent=text;mode.append(option);}
  const cards=document.createElement('div');cards.className='notation-cards';
  const full=document.createElement('a');full.href='syntax.html';full.textContent='Full syntax reference →';full.className='notation-full';
  body.append(section,label,search,mode,cards,full,nav);panel.append(toggle,body);rail.append(panel);rail.classList.add('notation-rail');rail.setAttribute('aria-label','Section syntax and page navigation');
  let expanded=!mobile.matches;
  const setExpanded=value=>{expanded=value;body.hidden=!value;toggle.setAttribute('aria-expanded',String(value));toggle.textContent=value?'Syntax beside you −':'Syntax beside you +';};
  setExpanded(expanded);toggle.onclick=()=>setExpanded(!expanded);
  mobile.addEventListener('change',()=>setExpanded(!mobile.matches));
  const escape=s=>s.split('').map(c=>'\\^$.*+?()[]{}|'.includes(c)?'\\'+c:c).join('');
  const patterns=new Map(entries.map(e=>[e.id,e.terms.map(term=>new RegExp((/^[a-zA-Z]/.test(term)?'\\b':'')+escape(term)+(/[a-zA-Z]$/.test(term)?'\\b':''),/^[A-Z]$/.test(term)?'':'i'))]));
  const chunks=[];let current={heading:null,title:document.querySelector('h1').textContent,text:''};chunks.push(current);
  for(const node of article.children){
    if(/^H[234]$/.test(node.tagName)){current={heading:node,title:node.textContent,text:node.textContent};chunks.push(current);}
    else {const copy=node.cloneNode(true);copy.querySelectorAll('.mermaid-figure,.diagram-source').forEach(n=>n.remove());if(!copy.matches('.mermaid-figure,.diagram-source'))current.text+=' '+copy.textContent;}
  }
  for(const chunk of chunks)chunk.entries=entries.filter(e=>patterns.get(e.id).some(re=>re.test(chunk.text)));
  let active=-1,pinned=null;
  function draw(){
    const chunk=chunks[Math.max(0,active)],query=search.value.trim().toLowerCase();
    let choices=query||mode.value==='all'?entries:chunk.entries;
    section.textContent=query?'Searching all symbols':mode.value==='all'?'All symbols':chunk.title;
    if(pinned&&!query)choices=[pinned,...choices.filter(e=>e!==pinned)];
    if(query)choices=choices.filter(e=>(e.label+' '+e.meaning+' '+e.terms.join(' ')).toLowerCase().includes(query));
    cards.replaceChildren();
    if(!choices.length){const empty=document.createElement('p');empty.textContent=query?'No match. Try a symbol, “fold”, or “recursive”.':'No reference terms detected here. Choose All symbols or search above.';cards.append(empty);}
    for(const entry of choices){
      const card=document.createElement('details');card.className='notation-card';card.open=entry===pinned||choices.length===1;
      const title=document.createElement('summary');title.textContent=entry.label;
      const meaning=document.createElement('p');meaning.textContent=entry.meaning;
      const example=document.createElement('pre');example.textContent=entry.example;
      const link=document.createElement('a');link.href='syntax.html#'+entry.syntax;link.textContent='Meaning and source ↗';
      card.append(title,meaning,example,link);cards.append(card);
    }
    if(!pinned&&cards.firstElementChild?.matches('details'))cards.firstElementChild.open=true;
  }
  function follow(){
    let index=0;chunks.forEach((c,i)=>{if(c.heading&&c.heading.getBoundingClientRect().top<=170)index=i;});
    if(index!==active){active=index;pinned=null;draw();}
  }
  let scheduled=false;
  addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(()=>{scheduled=false;follow();});}},{passive:true});
  addEventListener('resize',follow);addEventListener('hashchange',()=>requestAnimationFrame(follow));
  search.addEventListener('input',()=>{pinned=null;draw();});mode.addEventListener('change',()=>{pinned=null;draw();});
  article.addEventListener('click',event=>{
    const link=event.target.closest('a.syntax-link');if(!link||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
    const id=link.hash.slice(1),entry=entries.find(e=>e.syntax===id&&e.terms.includes(link.textContent))||entries.find(e=>e.syntax===id);
    if(!entry)return;event.preventDefault();pinned=entry;search.value='';setExpanded(true);draw();toggle.focus({preventScroll:true});
  });
  follow();
})();
