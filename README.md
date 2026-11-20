# Remote Tab Opener — SDK Lite

Drive **real, visible browser tabs** from your own web page with a few lines of JavaScript.
No WebDriver, no headless browser, no server: the [Remote Tab Opener](https://remote-tab-opener.com/) extension bridges your page and the tabs you explicitly allow.

- Website & docs: https://remote-tab-opener.com/
- How it works: https://remote-tab-opener.com/how-it-works/
- Compare with Selenium / Playwright / Puppeteer: https://remote-tab-opener.com/articles/rto-vs-selenium-playwright-puppeteer/
- Full SDK page and downloads: https://remote-tab-opener.com/RTO_SDK/

## Why
Selenium, Playwright and Puppeteer are built for headless testing. For internal tools, back-offices or monitoring pages you often want the opposite: automation that runs in the user's own browser, in tabs they can see and stop, on domains they approved.

- **Local-first**: your page talks to the extension through `window.postMessage`; nothing goes through a server or cloud relay.
- **Explicit allow-list**: the extension only acts on hosts the user approves on a master tab.
- **Visible**: an optional overlay cursor shows what the automation is doing.

## Quick start
1. Install the extension — [Chrome](https://remote-tab-opener.com/chrome-tab-automation/) / [Firefox](https://remote-tab-opener.com/firefox-tab-automation/)
2. Serve this folder from `http://localhost` or `https://` (for example `npx serve` or `php -S localhost:8000`)
3. Open `examples/01_minimal_connection.html`

```html
<script src="RTO.min.js"></script>
<script>
RTOconnectOnce(2000).then(function (ok) {
  if (!ok) return console.warn("Remote Tab Opener extension not detected");
  RTOForm.openTab({ tabKey: "demo", url: "https://example.com", focus: true }, { timeoutMs: 20000 })
    .then(function (res) { console.log("Controlled tab:", res && res.tabId); });
});
</script>
```

More in [QUICK_START.md](QUICK_START.md).

## Contents
| File | Purpose |
|---|---|
| `RTO.min.js` | All-in-one bundle (connection, tabs, allow-list, DOM helpers) |
| `QUICK_START.md` | Minimal calls and canonical payload shapes |
| `examples/01_minimal_connection.html` | Detect the extension, request allow-listing, open a tab |
| `examples/02_cursor_showcase.html` | Visible overlay cursor with styled labels |
| `examples/03_full_demo_local.html` | Complete local sequence on a stable `tabKey` |
| `examples/targets/lorem_form_demo.html` | Local target page used by the demos |

## What RTO does not do
It does not bypass the Same-Origin Policy, does not act on hosts the user has not approved and is not meant for mass scraping. See the [security model](https://remote-tab-opener.com/documentation/security.php).

## License
The SDK Lite files in this repository are released under the [MIT License](LICENSE) © 2026 Digitech Invent SCS.
The Remote Tab Opener browser extension itself is distributed separately and is not covered by this license.
