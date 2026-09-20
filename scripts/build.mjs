import fs from 'node:fs';
import path from 'node:path';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js/lib/core';
import ocaml from 'highlight.js/lib/languages/ocaml';
import bash from 'highlight.js/lib/languages/bash';
hljs.registerLanguage('ocaml', ocaml); hljs.registerLanguage('bash', bash);
const root = process.cwd();
const catalog = JSON.parse(fs.readFileSync('book/catalog.json', 'utf8')).filter(p=>!process.argv.includes('--preview')||fs.existsSync(`book/${p.slug}.md`));
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const md = new MarkdownIt({html:true, typographer:false, highlight:(str, lang)=>lang && hljs.getLanguage(lang) ? hljs.highlight(str, {language:lang}).value : esc(str)});
const definitions=JSON.parse(fs.readFileSync('book/definitions.json','utf8'));
const aliases=new Map(definitions.flatMap(d=>d.aliases.map(a=>[a.toLowerCase(),d])));
const termPattern=new RegExp('\\b('+[...aliases.keys()].sort((a,b)=>b.length-a.length).map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')(s)?\\b','gi');
md.core.ruler.after('inline','definition-links',state=>{
  if(currentPage==='glossary')return;
  const used=new Set();
  for(let i=0;i<state.tokens.length;i++){
    const block=state.tokens[i];
    if(block.type!=='inline'||state.tokens[i-1]?.type==='heading_open')continue;
    let linkDepth=0;const children=[];
    for(const token of block.children||[]){
      if(token.type==='link_open')linkDepth++;
      if(token.type==='link_close')linkDepth--;
      if(token.type!=='text'||linkDepth){children.push(token);continue;}
      let offset=0;termPattern.lastIndex=0;
      for(const match of token.content.matchAll(termPattern)){
        const def=aliases.get(match[1].toLowerCase());if(used.has(def.id))continue;
        const addText=value=>{if(value){const t=new state.Token('text','',0);t.content=value;children.push(t);}};
        addText(token.content.slice(offset,match.index));
        const link=new state.Token('link_open','a',1);link.attrs=[['href',`glossary.html#${def.id}`],['class','definition-link'],['title',def.meaning+' — '+(def.source?'Course slides':'English textbook')+', PDF p. '+def.page]];
        children.push(link);addText(match[0]);children.push(new state.Token('link_close','a',-1));
        used.add(def.id);offset=match.index+match[0].length;
      }
      const tail=new state.Token('text','',0);tail.content=token.content.slice(offset);children.push(tail);
    }
    block.children=children;
  }
});
const fallback = md.renderer.rules.fence;
let currentPage='', diagramCount=0;
const diagrams=[];
md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token=tokens[idx];
  if (token.info.trim()==='mermaid') {
    const name=`${currentPage}-${++diagramCount}`;
    diagrams.push({name,source:token.content});
    const svgPath=`dist/assets/diagrams/${name}.svg`;
    const bounds=fs.existsSync(svgPath)?fs.readFileSync(svgPath,'utf8').match(/viewBox="([^"]+)"/)?.[1].split(' ').map(Number):null;
    const dimensions=bounds?` width="${bounds[2]}" height="${bounds[3]}"`:'';
    return `<figure class="mermaid-figure"><a class="diagram-link" href="assets/diagrams/${name}.svg" target="_blank" rel="noopener" aria-label="Open diagram at full size"><img src="assets/diagrams/${name}.svg"${dimensions} alt="${esc(token.content.match(/accTitle:\s*(.*)/)?.[1]||'Concept flowchart')}"></a><figcaption>Mermaid diagram · <a href="assets/diagrams/${name}.svg" target="_blank" rel="noopener">Open full size</a></figcaption><details class="diagram-source"><summary>View Mermaid source</summary><pre><code>${esc(token.content)}</code></pre></details></figure>`;
  }
  if (token.info.trim()==='flow') {
    return '<figure class="flow-figure"><ol class="flow">'+token.content.trim().split('\n').map((line,i)=>{const [title,...detail]=line.split('|');return `<li><span class="step-number">${i+1}</span><strong>${esc(title.trim())}</strong><span>${esc(detail.join('|').trim())}</span></li>`;}).join('')+'</ol><figcaption>Read the steps in order; each result becomes input to the next step.</figcaption></figure>';
  }
  if (token.info.trim()==='decision') {
    const [question,...branches]=token.content.trim().split('\n');
    return `<figure class="decision"><div class="decision-question">${esc(question)}</div><div class="decision-branches">${branches.map(l=>{const [test,...rest]=l.split('|');return `<div><strong>${esc(test)}</strong><span>↓</span><p>${esc(rest.join('|'))}</p></div>`;}).join('')}</div><figcaption>Choose the case that matches the current input.</figcaption></figure>`;
  }
  return fallback(tokens,idx,options,env,self);
};
fs.mkdirSync('dist/assets',{recursive:true});
for (const f of fs.readdirSync('web')) fs.copyFileSync(path.join('web',f),path.join('dist/assets',f));
fs.writeFileSync('dist/assets/book.css',fs.readFileSync('web/book.css','utf8')+'\n'+fs.readFileSync('web/diagrams.css','utf8'));
fs.writeFileSync('dist/.nojekyll','');
fs.mkdirSync('dist/examples',{recursive:true});
if(fs.existsSync('examples')) for(const f of fs.readdirSync('examples')) if(f.endsWith('.ml')) fs.copyFileSync(`examples/${f}`,`dist/examples/${f}`);
const index=[];
for (let n=0;n<catalog.length;n++) {
  const page=catalog[n], file=`book/${page.slug}.md`;
  currentPage=page.slug;diagramCount=0;
  if(!fs.existsSync(file)) throw Error(`Missing chapter: ${file}`);
  const source=fs.readFileSync(file,'utf8');
  const tokens=md.parse(source,{}), headings=[], ids=new Map();
  for(let i=0;i<tokens.length;i++) if(tokens[i].type==='heading_open') {
    const label=tokens[i+1].content,base=slugify(label),count=ids.get(base)||0; ids.set(base,count+1);
    const id=base+(count?`-${count}`:'');tokens[i].attrSet('id',id);
    if(tokens[i].tag==='h2') headings.push({label,id});
  }
  const html=md.renderer.render(tokens,md.options,{});
  const words=source.replace(/<[^>]*>/g,' ').split(/\s+/).length;
  let part='';
  const nav=catalog.map(p=>{let h='';if(part!==p.part){part=p.part;h=`<p class="nav-group">${esc(part)}</p>`;}return h+`<a href="${p.slug}.html" ${p.slug===page.slug?'aria-current="page"':''}>${esc(p.title)}</a>`;}).join('');
  const prev=catalog[n-1],next=catalog[n+1];
  const body=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(page.title)} · The Programming Languages Notebook</title><meta name="description" content="${esc(page.description)}"><meta name="theme-color" content="#142b48"><meta property="og:title" content="${esc(page.title)}"><meta property="og:description" content="${esc(page.description)}"><meta property="og:type" content="article"><link rel="icon" href="assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="assets/book.css"><script src="assets/search-index.js" defer></script><script src="assets/book.js" defer></script></head><body>
  <a class="skip-link" href="#main">Skip to content</a>
  <aside class="sidebar" id="sidebar"><a class="brand" href="index.html"><span class="brand-icon">λ</span><span>The Programming<br>Languages Notebook</span></a><p class="edition">COSE212 / KOREA UNIVERSITY<br>FALL 2026 · STUDY COMPANION</p><button class="search-trigger" type="button">Search the book <kbd>/</kbd></button><nav aria-label="Book chapters">${nav}</nav><div class="sidebar-foot">Read the rule.<br>Draw the state.<br>Write the program.</div></aside>
  <div class="page"><header class="topbar"><button class="menu-toggle" aria-controls="sidebar" aria-expanded="false">Contents</button><span>${esc(page.part)}</span><div><a href="sources.html">Source library</a><button class="print-button" type="button">Print chapter</button></div></header><div class="reading-layout"><main id="main" tabindex="-1"><div class="chapter-heading"><p class="eyebrow">${esc(page.tag)}</p><h1>${esc(page.title)}</h1><p class="dek">${esc(page.description)}</p><p class="reading-meta">${Math.max(2,Math.ceil(words/190))} MIN READ <span>•</span> ORIGINAL COMPANION NOTES</p></div><article>${html}</article><nav class="chapter-pagination" aria-label="Adjacent chapters">${prev?`<a href="${prev.slug}.html"><small>← Previous</small>${esc(prev.title)}</a>`:'<span></span>'}${next?`<a href="${next.slug}.html"><small>Next →</small>${esc(next.title)}</a>`:''}</nav><footer>Independent study companion to Hakjoo Oh’s COSE212 materials. Original course PDFs remain authoritative. Source snapshot: 20 September 2026.</footer></main><aside class="on-this-page" aria-label="On this page"><p>ON THIS PAGE</p>${headings.map(h=>`<a href="#${h.id}">${esc(h.label)}</a>`).join('')}<a class="back-top" href="#main">Back to top ↑</a></aside></div></div>
  <dialog id="search-dialog"><div class="search-head"><label for="search-input">Search the notebook</label><button class="search-close" aria-label="Close search">×</button></div><input id="search-input" type="search" placeholder="Try closures, HW1 P15, occurs check…" autocomplete="off"><p class="search-status" role="status">Search definitions, chapters, and homework.</p><div id="search-results"></div></dialog></body></html>`;
  fs.writeFileSync(`dist/${page.slug}.html`,body);
  index.push({title:page.title,url:page.slug+'.html',part:page.part,text:md.utils.unescapeAll(html.replace(/<details class="diagram-source">[\s\S]*?<\/details>/g,'').replace(/<[^>]*>/g,' ')).replace(/\s+/g,' ')});
}
fs.writeFileSync('dist/assets/search-index.js','window.BOOK_INDEX='+JSON.stringify(index).replace(/</g,'\\u003c')+';');
fs.copyFileSync('sources/manifest.json','dist/assets/source-manifest.json');
fs.mkdirSync('dist/assets/diagrams',{recursive:true});
fs.writeFileSync('dist/assets/diagrams/manifest.json',JSON.stringify(diagrams,null,2));
for(const d of diagrams)fs.writeFileSync(`dist/assets/diagrams/${d.name}.mmd`,d.source);
console.log(`Built ${catalog.length} chapters in dist/.`);
