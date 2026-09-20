import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {thinkingRoutes} from './thinking-routes.mjs';
const catalog=JSON.parse(fs.readFileSync('book/catalog.json','utf8'));
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
assert.equal(catalog.length,35);
const report={chapters:catalog.length,mermaidDiagrams:diagrams.length,definitions:JSON.parse(fs.readFileSync('book/definitions.json','utf8')).length,definitionLinks,linksChecked:links,pdfPageLinksChecked:pdfLinks,homework1Problems:15,textbookChapters:9,textbookSections:structure.sections.length,textbookNumberedProblems:structure.problems.length,numberedThinkingRoutes:thinkingRoutes.length,officialStarterFiles:templates.files.length};
console.log(JSON.stringify(report,null,2));
fs.mkdirSync('tmp/qa',{recursive:true});fs.writeFileSync('tmp/qa/static-report.json',JSON.stringify(report,null,2));
