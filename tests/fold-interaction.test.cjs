const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const K=require('../src/engine.cjs'),M=require('../src/media.cjs'),L=K.library;
test('折叠和展开的定位保留操作节点与当前实际缩放，覆盖16样式五结构',()=>{
 const source='```mermaid\nmindmap\n  root((主题))\n    分支一\n      内容一\n      内容二\n    分支二\n      内容三\n```',root=K.parseMindmap(source),id=root.children[0].id,viewport={width:1280,height:600};
 for(const p of L.selectedPresets())for(const l of L.axes.L.items){
  const recipe=L.replaceToken(L.resolveRecipe(p.id),'L',l.code),theme=L.themeFor(recipe),full=K.layoutTree(root,l.id,new Set(),Infinity,theme.density),folded=K.layoutTree(root,l.id,new Set([id]),Infinity,theme.density);
  for(const [from,to] of [[full,folded],[folded,full]]){
   const n=from.nodes.find(n=>n.id===id),next=to.nodes.find(n=>n.id===id),scale=1.2,point={x:640+(n.x-from.bounds.x-from.bounds.w/2)*scale,y:300+(n.y-from.bounds.y-from.bounds.h/2)*scale};
   const view=M.anchoredView(to.bounds,viewport,point,next,scale),s=Math.min(viewport.width/to.bounds.w,viewport.height/to.bounds.h)*view.zoom;
   assert.ok(Math.abs(s-scale)<1e-8);assert.ok(Math.abs(640-(to.bounds.x+to.bounds.w/2)*s+view.x+next.x*s-point.x)<1e-8);assert.ok(Math.abs(300-(to.bounds.y+to.bounds.h/2)*s+view.y+next.y*s-point.y)<1e-8);
  }
 }
});
test('折叠控件独立于文字编辑，具有可访问名称与触控命中区域',()=>{
 const template=fs.readFileSync('src/player.template.html','utf8'),css=fs.readFileSync('src/player.css','utf8'),app=fs.readFileSync('src/player.js','utf8');
 assert.ok(template.includes('id="branch-toggle"'));assert.ok(template.includes('class="branch-mark" aria-hidden="true"'));assert.ok(app.includes('vector-effect="non-scaling-stroke"'));assert.ok(!css.includes('.map-node:focus .node-shape{stroke-width:3}'));assert.ok(css.includes('44px'));assert.ok(app.includes("setAttribute('aria-expanded'"));assert.ok(app.includes("e.key===' '"));assert.ok(app.includes('空格'));
});
