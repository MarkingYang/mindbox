'use strict';
function releaseNotes(markdown,version){
 if(!/^\d+\.\d+\.\d+$/.test(version))throw new Error('Invalid release version');
 const lines=markdown.split(/\r?\n/),escaped=version.replace(/\./g,'\\.'),heading=new RegExp('^##\\s+\\[?'+escaped+'\\]?(?:\\s.*)?$'),start=lines.findIndex(line=>heading.test(line));
 if(start<0)throw new Error('Missing changelog entry: '+version);
 let end=start+1;while(end<lines.length&&!/^##\s/.test(lines[end]))end++;
 const result=lines.slice(start,end).join('\n').trim();if(!lines.slice(start+1,end).some(line=>line.trim()))throw new Error('Empty changelog entry: '+version);return result+'\n';
}
module.exports={releaseNotes};
