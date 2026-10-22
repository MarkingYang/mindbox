const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const D=require('../src/document.cjs'),K=require('../src/engine.cjs'),L=K.library;
const source='```mermaid\nmindmap\n  root((网站与Skill一致))\n    内容\n      依据\n```';
test('website reader export is byte-identical to canonical Skill HTML for16 styles and custom composition',()=>{
 const X=require('../src/reader-export.cjs'),template=D.generate({source,recipeCode:L.resolveRecipe('P61').code,standalone:true,player:true},{allPlayerFonts:true});
 const recipes=[...L.selectedPresets().map(p=>L.resolveRecipe(p.id)),L.resolveRecipe('L05-N18-E02-C43-B40-T09-D03')];
 for(const recipe of recipes){const boot={source,recipeCode:recipe.code,standalone:true,player:true};const html=X.prepare(template,boot);assert.equal(html,D.generate(boot),recipe.code);assert.ok(html.includes('id="branch-toggle"'));assert.ok(!html.includes('id="catalogue"'));}
 assert.ok(fs.readFileSync('src/app.js','utf8').includes('MindboxReaderExport.createLoader'));
});
test('binding preserves literal less-than, closing script text and dollar sequences without executing source',()=>{
 const X=require('../src/reader-export.cjs'),boot={source:source.replace('依据','2 < 3 和 </script> $&'),recipeCode:L.resolveRecipe('P39').code,standalone:true,player:true};
 const html=X.prepare(D.generate({source,preset:'P61',player:true,standalone:true},{allPlayerFonts:true}),boot),data=JSON.parse(html.match(/<script id="atlas-boot">window.ATLAS_BOOT=([\s\S]*?);<\/script>/)[1]);
 assert.equal(data.source,boot.source);assert.equal(html,D.generate(boot));
});
test('invalid reader shell fails rather than downloading a landing page or404',()=>{
 const X=require('../src/reader-export.cjs');assert.throws(()=>X.prepare('<html>404</html>',{source,recipeCode:'P61'}),/模板/);
});
test('browser bundle contains no premature closing script tag',()=>{
 assert.ok(!/<\/script\s*>/i.test(fs.readFileSync('src/reader-export.cjs','utf8')));
});
