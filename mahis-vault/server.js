import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
const root=process.cwd(), types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'};
http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://x');let p=url.pathname==='/'?'index.html':url.pathname.slice(1);p=normalize(p);if(p.startsWith('..'))throw Error();const data=await readFile(join(root,p));res.writeHead(200,{'Content-Type':types[extname(p)]||'application/octet-stream'});res.end(data)}catch{res.writeHead(404);res.end('Not found')}}).listen(4173,()=>console.log("Mahi's Vault: http://localhost:4173"));
