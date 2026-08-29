// Produces a portable build of Mahi's Vault by inlining every CSS file and the
// whole ES-module graph into one HTML file. No dependencies, no bundler.
//
//   node build.js            -> standalone.html   (CSS + JS inline, assets/ referenced)
//   node build.js --inline   -> also standalone-inline.html (single file, PNGs as data URIs)
//
// standalone.html + the assets/ folder can be dropped onto any static host or
// embedded via <iframe>. standalone-inline.html needs nothing else (~11 MB).
import {readFileSync,writeFileSync} from 'node:fs';

const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
const readBin=p=>readFileSync(new URL(p,import.meta.url));

// Module graph in dependency order (leaves first, main.js last).
const MODULES=[
 'src/math/mathEngine.js',
 'src/data/knowledge.js',
 'src/data/stages.js',
 'src/data/level1.js',
 'src/game/lifeSystem.js',
 'src/game/trapSystem.js',
 'src/game/player.js',
 'src/game/world.js',
 'src/quiz/quizEngine.js',
 'src/main.js',
];
const ASSETS=[
 'mahi-sprite-sheet.png',
 'moonstone-sentinel-sheet.png',
 'ember-moss-villains-sheet.png',
 'advanced-creatures-sheet.png',
 'starwise-guru.png',
];

// Strip `import ... from '...'` statements and the `export` keyword so every
// module's top-level bindings share one module scope. All names are unique
// across the project, so a plain concatenation is safe.
function flatten(src){
 return src
  .replace(/import\s*(?:\{[^}]*\}|[\w*$]+)\s*from\s*['"][^'"]+['"]\s*;?/g,'')
  .replace(/^\s*export\s*\{[^}]*\}\s*;?\s*$/gm,'')
  .replace(/\bexport\s+(?=(?:default\s+)?(?:function|const|let|var|class|async)\b)/g,'');
}

const bundle=MODULES.map(m=>`/* ${m} */\n${flatten(read(m)).trim()}\n`).join('\n');

let html=read('index.html');

// Inline every <link rel="stylesheet" href="src/*.css">
html=html.replace(/<link rel="stylesheet" href="(src\/[^"]+\.css)">/g,
 (_,href)=>`<style>\n${read(href).trim()}\n</style>`);

// The glitter enhancement is requested dynamically in development. Inline it
// here because the portable public build does not ship a src/ directory.
html=html.replace('</head>',`<style>\n${read('src/coins-glitter.css').trim()}\n</style></head>`);

// Replace the module entry point with the flattened bundle.
html=html.replace(/<script type="module" src="src\/main\.js"><\/script>/,
 `<script type="module">\n${bundle}\n</script>`);

writeFileSync(new URL('standalone.html',import.meta.url),html);
console.log('wrote standalone.html  ('+(html.length/1024|0)+' KB) — deploy alongside the assets/ folder');

if(process.argv.includes('--inline')){
 let single=html;
 for(const name of ASSETS){
  const uri='data:image/png;base64,'+readBin('assets/'+name).toString('base64');
  single=single.split('assets/'+name).join(uri);
 }
 writeFileSync(new URL('standalone-inline.html',import.meta.url),single);
 console.log('wrote standalone-inline.html  ('+(single.length/1024/1024).toFixed(1)+' MB) — fully self-contained');
}
