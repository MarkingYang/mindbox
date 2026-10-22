'use strict';
// Split only transport resources; the assembled HTML remains the canonical reader.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const FONT_SLOT='/*__MINDBOX_READER_FONTS__*/',DATA_SLOT='__MINDBOX_FONT_DATA__';
function split(root,template){
 const css=template.match(/<style>([\s\S]*?)<\/style>/)[1];
 const files=new Map(fs.readdirSync(path.join(root,'assets/fonts')).filter(f=>f.endsWith('.woff2')).map(f=>[fs.readFileSync(path.join(root,'assets/fonts',f)).toString('base64'),f]));
 const rules=[...css.matchAll(/\/\*[\s\S]*?\*\/\s*@font-face\{[^}]+\}/g)].map(m=>m[0]);
 const fonts=rules.map(rule=>{
  const family=rule.match(/font-family:'([^']+)'/)[1],data=rule.match(/data:font\/woff2;base64,([A-Za-z0-9+/=]+)/)[1],file=files.get(data);
  if(!file)throw new Error('Reader font does not match a bundled WOFF2: '+family);
  return {family,url:'fonts/'+file,css:rule.replace(data,DATA_SLOT)};
 });
 if(!fonts.length||!css.startsWith(rules.join('')))throw new Error('Canonical reader font block was not found');
 const shell=template.replace(css,()=>FONT_SLOT+css.slice(rules.join('').length));
 const manifest={format:1,fonts},hash=crypto.createHash('sha256').update(shell).update(JSON.stringify(manifest)).digest('hex').slice(0,16);
 return {shell,manifest,assets:{shell:'downloads/reader-shell.html?v='+hash,fonts:'downloads/reader-fonts.json?v='+hash}};
}
module.exports={split};
