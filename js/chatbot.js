const widgetRoot = document.querySelector('.spurl-chara-widget') || document.body;
const chatLog = widgetRoot.querySelector('[data-chat-log]');
const input = widgetRoot.querySelector('[data-chat-input]');
const form = widgetRoot.querySelector('[data-chat-form]');
const widget = document.querySelector('.spurl-chara-widget');
const baseUrl = (window.__SPURL_WIDGET_BASE_URL__ || '').replace(/\/+$/, '/');
const avatarImage = (baseUrl ? baseUrl : '') + 'assets/sloitar-chatbot.png';

let knowledgeData = null;
let welcomeShown = false;

if (globalThis.__SPURL_CHARA_CHAT_INIT__) {
  console.log('[CHARA] chatbot already initialized; skipping duplicate setup');
} else {
  globalThis.__SPURL_CHARA_CHAT_INIT__ = true;
}

function addMessage(text, role = 'bot') {
  if (!chatLog) return;

  const message = document.createElement('article');
  message.className = `message message--${role}`;

  const avatar = document.createElement('div');
  avatar.className = 'message__avatar';
  if (role === 'bot') {
    avatar.textContent = 'Chara';
    avatar.setAttribute('aria-label', 'Chara');
  } else {
    avatar.textContent = 'Tusa';
    avatar.setAttribute('aria-label', 'Tusa');
  }

  const bubble = document.createElement('div');
  bubble.className = 'message__bubble';
  bubble.textContent = text;

  message.appendChild(avatar);
  message.appendChild(bubble);
  chatLog.appendChild(message);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function getFallbackAnswer(query) {
  console.warn('[CHARA] no direct answer found for:', query);
  const fallback = knowledgeData && knowledgeData.productInfo ? knowledgeData.productInfo.find((item) => /shipping|delivery|dispatch|engrave|future|product/i.test(item.title || '')) : null;

  if (fallback) {
    return `${fallback.answer} If you want a more specific answer, add keywords such as “shipping”, “engraving”, “dispatch time” or “wooden products”.`;
  }

  return 'I can help with Spurl products, shipping, engraving, heritage, players, grounds and the site. Please try a more specific question if needed.';
}

function getAnswer(text) {
  if (!knowledgeData) {
    console.warn('[CHARA] knowledge data not ready yet for:', text);
    return 'The knowledge base is still loading. Please try again in a moment.';
  }

  const match = window.KnowledgeBot.findAnswer(text, knowledgeData);
  if (match) {
    console.log('[CHARA] answer matched from knowledge base:', match.title || match.question || text);
    return match.answer;
  }

  console.warn('[CHARA] no knowledge match found for:', text);
  return getFallbackAnswer(text);
}

function handleSubmit(event) {
  console.log('[CHARA] submit event received');
  if (event && typeof event.preventDefault === 'function') {
    event.preventDefault();
    event.stopPropagation();
  }

  const text = input && input.value.trim();
  if (!text) {
    console.warn('[CHARA] submit ignored because the input was empty');
    return false;
  }

  addMessage(text, 'user');
  if (input) input.value = '';

  const response = getAnswer(text);
  setTimeout(() => addMessage(response, 'bot'), 220);
  return false;
}

function showWelcomeMessage() {
  if (welcomeShown) return;
  welcomeShown = true;

  const welcome = "Dia duit 👋\nI'm Chara, The Spurl Guide.\nAsk me about Spurl products, shipping, engraving, heritage, players, grounds, or the website.";
  addMessage(welcome, 'bot');
}

function initChat() {
  console.log('[CHARA] chatbot initialization started');

  if (!window.KnowledgeBot) {
    console.warn('[CHARA] KnowledgeBot not ready yet; retrying');
    setTimeout(initChat, 150);
    return;
  }

  console.log('[CHARA] KnowledgeBot available');

  if (form) {
    form.noValidate = true;
    form.setAttribute('novalidate', 'true');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopPropagation();
      return handleSubmit(event);
    }, false);
  }

  window.KnowledgeBot.loadKnowledge((error, data) => {
    if (error) {
      console.error('[CHARA] knowledge file request failed:', error);
      knowledgeData = data || window.KnowledgeBot.fallbackKnowledge();
      addMessage('The knowledge base is temporarily unavailable, but I can still answer general Spurl questions. Try asking about products, shipping, heritage, or players.', 'bot');
    } else {
      console.log('[CHARA] knowledge data loaded successfully');
      knowledgeData = data || window.KnowledgeBot.fallbackKnowledge();
    }
  });

  document.addEventListener('spurl:chara-welcome', (event) => {
    const text = event && event.detail && event.detail.text ? event.detail.text : 'Dia duit 👋\nI\'m Chara, The Spurl Guide.';
    addMessage(text, 'bot');
  }, { once: false });

  showWelcomeMessage();
  console.log('[CHARA] chatbot initialization complete');
}

console.log('[CHARA] widget script loaded');
initChat();
