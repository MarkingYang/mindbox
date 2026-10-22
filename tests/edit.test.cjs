const {test}=require('node:test'),assert=require('node:assert/strict');
const K=require('../src/engine.cjs'),E=require('../src/edit.cjs'),L=K.library,R=require('../src/render.cjs');
const source='---\npreset: P39\nowner: example\n---\n\n# Notes\n\n```mermaid\nmindmap\n  Topic\n    First\n      Evidence\n    Second\n```\n\nSources: keep this exact note.\n';
function labels(n){return[n.text,...n.children.flatMap(labels)];}
test('direct edit operations preserve untouched IDs, source notes, undo and redo',()=>{
 const model=E.create({source});const original=model.root(),first=original.children[0].id,second=original.children[1].id;
 model.rename(first,'Changed');const child=model.add(first,'child','New detail');
 assert.equal(model.find(second).text,'Second');assert.equal(model.find(child).depth,2);
 const next=model.add(first,'sibling','Next point');assert.equal(model.root().children[1].id,next);
 model.remove(first);assert.equal(model.find(child),null);assert.equal(model.find(second).text,'Second');
 assert.ok(model.undo());assert.equal(model.find(child).text,'New detail');assert.ok(model.redo());assert.equal(model.find(child),null);
 const md=model.markdown(L.resolveRecipe('P39').code);assert.ok(md.includes('owner: example'));assert.ok(md.endsWith('Sources: keep this exact note.\n'));assert.deepEqual(labels(K.parseMindmap(md)),labels(model.root()));
});
test('HTML canonical tree wins over stale Markdown, invalid new data does not silently fall back',()=>{
 const model=E.create({source});model.rename(model.root().id,'Current HTML');const document=model.document();
 const restored=E.create({source,document});assert.equal(restored.root().text,'Current HTML');
 assert.equal(E.create({source}).root().text,'Topic','old HTML remains supported');
 const malformed={format:1,root:{...document.root,id:'unsafe" onclick="x'}};
 assert.throws(()=>E.create({source,document:malformed}),/标识/);
});
test('literal labels survive Markdown regeneration without being parsed as Mermaid shapes or directives',()=>{
 for(const text of ['a[shape]','root((literal))','"quoted"','%% comment','--- heading','::class','a `quote` </script> & \\ path','中文 😀']){
  const model=E.create({source});model.rename(model.root().id,text);
  assert.equal(K.parseMindmap(model.markdown()).text,text);
 }
});
test('invalid add/rename/delete leaves state and history intact; IDs never reused after undo',()=>{
 const model=E.create({source}),before=JSON.stringify(model.document());
 for(const fn of [()=>model.rename(model.root().id,''),()=>model.rename(model.root().id,'x'.repeat(501)),()=>model.remove(model.root().id)])assert.throws(fn);
 assert.equal(JSON.stringify(model.document()),before);assert.equal(model.undo(),false);
 const one=model.add(model.root().id,'child','one');model.undo();const two=model.add(model.root().id,'child','two');assert.notEqual(one,two);assert.equal(model.redo(),false);
});
test('one edit model works through all16 styles and five layouts; descendant depth/branch rebuilt',()=>{
 const model=E.create({source}),branch=model.add(model.root().id,'child','Third');model.add(branch,'child','Detail');
 for(const p of L.selectedPresets())for(const layout of L.axes.L.items){
  const r=L.replaceToken(L.resolveRecipe(p.id),'L',layout.code),t=L.themeFor(r),g=K.layoutTree(model.root(),layout.id,new Set(),Infinity,t.density);
  assert.equal(g.nodes.length,6);assert.ok(!/NaN|Infinity/.test(R.svgContent(g,t,layout.id,new Set(),false)));
 }
 const restored=E.create({source,document:model.document()});assert.equal(JSON.stringify(restored.root()),JSON.stringify(model.root()));
});
test('depth protection rejects invalid edits, while growth is not capped at a node quota',()=>{
 const deep='```mermaid\nmindmap\n'+Array.from({length:21},(_,i)=>'  '.repeat(i+1)+'Level '+i).join('\n')+'\n```';
 const model=E.create({source:deep});let n=model.root();while(n.children.length)n=n.children[0];const before=model.markdown();
 assert.throws(()=>model.add(n.id,'child','Too deep'),/20/);assert.equal(model.markdown(),before);
 const wide=E.create({source:'```mermaid\nmindmap\n  Root\n'+Array.from({length:299},(_,i)=>'    Item '+i).join('\n')+'\n```'});
 const added=wide.add(wide.root().id,'child','继续补充');assert.equal(wide.find(added).text,'继续补充');assert.equal(K.descendants(wide.root()),300);
});

