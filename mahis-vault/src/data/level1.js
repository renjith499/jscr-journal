const guardians=[['Ember Imp','ember','Flame Dash'],['Moss Golem','golem','Root Shield'],['Moonstone Sentinel','sentinel','Moon Beam'],['Astral Sentinel','sentinel','Star Rush'],['Frost Owl','frost','Icy Wind'],['Storm Djinn','storm','Lightning Orb'],['Clockwork Beetle','beetle','Crystal Shield'],['Void Cat','voidcat','Teleport'],['Tempest Owl','frost','Twin Cyclone'],['Eclipse Cat','voidcat','Eclipse Shift']];

export function createLevel(stage=1){
 const width=(2400+stage*340)*5,gap=stage<4?65:75,platforms=[];let x=0,index=0;
 while(x<width){const w=stage===1?380:260+((index*73+stage*31)%150),rise=stage===2?(index%2)*35:stage>=7?(index%3)*28:((index+stage)%2)*15;platforms.push({x,y:490-rise,w:Math.min(w,width-x),h:90+rise});x+=w+gap;index++}
 const desiredOpponentX=Math.floor(width*.63),opponentPlatform=platforms.find(p=>desiredOpponentX>=p.x&&desiredOpponentX<p.x+p.w)||platforms.at(-2),opponentX=opponentPlatform.x+Math.min(100,opponentPlatform.w/2),[name,kind,power]=guardians[stage-1],checkpointX=Math.floor(width*.42),checkpointPlatform=platforms.find(p=>checkpointX>=p.x&&checkpointX<p.x+p.w)||platforms[1];
 const hazards=platforms.slice(1,-2).filter((_,i)=>(i+stage)%2===0).map(p=>({x:p.x+35,y:p.y-22,w:stage>=6?60:42,h:22})).filter(h=>Math.abs(h.x-opponentX)>150);
 const risers=platforms.slice(0,-1).filter((_,i)=>i%2===stage%2);
 const ledges=risers.map((p,i)=>({x:p.x+p.w-90,y:Math.max(245,p.y-115-(i%2)*35),w:100+(stage%3)*20,h:18}));
 const climbs=risers.map((p,i)=>{const ly=Math.max(245,p.y-115-(i%2)*35),lx=p.x+p.w-90;return i%2===1?{kind:'ladder',x:lx-22,y:ly-10,w:32,h:p.y-(ly-10)}:{kind:'stairs',x:lx-70,y:ly-8,w:80,h:p.y-(ly-8)}});
 const volcanoes=platforms.slice(3,-3).filter((_,i)=>i%4===stage%4).map((p,i)=>({x:Math.round(p.x+p.w*0.5),y:p.y,r:24,h:150,phase:i*0.9})).filter(v=>Math.abs(v.x-opponentX)>220&&Math.abs(v.x-checkpointPlatform.x)>170);
 const spikes=platforms.slice(2,-3).filter((_,i)=>i%3===(stage+1)%3).map((p,i)=>({x:Math.round(p.x+p.w*0.5-26),y:p.y-18,w:52,h:18,phase:i*1.3+0.6})).filter(s=>Math.abs(s.x-opponentX)>200&&Math.abs(s.x-checkpointPlatform.x)>150);
 const blades=platforms.slice(3,-4).filter((_,i)=>i%5===stage%5).map((p,i)=>({x:Math.round(p.x+p.w*0.5),y:p.y-140,w:16,h:96,phase:i*1.1})).filter(b=>Math.abs(b.x-opponentX)>230);
 const looseTiles=platforms.slice(4,-4).filter((_,i)=>i%6===stage%6).map((p)=>{const y0=p.y-118;return {x:Math.round(p.x+p.w*0.5-46),y:y0,y0,w:92,h:16,state:'idle',t:0,vy:0}}).filter(t=>Math.abs(t.x-opponentX)>240);
 const cores=[0.12,0.26,0.4,0.55,0.72,0.88].map((f,i)=>({id:i,x:Math.round(width*f),y:332,done:false})).filter(c=>Math.abs(c.x-opponentX)>210&&Math.abs(c.x-checkpointPlatform.x)>150&&c.x<width-260);
 return {name:`Vault Route ${stage}`,width,height:540,spawn:{x:55,y:410},checkpoint:{x:checkpointPlatform.x+60,y:checkpointPlatform.y-80},gate:{x:width-180,y:350,w:36,h:140},exit:{x:width-65,y:400},platforms:[...platforms,...ledges],hazards,climbs,volcanoes,spikes,blades,looseTiles,cores,enemies:[{id:`guardian-${stage}`,stage,name,kind,power,x:opponentX,y:opponentPlatform.y-52,w:kind==='golem'?38:32,h:52,minX:opponentX-45,maxX:opponentX+55,vx:38+stage*4,lights:3,cleared:false,laughUntil:0}],collectibles:[{x:Math.floor(width*.2),y:330},{x:Math.floor(width*.48),y:280},{x:Math.floor(width*.78),y:300}]};
}

export const level=createLevel(1);
