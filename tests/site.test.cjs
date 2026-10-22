'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const dist=path.resolve(__dirname,'../dist');
test('public website navigation, real example links and local brand assets resolve from the staged root',()=>{
 const html=fs.readFileSync(path.join(dist,'index.html'),'utf8').replace(/<script\b[\s\S]*?<\/script>/g,'');
 const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
 for(const [,href] of html.matchAll(/\bhref="([^"]+)"/g)){
  if(href.startsWith('#')){assert.ok(ids.has(href.slice(1)),href);continue;}
  if(/^(https?:|data:)/.test(href))continue;
  assert.ok(fs.existsSync(path.join(dist,href.split('#')[0])),href);
 }
 for(const name of ['mark.svg','favicon.svg','favicon-32.png','apple-touch-icon.png','icon-192.png','icon-512.png','share.png'])assert.ok(fs.statSync(path.join(dist,'brand',name)).size>0,name);
 for(const name of ['favicon-32.png','apple-touch-icon.png','icon-192.png','icon-512.png','share.png'])assert.equal(fs.readFileSync(path.join(dist,'brand',name)).subarray(0,8).toString('hex'),'89504e470d0a1a0a');
 const share=fs.readFileSync(path.join(dist,'brand/share.png'));assert.equal(share.readUInt32BE(16),1200);assert.equal(share.readUInt32BE(20),630);
});
test('custom-domain metadata and manifest consistently target mindbox.ink without embedding deployment credentials',()=>{
 assert.equal(fs.readFileSync(path.join(dist,'CNAME'),'utf8').trim(),'mindbox.ink');
 const manifest=JSON.parse(fs.readFileSync(path.join(dist,'site.webmanifest'),'utf8'));
 assert.equal(manifest.start_url,'./');assert.equal(manifest.scope,'./');
 for(const icon of manifest.icons)assert.ok(fs.existsSync(path.join(dist,icon.src)));
 const sitemap=fs.readFileSync(path.join(dist,'sitemap.xml'),'utf8');
 for(const [,url] of sitemap.matchAll(/<loc>(.*?)<\/loc>/g)){const u=new URL(url);assert.equal(u.origin,'https://mindbox.ink');assert.ok(fs.existsSync(path.join(dist,u.pathname==='/'?'index.html':u.pathname.slice(1))));}
 assert.ok(fs.readFileSync(path.join(dist,'robots.txt'),'utf8').includes('https://mindbox.ink/sitemap.xml'));
 assert.ok(fs.readFileSync(path.join(dist,'404.html'),'utf8').includes('noindex'));
});
test('published proof report is current and covers all160 structural cases honestly',()=>{
 const report=JSON.parse(fs.readFileSync(path.join(dist,'quality/report.json'),'utf8'));
 assert.equal(report.version,require('../package.json').version);assert.equal(report.browserChecked,false);assert.equal(report.cases,160);assert.equal(report.results.length,160);assert.equal(new Set(report.results.map(r=>r.uid)).size,16);assert.equal(new Set(report.results.map(r=>r.layout)).size,5);
 for(const r of report.results){assert.ok(r.passed);assert.ok(r.minFocusedTextPx>=24);assert.ok(r.nodes===21||r.nodes===298);}
 for(const fixture of report.fixtures)assert.ok(fs.existsSync(path.join(dist,'quality',fixture.file)));
 const html=fs.readFileSync(path.join(dist,'index.html'),'utf8');for(const id of ['hero-open-reader','reader-demo','reader-demo-frame','try-current-reader','quality'])assert.ok(html.includes('id="'+id+'"'));
 assert.ok(fs.existsSync(path.join(dist,'downloads/reader-template.html')));
});

test('opening the source template redirects to the built homepage and preserves the anchor',()=>{
 const vm=require('node:vm');
 const source=fs.readFileSync(path.join(__dirname,'../src/index.html'),'utf8');
 const guard=source.match(/<script id="source-preview">([\s\S]*?)<\/script>/);
 assert.ok(guard,'source template needs a preview entry');
 let destination;
 vm.runInNewContext(guard[1],{location:{hash:'#top',replace(value){destination=value;}}});
 assert.equal(destination,'../dist/index.html#top');
 const html=require('../src/document.cjs').generate({source:'```mermaid\nmindmap\n  root((Preview))\n```',standalone:false},{web:true});
 assert.ok(!html.includes('id="source-preview"'));
 assert.ok(!html.includes('/*__CSS__*/'));
});
