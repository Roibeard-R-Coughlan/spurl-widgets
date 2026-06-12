(function (global) {
  if (global.__SPURL_CHARA_WIDGET_LOADER__) return;
  global.__SPURL_CHARA_WIDGET_LOADER__ = true;

  function widgetBaseUrl() {
    const current = document.currentScript && document.currentScript.src
      ? document.currentScript.src
      : global.location.href;
    return new URL('../', current).toString();
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-spurl-widget-script="' + src + '"]');
      if (existing) {
        if (existing.dataset.loaded === 'true') {
          resolve();
          return;
        }
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error('Failed to load widget script: ' + src)), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.dataset.spurlWidgetScript = src;
      script.addEventListener('load', () => {
        script.dataset.loaded = 'true';
        resolve();
      }, { once: true });
      script.addEventListener('error', () => reject(new Error('Failed to load widget script: ' + src)), { once: true });
      document.head.appendChild(script);
    });
  }

  function injectStyles() {
    if (document.getElementById('spurl-chara-loader-styles')) return;

    const style = document.createElement('style');
    style.id = 'spurl-chara-loader-styles';
    style.textContent = `
      .spurl-chara-widget {
        position: fixed;
        right: 20px;
        bottom: 20px;
        z-index: 99999;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 12px;
        pointer-events: none;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      }
      .spurl-chara-widget * { box-sizing: border-box; }
      .spurl-chara-widget > * { pointer-events: auto; }
      .spurl-chara-launcher {
        position: relative;
        width: 74px;
        height: 74px;
        border: 1px solid rgba(194,160,90,0.45);
        border-radius: 999px;
        background:
          radial-gradient(circle at 30% 30%, rgba(255,233,191,0.18), transparent 18%),
          linear-gradient(145deg, rgba(7,19,15,0.18), rgba(7,19,15,0.08)),
          url("${widgetBaseUrl()}assets/sloitar-chatbot.png") center / cover no-repeat;
        box-shadow: 0 14px 30px rgba(0,0,0,0.30), 0 0 0 1px rgba(255,255,255,0.02) inset;
        cursor: pointer;
        color: #fff8ed;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        overflow: visible;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: 0.82rem;
        font-weight: 800;
        text-shadow: 0 2px 4px rgba(7,19,15,0.85);
        transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease;
        user-select: none;
        animation: spurl-chara-breathe 4.8s ease-in-out infinite;
      }
      .spurl-chara-launcher span {
        width: 100%;
        height: 100%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: inherit;
        background: linear-gradient(180deg, rgba(7,19,15,0.10), rgba(7,19,15,0.40));
        padding: 0.14rem;
        line-height: 1.02;
        text-align: center;
      }
      .spurl-chara-launcher:hover,
      .spurl-chara-launcher:focus-visible {
        transform: translateY(-2px) scale(1.03);
        box-shadow: 0 18px 38px rgba(0,0,0,0.36), 0 0 0 1px rgba(194,160,90,0.35) inset;
        filter: saturate(1.08) contrast(1.02);
        outline: none;
      }
      .spurl-chara-launcher::after {
        content: "CHARA\AThe Spurl Guide";
        position: absolute;
        right: calc(100% + 10px);
        bottom: 8px;
        white-space: pre-line;
        min-width: 130px;
        padding: 0.45rem 0.55rem;
        border: 1px solid rgba(194,160,90,0.35);
        border-radius: 12px;
        background: rgba(7,19,15,0.96);
        color: #fff8ed;
        font-size: 0.72rem;
        line-height: 1.25;
        text-transform: none;
        letter-spacing: 0;
        text-shadow: none;
        box-shadow: 0 10px 24px rgba(0,0,0,0.35);
        opacity: 0;
        transform: translateY(4px);
        pointer-events: none;
        transition: opacity 160ms ease, transform 160ms ease;
      }
      @media (hover: hover) and (pointer: fine) {
        .spurl-chara-launcher:hover::after,
        .spurl-chara-launcher:focus-visible::after { opacity: 1; transform: translateY(0); }
      }
      .spurl-chara-panel {
        position: absolute;
        right: 0;
        bottom: calc(100% + 12px);
        width: min(380px, calc(100vw - 24px));
        max-height: calc(100vh - 24px);
        border: 1px solid rgba(194,160,90,0.22);
        border-radius: 18px;
        background: linear-gradient(180deg, rgba(7,19,15,0.98), rgba(7,19,15,0.96));
        backdrop-filter: blur(8px);
        box-shadow: 0 18px 42px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.03);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transform-origin: bottom right;
        transform: translateY(10px) scale(0.98);
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transition: opacity 160ms ease, transform 160ms ease, visibility 160ms ease;
      }
      .spurl-chara-widget.is-open .spurl-chara-panel {
        opacity: 1;
        visibility: visible;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }
      .spurl-chara-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        padding: 0.75rem 0.8rem;
        border-bottom: 1px solid rgba(194,160,90,0.18);
        background: linear-gradient(180deg, rgba(194,160,90,0.12), rgba(7,19,15,0.98));
      }
      .spurl-chara-title {
        font-size: 1rem;
        font-weight: 800;
        letter-spacing: 0.03em;
        text-transform: uppercase;
        color: #fff8ed;
      }
      .spurl-chara-subtitle {
        color: #ffe9bf;
        font-size: 0.78rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .spurl-chara-close {
        border: 1px solid rgba(194,160,90,0.28);
        border-radius: 999px;
        background: rgba(255,255,255,0.04);
        color: #fff8ed;
        width: 2rem;
        height: 2rem;
        display: grid;
        place-items: center;
        cursor: pointer;
        font-size: 1rem;
        line-height: 1;
        transition: transform 140ms ease, background 140ms ease;
      }
      .spurl-chara-close:hover,
      .spurl-chara-close:focus-visible {
        transform: scale(1.05);
        background: rgba(194,160,90,0.14);
        outline: none;
      }
      .spurl-chara-body {
        display: flex;
        flex-direction: column;
        min-height: 0;
        padding: 0.65rem 0.75rem 0.75rem;
        background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0));
      }
      .spurl-chara-chat-log {
        display: flex;
        flex-direction: column;
        gap: 0.45rem;
        max-height: 260px;
        overflow: auto;
        min-height: 0;
        padding-right: 0.15rem;
      }
      .spurl-chara-widget .message {
        display: flex;
        align-items: flex-end;
        gap: 0.45rem;
      }
      .spurl-chara-widget .message__avatar {
        width: 32px;
        height: 32px;
        display: grid;
        place-items: center;
        border-radius: 999px;
        background: linear-gradient(135deg, #ffe9bf, #c2a05a);
        color: #102218;
        font-size: 0.75rem;
        font-weight: 700;
        flex: 0 0 32px;
        overflow: hidden;
      }
      .spurl-chara-widget .message__avatar img { width: 100%; height: 100%; display: block; object-fit: cover; border-radius: inherit; }
      .spurl-chara-widget .message--bot .message__bubble { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); }
      .spurl-chara-widget .message--user { justify-content: flex-end; }
      .spurl-chara-widget .message--user .message__avatar { order: 2; background: linear-gradient(135deg, #d9f7e5, #c2a05a); }
      .spurl-chara-widget .message--user .message__bubble { background: linear-gradient(135deg, rgba(194,160,90,0.22), rgba(255,255,255,0.08)); border: 1px solid rgba(194,160,90,0.24); }
      .spurl-chara-widget .message__bubble {
        max-width: 92%;
        padding: 0.45rem 0.55rem;
        border-radius: 12px 12px 12px 4px;
        color: #fff8ed;
        font-size: 0.86rem;
        line-height: 1.35;
        word-break: break-word;
      }
      .spurl-chara-widget .message--user .message__bubble { border-radius: 12px 12px 4px 12px; }
      .spurl-chara-message { display: flex; align-items: flex-end; gap: 0.45rem; }
      .spurl-chara-message__avatar {
        width: 32px;
        height: 32px;
        display: grid;
        place-items: center;
        border-radius: 999px;
        background: linear-gradient(135deg, #ffe9bf, #c2a05a);
        color: #102218;
        font-size: 0.75rem;
        font-weight: 700;
        flex: 0 0 32px;
        overflow: hidden;
      }
      .spurl-chara-message__avatar img { width: 100%; height: 100%; display: block; object-fit: cover; border-radius: inherit; }
      .spurl-chara-message--bot .spurl-chara-message__bubble { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); }
      .spurl-chara-message--user { justify-content: flex-end; }
      .spurl-chara-message--user .spurl-chara-message__avatar { order: 2; background: linear-gradient(135deg, #d9f7e5, #c2a05a); }
      .spurl-chara-message--user .spurl-chara-message__bubble { background: linear-gradient(135deg, rgba(194,160,90,0.22), rgba(255,255,255,0.08)); border: 1px solid rgba(194,160,90,0.24); }
      .spurl-chara-message__bubble {
        max-width: 92%;
        padding: 0.45rem 0.55rem;
        border-radius: 12px 12px 12px 4px;
        color: #fff8ed;
        font-size: 0.86rem;
        line-height: 1.35;
        word-break: break-word;
      }
      .spurl-chara-message--user .spurl-chara-message__bubble { border-radius: 12px 12px 4px 12px; }
      .spurl-chara-form { display: grid; grid-template-columns: 1fr auto; gap: 0.35rem; margin-top: 0.45rem; }
      .spurl-chara-input {
        width: 100%;
        min-height: 40px;
        padding: 0.52rem 0.55rem;
        border: 1px solid rgba(194,160,90,0.28);
        border-radius: 10px;
        background: rgba(255,255,255,0.04);
        color: #fff8ed;
        font: inherit;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.02);
      }
      .spurl-chara-input:focus-visible { outline: 2px solid rgba(194,160,90,0.8); outline-offset: 2px; }
      .spurl-chara-send {
        border: 0;
        border-radius: 10px;
        padding: 0 0.65rem;
        background: linear-gradient(135deg, #ffe9bf, #c2a05a);
        color: #102218;
        font-weight: 700;
        cursor: pointer;
        min-height: 40px;
        box-shadow: 0 8px 16px rgba(194,160,90,0.18);
      }
      .spurl-chara-send:hover,
      .spurl-chara-send:focus-visible {
        filter: brightness(1.02);
        outline: none;
      }
      @keyframes spurl-chara-breathe { 0%,100% { box-shadow: 0 14px 28px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.02) inset; } 50% { box-shadow: 0 16px 32px rgba(0,0,0,0.32), 0 0 0 1px rgba(194,160,90,0.18) inset; } }
      @media (max-width: 640px) {
        .spurl-chara-widget { right: 10px; bottom: 10px; left: 10px; align-items: stretch; }
        .spurl-chara-launcher { width: 64px; height: 64px; align-self: flex-end; font-size: 0.75rem; }
        .spurl-chara-launcher::after { right: auto; left: 50%; bottom: calc(100% + 8px); transform: translateX(-50%) translateY(4px); }
        .spurl-chara-panel { width: 100%; max-width: none; }
        .spurl-chara-message__avatar { width: 28px; height: 28px; flex-basis: 28px; }
      }
    `;
    document.head.appendChild(style);
  }

  function injectWidgetMarkup() {
    if (document.querySelector('.spurl-chara-widget')) return;


    const widget = document.createElement('aside');
    widget.className = 'spurl-chara-widget';
    widget.setAttribute('aria-label', 'CHARA floating widget');
    widget.innerHTML = `
      <button class="spurl-chara-launcher" type="button" data-spurl-launcher aria-expanded="false" aria-controls="spurl-chara-panel" aria-label="Open CHARA chatbot"></button>
      <section class="spurl-chara-panel" id="spurl-chara-panel" aria-label="CHARA chatbot panel">
        <header class="spurl-chara-header">
          <div>
            <div class="spurl-chara-title">CHARA</div>
            <div class="spurl-chara-subtitle">The Spurl Guide</div>
          </div>
          <button class="spurl-chara-close" type="button" data-spurl-close aria-label="Close CHARA panel">×</button>
        </header>
        <div class="spurl-chara-body">
          <div class="spurl-chara-chat-log" data-chat-log aria-live="polite"></div>
          <form class="spurl-chara-form" data-chat-form>
            <input class="spurl-chara-input" type="text" data-chat-input placeholder="Ask about the site…" autocomplete="off" />
            <button class="spurl-chara-send" type="submit">Go</button>
          </form>
        </div>
      </section>
    `;

    document.body.appendChild(widget);

    const launcher = widget.querySelector('[data-spurl-launcher]');
    const closeButton = widget.querySelector('[data-spurl-close]');

    function updateLauncherVisibility() {
      if (widget.classList.contains('is-open')) {
        launcher.style.display = 'none';
      } else {
        launcher.style.display = 'inline-flex';
      }
    }

    function openWidget() {
      widget.classList.add('is-open');
      launcher.setAttribute('aria-expanded', 'true');
      updateLauncherVisibility();
      if (!widget.dataset.welcomeShown) {
        widget.dataset.welcomeShown = 'true';
        setTimeout(() => {
          const chatLog = widget.querySelector('[data-chat-log]');
          if (chatLog && !chatLog.textContent.trim()) {
            const welcome = 'Dia duit 👋\nI\'m CHARA, The Spurl Guide.\nAsk me about Spurl products, shipping, engraving, heritage, players, grounds, or the website.';
            const evt = new CustomEvent('spurl:chara-welcome', { detail: { text: welcome } });
            document.dispatchEvent(evt);
          }
        }, 120);
      }
    }

    function closeWidget() {
      widget.classList.remove('is-open');
      launcher.setAttribute('aria-expanded', 'false');
      updateLauncherVisibility();
    }

    launcher.addEventListener('click', () => {
      if (widget.classList.contains('is-open')) {
        closeWidget();
      } else {
        openWidget();
      }
    });

    closeButton.addEventListener('click', closeWidget);

    document.addEventListener('click', (event) => {
      if (!widget.contains(event.target) && widget.classList.contains('is-open')) {
        closeWidget();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && widget.classList.contains('is-open')) {
        closeWidget();
      }
    });

    updateLauncherVisibility();
  }

  function initialize() {
    injectStyles();
    injectWidgetMarkup();

    const baseUrl = widgetBaseUrl();
    const knowledgeUrl = baseUrl + 'js/knowledge-bot.js';
    const chatbotUrl = baseUrl + 'js/chatbot.js';
    const sliotarUrl = baseUrl + 'assets/sloitar-chatbot.png';

    // Resolve the widget assets from the repository root so Hostinger loading stays stable.

    global.__SPURL_WIDGET_BASE_URL__ = baseUrl;

    loadScript(knowledgeUrl)
      .then(() => loadScript(chatbotUrl))
      .catch((error) => {
        console.error('[CHARA] widget failed to initialize:', error);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})(window);
