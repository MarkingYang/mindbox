const {test}=require('node:test'),assert=require('node:assert/strict'),{checkPublic}=require('../scripts/check-public.cjs');
const make=(status,version='0.34.0')=>async url=>({status,ok:status===200,text:async()=>url.endsWith('version.json')?JSON.stringify({version}):url.endsWith('package.json')?JSON.stringify({version,license:'MIT',bin:{'mindbox-install':'bin/install.cjs'}}):'#!/usr/bin/env node\n'});
test('public-source check distinguishes missing code, unreachable network and version mismatch',async()=>{
 assert.equal((await checkPublic(make(404),'0.34.0')).status,'unpublished');assert.equal((await checkPublic(async()=>{throw new Error('network');},'0.34.0')).status,'unavailable');assert.equal((await checkPublic(make(200,'0.33.0'),'0.34.0')).status,'version-mismatch');
});
test('source availability is not falsely represented as a real installation test',async()=>{const r=await checkPublic(make(200),'0.34.0');assert.ok(r.sourceReady);assert.equal(r.installationTested,false);});
