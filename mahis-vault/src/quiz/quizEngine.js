// Independent quiz engine for the Evolution-of-Computers knowledge track.
// Same output shape the game already consumes for math questions:
// {prompt, choices[], answer, ...} — plus kind:'knowledge', fact and topic.
import {KNOWLEDGE} from '../data/knowledge.js';

export const KNOWLEDGE_TOTAL=KNOWLEDGE.length;
export const KNOWLEDGE_TOPICS=[...new Set(KNOWLEDGE.map(k=>k.topic))];

export function makeKnowledgeQuestion(exclude=new Set(),rng=Math.random){
 let pool=KNOWLEDGE.filter(k=>!exclude.has(k.id));
 if(!pool.length)pool=KNOWLEDGE.slice();
 const k=pool[Math.floor(rng()*pool.length)],choices=k.choices.slice();
 for(let i=choices.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[choices[i],choices[j]]=[choices[j],choices[i]]}
 return {id:k.id,kind:'knowledge',topic:k.topic,icon:k.icon||null,prompt:k.q,choices,answer:k.a,fact:k.fact};
}

export const checkQuiz=(q,value)=>String(value)===String(q.answer);
