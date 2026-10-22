const {test}=require('node:test'),assert=require('node:assert/strict');
const K=require('../src/engine.cjs'),R=require('../src/render.cjs'),L=K.library;
test('16 套任务定位完整且不改变已确认的配方',()=>{
 assert.equal(L.tasks.length,4);assert.equal(new Set(L.tasks.map(t=>t.id)).size,4);
 assert.deepEqual(L.selectedPresets().map(({id,code})=>({id,code})),require('../references/component-coverage.json').presets.map(p=>p.id==='P67'?{...p,code:require('../references/journal-style-revision.json').code}:p));
 for(const t of L.tasks){const group=L.selectedPresets().filter(p=>p.positioning.task===t.id);assert.equal(group.length,4);assert.ok(group.some(p=>p.id===t.start));}
 for(const p of L.selectedPresets()){const v=p.positioning;for(const key of ['useCase','outcome','audience','intent'])assert.ok(v[key]);assert.equal(p.description,v.intent);}
});
test('16 套任务范例中英文均可渲染，层级和节点均在画布内',()=>{
 const roots=new Set();
 for(const p of L.selectedPresets())for(const lang of ['zh','en']){
  const r=L.resolveRecipe(p.id),tree=K.parseMindmap(p.positioning.specimens[lang]),snapshot=JSON.stringify(tree),t=L.themeFor(r),g=K.layoutTree(tree,r.tokens.L.id,new Set(),2,t.density);
  if(lang==='zh')roots.add(tree.text);
  assert.equal(g.nodes.length,10);assert.ok(g.nodes.some(n=>n.depth===2));
  for(const n of g.nodes){assert.ok(n.x-n.w/2>=g.bounds.x-.01);assert.ok(n.x+n.w/2<=g.bounds.x+g.bounds.w+.01);assert.ok(n.y-n.h/2>=g.bounds.y-.01);assert.ok(n.y+n.h/2<=g.bounds.y+g.bounds.h+.01);}
  const svg=R.staticSVG(tree,r,2);assert.ok(!/NaN|Infinity/.test(svg));assert.equal(JSON.stringify(tree),snapshot);
 }
 assert.equal(roots.size,16);
});
test('导出的统一样式库包含任务定位，宿主无需另维护人群映射',()=>{
 const exported=require('../dist/style-library.json');assert.deepEqual(exported.tasks,L.tasks);
 for(const p of exported.presets)assert.deepEqual(p.positioning,L.presets.find(x=>x.id===p.id).positioning);
});
test('项目分解的公共连接轨道在浅色画布上保持可见',()=>{
 const r=L.resolveRecipe('P78'),t=L.themeFor(r),tree=K.parseMindmap(r.preset.positioning.specimens.en),svg=R.staticSVG(tree,r,2);
 assert.ok(L.contrast(t.bg,t.ink)>=4.5,'画布标题和工具栏也必须清晰可读');
 const paths=[...svg.matchAll(/<path [^>]*stroke="(#[0-9a-f]{6})"[^>]*opacity="([0-9.]+)"[^>]*class="map-link"/g)];assert.ok(paths.length>0);
 for(const [,stroke,opacity] of paths)assert.ok(L.contrast(t.bg,L.mix(t.bg,stroke,Number(opacity)))>=3,`连接线 ${stroke} 在叠加透明度后仍须清楚可见`);
});
test('近期推荐保留八个唯一组合、明确依据和完整十六套兼容',()=>{
 const rec=L.recommendations;assert.equal(rec.items.length,8);assert.equal(new Set(rec.items.map(x=>x.preset)).size,8);assert.equal(rec.items[0].preset,'P61');
 for(const item of rec.items){assert.ok(L.selectedPresets().some(p=>p.id===item.preset));assert.ok(item.scenario&&item.reason&&item.badge);for(const id of item.signals)assert.ok(rec.signals.some(s=>s.id===id&&s.url.startsWith('https://')));}
 assert.equal(L.selectedPresets().filter(p=>!rec.items.some(i=>i.preset===p.id)).length,8);
 assert.deepEqual(require('../dist/style-library.json').recommendations,rec);
});
