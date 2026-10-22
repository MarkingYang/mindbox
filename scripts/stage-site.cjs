'use strict';
// Publish the useful entry points, not hundreds of MB of legacy compatibility HTML.
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'../dist'),out=path.join(root,'site');
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
for(const name of ['index.html','quickstart.html','.nojekyll','CNAME','robots.txt','sitemap.xml','site.webmanifest','404.html','brand','fonts','downloads','depth-examples','quality','showcase','skill-examples','style-library.json']) {
 fs.cpSync(path.join(root,name),path.join(out,name),{recursive:true});
}
console.log('Public site staged: '+out);
