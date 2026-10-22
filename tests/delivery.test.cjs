const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {deliver}=require('../skills/mindbox/scripts/deliver.cjs');
test('a failed second output replacement restores both previous files and cleans candidates',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mindbox-delivery-'));
 try {
  const md=path.join(dir,'map.md'),html=path.join(dir,'map.html');fs.writeFileSync(md,'old md');fs.writeFileSync(html,'old html');
  const io={...fs,renameSync(from,to){if(from.endsWith('.tmp')&&to===html)throw new Error('injected write failure');return fs.renameSync(from,to);}};
  assert.throws(()=>deliver([[md,'new md'],[html,'new html']],{force:true,io}),/injected write failure/);
  assert.equal(fs.readFileSync(md,'utf8'),'old md');assert.equal(fs.readFileSync(html,'utf8'),'old html');
  assert.deepEqual(fs.readdirSync(dir).sort(),['map.html','map.md']);
  deliver([[md,'new md'],[html,'new html']],{force:true});assert.equal(fs.readFileSync(html,'utf8'),'new html');
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('without overwrite permission neither existing sibling is touched',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mindbox-delivery-'));
 try {
  const md=path.join(dir,'map.md'),html=path.join(dir,'map.html');fs.writeFileSync(html,'old');
  assert.throws(()=>deliver([[md,'new md'],[html,'new html']]),/文件已存在/);
  assert.equal(fs.existsSync(md),false);assert.equal(fs.readFileSync(html,'utf8'),'old');assert.deepEqual(fs.readdirSync(dir),['map.html']);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('staged corruption fails before replacement; committed corruption restores both originals',()=>{
 for(const phase of ['staged','committed']){
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mindbox-readback-'));
  try{const a=path.join(dir,'map.md'),b=path.join(dir,'map.html');fs.writeFileSync(a,'old md');fs.writeFileSync(b,'old html');
   const io={...fs,readFileSync(file,...args){const data=fs.readFileSync(file,...args);if(phase==='staged'&&file.endsWith('.tmp')||phase==='committed'&&file===b&&data.toString()==='new html')return Buffer.from('damaged');return data;}};
   assert.throws(()=>deliver([[a,'new md'],[b,'new html']],{force:true,io}),/回读/);assert.equal(fs.readFileSync(a,'utf8'),'old md');assert.equal(fs.readFileSync(b,'utf8'),'old html');assert.deepEqual(fs.readdirSync(dir).sort(),['map.html','map.md']);
  }finally{fs.rmSync(dir,{recursive:true,force:true});}
 }
});
