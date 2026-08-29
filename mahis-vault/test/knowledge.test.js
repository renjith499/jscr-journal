import test from 'node:test';
import assert from 'node:assert/strict';
import {KNOWLEDGE} from '../src/data/knowledge.js';
import {makeKnowledgeQuestion,checkQuiz,KNOWLEDGE_TOTAL,KNOWLEDGE_TOPICS} from '../src/quiz/quizEngine.js';

const TOPICS=['Origins','Early Devices','Pioneers','Generations','Files & Folders'];
const ICONS=['abacus','napier','pascal','gears','engine','punchcard','room','tube','transistor','chip','file','folder'];

test('the knowledge bank covers the whole chapter',()=>{
  assert.ok(KNOWLEDGE.length>=60,`expected >=60 questions, got ${KNOWLEDGE.length}`);
  assert.equal(KNOWLEDGE_TOTAL,KNOWLEDGE.length);
});

test('every knowledge entry is well formed',()=>{
  const ids=new Set();
  for(const k of KNOWLEDGE){
    assert.ok(k.id&&!ids.has(k.id),`duplicate or missing id: ${k.id}`);ids.add(k.id);
    assert.ok(typeof k.q==='string'&&k.q.length>5,`bad question: ${k.id}`);
    assert.ok(Array.isArray(k.choices)&&k.choices.length>=2&&k.choices.length<=4,`bad choices: ${k.id}`);
    assert.equal(new Set(k.choices).size,k.choices.length,`duplicate choice in ${k.id}`);
    assert.ok(k.choices.includes(k.a),`answer not among choices: ${k.id}`);
    assert.ok(typeof k.fact==='string'&&k.fact.length>5,`missing fact: ${k.id}`);
    assert.ok(TOPICS.includes(k.topic),`unknown topic in ${k.id}: ${k.topic}`);
    if(k.icon)assert.ok(ICONS.includes(k.icon),`unknown icon in ${k.id}: ${k.icon}`);
  }
});

test('true/false items offer exactly True and False',()=>{
  for(const k of KNOWLEDGE.filter(k=>/true or false/i.test(k.q)))
    assert.deepEqual([...k.choices].sort(),['False','True'],`bad T/F options: ${k.id}`);
});

test('all five topics are represented',()=>{
  for(const t of TOPICS)assert.ok(KNOWLEDGE.some(k=>k.topic===t),`no questions for topic ${t}`);
  assert.equal(new Set(KNOWLEDGE_TOPICS).size,KNOWLEDGE_TOPICS.length);
});

test('makeKnowledgeQuestion returns a game-compatible, shuffled question',()=>{
  const q=makeKnowledgeQuestion(new Set(),()=>0);
  assert.equal(q.kind,'knowledge');
  assert.ok(q.prompt&&q.fact&&q.topic);
  assert.ok(q.choices.includes(q.answer));
  assert.ok(checkQuiz(q,q.answer));
  assert.ok(!checkQuiz(q,'definitely wrong'));
});

test('the exclude set is respected until the pool is exhausted',()=>{
  const seen=new Set();
  for(let i=0;i<KNOWLEDGE.length;i++){
    const q=makeKnowledgeQuestion(seen);
    assert.ok(!seen.has(q.id),'served an excluded question while fresh ones remained');
    seen.add(q.id);
  }
  assert.equal(seen.size,KNOWLEDGE.length);
  // pool exhausted -> still returns a valid question rather than throwing
  const q=makeKnowledgeQuestion(seen);
  assert.ok(q.choices.includes(q.answer));
});

test('book multiple-choice answers are encoded correctly',()=>{
  const byId=Object.fromEntries(KNOWLEDGE.map(k=>[k.id,k]));
  assert.equal(byId['auto-calc-credit'].a,'Charles Babbage');
  assert.equal(byId['leibniz-legacy'].a,'Leibniz Calculator');
  assert.equal(byId['gen2-not'].a,'Altair 8800');
  assert.equal(byId['first-electromech'].a,'Mark I');
  assert.equal(byId['gen3-ic'].a,'Third Generation');
  assert.equal(byId['leibniz-18th-tf'].a,'False');
  assert.equal(byId['compute-means-work'].a,'False');
  assert.equal(byId['pascal-raj'].a,'Pascal’s Adding Machine');
});
