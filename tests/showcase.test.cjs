const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const K=require('../src/engine.cjs'),L=K.library,R=require('../src/render.cjs'),M=require('../src/media.cjs'),samples=require('../scripts/showcase-content.cjs').load(path.resolve(__dirname,'..')),signals=require('../references/showcase-topic-signals.json');
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
test('16份内容一一对应原样式与目标读者，封面是可辨认的正文预览',()=>{
 assert.equal(samples.length,16);assert.deepEqual(samples.map(s=>s.preset).sort(),L.selection.presets.slice().sort());assert.equal(new Set(samples.map(s=>s.title)).size,16);assert.equal(new Set(samples.map(s=>s.id)).size,16);
 for(const s of samples){const tree=K.parseMindmap(s.source),preview=K.parseMindmap(s.previewSource);assert.equal(tree.text,s.title);assert.equal(preview.text,s.title);assert.ok(s.nodes>=25&&s.nodes<=80);assert.ok(s.levels>=4&&s.levels<=20);assert.ok(K.descendants(preview)<K.descendants(tree));assert.ok(s.audience&&s.summary);for(const id of s.signals)assert.ok(signals.signals.some(x=>x.id===id));const all=new Set();(function visit(n){all.add(n.text);n.children.forEach(visit)})(tree);(function visit(n){assert.ok(all.has(n.text));n.children.forEach(visit)})(preview);
  const r=L.resolveRecipe(s.preset),t=L.themeFor(r),g=K.layoutTree(tree,r.tokens.L.id,new Set(),Infinity,t.density),svg=R.svgContent(g,t,r.tokens.L.id,new Set(),false);assert.equal((svg.match(/class="node-label"/g)||[]).length,s.nodes);assert.ok(!/NaN|Infinity/.test(svg));for(const id of s.signals)assert.ok(s.source.includes(signals.signals.find(x=>x.id===id).url));
 }
 assert.ok(samples.filter(s=>s.levels>=5).length>=4);
});
test('动图是当前规范渲染器的真实多帧WebP，媒体与故事来源无漂移',()=>{
 const b=fs.readFileSync('assets/showcase/doodle-story.webp'),meta=require('../assets/showcase/doodle-story.json'),source=fs.readFileSync('examples/doodle-story.md','utf8');assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(b.toString('ascii',8,12),'WEBP');assert.equal(b.readUInt32LE(4)+8,b.length);assert.equal(hash(b),meta.webpSHA256);assert.equal(hash(source),meta.sourceSHA256);assert.equal(hash(M.svg(M.scene(K.parseMindmap(source),L.resolveRecipe('P67')))),meta.svgSHA256);assert.deepEqual(M.readingSteps(M.scene(K.parseMindmap(source),L.resolveRecipe('P67')).geo).map(s=>s.label),meta.readingLabels);
 let frames=0,duration=0;for(let at=12;at<b.length;){const type=b.toString('ascii',at,at+4),len=b.readUInt32LE(at+4);if(type==='ANMF'){frames++;duration+=b.readUIntLE(at+20,3);}at+=8+len+len%2;}
 assert.equal(frames,meta.frames);assert.ok(frames>2);assert.equal(duration,meta.durationMs);assert.ok(b.length<500000);assert.equal(fs.readFileSync('assets/showcase/doodle-story-poster.png').subarray(0,8).toString('hex'),'89504e470d0a1a0a');assert.ok(fs.readFileSync('dist/showcase/doodle-story.webp').equals(b));
});
test('网页与独立范例身份相符，媒体有静态替代与减少动效逻辑',()=>{
 const html=fs.readFileSync('dist/index.html','utf8'),boot=JSON.parse(html.match(/window\.ATLAS_BOOT=([\s\S]*?);<\/script>/)[1]);assert.equal(boot.showcase.length,16);for(const s of samples){assert.ok(boot.showcase.some(x=>x.preset===s.preset&&x.source===s.source));assert.ok(fs.existsSync('dist/showcase/'+s.id+'.html'));assert.ok(fs.readFileSync('dist/showcase/index.html','utf8').includes(s.title));}
 for(const id of ['doodle-story-image','doodle-story-toggle','doodle-story-state'])assert.ok(html.includes('id="'+id+'"'));const landing=fs.readFileSync('src/landing.cjs','utf8');for(const marker of ['prefers-reduced-motion','IntersectionObserver','visibilitychange'])assert.ok(landing.includes(marker));assert.ok(fs.existsSync('dist/showcase/topics.html'));
});
