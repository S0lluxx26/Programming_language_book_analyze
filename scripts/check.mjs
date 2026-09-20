import {chapterSheets} from './chapter-cheatsheets.mjs';
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {thinkingRoutes} from './thinking-routes.mjs';
import {checkpoints} from './section-checkpoints.mjs';
import {lectures,syntax,walkthroughs,lectureSlug} from './learning-aids.mjs';
const catalog=JSON.parse(fs.readFileSync('book/catalog.json','utf8'));
const notation=JSON.parse(fs.readFileSync('book/notation-panel.json','utf8'));
assert.equal(new Set(notation.map(n=>n.id)).size,notation.length);
for(const n of notation){assert(syntax.some(s=>s.id===n.syntax),'Missing panel source '+n.syntax);assert(n.terms.length&&n.meaning&&n.example,'Incomplete panel entry '+n.id);}
for(const id of ['mapping','cons','append','recursive','fold'])assert(notation.some(n=>n.id===id),'Required notation '+id);
const manifest=JSON.parse(fs.readFileSync('sources/manifest.json','utf8'));
const sources=new Map(manifest.files.map(f=>[f.url,f]));
let links=0,pdfLinks=0,definitionLinks=0;
for(const page of catalog){
  const file=`dist/${page.slug}.html`,html=fs.readFileSync(file,'utf8');
  assert.equal((html.match(/<h1\b/g)||[]).length,1,`${file}: one h1`);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,new Set(ids).size,`${file}: duplicate ids`);
  assert(html.includes('name="description"')&&html.includes('property="og:description"'),`${file}: metadata`);
  for(const image of html.matchAll(/<img\b[^>]*>/g))assert(/width="[\d.]+" height="[\d.]+"/.test(image[0]),`${file}: diagram must reserve its layout size`);
  definitionLinks+=(html.match(/class="definition-link"/g)||[]).length;
  for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
    const url=match[1].replaceAll('&amp;','&');links++;
    if(/^https?:/.test(url)){
      if(url.includes('.pdf#page=')){
        const parsed=new URL(url),record=sources.get(parsed.origin+parsed.pathname);
        assert(record?.status===200,`${file}: cited unavailable PDF ${url}`);
        const p=Number(parsed.hash.replace('#page=',''));assert(p>=1&&p<=record.pages,`${file}: PDF page out of bounds ${url}`);pdfLinks++;
      }continue;
    }
    if(url.startsWith('mailto:'))continue;
    const [name,fragment]=url.split('#');const target=name?path.resolve('dist',name):path.resolve(file);
    assert(fs.existsSync(target),`${file}: missing target ${url}`);
    if(fragment&&target.endsWith('.html'))assert(fs.readFileSync(target,'utf8').includes(`id="${fragment}"`),`${file}: missing anchor ${url}`);
  }
}
const diagrams=JSON.parse(fs.readFileSync('dist/assets/diagrams/manifest.json','utf8'));
for(const d of diagrams){const svg=fs.readFileSync(`dist/assets/diagrams/${d.name}.svg`,'utf8');assert(svg.includes('<svg')&&!svg.includes('Syntax error'),d.name);assert(d.source.includes('accTitle:'),`${d.name}: accessible diagram title`);}
assert(diagrams.length>=25,'Expected diagrams throughout the book');
assert(definitionLinks>=100,'Expected linked definitions throughout the book');
assert.equal((fs.readFileSync('book/hw1.md','utf8').match(/^## P\d+/gm)||[]).length,15);
const structure=JSON.parse(fs.readFileSync('book/textbook-structure.json','utf8'));
assert.equal(catalog.filter(p=>p.textbook && p.slug!=='textbook-02-problems').length,9);
assert.equal(structure.sections.length,48);
assert.deepEqual(checkpoints.map(c=>c.section),structure.sections.map(s=>s.section),'One ordered checkpoint per source section');
for(const checkpoint of checkpoints){
  assert(checkpoint.focus&&checkpoint.question&&checkpoint.answer&&checkpoint.trap&&checkpoint.prerequisite,'Incomplete checkpoint '+checkpoint.section);
  const section=structure.sections.find(s=>s.section===checkpoint.section);
  const html=fs.readFileSync('dist/'+section.slug+'.html','utf8');
  assert.equal(html.split('data-checkpoint="'+checkpoint.section+'"').length-1,1,'Missing or duplicate checkpoint '+checkpoint.section);
}
for(const section of structure.sections){
  const markdown=fs.readFileSync(`book/${section.slug}.md`,'utf8');
  assert(markdown.includes(`## ${section.section} `),`Missing textbook section ${section.section}`);
  assert(markdown.includes(`#page=${section.page})`),`Missing source page for ${section.section}`);
}
const exercises=fs.readFileSync('book/textbook-02-problems.md','utf8');
const templates=JSON.parse(fs.readFileSync('sources/professor-templates.json','utf8'));
assert.equal(templates.files.length,18,'Expected all 18 official OCaml starter files');
assert.equal(thinkingRoutes.filter(r=>r.page==='hw1').length,15,'Every HW1 problem needs numbered thinking steps');
assert.equal(thinkingRoutes.filter(r=>r.page==='textbook-02-problems').length,12,'Every textbook exercise needs numbered thinking steps');
for(const route of thinkingRoutes){
  const html=fs.readFileSync(`dist/${route.page}.html`,'utf8');
  assert(route.steps.length>=3,`${route.heading}: incomplete reasoning route`);
  for(const [title] of route.steps)assert(html.replace(/<[^>]*>/g,'').includes(`${title}.`),`${route.heading}: missing rendered step ${title}`);
  if(route.template)assert(templates.files.some(f=>f.path===route.template)&&html.includes(`/blob/${templates.commit}/${route.template}`),`${route.heading}: unverified template link`);
}
for(const p of structure.problems){
  const body=exercises.split(`## Problem ${p.number} —`)[1]?.split('\n## ')[0];
  assert(body?.includes('```mermaid'),`Problem ${p.number}: missing diagram`);
  assert(body.includes('worked-solution'),`Problem ${p.number}: missing solution`);
  assert(body.includes(`#page=${p.page})`),`Problem ${p.number}: missing PDF page`);
}
assert.equal(catalog.length,58);
assert.deepEqual(lectures.map(l=>l.n),Array.from({length:21},(_,i)=>i));
assert.equal(new Set(syntax.map(s=>s.id)).size,syntax.length);
for(const l of lectures){
  const html=fs.readFileSync('dist/'+lectureSlug(l.n)+'.html','utf8');
  for(const heading of ['The whole picture','Focus points','Formula and syntax','Problem-solving route','Worked trace','Homework connection','Check your understanding'])assert(html.includes(heading),'Lecture '+l.n+': '+heading);
  assert(l.steps.length>=4 && l.pages.length>=3,'Incomplete lecture '+l.n);
  assert(html.includes('mermaid-figure') && html.includes('Reveal the explanation'),'Missing lecture diagram or answer');
  for(const id of l.syntax)assert(syntax.some(s=>s.id===id),'Unknown syntax '+id);
}
assert.deepEqual(walkthroughs.map(w=>w.chapter),[1,2,3,4,5,6,7,8,9]);
for(const w of walkthroughs){
  const html=fs.readFileSync('dist/textbook-'+String(w.chapter).padStart(2,'0')+'.html','utf8');
  assert(html.includes('class="code-walkthrough"'),'Missing walkthrough '+w.chapter);
  assert.equal((html.match(/class="code-line"/g)||[]).length,w.lines.length,'Missing code explanation');
  assert(w.lines.every(([code,note])=>code&&note),'Unexplained code line');
}
assert.deepEqual(chapterSheets.map(s=>s.chapter),[1,2,3,4,5,6,7,8,9]);
for(const sheet of chapterSheets){
 const html=fs.readFileSync(`dist/textbook-${String(sheet.chapter).padStart(2,"0")}.html`,"utf8");
 assert(html.includes(`id="chapter-cheat-sheet"`),"Missing chapter cheat sheet");
 assert(sheet.terms.length>=5 && sheet.steps.length>=4 && sheet.meaning && sheet.formula && sheet.example && sheet.trap,"Incomplete chapter cheat sheet");
}
const report={chapterCheatSheets:chapterSheets.length,sectionCheckpoints:checkpoints.length,floatingDefinitions:notation.length,lectureCheatSheets:lectures.length,syntaxEntries:syntax.length,annotatedChapters:walkthroughs.length,chapters:catalog.length,mermaidDiagrams:diagrams.length,definitions:JSON.parse(fs.readFileSync('book/definitions.json','utf8')).length,definitionLinks,linksChecked:links,pdfPageLinksChecked:pdfLinks,homework1Problems:15,textbookChapters:9,textbookSections:structure.sections.length,textbookNumberedProblems:structure.problems.length,numberedThinkingRoutes:thinkingRoutes.length,officialStarterFiles:templates.files.length};
console.log(JSON.stringify(report,null,2));
fs.mkdirSync('tmp/qa',{recursive:true});fs.writeFileSync('tmp/qa/static-report.json',JSON.stringify(report,null,2));
