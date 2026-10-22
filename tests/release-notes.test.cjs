const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),{releaseNotes}=require('../scripts/release-notes.cjs');
test('release notes accept bare, dated and bracketed version headings without including the next release',()=>{
 for(const header of ['## 0.34.0','## 0.34.0 — 2026-10-21','## [0.34.0] - 2026-10-21']){const notes=releaseNotes('# Changes\n\n'+header+'\n\n- Ship\n\n## 0.33.0\n- Old','0.34.0');assert.ok(notes.includes('- Ship'));assert.ok(!notes.includes('- Old'));}
 assert.ok(releaseNotes(fs.readFileSync('CHANGELOG.md','utf8'),'0.33.0').includes('Anchor'));
 assert.throws(()=>releaseNotes('## 0.34.0\n\n## 0.33.0\nOld','0.34.0'),/Empty/);assert.throws(()=>releaseNotes('## 0.34.00\nWrong','0.34.0'),/Missing/);
});