test('Markdown编辑器完整替换备注，HTML节点编辑与再次保存保持相同文字、顺序和层级',()=>{
 const shape=n=>({text:n.text,children:n.children.map(shape)});
 for(const preset of L.selectedPresets()){
  const m=E.create({source}),branch=m.root().children[0].id;
  m.rename(branch,'HTML直接修改');m.add(branch,'child','新建细节');m.remove(m.root().children[1].id);
  const fromHTML=m.markdown(preset.code);assert.deepEqual(shape(K.parseMindmap(fromHTML)),shape(m.root()));
  // The editor shows the entire source: removing all notes must remove them, not restore old context.
  const edited='```mermaid\nmindmap\n  更新后的主题\n    HTML直接修改\n      新建细节\n      Markdown补充\n    最后一步\n```';
  m.revise(edited);assert.equal(m.root().children[0].id,branch);assert.ok(!m.markdown().includes('Sources:'));assert.ok(!m.markdown().includes('owner:'));
  assert.deepEqual(shape(K.parseMindmap(m.markdown(preset.code))),shape(m.root()));
  const restored=E.create({source:m.markdown(preset.code),document:m.document()});assert.deepEqual(restored.document(),m.document());assert.deepEqual(shape(K.parseMindmap(restored.markdown())),shape(m.root()));
  assert.ok(m.undo());assert.ok(m.markdown().includes('Sources: keep this exact note.'));assert.ok(m.redo());assert.ok(!m.markdown().includes('Sources:'));
 }
 // A CLI/AI fence-only patch deliberately retains unrelated context by default.
 assert.ok(E.revise({source},'```mermaid\nmindmap\n  CLI更新\n```').source.includes('Sources: keep this exact note.'));
});

test('Markdown批量编辑和节点编辑共享内容、来源、稳定身份与撤销重做',()=>{
 for(const preset of L.selectedPresets()){
  const m=E.create({source}),first=m.root().children[0].id;
  m.rename(first,'直接改字');const before=m.markdown(preset.code);
  const next=before.replace('    直接改字','    直接改字\n      新的细节').replace('Sources: keep this exact note.','Sources: revised note.');
  assert.ok(m.revise(next));assert.equal(m.root().children[0].id,first);assert.equal(m.find(first).children[0].text,'新的细节');assert.ok(m.markdown().includes('Sources: revised note.'));
  assert.ok(m.undo());assert.ok(!m.find(first).children.some(n=>n.text==='新的细节'));assert.ok(m.markdown().includes('Sources: keep this exact note.'));
  assert.ok(m.redo());assert.equal(m.find(first).children[0].text,'新的细节');assert.ok(m.markdown().includes('Sources: revised note.'));
  const current=JSON.stringify(m.document()),md=m.markdown();assert.throws(()=>m.revise('未完成的草稿'));assert.equal(JSON.stringify(m.document()),current);assert.equal(m.markdown(),md);
  assert.equal(m.revise(m.markdown()),false);
 }
});
test('保存的未完成Markdown草稿不替换有效导图，草稿字段受长度和类型约束',()=>{
 const boot={source,markdownDraft:'```mermaid\nmindmap\n',editorView:'markdown'};assert.equal(E.create(boot).root().text,'Topic');
 for(const draft of [null,{},'x'.repeat(120001)])assert.throws(()=>E.create({...boot,markdownDraft:draft}),/Markdown 草稿/);
});
