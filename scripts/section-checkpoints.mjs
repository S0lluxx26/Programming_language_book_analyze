import {chapterCheatSheet} from './chapter-cheatsheets.mjs';
import fs from 'node:fs';
export const checkpoints=JSON.parse(fs.readFileSync('book/section-checkpoints.json','utf8'));
const bridges=[
 ['Rules → data → proofs','Start with a finite rule set. The same constructors will later become OCaml cases and proof cases.','syntax.html#rule','Read premises and conclusions'],
 ['Data definitions → OCaml programs','Use Chapter 1’s constructor cases to choose patterns, recursive calls, and induction hypotheses. A function should explain how the smaller answer is combined.','textbook-01.html#1-3-inductive-proof','Structural induction'],
 ['OCaml programs → an interpreter','Now OCaml processes a separate language’s syntax tree. Carry an environment to give variable names meaning; do not confuse constructing an AST with running it.','textbook-02.html#2-2-recursive-functions','Recursive functions'],
 ['Environments → closures','The new question is which environment survives when a function is passed or returned. Keep the caller context and the saved definition context separate.','textbook-03.html#3-2-1-environment','Environment lookup'],
 ['One feature → a complete functional language','Reuse the same evaluation method across more constructors. New value shapes and output make shape checks and evaluation order important.','textbook-04.html#4-2-1-static-scope','Static scope'],
 ['Bindings → changing cells','A name’s binding and its current contents now live in separate maps. Extend the evaluator result from a value to a value plus updated memory.','textbook-04.html#4-2-1-static-scope','Closures and saved environments'],
 ['Cells → a reachable heap graph','Records, pointers, and closures create paths between cells. Trace those paths to distinguish sharing, assignment, and safe reclamation.','textbook-06.html#6-2-2-semantic-structure','Implicit-reference semantics'],
 ['Running a program → reasoning before execution','Walk the same kind of syntax tree, but carry types and equations instead of concrete values and mutable memory. An accepted type has a precise, limited safety claim.','textbook-04.html#4-1-syntactic-structure','Procedures and calls'],
 ['Environment-based meaning → substitution and encoding','Reduce a smaller core language by preserving binding during substitution. Fix the reduction strategy and data representation before comparing results.','textbook-04.html#4-2-semantic-structure','Free and bound variables']
];
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function addSectionCheckpoints(page,source){
  const chapter=page.match(/^textbook-(\d\d)$/);if(!chapter)return source;
  const n=Number(chapter[1]),bridge=bridges[n-1];
  const intro='<aside class="chapter-bridge"><strong>'+esc(bridge[0])+'</strong><p>'+esc(bridge[1])+'</p><a href="'+bridge[2]+'">Before this chapter: '+esc(bridge[3])+' →</a><p class="checkpoint-hint">At each section’s end, predict the answer before revealing the reasoning. These are original practice checks, separate from the textbook’s numbered exercises.</p></aside>\n\n';
  const chunks=source.split(/(?=^## )/m);
  for(let i=0;i<chunks.length;i++){
    const section=chunks[i].match(/^## (\d+(?:\.\d+)+)\s/)?.[1];if(!section)continue;
    const c=checkpoints.find(c=>c.section===section);if(!c)throw Error('Missing checkpoint '+section);
    chunks[i]=chunks[i].trimEnd()+'\n\n<aside class="section-checkpoint" data-checkpoint="'+section+'" aria-label="Checkpoint '+section+'"><p><strong>Predict · '+section+'</strong> '+esc(c.question)+'</p><details><summary>Reveal reasoning and common trap</summary><p>'+esc(c.answer)+'</p><p><strong>Common trap:</strong> '+esc(c.trap)+'</p><a href="'+c.prerequisite+'">Revisit the prerequisite →</a></details></aside>\n\n';
  }
  return intro+chapterCheatSheet(n)+chunks.join('');
}
