/* Chapter results are derived from original test answers, never AI summary totals. */
(function(root){
  'use strict';
  function label(value){
    if(value==null)return '';
    if(typeof value!=='string')throw new Error('Chapter must be a name, such as Chapter 4 · Accruals.');
    var s=value.replace(/\s+/g,' ').trim();
    if(s.length>120)throw new Error('Chapter names must be 120 characters or fewer.');
    return s;
  }
  function key(value){return label(value).toLowerCase();}
  function bucket(){return {correct:0,total:0};}
  function status(x){return x.total<3?'More evidence needed':x.pct>=80?'Strong':x.pct<60?'Needs Work':'Developing';}
  function summary(questions){
    var chapters=new Map(), coverage={tagged:0,untagged:0,unscored:0,total:questions.length};
    questions.forEach(function(q){
      if(typeof q.is_correct!=='boolean'){coverage.unscored++;return;}
      var name;try{name=label(q.chapter);}catch(e){name='';}
      if(!name){coverage.untagged++;return;}
      coverage.tagged++;
      var k=key(name);if(!chapters.has(k))chapters.set(k,{chapter:name,correct:0,total:0});
      var x=chapters.get(k);x.total++;if(q.is_correct)x.correct++;
    });
    return {chapters:Array.from(chapters.values()),coverage:coverage};
  }
  function merge(existing,incoming){
    if(!Array.isArray(incoming))throw new Error('Expected a questions array.');
    var known=new Set(existing.map(function(q){return String(q.qno);})), byNo=new Map();
    incoming.forEach(function(q){
      if(!q||q.qno==null)throw new Error('Every returned question needs its original qno.');
      var n=String(q.qno);if(!known.has(n))throw new Error('Question '+n+' does not belong to this exam.');
      if(byNo.has(n))throw new Error('Duplicate question number: '+n);byNo.set(n,q);
      if(Object.prototype.hasOwnProperty.call(q,'chapter'))label(q.chapter);
      if(Object.prototype.hasOwnProperty.call(q,'debrief')&&typeof q.debrief!=='string')throw new Error('Debrief must be HTML text.');
    });
    if(!byNo.size)throw new Error('No questions were supplied.');
    return existing.map(function(q){
      var patch=byNo.get(String(q.qno)), out=Object.assign({},q);if(!patch)return out;
      if(Object.prototype.hasOwnProperty.call(patch,'chapter'))out.chapter=label(patch.chapter);
      if(Object.prototype.hasOwnProperty.call(patch,'debrief'))out.debrief=patch.debrief;
      return out;
    });
  }
  function aggregate(exams,storage){
    var subjects=new Map();
    exams.forEach(function(e){
      var subject=String(e.subject||'Unknown subject');
      if(!subjects.has(subject))subjects.set(subject,{subject:subject,chapters:new Map(),tagged:0,untagged:0,unscored:0,unavailable:0});
      var s=subjects.get(subject), questions;
      try{questions=JSON.parse(storage.getItem('tymba_exam_data:'+e.id)||'null');}catch(err){questions=null;}
      if(!Array.isArray(questions)){s.unavailable++;return;}
      var exam=summary(questions);s.tagged+=exam.coverage.tagged;s.untagged+=exam.coverage.untagged;s.unscored+=exam.coverage.unscored;
      exam.chapters.forEach(function(c){
        var k=key(c.chapter);if(!s.chapters.has(k))s.chapters.set(k,{chapter:c.chapter,correct:0,total:0,progress:bucket(),mock:bucket(),attempts:0});
        var x=s.chapters.get(k), b=e.testType==='pre'||e.testType==='progress'?x.progress:x.mock;
        x.correct+=c.correct;x.total+=c.total;x.attempts++;b.correct+=c.correct;b.total+=c.total;
      });
    });
    return Array.from(subjects.values()).map(function(s){
      s.chapters=Array.from(s.chapters.values()).map(function(x){x.pct=Math.round(x.correct/x.total*1000)/10;x.level=status(x);return x;}).sort(function(a,b){return a.pct-b.pct||a.chapter.localeCompare(b.chapter,undefined,{numeric:true});});return s;
    });
  }
  function catalog(storage,subject){
    try{var all=JSON.parse(storage.getItem('personal_hub_chapters_v1')||'{}');return Array.isArray(all[subject])?all[subject].map(label).filter(Boolean):[];}catch(e){return [];}
  }
  function saveCatalog(storage,subject,lines){
    var names=[], seen=new Set();lines.forEach(function(v){var n=label(v);if(n&&!seen.has(key(n))){seen.add(key(n));names.push(n);}});
    var all;try{all=JSON.parse(storage.getItem('personal_hub_chapters_v1')||'{}');}catch(e){all={};}
    if(!all||typeof all!=='object'||Array.isArray(all))all={};
    Object.defineProperty(all,subject,{value:names,enumerable:true,configurable:true,writable:true});
    storage.setItem('personal_hub_chapters_v1',JSON.stringify(all));return names;
  }
  root.ChapterAnalysis={label:label,key:key,summary:summary,merge:merge,aggregate:aggregate,catalog:catalog,saveCatalog:saveCatalog,status:status};
  if(typeof module!=='undefined'&&module.exports)module.exports=root.ChapterAnalysis;
})(typeof window!=='undefined'?window:globalThis);
