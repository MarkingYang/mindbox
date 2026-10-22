const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {SaxesParser}=require('saxes'),K=require('../src/engine.cjs'),D=require('../src/document.cjs');
const root=path.resolve(__dirname,'..');
test('Skill ZIP is reproducible from the committed package resources',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mindbox-zip-'));
 try {
  const file=path.join(dir,'mindbox.zip');require('../scripts/zip.cjs').zipDirectory(path.join(root,'skills/mindbox'),file);
  assert.ok(fs.readFileSync(file).equals(fs.readFileSync(path.join(root,'dist/downloads/mindbox.zip'))));
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('sixteen public examples contain editable source and use the same standalone renderer',()=>{
 for(const sample of require('../examples/catalogue.json')){
  const source=fs.readFileSync(path.join(root,'examples',sample.source),'utf8'),recipe=K.library.resolveRecipe(sample.preset),normalized=D.withRecipe(source,recipe);
  assert.ok(K.descendants(K.parseMindmap(source))>5);
  assert.equal(fs.readFileSync(path.join(root,'dist/showcase',sample.id+'.html'),'utf8'),D.generate({source:normalized,recipeCode:recipe.code,standalone:true,player:true}));
  assert.equal(fs.readFileSync(path.join(root,'dist/showcase',sample.source),'utf8'),normalized);
 }
 new SaxesParser({xmlns:true}).write(fs.readFileSync(path.join(root,'docs/images/overview.svg'),'utf8')).close();
});

test('public pages do not offer Markdown downloads',()=>{
 for(const name of ['index.html','showcase/index.html']){
  const html=fs.readFileSync(path.join(root,'dist',name),'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
  for(const [anchor] of html.matchAll(/<a\b[^>]*>/gi)){
   const href=anchor.match(/href=["']([^"']*)["']/i)?.[1]||'';
   if(/\.md(?:[?#]|$)/i.test(href))assert.ok(/^https?:/.test(href)&&! /\bdownload(?:\s|=|>)/i.test(anchor),'Markdown download offered: '+href);
  }
  assert.doesNotMatch(html,/id=["']download-md["']/);
 }
});
test('WorkBuddy adapter shares updates and preserves existing installations',()=>{
 const {connectWorkBuddy}=require('../bin/install.cjs'),dir=fs.mkdtempSync(path.join(os.tmpdir(),'mindbox-connect-'));
 try{
  const source=path.join(dir,'shared'),config=path.join(dir,'workbuddy');
  fs.mkdirSync(source);fs.writeFileSync(path.join(source,'SKILL.md'),'version one');
  const linked=connectWorkBuddy(source,config);
  assert.equal(fs.realpathSync(linked),fs.realpathSync(source));
  assert.equal(connectWorkBuddy(source,config),linked);
  fs.writeFileSync(path.join(source,'SKILL.md'),'version two');
  assert.equal(fs.readFileSync(path.join(linked,'SKILL.md'),'utf8'),'version two');
  const foreign=path.join(dir,'foreign','skills','mindbox');fs.mkdirSync(foreign,{recursive:true});fs.writeFileSync(path.join(foreign,'SKILL.md'),'user changes');
  assert.throws(()=>connectWorkBuddy(source,path.join(dir,'foreign')),/preserved/);
  assert.equal(fs.readFileSync(path.join(foreign,'SKILL.md'),'utf8'),'user changes');
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
