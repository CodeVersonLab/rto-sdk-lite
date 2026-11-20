(function(){
  'use strict';
  var TABKEY = 'rto-sdk-minimal';
  function $(id){ return document.getElementById(id); }
  function now(){ var d=new Date(); return d.toISOString().replace('T',' ').replace('Z',''); }
  function proof(i, state, text, code){ if(window.RTODemoProof) window.RTODemoProof.set(i, state, text, code); }
  function log(){ var el=$('log'); if(!el) return; var a=[].slice.call(arguments); el.textContent += (el.textContent?'\n':'') + '[' + now() + '] ' + a.join(' '); el.scrollTop = el.scrollHeight; }
  function setStatus(text,state){ var t=$('statusText'), d=$('dot'); if(t) t.textContent=text||''; if(d) d.className='dot ' + (state||''); }
  function normErr(e){ if(e&&e.error&&typeof e.error==='object') e=e.error; return { code:String((e&&e.code)||'UNKNOWN'), message:String((e&&e.message)||'Unknown error') }; }
  function targetUrl(){ try { return new URL('./targets/lorem_form_demo.html', location.href).href; } catch(_) { return 'targets/lorem_form_demo.html'; } }
  function registerMaster(){ if(!window.RTOForm || typeof window.RTOForm.registerMasterTab!=='function') return Promise.resolve(); return window.RTOForm.registerMasterTab({ masterKey:'sdk-lite' }, { timeoutMs:5000 })['catch'](function(){ return true; }); }
  function preview(){ if(!window.RTOForm) return Promise.resolve(); return window.RTOForm.waitForSelector({ tabKey:TABKEY, selector:'#demo-form', timeoutMs:12000 })
    .then(function(){ return window.RTOForm.command({ action:'overlayCreate', x:96, y:96, appearance:{ kind:'png', png:{ src:new URL('assets/cursors/maps.png', location.href).href, width:42, height:42 }, offsetX:8, offsetY:8, opacity:1, cursor:{ url:new URL('assets/cursors/maps.png', location.href).href, x:8, y:8, fallback:'auto' } } }, { tabKey:TABKEY, timeoutMs:4000 }); })
    .then(function(){
      return window.RTOForm.command({
        action:'overlayLabel',
        text:'Yes, this is the controlled tab.',
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
      }, { tabKey:TABKEY, timeoutMs:3000 });
    })
    .then(function(){ return window.RTOForm.command({ action:'overlayMoveToWait', selector:'#btnSubmit', durationMs:850, easing:'easeInOut', timeoutMs:9000 }, { tabKey:TABKEY, timeoutMs:10000 }); })
    .then(function(){ return window.RTOForm.command({ action:'overlayHide', destroy:true }, { tabKey:TABKEY, timeoutMs:3000 }); })
    ['catch'](function(e){ var ne=normErr(e); log('Overlay proof skipped:', ne.code, ne.message); return true; }); }
  function check(){ setStatus('Checking extension…'); log('Checking extension and bridge...'); if(typeof window.RTOconnectOnce!=='function'){ setStatus('RTO.min.js is missing.', 'err'); return; } window.RTOconnectOnce(2500).then(function(ok){ window.RTOconnected=!!ok; if(!ok){ setStatus('Extension not detected or bridge not ready.', 'err'); log('Not connected.'); return false; } return registerMaster().then(function(){ proof(1, 'ok', 'Connection checked', 'RTOconnectOnce'); setStatus('Connected. You can request allow-list approval or open the demo tab.', 'ok'); log('Connected.'); return true; }); })['catch'](function(e){ var ne=normErr(e); setStatus('Connection failed: ' + ne.code, 'err'); log('Connection failed:', ne.code, ne.message); }); }
  function requestAllow(){ if(!window.RTOAllowlist || typeof window.RTOAllowlist.add!=='function'){ setStatus('Allow-list helper is not available in the bundle.', 'err'); return; } var host=$('hostInput').value.trim() || location.hostname; proof(2, 'run', 'Requesting allowlist', 'allowlist'); setStatus('Requesting allow-list approval on the master tab…','warn'); log('allowlistAddRequest for host=', host); window.RTOAllowlist.add(host,130000).then(function(ok){ if(ok){ proof(2, 'ok', 'Host policy approved', 'allowlist.ok'); setStatus('Host approved. Try opening the demo tab now.', 'ok'); log('Allow-list approved for', host); } else { setStatus('Host not added. Approval was cancelled or not granted.', 'err'); log('Allow-list request not approved.'); } })['catch'](function(e){ var ne=normErr(e); setStatus('Allow-list request failed: ' + ne.code, 'err'); log('Allow-list failed:', ne.code, ne.message); }); }
  function openOrReuse(){ if(!window.RTOForm){ setStatus('Core API not ready.', 'err'); return; } proof(3, 'run', 'Opening controlled tab', 'tabKey'); setStatus('Opening or reusing the demo tab…'); log('openTab with tabKey=' + TABKEY); window.RTOForm.openTab({ tabKey:TABKEY, url:targetUrl(), focus:true, newTab:false, timeoutMs:130000 }, { timeoutMs:130000 }).then(function(r){ setStatus('Controlled tab ready.', 'ok'); log('openTab ok.', r&&typeof r.tabId==='number' ? 'tabId=' + r.tabId : ''); return preview(); })['catch'](function(e){ var ne=normErr(e); setStatus('Open failed: ' + ne.code, 'err'); log('Open failed:', ne.code, ne.message); }); }
  function focusTab(){ if(!window.RTOForm) return; setStatus('Focusing the controlled tab…'); log('focusTab with tabKey=' + TABKEY); window.RTOForm.focusTab({ tabKey:TABKEY, timeoutMs:5000 }).then(function(){ setStatus('Controlled tab focused.', 'ok'); log('focusTab ok.'); return preview(); })['catch'](function(e){ var ne=normErr(e); setStatus('Focus failed: ' + ne.code, 'err'); log('Focus failed:', ne.code, ne.message); }); }
  function closeTab(){ if(!window.RTOForm) return; setStatus('Closing the controlled tab…'); log('closeTab with tabKey=' + TABKEY); window.RTOForm.closeTab({ tabKey:TABKEY, timeoutMs:8000 }).then(function(){ setStatus('Controlled tab closed.', 'ok'); log('closeTab ok.'); })['catch'](function(e){ var ne=normErr(e); setStatus('Close failed: ' + ne.code, 'err'); log('Close failed:', ne.code, ne.message); }); }
  document.addEventListener('DOMContentLoaded', function(){ var hi=$('hostInput'); if(hi && !hi.value) hi.value=location.hostname; $('btnCheck').addEventListener('click',check); $('btnAllow').addEventListener('click',requestAllow); $('btnOpen').addEventListener('click',openOrReuse); $('btnFocus').addEventListener('click',focusTab); $('btnClose').addEventListener('click',closeTab); });
})();
