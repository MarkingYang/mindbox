'use strict';
// Small, deterministic ZIP writer: regular files, UTF-8 names, STORE, no ZIP64.
// Build-time only; the installed Skill has no archiver or npm dependency.
const fs = require('node:fs');
const path = require('node:path');
const table = Uint32Array.from({length:256},(_,n)=>{
  for(let k=0;k<8;k++) n=n&1?0xedb88320^(n>>>1):n>>>1;
  return n>>>0;
});
function crc32(bytes) {
  let crc=0xffffffff;
  for(const byte of bytes) crc=table[(crc^byte)&255]^(crc>>>8);
  return (crc^0xffffffff)>>>0;
}
function zipDirectory(directory, destination) {
  const entries=[];
  function walk(folder) {
    for(const name of fs.readdirSync(folder).sort()) {
      const file=path.join(folder,name),stat=fs.lstatSync(file);
      if(stat.isSymbolicLink()) throw new Error('ZIP cannot contain symlinks: '+file);
      if(stat.isDirectory()) walk(file);
      else if(stat.isFile()) entries.push({file,name:path.basename(directory)+'/'+path.relative(directory,file).split(path.sep).join('/')});
    }
  }
  walk(directory);
  if(entries.length>65535) throw new Error('ZIP64 required');
  const locals=[],centrals=[];let offset=0;
  for(const entry of entries) {
    // WOFF2 is already compressed. STORE also avoids Node/zlib-version byte drift.
    const name=Buffer.from(entry.name),raw=fs.readFileSync(entry.file),compressed=raw,crc=crc32(raw);
    const local=Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50);local.writeUInt16LE(20,4);local.writeUInt16LE(0x800,6);
    local.writeUInt16LE(33,12); // 1980-01-01, fixed for reproducible archives.
    local.writeUInt32LE(crc,14);local.writeUInt32LE(compressed.length,18);local.writeUInt32LE(raw.length,22);local.writeUInt16LE(name.length,26);
    locals.push(local,name,compressed);
    const central=Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50);central.writeUInt16LE(20,4);central.writeUInt16LE(20,6);
    central.writeUInt16LE(0x800,8);central.writeUInt16LE(33,14);
    central.writeUInt32LE(crc,16);central.writeUInt32LE(compressed.length,20);central.writeUInt32LE(raw.length,24);
    central.writeUInt16LE(name.length,28);central.writeUInt32LE(offset,42);
    centrals.push(central,name);offset+=local.length+name.length+compressed.length;
  }
  const central=Buffer.concat(centrals),end=Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50);end.writeUInt16LE(entries.length,8);end.writeUInt16LE(entries.length,10);
  end.writeUInt32LE(central.length,12);end.writeUInt32LE(offset,16);
  fs.mkdirSync(path.dirname(destination),{recursive:true});
  fs.writeFileSync(destination,Buffer.concat([...locals,central,end]));
}
module.exports={zipDirectory,crc32};
