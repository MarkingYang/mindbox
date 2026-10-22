'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const commands={install:'npx skills add MarkingYang/mindbox -g',list:'npx skills list -g',update:'npx skills update mindbox -g',remove:'npx skills remove mindbox -g','hero-install':'npx skills add MarkingYang/mindbox -g'};
function fixture(html){
 const nodes=new Map();for(const [,id,text]of html.matchAll(/<code id="([^"]+)">([^<]+)<\/code>/g))nodes.set(id,{textContent:text,innerText:text});
 for(const [,id]of html.matchAll(/<button id="([^"]+)"/g))nodes.set(id,{addEventListener(event,fn){this[event]=fn;}});
 return nodes;
}
test('homepage lifecycle buttons copy exactly the visible actionable command and offer a selection fallback',async()=>{
 const html=fs.readFileSync(path.join(root,'src/index.html'),'utf8'),app=fs.readFileSync(path.join(root,'src/app.js'),'utf8'),nodes=fixture(html),copied=[],notices=[];let selected;
 const block=app.slice(app.indexOf('  for(const [action,label]'),app.indexOf("  $('copy-skill-prompt')"));
 const context={$:id=>{assert.ok(nodes.has(id),'Missing command/button '+id);return nodes.get(id);},navigator:{clipboard:{async writeText(text){copied.push(text);}}},notify:text=>notices.push(text),window:{getSelection:()=>({removeAllRanges(){},addRange(){}})},document:{createRange:()=>({selectNodeContents(node){selected=node;}})}};
 vm.runInNewContext(block,context);
 for(const [action,expected]of Object.entries(commands)){
  assert.equal(nodes.get(action+'-command').textContent,expected);await nodes.get('copy-'+action+'-command').click();assert.equal(copied.at(-1),expected);
 }
 context.navigator.clipboard.writeText=async()=>{throw Error('HTTP clipboard unavailable');};await nodes.get('copy-update-command').click();
 assert.equal(selected,nodes.get('update-command'));assert.match(notices.at(-1),/手动复制/);
});
test('first-use tutorial copies the same install and management commands',async()=>{
 const html=fs.readFileSync(path.join(root,'src/site-public/quickstart.html'),'utf8'),nodes=fixture(html),buttons=[],copied=[];
 for(const [,id]of html.matchAll(/<button[^>]+data-copy="([^"]+)"/g))buttons.push({dataset:{copy:id},addEventListener(event,fn){this[event]=fn;}});
 nodes.set('prompt',{innerText:'first map prompt'});nodes.set('copy-status',{textContent:''});
 vm.runInNewContext(html.match(/<script>([\s\S]*?)<\/script>/)[1],{document:{querySelectorAll:()=>buttons,getElementById:id=>nodes.get(id)},navigator:{clipboard:{async writeText(text){copied.push(text);}}}});
 for(const button of buttons){await button.click();assert.equal(copied.at(-1),commands[button.dataset.copy]||'first map prompt');}
});
