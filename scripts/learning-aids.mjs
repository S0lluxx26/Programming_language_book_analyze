import fs from 'node:fs';
import {addSectionCheckpoints} from './section-checkpoints.mjs';
export const lectures=JSON.parse(fs.readFileSync('book/lecture-guides.json','utf8'));
export const syntax=JSON.parse(fs.readFileSync('book/syntax-reference.json','utf8'));
export const walkthroughs=JSON.parse(fs.readFileSync('book/code-walkthroughs.json','utf8'));
const defs=JSON.parse(fs.readFileSync('book/definitions.json','utf8'));
const base='https://prl.korea.ac.kr/courses/cose212/2026/';
const tick=String.fromCharCode(96),fence=tick.repeat(3);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const lectureSlug=n=>'lecture-'+String(n).padStart(2,'0');
const textSlug=n=>'textbook-'+String(n).padStart(2,'0');
const syntaxLink=id=>{const s=syntax.find(s=>s.id===id);if(!s)throw Error('Unknown syntax '+id);return '['+s.label+'](syntax.html#'+id+')';};
export function addLearningAids(page,source){
  const match=page.match(/^textbook-(\d\d)$/);
  if(!match)return source;
  const chapter=Number(match[1]),w=walkthroughs.find(w=>w.chapter===chapter);
  const related=lectures.filter(l=>l.chapter===chapter);
  const links=(chapter===5?lectures.filter(l=>[3,4,6].includes(l.n)):related).map(l=>'[Lecture '+l.n+']('+lectureSlug(l.n)+'.html)').join(' · ');
  const aid='## Syntax and code companion\n\nUse the [syntax reference](syntax.html) to trace a symbol to its meaning and source. '+(links?'Related cheat sheets: '+links+'.':'')+'\n\n'+w.syntax.map(syntaxLink).join(' · ')+'\n\n'+
    '<details class="code-walkthrough"><summary>Line-by-line code · '+esc(w.title)+'</summary><p class="code-kind">'+esc(w.kind)+'</p><div class="code-lines" role="list" aria-label="Code with line explanations">'+w.lines.map(([code,note],i)=>'<div class="code-line" role="listitem"><div class="code-cell"><span class="line-number" aria-label="Line '+(i+1)+'">'+(i+1)+'</span><code>'+esc(code)+'</code></div><p>'+esc(note)+'</p></div>').join('')+'</div><p class="code-result"><strong>Trace result:</strong> '+esc(w.result)+'</p></details>\n\n';
  return addSectionCheckpoints(page,aid+source);
}
export function generateLearningPages(){
  const checks={1:'assert (leaves (Fork (Leaf, Leaf)) = 2)',2:'assert (length [4;7;9] = 3); assert (length [] = 0)',4:'assert (result = 13)',5:'assert (map (fun n -> n + 1) [1;2] = [2;3])',6:'assert (result = 1)',7:'assert (observed = 7)',9:'assert (free "y" (Lam ("x", Var "y"))); assert (not (free "x" (Lam ("x", Var "x"))))'};
  const complete=walkthroughs.filter(w=>w.kind.startsWith('Complete'));
  const example='(* Generated from the exact displayed, complete chapter walkthroughs. Interpreter fragments are excluded. *)\n'+complete.map(w=>'module Chapter'+w.chapter+' = struct\n'+w.lines.map(([code])=>code).join('\n')+'\nlet () = '+checks[w.chapter]+'\nend\n').join('\n')+'\nlet () = print_endline "Seven chapter walkthroughs passed"\n';
  fs.writeFileSync('examples/reading_aids.ml',example);
  let index='## Choose your lecture\n\nEach sheet connects the lecture’s big picture, focus points, notation, numbered problem-solving route, worked trace, textbook reading, and homework. These are original revision notes, not replacements for the slides. Use **Print chapter** for a compact reference; a long lecture may need more than one printed page.\n\n[Open the syntax reference](syntax.html) · [Read the textbook](textbook.html) · [Homework map](homework-map.html)\n\n| Lecture | Focus | Textbook connection |\n|---|---|---|\n';
  for(const l of lectures){
    const slug=lectureSlug(l.n);
    index+='| ['+l.n+' · '+l.title+']('+slug+'.html) | '+l.focus+' | '+(l.chapter?'[Chapter '+l.chapter+']('+textSlug(l.chapter)+'.html)':'Dedicated slide topic')+' |\n';
    const related=l.chapter?'[Textbook chapter '+l.chapter+']('+textSlug(l.chapter)+'.html)':'[Companion explanation]('+l.reading+'.html). This topic has no standalone chapter in the supplied English textbook';
    let md='## The whole picture\n\n'+l.focus+'\n\n**Reading connection:** '+related+'.\n\n**Original lecture:** '+l.pages.map(p=>'[PDF p. '+p+']('+base+'slides/lec'+l.n+'.pdf#page='+p+')').join(' · ')+'. Page numbers here mean PDF positions.\n\n## Focus points\n\n'+l.points.map((p,i)=>(i+1)+'. '+p).join('\n')+'\n\n## Formula and syntax\n\n<div class="formula-card">'+esc(l.formula)+'</div>\n\nRead every symbol in context: '+l.syntax.map(syntaxLink).join(' · ')+'. The formula above is a companion restatement or example, not a verbatim slide transcription.\n\n## Problem-solving route\n\n'+l.steps.map((s,i)=>(i+1)+'. '+s+'.').join('\n')+'\n\n';
    md+=fence+'mermaid\n%%{init: {"flowchart": {"wrappingWidth": 600}}}%%\nflowchart TD\n  accTitle: Lecture '+l.n+' reasoning route\n  accDescr: Numbered stages for applying '+l.title.toLowerCase()+'.\n';
    l.steps.forEach((s,i)=>{md+='  N'+i+'["'+(i+1)+'. '+s.replaceAll('"',"'")+'"]\n';if(i)md+='  N'+(i-1)+' --> N'+i+'\n';});
    md+=fence+'\n\n## Worked trace\n\n'+l.example+'\n\n## Homework connection\n\n'+l.homework+'\n\n[Open the HW'+l.hw+' thinking guide](hw'+l.hw+'.html) · [Full concept-to-homework map](homework-map.html)\n\n## Check your understanding\n\n'+l.check+'\n\n<details class="worked-solution"><summary>Reveal the explanation</summary>\n\n'+l.answer+'\n\n</details>\n\n[All lecture cheat sheets](lectures.html) · [Syntax reference](syntax.html)\n';
    fs.writeFileSync('book/'+slug+'.md',md);
  }
  fs.writeFileSync('book/lectures.md',index);
  let ref='## How to use this reference\n\nClick a linked inline code token or a chapter’s syntax guide to arrive at its explanation. Each entry links to a definition, a precise source page, and its lecture cheat sheet. Use your browser’s Back command to return to the passage you were reading.\n\n**Three layers:** OCaml is the implementation language; Let, Proc, Fun, and B are course languages; judgments such as Γ ⊢ e : T are mathematical descriptions. The same punctuation can serve different roles. Whole code blocks remain readable code; expandable chapter examples put explanations beside each line.\n\n## Find a symbol\n\n'+syntax.map(s=>'['+s.label+'](#'+s.id+')').join(' · ')+'\n\n';
  for(const s of syntax){
    const d=defs.find(d=>d.id===s.definition);if(!d)throw Error('Unknown definition '+s.definition);
    ref+='<a id="'+s.id+'"></a>\n\n## '+s.label+'\n\n**Look for:** '+s.tokens.map(t=>tick+t+tick).join(', ')+'.\n\n'+s.meaning+'\n\n**Example:** '+s.example+'\n\n[Definition: '+d.term+'](glossary.html#'+d.id+') · [Lecture '+s.lecture+', PDF p. '+s.page+']('+base+'slides/lec'+s.lecture+'.pdf#page='+s.page+') · [Lecture cheat sheet]('+lectureSlug(s.lecture)+'.html) · [Definition source, PDF p. '+d.page+']('+base+(d.source||'pl-book-eng.pdf')+'#page='+d.page+')\n\n';
  }
  fs.writeFileSync('book/syntax.md',ref);
}
