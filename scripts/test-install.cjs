'use strict';
// Exercise the website standard install and unified installer in a child process with an isolated OS home.
// HOME/CODEX_HOME are never changed, and no global user installations are touched.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'mindbox-install-')),testHome=path.join(temp,'test-home');
const cli=path.join(root,'node_modules/skills/bin/cli.mjs'),preload=path.join(temp,'test-home.cjs');
fs.mkdirSync(testHome);fs.writeFileSync(preload,`require('node:os').homedir=()=>${JSON.stringify(testHome)};require('node:module').syncBuiltinESMExports();\n`);
const env={...process.env,DISABLE_TELEMETRY:'1',DO_NOT_TRACK:'1'};
// Ignore optional external host overrides in this test child; preserve HOME and CODEX_HOME.
for(const key of ['CLAUDE_CONFIG_DIR','XDG_STATE_HOME','WORKBUDDY_CONFIG_DIR'])delete env[key];
function run(args,options={}) {
 const result=cp.spawnSync(process.execPath,args,{encoding:'utf8',cwd:temp,env,...options});
 if(result.status!==0)throw new Error((result.stderr||result.stdout||'Process failed').replace(/\x1b\[[0-9;]*m/g,''));
 return result.stdout;
}
const targets={codex:'.agents/skills/mindbox','claude-code':'.claude/skills/mindbox',cursor:'.agents/skills/mindbox',openclaw:'.openclaw/skills/mindbox',codebuddy:'.codebuddy/skills/mindbox',workbuddy:'.workbuddy/skills/mindbox'};
try {
 const command=fs.readFileSync(path.join(root,'src/index.html'),'utf8').match(/<code id="install-command">([^<]+)<\/code>/)?.[1];
 if(command!=='npx skills add MarkingYang/mindbox -g')throw new Error('Website must expose the standard Skills CLI entry');
 const manifest=require('../package.json');
 if(manifest.bin['mindbox-install']!=='bin/install.cjs'||manifest.dependencies.skills!==require('../node_modules/skills/package.json').version)throw new Error('npx entry or pinned installer dependency missing');
 const args=['--require',preload,path.join(root,'bin/install.cjs')];
 const discovery=run(['--require',preload,cli,'add',root,'--list']);if(!discovery.includes('mindbox'))throw new Error('Skill not discovered');
 run(['--require',preload,cli,'add',root,'--skill','mindbox','--agent','codex','--copy','-g','-y']);
 const standardRunner=path.join(testHome,'.agents/skills/mindbox/scripts/render.cjs');
 const standard=JSON.parse(run([standardRunner,'--input',path.join(root,'examples/project-plan.md'),'--output',path.join(temp,'standard.html'),'--preset','商务蓝图']));
 if(!standard.validation.passed)throw new Error('Standard Skills CLI install failed to render');
 const firstInstall=run(args);if(!firstInstall.includes('no second GitHub download'))throw new Error('Default install fetched repository twice');
 const canonical=path.join(testHome,'.agents/skills/mindbox'),source=fs.readFileSync(path.join(root,'examples/model-selection.md'),'utf8'),links={};
 for(const [name,folder] of Object.entries(targets)){
  const skill=path.join(testHome,folder),runner=path.join(skill,'scripts/render.cjs');
  if(!fs.existsSync(runner))throw new Error('Installed runtime missing: '+name);
  links[name]=fs.lstatSync(skill).isSymbolicLink()?'shared link':'canonical/copy';
  if(fs.lstatSync(skill).isSymbolicLink()&&fs.realpathSync(skill)!==fs.realpathSync(canonical))throw new Error('Host does not share canonical installation: '+name);
  const receipt=JSON.parse(run([runner,'--input','-','--output',path.join(temp,name+'.html'),'--preset','MMB0Q4'],{input:source}));
  if(receipt.uid!=='MMB0Q4'||!receipt.validation.passed)throw new Error('Installed render failed: '+name);
  const switched=JSON.parse(run([runner,'--input',receipt.html,'--switch-to','MMP0A7']));
  if(switched.uid!=='MMP0A7'||switched.nodes!==receipt.nodes)throw new Error('Installed restyle changed content: '+name);
  const D=require('../src/document.cjs'),L=require('../src/library.cjs'),normalized=D.withRecipe(source,L.resolveRecipe('P39'));
  if(fs.readFileSync(receipt.html,'utf8')!==D.generate({source:normalized,recipeCode:L.resolveRecipe('P39').code,standalone:true,player:true}))throw new Error('Installed renderer differs: '+name);
 }
 // Exercise a real older-version upgrade, recovery, and explicit rollback in this isolated home.
 const M=require('../skills/mindbox/scripts/manage.cjs'),installer=path.join(root,'bin/install.cjs'),fixture=path.join(temp,'older-skill');
 fs.cpSync(path.join(root,'skills/mindbox'),fixture,{recursive:true});
 const version=JSON.parse(fs.readFileSync(path.join(fixture,'version.json')));version.version='0.29.0';version.releaseTag='v0.29.0';fs.writeFileSync(path.join(fixture,'version.json'),JSON.stringify(version));
 const runtimeManifest=path.join(fixture,'assets/runtime/manifest.json'),runtimeData=JSON.parse(fs.readFileSync(runtimeManifest));runtimeData.version='0.29.0';fs.writeFileSync(runtimeManifest,JSON.stringify(runtimeData));
 const files=M.packageFiles(fixture);fs.writeFileSync(path.join(fixture,'package-manifest.json'),JSON.stringify({format:1,version:'0.29.0',files,digest:M.hash(JSON.stringify(files))}));
 const invoke=operation=>run(['--require',preload,installer,...operation]);
 invoke(['--source',fixture]);if(M.inspect(canonical).version!=='0.29.0')throw new Error('Older version fixture not installed');
 invoke(['--update','--source',root]);
 const status=JSON.parse(invoke(['--status']));if(status.version!==manifest.version||status.rollbackVersion!=='0.29.0')throw new Error('Upgrade status/backup mismatch');
 const previous=path.join(testHome,'.agents/.mindbox/previous');
 run(args);if(M.inspect(previous).version!=='0.29.0')throw new Error('Same-version reinstall replaced meaningful backup');
 const lockBefore=JSON.parse(fs.readFileSync(path.join(testHome,'.agents/.skill-lock.json'))).skills?.mindbox;
 const failed=cp.spawnSync(process.execPath,['--require',preload,installer,'--source',path.join(temp,'missing-source')],{encoding:'utf8',cwd:temp,env});
 if(failed.status===0||M.inspect(canonical).version!==manifest.version)throw new Error('Failed update did not preserve installed package');
 // A package that copies successfully but fails post-install integrity must also restore the prior package.
 fs.appendFileSync(path.join(fixture,'SKILL.md'),'\ntampered');
 const damaged=cp.spawnSync(process.execPath,['--require',preload,installer,'--source',fixture],{encoding:'utf8',cwd:temp,env});
 if(damaged.status===0||M.inspect(canonical).version!==manifest.version)throw new Error('Damaged update did not recover');
 const lockAfter=JSON.parse(fs.readFileSync(path.join(testHome,'.agents/.skill-lock.json'))).skills?.mindbox;
 if(JSON.stringify(lockBefore)!==JSON.stringify(lockAfter))throw new Error('Failed update changed Mindbox installer lock record');
 invoke(['--rollback']);if(M.inspect(canonical).version!=='0.29.0')throw new Error('Rollback failed');
 const rolled=JSON.parse(run([path.join(canonical,'scripts/render.cjs'),'--input','-','--output',path.join(temp,'rollback.html'),'--preset','MMB0Q4'],{input:source}));
 if(!rolled.validation.passed)throw new Error('Rolled-back renderer failed');
 invoke(['--update','--source',root]);
 // Repeat the same command and ensure every host still resolves to the supplied Skill.
 run(args);
 for(const folder of Object.values(targets))if(!fs.readFileSync(path.join(testHome,folder,'SKILL.md')).equals(fs.readFileSync(path.join(root,'skills/mindbox/SKILL.md'))))throw new Error('Repeated install drifted');
 console.log(JSON.stringify({passed:true,source:'local repository; standard Skills CLI and unified installer',cli:require('../node_modules/skills/package.json').version,installed:Object.keys(targets),links,workbuddy:'shared-directory adapter; discovery UI verified separately',doubao:'shared Skill discovery; desktop UI verified separately',render:'MMB0Q4',restyle:'MMP0A7',canonicalParity:true,reinstall:true,upgrade:true,failedUpdateRecovery:true,rollback:true,scope:'isolated OS home in test child; real HOME unchanged'},null,2));
}catch(error){console.error(error.message);process.exitCode=1;}finally{fs.rmSync(temp,{recursive:true,force:true});}
