const {test}=require('node:test'),assert=require('node:assert/strict');
const K=require('../src/engine.cjs'),L=K.library,M=require('../src/media.cjs'),D=require('../src/document.cjs');
const source='```mermaid\nmindmap\n  root((Project map))\n    Explore\n      Context\n      Goals\n    Plan\n      Next step\n      Review\n```',tree=K.parseMindmap(source);
test('16套阅读器只保留用户所选完整样式，Markdown作为编辑视图不成为另一种配方',()=>{
 for(const r of [...L.selectedPresets().map(p=>L.resolveRecipe(p.id)),L.resolveRecipe('L01-N18-E09-C43-B40-T09-D03')]){
  const c=M.choices(r);assert.equal(c.length,1);assert.equal(c[0].code,r.code);
 }
 assert.deepEqual(M.choices(L.resolveRecipe('P39')).map(x=>x.preset),['P39']);
});
test('阅读器仅保留演示和导出操作，直接编辑节点，不再暴露导入',()=>{
 const fs=require('node:fs'),path=require('node:path'),html=fs.readFileSync(path.join(__dirname,'../src/player.template.html'),'utf8');
 assert.deepEqual([...html.matchAll(/data-export="([^"]+)"/g)].map(m=>m[1]),['png','animated-webp']);
 assert.ok(!html.includes('id="import-md"'));assert.ok(!html.includes('type="file"'));
 assert.ok(html.includes('id="node-editor"'));assert.ok(html.includes('id="save-html"'));assert.ok(html.includes('id="edit-hint"'));
 assert.ok(html.indexOf('id="play"')<html.indexOf('id="export-menu-toggle"'));
});
test('深层内容在16套样式中完整渲染，五种结构均无重叠，阅读覆盖每一层',()=>{
 const lines=['```mermaid','mindmap','  深层判断'];
 for(let i=1;i<=20;i++)lines.push('  '.repeat(i+1)+'判断层 '+i);
 lines.push('```');const deep=K.parseMindmap(lines.join('\n'));
 for(const p of L.selectedPresets()){
  const scene=M.scene(deep,L.resolveRecipe(p.id));assert.equal(scene.geo.nodes.length,21);assert.equal(Math.max(...scene.geo.nodes.map(n=>n.depth)),20);
  assert.equal((M.svg(scene).match(/class="map-node"/g)||[]).length,21);assert.equal(new Set(M.readingSteps(scene.geo).flatMap(s=>s.targets)).size,21);
  const a=scene.geo.nodes;for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++)assert.ok(Math.abs(a[i].x-a[j].x)>=(a[i].w+a[j].w)/2||Math.abs(a[i].y-a[j].y)>=(a[i].h+a[j].h)/2,p.id);
 }
 assert.throws(()=>K.parseMindmap(lines.slice(0,-1).concat('  '.repeat(22)+'超限','```').join('\n')),/20 层/);
});
test('网站无公开自定义入口，内部七维控件及兼容接口仍保留',()=>{
 const fs=require('node:fs'),html=fs.readFileSync(require('node:path').join(__dirname,'../src/index.html'),'utf8');
 const section=html.match(/<details\b[^>]*id="customize"[^>]*>/)[0];assert.ok(/\bhidden\b/.test(section)&&/\binert\b/.test(section));
 assert.ok(!html.includes('href="#customize"'));assert.ok(!html.includes('只把字体换成文楷'));assert.ok(html.includes('id="preset-scenarios"'));assert.ok(html.includes('id="component-controls"'));
 const r=L.replaceToken(L.resolveRecipe('P67'),'T','T09');assert.equal(r.tokens.T.code,'T09');assert.equal(L.resolveRecipe(r.code).code,r.code);
});
test('按需用途说明仍覆盖16套，普通入口保留所有默认模板',()=>{
 const fs=require('node:fs'),path=require('node:path'),skill=fs.readFileSync(path.join(__dirname,'../skills/mindbox/SKILL.md'),'utf8'),guide=fs.readFileSync(path.join(__dirname,'../skills/mindbox/references/style-guide.md'),'utf8');
 assert.deepEqual([...guide.matchAll(/\| (MM[A-Z0-9]{4}) /g)].map(m=>m[1]).sort(),L.selectedPresets().map(p=>p.uid).sort());
 for(const p of L.selectedPresets())assert.ok(skill.includes(p.uid));
});
test('阅读顺序按内容DFS，长图分组覆盖所有节点与祖先，不重复目标',()=>{
 for(const layout of L.axes.L.items){const r=L.replaceToken(L.resolveRecipe('P61'),'L',layout.code),s=M.scene(tree,r),steps=M.readingSteps(s.geo);assert.deepEqual(steps.map(x=>x.label),['Project map','Explore','Context','Goals','Plan','Next step','Review']);
  for(const step of steps){assert.ok(step.active.includes(tree.id));const b=M.focusBounds(s.geo,step);assert.ok(b.w>0&&b.h>0);}
 }
 const large=K.parseMindmap('```mermaid\nmindmap\n  root((很多想法))\n'+Array.from({length:299},(_,i)=>'    项目 '+i).join('\n')+'\n```'),s=M.scene(large,L.resolveRecipe('P61')),steps=M.readingSteps(s.geo);
 assert.ok(steps.length>24);assert.equal(steps.flatMap(x=>x.targets).length,300);assert.equal(new Set(steps.flatMap(x=>x.targets)).size,300);
 const dim=M.dimensions(s.geo.bounds);assert.ok(dim.width<=8192&&dim.height<=8192);assert.ok(dim.width*dim.height<=16010000);
});
test('SVG为完整矢量，动画含阅读序列且标签转义，16套都可输出',()=>{
 for(const p of L.selectedPresets()){const s=M.scene(tree,L.resolveRecipe(p.id)),plain=M.svg(s),animated=M.svg(s,'',true);assert.equal((plain.match(/class="map-node"/g)||[]).length,7);assert.ok(animated.includes('<animate '));assert.ok(animated.includes('repeatCount="indefinite"'));assert.ok(!animated.includes('<image'));assert.ok(!plain.includes('role="button"'));}
 const special=K.parseMindmap(source.replace('Project map','A & B <x>'));assert.ok(M.svg(M.scene(special,L.resolveRecipe('P61'))).includes('A &amp; B &lt;x&gt;'));
 const xml=M.svg(M.scene(special,L.resolveRecipe('P61')),'/* Copyright A & B <font> ]]> */',true);
 const {SaxesParser}=require('saxes');new SaxesParser({xmlns:true}).write(xml).close();
});
test('Skill阅读器无图库/品牌宣传/组合工作台，保留可编辑内容与离线字体',()=>{
 const html=D.generate({source,recipeCode:L.resolveRecipe('P67').code,standalone:true,player:true});
 assert.ok(html.includes('id="stage"'));assert.ok(!html.includes('id="catalogue"'));assert.ok(!html.includes('id="component-controls"'));assert.ok(html.includes('data:font/woff2;base64,'));assert.ok(html.includes('"player":true'));assert.ok(!/<script[^>]+src=/.test(html));assert.ok(!/<link[^>]+(?:stylesheet|preload)/.test(html));assert.ok(!/url\((?:https?:|fonts\/)/.test(html));assert.ok(!/\b(?:fetch|XMLHttpRequest|WebSocket)\s*\(/.test(html));
});
test('单文件仅内嵌当前样式与中文回退字体，旧双样式数据以当前配方为准',()=>{
 const html=D.generate({source,recipeCode:L.resolveRecipe('P39').code,standalone:true,player:true});
 const css=html.match(/<style>([\s\S]*?)<\/style>/)[1];
 assert.ok(css.includes("font-family:'Atlas Lora'"));assert.ok(css.includes("font-family:'Atlas Business'"));assert.ok(!css.includes("font-family:'Atlas Brush'"));
 assert.ok(Buffer.byteLength(html)<2000000,'阅读器无需携带完整九款字库');
 const saved=D.generate({source,recipeCode:L.resolveRecipe('P61').code,selectedRecipeCode:L.resolveRecipe('P39').code,standalone:true,player:true});
 assert.ok(!saved.match(/<style>([\s\S]*?)<\/style>/)[1].includes("font-family:'Atlas Lora'"));
});
test('WebP动画容器包含真实多帧、尺寸、时长、偶数填充，拒绝伪装的PNG',()=>{
 const bytes=Uint8Array.from(Buffer.from('UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA','base64'));
 const out=M.animatedWebP([{bytes,duration:300},{bytes,duration:900}],1,1),b=Buffer.from(out);assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(b.readUInt32LE(4)+8,b.length);assert.equal(b.toString('ascii',12,16),'VP8X');assert.ok(b[20]&2);
 let at=12,frames=[];while(at<b.length){let name=b.toString('ascii',at,at+4),length=b.readUInt32LE(at+4);if(name==='ANMF')frames.push(b.readUIntLE(at+20,3));at+=8+length+(length%2);}assert.deepEqual(frames,[300,900]);assert.equal(at,b.length);
 assert.throws(()=>M.animatedWebP([{bytes:Uint8Array.of(137,80,78,71),duration:900}],1,1),/未提供WebP/);assert.throws(()=>M.animatedWebP([{bytes,duration:0}],1,1),/时长/);assert.throws(()=>M.animatedWebP([],1,1),/尺寸或帧数/);
});
test('export pixel budgets improve text density while bounding large canvases',()=>{
 const bounds={w:2800,h:1100},png=M.exportDimensions(bounds,false),animated=M.exportDimensions(bounds,true);
 assert.ok(png.width>=5600&&png.width<10000);assert.equal(animated.width,1920);
 for(const [size,side,pixels] of [[png,32760,64000000],[animated,2560,4000000]]){assert.ok(size.width<=side&&size.height<=side);assert.ok(size.width*size.height<=pixels);}
 const huge=M.exportDimensions({w:100000,h:80000},false);assert.ok(huge.width*huge.height<=64000000);
 const scene=M.scene(tree,L.resolveRecipe('P39')),svg=M.svg(scene,'',false,animated);
 assert.ok(svg.includes(`width="${animated.width}" height="${animated.height}"`));assert.ok(svg.includes(`viewBox="${scene.geo.bounds.x}`));
});

test('左右排版重排分支后，16套样式与五种结构仍按作者顺序演示',()=>{
 const input='```mermaid\nmindmap\n  一个小故事\n    第一步捡种子\n      一个烦恼\n      一个愿望\n    第二步反着想\n      换个角度\n      碰个组合\n    第三步画出来\n      做个玩具\n      画张纸片\n    第四步试一点\n      叫个搭子\n      留个问题\n```',root=K.parseMindmap(input),ids=[];(function visit(n){ids.push(n.id);n.children.forEach(visit)})(root);
 for(const p of L.selectedPresets())for(const layout of L.axes.L.items){const r=L.replaceToken(L.resolveRecipe(p.id),'L',layout.code),scene=M.scene(root,r),steps=M.readingSteps(scene.geo);assert.deepEqual(steps.flatMap(s=>s.targets),ids,p.id+'/'+layout.id);}
});
