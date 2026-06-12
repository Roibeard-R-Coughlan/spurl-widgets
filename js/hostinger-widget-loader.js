(function (global) {
  if (global.__SPURL_CAINT_WIDGET_LOADER__) return;
  global.__SPURL_CAINT_WIDGET_LOADER__ = true;

  function widgetBaseUrl() {
    const current = document.currentScript && document.currentScript.src
      ? document.currentScript.src
      : global.location.href;
    return new URL('.', current).toString();
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
    if (document.getElementById('spurl-caint-loader-styles')) return;

    const style = document.createElement('style');
    style.id = 'spurl-caint-loader-styles';
    style.textContent = `
      .spurl-caint-widget {
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
      .spurl-caint-widget * { box-sizing: border-box; }
      .spurl-caint-widget > * { pointer-events: auto; }
      .spurl-caint-launcher {
        position: relative;
        width: 72px;
        height: 72px;
        border: 1px solid rgba(194,160,90,0.35);
        border-radius: 999px;
        background:
          linear-gradient(145deg, rgba(7,19,15,0.14), rgba(7,19,15,0.08)),
          url("${widgetBaseUrl()}assets/sloitar-chatbot.png") center / cover no-repeat;
        box-shadow: 0 14px 28px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.02) inset;
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
        animation: spurl-caint-breathe 4.8s ease-in-out infinite;
      }
      .spurl-caint-launcher span {
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
      .spurl-caint-launcher:hover,
      .spurl-caint-launcher:focus-visible {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 18px 34px rgba(0,0,0,0.35), 0 0 0 1px rgba(194,160,90,0.30) inset;
        filter: saturate(1.05);
        outline: none;
      }
      .spurl-caint-launcher::after {
        content: "CAINT\AThe Spurl Guide";
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
        .spurl-caint-launcher:hover::after,
        .spurl-caint-launcher:focus-visible::after { opacity: 1; transform: translateY(0); }
      }
      .spurl-caint-panel {
        position: absolute;
        right: 0;
        bottom: calc(100% + 12px);
        width: min(380px, calc(100vw - 24px));
        max-height: calc(100vh - 24px);
        border: 1px solid rgba(194,160,90,0.18);
        border-radius: 18px;
        background: linear-gradient(180deg, rgba(7,19,15,0.98), rgba(7,19,15,0.96));
        box-shadow: 0 18px 42px rgba(0,0,0,0.35);
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
      .spurl-caint-widget.is-open .spurl-caint-panel {
        opacity: 1;
        visibility: visible;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }
      .spurl-caint-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        padding: 0.75rem 0.8rem;
        border-bottom: 1px solid rgba(194,160,90,0.18);
        background: linear-gradient(180deg, rgba(194,160,90,0.10), rgba(7,19,15,0.98));
      }
      .spurl-caint-title {
        font-size: 1rem;
        font-weight: 800;
        letter-spacing: 0.03em;
        text-transform: uppercase;
        color: #fff8ed;
      }
      .spurl-caint-subtitle {
        color: #ffe9bf;
        font-size: 0.78rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .spurl-caint-close {
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
      }
      .spurl-caint-body {
        display: flex;
        flex-direction: column;
        min-height: 0;
        padding: 0.65rem 0.75rem 0.75rem;
        background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0));
      }
      .spurl-caint-chip-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
        margin-bottom: 0.45rem;
      }
      .spurl-caint-chip-row button,
      .spurl-caint-topic-button {
        padding: 0.35rem 0.45rem;
        border: 1px solid rgba(194,160,90,0.24);
        border-radius: 999px;
        background: rgba(255,255,255,0.04);
        color: #fff8ed;
        font-size: 0.78rem;
        cursor: pointer;
        text-align: left;
      }
      .spurl-caint-chat-log {
        display: flex;
        flex-direction: column;
        gap: 0.45rem;
        max-height: 260px;
        overflow: auto;
        min-height: 0;
        padding-right: 0.15rem;
      }
      .spurl-caint-widget .message {
        display: flex;
        align-items: flex-end;
        gap: 0.45rem;
      }
      .spurl-caint-widget .message__avatar {
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
      .spurl-caint-widget .message__avatar img { width: 100%; height: 100%; display: block; object-fit: cover; border-radius: inherit; }
      .spurl-caint-widget .message--bot .message__bubble { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); }
      .spurl-caint-widget .message--user { justify-content: flex-end; }
      .spurl-caint-widget .message--user .message__avatar { order: 2; background: linear-gradient(135deg, #d9f7e5, #c2a05a); }
      .spurl-caint-widget .message--user .message__bubble { background: linear-gradient(135deg, rgba(194,160,90,0.22), rgba(255,255,255,0.08)); border: 1px solid rgba(194,160,90,0.24); }
      .spurl-caint-widget .message__bubble {
        max-width: 92%;
        padding: 0.45rem 0.55rem;
        border-radius: 12px 12px 12px 4px;
        color: #fff8ed;
        font-size: 0.86rem;
        line-height: 1.35;
        word-break: break-word;
      }
      .spurl-caint-widget .message--user .message__bubble { border-radius: 12px 12px 4px 12px; }
      .spurl-caint-message { display: flex; align-items: flex-end; gap: 0.45rem; }
      .spurl-caint-message__avatar {
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
      .spurl-caint-message__avatar img { width: 100%; height: 100%; display: block; object-fit: cover; border-radius: inherit; }
      .spurl-caint-message--bot .spurl-caint-message__bubble { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); }
      .spurl-caint-message--user { justify-content: flex-end; }
      .spurl-caint-message--user .spurl-caint-message__avatar { order: 2; background: linear-gradient(135deg, #d9f7e5, #c2a05a); }
      .spurl-caint-message--user .spurl-caint-message__bubble { background: linear-gradient(135deg, rgba(194,160,90,0.22), rgba(255,255,255,0.08)); border: 1px solid rgba(194,160,90,0.24); }
      .spurl-caint-message__bubble {
        max-width: 92%;
        padding: 0.45rem 0.55rem;
        border-radius: 12px 12px 12px 4px;
        color: #fff8ed;
        font-size: 0.86rem;
        line-height: 1.35;
        word-break: break-word;
      }
      .spurl-caint-message--user .spurl-caint-message__bubble { border-radius: 12px 12px 4px 12px; }
      .spurl-caint-form { display: grid; grid-template-columns: 1fr auto; gap: 0.35rem; margin-top: 0.45rem; }
      .spurl-caint-input { width: 100%; min-height: 40px; padding: 0.52rem 0.55rem; border: 1px solid rgba(194,160,90,0.25); border-radius: 10px; background: rgba(255,255,255,0.04); color: #fff8ed; font: inherit; }
      .spurl-caint-input:focus-visible { outline: 2px solid rgba(194,160,90,0.8); outline-offset: 2px; }
      .spurl-caint-send { border: 0; border-radius: 10px; padding: 0 0.65rem; background: linear-gradient(135deg, #ffe9bf, #c2a05a); color: #102218; font-weight: 700; cursor: pointer; min-height: 40px; }
      @keyframes spurl-caint-breathe { 0%,100% { box-shadow: 0 14px 28px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.02) inset; } 50% { box-shadow: 0 16px 32px rgba(0,0,0,0.32), 0 0 0 1px rgba(194,160,90,0.18) inset; } }
      @media (max-width: 640px) {
        .spurl-caint-widget { right: 10px; bottom: 10px; left: 10px; align-items: stretch; }
        .spurl-caint-launcher { width: 64px; height: 64px; align-self: flex-end; font-size: 0.75rem; }
        .spurl-caint-launcher::after { right: auto; left: 50%; bottom: calc(100% + 8px); transform: translateX(-50%) translateY(4px); }
        .spurl-caint-panel { width: 100%; max-width: none; }
        .spurl-caint-message__avatar { width: 28px; height: 28px; flex-basis: 28px; }
      }
    `;
    document.head.appendChild(style);
  }

  function injectWidgetMarkup() {
    if (document.querySelector('.spurl-caint-widget')) return;

    const widget = document.createElement('aside');
    widget.className = 'spurl-caint-widget';
    widget.setAttribute('aria-label', 'CAINT floating widget');
    widget.innerHTML = `
      <button class="spurl-caint-launcher" type="button" data-spurl-launcher aria-expanded="false" aria-controls="spurl-caint-panel" aria-label="Open CAINT chatbot">
        <span>CAINT</span>
      </button>
      <section class="spurl-caint-panel" id="spurl-caint-panel" aria-label="CAINT chatbot panel">
        <header class="spurl-caint-header">
          <div>
            <div class="spurl-caint-title">CAINT</div>
            <div class="spurl-caint-subtitle">The Spurl Guide</div>
          </div>
          <button class="spurl-caint-close" type="button" data-spurl-close aria-label="Close CAINT panel">×</button>
        </header>
        <div class="spurl-caint-body">
          <div class="spurl-caint-chip-row" data-suggestions></div>
          <div class="spurl-caint-chat-log" data-chat-log aria-live="polite"></div>
          <form class="spurl-caint-form" data-chat-form>
            <input class="spurl-caint-input" type="text" data-chat-input placeholder="Ask about the site…" autocomplete="off" />
            <button class="spurl-caint-send" type="submit">Go</button>
          </form>
        </div>
      </section>
    `;

    document.body.appendChild(widget);

    const launcher = widget.querySelector('[data-spurl-launcher]');
    const closeButton = widget.querySelector('[data-spurl-close]');

    function openWidget() {
      widget.classList.add('is-open');
      launcher.setAttribute('aria-expanded', 'true');
    }

    function closeWidget() {
      widget.classList.remove('is-open');
      launcher.setAttribute('aria-expanded', 'false');
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
  }

  function initialize() {
    injectStyles();
    injectWidgetMarkup();

    const baseUrl = widgetBaseUrl();
    global.__SPURL_WIDGET_BASE_URL__ = baseUrl;

    loadScript(baseUrl + 'js/knowledge-bot.js')
      .then(() => loadScript(baseUrl + 'js/chatbot.js'))
      .catch((error) => {
        console.error('Spurl widget failed to initialize:', error);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})(window);
