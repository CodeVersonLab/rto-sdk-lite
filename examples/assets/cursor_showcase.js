(function(){
  'use strict';
  var TABKEY = 'rto-sdk-cursor';
  function $(id){ return document.getElementById(id); }
  function now(){ var d=new Date(); return d.toISOString().replace('T',' ').replace('Z',''); }
  function proof(i, state, text, code){ if(window.RTODemoProof) window.RTODemoProof.set(i, state, text, code); }
  function log(){ var el=$('log'); if(!el) return; var a=[].slice.call(arguments); el.textContent += (el.textContent?'\n':'') + '[' + now() + '] ' + a.join(' '); el.scrollTop = el.scrollHeight; }
  function showResult(text){ var el=$('resultBox'); if(el) el.textContent=text||''; }
  function normErr(e){ if(e&&e.error&&typeof e.error==='object') e=e.error; return { code:String((e&&e.code)||'UNKNOWN'), message:String((e&&e.message)||'Unknown error') }; }
  function targetUrl(){ try { return new URL('./targets/lorem_form_demo.html', location.href).href; } catch(_) { return 'targets/lorem_form_demo.html'; } }
  function cmd(action, payload, timeoutMs){ payload=payload&&typeof payload==='object'?payload:{}; payload.action=action; return window.RTOForm.command(payload,{ tabKey:TABKEY, timeoutMs:timeoutMs||15000 }); }
  function overlayStart(label){
    return cmd('overlayCreate', {
      x:84,
      y:84,
      appearance:{
        kind:'png',
        png:{
          src:new URL('assets/cursors/maps.png', location.href).href,
          width:42,
          height:42
        },
        offsetX:0,
        offsetY:0,
        opacity:1,
        rotateDeg:0
      }
    }, 4000).then(function(){
      return label ? cmd('overlayLabel', {
        text:label,
        placement:'top',
        dy:-16,
        style:{
          fontSize:'14px',
          fontWeight:'600',
          padding:'10px 14px',
          borderRadius:'14px',
          background:'rgba(40,40,60,.95)',
          color:'#fff',
          boxShadow:'0 10px 28px rgba(0,0,0,.25)',
          border:'1px solid rgba(255,255,255,.18)',
          lineHeight:'1.35'
        }
      }, 3000) : true;
    })['catch'](function(){ return true; });
  }

  function overlayMove(selector,label){
    return cmd('overlayMoveToWait', {
      selector:selector,
      durationMs:850,
      easing:'easeInOut',
      timeoutMs:8000
    }, 9000).then(function(){
      return label ? cmd('overlayLabel', {
        text:label,
        placement:'top',
        dy:-16,
        style:{
          fontSize:'14px',
          fontWeight:'600',
          padding:'10px 14px',
          borderRadius:'14px',
          background:'rgba(40,40,60,.95)',
          color:'#fff',
          boxShadow:'0 10px 28px rgba(0,0,0,.25)',
          border:'1px solid rgba(255,255,255,.18)',
          lineHeight:'1.35'
        }
      }, 3000) : true;
    })['catch'](function(){ return true; });
  }
  function overlayHide(){ return cmd('overlayHide',{ destroy:true },3000)['catch'](function(){ return true; }); }
  function ensureReady(){ return window.RTOconnectOnce(2500).then(function(ok){ if(!ok) throw { code:'EXT_NOT_DETECTED', message:'Extension not detected' }; return window.RTOForm.openTab({ tabKey:TABKEY, url:targetUrl(), focus:true, newTab:false, timeoutMs:20000 }, { timeoutMs:20000 }); }).then(function(){ return window.RTOForm.waitForSelector({ tabKey:TABKEY, selector:'#demo-form', timeoutMs:15000 }); }); }
  function run(){ if(!window.RTOForm){ log('Bundle missing.'); return; } proof(1, 'run', 'Connecting SDK bridge', 'RTOForm'); showResult('Running visible cursor walkthrough…'); log('Opening or reusing tabKey=' + TABKEY); ensureReady().then(function(){ proof(1, 'ok', 'Connection checked', 'RTOconnectOnce'); proof(3, 'run', 'Controlled tab reused', 'tabKey'); return overlayStart('Starting visible cursor walkthrough.'); })
    .then(function(){ return overlayMove('#firstName','First stop: first name.'); })
    .then(function(){ return cmd('setValue',{ selector:'#firstName', value:'Francesco' },5000); })
    .then(function(){ return overlayMove('#city','Now a city. Brussels says hello.'); })
    .then(function(){ return cmd('setValue',{ selector:'#city', value:'Brussels' },5000); })
    .then(function(){ return overlayMove('#favoriteColor','A splash of color never hurts.'); })
    .then(function(){ return cmd('setValue',{ selector:'#favoriteColor', value:'blue' },5000); })
    .then(function(){ return overlayMove('#notes','One short note, because robots appreciate praise.'); })
    .then(function(){ return cmd('setValue',{ selector:'#notes', value:'Cursor tour completed with style.' },5000); })
    .then(function(){ return overlayMove('#newsletter','Optional checkbox. Dramatic, yet harmless.'); })
    .then(function(){ return cmd('click',{ selector:'#newsletter' },5000); })
    .then(function(){ return overlayMove('#btnSubmit','And now: the ceremonial click.'); })
    .then(function(){ return cmd('click',{ selector:'#btnSubmit' },5000); })
    .then(function(){ return window.RTOForm.waitForSelector({ tabKey:TABKEY, selector:'#resultText', timeoutMs:10000 }); })
    .then(function(){ return overlayMove('#resultText','The form speaks back.'); })
    .then(function(){ return cmd('getText',{ selector:'#resultText' },5000); })
    .then(function(res){ proof(4, 'ok', 'Overlay + highlight', 'DOM safe'); var text=(res&&res.text)||''; showResult(text || 'No text was returned, which is suspiciously shy.'); log('Result:', text || '(empty)'); return overlayHide(); })
    .catch(function(e){ var ne=normErr(e); showResult('Run failed: ' + ne.code + ' — ' + ne.message); proof(4, 'err', 'Run failed', ne.code); log('Run failed:', ne.code, ne.message); return overlayHide(); }); }
  function focus(){ if(!window.RTOForm) return; window.RTOForm.focusTab({ tabKey:TABKEY, timeoutMs:5000 })['catch'](function(){}); }
  function closeIt(){ if(!window.RTOForm) return; window.RTOForm.closeTab({ tabKey:TABKEY, timeoutMs:8000 }).then(function(){ log('Target tab closed.'); })['catch'](function(e){ var ne=normErr(e); log('Close failed:', ne.code, ne.message); }); }
  document.addEventListener('DOMContentLoaded', function(){ $('tabKeyLabel').textContent=TABKEY; $('btnRun').addEventListener('click',run); $('btnFocus').addEventListener('click',focus); $('btnClose').addEventListener('click',closeIt); });
})();
