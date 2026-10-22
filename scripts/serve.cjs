const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../dist');
if(!fs.existsSync(path.join(root,'index.html')))require('./build.cjs');
const portIndex=process.argv.indexOf('--port');
const port=portIndex>=0?Number(process.argv[portIndex+1]):4173;
const types={'.html':'text/html;charset=utf-8','.json':'application/json;charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.md':'text/markdown;charset=utf-8','.zip':'application/zip'};
http.createServer((req,res)=>{
  let filename;
  try{filename=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));}catch{res.writeHead(400);return res.end('Bad request');}
  if(filename===root)filename=path.join(root,'index.html');
  if(!filename.startsWith(root+path.sep)){res.writeHead(403);return res.end('Forbidden');}
  fs.readFile(filename,(error,data)=>{if(error){res.writeHead(404);return res.end('Not found');}res.writeHead(200,{'Content-Type':types[path.extname(filename)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(data);});
}).listen(port,'127.0.0.1',()=>console.log(`思维导图图鉴：http://127.0.0.1:${port}`));
