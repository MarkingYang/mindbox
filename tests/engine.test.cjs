const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const K=require('../src/engine.cjs');
const sample=fs.readFileSync(path.join(__dirname,'../examples/knowledge-work.md'),'utf8');
function flatten(n){return [n,...n.children.flatMap(flatten)];}
test('Markdown 层级及中文标签保持完整',()=>{
 const tree=K.parseMindmap(sample);assert.equal(tree.text,'把信息变成自己的知识');assert.equal(tree.children.length,4);assert.equal(K.descendants(tree),24);assert.equal(tree.children[1].children[0].children[1].text,'回到原文核实');
});
for(const l of K.layouts)test(`${l.name}：所有节点不重叠，折叠后重新布局，内容不变`,()=>{
 const tree=K.parseMindmap(sample),geo=K.layoutTree(tree,l.id),flat=flatten(tree);
 assert.equal(geo.nodes.length,flat.length);assert.equal(geo.edges.length,flat.length-1);
 for(let i=0;i<geo.nodes.length;i++)for(let j=i+1;j<geo.nodes.length;j++){
  const a=geo.nodes[i],b=geo.nodes[j];assert.ok(Math.abs(a.x-b.x)>=(a.w+b.w)/2||Math.abs(a.y-b.y)>=(a.h+b.h)/2,`${a.text} overlaps ${b.text}`);
 }
 const collapsed=K.layoutTree(tree,l.id,new Set([tree.children[0].id]));assert.equal(collapsed.nodes.length,geo.nodes.length-K.descendants(tree.children[0]));assert.equal(flatten(tree).length,25);
});
test('多根、空图、重复代码块和Tab明确报错，节点数不作内容配额',()=>{
 for(const s of ['```mermaid\nmindmap\n```','```mermaid\nmindmap\nA\nB\n```',sample+'\n```mermaid\nmindmap\nB\n```','```mermaid\nmindmap\nA\n\tB\n```'])assert.throws(()=>K.parseMindmap(s));
 assert.equal(K.descendants(K.parseMindmap('```mermaid\nmindmap\nA\n'+Array.from({length:301},(_,i)=>'  节点'+i).join('\n')+'\n```')),301);
});
test('长标签、英文和特殊字符不会丢失或导致节点重叠',()=>{
 const tree=K.parseMindmap('```mermaid\nmindmap\n  root((系统理解))\n    很长的中文节点包含英文 ABC 和括号以及更多需要自动换行的内容\n      <script>alert("test")</script> & 数据\n    第二个分支\n```');
 for(const l of K.layouts){const geo=K.layoutTree(tree,l.id);assert.ok(geo.nodes.every(n=>Number.isFinite(n.x)&&Number.isFinite(n.y)));assert.ok(geo.nodes[1].lines.length>1);}
 assert.equal(K.escapeXML('<script>"&'), '&lt;script&gt;&quot;&amp;');
});
test('目录中的四份内容模板均可读取',()=>{
 for(const file of fs.readdirSync(path.join(__dirname,'../templates')).filter(n=>n.endsWith('.md')))assert.ok(K.parseMindmap(fs.readFileSync(path.join(__dirname,'../templates',file),'utf8')));
});
test('Markdown 元信息控制布局和主题，未知配置明确报错',()=>{
 assert.deepEqual(K.parseOptions('---\nlayout: brace\ntheme: "paper"\n---\n'),{layout:'brace',theme:'paper'});
 assert.deepEqual(K.parseOptions('没有元信息'),{});
 assert.throws(()=>K.parseOptions('---\nlayout: fishbone\n---\n'));
});
test('4 × 6 产物完整，脚本内嵌且不依赖 CDN',()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'../dist/manifest.json'),'utf8'));assert.equal(manifest.length,24);assert.equal(new Set(manifest.map(m=>m.file)).size,24);
 for(const entry of manifest){const html=fs.readFileSync(path.join(__dirname,'../dist',entry.file),'utf8');assert.ok(html.includes(`"layout":"${entry.layout}"`));assert.ok(html.includes(`"theme":"${entry.theme}"`));assert.ok(!/<script[^>]+src=/.test(html));assert.ok(!html.includes('/*__'));}
});
