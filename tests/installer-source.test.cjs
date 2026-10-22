'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
const {installationSource}=require('../bin/install.cjs'),root=path.resolve(__dirname,'..');
test('first install reuses the downloaded bundle instead of cloning the repository again',()=>{
 assert.equal(installationSource({},'1.0.0'),root);
 assert.equal(installationSource({'--tag':'1.0.0'},'1.0.0'),root);
});
test('explicit sources, older pins, updates and rollback retain their intended sources',()=>{
 assert.equal(installationSource({'--source':'/tmp/custom'},'1.0.0'),'/tmp/custom');
 assert.equal(installationSource({'--tag':'0.9.0'},'1.0.0'),'https://github.com/MarkingYang/mindbox/tree/v0.9.0');
 assert.equal(installationSource({'--update':true},'1.0.0'),'MarkingYang/mindbox');
 assert.equal(installationSource({'--rollback':true},'1.0.0','/tmp/previous'),'/tmp/previous');
});
