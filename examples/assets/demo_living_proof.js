(function(){
  'use strict';

  var presets = {
    'hub': [
      { 'title':'Demo journey', 'index':0, 'text':'Start with Minimal', 'code':'demo 1', 'kind':'ok' },
      { 'title':'Living cursor', 'index':1, 'text':'Cursor and highlights', 'code':'demo 2', 'kind':'busy', 'shake':true },
      { 'title':'Real websites', 'index':2, 'text':'Google to YouTube', 'code':'demo 3', 'kind':'busy' },
      { 'title':'Flagship mission', 'index':3, 'text':'Local Explorer', 'code':'demo 4', 'kind':'ok', 'shake':true }
    ],
    'minimal': [
      { 'title':'Policy check', 'index':0, 'text':'Extension detected', 'code':'detectResult.ok', 'kind':'ok' },
      { 'title':'Named tab', 'index':1, 'text':'Target tab opened', 'code':'rto-demo-minimal', 'kind':'busy', 'shake':true },
      { 'title':'Host checked', 'index':2, 'text':'Local host allowed', 'code':'allowlist.ok', 'kind':'busy' },
      { 'title':'DOM safe', 'index':3, 'text':'Button highlighted', 'code':'DOM safe', 'kind':'ok' }
    ],
    'cursor': [
      { 'title':'Cursor created', 'index':0, 'text':'PNG cursor loaded', 'code':'maps.png', 'kind':'ok' },
      { 'title':'Field highlighted', 'index':1, 'text':'Search field targeted', 'code':'highlight', 'kind':'busy', 'shake':true },
      { 'title':'Result selected', 'index':2, 'text':'First result highlighted', 'code':'readback', 'kind':'busy' },
      { 'title':'Action complete', 'index':3, 'text':'Returned to master', 'code':'done', 'kind':'ok' }
    ],
    'google': [
      { 'title':'Google opened', 'index':0, 'text':'Video search opened', 'code':'rto-demo-google-youtube', 'kind':'ok' },
      { 'title':'Result highlighted', 'index':1, 'text':'YouTube URL found', 'code':'href', 'kind':'busy', 'shake':true },
      { 'title':'YouTube opened', 'index':2, 'text':'Title highlighted', 'code':'title', 'kind':'busy' },
      { 'title':'Readback complete', 'index':3, 'text':'Result returned', 'code':'DOM safe', 'kind':'ok' }
    ],
    'local': [
      { 'title':'Maps checked', 'index':0, 'text':'Area confirmed', 'code':'maps.png', 'kind':'ok' },
      { 'title':'Weather checked', 'index':1, 'text':'Meteoblue scanned', 'code':'weather.png', 'kind':'busy', 'shake':true },
      { 'title':'Food searched', 'index':2, 'text':'Restaurant highlighted', 'code':'food.png', 'kind':'busy' },
      { 'title':'Mission ready', 'index':3, 'text':'Suggestion returned', 'code':'readback', 'kind':'ok' }
    ],
    'sdk': [
      { 'title':'SDK bridge', 'index':0, 'text':'Connection checked', 'code':'RTOconnectOnce', 'kind':'ok' },
      { 'title':'Allowlist', 'index':1, 'text':'Host policy visible', 'code':'allowlist', 'kind':'busy', 'shake':true },
      { 'title':'Controlled tab', 'index':2, 'text':'tabKey reused', 'code':'tabKey', 'kind':'busy' },
      { 'title':'Visible action', 'index':3, 'text':'Overlay + highlight', 'code':'DOM safe', 'kind':'ok' }
    ]
  };

  var instances = [];

  function rowState(row, state){
    row.classList.remove('is-active','is-done','is-busy','is-error','ok');
    if(state === 'ok') row.classList.add('ok','is-done');
    if(state === 'run') row.classList.add('is-active','is-busy');
    if(state === 'err') row.classList.add('is-active','is-error');
    if(state === 'done') row.classList.add('is-done');
  }

  function setRow(inst, index, state, text, code, title){
    var row = inst.rows[index];
    if(!row) return;
    var span = row.querySelector('span'), codeEl = row.querySelector('code');
    rowState(row, state || 'muted');
    if(span && text != null) span.textContent = String(text);
    if(codeEl && code != null) codeEl.textContent = String(code);
    if(inst.title && title) inst.title.textContent = String(title);
    inst.el.classList.add('is-live');
    inst.el.classList.remove('is-running','is-proof-shaking');
  }

  function initLive(inst){
    inst.rows.forEach(function(row, i){
      var span=row.querySelector('span'), code=row.querySelector('code');
      rowState(row, 'muted');
      if(span) span.textContent = inst.original[i].text;
      if(code) code.textContent = inst.original[i].code;
    });
    if(inst.title) inst.title.textContent = inst.el.getAttribute('data-live-title') || 'Live dashboard';
    inst.el.classList.remove('is-running','is-complete','is-proof-shaking');
    inst.el.classList.add('is-live');
  }

  function initOne(consoleEl){
    var key = consoleEl.getAttribute('data-rto-proof') || 'hub';
    var frames = presets[key] || presets.hub;
    var rows = Array.prototype.slice.call(consoleEl.querySelectorAll('.proof-console-row'));
    var title = consoleEl.querySelector('.proof-console-top strong');
    var inst = {
      'el':consoleEl,
      'key':key,
      'rows':rows,
      'title':title,
      'original':rows.map(function(row){ return { 'text': row.querySelector('span') ? row.querySelector('span').textContent : '', 'code': row.querySelector('code') ? row.querySelector('code').textContent : '' }; })
    };
    instances.push(inst);

    function apply(frame){
      rows.forEach(function(row,i){
        var span=row.querySelector('span'), code=row.querySelector('code');
        rowState(row, i < frame.index ? 'ok' : 'muted');
        if(i === frame.index) rowState(row, frame.kind === 'busy' ? 'run' : 'ok');
        if(span) span.textContent = i === frame.index ? frame.text : inst.original[i].text;
        if(code) code.textContent = i === frame.index ? frame.code : inst.original[i].code;
      });
      if(title) title.textContent = frame.title;
      consoleEl.style.setProperty('--proof-x', String(18 + frame.index * 21) + '%');
      consoleEl.style.setProperty('--proof-y', frame.shake ? '28%' : '18%');
      consoleEl.classList.add('is-running');
      consoleEl.classList.remove('is-complete','is-live');
      consoleEl.classList.toggle('is-proof-shaking', !!frame.shake);
    }

    function finishIntro(){
      consoleEl.classList.remove('is-running','is-proof-shaking');
      consoleEl.classList.add('is-complete');
      window.setTimeout(function(){ initLive(inst); }, 650);
    }

    var reduced=false; try{ reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(_){}
    if(reduced) return initLive(inst);

    var step=0;
    function tick(){
      apply(frames[step]);
      step++;
      if(step < frames.length) window.setTimeout(tick, 1150);
      else window.setTimeout(finishIntro, 950);
    }
    tick();
  }

  window.RTODemoProof = {
    'set':function(index, state, text, code, title, key){
      instances.forEach(function(inst){ if(!key || inst.key === key) setRow(inst, Number(index) - 1, state, text, code, title); });
    },
    'ok':function(index, text, code, title, key){ this.set(index, 'ok', text, code, title, key); },
    'run':function(index, text, code, title, key){ this.set(index, 'run', text, code, title, key); },
    'err':function(index, text, code, title, key){ this.set(index, 'err', text, code, title, key); },
    'reset':function(key){ instances.forEach(function(inst){ if(!key || inst.key === key) initLive(inst); }); }
  };

  document.addEventListener('DOMContentLoaded', function(){ Array.prototype.slice.call(document.querySelectorAll('.proof-console[data-rto-proof]')).forEach(initOne); });
})();
