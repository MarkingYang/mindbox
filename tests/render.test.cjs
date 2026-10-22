const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const K=require('../src/engine.cjs'),L=K.library,R=require('../src/render.cjs');
const source=fs.readFileSync(require('node:path').join(__dirname,'../examples/knowledge-work.md'),'utf8'),root=K.parseMindmap(source);
const render=(r,collapsed=new Set())=>{const t=L.themeFor(r),g=K.layoutTree(root,r.tokens.L.id,collapsed,Infinity,t.density);return{t,g,svg:R.svgContent(g,t,r.tokens.L.id,collapsed,false)}};

test('节点形态不为左右或向右展开添加分组括号',()=>{
 for(const layout of ['L01','L02']){const {svg}=render(L.replaceToken(L.resolveRecipe('P67'),'L',layout));assert.ok(!svg.includes('journal-group'));}
});
test('字体气质与画布材质不会被手绘节点替换',()=>{
 for(const font of L.selectedItems('T')){const r=L.replaceToken(L.resolveRecipe('P67'),'T',font.code);assert.equal(L.themeFor(r).font,font.font);}
 const a=L.resolveRecipe('P67'),b=L.replaceToken(a,'N','N19');assert.deepEqual(R.canvasPattern(L.themeFor(a)),R.canvasPattern(L.themeFor(b)));
});
test('铅笔连线服从配色，不被涂鸦节点改成固定黑色',()=>{
 const {svg,t}=render(L.resolveRecipe('P67'));
 const first=svg.match(/<g class="pencil-edge"><path [^>]+/)[0];assert.ok(first.includes(`stroke="${t.palette[0]}"`));
});
test('涂鸦标题的可见前纸框沿布局给出的完整边界绘制',()=>{
 const {svg,g}=render(L.resolveRecipe('P67')),n=g.nodes[0],d=svg.match(/<path d="([^"]+)"[^>]+class="node-shape journal-paper"/)[1];
 assert.equal(d,L.pencilBox(n.x-n.w/2,n.y-n.h/2,n.w,n.h,3458));
});

test('五种结构×七种节点×有效连线×三档疏密保持映射、节点与关系数',()=>{
 let checked=0;
 for(const l of L.selectedItems('L'))for(const n of L.selectedItems('N'))for(const e of L.selectedItems('E'))for(const d of L.selectedItems('D')){
  if(!L.allowedEdges(l.id).includes(e.code))continue;
  const r=L.resolveRecipe([l.code,n.code,e.code,'C43','B40','T09',d.code].join('-')),{svg,g}=render(r);
  assert.equal(g.layout,l.id);assert.equal((svg.match(/class="map-node"/g)||[]).length,25);
  assert.ok(!/NaN|Infinity/.test(svg));assert.ok(!svg.includes('journal-group'));
  const expectedGroups=new Map();g.edges.forEach(edge=>expectedGroups.set(edge.from,(expectedGroups.get(edge.from)||0)+1));
  assert.equal((svg.match(/class="structural-brace"/g)||[]).length,l.id==='brace'?[...expectedGroups.values()].filter(x=>x>1).length:0);
  assert.equal((svg.match(/class="pencil-edge"/g)||[]).length,e.code==='E09'?g.edges.length:0);
  const meta=R.svgAttributes(r);for(const axis of L.order)assert.equal(meta['data-axis-'+axis.toLowerCase()],r.tokens[axis].code);
  assert.equal(meta['data-layout'],l.id);checked++;
 }
 assert.equal(checked,420);
});

test('不同结构切换只在必要时适配E，N/C/B/T/D保持，错误映射被拒绝',()=>{
 const a=L.resolveRecipe('P67');
 for(const l of L.selectedItems('L')){
  const r=L.replaceToken(a,'L',l.code);
  for(const axis of ['N','C','B','T','D'])assert.equal(r.tokens[axis].code,a.tokens[axis].code);
  assert.ok(L.allowedEdges(l.id).includes(r.tokens.E.code));
 }
 const {g,t}=render(a);assert.throws(()=>R.svgContent(g,t,'right',new Set(),false),/不一致/);
 assert.throws(()=>R.svgContent({...g,layout:'right'},t,'balanced',new Set(),false),/不一致/);
});

test('涂鸦在八配色×八画布上都保留文字对比度，T独立，D保留间距',()=>{
 const Doodle=require('../src/doodle.cjs');
 for(const c of L.selectedItems('C'))for(const b of L.selectedItems('B')){
  const r=L.resolveRecipe(`L01-N18-E09-${c.code}-${b.code}-T09-D03`),{g,t,svg}=render(r);
  assert.ok(svg.includes(Doodle.colors(t).accent));
  for(const n of g.nodes){const style=R.nodeStyle(n,t),bg=style.fill==='none'?t.bg:style.fill;assert.ok(L.contrast(bg,style.text)>=4.5,`${c.code}/${b.code}/${n.id}`);}
 }
 for(const f of L.selectedItems('T')){const r=L.replaceToken(L.resolveRecipe('P67'),'T',f.code),{svg,t}=render(r);assert.equal(t.font,f.font);assert.ok(svg.includes(`font-family="${K.escapeXML(f.font)}"`));}
 const spans=L.selectedItems('D').map(d=>{const {g}=render(L.replaceToken(L.resolveRecipe('P67'),'D',d.code));return g.bounds.h;});assert.ok(spans[0]<spans[1]&&spans[1]<spans[2]);
 const navy=Doodle.colors(L.themeFor(L.replaceToken(L.resolveRecipe('P67'),'C','C03'))),crayon=Doodle.colors(L.themeFor(L.resolveRecipe('P67')));assert.notEqual(navy.accent,crayon.accent);
});

