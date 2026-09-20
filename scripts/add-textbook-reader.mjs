// One-time catalog/definition integration; safe to rerun without duplicating entries.
import fs from 'node:fs';
const read = p => JSON.parse(fs.readFileSync(p,'utf8'));
let catalog = read('book/catalog.json').filter(p=>!p.slug.startsWith('textbook'));
const chapters = [
  [1,'Induction',11,32,'Define sets and languages, then prove properties by following their construction rules.'],
  [2,'Functional Programming',33,96,'Read OCaml, derive recursion, and solve the twelve exercises in section 2.4.'],
  [3,'Variables and the Environment',97,117,'Follow the textbook from syntax and environments to an executable interpreter.'],
  [4,'Defining and Calling Functions',119,145,'Trace static and dynamic scope, build closures, and implement recursive procedures.'],
  [5,'Functional Language Fun',147,160,'Combine lists, mutually recursive closures, output, and sequencing into a complete language.'],
  [6,'State Changes',161,192,'Compare explicit and implicit references and solve both stateful interpreter tasks.'],
  [7,'Pointers and Memory Management',193,221,'Follow records and pointers, then solve all four evaluator and garbage-collector tasks.'],
  [8,'Static Type Systems',223,276,'Read typing rules, generate and solve equations, and implement the Fun extension.'],
  [9,'Lambda Calculus',277,292,'Understand substitution and normal order, then build a reducer and translators.']
];
const pages = [{slug:'textbook',title:'Textbook · Complete contents',part:'Read the textbook',tag:'The PDF, chapter by chapter',description:'Follow all nine chapters in the original section order, with linked definitions, Mermaid thinking flows, and worked problems.'}];
for(const [n,title,start,end,description] of chapters){
  pages.push({slug:`textbook-0${n}`,title:`${n}. ${title}`,part:'Read the textbook',tag:`Textbook chapter ${n} · PDF pp. ${start}–${end}`,description,textbook:{chapter:n,start,end}});
  if(n===2) pages.push({slug:'textbook-02-problems',title:'2.4 Problems · Worked solutions',part:'Read the textbook',tag:'Textbook §2.4 · Problems 1–12',description:'Derive each solution with a Mermaid thinking flow, worked OCaml code, and boundary checks.',textbook:{chapter:2,start:89,end:96}});
}
catalog.splice(1,0,...pages);
fs.writeFileSync('book/catalog.json',JSON.stringify(catalog,null,2)+'\n');
const defs=read('book/definitions.json');
const additions=[
  ['capture-avoiding-substitution','Capture-avoiding substitution',['capture-avoiding substitution'],'Replacing free occurrences of a name while renaming conflicting binders so that free variables in the replacement do not accidentally become bound.',282,'textbook-09.html','Textbook §9.3 reduce; HW1 binding analysis'],
  ['shadowing','Shadowing',['shadowing'],'A nearer binding with the same name hides an outer binding within its scope; extending an environment does not mutate the outer binding.',105,'textbook-03.html','Textbook §3.3 and §4.3; HW2 LET'],
  ['normal-form','Normal form',['normal form'],'A lambda term containing no beta-redex anywhere, including inside abstraction bodies.',282,'textbook-09.html','Textbook §9.3 reduce'],
  ['redex','Redex',['redex'],'A reducible lambda application whose function is an abstraction, of the form (lambda x. body) argument.',281,'textbook-09.html','Textbook §9.3 normal-order reduction']
];
for(const [id,term,aliases,meaning,page,chapter,homework] of additions) if(!defs.some(d=>d.id===id))defs.push({id,term,aliases,meaning,page,chapter,homework});
fs.writeFileSync('book/definitions.json',JSON.stringify(defs,null,2)+'\n');
const sections = [
  ['1.1',11],['1.2',22],['1.3',28],['2.1',34],['2.2',70],['2.3',81],['2.4',89],
  ['3.1',97],['3.2',102],['3.2.1',102],['3.2.2',106],['3.3',114],
  ['4.1',119],['4.2',123],['4.2.1',128],['4.2.2',134],['4.2.3',137],['4.3',143],
  ['5.1',147],['5.2',148],['5.3',156],['6.1',162],['6.1.1',163],['6.1.2',165],
  ['6.2',174],['6.2.1',174],['6.2.2',175],['6.2.3',183],['6.3',188],
  ['7.1',194],['7.2',201],['7.3',208],['7.3.1',210],['7.3.2',212],['7.4',219],
  ['8.1',225],['8.2',226],['8.3',230],['8.4',232],['8.5',243],['8.6',248],['8.6.1',248],['8.6.2',259],['8.7',271],['8.8',274],
  ['9.1',277],['9.2',285],['9.3',291]
].map(([section,page])=>({section,page,slug:`textbook-0${section[0]}`}));
fs.writeFileSync('book/textbook-structure.json',JSON.stringify({source:'pl-book-eng.pdf',sections,problems:[89,90,90,90,91,91,92,93,93,93,94,95].map((page,i)=>({number:i+1,page,slug:'textbook-02-problems'}))},null,2)+'\n');
console.log(`Integrated ${pages.length} reader pages and ${sections.length} textbook sections.`);
