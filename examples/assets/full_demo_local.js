(function(){
  'use strict';
  var TABKEY = 'rto-sdk-full';
  function $(id){ return document.getElementById(id); }
  function now(){ var d=new Date(); return d.toISOString().replace('T',' ').replace('Z',''); }
  function proof(i, state, text, code){ if(window.RTODemoProof) window.RTODemoProof.set(i, state, text, code); }
  function log(){ var el=$('log'); if(!el) return; var a=[].slice.call(arguments); el.textContent += (el.textContent?'\n':'') + '[' + now() + '] ' + a.join(' '); el.scrollTop = el.scrollHeight; }
  function setStatus(text,state){ var t=$('statusText'), d=$('dot'); if(t) t.textContent=text||''; if(d) d.className='dot ' + (state||''); }
  function setRaw(x){ var el=$('raw'); if(!el) return; try { el.textContent = typeof x==='string' ? x : JSON.stringify(x,null,2); } catch(_) { el.textContent=String(x); } }
  function setTabs(items){ var el=$('tabsBox'); if(!el) return; if(!items || !items.length){ el.textContent='No controlled tabs reported yet.'; return; } el.textContent = items.map(function(it){ return (it.tabKey||'-') + ' → ' + (it.url||'(no url)'); }).join('\n'); }
  function normErr(e){ if(e&&e.error&&typeof e.error==='object') e=e.error; return { code:String((e&&e.code)||'UNKNOWN'), message:String((e&&e.message)||'Unknown error') }; }
  function targetUrl(){ try { return new URL('./targets/lorem_form_demo.html', location.href).href; } catch(_) { return 'targets/lorem_form_demo.html'; } }
  function cmd(action,payload,timeoutMs){ payload=payload&&typeof payload==='object'?payload:{}; payload.action=action; return window.RTOForm.command(payload,{ tabKey:TABKEY, timeoutMs:timeoutMs||15000 }); }
  function overlay(label){
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

  function move(selector,label){
    return cmd('overlayMoveToWait', {
      selector:selector,
      durationMs:820,
      easing:'easeInOut',
      timeoutMs:9000
    }, 10000).then(function(){
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
  function hide(){ return cmd('overlayHide',{ destroy:true },3000)['catch'](function(){ return true; }); }
  function detect(){ if(!window.RTOconnectOnce){ setStatus('Bundle not loaded.', 'err'); return; } proof(1, 'run', 'Detecting extension', 'connect'); setStatus('Detecting and registering this page as master tab…'); log('Detecting extension...'); window.RTOconnectOnce(2500).then(function(ok){ if(!ok) throw { code:'EXT_NOT_DETECTED', message:'Extension not detected' }; return window.RTOForm.registerMasterTab({ masterKey:'sdk-lite' }, { timeoutMs:5000 })['catch'](function(){ return true; }); }).then(function(){ proof(1, 'ok', 'Connection checked', 'RTOconnectOnce'); setStatus('Connected. Ready to request approval or run the full demo.', 'ok'); log('Connected and master tab registered.'); })['catch'](function(e){ var ne=normErr(e); setStatus('Detect failed: ' + ne.code, 'err'); log('Detect failed:', ne.code, ne.message); }); }
  function requestAllow(){ var host=$('hostInput').value.trim() || location.hostname; proof(2, 'run', 'Requesting allowlist', 'allowlist'); setStatus('Requesting allow-list approval…','warn'); log('allowlistAddRequest for', host); window.RTOAllowlist.add(host,130000).then(function(ok){ if(ok){ proof(2, 'ok', 'Host policy approved', 'allowlist.ok'); setStatus('Host approved. The full demo can now run.', 'ok'); log('Allow-list approved.'); } else { setStatus('Host not added. Approval was cancelled or not granted.', 'err'); log('Allow-list request not approved.'); } })['catch'](function(e){ var ne=normErr(e); setStatus('Allow-list request failed: ' + ne.code, 'err'); log('Allow-list failed:', ne.code, ne.message); }); }
  function listTabs(){ if(!window.RTOForm) return; window.RTOForm.listTabs({}, { timeoutMs:8000 }).then(function(res){ var items=(res&&res.items)||(res&&res.data&&res.data.items)||[]; setTabs(items); setRaw(res); log('listTabs returned', String(items.length), 'item(s).'); })['catch'](function(e){ var ne=normErr(e); log('listTabs failed:', ne.code, ne.message); }); }
  function run(){ if(!window.RTOForm){ setStatus('Bundle not loaded.', 'err'); return; } proof(3, 'run', 'Running controlled tab', 'tabKey'); setStatus('Running the full local demo…'); setRaw(''); log('--- demo start ---'); window.RTOForm.openTab({ tabKey:TABKEY, url:targetUrl(), focus:true, newTab:false, timeoutMs:20000 }, { timeoutMs:20000 })
    .then(function(res){ setRaw(res); log('openTab ok; same tabKey will reuse this lane.'); return window.RTOForm.waitForSelector({ tabKey:TABKEY, selector:'#demo-form', timeoutMs:15000 }); })
    .then(function(){ return overlay('Let us show every step, not just hope for the best.'); })
    .then(function(){ return move('#firstName','First name first. Tradition matters.'); })
    .then(function(){ return cmd('setValue',{ selector:'#firstName', value:'Remote' },5000); })
    .then(function(){ return move('#city','A city, because context helps.'); })
    .then(function(){ return cmd('setValue',{ selector:'#city', value:'Leuven' },5000); })
    .then(function(){ return move('#favoriteColor','Color vote incoming.'); })
    .then(function(){ return cmd('setValue',{ selector:'#favoriteColor', value:'purple' },5000); })
    .then(function(){ return move('#notes','One note for posterity.'); })
    .then(function(){ return cmd('setValue',{ selector:'#notes', value:'The lite SDK demo ran successfully.' },5000); })
    .then(function(){ return move('#newsletter','Optional checkbox, because drama needs subscriptions.'); })
    .then(function(){ return cmd('click',{ selector:'#newsletter' },5000); })
    .then(function(){ return move('#btnSubmit','Submit. Let the local page tell the story back.'); })
    .then(function(){ return cmd('click',{ selector:'#btnSubmit' },5000); })
    .then(function(){ return move('#resultText','Reading the result…'); })
    .then(function(){ return cmd('getText',{ selector:'#resultText' },5000); })
    .then(function(res){ setRaw(res); log('Result text:', (res&&res.text)||'(empty)'); return hide(); })
    .then(function(){ proof(4, 'ok', 'Visible action complete', 'DOM safe'); setStatus('Full local demo finished.', 'ok'); return listTabs(); })
    .catch(function(e){ var ne=normErr(e); proof(4, 'err', 'Demo failed', ne.code); setStatus('Demo failed: ' + ne.code, 'err'); log('Demo failed:', ne.code, ne.message); setRaw(e); return hide(); }); }
  document.addEventListener('DOMContentLoaded', function(){ var hi=$('hostInput'); if(hi && !hi.value) hi.value=location.hostname; $('btnDetect').addEventListener('click',detect); $('btnAllow').addEventListener('click',requestAllow); $('btnRun').addEventListener('click',run); $('btnList').addEventListener('click',listTabs); });
})();
