const suggestions = document.querySelector('[data-suggestions]');
const chatLog = document.querySelector('[data-chat-log]');
const input = document.querySelector('[data-chat-input]');
const form = document.querySelector('[data-chat-form]');

let knowledgeData = null;

function addMessage(text, role = 'bot') {
  if (!chatLog) return;

  const message = document.createElement('article');
  message.className = `message message--${role}`;

  const avatar = document.createElement('div');
  avatar.className = 'message__avatar';
  avatar.textContent = role === 'user' ? 'You' : 'S';

  const bubble = document.createElement('div');
  bubble.className = 'message__bubble';
  bubble.textContent = text;

  message.appendChild(avatar);
  message.appendChild(bubble);
  chatLog.appendChild(message);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function getFallbackAnswer(query) {
  const fallback = knowledgeData && knowledgeData.productInfo ? knowledgeData.productInfo.find((item) => /shipping|delivery|dispatch|engrave|future|product/i.test(item.title || '')) : null;

  if (fallback) {
    return `${fallback.answer} If you want a more specific answer, add keywords such as “shipping”, “engraving”, “dispatch time” or “wooden products”.`;
  }

  return 'I can answer questions about the site’s GAA pitches, heritage, players and product information placeholders. Try asking “What is this site about?” or “Tell me about the heritage timeline.”';
}

function getAnswer(text) {
  if (!knowledgeData) {
    return 'The knowledge base is still loading. Please try again in a moment.';
  }

  const match = window.KnowledgeBot.findAnswer(text, knowledgeData);
  if (match) {
    return match.answer;
  }

  return getFallbackAnswer(text);
}

function setSuggestions(knowledge) {
  if (!suggestions) return;

  suggestions.innerHTML = '';
  const prompts = window.KnowledgeBot.getSuggestions(knowledge);

  prompts.forEach((prompt) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'topic-button';
    button.textContent = prompt;
    button.addEventListener('click', () => {
      if (input) input.value = prompt;
      if (input) input.focus();
      if (form) form.requestSubmit();
    });
    suggestions.appendChild(button);
  });
}

function handleSubmit(event) {
  event.preventDefault();
  const text = input && input.value.trim();

  if (!text) return;

  addMessage(text, 'user');
  if (input) input.value = '';

  const response = getAnswer(text);
  setTimeout(() => addMessage(response, 'bot'), 220);
}

function initChat() {
  if (!window.KnowledgeBot) {
    setTimeout(initChat, 100);
    return;
  }

  window.KnowledgeBot.loadKnowledge((error, data) => {
    knowledgeData = data || window.KnowledgeBot.fallbackKnowledge();
    setSuggestions(knowledgeData);
  });

  if (form) {
    form.addEventListener('submit', handleSubmit);
  }

  addMessage('Hi! I am the Spurl assistant. Ask me about the hurling pitches, the heritage timeline, or the players featured on the site.', 'bot');
}

initChat();
