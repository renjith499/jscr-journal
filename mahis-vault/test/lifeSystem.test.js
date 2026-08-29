import test from 'node:test';
import assert from 'node:assert/strict';
import {MAX_LIVES,loseHeart} from '../src/game/lifeSystem.js';

test('Mahi starts each stage with four lives',()=>{
 assert.equal(MAX_LIVES,4);
});

test('the first three lost lives continue from the current point',()=>{
 let lives=MAX_LIVES;
 for(let loss=1;loss<=3;loss++){
  const result=loseHeart(lives);
  lives=result.lives;
  assert.equal(result.restartStage,false);
  assert.equal(lives,MAX_LIVES-loss);
 }
});

test('the fourth lost life restarts the current stage',()=>{
 assert.deepEqual(loseHeart(1),{lives:0,restartStage:true});
});
