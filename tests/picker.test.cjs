const {test}=require('node:test'),assert=require('node:assert/strict');
const L=require('../src/library.cjs'),P=require('../src/picker.cjs');
test('模板和七维的可见代号等于真实代号，排序变化不改变身份，16套配方可往返还原',()=>{
 for(const preset of [...L.selectedPresets()].reverse()){
  assert.equal(P.presetLabel(preset),`${preset.uid} · ${preset.name.split(' · ')[0]}`);
  const r=L.resolveRecipe(preset.id),back=L.resolveRecipe(r.code);assert.equal(back.preset.id,preset.id);
  for(const axis of L.order){
   for(const item of [...P.itemsFor(axis,r)].reverse()){
    const view=P.describe(axis,item,r.tokens.L.id);assert.equal(view.code,item.code);assert.equal(view.label,`${item.code} · ${view.name}`);
   }
   assert.ok(P.describe(axis,r.tokens[axis],r.tokens.L.id).label.startsWith(r.tokens[axis].code+' · '));
  }
  assert.equal(L.order.map(axis=>P.describe(axis,r.tokens[axis],r.tokens.L.id).code).join('-'),r.code);
 }
 const r=L.resolveRecipe('P67');assert.equal(P.presetLabel(r.preset),'MMP0A7 · 脑洞涂鸦');
 assert.equal(P.describe('N',r.tokens.N,'balanced').label,'N18 · 趣味涂鸦');assert.equal(P.describe('E',r.tokens.E,'balanced').code,'E09');
});
test('图示选择器保留七维配方，菜单不超过八项且只提供兼容连线',()=>{
 for(const preset of L.selectedPresets()){
  const r=L.resolveRecipe(preset.id);
  for(const axis of L.order){const items=P.itemsFor(axis,r);assert.ok(items.length>0&&items.length<=8);assert.ok(items.some(i=>i.code===r.tokens[axis].code));for(const item of items){const view=P.describe(axis,item,r.tokens.L.id);assert.ok(view.name&&view.hint);assert.ok(P.preview(axis,item,r.tokens.L.id));const next=L.replaceToken(r,axis,item.code);for(const key of L.order)if(key!==axis&&!(axis==='L'&&key==='E'))assert.equal(next.tokens[key].code,r.tokens[key].code);}}
  for(const item of P.itemsFor('E',r))assert.ok(L.allowedEdges(r.tokens.L.id).includes(item.code));
 }
 for(const [id,name] of [['P80','实线括号'],['P74','大纲导线']]){const r=L.resolveRecipe(id);assert.equal(P.itemsFor('E',r).length,1);assert.equal(P.describe('E',r.tokens.E,r.tokens.L.id).name,name);}
});
test('色块使用真实配色和画布，字形使用真实字体，不是替代演示',()=>{
 const r=L.resolveRecipe('P65'),out=require('../dist/style-library.json');
 for(const axis of L.order)for(const item of out.axes[axis].items)assert.deepEqual(item.display,P.describe(axis,item,'balanced'));
 for(const item of P.itemsFor('C',r)){const html=P.preview('C',item,'balanced');for(const color of [...item.colors,item.accent])assert.ok(html.includes(color));}
 for(const item of P.itemsFor('B',r))assert.ok(P.preview('B',item,'balanced').includes(item.bg));
 for(const item of P.itemsFor('T',r)){const html=P.preview('T',item,'balanced');assert.ok(html.includes(item.font.replace(/'/g,'&apos;')));assert.ok(html.includes(item.language==='en'?'Bright ideas':'把想法画出来'));}
});
test('旧组件可导入并出现在图示菜单，所有示例有有效且不重复的属性',()=>{
 for(const [axis,code] of [['N','N17'],['E','E03'],['E','E06']]){const r=L.replaceToken(L.resolveRecipe('P65'),axis,code);assert.ok(P.itemsFor(axis,r).some(x=>x.code===code));}
 for(const axis of L.order)for(const item of L.selectedItems(axis)){
  const html=P.preview(axis,item,'balanced');assert.ok(!/NaN|Infinity|<script/.test(html));
  for(const tag of html.match(/<[a-z][^>]*>/g)||[]){const attrs=[...tag.matchAll(/\s([\w:-]+)="[^"]*"/g)].map(m=>m[1]);assert.equal(attrs.length,new Set(attrs).size,tag);}
 }
});
