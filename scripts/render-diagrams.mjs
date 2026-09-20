import fs from 'node:fs';
import crypto from 'node:crypto';
import {chromium} from 'playwright';
const diagrams=JSON.parse(fs.readFileSync('dist/assets/diagrams/manifest.json','utf8'));
const browser=await chromium.launch(process.env.CI?{headless:true}:{headless:true,channel:process.env.BOOK_BROWSER_CHANNEL||'chrome'});
const page=await browser.newPage({viewport:{width:1400,height:1000}});
await page.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>');
await page.addScriptTag({path:'node_modules/mermaid/dist/mermaid.min.js'});
await page.evaluate(()=>mermaid.initialize({startOnLoad:false,securityLevel:'strict',theme:'base',htmlLabels:false,fontFamily:'Arial, sans-serif',themeVariables:{primaryColor:'#edf4fb',primaryTextColor:'#172b43',primaryBorderColor:'#5384ad',lineColor:'#4776a3',secondaryColor:'#d7eafb',tertiaryColor:'#f5f8fc',fontSize:'17px'},flowchart:{htmlLabels:false,curve:'basis',nodeSpacing:35,rankSpacing:45,padding:20,useMaxWidth:true}}));
let rendered=0;
try {
  for(let i=0;i<diagrams.length;i++) {
    const d=diagrams[i],target=`dist/assets/diagrams/${d.name}.svg`;
    const hash=crypto.createHash('sha256').update(d.source+'theme-v3-intrinsic-size').digest('hex');
    if(fs.existsSync(target)&&fs.readFileSync(target,'utf8').includes(`source-sha256:${hash}`))continue;
    const svg=await page.evaluate(async ({source,id})=>{
      const result=await mermaid.render(id,source);
      const holder=document.createElement('div');holder.innerHTML=result.svg;
      const svg=holder.firstElementChild;const bounds=svg.getAttribute('viewBox').split(' ').map(Number);
      svg.setAttribute('width',String(bounds[2]));svg.setAttribute('height',String(bounds[3]));
      const serialized=new XMLSerializer().serializeToString(svg);
      if(new DOMParser().parseFromString(serialized,'image/svg+xml').querySelector('parsererror'))throw Error('Invalid standalone SVG XML');
      return serialized;
    },{source:d.source,id:`diagram${i}`});
    fs.writeFileSync(target,svg+`\n<!-- source-sha256:${hash} -->\n`);rendered++;
  }
} finally {await browser.close();}
console.log(`Verified ${diagrams.length} Mermaid diagrams; rendered ${rendered} SVGs.`);
