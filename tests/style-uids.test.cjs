'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),cp=require('node:child_process');
const L=require('../src/library.cjs'),K=require('../src/engine.cjs'),Names=require('../skills/mindbox/scripts/style-names.cjs');
// Compatibility fixture: changing display order must never reallocate these identities.
const allocated={MMK0V1:'P61',MMR0C2:'P48',MMT0H3:'P40',MMB0Q4:'P39',MMW0F5:'P60',MMD0N6:'P65',MMP0A7:'P67',MMH0S8:'P68',MMC0Y9:'P73',MMV0EA:'P74',MMF0KB:'P75',MMQ0DC:'P76',MMN0WD:'P77',MMA0RE:'P78',MMS0BF:'P79',MME0TG:'P80'};
test('permanent alphanumeric UIDs retain exact style identity after display reordering',()=>{
 const before=[...L.selection.presets];
 try{
  L.selection.presets.reverse();
  for(const [uid,id] of Object.entries(allocated)){
   assert.match(uid,/^MM[A-Z][0-9A-Z][A-Z][0-9A-Z]$/);
   const preset=L.presets.find(p=>p.id===id),name=preset.name.split(' · ')[0];
   for(const value of [uid,uid.toLowerCase(),name,`${uid} · ${name}`,id,`${id} · ${name}`]){
    assert.equal(L.resolveRecipe(value).code,preset.code,value);
    assert.equal(Names.resolve(value,L).preset.uid,uid,value);
   }
   assert.equal(K.parseOptions(`---\npreset: ${uid}\n---\n`).recipeCode,preset.code);
   assert.equal(K.parseOptions(`---\npreset: "${name}"\n---\n`).recipeCode,preset.code);
   assert.equal(Names.catalogue(L).find(p=>p.uid===uid).preset,id);
  }
  assert.equal(new Set(L.selectedPresets().map(p=>p.uid)).size,16);
  assert.deepEqual(L.styleUIDs,allocated);
  for(const bad of ['MM0001','MMZ0Z0','MMK0V2','000001'])assert.throws(()=>Names.resolve(bad,L),/没有找到样式/);
 }finally{L.selection.presets.splice(0,L.selection.presets.length,...before);}
});
test('all16 UID, name and legacy CLI inputs generate identical HTML; UID restyling preserves content',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mindbox-uids-')),runner=path.resolve(__dirname,'../skills/mindbox/scripts/render.cjs');
 const source='```mermaid\nmindmap\n  UID mapping\n    Keep this\n      Deep detail\n```\n\nSource: original notes.\n';
 const run=(args,input)=>{const r=cp.spawnSync(process.execPath,[runner,...args],{encoding:'utf8',input});assert.equal(r.status,0,r.stderr);return JSON.parse(r.stdout);};
 try{
  for(const [uid,id] of Object.entries(allocated)){
   const p=L.presets.find(p=>p.id===id),receipts=[uid,p.name.split(' · ')[0],id].map((value,i)=>run(['--input','-','--output',path.join(dir,uid+'-'+i+'.html'),'--preset',value],source));
   const expected=fs.readFileSync(receipts[0].html,'utf8');
   for(const receipt of receipts){assert.equal(receipt.uid,uid);assert.equal(receipt.preset,id);assert.equal(receipt.style,p.code);assert.equal(fs.readFileSync(receipt.html,'utf8'),expected);}
  }
  const input=path.join(dir,'MMK0V1-0.html'),switched=run(['--input',input,'--switch-to','MMB0Q4']);
  assert.equal(switched.uid,'MMB0Q4');assert.equal(switched.preset,'P39');
  assert.deepEqual(K.parseMindmap(fs.readFileSync(switched.markdown,'utf8')),K.parseMindmap(source));
  assert.ok(fs.readFileSync(switched.markdown,'utf8').includes('Source: original notes.'));
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
