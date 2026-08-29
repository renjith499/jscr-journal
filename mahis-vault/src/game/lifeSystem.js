export const MAX_LIVES=4;

export function loseHeart(lives){
 const remaining=Math.max(0,lives-1);
 return {lives:remaining,restartStage:remaining===0};
}
