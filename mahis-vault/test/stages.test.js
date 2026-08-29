import test from 'node:test';
import assert from 'node:assert/strict';
import {stages,getStage,achievements,getAchievement,blessings,getBlessing} from '../src/data/stages.js';
import {createLevel} from '../src/data/level1.js';

test('all learning stages have three increasing difficulty steps',()=>{
  for(const stage of stages){
    assert.equal(stage.difficulty.length,3);
    assert.ok(stage.difficulty[0]<stage.difficulty[1]);
    assert.ok(stage.difficulty[1]<stage.difficulty[2]);
    assert.equal(stage.difficulty[2],stage.max);
  }
});

test('difficulty progresses between stage topics',()=>{
  assert.equal(getStage(1).operation,'addition');
  assert.equal(getStage(2).operation,'subtraction');
  assert.equal(getStage(3).operation,'multiplication');
  assert.equal(getStage(4).max,20);
});

test('every stage has exactly one mandatory opponent',()=>{
  for(const stage of stages){
    assert.equal(createLevel(stage.id).enemies.filter(enemy=>enemy.stage===stage.id).length,1);
  }
});

test('ten stages have increasing route lengths and distinct arrangements',()=>{
  assert.equal(stages.length,10);
  const levels=stages.map(stage=>createLevel(stage.id));
  for(let i=1;i<levels.length;i++)assert.ok(levels[i].width>levels[i-1].width);
  assert.equal(new Set(levels.map(level=>JSON.stringify(level.platforms))).size,10);
});

test('every stage has a unique achievement and final story reward',()=>{
  assert.equal(achievements.length,10);
  assert.equal(new Set(achievements.map(item=>item.title)).size,10);
  assert.match(getAchievement(10).story,/Starlight Keeper/);
  assert.match(getAchievement(10).story,/Throne of Learning/);
});

test('every stage has climbable stairs and ladders',()=>{
  for(const stage of stages){
    const climbs=createLevel(stage.id).climbs;
    assert.ok(climbs.length>=1);
    assert.ok(climbs.every(c=>['stairs','ladder'].includes(c.kind)));
    assert.ok(climbs.every(c=>c.w>0&&c.h>0));
  }
});

test('routes are five times longer',()=>{
  assert.ok(createLevel(1).width>=13000);
  assert.ok(createLevel(10).width>=25000);
});

test('every stage seeds volcanoes and Prince-of-Persia-style traps',()=>{
  for(const stage of stages){
    const L=createLevel(stage.id);
    for(const key of ['volcanoes','spikes','blades','looseTiles'])
      assert.ok(Array.isArray(L[key]),`${key} missing on stage ${stage.id}`);
    assert.ok(L.volcanoes.length>=1);
    assert.ok(L.spikes.length>=1);
    assert.ok(L.looseTiles.every(t=>t.state==='idle'&&t.y0===t.y&&t.w>0));
  }
});

test('every stage seeds Data Core knowledge beacons',()=>{
  for(const stage of stages){
    const cores=createLevel(stage.id).cores;
    assert.ok(Array.isArray(cores)&&cores.length>=2,`stage ${stage.id} needs Data Cores`);
    assert.ok(cores.every(c=>c.done===false&&c.x>0&&c.y>0));
  }
});

test('the Starwise Guru has a blessing for every stage',()=>{
  assert.equal(blessings.length,10);
  assert.ok(stages.every(stage=>getBlessing(stage.id).length>30));
});
