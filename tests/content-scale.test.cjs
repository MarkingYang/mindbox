const {test}=require('node:test'),assert=require('node:assert/strict');
const K=require('../src/engine.cjs'),M=require('../src/media.cjs'),{fixtures}=require('../scripts/quality.cjs');
const E=require('../src/edit.cjs'),R=require('../src/render.cjs');
function contentOfSize(count){
 const lines=['```mermaid','mindmap','  内容按复杂程度展开'];let remaining=count-1,index=0;
 while(remaining){lines.push('    主题'+index++);remaining--;for(let i=0;i<24&&remaining;i++,remaining--)lines.push('      片段'+index+'-'+i);}
 return lines.join('\n')+'\n```';
}
test('500与1000节点完整生成、继续编辑并可在Markdown与HTML内容间往返',()=>{
 const shape=n=>({text:n.text,children:n.children.map(shape)});
 for(const count of [500,1000]){
  const source=contentOfSize(count),model=E.create({source});assert.equal(K.descendants(model.root())+1,count);
  const added=model.add(model.root().children[0].id,'child','继续补充的内容');model.rename(added,'HTML编辑后的内容');
  const text=model.markdown();assert.deepEqual(shape(K.parseMindmap(text)),shape(model.root()));
  model.revise(text.replace('HTML编辑后的内容','Markdown编辑后的内容'));assert.equal(model.find(added).text,'Markdown编辑后的内容');
  const reopened=E.create({source:model.markdown(),document:model.document()});assert.deepEqual(reopened.document(),model.document());assert.equal(K.descendants(reopened.root())+1,count+1);
 }
});
test('1000节点在16套样式和五种结构完整布局，聚焦阅读覆盖全部内容',()=>{
 const tree=K.parseMindmap(contentOfSize(1000)),L=K.library;
 for(const p of L.selectedPresets())for(const layout of L.axes.L.items){
  const r=L.replaceToken(L.resolveRecipe(p.id),'L',layout.code),t=L.themeFor(r),g=K.layoutTree(tree,layout.id,new Set(),Infinity,t.density);
  assert.equal(g.nodes.length,1000);assert.equal(g.edges.length,999);assert.ok(Object.values(g.bounds).every(Number.isFinite));
  const svg=R.svgContent(g,t,layout.id,new Set(),false);assert.equal((svg.match(/class="node-label"/g)||[]).length,1000);assert.ok(!/NaN|Infinity/.test(svg));
  if(p.id==='P67'){
   const plan=M.animationPlan(g),covered=plan.steps.flatMap(s=>s.targets);assert.equal(covered.length,1000);assert.equal(new Set(covered).size,1000);assert.ok(plan.minTextPx>=24-.02);assert.ok(plan.width*plan.height<=4000000);
  }
 }
});
const small=M.scene(K.parseMindmap('```mermaid\nmindmap\n  主题\n    判断一\n    判断二\n```'),K.library.resolveRecipe('P67')).geo;
const large=M.scene(K.parseMindmap(fixtures()[1].source),K.library.resolveRecipe('P67')).geo;
test('显示比例以原始字号为基准，同一真实大小不随导图范围改变',()=>{
 for(const geo of [small,large]){const v={width:1280,height:600},p=M.zoomPolicy(geo.bounds,v,geo.nodes);assert.equal(M.zoomPercent(1),100);assert.ok(p.maxScale*Math.min(...geo.nodes.map(n=>n.fontSize))>=32);assert.ok(p.maxScale*Math.min(...geo.nodes.map(n=>n.fontSize))<=64+.001);assert.ok(Math.abs(M.clampZoom(1e9,geo.bounds,v,geo.nodes)*p.fit-p.maxScale)<1e-8);}
 assert.ok(M.zoomPolicy(large.bounds,{width:1280,height:600},large.nodes).maxScale>M.zoomPolicy(small.bounds,{width:1280,height:600},small.nodes).maxScale);
});
test('PNG小图适度采样，大图报告像素上限与实际字号，不依赖屏幕倍率',()=>{
 const a=M.imagePlan(small.bounds,small.nodes),b=M.imagePlan(large.bounds,large.nodes);
 assert.ok(a.scale>=2&&a.scale<4);assert.ok(a.minTextPx>=28);assert.equal(a.limited,false);assert.equal(b.limited,true);assert.ok(b.width*b.height<=64000000);assert.ok(b.minTextPx>0);assert.ok(b.minTextPx<b.targetTextPx);
});
test('动图尺寸来自每个阅读镜头，覆盖全部节点，满足字号且不盲目全高清',()=>{
 const a=M.animationPlan(small),b=M.animationPlan(large);assert.ok(a.width<b.width||a.height<b.height);assert.ok(a.width*a.height<1920*1080);
 for(const [geo,plan] of [[small,a],[large,b]]){assert.equal(plan.steps.flatMap(s=>s.targets).length,geo.nodes.length);assert.ok(plan.width*plan.height<=4000000);assert.ok(plan.minTextPx>=24-.02);assert.equal(plan.cameras.length,plan.steps.length);}
});

test('超大显示窗口的小图仍可恢复100%原始字号',()=>{const v={width:8000,height:6000},p=M.zoomPolicy(small.bounds,v,small.nodes);assert.equal(M.clampZoom(1/p.fit,small.bounds,v,small.nodes)*p.fit,1);});

test('折叠全部子节点时保留真实比例，范围以完整内容计算',()=>{const v={width:1280,height:600},root=K.parseMindmap(fixtures()[1].source),r=K.library.resolveRecipe('P67'),t=K.library.themeFor(r),full=M.scene(root,r).geo,fold=K.layoutTree(root,r.tokens.L.id,new Set([root.id]),Infinity,t.density),p=M.zoomPolicy(full.bounds,v,full.nodes);for(const scale of [p.minScale,p.fit,p.maxScale]){const a=M.anchoredView(fold.bounds,v,{x:640,y:300},fold.nodes[0],scale,full.nodes,full.bounds),actual=Math.min(v.width/fold.bounds.w,v.height/fold.bounds.h)*a.zoom;assert.ok(Math.abs(actual-scale)<1e-8);}});
