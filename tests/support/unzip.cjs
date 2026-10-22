// Test-only reader for the regular ZIPs produced by scripts/zip.cjs.
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib');
function extract(file,directory) {
 const data=fs.readFileSync(file);let at=0;
 while(data.readUInt32LE(at)===0x04034b50) {
  const method=data.readUInt16LE(at+8);if(![0,8].includes(method)) throw new Error('Unsupported compression');
  const size=data.readUInt32LE(at+18),nameSize=data.readUInt16LE(at+26),extra=data.readUInt16LE(at+28);
  const name=data.toString('utf8',at+30,at+30+nameSize),target=path.resolve(directory,name),start=at+30+nameSize+extra;
  if(!target.startsWith(path.resolve(directory)+path.sep)) throw new Error('Unsafe archive path');
  const bytes=data.subarray(start,start+size);
  fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,method===8?zlib.inflateRawSync(bytes):bytes);
  at=start+size;
 }
}
module.exports={extract};
