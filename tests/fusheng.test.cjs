'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const K=require('../src/engine.cjs'),L=K.library,R=require('../src/render.cjs'),F=require('../src/fusheng.cjs');
const Names=require('../skills/mindbox/scripts/style-names.cjs'),{SaxesParser}=require('saxes');
const source=['```mermaid','mindmap','  root((AI时代，照顾好自己))',...Array.from({length:8},(_,i)=>['    第'+i+'个角度','      多行内容也要保留完整的文字与层级','        向前再试一步','          一个很小的行动'].join('\n')),'```'].join('\n');
function svg(recipe){const t=L.themeFor(recipe),g=K.layoutTree(K.parseMindmap(source),recipe.tokens.L.id,new Set(),Infinity,t.density);return{t,g,art:R.svgContent(g,t,recipe.tokens.L.id,new Set(),false)};}
test('浮生小趣 keeps permanent identity and old imports while adopting the approved palette',()=>{
 const r=L.resolveRecipe('MMH0S8');assert.equal(r.preset.id,'P68');assert.equal(r.preset.name,'浮生小趣');
 assert.equal(r.code,'L01-N16-E09-C45-B42-T13-D03');
 for(const name of ['浮生小趣','粉笔夜谈','P68','MMH0S8'])assert.equal(L.resolveRecipe(name).code,r.code);
 for(const name of ['浮生','小趣','灰驴','粉笔夜谈','chalk'])assert.equal(Names.resolve(name,L).preset.id,'P68');
 const t=L.themeFor(r);assert.equal(t.family,'fusheng');assert.equal(t.bg,'#ccd9de');assert.equal(t.dark,false);assert.equal(t.ink,'#292d32');
 assert.equal(L.themeFor(L.resolveRecipe('P65')).family,undefined);assert.equal(L.themeFor(L.resolveRecipe('P67')).family,undefined);
 assert.equal(L.selectedPresets().length,16);
});
test('16 original vector parts are deterministic, text free and valid SVG',()=>{
 assert.equal(F.parts.length,16);assert.equal(F.parts.filter(p=>p.kind==='actor').length,8);
 assert.equal(F.parts.filter(p=>p.kind==='note').length,4);assert.equal(F.parts.filter(p=>p.kind==='mark').length,4);
 assert.ok(!F.parts.some(p=>p.id==='stack-pages'));assert.ok(F.parts.some(p=>p.id==='open-question'));
 assert.equal(new Set(F.parts.map(p=>p.id)).size,16);
 assert.deepEqual(F.families.flatMap(f=>f.parts).sort(),F.parts.map(p=>p.id).sort());
 const t=L.themeFor(L.resolveRecipe('P68'));
 for(const p of F.parts){const a=F.renderPart(p.id,{x:0,y:0,w:160,h:140,theme:t});assert.equal(a,F.renderPart(p.id,{x:0,y:0,w:160,h:140,theme:t}));assert.ok(a.includes('data-fusheng-part="'+p.id+'"'));assert.ok(!/<text|<image|NaN|Infinity|undefined/.test(a));const parser=new SaxesParser({xmlns:true});parser.write('<svg xmlns="http://www.w3.org/2000/svg">'+a+'</svg>').close();}
 assert.throws(()=>F.renderPart('unknown',{}));
});
test('all five layouts and density variants keep every authored label and valid connections',()=>{
 const r=L.resolveRecipe('P68'),count=33;
 for(const l of L.selectedItems('L'))for(const d of L.selectedItems('D')){
  const recipe=L.replaceToken(L.replaceToken(r,'L',l.code),'D',d.code),{g,art,t}=svg(recipe);
  assert.equal(t.family,'fusheng');assert.equal(g.nodes.length,count);assert.equal((art.match(/class="node-label"/g)||[]).length,count);
  assert.ok(!/NaN|Infinity|undefined/.test(art));assert.ok(!art.includes('data-doodle-part'));
  for(const n of g.nodes)assert.ok(L.contrast(R.nodeStyle(n,t).text,t.bg)>=4.5);
  new SaxesParser({xmlns:true}).write('<svg xmlns="http://www.w3.org/2000/svg">'+art+'</svg>').close();
 }
 const full=svg(r).art,compact=svg(L.replaceToken(r,'D','D01')).art;
 for(const p of F.parts.filter(p=>p.kind==='actor'))assert.ok(full.includes('data-fusheng-part="'+p.id+'"'),p.id);
 assert.equal((compact.match(/class="fusheng-actor"/g)||[]).length,1);
 assert.ok((full.match(/class="fusheng-actor"/g)||[]).length<=9);
});
test('stable node identity and catalogue ordering do not change decorative assignment',()=>{
 const {t,g}=svg(L.resolveRecipe('P68')),before=g.nodes.map(n=>F.renderNode(n,t));
 F.parts.reverse();try{assert.deepEqual(g.nodes.map(n=>F.renderNode(n,t)),before);}finally{F.parts.reverse();}
});
test('questions follow authored uncertainty, never random node identity',()=>{
 const r=L.resolveRecipe('P68');
 for(const l of L.selectedItems('L'))for(const d of L.selectedItems('D')){
  const recipe=L.replaceToken(L.replaceToken(r,'L',l.code),'D',d.code),t=L.themeFor(recipe);
  const sample='```mermaid\nmindmap\n  保留原意\n    准备下一步\n      还要等多久？\n        What comes next?\n      先完成手头的事\n```';
  const g=K.layoutTree(K.parseMindmap(sample),l.id,new Set(),Infinity,t.density);
  const marked=g.nodes.filter(n=>F.renderNode(n,t).includes('data-fusheng-part="open-question"')).map(n=>n.text);
  assert.deepEqual(marked,['还要等多久？','What comes next?']);
  for(const n of g.nodes)assert.equal(F.renderNode({...n,id:'changed-'+n.id},t).includes('data-fusheng-part="open-question"'),marked.includes(n.text));
 }
});
test('the real example demonstrates all sixteen parts; distribution keeps one kit',()=>{
 const fs=require('node:fs'),path=require('node:path'),base=path.resolve(__dirname,'..');
 const r=L.resolveRecipe('P68'),t=L.themeFor(r),sample=fs.readFileSync(path.join(base,'examples/small-joys.md'),'utf8');
 const g=K.layoutTree(K.parseMindmap(sample),'balanced',new Set(),Infinity,t.density),art=R.svgContent(g,t,'balanced',new Set(),false);
 for(const p of F.parts)assert.ok(art.includes('data-fusheng-part="'+p.id+'"'),p.id);
 const questions=g.nodes.filter(n=>F.renderNode(n,t).includes('data-fusheng-part="open-question"')).map(n=>n.text);
 assert.deepEqual(questions,['第几轮才算最后一轮？','下一站想遇见什么？']);
 const catalogue=JSON.parse(fs.readFileSync(path.join(base,'dist/style-library.json'),'utf8'));
 assert.deepEqual(catalogue.fusheng.parts,F.parts);
 assert.equal(catalogue.fusheng.uid,'MMH0S8');
 assert.equal(fs.readFileSync(path.join(base,'src/fusheng.cjs'),'utf8'),fs.readFileSync(path.join(base,'skills/mindbox/assets/runtime/src/fusheng.cjs'),'utf8'));
 const html=require('../src/document.cjs').generate({source:sample,recipeCode:r.code,standalone:true,player:true});
 assert.ok(html.includes('scope.FushengKit'));assert.ok(html.includes('浮生小趣'));
 const page=fs.readFileSync(path.join(base,'dist/index.html'),'utf8');assert.ok(page.includes('id="fusheng-kit"'));assert.ok(page.includes('data-fusheng-card'));
});
