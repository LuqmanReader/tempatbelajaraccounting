(function(root){
  'use strict';
  var M=root.ChapterAnalysis;
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function plain(s){var d=document.createElement('div');d.innerHTML=s||'';return (d.textContent||'').replace(/\s+/g,' ').trim();}
  function coverage(s){return s.tagged+' tagged answers · '+s.untagged+' awaiting chapter tags'+(s.unscored?' · '+s.unscored+' unscored':'')+(s.unavailable?' · '+s.unavailable+' unavailable exam records':'');}
  function count(b){return b.total?Math.round(b.correct/b.total*100)+'% ('+b.correct+'/'+b.total+')':'Not attempted';}
  function color(x){return x.level==='Strong'?'#1F6B39':x.level==='Needs Work'?'#E63B2E':x.level==='Developing'?'#9a7400':'#777';}
  function mountEditor(el,data,meta,storage,onSave){
    var names=M.catalog(storage,meta.subject);data.forEach(function(q){if(q.chapter&&names.indexOf(q.chapter)<0)names.push(q.chapter);});
    var sum=M.summary(data);
    el.innerHTML='<h3>Chapter tags</h3><p class="chapter-note">'+coverage({tagged:sum.coverage.tagged,untagged:sum.coverage.untagged,unscored:sum.coverage.unscored})+'. Tag correct and incorrect questions. These tags update the chapter graph and strengths/weaknesses automatically.</p>'+
      '<details><summary>Set this subject’s chapter list</summary><p>Use your textbook’s actual names or numbers, one per line. Example: Chapter 4 · Accruals and prepayments. This is a reusable suggestion list; saving it does not retag existing questions.</p><textarea id="chapterCatalog" rows="5">'+esc(names.join('\n'))+'</textarea><button type="button" id="saveChapterCatalog" class="btn secondary">Save chapter list</button></details>'+
      '<datalist id="chapterNames">'+names.map(function(n){return '<option value="'+esc(n)+'"></option>';}).join('')+'</datalist>'+
      '<div class="chapter-tools"><input id="bulkChapter" list="chapterNames" placeholder="Chapter for selected questions"><button type="button" id="applyBulkChapter" class="btn secondary">Apply to selected</button></div>'+
      '<div class="chapter-table-scroll"><table class="chapter-table"><thead><tr><th><input type="checkbox" id="selectAllChapters" aria-label="Select all questions"></th><th>Question / result</th><th>Chapter</th></tr></thead><tbody>'+data.map(function(q,i){return '<tr><td><input class="chapter-pick" data-index="'+i+'" type="checkbox" aria-label="Select question '+esc(q.qno)+'"></td><td><strong>Q'+esc(q.qno)+' · '+(q.is_correct===true?'Correct':q.is_correct===false?'Incorrect':'Unscored')+'</strong><br>'+esc(plain(q.qtext).slice(0,110)||'Question text missing')+'</td><td><input class="chapter-value" data-index="'+i+'" list="chapterNames" value="'+esc(q.chapter||'')+'" placeholder="Unassigned" aria-label="Chapter for question '+esc(q.qno)+'"></td></tr>';}).join('')+'</tbody></table></div>'+
      '<button type="button" id="saveQuestionChapters" class="btn secondary">Save question chapters</button><p id="chapterEditMsg" role="status"></p>';
    function message(s){el.querySelector('#chapterEditMsg').textContent=s;}
    el.querySelector('#selectAllChapters').addEventListener('change',function(){var checked=this.checked;el.querySelectorAll('.chapter-pick').forEach(function(p){p.checked=checked;});});
    el.querySelector('#applyBulkChapter').addEventListener('click',function(){try{var name=M.label(el.querySelector('#bulkChapter').value), n=0;el.querySelectorAll('.chapter-pick:checked').forEach(function(p){el.querySelector('.chapter-value[data-index="'+p.dataset.index+'"]').value=name;n++;});message(n?'Applied to '+n+' questions. Save question chapters to confirm.':'Select questions first.');}catch(e){message(e.message);}});
    el.querySelector('#saveChapterCatalog').addEventListener('click',function(){try{var list=M.saveCatalog(storage,meta.subject,el.querySelector('#chapterCatalog').value.split('\n'));el.querySelector('#chapterNames').innerHTML=list.map(function(n){return '<option value="'+esc(n)+'"></option>';}).join('');message('Chapter list saved.');}catch(e){message(e.message);}});
    el.querySelector('#saveQuestionChapters').addEventListener('click',function(){try{var patch=data.map(function(q,i){return {qno:q.qno,chapter:el.querySelector('.chapter-value[data-index="'+i+'"]').value};});onSave(M.merge(data,patch));}catch(e){message('Could not save: '+e.message);}});
  }
  function graphHtml(s){
    if(!s.chapters.length)return '<p class="chapter-note">No chapter results yet. Open a saved test, copy its GPT prompt, import the returned chapter tags, or assign them manually.</p>';
    return '<div class="chapter-legend"><span style="color:#1D3FA0">■ Progress Test</span> <span style="color:#E63B2E">■ Mock Test</span></div>'+s.chapters.map(function(x){
      return '<div class="chapter-graph-row"><strong>'+esc(x.chapter)+'</strong><span>Overall '+x.pct+'% · '+x.correct+'/'+x.total+' · '+x.level+'</span>'+['progress','mock'].map(function(type){var b=x[type],pct=b.total?b.correct/b.total*100:0;return '<div class="chapter-bar-row"><span>'+ (type==='progress'?'Progress':'Mock')+'</span><div class="chapter-track" role="img" aria-label="'+esc(x.chapter)+' '+type+' '+count(b)+'">'+(b.total?'<div style="width:'+pct+'%;background:'+(type==='progress'?'#1D3FA0':'#E63B2E')+'"></div>':'')+'</div><span>'+count(b)+'</span></div>';}).join('')+'</div>';
    }).join('');
  }
  function boxHtml(x,cls){return '<div class="sw-item '+cls+'"><div class="t-name">'+esc(x.chapter)+'<br><span style="color:#555;font-weight:600;">'+x.correct+'/'+x.total+' correct · '+x.attempts+' test attempts</span></div><div class="t-pct">'+x.pct+'%</div></div>';}
  function mountDashboard(graph,boxes,mastery,exams,storage){
    var result=M.aggregate(exams,storage), subjects=result.filter(function(s){return s.chapters.length||s.untagged||s.unavailable||s.unscored;});
    if(!subjects.length){graph.innerHTML='<p class="chapter-note">No active test data. Add a new test to build chapter analysis.</p>';boxes.innerHTML='<div class="chart-panel">No chapter evidence yet.</div>';mastery.innerHTML='';return;}
    graph.innerHTML='<label>Subject <select id="chapterSubject">'+subjects.map(function(s,i){return '<option value="'+i+'">'+esc(s.subject)+'</option>';}).join('')+'</select></label><p class="chapter-note">Accuracy = correct answers ÷ tagged answers. All active saved test attempts count, including retakes. Reviewing explanations does not change your score. Untagged chapters have no inferred score.</p><div id="chapterGraphContent"></div>';
    function draw(){var s=subjects[Number(graph.querySelector('select').value)];graph.querySelector('#chapterGraphContent').innerHTML='<p class="chapter-note">'+coverage(s)+'</p>'+graphHtml(s);}
    graph.querySelector('select').addEventListener('change',draw);draw();
    boxes.innerHTML=subjects.map(function(s){
      var weak=s.chapters.filter(function(x){return x.level==='Needs Work';}), strong=s.chapters.filter(function(x){return x.level==='Strong';}).sort(function(a,b){return b.pct-a.pct;}), developing=s.chapters.filter(function(x){return x.level==='Developing';}), thin=s.chapters.filter(function(x){return x.level==='More evidence needed';});
      return '<div class="sw-subject">'+esc(s.subject)+'</div><p class="chapter-note">'+coverage(s)+'</p><div class="sw-grid"><div><div class="sw-col-label weak">Needs Work · below 60%</div>'+ (weak.length?weak.map(function(x){return boxHtml(x,'weak');}).join(''):'<p>No chapters meet this threshold yet.</p>')+'</div><div><div class="sw-col-label strong">Strong · 80% or higher</div>'+(strong.length?strong.map(function(x){return boxHtml(x,'strong');}).join(''):'<p>No chapters meet this threshold yet.</p>')+'</div></div>'+ (developing.length?'<p><strong>Developing · 60–79%:</strong> '+developing.map(function(x){return esc(x.chapter)+' ('+x.pct+'%, '+x.correct+'/'+x.total+')';}).join('; ')+'</p>':'')+(thin.length?'<p><strong>More evidence needed · fewer than 3 answers:</strong> '+thin.map(function(x){return esc(x.chapter)+' ('+x.correct+'/'+x.total+')';}).join('; ')+'</p>':'');
    }).join('');
    mastery.innerHTML=subjects.map(function(s){return '<div class="sw-subject">'+esc(s.subject)+'</div><div class="chart-panel">'+(s.chapters.length?s.chapters.map(function(x){return '<div class="chapter-mastery"><strong>'+esc(x.chapter)+'</strong><span style="color:'+color(x)+'">'+x.pct+'% · '+x.level+'</span></div>';}).join(''):'Awaiting chapter tags.')+'</div>';}).join('');
  }
  root.ChapterUI={mountEditor:mountEditor,mountDashboard:mountDashboard,escape:esc};
})(window);
