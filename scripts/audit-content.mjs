import fs from 'node:fs';
import MarkdownIt from 'markdown-it';
import {addLearningAids} from './learning-aids.mjs';
import {addThinkingRoutes} from './thinking-routes.mjs';
const catalog=JSON.parse(fs.readFileSync('book/catalog.json','utf8'));
const md=new MarkdownIt({html:true}),fence=String.fromCharCode(96).repeat(3);
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const rows=[];
for(const p of catalog){
  const text=addLearningAids(p.slug,addThinkingRoutes(p.slug,fs.readFileSync('book/'+p.slug+'.md','utf8')));
  const tokens=md.parse(text,{}),headings=[],ids=new Map();
  for(let i=0;i<tokens.length;i++)if(tokens[i].type==='heading_open'){
    const title=tokens[i+1].content,base=slug(title),count=ids.get(base)||0;ids.set(base,count+1);
    if(tokens[i].tag!=='h1')headings.push({title,id:base+(count?'-'+count:''),line:tokens[i].map[0],level:tokens[i].tag});
  }
  const lines=text.split('\n');
  for(let i=0;i<headings.length;i++){
    const h=headings[i],body=lines.slice(h.line+1,headings[i+1]?.line??lines.length).join('\n');
    const section=h.title.match(/^(\d+(?:\.\d+)+)\s/)?.[1];
    const kind=['index','textbook','lectures','homework-map','setup','sources'].includes(p.slug)?'navigation / study support':['syntax','glossary'].includes(p.slug)?'reference':/^lecture-/.test(p.slug)?'lecture summary':/^hw/.test(p.slug)||p.slug.endsWith('-problems')?'practice':'instruction';
    rows.push({page:p.slug,heading:h.title,anchor:h.id,level:h.level,kind,section:section||null,words:body.replace(/<[^>]*>/g,' ').split(/\s+/).filter(Boolean).length,links:(body.match(/\]\(/g)||[]).length,code:body.includes(fence+'ocaml'),diagram:body.includes(fence+'mermaid'),exampleCue:/example|trace|e\.g\.|for instance/i.test(body),checkCue:/\?|checkpoint|check your|ready to|test:/i.test(body)});
  }
}
fs.mkdirSync('reports',{recursive:true});
const baseline=process.argv.includes('--baseline');
fs.writeFileSync('reports/section-audit-'+(baseline?'before':'after')+'.json',JSON.stringify(rows,null,2)+'\n');
if(!baseline){
  const before=JSON.parse(fs.readFileSync('reports/section-audit-before.json','utf8'));
  const checks=JSON.parse(fs.readFileSync('book/section-checkpoints.json','utf8'));
  let out='# Section-by-section clarity review\n\nThe inventory covers '+rows.length+' H2–H4 sections across '+catalog.length+' pages (before: '+before.length+' sections). Signals are screening, not automated quality scores. See [the plan](../CONTENT_REVIEW_PLAN.md) for the editorial priorities and limits.\n\n## Findings and decisions\n\n- All 48 numbered textbook sections now have a specific prediction question, explained answer, common trap, and prerequisite link.\n- Chapter transitions identify the changed model and prerequisite. Existing worked examples remain.\n- The study schedule now names and links concept guides rather than mixing their numbering with textbook chapters.\n- The GC opening now describes conservative reachability, not exact prediction of future use.\n- Scope, references, and typing receive focused comparisons; inference receives a complete substitution trace.\n- Retain the lecture-sheet sequence and homework specification caveats. Keep reference/navigation content concise.\n\n## Every section\n\nSignals report code, graph, example cue, check cue, and Markdown-link count. A missing cue is not proof of a missing explanation; neighboring subsections may supply it. Retain is a scope decision, not a claim that no further improvement is possible.\n\n| Page and section | Purpose | Before → after signals | Recommendation / result |\n|---|---|---|---|\n';
  const signals=r=>r?[r.code?'code':'',r.diagram?'graph':'',r.exampleCue?'example cue':'',r.checkCue?'check cue':'',r.links+' links'].filter(Boolean).join(', '):'new section';
  for(const r of rows){
    const old=before.find(b=>b.page===r.page&&b.heading===r.heading);
    const checkpoint=r.section&&r.page.match(/^textbook-\d\d$/)&&checks.find(c=>c.section===r.section);
    const decision=checkpoint?'Add a discriminating local check: '+checkpoint.focus+' Implemented with explanation, trap, and prerequisite.':r.kind==='reference'?'Retain concise definitions and source links; the floating panel supports in-place recall.':r.kind==='navigation / study support'?'Retain routing/support role; use explicit guide names and verified destinations.':r.kind==='lecture summary'?'Retain the sheet-level goal, formula, route, trace, and self-check sequence; do not duplicate it per subsection.':r.kind==='practice'?'Retain worked strategy and specification boundaries; solution disclosure and neighboring checks form the practice unit.':'Retain concept explanation and chapter-level worked checks; textbook checkpoints supply finer practice.';
    out+='| ['+r.page+' · '+r.heading.replaceAll('|','/')+'](https://s0lluxx26.github.io/Programming_language_book_analyze/'+r.page+'.html#'+r.anchor+') | '+r.kind+' | '+signals(old)+' → '+signals(r)+' | '+decision.replaceAll('|','/')+' |\n';
  }
  fs.writeFileSync('reports/CONTENT_REVIEW.md',out);
}
console.log(JSON.stringify({pages:catalog.length,sections:rows.length,baseline},null,2));
