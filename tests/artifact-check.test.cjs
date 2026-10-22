const {test}=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const D=require('../src/document.cjs'),K=require('../src/engine.cjs'),C=require('../skills/mindbox/scripts/check.cjs');
const source='```mermaid\nmindmap\n  可核对的脑图\n    主张\n      依据\n```';
test('exact HTML checks return honest structural evidence and hashes across16 styles',()=>{
 for(const p of K.library.selectedPresets()){const html=D.generate({source,recipeCode:K.library.resolveRecipe(p.id).code,standalone:true,player:true}),receipt=C.inspectHTML(html);assert.equal(receipt.nodes,3);assert.equal(receipt.uid,p.uid);assert.equal(receipt.validation.browserChecked,false);assert.equal(receipt.sha256.html,crypto.createHash('sha256').update(html).digest('hex'));}
});
test('checker rejects malformed data, missing controls and external resources without evaluating HTML',()=>{
 const html=D.generate({source,preset:'P61',standalone:true,player:true});
 assert.throws(()=>C.inspectHTML(html.replace('window.ATLAS_BOOT={','window.ATLAS_BOOT=(()=>{')),/JSON/);
 assert.throws(()=>C.inspectHTML(html.replace('id="branch-toggle"','id="missing-control"')),/缺少控件/);
 assert.throws(()=>C.inspectHTML(html.replace('</head>','<script src="https://example.com/script.js"></script></head>')),/离线资源/);
 assert.throws(()=>C.inspectHTML('<html>404</html>'),/缺少/);
});
