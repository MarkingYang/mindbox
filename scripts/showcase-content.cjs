'use strict';
const fs=require('node:fs'),path=require('node:path'),K=require('../src/engine.cjs');
function load(root){return require(path.join(root,'examples/catalogue.json')).map(item=>{
 const source=fs.readFileSync(path.join(root,'examples',item.source),'utf8'),tree=K.parseMindmap(source),lines=['```mermaid','mindmap','  root(('+tree.text+'))'];
 // A readable cover, not a claim to display the full map at card scale.
 for(const n of tree.children.slice(0,3)){lines.push('    '+n.text);for(const child of n.children.slice(0,2))lines.push('      '+child.text);}
 return {...item,sourceFile:item.source,source,previewSource:lines.concat('```').join('\n'),nodes:K.descendants(tree)+1,levels:Math.max(...flatten(tree).map(n=>n.depth))+1};
});}
function flatten(n){return[n,...n.children.flatMap(flatten)];}
module.exports={load};
