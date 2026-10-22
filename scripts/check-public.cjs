'use strict';
// Explicit maintainer check only. Ordinary Skill rendering never calls the network.
const base='https://raw.githubusercontent.com/MarkingYang/mindbox/main/';
async function checkPublic(fetcher=fetch,expected=require('../package.json').version){
 const paths=['package.json','bin/install.cjs','skills/mindbox/version.json'],items=await Promise.all(paths.map(async name=>{try{const r=await fetcher(base+name,{signal:AbortSignal.timeout(8000)});return {name,status:r.status,text:r.ok?await r.text():''};}catch{return {name,status:0,text:''};}}));
 const result={kind:'public-source',expectedVersion:expected,sourceReady:false,installationTested:false,checks:items.map(({name,status})=>({path:name,httpStatus:status}))};
 if(items.some(x=>x.status===404))return {...result,status:'unpublished',message:'公开仓库缺少安装入口或 Skill 包；请先发布已验证的代码。'};
 if(items.some(x=>x.status!==200))return {...result,status:'unavailable',message:'无法完成公开源检查；网络失败不代表安装包不存在。'};
 try{const pkg=JSON.parse(items[0].text),skill=JSON.parse(items[2].text);if(pkg.version!==expected||skill.version!==expected)return {...result,status:'version-mismatch',publishedVersion:pkg.version,message:'公开版本与当前本地版本不一致。'};
  if(pkg.bin?.['mindbox-install']!=='bin/install.cjs'||pkg.license!=='MIT'||!items[1].text.startsWith('#!/usr/bin/env node'))throw new Error('entry');
  return {...result,status:'ready',sourceReady:true,message:'公开源入口与版本一致；仍需实际运行公共安装命令验证。'};
 }catch{return {...result,status:'invalid',message:'公开安装包元数据无效。'};}
}
module.exports={checkPublic};
if(require.main===module)checkPublic().then(result=>{console.log(JSON.stringify(result,null,2));if(!result.sourceReady)process.exitCode=1;});