test('三十二枚原创笔触可独立组合，十四种姿态不同且折叠前后保留稳定造型',()=>{
 const Doodle=require('../src/doodle.cjs');assert.equal(Doodle.parts.length,32);
 const t=L.themeFor(L.resolveRecipe('P67')),o={...Doodle.colors(t),x:0,y:0,w:150,h:60,seed:6};
 for(const part of Doodle.parts){const svg=Doodle.renderPart(part.id,o);assert.ok(svg.includes(`data-doodle-part="${part.id}"`));assert.equal(svg,Doodle.renderPart(part.id,o));assert.ok(!/NaN|Infinity/.test(svg));}
 assert.equal(new Set(Doodle.parts.filter(p=>p.id.startsWith('mascot')).map(p=>Doodle.renderPart(p.id,o))).size,14);
 assert.equal(new Set(Doodle.parts.map(p=>p.id)).size,32);
 assert.deepEqual(Doodle.families.map(f=>f.parts.length),[9,9,14]);
 const displayed=Doodle.families.flatMap(f=>f.parts);assert.equal(new Set(displayed).size,32);assert.deepEqual(displayed.slice().sort(),Doodle.parts.map(p=>p.id).sort());
 assert.ok(Doodle.families.find(f=>f.id==='actor').parts.every(id=>id.startsWith('mascot-')));
 for(const p of Doodle.parts)assert.ok(p.hint.length>3);
 assert.throws(()=>Doodle.renderPart('missing',o),/未知涂鸦/);
 const r=L.resolveRecipe('P67'),a=render(r),b=render(r,new Set([root.children[0].id]));
 const normalize=n=>({...n,x:0,y:0});
 const id=root.children[1].id;assert.equal(Doodle.renderNode(normalize(a.g.nodes.find(n=>n.id===id)),t),Doodle.renderNode(normalize(b.g.nodes.find(n=>n.id===id)),t));
});

test('组件册排序不改变导图造型，多行末端的色标跟随最后一行',()=>{
 const Doodle=require('../src/doodle.cjs'),{g,t}=render(L.resolveRecipe('P67')),before=g.nodes.map(n=>Doodle.renderNode(n,t));
 Doodle.parts.reverse();Doodle.families.reverse();
 try{assert.deepEqual(g.nodes.map(n=>Doodle.renderNode(n,t)),before);}finally{Doodle.parts.reverse();Doodle.families.reverse();}
 // id d has a seed divisible by four: it previously framed terminal text.
 const leaf={...g.nodes.find(n=>n.depth===2),id:'d',children:[],lines:['第一行','第二行','第三行'],lineHeight:21,fontSize:14,h:87};
 const svg=Doodle.renderNode(leaf,t);assert.ok(!svg.includes('class="node-shape'));
 const marker=svg.match(/data-doodle-part="(?:marker|double-line)"[\s\S]*?<path d="M([^,]+),([^QqLl ]+)/);assert.ok(marker);
 assert.ok(Number(marker[2])>=leaf.y+21+7,'笔迹在最后一行下沿，而非穿过中间一行');
 assert.ok(Doodle.renderNode({...leaf,children:[{id:'detail'}]},t).includes('class="node-shape'),'同级中间主题仍可使用纸笺承载下一层');
});

test('新增笔触参与真实导图，紧凑场景不在分支上叠小人，正文不生成额外语义',()=>{
 const Doodle=require('../src/doodle.cjs'),r=L.resolveRecipe('P67'),a=render(r);
 const content=['```mermaid','mindmap','  root((让想法慢慢长出来))'];
 for(let i=0;i<18;i++){content.push('    分支'+i);for(let j=0;j<12;j++)content.push('      片段'+i+'-'+j);}
 content.push('```');const tree=K.parseMindmap(content.join('\n')),t=L.themeFor(r),g=K.layoutTree(tree,'balanced',new Set(),Infinity,t.density),composed=R.svgContent(g,t,'balanced',new Set(),false);
 for(const id of Doodle.parts.map(p=>p.id))assert.ok(composed.includes(`data-doodle-part="${id}"`),id+'参与真实布局渲染');
 for(const l of L.selectedItems('L')){const recipe=L.replaceToken(r,'L',l.code),theme=L.themeFor(recipe),geo=K.layoutTree(tree,l.id,new Set(),Infinity,theme.density),svg=R.svgContent(geo,theme,l.id,new Set(),false);assert.ok(!/NaN|Infinity/.test(svg));assert.equal((svg.match(/class="node-label"/g)||[]).length,235);}
 assert.ok((a.svg.match(/class="doodle-mascot"/g)||[]).length<=8,'25节点范例保留呼吸感');
 const compact=render(L.replaceToken(r,'D','D01'));
 assert.equal((compact.svg.match(/class="doodle-mascot"/g)||[]).length,1);
 assert.equal((a.svg.match(/class="node-label"/g)||[]).length,25);
 assert.ok(!/<text[\s>]/.test(Doodle.renderPart('speech',{x:0,y:0,w:120,h:50})));
});

test('括号与提纲的连线名称映射实际结构，其余结构保持原连线名称',()=>{
 assert.equal(L.edgeLabel('brace','E01'),'实线括号');assert.equal(L.edgeLabel('outline','E02'),'提纲折线');
 assert.equal(L.edgeLabel('balanced','E01'),'轻柔曲线');assert.equal(L.edgeLabel('down','E09'),'铅笔随行线');
});

test('布局引擎和样式库共用五种结构的名称与固定代号',()=>{
 for(const l of K.layouts){const item=L.axes.L.items.find(x=>x.id===l.id);assert.ok(item);assert.equal(l.name,item.name);assert.equal(l.code,item.code);}
});
