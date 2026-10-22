'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const root=path.resolve(__dirname,'..'),skill=path.join(root,'skills/mindbox');
test('project, lockfile, Skill and both package manifests use one release identity',()=>{
 const read=relative=>JSON.parse(fs.readFileSync(path.join(root,relative),'utf8'));
 const pkg=read('package.json'),lock=read('package-lock.json'),identity=read('skills/mindbox/version.json');
 assert.equal(lock.version,pkg.version);assert.equal(lock.packages[''].version,pkg.version);
 assert.equal(identity.version,pkg.version);assert.equal(identity.releaseTag,'v'+pkg.version);
 assert.equal(read('skills/mindbox/package-manifest.json').version,pkg.version);
 assert.equal(read('skills/mindbox/assets/runtime/manifest.json').version,pkg.version);
 assert.deepEqual(identity.styleUIDs,require('../src/library.cjs').styleUIDs);
});
test('installed package identity detects instruction and script changes',()=>{
 const M=require('../skills/mindbox/scripts/manage.cjs'),dir=fs.mkdtempSync(path.join(os.tmpdir(),'mindbox-version-'));
 try{
  fs.cpSync(skill,dir,{recursive:true});
  const identity=M.inspect(dir);assert.equal(identity.version,require('../package.json').version);assert.equal(identity.integrity,'verified');
  fs.appendFileSync(path.join(dir,'SKILL.md'),'\nchanged');assert.throws(()=>M.inspect(dir),/SKILL.md/);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('release checks distinguish update, unpublished, offline and malformed responses',async()=>{
 const M=require('../skills/mindbox/scripts/manage.cjs'),version=require('../package.json').version;
 const response=tag=>async()=>({ok:true,json:async()=>({tag_name:tag,html_url:'https://github.com/MarkingYang/mindbox/releases/tag/'+tag})});
 assert.equal((await M.checkLatest(skill,response('v99.0.0'))).status,'update-available');
 assert.equal((await M.checkLatest(skill,response('v'+version))).status,'current');
 assert.equal((await M.checkLatest(skill,async()=>({status:404,ok:false}))).status,'unpublished');
 assert.equal((await M.checkLatest(skill,async()=>{throw Error('offline');})).status,'unavailable');
 assert.equal((await M.checkLatest(skill,response('not-a-version'))).status,'unavailable');
 assert.equal((await M.checkLatest(skill,response('v0.1.0'))).status,'ahead');
});
test('renderer exposes its installed version without generating output',()=>{
 const cp=require('node:child_process'),run=cp.spawnSync(process.execPath,[path.join(skill,'scripts/render.cjs'),'--version'],{encoding:'utf8'});
 assert.equal(run.status,0,run.stderr);assert.equal(run.stdout.trim(),require('../package.json').version);
});

test('standalone HTML retains the project MIT notice without adding visible UI',()=>{
 const D=require('../src/document.cjs'),L=require('../src/library.cjs'),recipe=L.resolveRecipe('MMK0V1');
 const html=D.generate({source:'```mermaid\nmindmap\n  Root\n    Child\n```',recipeCode:recipe.code,standalone:true,player:true});
 assert.ok(html.includes('<!-- Mindbox engine license'));
 assert.ok(html.includes(fs.readFileSync(path.join(root,'LICENSE'),'utf8')));
});
test('invalid version pins and mismatched release tags fail before publication',()=>{
 const cp=require('node:child_process');
 const invalid=cp.spawnSync(process.execPath,[path.join(root,'bin/install.cjs'),'--tag','../../main'],{encoding:'utf8'});
 assert.notEqual(invalid.status,0);assert.match(invalid.stderr,/stable version tag/);
 const release=cp.spawnSync(process.execPath,[path.join(root,'scripts/release.cjs')],{encoding:'utf8',env:{...process.env,GITHUB_REF_TYPE:'tag',GITHUB_REF_NAME:'v99.0.0'}});
 assert.notEqual(release.status,0);assert.match(release.stderr,/tag\/version mismatch/);
});
