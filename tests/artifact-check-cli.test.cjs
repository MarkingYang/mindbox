const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),cp=require('node:child_process');
test('render receipt and independent read-only check agree on actual delivered bytes',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mindbox-check-cli-')),cli=path.resolve('skills/mindbox/scripts/render.cjs'),file=path.join(dir,'map.html'),source='```mermaid\nmindmap\n  复查文件\n    关键判断\n```';
 try{const rendered=cp.spawnSync(process.execPath,[cli,'--input','-','--output',file,'--preset','P39'],{input:source,encoding:'utf8'});assert.equal(rendered.status,0,rendered.stderr);const receipt=JSON.parse(rendered.stdout),bytes=fs.readFileSync(file),checked=cp.spawnSync(process.execPath,[cli,'--input',file,'--check'],{encoding:'utf8'});assert.equal(checked.status,0,checked.stderr);const check=JSON.parse(checked.stdout);assert.deepEqual(receipt.sha256,check.sha256);assert.ok(fs.readFileSync(file).equals(bytes));assert.equal(check.validation.browserChecked,false);assert.equal(check.nodes,2);
  fs.writeFileSync(file,bytes.toString().replace('id="branch-toggle"','id="broken"'));const bad=cp.spawnSync(process.execPath,[cli,'--input',file,'--check'],{encoding:'utf8'});assert.notEqual(bad.status,0);assert.match(bad.stderr,/缺少控件/);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
