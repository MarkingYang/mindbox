'use strict';
// Real upstream lifecycle operations, isolated from every user installation, even in nested updater processes.
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),cp=require('node:child_process'),{pathToFileURL}=require('node:url'),assert=require('node:assert/strict');
module.exports=function testLifecycle(){
 const root=path.resolve(__dirname,'..'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'mindbox-lifecycle-')),home=path.join(temp,'home'),repo=path.join(temp,'origin'),project=path.join(temp,'project'),preload=path.join(temp,'home.cjs');
 const source='https://gitlab.com/mindbox-lifecycle/fixture.git',cli=path.join(root,'node_modules/skills/bin/cli.mjs'),M=require('../skills/mindbox/scripts/manage.cjs');
 fs.mkdirSync(home);fs.mkdirSync(repo);fs.mkdirSync(project);
 fs.writeFileSync(preload,`require('node:os').homedir=()=>${JSON.stringify(home)};require('node:module').syncBuiltinESMExports();if(process.env.MINDBOX_TEST_RELEASE)globalThis.fetch=async()=>new Response(JSON.stringify({tag_name:'v'+process.env.MINDBOX_TEST_RELEASE}),{status:200});\n`);
 const env={...process.env,NODE_OPTIONS:[process.env.NODE_OPTIONS||'','--require '+JSON.stringify(preload)].join(' '),DISABLE_TELEMETRY:'1',DO_NOT_TRACK:'1',GIT_CONFIG_NOSYSTEM:'1',GIT_CONFIG_GLOBAL:os.devNull,GIT_CONFIG_COUNT:'1',GIT_CONFIG_KEY_0:'url.'+pathToFileURL(repo).href+'.insteadOf',GIT_CONFIG_VALUE_0:source,GIT_AUTHOR_NAME:'Lifecycle test',GIT_AUTHOR_EMAIL:'lifecycle@example.invalid',GIT_COMMITTER_NAME:'Lifecycle test',GIT_COMMITTER_EMAIL:'lifecycle@example.invalid'};
 for(const key of ['CLAUDE_CONFIG_DIR','XDG_STATE_HOME','WORKBUDDY_CONFIG_DIR','XDG_CONFIG_HOME'])delete env[key];
 function run(command,args,options={}){const r=cp.spawnSync(command,args,{encoding:'utf8',cwd:project,env,timeout:90000,...options});assert.equal(r.status,0,(r.stderr||'')+(r.stdout||'')+(r.error||''));return r.stdout;}
 const skills=args=>run(process.execPath,[cli,...args]);
 const git=args=>run('git',args,{cwd:repo});
 const canonical=path.join(home,'.agents/skills/mindbox'),other=path.join(home,'.agents/skills/lifecycle-witness/SKILL.md'),artifact=path.join(project,'saved-map.html');
 function release(version){
  const dir=path.join(repo,'skills/mindbox');fs.mkdirSync(path.dirname(dir),{recursive:true});fs.cpSync(path.join(root,'skills/mindbox'),dir,{recursive:true});
  for(const [name,extra] of [['version.json',{releaseTag:'v'+version}],['assets/runtime/manifest.json',{}]]){const file=path.join(dir,name),data=JSON.parse(fs.readFileSync(file));fs.writeFileSync(file,JSON.stringify({...data,version,...extra}));}
  const files=M.packageFiles(dir);fs.writeFileSync(path.join(dir,'package-manifest.json'),JSON.stringify({format:1,version,files,digest:M.hash(JSON.stringify(files))}));
 }
 function witness(text){const dir=path.join(repo,'skills/lifecycle-witness');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'SKILL.md'),'---\nname: lifecycle-witness\ndescription: Unrelated test skill.\n---\n'+text+'\n');}
 try{
  release('9.0.1');witness('original unrelated content');git(['init','-b','main']);git(['add','.']);git(['commit','-m','initial fixtures']);git(['tag','v9.0.1']);
  skills(['add',source,'--skill','mindbox','--agent','codex','claude-code','-g','-y']);
  skills(['add',source,'--skill','lifecycle-witness','--agent','codex','claude-code','-g','-y']);
  assert.equal(M.inspect(canonical).version,'9.0.1');assert.match(skills(['list','-g']),/mindbox/);
  fs.writeFileSync(artifact,'User saved HTML must survive Skill lifecycle changes.');const saved=fs.readFileSync(artifact),untouched=fs.readFileSync(other);
  release('9.0.2');witness('changed upstream; must NOT update with mindbox');git(['add','.']);git(['commit','-m','new fixture release']);
  const beforeCheck=M.inspect(canonical).package,lock=path.join(home,'.agents/.skill-lock.json'),beforeLock=fs.readFileSync(lock);
  const check=JSON.parse(run(process.execPath,[path.join(canonical,'scripts/manage.cjs'),'--check'],{env:{...env,MINDBOX_TEST_RELEASE:'9.0.2'}}));
  assert.equal(check.status,'update-available');assert.equal(M.inspect(canonical).package,beforeCheck);assert.deepEqual(fs.readFileSync(lock),beforeLock);
  skills(['update','mindbox','-g']);assert.equal(M.inspect(canonical).version,'9.0.2');assert.deepEqual(fs.readFileSync(other),untouched);
  // Published-ref syntax stays pinned during update; reinstall returns to the default branch.
  skills(['add',source+'#v9.0.1','--skill','mindbox','--agent','codex','claude-code','-g','-y']);
  skills(['update','mindbox','-g']);assert.equal(M.inspect(canonical).version,'9.0.1');
  skills(['add',source,'--skill','mindbox','--agent','codex','claude-code','-g','-y']);assert.equal(M.inspect(canonical).version,'9.0.2');
  skills(['remove','mindbox','-g','-y']);assert.equal(fs.existsSync(path.join(canonical,'SKILL.md')),false);assert.equal(fs.existsSync(path.join(home,'.claude/skills/mindbox')),false);
  assert.deepEqual(fs.readFileSync(other),untouched);assert.deepEqual(fs.readFileSync(artifact),saved);
  skills(['add',source,'--skill','mindbox','--agent','codex','-g','-y']);assert.equal(M.inspect(canonical).version,'9.0.2');
  skills(['add',source,'--skill','mindbox','--agent','codex','-y']);
  const local=path.join(project,'.agents/skills/mindbox');assert.equal(M.inspect(local).version,'9.0.2');
  release('9.0.3');git(['add','.']);git(['commit','-m','project fixture update']);
  skills(['update','mindbox','-p']);assert.equal(M.inspect(local).version,'9.0.3');assert.equal(M.inspect(canonical).version,'9.0.2');
  skills(['remove','mindbox','-y']);assert.equal(fs.existsSync(path.join(local,'SKILL.md')),false);assert.equal(M.inspect(canonical).version,'9.0.2');
  assert.deepEqual(fs.readFileSync(other),untouched);assert.deepEqual(fs.readFileSync(artifact),saved);
  return {passed:true,cli:require('../node_modules/skills/package.json').version,global:['add','list','read-only release check','targeted update','pin','reinstall','remove'],project:['add','targeted update','remove'],otherSkillPreserved:true,savedHTMLPreserved:true,scope:'temporary OS home inherited by updater child processes; local Git transport fixture'};
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
};
if(require.main===module)console.log(JSON.stringify(module.exports(),null,2));
