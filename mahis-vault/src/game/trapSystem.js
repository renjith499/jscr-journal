export function escapeTrapX(player,trap,worldWidth,margin=24){
 const forward=(player.facing||1)>=0;
 const target=forward?trap.x+trap.w+margin:trap.x-player.w-margin;
 return Math.max(0,Math.min(worldWidth-player.w,target));
}
