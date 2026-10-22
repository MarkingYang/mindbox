const fs=require('node:fs');
const path=require('node:path');
const K=require('../src/engine.cjs');
const Doodle=require('../src/doodle.cjs');
const Fusheng=require('../src/fusheng.cjs');
const Picker=require('../src/picker.cjs');
const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const source=read('examples/knowledge-work.md');
const {generate,withRecipe}=require('../src/document.cjs');
fs.mkdirSync(path.join(root,'dist','examples'),{recursive:true});
fs.cpSync(path.join(root,'assets/brand'),path.join(root,'dist/brand'),{recursive:true});
for(const file of fs.readdirSync(path.join(root,'src/site-public')))fs.copyFileSync(path.join(root,'src/site-public',file),path.join(root,'dist',file));
const showcase=require('./showcase-content.cjs').load(root);
const sourceOptions=K.parseOptions(source);
let initialRecipe=K.library.resolveRecipe(sourceOptions.recipeCode||(sourceOptions.theme?K.library.legacy[sourceOptions.theme]:'P07'));
if(sourceOptions.layout)initialRecipe=K.library.replaceToken(initialRecipe,'L',K.library.axes.L.items.find(l=>l.id===sourceOptions.layout).code);
const readerTemplate=generate({source,recipeCode:initialRecipe.code,standalone:true,player:true},{allPlayerFonts:true});
const readerAssets=require('./reader-assets.cjs').split(root,readerTemplate);
fs.mkdirSync(path.join(root,'dist/downloads'),{recursive:true});
fs.writeFileSync(path.join(root,'dist/downloads/reader-shell.html'),readerAssets.shell);
fs.writeFileSync(path.join(root,'dist/downloads/reader-fonts.json'),JSON.stringify(readerAssets.manifest));
fs.writeFileSync(path.join(root,'dist','index.html'),generate({source,showcase,readerAssets:readerAssets.assets,recipeCode:initialRecipe.code,standalone:false},{web:true}));
fs.cpSync(path.join(root,'assets/fonts'),path.join(root,'dist/fonts'),{recursive:true});
const manifest=[];
for(const l of K.layouts.filter(l=>l.id!=='outline'))for(const t of K.themes){
  const name=`${l.id}-${t.id}.html`;
  fs.writeFileSync(path.join(root,'dist','examples',name),generate({source:withRecipe(source,K.library.replaceToken(K.library.resolveRecipe(t.preset),'L',l.code)),recipeCode:K.library.replaceToken(K.library.resolveRecipe(t.preset),'L',l.code).code,layout:l.id,theme:t.id,standalone:true,player:true,references:[]}));
  manifest.push({layout:l.id,theme:t.id,file:`examples/${name}`});
}
fs.writeFileSync(path.join(root,'dist','manifest.json'),JSON.stringify(manifest,null,2)+'\n');
fs.mkdirSync(path.join(root,'dist','presets'),{recursive:true});
for(const p of K.library.presets)fs.writeFileSync(path.join(root,'dist','presets',`${p.id}.html`),generate({source,preset:p.id,standalone:true,player:true,references:[]}));
fs.writeFileSync(path.join(root,'dist','style-library.json'),JSON.stringify({version:K.library.version,defaultUID:'MMK0V1',styleUIDs:K.library.styleUIDs,defaultPreset:'P61',selection:K.library.selection,tasks:K.library.tasks,recommendations:K.library.recommendations,doodle:{node:'N18',parts:Doodle.parts,families:Doodle.families},fusheng:{uid:'MMH0S8',parts:Fusheng.parts,families:Fusheng.families},axes:Object.fromEntries(K.library.order.map(axis=>[axis,{name:K.library.axes[axis].name,items:K.library.selectedItems(axis).map(item=>({...item,display:Picker.describe(axis,item,'balanced')}))}])),presets:K.library.selectedPresets(),compatibilityArchive:{axes:K.library.axes,presets:K.library.presets},sources:K.library.sources,legacy:K.library.legacy,compatibility:Object.fromEntries(K.library.axes.L.items.map(l=>[l.code,{edges:K.library.allowedEdges(l.id)}]))},null,2)+'\n');
console.log(`已生成 ${K.library.selectedPresets().length} 个精选预设、${K.library.presets.length} 个兼容样例和 ${manifest.length} 份旧版兼容样例。`);
require('./package-skill.cjs')();
// Preserve already-open v1.0.0 pages; new pages use the small shell and cached font files.
fs.writeFileSync(path.join(root,'dist/downloads/reader-template.html'),readerTemplate);

// A runnable preview, not the internal placeholder template. Same inputs as the Skill CLI.
const previewSource=withRecipe(read('examples/model-selection.md'),K.library.resolveRecipe('P39'));
const preview=generate({source:previewSource,recipeCode:K.library.resolveRecipe('P39').code,standalone:true,player:true});
fs.mkdirSync(path.join(root,'dist/skill-examples'),{recursive:true});
fs.writeFileSync(path.join(root,'dist/skill-examples/reader.html'),preview);
fs.writeFileSync(path.join(root,'src/player.html'),preview);

require('./depth-examples.cjs')(root);
require('./showcase.cjs')(root);
require('./quality.cjs').buildQuality(root);
fs.writeFileSync(path.join(root,'dist/.nojekyll'),'');
