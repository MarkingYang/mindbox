const {test}=require('node:test'),assert=require('node:assert/strict');
const K=require('../src/engine.cjs'),M=require('../src/media.cjs'),L=K.library;
function large(){const lines=['```mermaid','mindmap','  复杂内容阅读地图'];for(let b=0;b<9;b++){lines.push('    主题 '+b);for(let i=0;i<8;i++){lines.push('      观点 '+b+'-'+i);for(let j=0;j<3;j++)lines.push('        具体依据 '+b+'-'+i+'-'+j);}}lines.push('```');return K.parseMindmap(lines.join('\n'));}
const tree=large();
test('缩放上限按文字与视窗计算，密集导图仍可达到清晰字号',()=>{
 for(const viewport of [{width:1280,height:720},{width:390,height:700}]){
  const geo=M.scene(tree,L.resolveRecipe('P67')).geo,fit=Math.min(viewport.width/geo.bounds.w,viewport.height/geo.bounds.h);
  const policy=M.zoomPolicy(geo.bounds,viewport,geo.nodes);assert.ok(M.maxZoom(geo.bounds,viewport,geo.nodes)*fit>=2);assert.ok(Math.abs(M.maxZoom(geo.bounds,viewport,geo.nodes)*fit-policy.maxScale)<1e-8);
  assert.ok(M.clampZoom(1e9,geo.bounds,viewport,geo.nodes)>1);assert.equal(M.clampZoom(NaN,geo.bounds,viewport),1);
 }
});
test('16样式与5结构的298节点动图自适应分组，逐个覆盖且聚焦字号可读',()=>{
 assert.equal(K.descendants(tree)+1,298);
 for(const preset of L.selectedPresets())for(const layout of L.axes.L.items){
  const scene=M.scene(tree,L.replaceToken(L.resolveRecipe(preset.id),'L',layout.code)),steps=M.readingSteps(scene.geo),size=M.exportDimensions(scene.geo.bounds,true,scene.geo.nodes);
  assert.equal(new Set(steps.flatMap(s=>s.targets)).size,298);assert.equal(steps.flatMap(s=>s.targets).length,298);
  for(const step of steps){const b=M.cameraBounds(scene.geo,step,size.width/(size.height-64));for(const id of step.targets){const n=scene.geo.nodes.find(n=>n.id===id);assert.ok(n.x-n.w/2>=b.x&&n.x+n.w/2<=b.x+b.w);assert.ok(n.y-n.h/2>=b.y&&n.y+n.h/2<=b.y+b.h);assert.ok(n.fontSize*size.width/b.w>=18,`${preset.id}/${layout.id}: ${n.text}`);}}
 }
});
test('PNG按内容字号提高采样但不盲目20倍；极端画布有总像素和边长保护',()=>{
 const small=M.exportDimensions({w:500,h:300},false,[{fontSize:16}]),largeSize=M.exportDimensions({w:1000,h:18000},false,[{fontSize:12}]);
 assert.ok(small.width<500*20);assert.ok(small.width/500>=2);assert.ok(largeSize.height>16384);
 for(const size of [small,largeSize,M.exportDimensions({w:1e7,h:1e7})]){assert.ok(size.width<=32760&&size.height<=32760);assert.ok(size.width*size.height<=64000000);}
});
test('聚焦帧从矢量场景按新viewBox重新栅格化，而非裁剪已缩小的整图',()=>{
 const scene=M.scene(tree,L.resolveRecipe('P67')),step=M.readingSteps(scene.geo).at(-1),size={width:1920,height:1080},camera=M.cameraBounds(scene.geo,step,16/9),svg=M.svg(scene,'',false,size,camera);
 assert.ok(svg.includes(`viewBox="${camera.x} ${camera.y} ${camera.w} ${camera.h}"`));assert.ok(svg.includes('width="1920" height="1080"'));assert.equal((svg.match(/class="map-node"/g)||[]).length,298);
});
test('单节点、长文字与20层深图也使用可读镜头，避免小图被过度缩小',()=>{
 for(const mode of ['one','deep','long']){
  const lines=['```mermaid','mindmap','  单一主题'];
  if(mode==='deep')for(let i=1;i<=20;i++)lines.push('  '.repeat(i+1)+'深层级 '+i);
  if(mode==='long')lines.push('    '+('这是一个较长的说明。'.repeat(40)));
  lines.push('```');const root=K.parseMindmap(lines.join('\n'));
  for(const preset of L.selectedPresets())for(const layout of L.axes.L.items){
   const scene=M.scene(root,L.replaceToken(L.resolveRecipe(preset.id),'L',layout.code)),size=M.exportDimensions(scene.geo.bounds,true,scene.geo.nodes);
   assert.ok(size.width*size.height<=4000000&&size.height>=540);
   for(const step of M.readingSteps(scene.geo)){const b=M.cameraBounds(scene.geo,step,size.width/(size.height-64));for(const n of scene.geo.nodes.filter(n=>step.targets.includes(n.id)))assert.ok(n.fontSize*size.width/b.w>=18);}
  }
 }
});
