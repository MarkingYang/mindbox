#!/usr/bin/env node
'use strict';
// Skills CLI owns installation and updates; this adapter adds only WorkBuddy's local discovery path.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process');
function connectWorkBuddy(canonical,configDir){
 const target=path.join(configDir,'skills','mindbox');
 if(!fs.existsSync(path.join(canonical,'SKILL.md')))throw new Error('Shared Mindbox installation is missing.');
 let exists=false;try{fs.lstatSync(target);exists=true;}catch(e){if(e.code!=='ENOENT')throw e;}
 if(exists){
  try{if(fs.realpathSync(target)===fs.realpathSync(canonical))return target;}catch(e){if(e.code!=='ENOENT')throw e;}
  throw new Error('Existing WorkBuddy Skill preserved. Back it up or move it before retrying: '+target);
 }
 fs.mkdirSync(path.dirname(target),{recursive:true});
 fs.symlinkSync(process.platform==='win32'?canonical:path.relative(path.dirname(target),canonical),target,process.platform==='win32'?'junction':'dir');
 return target;
}
function installationSource(opts,installerVersion,previous){
 if(opts['--rollback'])return previous;
 if(opts['--source'])return opts['--source'];
 if(opts['--tag']&&opts['--tag']!==installerVersion)return 'https://github.com/MarkingYang/mindbox/tree/v'+opts['--tag'];
 if(opts['--update']&&!opts['--tag'])return 'MarkingYang/mindbox';
 return path.resolve(__dirname,'..');
}
async function main(args){
 const M=require('../skills/mindbox/scripts/manage.cjs'),installerVersion=require('../package.json').version;
 const opts={};for(let i=0;i<args.length;i++){
  if(['--source','--tag'].includes(args[i])){if(!args[i+1]||args[i+1].startsWith('--'))throw new Error('Missing value: '+args[i]);opts[args[i]]=args[++i];}
  else if(['--help','--version','--status','--check','--update','--rollback'].includes(args[i]))opts[args[i]]=true;
  else throw new Error('Unknown option: '+args[i]);
 }
 if(opts['--help']){console.log('Mindbox installer '+installerVersion+'\nUsage: mindbox-install [--update | --rollback | --status | --check | --version] [--tag vX.Y.Z | --source <repository-or-local-path>]\nInstallation is shared across local assistants. Updates are explicit; one previous package is retained for rollback.');return;}
 if(opts['--version']){console.log(installerVersion);return;}
 if(['--status','--check','--update','--rollback'].filter(k=>opts[k]).length>1)throw new Error('Choose one operation.');
 if(opts['--source']&&opts['--tag']||opts['--rollback']&&(opts['--source']||opts['--tag']))throw new Error('Source, tag and rollback cannot be combined.');
 if(opts['--tag']){opts['--tag']=opts['--tag'].replace(/^v/,'');if(!M.stable.test(opts['--tag']))throw new Error('Use a stable version tag such as v1.0.0.');}
 const canonical=path.join(os.homedir(),'.agents/skills/mindbox'),state=path.join(os.homedir(),'.agents/.mindbox'),previous=path.join(state,'previous');
 if(opts['--status']||opts['--check']){
  const result=!fs.existsSync(canonical)?{installed:false}:opts['--check']?await M.checkLatest(canonical):{installed:true,...M.inspect(canonical),rollbackVersion:fs.existsSync(previous)?M.inspect(previous).version:null};
  console.log(JSON.stringify({installerVersion,...result},null,2));return;
 }
 if(opts['--rollback']&&!fs.existsSync(previous))throw new Error('No previous Mindbox package is available.');
 const before=fs.existsSync(canonical)?M.inspect(canonical):null;
 const source=installationSource(opts,installerVersion,previous);
 const expected=opts['--rollback']?M.inspect(previous).version:opts['--tag'];
 fs.mkdirSync(state,{recursive:true});const staging=fs.mkdtempSync(path.join(state,'transaction-')),snapshot=path.join(staging,'skill');
 if(before)fs.cpSync(canonical,snapshot,{recursive:true,dereference:true});
 const lockFile=process.env.XDG_STATE_HOME?.trim()?path.join(process.env.XDG_STATE_HOME,'skills/.skill-lock.json'):path.join(os.homedir(),'.agents/.skill-lock.json');
 const lockBefore=fs.existsSync(lockFile)?JSON.parse(fs.readFileSync(lockFile,'utf8')).skills?.mindbox:undefined;
 const olderBackup=path.join(staging,'older');let recovery=snapshot;
 try{
  const cli=path.join(path.dirname(require.resolve('skills/package.json')),'bin/cli.mjs');
  const bundled=source===path.resolve(__dirname,'..');
  console.log('Mindbox: '+(bundled?'using the downloaded package; no second GitHub download.':'installing from '+source)+ '\nInstalling for local assistants, then checking package integrity…');
  const result=cp.spawnSync(process.execPath,[...process.execArgv,cli,'add',source,'-s','mindbox','-a','codex','claude-code','cursor','openclaw','codebuddy','-g','-y'],{stdio:'inherit',timeout:180000});
  if(result.error){if(result.error.code==='ETIMEDOUT')throw new Error('Installation timed out after 180 seconds. Retry with: npx skills add MarkingYang/mindbox -g');throw result.error;}if(result.status!==0)throw new Error('Skills CLI installation failed.');
  const installed=M.inspect(canonical);if(expected&&installed.version!==expected)throw new Error('Requested version '+expected+' but installed '+installed.version);
  const target=connectWorkBuddy(canonical,process.env.WORKBUDDY_CONFIG_DIR?.trim()||path.join(os.homedir(),'.workbuddy'));
  const changed=before&&before.package!==installed.package,previousVersion=changed?before.version:fs.existsSync(previous)?M.inspect(previous).version:null;
  fs.writeFileSync(path.join(canonical,'installation.json'),JSON.stringify({version:installed.version,package:installed.package,installerVersion,installedAt:new Date().toISOString(),source,channel:opts['--tag']?'tag':opts['--source']?'local-or-custom':opts['--rollback']?'rollback':'main',previousVersion},null,2)+'\n');
  if(changed){if(fs.existsSync(previous))fs.renameSync(previous,olderBackup);fs.renameSync(snapshot,previous);recovery=previous;}
  console.log('Mindbox '+(before?before.version+' → ':'')+installed.version+'; package integrity: '+installed.integrity+'\nWorkBuddy shares: '+target+'\nOpen a new assistant session; refresh local Skills in Doubao Work.\nUpdate / upgrade: npx skills update mindbox -g\nExtra adapters and saved rollback: see docs/installation.md and docs/versioning.md');
 }catch(error){
  if(before&&fs.existsSync(recovery)){fs.rmSync(canonical,{recursive:true,force:true});fs.cpSync(recovery,canonical,{recursive:true});error.message+=' Previous Skill '+before.version+' restored.';}
  else if(!before)fs.rmSync(canonical,{recursive:true,force:true});
  if(fs.existsSync(olderBackup)){fs.rmSync(previous,{recursive:true,force:true});fs.renameSync(olderBackup,previous);}
  if(fs.existsSync(lockFile)){const lock=JSON.parse(fs.readFileSync(lockFile,'utf8'));lock.skills||={};if(lockBefore===undefined)delete lock.skills.mindbox;else lock.skills.mindbox=lockBefore;fs.writeFileSync(lockFile,JSON.stringify(lock,null,2));}
  throw error;
 }finally{fs.rmSync(staging,{recursive:true,force:true});}
}
module.exports={connectWorkBuddy,installationSource};
if(require.main===module)main(process.argv.slice(2)).catch(error=>{console.error(error.message);process.exitCode=1;});
