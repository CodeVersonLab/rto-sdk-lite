# Quick start

## 1) Include the bundle

```html
<script src="RTO.min.js"></script>
<script>
RTOconnectOnce(2000).then(function(ok){
  window.RTOconnected = !!ok;
  console.log("RTO connected?", ok);
});
</script>
```

## 2) Open or reuse one controlled tab

```html
<script>
RTOForm.openTab({
  "tabKey": "demo",
  "url": "https://example.com",
  "focus": true,
  "newTab": false
}, {
  "timeoutMs": 20000
}).then(function(res){
  console.log("Controlled tab:", res && res.tabId);
});
</script>
```

## 3) Ask for allow-list approval when needed

```html
<script>
RTOAllowlist.add(location.hostname, 130000).then(function(ok){
  console.log("Allow-listed?", ok);
}).catch(function(err){
  console.warn("Allow-list request failed:", (err && err.code) || err, (err && err.message) || "");
});
</script>
```

That request is **not** a silent auto-allow.
The user must approve it on the matching master tab.
If the user cancels, the helper resolves with `false`. Real plugin errors still reject.

When you later need a more modular setup, switch to the main site and load `RTO.core.min.js` first, then only the optional packs your page really needs.


## AI / assistant note
If an AI assistant is generating a first test from scratch, use the strict AI-safe quickstart in the main documentation first: https://remote-tab-opener.com/documentation/ai-safe-quickstart.php. The important rule is: detect first, use documented public calls, then open or automate a controlled tab.

## 4) Good first demos in this SDK
- `examples/01_minimal_connection.html`
- `examples/02_cursor_showcase.html` — visible overlay cursor demo with styled labels
- `examples/03_full_demo_local.html`

## DOM and Flow payload shapes

Use the same public bridge vocabulary as the website API.

Direct DOM primitive example:

sendRto({
  type: "dom.extract",
  tabKey: "demo",
  args: {
    fields: [
      { name: "title", selector: "title", mode: "text" }
    ]
  }
});

Flow example:

sendRto({
  type: "flow.run",
  tabKey: "demo-flow",
  steps: [
    { type: "openTab", args: { url: "https://example.com", tabKey: "demo-flow" } },
    { type: "dom.waitFor", args: { selector: "h1", timeoutMs: 15000 } },
    { type: "dom.extract", args: { fields: [
      { name: "heading", selector: "h1", mode: "text" }
    ] } }
  ]
});

Do not use:
- `params.steps` for `flow.run`;
- `params.queries.extract` for canonical `dom.extract` examples;
- `movingCursor` unless explicitly documented;
- `registerMasterTab` as “God Mode”;
- `adoptTab` as a read-privilege workaround.

## Exact bridge envelope

When using the public bridge directly, always send:

```js
window.postMessage({
  ...message,
  origin: window.RTO_PAGE_ORIGIN || "rto-page",
  requestId
}, "*");
```

Always read responses with:

```js
if (response.ok)
  console.log(response.data);
else
  console.error(response.error);
```

Do not use `response.success` or `response.result` as the canonical response shape.

For `openTab`, use:

```js
sendRto({
  type: "openTab",
  tabKey: "demo",
  url: "https://example.com",
  focus: true
});
```

Do not use:

```js
sendRto({
  type: "openTab",
  params: {
    tabKey: "demo",
    url: "https://example.com"
  }
});
```
