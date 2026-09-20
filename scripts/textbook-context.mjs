import fs from 'node:fs';
import {lectureTarget} from './integrated-lectures.mjs';

const groups = {
  '1.1':['inductive-definition','inference-rule'],
  '1.2':['abstract-syntax-tree','semantics'],
  '1.3':['structural-induction'],
  '2.1':['pattern-matching'],
  '2.2':['structural-recursion','tail-recursion'],
  '2.3':['higher-order-function'],
  '3.2.1':['environment','shadowing'],
  '4.1':['syntactic-sugar'],
  '4.2':['free-variable'],
  '4.2.1':['lexical-scope','closure'],
  '4.2.2':['dynamic-scope'],
  '6.1.2':['store'],
  '6.2.3':['call-by-value','call-by-reference'],
  '7.1':['record'],
  '7.3.2':['reachability','garbage-collection'],
  '8.2':['type'],
  '8.3':['type-environment'],
  '8.4':['typing-judgment','soundness'],
  '8.6.1':['type-variable'],
  '8.6.2':['unification','occurs-check','substitution'],
  '8.7':['let-polymorphism','type-scheme'],
  '9.1':['lambda-calculus','beta-reduction','alpha-renaming','normal-order','capture-avoiding-substitution','normal-form','redex']
};
const contexts=new Map();
for(const [section,ids] of Object.entries(groups)){
  const page='textbook-'+section.split('.')[0].padStart(2,'0');
  const heading=fs.readFileSync('book/'+page+'.md','utf8').split(/\r?\n/).find(l=>l.startsWith('## '+section+' '));
  if(!heading)throw Error('Missing definition context '+section);
  const anchor=heading.slice(3).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  for(const id of ids)contexts.set(id,{url:page+'.html#'+anchor,label:'Textbook §'+section});
}
for(const [id,n] of [['continuation',10],['dynamic-dispatch',11],['subtyping',19]])contexts.set(id,{url:lectureTarget(n),label:'Integrated lecture '+n+' extension'});
export function textbookContext(id){
  const context=contexts.get(id);
  if(!context)throw Error('Missing textbook context for '+id);
  return context;
}
export function textbookContextLink(id){
  const c=textbookContext(id);
  return '['+c.label+']('+c.url+')';
}
