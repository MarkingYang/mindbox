const {test}=require('node:test'),assert=require('node:assert/strict');
const K=require('../src/engine.cjs'),R=require('../src/render.cjs'),M=require('../src/media.cjs'),L=K.library;
const chain=['```mermaid','mindmap','  层级主题',...Array.from({length:20},(_,i)=>'  '.repeat(i+2)+'层级内容 '+(i+1)),'```'].join('\n');
test('16套深层节点从原第三级继续生长，填色/边界/角色不直接复制，字号保持可读',()=>{
 const root=K.parseMindmap(chain);
 for(const p of L.selectedPresets()){
  const r=L.resolveRecipe(p.id),s=M.scene(root,r),styles=s.geo.nodes.map(n=>R.nodeStyle(n,s.theme));
  assert.notDeepEqual(styles[2],styles[3],p.id+' detail style');assert.notDeepEqual(styles[3],styles[4],p.id+' caption style');
  let last=Infinity;
  for(const n of s.geo.nodes){
   assert.ok(Number.isFinite(n.fontSize)&&n.fontSize>=12&&n.fontSize<=last,p.id+' readable type '+n.depth);last=n.fontSize;
   const style=styles[n.depth],bg=style.fill==='none'?s.theme.bg:style.fill;assert.ok(L.contrast(style.text,bg)>=4.5,p.id+' contrast '+n.depth);
   if(n.depth>2)assert.ok(style.role&&style.borderWidth>0);
  }
  assert.notEqual(s.geo.nodes[19].fontSize,s.geo.nodes[20].fontSize,'深层继续递推而非轮回/截断');
  const svg=M.svg(s);assert.ok(svg.includes('data-level-role="detail"'));assert.ok(svg.includes('data-level-role="annotation"'));assert.ok(!/NaN|Infinity/.test(svg));
 }
});
test('深层同级分支在五种结构不重叠，折叠后节点视觉属性稳定',()=>{
 const root=K.parseMindmap(chain);
 let tip=root;while(tip.depth<5)tip=tip.children[0];
 tip.children.push({id:'sibling',text:'同级的补充判断',depth:6,branch:0,children:[]});
 for(const layout of L.axes.L.items){
  const r=L.replaceToken(L.resolveRecipe('P39'),'L',layout.code),a=M.scene(root,r),nodes=a.geo.nodes;
  for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){const x=nodes[i],y=nodes[j];assert.ok(Math.abs(x.x-y.x)>=(x.w+y.w)/2||Math.abs(x.y-y.y)>=(x.h+y.h)/2,layout.id);}
  const geo=K.layoutTree(root,layout.id,new Set(['n5']),Infinity,a.theme.density);
  for(const n of geo.nodes)assert.deepEqual(R.nodeStyle(n,a.theme),R.nodeStyle(nodes.find(x=>x.id===n.id),a.theme));
 }
});
test('16套深层文字在各分支配色可读，多层范例实际输出到完整阅读器',()=>{
 const fs=require('node:fs'),path=require('node:path');
 for(const p of L.selectedPresets()){
  const r=L.resolveRecipe(p.id),t=L.themeFor(r);
  for(let branch=0;branch<t.palette.length;branch++)for(let depth=3;depth<=20;depth++){
   const s=R.nodeStyle({depth,branch},t);assert.ok(L.contrast(s.text,s.fill==='none'?t.bg:s.fill)>=4.5,p.id+'/'+depth+'/'+branch);
  }
  for(const lang of ['zh','en']){
   const source=p.positioning.depthSpecimens[lang],scene=M.scene(K.parseMindmap(source),r);assert.ok(Math.max(...scene.geo.nodes.map(n=>n.depth))>=5);
   assert.ok(M.svg(scene).includes('data-level-role="annotation"'));
  }
  const html=fs.readFileSync(path.join(__dirname,'../dist/depth-examples',p.id+'.html'),'utf8');assert.ok(html.includes('"player":true'));assert.ok(html.includes(r.code));
 }
});
