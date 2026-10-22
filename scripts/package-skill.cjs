const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),L=require('../src/library.cjs'),P=require('../src/picker.cjs'),Names=require('../skills/mindbox/scripts/style-names.cjs');
function packageSkill(){
 const skill=path.join(root,'skills/mindbox'),runtime=path.join(skill,'assets/runtime');
 const version=require('../package.json').version;
 fs.copyFileSync(path.join(root,'LICENSE'),path.join(skill,'LICENSE'));
 fs.copyFileSync(path.join(root,'THIRD_PARTY_NOTICES.md'),path.join(skill,'THIRD_PARTY_NOTICES.md'));
 fs.writeFileSync(path.join(skill,'version.json'),JSON.stringify({version,schemaVersion:1,license:'MIT',releaseTag:'v'+version,node:'>=22.20.0',presets:L.selection.presets,styleUIDs:L.styleUIDs},null,2)+'\n');
 fs.copyFileSync(path.join(root,'LICENSE'),path.join(runtime,'LICENSE'));
 fs.mkdirSync(path.join(runtime,'src'),{recursive:true});fs.mkdirSync(path.join(runtime,'assets/fonts'),{recursive:true});
 for(const name of ['library.cjs','hierarchy.cjs','engine.cjs','edit.cjs','doodle.cjs','fusheng.cjs','render.cjs','picker.cjs','reader-export.cjs','app.js','landing.cjs','document.cjs','index.html','styles.css','site.css','media.cjs','player.template.html','player.css','player.js'])fs.copyFileSync(path.join(root,'src',name),path.join(runtime,'src',name));
 for(const name of fs.readdirSync(path.join(root,'assets/fonts')))fs.copyFileSync(path.join(root,'assets/fonts',name),path.join(runtime,'assets/fonts',name));
 // Pin the exact runtime/resources so stale installed templates fail clearly instead of drifting.
 fs.rmSync(path.join(runtime,'src/player.html'),{force:true});
 const files={};
 for(const folder of ['src','assets/fonts'])for(const file of fs.readdirSync(path.join(runtime,folder)).sort()){
  const rel=folder+'/'+file;files[rel]=crypto.createHash('sha256').update(fs.readFileSync(path.join(runtime,rel))).digest('hex');
 }
 files.LICENSE=crypto.createHash('sha256').update(fs.readFileSync(path.join(runtime,'LICENSE'))).digest('hex');
 const renderer=crypto.createHash('sha256').update(JSON.stringify(files)).digest('hex');
 fs.writeFileSync(path.join(runtime,'manifest.json'),JSON.stringify({format:1,version,renderer,files},null,2)+'\n');
 let guide='# 完整样式与内部组合规范\n\n用户用名称和简称选择；固定代号用于保存精确配方，不是使用率排名。\n\n## 16套默认样式\n\n| 样式编码 | 名称 | 常用简称 | 用途 | 同类完整备选 | 完整组合 |\n|---|---|---|---|---|---|\n';
 for(const p of Names.catalogue(L))guide+=`| ${p.uid} | ${p.name} | ${p.aliases.join('、')} | ${p.purpose} | ${p.alternatives.join("、")} | ${p.code} |\n`;
 guide+='\n## 内部扩展与兼容入口\n\n正常生成、按偏好换风格均先从上述16套完整样式中选择，不主动组合单项。仅用户明确要求维护样式库、导入旧七维配方或限定单项改动时使用以下接口；网页不展示自定义入口。\n\n七维顺序固定为L-N-E-C-B-T-D。只替换明确指定的维度，保留其他维度。L04只支持E01/E05/E06结构括号；L05只支持E02/E05/E06提纲导线。内部组合示例：`L01-N18-E09-C43-B40-T09-D03`。以`--style`传入完整代号，脚本会拒绝无效组合。\n';
 for(const axis of L.order){guide+=`\n### ${axis}${L.axes[axis].name}\n\n`;guide+=L.selectedItems(axis).map(item=>`- ${item.code}：${P.describe(axis,item,'balanced').name}。${P.describe(axis,item,'balanced').hint}`).join('\n')+'\n';}
 guide+='\nN18趣味涂鸦内含32枚原创笔触：14种小搭子与18种容器/记号，按稳定节点身份和层级组合，单节点只占用一个次要装饰位，末端不套纸框，多行色标跟随最后一行，目录排序不影响节点造型；深层保留轻笔迹。D03舒展保留分支搭子，D02标准保留小记号，D01紧凑只留标题搭子。它们不是额外的七维选项，不需要用户逐一选择。\n';
 guide+='\nMMH0S8 浮生小趣沿用原固定身份与组合，新增8个灰驴姿态、4种纸笺和4种记号。蓝灰底、暖灰与杏色，适合工作与生活随想。旧名称粉笔夜谈仍可导入；小毛驴只是装饰，不表示节点优先级或完成状态。\n';
 guide+='\n自定义指现有组件的自由搭配。用户要求库外字体、全新节点或任意关系网络时，说明现有渲染器限制，先给可实现的组合，不虚构新代号。SVG和字体随HTML内嵌，不需要CDN；受限Mermaid语法是内容交换格式，实际样式以本包HTML为准。\n';
 fs.writeFileSync(path.join(skill,'references/style-combinations.md'),guide);
 const downloads=path.join(root,'dist/downloads');fs.mkdirSync(downloads,{recursive:true});
 fs.writeFileSync(path.join(downloads,'starter.md'),['---','preset: MMK0V1','---','','```mermaid','mindmap','  root((读懂一份资料))','    核心观点','      一句话概括','    关键依据','      来自哪里','    我的行动','      先做一件事','```','','来源：填写实际链接、章节或代码路径。',''].join('\n'));
 const M=require('../skills/mindbox/scripts/manage.cjs'),packageFiles=M.packageFiles(skill);
 fs.writeFileSync(path.join(skill,'package-manifest.json'),JSON.stringify({format:1,version,files:packageFiles,digest:M.hash(JSON.stringify(packageFiles))},null,2)+'\n');
 require('./zip.cjs').zipDirectory(skill,path.join(downloads,'mindbox.zip'));
 // Keep old download links valid without installing a second Skill.
 fs.copyFileSync(path.join(downloads,'mindbox.zip'),path.join(downloads,'zhixu-mindmap.zip'));
 return skill;
}
module.exports=packageSkill;
if(require.main===module){const skill=packageSkill();if(process.argv.includes('--install')){const base=process.env.CODEX_HOME||path.join(require('node:os').homedir(),'.codex'),target=path.join(base,'skills/mindbox');if(fs.existsSync(target))throw new Error('目标目录已存在，请先检查并按需更新：'+target);fs.mkdirSync(path.dirname(target),{recursive:true});fs.cpSync(skill,target,{recursive:true});console.log('已安装：'+target);}else console.log('已打包：'+skill);}
