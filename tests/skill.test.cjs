const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process');
const L=require('../src/library.cjs'),K=require('../src/engine.cjs'),root=path.resolve(__dirname,'..'),skill=path.join(root,'skills/mindbox'),runner=path.join(skill,'scripts/render.cjs');
const run=(args,options={})=>cp.spawnSync(process.execPath,[runner,...args],{encoding:'utf8',...options});
const temp=()=>fs.mkdtempSync(path.join(os.tmpdir(),'zhixu-skill-'));
test('Skill安装标识、显示名、调用方式与下载包都统一为mindbox',()=>{
 const guide=fs.readFileSync(path.join(skill,'SKILL.md'),'utf8'),meta=fs.readFileSync(path.join(skill,'agents/openai.yaml'),'utf8');
 assert.match(guide,/^name: mindbox$/m);assert.ok(guide.includes('$mindbox'));assert.ok(meta.includes('display_name: "mindbox"'));assert.ok(meta.includes('$mindbox'));
 assert.ok(!fs.existsSync(path.join(root,'skills/zhixu-mindmap/SKILL.md')));assert.ok(fs.existsSync(path.join(root,'dist/downloads/mindbox.zip')));
});
test('16套名称与常用简称指向固定模板，未知偏好不会误匹配',()=>{
 const Names=require('../skills/mindbox/scripts/style-names.cjs');
 for(const p of Names.catalogue(L))for(const name of [p.uid,p.name,p.preset,...p.aliases])assert.equal(Names.resolve(name,L).preset.id,p.preset,name);
 assert.equal(Names.resolve(' D O O D L E ',L).preset.id,'P67');assert.equal(Names.resolve('商务蓝图',L).preset.id,'P73');
 assert.equal(Names.resolve('手绘',L).preset.id,'P65');assert.equal(Names.resolve('好玩',L).preset.id,'P67');
 assert.throws(()=>Names.resolve('并不存在的风格',L),/没有找到样式/);
});
test('中文简称可切换已有Markdown或HTML，另存且保留原内容，不执行HTML脚本',()=>{
 const dir=temp();try{
  const input=path.join(dir,'notes.md'),source=fs.readFileSync(path.join(root,'dist/downloads/starter.md'),'utf8')+'\n来源：保留这个链接与限定。\n';fs.writeFileSync(input,source);
  let result=run(['--input',input,'--switch-to','好玩']);assert.equal(result.status,0,result.stderr);const doodle=JSON.parse(result.stdout);
  assert.equal(doodle.preset,'P67');assert.equal(doodle.restyled,true);assert.equal(doodle.name,'脑洞涂鸦');assert.equal(path.basename(doodle.html),'notes--MMP0A7.html');assert.equal(fs.readFileSync(input,'utf8'),source);
  const doodleHTML=fs.readFileSync(doodle.html,'utf8');result=run(['--input',doodle.html,'--switch-to','商务一点']);assert.equal(result.status,0,result.stderr);const business=JSON.parse(result.stdout);
  assert.equal(business.preset,'P73');assert.equal(path.basename(business.html),'notes--MMC0Y9.html');assert.equal(fs.readFileSync(doodle.html,'utf8'),doodleHTML);
  const md=fs.readFileSync(business.markdown,'utf8');assert.deepEqual(K.parseMindmap(md),K.parseMindmap(source));assert.ok(md.includes('来源：保留这个链接与限定。'));assert.equal(K.parseOptions(md).recipeCode,L.resolveRecipe('P73').code);
  const exported=path.join(dir,'browser-download.html');fs.writeFileSync(exported,require('../src/document.cjs').generate({source,recipeCode:L.resolveRecipe('P67').code,standalone:true,references:[]}));
  const reopened=run(['--input',exported,'--output',path.join(dir,'reopened.html')]);assert.equal(reopened.status,0,reopened.stderr);assert.equal(JSON.parse(reopened.stdout).preset,'P67','以HTML当前配方为准，不被旧正文元信息覆盖');
  const again=run(['--input',input,'--switch-to','商务']);assert.equal(again.status,0,again.stderr);assert.equal(path.basename(JSON.parse(again.stdout).html),'notes--MMC0Y9-2.html');assert.equal(K.parseOptions(fs.readFileSync(business.markdown,'utf8')).recipeCode,L.resolveRecipe('P73').code);
  assert.notEqual(run(['--input',input,'--switch-to','商务','--preset','极简']).status,0);
  assert.notEqual(run(['--input',input,'--switch-to','未知风格']).status,0);
  const hostile=path.join(dir,'unsafe.html');fs.writeFileSync(hostile,'<script id="atlas-boot">window.ATLAS_BOOT=(()=>{throw new Error("should not run")})()</script>');
  const rejected=run(['--input',hostile,'--switch-to','商务']);assert.notEqual(rejected.status,0);assert.ok(rejected.stderr.includes('数据无法读取'));assert.ok(!fs.existsSync(path.join(dir,'unsafe--MMC0Y9.html')));
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('首页字库按需从本站加载，独立成果仍内嵌字库',()=>{
 const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');
 assert.ok(Buffer.byteLength(html)<500000,'首页不携带全部字库');
 const css=html.match(/<style>([\s\S]*?)<\/style>/)[1];assert.ok(!css.includes('data:font'));
 const fonts=[...css.matchAll(/url\((fonts\/[a-z-]+\.woff2)\)/g)].map(m=>m[1]);assert.ok(fonts.length>=8);
 for(const file of fonts)assert.ok(fs.statSync(path.join(root,'dist',file)).size>0);
 const standalone=fs.readFileSync(path.join(root,'dist/presets/P61.html'),'utf8').match(/<style>([\s\S]*?)<\/style>/)[1];
 assert.ok(standalone.includes('base64,'));assert.ok(!/url\(fonts\//.test(standalone));
});
test('Skill可以列出完整16套默认样式，包内目录与网站一致',()=>{
 const result=run(['--list']);assert.equal(result.status,0,result.stderr);const list=JSON.parse(result.stdout);
 assert.deepEqual(list.map(({preset,code})=>({id:preset,code})),L.selectedPresets().map(({id,code})=>({id,code})));
 assert.ok(fs.existsSync(path.join(root,'dist/downloads/mindbox.zip')));assert.ok(fs.existsSync(path.join(skill,'references/style-combinations.md')));
 assert.deepEqual(require(path.join(skill,'assets/runtime/src/doodle.cjs')).parts,require('../src/doodle.cjs').parts);
 assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root,'dist/style-library.json'),'utf8')).doodle.parts,require('../src/doodle.cjs').parts);
});
test('16套默认样式逐一生成HTML和配方一致的Markdown，保留内容与来源',()=>{
 const dir=temp();try{
  const input=path.join(dir,'draft.md'),source=fs.readFileSync(path.join(root,'dist/downloads/starter.md'),'utf8')+'\n来源：fixture.md:2\n';fs.writeFileSync(input,source);
  for(const p of L.selectedPresets()){
   const output=path.join(dir,p.id+'.html'),result=run(['--input',input,'--output',output,'--preset',p.id]);assert.equal(result.status,0,result.stderr);
   const status=JSON.parse(result.stdout),md=fs.readFileSync(output.slice(0,-5)+'.md','utf8'),html=fs.readFileSync(output,'utf8');
   assert.equal(html,require('../src/document.cjs').generate({source:md,recipeCode:p.code,standalone:true,player:true}),'项目与Skill模板需逐字节相同：'+p.id);assert.equal(status.style,p.code);assert.equal(status.nodes,7);assert.equal(K.parseOptions(md).recipeCode,p.code);assert.ok(md.includes('来源：fixture.md:2'));
   assert.deepEqual(K.parseMindmap(md),K.parseMindmap(source));assert.ok(html.includes(`"recipeCode":"${p.code}"`));assert.ok(html.includes('"standalone":true'));assert.ok(!/<script[^>]+src=/.test(html));assert.ok(html.includes('Open Font License'));assert.ok(html.includes('scope.MindmapMedia'));assert.ok(html.includes('"player":true'));
  }
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('自定义组合可生成；不兼容代码、无效内容与未授权覆盖会明确失败',()=>{
 const dir=temp();try{
  const input=path.join(dir,'draft.md'),output=path.join(dir,'map.html'),source=fs.readFileSync(path.join(root,'dist/downloads/starter.md'),'utf8');fs.writeFileSync(input,source);
  const custom='L01-N18-E09-C43-B40-T09-D03';assert.equal(run(['--input',input,'--output',output,'--style',custom]).status,0);
  const before=fs.readFileSync(output,'utf8');assert.notEqual(run(['--input',input,'--output',output,'--preset','P61']).status,0);assert.equal(fs.readFileSync(output,'utf8'),before);
  assert.equal(run(['--input',input,'--output',output,'--preset','极简','--force']).status,0);
  assert.notEqual(run(['--input',input,'--output',path.join(dir,'bad.html'),'--style','L04-N18-E09-C43-B40-T09-D03']).status,0);assert.ok(!fs.existsSync(path.join(dir,'bad.html')));
  fs.writeFileSync(input,'只有没有层级的普通文字');assert.notEqual(run(['--input',input,'--output',path.join(dir,'invalid.html')]).status,0);assert.ok(!fs.existsSync(path.join(dir,'invalid.html')));
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('下载包脱离项目解压后也可运行，默认P61，正文脚本标记不会逃逸',()=>{
 const dir=temp();try{
  require('./support/unzip.cjs').extract(path.join(root,'dist/downloads/mindbox.zip'),dir);
  const input=path.join(dir,'draft.md'),output=path.join(dir,'portable.html'),portable=path.join(dir,'mindbox/scripts/render.cjs');
  fs.writeFileSync(input,['```mermaid','mindmap','  root((测试资料))','    </script><script>untrusted</script>','```'].join('\n'));
  const result=cp.spawnSync(process.execPath,[portable,'--input',input,'--output',output],{encoding:'utf8',cwd:dir});assert.equal(result.status,0,result.stderr);assert.equal(JSON.parse(result.stdout).preset,'P61');
  const html=fs.readFileSync(output,'utf8');assert.ok(!html.includes('</script><script>untrusted</script>'));assert.ok(html.includes('\\u003c/script>'));
  const switched=cp.spawnSync(process.execPath,[portable,'--input',output,'--switch-to','商务'],{encoding:'utf8',cwd:dir});assert.equal(switched.status,0,switched.stderr);assert.equal(JSON.parse(switched.stdout).preset,'P73');
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('portable Skill includes every reachable local reference and consistent release metadata',()=>{
 const dir=temp();try{
  require('./support/unzip.cjs').extract(path.join(root,'dist/downloads/mindbox.zip'),dir);
  const unpacked=path.join(dir,'mindbox'),visited=new Set();
  function visit(file){
   if(visited.has(file))return;visited.add(file);
   const text=fs.readFileSync(file,'utf8');assert.ok(text.trim(),path.relative(unpacked,file));
   for(const link of text.matchAll(/\[[^\]]+\]\(([^\s)]+)\)/g)){
    const href=link[1];if(/^(?:[a-z][a-z0-9+.-]*:|#)/i.test(href))continue;
    const target=path.resolve(path.dirname(file),decodeURIComponent(href.split('#')[0]));
    assert.ok(target.startsWith(unpacked+path.sep),'reference must travel with the package: '+href);
    assert.ok(fs.existsSync(target),'missing packaged reference: '+href);
    if(target.endsWith('.md'))visit(target);
   }
  }
  visit(path.join(unpacked,'SKILL.md'));
  assert.ok(visited.size>1,'supporting references must be discoverable from the entrypoint');
  const identity=require('../skills/mindbox/scripts/manage.cjs').inspect(unpacked);
  assert.equal(identity.integrity,'verified');assert.equal(identity.version,require('../package.json').version);
  const version=cp.spawnSync(process.execPath,[path.join(unpacked,'scripts/render.cjs'),'--version'],{encoding:'utf8',cwd:dir});
  assert.equal(version.status,0,version.stderr);assert.equal(version.stdout.trim(),identity.version);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('只提交Markdown与模板名即可生成，stdin和项目原模板产物逐字节一致',()=>{
 const dir=temp();try{
  const source='```mermaid\nmindmap\n  只生成内容\n    关键观点\n      依据\n        行动\n```\n\n来源：保留来源。\n',output=path.join(dir,'map.html');
  const result=run(['--input','-','--output',output,'--preset','彩虹经典'],{input:source});assert.equal(result.status,0,result.stderr);
  const status=JSON.parse(result.stdout),normalized=require('../src/document.cjs').withRecipe(source,L.resolveRecipe('P39'));
  assert.equal(status.validation.passed,true);assert.equal(status.validation.levels,4);assert.equal(status.validation.standalone,true);assert.match(status.renderer,/^[a-f0-9]{64}$/);
  const expected=require('../src/document.cjs').generate({source:normalized,recipeCode:L.resolveRecipe('P39').code,standalone:true,player:true});
  assert.equal(fs.readFileSync(output,'utf8'),expected);assert.equal(fs.readFileSync(output.slice(0,-5)+'.md','utf8'),normalized);
  const missingOutput=run(['--input','-'],{input:source});assert.notEqual(missingOutput.status,0);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('轻量目录仍覆盖16套名称与用途，不要求模型读取配方和组件',()=>{
 const normal=run(['--list']),compact=run(['--list','--compact']);assert.equal(compact.status,0,compact.stderr);
 const list=JSON.parse(compact.stdout);assert.deepEqual(list.map(p=>p.preset),L.selectedPresets().map(p=>p.id));assert.ok(list.every(p=>p.name&&p.purpose&&!p.code&&!p.alternatives));assert.ok(compact.stdout.length<normal.stdout.length*.4);
});
test('模板包漂移会停止生成，不悄悄使用另一套页面；默认Skill说明保持精简',()=>{
 const dir=temp();try{
  const unpacked=path.join(dir,'mindbox');fs.cpSync(skill,unpacked,{recursive:true});
  fs.appendFileSync(path.join(unpacked,'assets/runtime/src/player.js'),'\n/* unexpected drift */');
  const result=cp.spawnSync(process.execPath,[path.join(unpacked,'scripts/render.cjs'),'--input','-','--output',path.join(dir,'bad.html')],{input:'```mermaid\nmindmap\n  A\n```',encoding:'utf8'});
  assert.notEqual(result.status,0);assert.match(result.stderr,/模板资源校验失败/);assert.ok(!fs.existsSync(path.join(dir,'bad.html')));
  const guide=fs.readFileSync(path.join(skill,'SKILL.md'),'utf8');assert.ok(guide.length<4200,'默认指引仅保留内容与一次调用，详细规则按需读取');
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('可直接打开的模板预览与Skill使用同一组装器，不把未注入模板作为成果',()=>{
 const D=require('../src/document.cjs'),source=D.withRecipe(fs.readFileSync(path.join(root,'examples/model-selection.md'),'utf8'),L.resolveRecipe('P39'));
 const expected=D.generate({source,recipeCode:L.resolveRecipe('P39').code,standalone:true,player:true});
 assert.equal(fs.readFileSync(path.join(root,'src/player.html'),'utf8'),expected);
 assert.equal(fs.readFileSync(path.join(root,'dist/skill-examples/reader.html'),'utf8'),expected);
 assert.ok(!expected.includes('/*__'));assert.ok(fs.readFileSync(path.join(root,'src/player.template.html'),'utf8').includes('/*__BOOT__*/'));
});
