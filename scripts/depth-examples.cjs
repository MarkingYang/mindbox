/* Build honest depth studies from the same measured nodes and renderer as real maps. */
const fs=require('node:fs'),path=require('node:path'),K=require('../src/engine.cjs'),R=require('../src/render.cjs'),D=require('../src/document.cjs');
module.exports=function buildDepthExamples(root){
 const out=path.join(root,'dist/depth-examples'),L=K.library,fonts=new Map();fs.mkdirSync(out,{recursive:true});
 const cards=L.selectedPresets().map(p=>{
  const recipe=L.resolveRecipe(p.id),t=L.themeFor(recipe),lang=recipe.tokens.T.language==='en'?'en':'zh';
  const source=D.withRecipe(p.positioning.depthSpecimens[lang],recipe),html=D.generate({source,recipeCode:recipe.code,standalone:true,player:true});
  fs.writeFileSync(path.join(out,p.id+'.html'),html);
  for(const m of html.match(/<style>([\s\S]*?)<\/style>/)[1].matchAll(/\/\*[\s\S]*?\*\/\s*@font-face\{[^}]+\}/g))fonts.set(m[0].match(/font-family:'([^']+)'/)[1],m[0]);
  const labels=lang==='en'?['Core idea','Section','Topic','Detail','Annotation','Reference']:['中心主题','一级主题','二级要点','三级细节','四级批注','五级补充'];
  const sample=['```mermaid','mindmap',...labels.map((label,i)=>'  '.repeat(i+1)+label),'```'].join('\n');
  // This is a node-style study, with no invented relationships; complete maps are linked below.
  const measured=K.layoutTree(K.parseMindmap(sample),recipe.tokens.L.id,new Set(),Infinity,t.density);
  const nodes=measured.nodes.map((n,i)=>({...n,x:155,y:55+i*78})),geo={...measured,nodes,edges:[]};
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 310 492" role="img" aria-label="${K.escapeXML(p.name)}的六层节点样式" style="background:${t.bg}">${R.svgContent(geo,t,recipe.tokens.L.id,new Set(),false)}</svg>`;
  return `<article><header><span>${p.uid}</span><h2>${K.escapeXML(p.name.split(' · ')[0])}</h2></header>${svg}<a href="${p.id}.html">打开完整多层导图 ↗</a></article>`;
 }).join('');
 const css=`${[...fonts.values()].join('\n')}*{box-sizing:border-box}body{margin:0;padding:44px 5vw 60px;background:#f6f7f2;color:#26362f;font:14px/1.65 -apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif}main{max-width:1440px;margin:auto}h1{font-size:32px;letter-spacing:-.04em;margin:7px 0 10px}main>p{color:#718172;max-width:780px}small{letter-spacing:.15em;color:#718172}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px;margin-top:32px}article{background:white;border:1px solid #dce3d7;border-radius:16px;overflow:hidden}article header{display:flex;align-items:center;gap:12px;padding:16px 20px;border-bottom:1px solid #edf0e9}h2{font-size:16px;margin:0}header span{font-size:11px;color:#75876f}svg{display:block;width:100%;height:auto}a{display:block;color:#45674e;padding:15px 20px;border-top:1px solid #edf0e9;text-decoration:none;font-size:12px}a:hover{background:#f3f6ef}a:focus-visible{outline:3px solid #719f87;outline-offset:-4px}@media(max-width:1080px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){.grid{grid-template-columns:1fr}body{padding:25px 16px}h1{font-size:27px}}`;
 fs.writeFileSync(path.join(out,'index.html'),`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>mindbox · 16套层级延展</title><style>${css}</style><main><small>MINDBOX / 16 STYLES</small><h1>越往深处，仍然分得清。</h1><p>每套风格的六层真实节点。保留原来的前三层，之后依次转为细节与批注，再按深度持续递推。这里对照节点形态；打开完整导图可查看连接、折叠、阅读演示与导出。</p><section class="grid">${cards}</section></main></html>`);
};
