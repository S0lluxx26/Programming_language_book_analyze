import fs from 'node:fs';

// Supplements live beside the authored chapters, but are inserted into their
// matching numbered sections so the book has one reading path.
export const textbookDepth = Array.from({length:9},(_,i)=> {
  const page='textbook-'+String(i+1).padStart(2,'0');
  const source=fs.readFileSync('book/supplements/'+page+'.md','utf8');
  return [...source.matchAll(/^## (\d+(?:\.\d+)+) (.+)\r?\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)]
    .map(([,section,title,body])=>({page,section,title,body:body.trim(),id:'depth-'+section.replaceAll('.','-')}));
}).flat();

const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function addTextbookDepth(page,source){
  const entries=textbookDepth.filter(s=>s.page===page);
  const placed=new Set();
  const result=source.split(/(?=^## )/m).map(chunk=>{
    const section=chunk.match(/^## (\d+(?:\.\d+)+)\s/)?.[1];
    const entry=entries.find(s=>s.section===section);
    if(!entry)return chunk;
    placed.add(section);
    return chunk.trimEnd()+'\n\n<details class="textbook-depth" id="'+entry.id+'" data-depth="'+section+'">\n<summary>Step by step · '+escape(entry.title)+'</summary>\n\n'+entry.body+'\n\n</details>\n\n';
  }).join('');
  if(placed.size!==entries.length)throw Error('Unplaced or duplicate textbook supplement: '+page);
  return result;
}
