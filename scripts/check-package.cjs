'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process'),os=require('node:os');
const root=path.resolve(__dirname,'..'),skill=path.join(root,'skills/mindbox'),runtime=path.join(skill,'assets/runtime');
function check() {
 const M=require('../skills/mindbox/scripts/manage.cjs'),identity=M.inspect(skill),pkg=require('../package.json'),lock=require('../package-lock.json');
 if(!M.stable.test(pkg.version)||identity.version!==pkg.version||lock.version!==pkg.version||lock.packages[''].version!==pkg.version)throw new Error('Release version mismatch');
 if(pkg.license!=='MIT'||!fs.readFileSync(path.join(root,'LICENSE'),'utf8').startsWith('MIT License'))throw new Error('License identity mismatch');
 const manifest=JSON.parse(fs.readFileSync(path.join(runtime,'manifest.json'),'utf8'));
 if(manifest.version!==require('../package.json').version) throw new Error('Package version drift');
 for(const [name,digest] of Object.entries(manifest.files)) {
  const packaged=fs.readFileSync(path.join(runtime,name)),canonical=fs.readFileSync(path.join(root,name));
  if(!packaged.equals(canonical)) throw new Error('Runtime drift: '+name+'; run npm run package:skill');
  if(crypto.createHash('sha256').update(packaged).digest('hex')!==digest) throw new Error('Manifest drift: '+name);
 }
 for(const name of ['LICENSE','THIRD_PARTY_NOTICES.md'])if(!fs.readFileSync(path.join(root,name)).equals(fs.readFileSync(path.join(skill,name))))throw new Error('Notice drift: '+name);
 if(require(path.join(skill,'version.json')).version!==manifest.version) throw new Error('Skill version drift');
 const source=fs.readFileSync(path.join(root,'examples/model-selection.md'),'utf8');
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mindbox-package-'));
 try {
  const result=cp.spawnSync(process.execPath,[path.join(skill,'scripts/render.cjs'),'--input','-','--output',path.join(dir,'map.html'),'--preset','P39'],{input:source,encoding:'utf8'});
  if(result.status!==0) throw new Error(result.stderr);
  const receipt=JSON.parse(result.stdout);if(!receipt.validation.passed||receipt.preset!=='P39')throw new Error('Invalid receipt');
  console.log(JSON.stringify({passed:true,version:manifest.version,renderer:manifest.renderer,resources:Object.keys(manifest.files).length,preset:receipt.preset,nodes:receipt.nodes},null,2));
 } finally {fs.rmSync(dir,{recursive:true,force:true});}
}
try{check();}catch(error){console.error(error.message);process.exitCode=1;}
