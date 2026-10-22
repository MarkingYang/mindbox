const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const K=require('../src/engine.cjs'),L=K.library,source=fs.readFileSync(path.join(__dirname,'../examples/knowledge-work.md'),'utf8');
test('80 个预设均可还原为完整配方，代码唯一且出处可追溯',()=>{
 assert.equal(L.presets.length,80);assert.equal(new Set(L.presets.map(p=>p.code)).size,80);
 for(const p of L.presets){const r=L.resolveRecipe(p.id);assert.equal(r.code,p.code);assert.equal(L.resolveRecipe(r.code).preset.id,p.id);for(const s of p.sourceIds)assert.ok(L.sources.some(x=>x.id===s));}
 for(const axis of Object.values(L.axes))for(const item of axis.items)assert.ok(item.sourceIds.length);
});
test('单独更换节点、配色、画布等组件时，其余代码保持不变',()=>{
 const r=L.resolveRecipe('P07');for(const axis of ['N','E','C','B','T','D']){
  const item=L.axes[axis].items.find(i=>i.code!==r.tokens[axis].code),next=L.replaceToken(r,axis,item.code);
  for(const key of L.order)assert.equal(next.tokens[key].code,key===axis?item.code:r.tokens[key].code);
 }
});
test('结构兼容规则有明确错误；界面切换可选择合适默认连线',()=>{
 assert.throws(()=>L.resolveRecipe('L04-N02-E03-C08-B01-T01-D02'),/保留其结构连线/);
 const next=L.replaceToken(L.resolveRecipe('P13'),'L','L04');assert.equal(next.tokens.E.code,'E01');
 for(const s of ['P99','L01-N99-E01-C01-B01-T01-D02','L01-N01','L01-N01-E01-C01-B01-T01-D02-extra'])assert.throws(()=>L.resolveRecipe(s));
});
test('Markdown 的完整配方优先于预设，预设优先于旧主题',()=>{
 assert.equal(K.parseOptions('---\npreset: P08\ntheme: ink\n---\n').recipeCode,L.resolveRecipe('P08').code);
 assert.equal(K.parseOptions('---\nstyle: L01-N02-E03-C06-B04-T01-D02\npreset: P08\n---\n').recipeCode,'L01-N02-E03-C06-B04-T01-D02');
 assert.throws(()=>K.parseOptions('---\nstyle: P99\n---\n'));
});
test('全部预设及所有疏密设置均保留内容和非重叠节点',()=>{
 const tree=K.parseMindmap(source),text=JSON.stringify(tree);
 for(const p of L.presets)for(const d of L.axes.D.items){const r=L.replaceToken(L.resolveRecipe(p.id),'D',d.code),g=K.layoutTree(tree,r.tokens.L.id,new Set(),Infinity,L.themeFor(r).density);assert.equal(g.nodes.length,25);
  for(let i=0;i<g.nodes.length;i++)for(let j=i+1;j<g.nodes.length;j++){const a=g.nodes[i],b=g.nodes[j];assert.ok(Math.abs(a.x-b.x)>=(a.w+b.w)/2||Math.abs(a.y-b.y)>=(a.h+b.h)/2,`${p.id} ${d.code}: ${a.text} / ${b.text}`);}
 }assert.equal(JSON.stringify(tree),text);
});
test('全部调色板及浅深混色均可选取足够对比度的实底节点文字',()=>{
 for(const c of L.axes.C.items)for(const color of [...c.colors,c.accent])for(const b of L.axes.B.items)for(const ratio of [0,.2,.73,1]){
  const bg=L.mix(b.bg,color,ratio);assert.ok(L.contrast(bg,L.readableText(bg))>=4.5,`${bg} contrast`);
 }
});
test('预设、组件与来源导出为一个统一目录；旧 24 组合保持兼容',()=>{
 const root=path.join(__dirname,'../dist'),catalogue=JSON.parse(fs.readFileSync(path.join(root,'style-library.json'),'utf8'));
 assert.equal(catalogue.presets.length,16);assert.equal(Object.keys(catalogue.axes).length,7);
 assert.deepEqual(catalogue.compatibility.L04.edges,['E01','E05','E06']);assert.equal(catalogue.defaultPreset,'P61');
 for(const p of L.presets){const html=fs.readFileSync(path.join(root,'presets',p.id+'.html'),'utf8');assert.ok(html.includes(`"preset":"${p.id}"`));assert.ok(!/<script[^>]+src=/.test(html));assert.equal((html.match(/<script(?:\s[^>]*)?>/g)||[]).length,4);}
 assert.equal(JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8')).length,24);
});

test('新增预设不改变原有二十份配方的含义',()=>{
 const original=require('./original-presets.json');
 assert.deepEqual(L.presets.slice(0,20).map(({id,code})=>({id,code})),original);
 assert.equal(L.axes.N.items.length,21);assert.equal(L.axes.E.items.length,10);
 assert.equal(L.axes.C.items.length,45);assert.equal(L.axes.B.items.length,42);
 assert.equal(L.presets.filter(p=>p.collection==='新增').length,60);
});

test('官方静态主题均对应独立可组合配方',()=>{const refs=require('../references/mindnode-theme-mapping.json');assert.equal(refs.length,28);for(const r of refs){const p=L.presets.find(p=>p.id===r.preset);assert.equal(p.referenceTheme,r.reference);assert.equal(p.code,r.code);assert.ok(r.url.startsWith('https://cdn.sanity.io/'));}});

test('手绘笔触稳定、可复现，并随节点变化',()=>{const a=L.pencilBox(10,20,140,38,3);assert.equal(a,L.pencilBox(10,20,140,38,3));assert.notEqual(a,L.pencilBox(10,20,140,38,4));assert.notEqual(a,L.pencilBox(10,20,140,38,3,1));for(const vertical of [true,false])assert.ok(!/NaN|Infinity/.test(L.pencilCurve(0,0,200,-100,vertical,2)));});

test('内置字体与六种精修样式均可选择',()=>{assert.equal(L.axes.T.items.length,13);for(const code of ['T05','T06','T07','T08'])assert.ok(L.axes.T.items.some(t=>t.code===code&&t.embedded));for(const id of ['P61','P48','P40','P53','P39','P60'])assert.ok(L.resolveRecipe(id).tokens.T.embedded);for(const name of ['elegant','business','brush','playful']){const bytes=fs.readFileSync(path.join(__dirname,'../assets/fonts',name+'.woff2'));assert.equal(bytes.subarray(0,4).toString(),'wOF2');}});

test('精选目录每个维度不超过八项，旧配方仍可导入',()=>{assert.equal(L.selectedPresets().length,16);for(const axis of L.order){const list=L.selectedItems(axis);assert.ok(list.length<=8);assert.equal(new Set(list.map(x=>x.code)).size,list.length);const archive=L.axes[axis].items.find(x=>!list.some(y=>y.code===x.code));if(archive){const selected=L.selectedItems(axis,archive.code);assert.ok(selected.length<=8);assert.ok(selected.some(x=>x.code===archive.code));}}for(const p of L.selectedPresets()){const r=L.resolveRecipe(p.id);for(const axis of L.order)assert.ok(L.selection.axes[axis].includes(r.tokens[axis].code),`${p.id} ${axis}`);}assert.ok(L.resolveRecipe('P07'));const out=JSON.parse(fs.readFileSync(path.join(__dirname,'../dist/style-library.json')));assert.equal(out.compatibilityArchive.presets.length,80);for(const a of Object.values(out.axes))assert.ok(a.items.length<=8);});

test('精选字体为四中四英，样例直接标注字体且无独立字体墙',()=>{const fonts=L.selectedItems('T');assert.equal(fonts.filter(t=>t.language==='zh').length,4);assert.equal(fonts.filter(t=>t.language==='en').length,4);for(const lang of ['zh','en']){assert.equal(fonts.filter(t=>t.language===lang&&t.category.startsWith('趣味')).length,1);assert.equal(fonts.filter(t=>t.language===lang&&t.category.startsWith('常用')).length,3);}const html=fs.readFileSync(path.join(__dirname,'../src/index.html'),'utf8');assert.ok(!html.includes('font-gallery'));assert.ok(!html.includes('font-chooser'));for(const t of fonts){const bytes=fs.readFileSync(path.join(__dirname,'../assets/fonts',t.file+'.woff2'));assert.equal(bytes.subarray(0,4).toString(),'wOF2');assert.ok(fs.readFileSync(path.join(__dirname,'../assets/fonts',t.file+'-OFL.txt'),'utf8').includes('Open Font License'));}});

test('新增八种配方具有使用信号且不增加组件选择数',()=>{assert.equal(L.selection.presetLimit,16);assert.equal(L.selection.componentLimit,8);assert.deepEqual(L.selectedPresets().slice(0,8).map(({id,code})=>({id,code})),require('../references/sixteen-style-evidence.json').preserved.map(p=>p.id==='P67'?{id:p.id,code:require('../references/journal-style-revision.json').code}:p));const old=L.selection.presets.slice(0,8);assert.deepEqual(old,['P61','P48','P40','P39','P60','P65','P67','P68']);const latest=L.selectedPresets().filter(p=>p.usageEvidence);assert.equal(latest.length,8);assert.deepEqual(latest.map(p=>p.id),['P73','P74','P75','P76','P77','P78','P79','P80']);for(const p of latest){assert.match(p.usageEvidence.copies,/^[0-9.]+K?$/);assert.ok(p.usageEvidence.url.startsWith('https://miro.com/templates/'));assert.ok(p.sourceIds.includes('miro'));const r=L.resolveRecipe(p.id);for(const a of L.order)assert.ok(L.selection.axes[a].includes(r.tokens[a].code));}for(const axis of L.order)assert.ok(L.selectedItems(axis).length<=8);});

test('手账修订保持16套上限与旧完整配方导入',()=>{const revision=require('../references/journal-style-revision.json');assert.equal(L.resolveRecipe('P67').code,revision.code);assert.equal(L.resolveRecipe('P67').tokens.B.code,'B40');assert.equal(L.resolveRecipe('P67').tokens.B.pattern,undefined);assert.equal(L.resolveRecipe(revision.previousBalancedCode).tokens.B.pattern,'ruled');assert.equal(L.resolveRecipe(revision.previousCode).tokens.L.code,'L02');assert.equal(L.resolveRecipe('P67').tokens.N.code,'N18');const r=L.resolveRecipe('P67');assert.ok(L.themeFor(r).density.rootMinHeight>=90);assert.equal(L.selectedPresets().length,16);});

test('十六套展示文案独立完整，来源与字体许可留在研究和资产中',()=>{
 for(const p of L.selectedPresets())assert.ok(!/参考|Miro|Xmind|MindNode|枝序原创/.test(p.description),p.id);
 const html=fs.readFileSync(path.join(__dirname,'../src/index.html'),'utf8');
 assert.ok(!/recipe-sources|source-cards|reference-gallery|复制量|特性与来源/.test(html));
 for(const file of ['font-selection-research.md','style-popularity-research.md'])assert.ok(fs.statSync(path.join(__dirname,'../docs/research',file)).size>0);
 for(const t of L.selectedItems('T'))assert.ok(fs.statSync(path.join(__dirname,'../assets/fonts',t.file+'-OFL.txt')).size>0);
});

test('提纲分节留白在折叠后仍保持顺序与边界',()=>{
 const tree=K.parseMindmap(source),theme=L.themeFor(L.resolveRecipe('P79'));
 assert.ok(theme.density.sectionGap>0);
 for(const collapsed of [new Set(),new Set([tree.children[0].id])]){
  const g=K.layoutTree(tree,'outline',collapsed,Infinity,theme.density);
  for(let i=1;i<g.nodes.length;i++){const a=g.nodes[i-1],b=g.nodes[i],gap=(b.y-b.h/2)-(a.y+a.h/2);assert.ok(gap>=theme.density.rowGap+(b.depth===1?theme.density.sectionGap:0)-.001);}
  for(const n of g.nodes){assert.ok(n.y-n.h/2>=g.bounds.y);assert.ok(n.y+n.h/2<=g.bounds.y+g.bounds.h);}
 }
});

test('已确认精简保留全部16配方，退出默认的三项仍可导入',()=>{
 assert.deepEqual(L.order.map(a=>L.selectedItems(a).length),[5,7,6,8,8,8,3]);
 assert.deepEqual(L.selectedPresets().map(({id,code})=>({id,code})),require('../references/component-coverage.json').presets.map(p=>p.id==='P67'?{...p,code:require('../references/journal-style-revision.json').code}:p));
 for(const [axis,code] of [['N','N17'],['E','E03'],['E','E06']]){
  assert.ok(!L.selectedItems(axis).some(x=>x.code===code));
  const imported=L.replaceToken(L.resolveRecipe('P65'),axis,code);
  assert.equal(imported.tokens[axis].code,code);
  const menu=L.selectedItems(axis,code);
  assert.ok(menu.some(x=>x.code===code));assert.ok(menu.length<=8);
 }
});
