'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
test('UTF-8 BOM files and stdin select the same preset and preserve content',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mindbox-bom-')),runner=path.join(root,'skills/mindbox/scripts/render.cjs');
 const content='---\npreset: MMH0S8\n---\n\n```mermaid\nmindmap\n  文件里的想法\n    一个小问题\n```\n';
 const run=(args,input)=>cp.spawnSync(process.execPath,[runner,...args],{encoding:'utf8',input});
 try{
  fs.writeFileSync(path.join(dir,'input.md'),'\uFEFF'+content);
  const a=run(['--input',path.join(dir,'input.md'),'--output',path.join(dir,'file.html')]),b=run(['--input','-','--output',path.join(dir,'stdin.html')],'\uFEFF'+content);
  assert.equal(a.status,0,a.stderr);assert.equal(b.status,0,b.stderr);assert.equal(JSON.parse(a.stdout).uid,'MMH0S8');assert.equal(JSON.parse(a.stdout).uid,JSON.parse(b.stdout).uid);
  assert.equal(fs.readFileSync(path.join(dir,'file.html'),'utf8'),fs.readFileSync(path.join(dir,'stdin.html'),'utf8'));
  fs.writeFileSync(path.join(dir,'plain.md'),'\uFEFF```mermaid\nmindmap\n  无元信息也能读\n```\n');
  const plain=run(['--input',path.join(dir,'plain.md'),'--output',path.join(dir,'plain-output.html')]);assert.equal(plain.status,0,plain.stderr);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('rebuilding showcase removes retired outputs and refreshes legacy example URLs',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mindbox-showcase-'));
 try{
  fs.cpSync(path.join(root,'examples'),path.join(dir,'examples'),{recursive:true});
  fs.mkdirSync(path.join(dir,'docs/images'),{recursive:true});fs.mkdirSync(path.join(dir,'dist/showcase'),{recursive:true});
  fs.copyFileSync(path.join(root,'dist/index.html'),path.join(dir,'dist/index.html'));
  const out=path.join(dir,'dist/showcase');fs.writeFileSync(path.join(out,'retired.html'),'obsolete');fs.writeFileSync(path.join(out,'lesson-that-invites.html'),'old reader');
  require('../scripts/showcase.cjs')(dir);
  assert.ok(!fs.existsSync(path.join(out,'retired.html')),'obsolete generated pages must not be staged');
  const old=fs.readFileSync(path.join(out,'lesson-that-invites.html'),'utf8');
  const boot=JSON.parse(old.match(/window\.ATLAS_BOOT=([\s\S]*?);<\/script>/)[1]);
  assert.equal(require('../src/engine.cjs').parseMindmap(boot.source).text,'一节课，怎样让学生先开口');
  assert.equal(boot.recipeCode,require('../src/library.cjs').resolveRecipe('MMH0S8').code);
  assert.ok(old.includes('scope.FushengKit'),'old URL must use the current renderer');
  assert.ok(old.includes('浮生小趣'));assert.ok(fs.existsSync(path.join(out,'study-notes.html')));
  assert.ok(fs.readFileSync(path.join(out,'study-notes.html')).equals(fs.readFileSync(path.join(out,'book-to-action.html'))));
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
