// Supporting pages are alternate explanations of the main textbook route.
export const supportingGuides = [
  ['setup','OCaml practice','Run a small OCaml program, then return to the chapter exercise.','textbook-02.html#depth-2-1','§2.1 · OCaml basics','pl-book-eng.pdf',34],
  ['01-induction','Focused explanation','Connect constructors, recursive functions, and a proof about the same tree.','textbook-01.html#depth-1-3','§1.3 · Structural proof','pl-book-eng.pdf',28],
  ['02-ocaml','Focused explanation','Read the type and data shape before choosing OCaml syntax.','textbook-02.html#depth-2-1','§2.1 · Types, patterns, and modules','pl-book-eng.pdf',34],
  ['03-recursion','Focused explanation','Choose a decreasing input and explain what the accumulator or fold means.','textbook-02.html#depth-2-3','§§2.2–2.3 · Recursion and folds','pl-book-eng.pdf',70],
  ['04-expressions','Focused explanation','Translate each semantic premise into one explicit evaluator step.','textbook-03.html#depth-3-2-2','§3.2.2 · Full evaluation derivation','pl-book-eng.pdf',107],
  ['05-closures','Focused explanation','Separate the caller environment from the environment saved by a procedure.','textbook-04.html#depth-4-2-1','§4.2.1 · Lexical closures','pl-book-eng.pdf',129],
  ['06-scope-recursion','Core topic and lecture extension','Rebuild recursive bindings; use lexical addresses as the Lecture 7 extension.','textbook-05.html#depth-5-3','§5.3 · Mutual recursion','pl-book-eng.pdf',154],
  ['07-state','Focused explanation','Track the value and the latest store separately at each step.','textbook-06.html#depth-6-2-3','§6.2.3 · Value, reference, and lazy calls','pl-book-eng.pdf',183],
  ['08-records','Focused explanation','Draw variable cells, field cells, and reachable heap edges at distinct levels.','textbook-07.html#depth-7-3-2','§7.3.2 · Complete reachability trace','pl-book-eng.pdf',216],
  ['09-exceptions','Lecture extension · 10','Extend the evaluator with pending work and dynamically active handlers. This topic has no standalone chapter in the English PDF.','textbook-06.html#lecture-10','Chapter 6 · Integrated exception practice','slides/lec10.pdf',9],
  ['10-objects','Lecture extension · 11','Build on stores and records to explain receiver identity and method lookup. This topic has no standalone chapter in the English PDF.','textbook-07.html#lecture-11','Chapter 7 · Integrated object practice','slides/lec11.pdf',18],
  ['11-types','Focused explanation','Read a typing judgment and state exactly which errors its rules rule out.','textbook-08.html#depth-8-4','§8.4 · Typing and recursive bindings','pl-book-eng.pdf',232],
  ['12-inference','Focused explanation','Generate equations, solve them, and apply the complete substitution.','textbook-08.html#depth-8-5','§§8.5–8.6 · Equation generation and solving','pl-book-eng.pdf',256],
  ['13-polymorphism','Focused explanation','Separate a shared unknown from the variables that a scheme may instantiate freshly.','textbook-08.html#depth-8-7','§8.7 · Polymorphic types','pl-book-eng.pdf',271],
  ['14-subtyping','Lecture extension · 19','Check directional compatibility between class and function types. This extends Chapter 8; it is not a rule of the HW4 language.','textbook-08.html#lecture-19','Chapter 8 · Integrated subtyping practice','slides/lec19.pdf',8],
  ['15-lambda','Focused explanation','Preserve binding during substitution and choose a reduction strategy deliberately.','textbook-09.html#depth-9-1','§9.1 · Substitution and reduction','pl-book-eng.pdf',281],
  ['homework-map','Practice map','Start with a textbook definition, then check the separately numbered assignment contract.','textbook.html#chapter-by-chapter-reading-guide','All nine chapters · Reading guide','pl-book-eng.pdf',7],
  ['hw1','Assignment guide','Apply Chapter 2 techniques to 15 homework problems. Textbook §2.4 has 12 different problem numbers.','textbook-02-problems.html','§2.4 · Textbook problems and interfaces','hw/hw1.pdf',1],
  ['hw2','Assignment guide','Reuse the environment and closure reasoning from Chapters 3–5, then apply ML− rules, especially its narrower equality.','textbook-05.html#depth-5-2','§5.2 · Compare Fun operation contracts','hw/hw2.pdf',3],
  ['hw3','Assignment guide','Reuse Chapter 6 store threading and Chapter 7 record reasoning, while preserving B’s own AST and procedure model.','textbook-06.html#depth-6-3','§6.3 · Allocation and memory discipline','hw/hw3.pdf',2],
  ['hw4','Assignment guide','Transfer Chapter 8’s inference method to ML− under the explicitly stated baseline below.','textbook-08.html#8-8-implementation','§8.8 · Implementation and its limits','hw/hw4.pdf',2],
  ['syntax','Symbol reference','Identify the language and the role of a symbol, then follow its definition into the textbook.','textbook.html#chapter-cheat-sheets','Chapter cheat sheets','pl-book-eng.pdf',102],
  ['glossary','Definition reference','Use a short definition first, then open its textbook context or focused explanation.','textbook.html#chapter-by-chapter-reading-guide','Chapter reading guide','pl-book-eng.pdf',7],
  ['sources','Source library','Find the authoritative PDF and distinguish textbook content, lecture extensions, and assignment requirements.','textbook.html','Textbook · Complete contents','pl-book-eng.pdf',7]
].map(([page,kind,purpose,target,label,source,pdfPage])=>({page,kind,purpose,target,label,source,pdfPage}));

export function supportingBridge(page) {
  const entry=supportingGuides.find(e=>e.page===page);
  if(!entry)return '';
  return `<aside class="study-bridge" aria-label="Textbook connection">\n\n**${entry.kind}** · ${entry.purpose}\n\n[${entry.label}](${entry.target}) · [Source PDF, p. ${entry.pdfPage}](https://prl.korea.ac.kr/courses/cose212/2026/${entry.source}#page=${entry.pdfPage})\n\n</aside>\n\n`;
}
