const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),D=require('../src/document.cjs'),X=require('../src/reader-export.cjs'),L=require('../src/library.cjs');
const source='```mermaid\nmindmap\n  root((继续想想))\n    具体问题\n      下一步\n```';
function fixture(){
 const template=D.generate({source,preset:'P61',standalone:true,player:true},{allPlayerFonts:true});
 const assets=require('../scripts/reader-assets.cjs').split(root,template),calls=[];
 const fetch=async(url,{signal}={})=>{calls.push(new URL(url).pathname);if(signal?.aborted)throw new Error('aborted');const p=new URL(url).pathname.replace('/project/','');return new Response(p==='downloads/reader-shell.html'?assets.shell:p==='downloads/reader-fonts.json'?JSON.stringify(assets.manifest):fs.readFileSync(path.join(root,'assets',p)));};
 return {...assets,calls,fetch};
}
test('small reader shell plus selected cached fonts produces the exact offline Skill HTML for every style',async()=>{
 assert.equal(typeof X.createLoader,'function');const f=fixture(),load=X.createLoader({baseURL:'https://example.test/project/',fetch:f.fetch});
 assert.ok(Buffer.byteLength(f.shell)<300000);assert.ok(!f.shell.includes('data:font/woff2;base64,'));
 for(const p of [...L.selectedPresets(),{code:'L05-N18-E02-C43-B40-T09-D03'}]){
  const boot={source,recipeCode:p.code,standalone:true,player:true},html=await load(boot);
  assert.equal(html,D.generate(boot),p.code);assert.ok(!html.includes('__MINDBOX_READER_FONTS__'));
 }
 assert.equal(f.calls.filter(s=>s.endsWith('reader-shell.html')).length,1);
 assert.equal(f.calls.filter(s=>s.endsWith('reader-fonts.json')).length,1);
 assert.equal(new Set(f.calls).size,f.calls.length,'repeat styles reuse their downloaded fonts');
});
test('concurrent opens share downloads and only request the chosen style fonts',async()=>{
 assert.equal(typeof X.createLoader,'function');const f=fixture(),load=X.createLoader({baseURL:'https://example.test/project/',fetch:f.fetch}),boot={source,preset:'P68',standalone:true,player:true};
 const html=await Promise.all([load(boot),load(boot)]);assert.equal(html[0],html[1]);
 assert.deepEqual(f.calls.filter(s=>s.endsWith('.woff2')).sort(),['/project/fonts/business.woff2','/project/fonts/excalifont.woff2','/project/fonts/wenkai.woff2']);
 assert.equal(f.calls.length,5);
});
test('failed resources are retryable and a stalled request times out instead of hanging the card',async()=>{
 assert.equal(typeof X.createLoader,'function');const f=fixture();let fail=true;
 const load=X.createLoader({baseURL:'https://example.test/project/',timeoutMs:25,fetch:async(url,options)=>{
  if(fail&&String(url).includes('reader-shell'))return new Promise((resolve,reject)=>options.signal.addEventListener('abort',()=>reject(new Error('aborted')),{once:true}));return f.fetch(url,options);
 }});
 await assert.rejects(load({source,preset:'P68'}),/超时/);fail=false;
 assert.equal(await load({source,preset:'P68'}),D.generate({source,preset:'P68',standalone:true,player:true}));
});

function element(){const e=new EventTarget();e.hidden=true;e.setAttribute=(k,v)=>{e[k]=v;};e.removeAttribute=k=>{delete e[k];};return e;}
function previewFixture(load){
 const dialog=element();dialog.open=false;dialog.showModal=()=>{dialog.open=true;};dialog.close=()=>{dialog.open=false;dialog.dispatchEvent(new Event('close'));};
 const frame=element(),status=element(),message=element(),retry=element(),button=element();button.innerHTML='<svg>keep the map preview</svg>';
 return {dialog,frame,status,message,retry,button,preview:X.preview({dialog,frame,status,message,retry,load})};
}
test('the modal opens immediately without deleting the preview; closing cancels a stale async result',async()=>{
 let complete;const f=previewFixture(()=>new Promise(resolve=>{complete=resolve;}));
 const pending=f.preview.open({source,preset:'P68'},f.button);
 assert.equal(f.dialog.open,true);assert.equal(f.status.hidden,false);assert.equal(f.button.innerHTML,'<svg>keep the map preview</svg>');
 f.dialog.close();assert.equal(f.button.disabled,false);complete('stale HTML');assert.equal(await pending,false);assert.equal(f.frame.srcdoc,undefined);assert.equal(f.frame.hidden,true);
});
test('a failed open offers retry, and a previous late response cannot replace a newer map',async()=>{
 let fail=true,first;const f=previewFixture(async boot=>{if(fail)throw new Error('连接超时，请重试');return boot.name==='old'?new Promise(resolve=>{first=resolve;}):'new HTML';});
 assert.equal(await f.preview.open({name:'old'},f.button),false);assert.equal(f.retry.hidden,false);assert.equal(f.message.textContent,'连接超时，请重试');assert.equal(f.button.disabled,false);
 fail=false;const previous=f.preview.open({name:'old'},f.button);await f.preview.open({name:'new'},f.button);
 first('old HTML');await previous;assert.equal(f.frame.srcdoc,'new HTML');f.frame.onload();assert.equal(f.status.hidden,true);
});
