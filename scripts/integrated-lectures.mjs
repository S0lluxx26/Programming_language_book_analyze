import fs from 'node:fs';
export const lecturePlacements = JSON.parse(fs.readFileSync('book/lecture-integration.json', 'utf8'));
const lectures = JSON.parse(fs.readFileSync('book/lecture-guides.json', 'utf8'));
const syntax = JSON.parse(fs.readFileSync('book/syntax-reference.json', 'utf8'));
const base = 'https://prl.korea.ac.kr/courses/cose212/2026/';
const fence = String.fromCharCode(96).repeat(3);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const lectureTarget = n => {
  const p = lecturePlacements.find(p => p.lecture === n);
  if (!p) throw Error('Unmapped lecture '+n);
  return 'textbook-'+String(p.chapter).padStart(2,'0')+'.html#lecture-'+String(n).padStart(2,'0');
};
function practice(p) {
  const l = lectures.find(l => l.n === p.lecture);
  const id = 'lecture-'+String(l.n).padStart(2,'0');
  let md = '\n<h3 class="lecture-heading" id="'+id+'" data-lecture="'+l.n+'">'+esc(p.title)+' <small>Lecture '+l.n+'</small></h3>\n\n';
  md += p.points.map(i => '- '+l.points[i]).join('\n')+'\n\n';
  md += '<p class="lecture-sources">Source slides: '+l.pages.map(n => '<a href="'+base+'slides/lec'+l.n+'.pdf#page='+n+'">p. '+n+'</a>').join(' · ')+'</p>\n\n';
  md += '<details class="lecture-practice"><summary>Practice with Lecture '+l.n+' · example, thinking flow, and self-check</summary>\n\n';
  md += '**Rule in context:** '+l.formula+'\n\n';
  md += l.syntax.map(id => '['+syntax.find(s => s.id===id).label+'](syntax.html#'+id+')').join(' · ')+'\n\n';
  md += '**Worked example:** '+l.example+'\n\n**Thinking steps:**\n\n'+l.steps.map((s,i) => (i+1)+'. '+s+'.').join('\n')+'\n\n';
  md += fence+'mermaid\n%%{init: {"flowchart": {"wrappingWidth": 600}}}%%\nflowchart TD\n  accTitle: Lecture '+l.n+' reasoning route\n  accDescr: Numbered stages for applying '+l.title.toLowerCase()+'.\n';
  l.steps.forEach((s,i) => {md+='  N'+i+'["'+(i+1)+'. '+s.replaceAll('"',"'")+'"]\n';if(i)md+='  N'+(i-1)+' --> N'+i+'\n';});
  md += fence+'\n\n**Homework connection:** '+l.homework+'\n\n[HW'+l.hw+' thinking guide](hw'+l.hw+'.html) · [Full homework map](homework-map.html)\n\n';
  md += '**Try it:** '+l.check+'\n\n<details class="worked-solution"><summary>Reveal the explanation</summary>\n\n'+l.answer+'\n\n</details>\n\n</details>\n\n';
  return md;
}
export function integrateLectures(page, source) {
  const match = page.match(/^textbook-(\d\d)$/);
  if (!match) return source;
  const chapter = Number(match[1]), placements = lecturePlacements.filter(p => p.chapter===chapter);
  const chunks = source.split(/(?=^## )/m);
  for (const p of placements.filter(p => p.section)) {
    const index = chunks.findIndex(chunk => p.section==='Before you begin' ? chunk.startsWith('## Before you begin') : chunk.startsWith('## '+p.section+' '));
    if (index<0) throw Error('Missing destination for lecture '+p.lecture);
    chunks[index] = chunks[index].trimEnd()+'\n\n'+practice(p);
  }
  let result = chunks.join('');
  for (const p of placements.filter(p => !p.section)) {
    const l = lectures.find(l => l.n===p.lecture);
    result+='\n## Lecture extension: '+p.title+'\n\nThis slide topic extends the chapter’s model; it is not a numbered section of the supplied textbook. '+l.focus+'\n\n'+practice(p);
    if (l.reading) result+='[Continue with the detailed companion explanation]('+l.reading+'.html).\n\n';
  }
  const first = source.match(/^## (\d+(?:\.\d+)+) (.+)$/m);
  const sectionAnchor = first ? (first[1]+' '+first[2]).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') : 'before-you-begin';
  const nav = '<nav class="chapter-route" aria-label="Chapter reading route"><strong>Read this chapter</strong><a href="#chapter-cheat-sheet">1. Cheat sheet</a><a href="#'+sectionAnchor+'">2. Detailed sections</a><a href="#syntax-and-code-companion">3. Code walkthrough</a><a href="textbook.html#lecture-to-chapter-map">Lecture map</a></nav>\n\n';
  const links = placements.map(p => '- [L'+p.lecture+' · '+p.title+'](#lecture-'+String(p.lecture).padStart(2,'0')+')').join('\n');
  return nav+(links?'<details class="lecture-index"><summary>Find lecture practice in this chapter ('+placements.length+')</summary>\n\n'+links+'\n\nExpand a practice panel for its example, Mermaid flow, and self-check.\n\n</details>\n\n':'')+result;
}
export function lectureMap() {
  return '\n## Lecture-to-chapter map\n\nThe lectures are woven into the textbook sections below. The four lecture extensions are labeled explicitly; the original nine chapters and 48 section numbers remain intact.\n\n| Lecture | Read and practice here | Placement |\n|---|---|---|\n'+lecturePlacements.map(p => {
    const l=lectures.find(l=>l.n===p.lecture);
    return '| L'+l.n+' · '+l.title+' | [Chapter '+p.chapter+' · '+p.title+']('+lectureTarget(l.n)+') | '+(p.section ? (p.section==='Before you begin'?'Orientation':'§'+p.section) : 'Lecture extension')+' |';
  }).join('\n')+'\n';
}
export function writeLectureRedirects() {
  const redirects = [['lectures','textbook.html#lecture-to-chapter-map'], ...lectures.map(l => ['lecture-'+String(l.n).padStart(2,'0'),lectureTarget(l.n)])];
  for (const [slug,target] of redirects) {
    fs.writeFileSync('dist/'+slug+'.html','<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url='+target+'"><link rel="canonical" href="'+target+'"><title>Continue in the textbook</title></head><body><p>This lecture is now part of the textbook. <a href="'+target+'">Continue to the merged material</a>.</p></body></html>');
  }
}
