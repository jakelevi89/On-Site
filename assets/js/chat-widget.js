/* On-Site Custom Drapes & Blinds - AI chat widget
   Injects its own markup so each page only needs one script tag (build.js adds it):
     <script src="/On-Site/assets/js/chat-widget.js" defer></script>
   Styles live in assets/css/style.css under "AI chat widget".

   Talks to a small server-side endpoint (functions/api/chat.js) that holds the
   OpenAI key, so the key never reaches the browser. Conversation history is kept
   in sessionStorage only - nothing is stored on a server and this chat does NOT
   create a lead or reach the team; the contact form and phone number do that.

   ENDPOINT NOTE: the default is "/api/chat", which works when the site is served
   from a domain root on Cloudflare Pages (README option A). GitHub Pages serves
   this repo from the /On-Site/ subpath and CANNOT run server functions at all, so
   on the preview link the widget answers with a clear "not switched on yet" note
   instead of a broken spinner. To point it somewhere else, set a global before
   this script loads:
     <script>window.ONSITE_CHAT_ENDPOINT = "https://your-project.pages.dev/api/chat";</script>
*/
(function () {
  'use strict';

  var ENDPOINT = (typeof window.ONSITE_CHAT_ENDPOINT === 'string' && window.ONSITE_CHAT_ENDPOINT)
    ? window.ONSITE_CHAT_ENDPOINT
    : '/api/chat';

  var PHONE = '(949) 770-8989';
  var GREETING = "Hi there. I'm the On-Site Custom Drapes & Blinds assistant. Ask me about " +
    "custom blinds, shades and drapery, motorization, or our blind and drapery cleaning, " +
    "and I'll point you in the right direction.";
  var FALLBACK = "Sorry, something glitched on my end. Give us a call at " + PHONE +
    " and a real person will take care of you.";
  // Shown when the chat backend simply is not deployed (e.g. the static GitHub
  // Pages preview). Different from a glitch, so say something different.
  var OFFLINE = "The assistant isn't switched on for this preview link yet. In the meantime, " +
    "call " + PHONE + " for a free in-home consultation and we'll get you scheduled.";
  var TEASER = "👋 Question about blinds, drapery, or cleaning? Just ask.";

  var wrap = document.createElement('div');
  wrap.id = 'onsiteChat';
  wrap.innerHTML = [
    '<div id="chatTeaser" hidden>',
    '  <div class="teaser-inner">',
    '    <span>' + TEASER + '</span>',
    '    <button id="chatTeaserClose" type="button" aria-label="Dismiss">&times;</button>',
    '  </div>',
    '</div>',
    '<button id="chatToggle" class="chat-pulse" type="button" aria-expanded="false"',
    '        aria-controls="chatPanel" aria-label="Chat with On-Site Custom Drapes &amp; Blinds">',
    '  <svg id="chatIconOpen" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">',
    '    <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8-1.06 0-2.08-.16-3.02-.46L3 21l1.5-4.5C3.55 15.1 3 13.6 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>',
    '  </svg>',
    '  <svg id="chatIconClose" hidden fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">',
    '    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>',
    '  </svg>',
    '</button>',
    '<div id="chatPanel" hidden>',
    '  <div class="chat-head">',
    '    <span class="chat-slats" aria-hidden="true"><i></i><i></i><i></i></span>',
    '    <div>',
    '      <p>Ask On-Site Custom Drapes &amp; Blinds</p>',
    '      <span class="chat-sub">AI assistant, usually replies instantly</span>',
    '    </div>',
    '  </div>',
    '  <div id="chatMessages" role="log" aria-live="polite"></div>',
    '  <form id="chatForm">',
    '    <input id="chatInput" type="text" autocomplete="off" maxlength="800"',
    '           aria-label="Your message" placeholder="Ask a question...">',
    '    <button id="chatSend" type="submit" aria-label="Send">',
    '      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2" aria-hidden="true">',
    '        <path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5M5 12l7-7 7 7"/>',
    '      </svg>',
    '    </button>',
    '  </form>',
    '  <p class="chat-legal">General information only. For pricing and measurements we need to see the windows, so a free in-home consultation is the next step.</p>',
    '</div>'
  ].join('\n');
  document.body.appendChild(wrap);

  var toggle = document.getElementById('chatToggle');
  var panel = document.getElementById('chatPanel');
  var iconOpen = document.getElementById('chatIconOpen');
  var iconClose = document.getElementById('chatIconClose');
  var messagesEl = document.getElementById('chatMessages');
  var form = document.getElementById('chatForm');
  var input = document.getElementById('chatInput');
  var teaser = document.getElementById('chatTeaser');
  var teaserClose = document.getElementById('chatTeaserClose');

  var history = [];
  var rendered = false;
  var teaserTimer = null;
  var teaserDismissed = false;

  /* `hidden` is an HTMLElement property and does NOT exist on SVGElement, so
     `svg.hidden = true` silently sets a useless expando and the icon never
     swaps. Always drive the attribute, which works on any element. */
  function setHidden(el, isHiddenFlag) { el.toggleAttribute('hidden', !!isHiddenFlag); }
  function isHidden(el) { return el.hasAttribute('hidden'); }

  /* ---------- first-visit teaser: nudge, then get out of the way ---------- */
  function hideTeaser() {
    setHidden(teaser, true);
    if (teaserTimer) { clearTimeout(teaserTimer); teaserTimer = null; }
  }
  function dismissTeaserForSession() {
    teaserDismissed = true;
    hideTeaser();
    try { sessionStorage.setItem('onsite_chat_teaser_seen', '1'); } catch (e) {}
  }
  (function maybeShowTeaser() {
    var seen = false;
    try { seen = sessionStorage.getItem('onsite_chat_teaser_seen') === '1'; } catch (e) {}
    if (seen) return;
    setTimeout(function () {
      // Re-check: the visitor may have opened or dismissed the chat during the
      // delay, in which case the teaser must not pop up behind the panel.
      if (teaserDismissed) return;
      setHidden(teaser, false);
      teaserTimer = setTimeout(dismissTeaserForSession, 9000);
    }, 2500);
  })();
  teaserClose.addEventListener('click', function (e) {
    e.stopPropagation();
    dismissTeaserForSession();
  });
  teaser.addEventListener('click', function () {
    dismissTeaserForSession();
    if (isHidden(panel)) toggle.click();
  });

  try {
    var saved = sessionStorage.getItem('onsite_chat_history');
    if (saved) history = JSON.parse(saved).slice(-12);
  } catch (e) { /* storage unavailable, chat still works, just does not persist */ }

  function persist() {
    try { sessionStorage.setItem('onsite_chat_history', JSON.stringify(history.slice(-12))); } catch (e) {}
  }

  function addBubble(role, text) {
    var row = document.createElement('div');
    row.className = 'chat-row ' + (role === 'user' ? 'is-user' : 'is-bot');
    var bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = text;
    row.appendChild(bubble);
    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return bubble;
  }

  function renderHistory() {
    messagesEl.innerHTML = '';
    if (!history.length) {
      addBubble('assistant', GREETING);
    } else {
      history.forEach(function (m) { addBubble(m.role, m.content); });
    }
  }

  toggle.addEventListener('click', function () {
    toggle.classList.remove('chat-pulse');
    dismissTeaserForSession();
    var willOpen = isHidden(panel);
    setHidden(panel, !willOpen);
    setHidden(iconOpen, willOpen);
    setHidden(iconClose, !willOpen);
    toggle.setAttribute('aria-expanded', String(willOpen));
    if (willOpen) {
      if (!rendered) { renderHistory(); rendered = true; }
      input.focus();
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    input.disabled = true;

    addBubble('user', text);
    history.push({ role: 'user', content: text });
    persist();

    var thinking = addBubble('assistant', '...');

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history })
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; })
          .then(function (data) { return { ok: res.ok, status: res.status, data: data }; });
      })
      .then(function (result) {
        if (!result.ok || !result.data.reply) {
          // 404/405 means no endpoint is deployed at all; 503 is the endpoint
          // telling us its OPENAI_API_KEY has not been set yet. Both are "not
          // switched on", not "something broke".
          var offline = result.status === 404 || result.status === 405 || result.status === 503;
          throw new Error(offline ? 'offline' : 'no reply');
        }
        thinking.textContent = result.data.reply;
        history.push({ role: 'assistant', content: result.data.reply });
        persist();
      })
      .catch(function (err) {
        // The visitor's own message stays in history (it is still on screen, and a
        // retry should carry the context); only the error text is not recorded.
        thinking.textContent = (err && err.message === 'offline') ? OFFLINE : FALLBACK;
      })
      .then(function () {
        input.disabled = false;
        input.focus();
        messagesEl.scrollTop = messagesEl.scrollHeight;
      });
  });
})();
