import test from 'node:test';
import assert from 'node:assert/strict';
import {escapeTrapX} from '../src/game/trapSystem.js';

test('a correct answer moves Mahi completely beyond a trap when facing right',()=>{
 const player={x:100,w:28,facing:1};
 const trap={x:110,w:60};
 const x=escapeTrapX(player,trap,1000);
 assert.ok(x>trap.x+trap.w);
});

test('a correct answer moves Mahi completely beyond a trap when facing left',()=>{
 const player={x:140,w:28,facing:-1};
 const trap={x:110,w:60};
 const x=escapeTrapX(player,trap,1000);
 assert.ok(x+player.w<trap.x);
});

test('trap escape positions stay inside the level',()=>{
 assert.equal(escapeTrapX({w:28,facing:-1},{x:3,w:20},500),0);
 assert.equal(escapeTrapX({w:28,facing:1},{x:480,w:30},500),472);
});
