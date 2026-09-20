import fs from 'node:fs';
export const thinkingRoutes=JSON.parse(fs.readFileSync('book/thinking-routes.json','utf8'));
const snapshot=JSON.parse(fs.readFileSync('sources/professor-templates.json','utf8'));
const sourceBase=`https://github.com/kupl-courses/COSE212-2026fall/blob/${snapshot.commit}/`;
const membership=`flowchart TD
  accTitle: HW1 P9 - numbered reasoning for tree membership
  accDescr: Match Empty or Node, test the node value, then search the children with logical OR. No binary-search-tree ordering is assumed.
  A["1. Match Empty or Node"] --> B{"2. Empty?"}
  B -->|Yes| F["Return false"]
  B -->|No| C{"3. Node value equals target?"}
  C -->|Yes| T["Return true"]
  C -->|No| D["4a. Search left child"]
  D --> E{"Found on left?"}
  E -->|Yes| T
  E -->|No| G["4b. Search right child"]
  G --> H["5. Return the OR result"]`;
export function addThinkingRoutes(page,source){
  for(const route of thinkingRoutes.filter(r=>r.page===page)){
    const heading=`## ${route.heading}`;
    if(!source.includes(heading+'\n')&&!source.includes(heading+'\r\n'))throw Error(`Missing thinking-route heading ${page}: ${route.heading}`);
    let content='\n\n<div class="thinking-route">\n\n**Thinking steps**\n\n';
    if(route.template)content+=`**Official starter:** [\`${route.template}\`](${sourceBase+route.template}) · Interface: \`${route.signature}\`.\n\n`;
    content+=route.steps.map(([title,body],i)=>`${i+1}. **${title}.** ${body}`).join('\n')+'\n\n</div>\n';
    if(route.diagram){
      const graph=route.diagram==='tree-membership'?membership:
        'flowchart TD\n  accTitle: '+page.toUpperCase()+' '+route.heading+' - numbered reasoning plan\n  accDescr: Follow the numbered reasoning stages; conditional stopping cases are explained in the matching list.\n'+route.steps.map(([title],i)=>`  S${i+1}["${i+1}. ${title}"]`).join('\n')+'\n'+route.steps.slice(1).map((_,i)=>`  S${i+1} --> S${i+2}`).join('\n');
      content+='\n```mermaid\n'+graph+'\n```\n';
    }
    source=source.replace(heading,heading+content);
  }
  return source;
}
