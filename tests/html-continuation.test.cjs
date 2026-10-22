const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process');
const E=require('../src/edit.cjs'),K=require('../src/engine.cjs'),D=require('../src/document.cjs'),L=K.library;
const runner=path.resolve(__dirname,'../skills/mindbox/scripts/render.cjs');
const source='```mermaid\nmindmap\n  Before\n    Keep\n    Delete\n```\n\nEvidence: actual source note.\n';
test('saved HTML can be extracted and restyled with all current edits and stable node IDs',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mindbox-html-'));
 try {
  const model=E.create({source}),root=model.root().id,kept=model.root().children[0].id,removed=model.root().children[1].id;
  model.rename(root,'Current HTML');model.rename(kept,'Keep <script> & "quotes"');model.remove(removed);const child=model.add(kept,'child','New in HTML');
  const view={collapsed:[kept],zoom:1.4,x:20,y:-10},input=path.join(dir,'current.html');
  // Deliberately stale embedded source: the canonical document must take precedence.
  fs.writeFileSync(input,D.generate({source,document:model.document(),recipeCode:L.resolveRecipe('P39').code,selectedRecipeCode:L.resolveRecipe('P39').code,view,player:true,standalone:true}));
  const run=args=>cp.spawnSync(process.execPath,[runner,...args],{encoding:'utf8'});
  const extracted=run(['--input',input,'--extract']);assert.equal(extracted.status,0,extracted.stderr);assert.equal(K.parseMindmap(extracted.stdout).text,'Current HTML');assert.ok(extracted.stdout.includes('New in HTML'));assert.ok(!extracted.stdout.includes('    Delete'));assert.ok(extracted.stdout.includes('Evidence: actual source note.'));
  const output=path.join(dir,'restyled.html'),result=run(['--input',input,'--output',output,'--switch-to','P67']);assert.equal(result.status,0,result.stderr);
  const saved=fs.readFileSync(output,'utf8'),boot=JSON.parse(saved.match(/window\.ATLAS_BOOT=([\s\S]*?);<\/script>/)[1]);
  assert.equal(boot.document.root.text,'Current HTML');assert.deepEqual(boot.view,view);assert.equal(E.create(boot).find(child).text,'New in HTML');assert.equal(boot.recipeCode,L.resolveRecipe('P67').code);
  assert.equal(JSON.parse(result.stdout).nodes,3);assert.ok(!saved.includes('Keep <script>'));
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('HTML extraction reads authoritative data without executing supplied code',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mindbox-extract-'));
 try{
  const input=path.join(dir,'hostile.html');fs.writeFileSync(input,'<script id="atlas-boot">window.ATLAS_BOOT=(()=>{throw Error("executed")})()</script>');
  const result=cp.spawnSync(process.execPath,[runner,'--input',input,'--extract'],{encoding:'utf8'});assert.notEqual(result.status,0);assert.match(result.stderr,/数据无法读取/);assert.ok(!result.stdout);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('same-topic revision updates the existing HTML and preserves surviving IDs, style and source notes',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mindbox-revise-'));
 try{
  const input=path.join(dir,'topic.html'),model=E.create({source}),keep=model.root().children[0].id,recipe=L.resolveRecipe('P73'),view={collapsed:[keep],zoom:1.3,x:4,y:8};
  fs.writeFileSync(input,D.generate({source,document:model.document(),recipeCode:recipe.code,view,player:true,standalone:true}));
  const revised='```mermaid\nmindmap\n  Before\n    Inserted\n    Keep\n      More detail\n    Delete\n```';
  const result=cp.spawnSync(process.execPath,[runner,'--input',input,'--revise','-'],{encoding:'utf8',input:revised});assert.equal(result.status,0,result.stderr);
  const receipt=JSON.parse(result.stdout);assert.equal(receipt.html,input);assert.equal(receipt.revised,true);assert.equal(receipt.preset,'P73');
  const saved=fs.readFileSync(input,'utf8'),boot=JSON.parse(saved.match(/window\.ATLAS_BOOT=([\s\S]*?);<\/script>/)[1]),updated=E.create(boot);
  assert.equal(updated.find(keep).text,'Keep');assert.equal(updated.find(keep).children[0].text,'More detail');assert.deepEqual(boot.view,view);assert.ok(boot.source.includes('Evidence: actual source note.'));
  assert.deepEqual(fs.readdirSync(dir).sort(),['topic.html','topic.md']);
  const invalid=cp.spawnSync(process.execPath,[runner,'--input',input,'--revise','-'],{encoding:'utf8',input:'invalid map'});assert.notEqual(invalid.status,0);assert.equal(fs.readFileSync(input,'utf8'),saved);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('an explicitly separate revision leaves the original topic untouched',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mindbox-variant-'));
 try{
  const input=path.join(dir,'original.html'),output=path.join(dir,'variant.html'),original=D.generate({source,recipeCode:L.resolveRecipe('P39').code,player:true,standalone:true});fs.writeFileSync(input,original);
  const result=cp.spawnSync(process.execPath,[runner,'--input',input,'--revise','-','--output',output,'--preset','P73'],{input:'```mermaid\nmindmap\n  Requested separate variant\n    A point\n```',encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);assert.equal(JSON.parse(result.stdout).preset,'P73');assert.equal(fs.readFileSync(input,'utf8'),original);assert.ok(fs.existsSync(output));
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});

test('a full Markdown revision without frontmatter updates an existing styled HTML',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mindbox-full-revise-'));
 try{
  const input=path.join(dir,'topic.html'),recipe=L.resolveRecipe('P68');
  fs.writeFileSync(input,D.generate({source:D.withRecipe(source,recipe),recipeCode:recipe.code,player:true,standalone:true}));
  const revised='# New context\n\nUpdated source note.\n\n```mermaid\nmindmap\n  Before\n    Keep\n    A new question？\n```\n';
  const result=cp.spawnSync(process.execPath,[runner,'--input',input,'--revise','-'],{encoding:'utf8',input:revised});
  assert.equal(result.status,0,result.stderr);
  const boot=JSON.parse(fs.readFileSync(input,'utf8').match(/window\.ATLAS_BOOT=([\s\S]*?);<\/script>/)[1]);
  assert.equal(boot.recipeCode,recipe.code);assert.ok(boot.source.includes('Updated source note.'));assert.ok(!boot.source.includes('Evidence: actual source note.'));
  assert.deepEqual(E.create(boot).root().children.map(n=>n.text),['Keep','A new question？']);
  assert.equal(D.withRecipe(boot.source,recipe),boot.source);
  assert.equal(E.create(boot).markdown(recipe.code),boot.source);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});

test('saved incomplete Markdown survives extraction and restyling; an AI revision clears the draft',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mindbox-draft-'));
 try{
  const input=path.join(dir,'draft.html'),output=path.join(dir,'restyled.html'),draft='```mermaid\nmindmap\n  还在想\n',recipe=L.resolveRecipe('P67');
  fs.writeFileSync(input,D.generate({source,recipeCode:recipe.code,editorView:'markdown',markdownDraft:draft,player:true,standalone:true}));
  const run=args=>cp.spawnSync(process.execPath,[runner,...args],{encoding:'utf8'});
  assert.equal(run(['--input',input,'--extract']).stdout,draft);
  const result=run(['--input',input,'--output',output,'--switch-to','P39']);assert.equal(result.status,0,result.stderr);assert.equal(JSON.parse(result.stdout).pendingMarkdown,true);
  const boot=JSON.parse(fs.readFileSync(output,'utf8').match(/window\.ATLAS_BOOT=([\s\S]*?);<\/script>/)[1]);assert.equal(boot.markdownDraft,draft);assert.equal(boot.editorView,'markdown');assert.equal(E.create(boot).root().text,'Before');
  const corrected=path.join(dir,'corrected.md');fs.writeFileSync(corrected,draft+'    想明白的一点\n```');const updated=run(['--input',input,'--revise',corrected]);assert.equal(updated.status,0,updated.stderr);assert.equal(JSON.parse(updated.stdout).pendingMarkdown,false);
  const next=JSON.parse(fs.readFileSync(input,'utf8').match(/window\.ATLAS_BOOT=([\s\S]*?);<\/script>/)[1]);assert.equal(next.markdownDraft,undefined);assert.equal(next.editorView,'map');assert.equal(next.document.root.text,'还在想');
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
