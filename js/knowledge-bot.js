// ACTIVE: knowledge lookup runtime used by the live Hostinger widget.
(function (global) {
  const BASE_URL = (global.__SPURL_WIDGET_BASE_URL__ || '').replace(/\/+$|$/, '/');
  const KNOWLEDGE_URL = BASE_URL + 'data/spurl-knowledge.json';

  function normalizeText(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function tokenize(value) {
    return normalizeText(value)
      .split(/\s+/)
      .filter(Boolean);
  }

  function unique(values) {
    return Array.from(new Set(values.filter(Boolean)));
  }

  function scoreItem(query, item) {
    const q = normalizeText(query);
    const qTokens = tokenize(query);
    const haystack = [item.title, item.question, item.name, item.location, item.answer, item.type || '', ...(item.keywords || [])].join(' ');
    const hayTokens = tokenize(haystack);
    const hay = normalizeText(haystack);

    let score = 0;

    if (q && hay.includes(q)) score += 80;
    if (item.title && normalizeText(item.title).includes(q)) score += 40;
    if (item.question && normalizeText(item.question).includes(q)) score += 35;
    if (item.name && normalizeText(item.name).includes(q)) score += 35;

    const exactMatches = unique(qTokens.filter((token) => hayTokens.includes(token)));
    score += exactMatches.length * 18;

    const keywordMatches = unique((item.keywords || []).filter((keyword) => normalizeText(keyword).includes(q) || q.includes(normalizeText(keyword))));
    score += keywordMatches.length * 12;

    const tokenSet = new Set(qTokens);
    const overlap = hayTokens.filter((token) => tokenSet.has(token));
    score += overlap.length * 6;

    if (qTokens.length > 0 && overlap.length === 0) {
      const fuzzyHits = qTokens.filter((token) => hayTokens.some((candidate) => candidate.startsWith(token) || token.startsWith(candidate) || candidate.includes(token) || token.includes(candidate)));
      score += fuzzyHits.length * 4;
    }

    return score;
  }

  function flattenKnowledge(knowledge) {
    const list = [];

    if (Array.isArray(knowledge.siteOverview)) list.push(...knowledge.siteOverview.map((item) => ({ ...item, category: 'siteOverview' })));
    if (Array.isArray(knowledge.faqs)) list.push(...knowledge.faqs.map((item) => ({ ...item, category: 'faqs'})));
    if (Array.isArray(knowledge.shippingFAQ)) list.push(...knowledge.shippingFAQ.map((item) => ({ ...item, category: 'shippingFAQ' })));
    if (Array.isArray(knowledge.heritage)) list.push(...knowledge.heritage.map((item) => ({ ...item, category: 'heritage' })));
    if (Array.isArray(knowledge.players)) list.push(...knowledge.players.map((item) => ({ ...item, category: 'players' })));
    if (Array.isArray(knowledge.pitches)) list.push(...knowledge.pitches.map((item) => ({ ...item, category: 'pitches' })));
    if (Array.isArray(knowledge.productInfo)) list.push(...knowledge.productInfo.map((item) => ({ ...item, category: 'productInfo' })));
    return list;
  }

  function findAnswer(query, knowledge) {
    const items = flattenKnowledge(knowledge || {});
    if (!items.length) return null;

    const scored = items
      .map((item) => ({ item, score: scoreItem(query, item) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score);

    if (!scored.length) return null;

    return scored[0].item;
  }

  function getSuggestions(knowledge) {
    return Array.isArray(knowledge.quickPrompts) ? knowledge.quickPrompts : [];
  }

  function fallbackKnowledge() {
    return {
      metadata: { site: 'Spurl', version: 'fallback' },
      quickPrompts: [
        'What is Spurl.ie about?',
        'Where do you ship from?',
        'Tell me about the heritage timeline',
        'Do you deliver to the UK?',
      ],
      siteOverview: [
        {
          id: 'fallback-about',
          title: 'About Spurl',
          answer: 'Spurl is a static knowledge-driven assistant for the Spurl.ie website. It is designed to answer site questions without any external services. If you require further assistance, please contact us using the contact form.',
          keywords: ['spurl', 'about', 'site', 'website']
        }
      ],
      faqs: [],
      heritage: [],
      players: [],
      pitches: [],
      productInfo: []
    };
  }

  function loadKnowledge(callback) {
    console.log('[CHARA] loading knowledge file from:', KNOWLEDGE_URL);

    fetch(KNOWLEDGE_URL, { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) {
          const error = new Error('Knowledge file not found (' + response.status + ')');
          console.error('[CHARA] knowledge request failed:', error.message, 'URL:', KNOWLEDGE_URL);
          throw error;
        }
        return response.json();
      })
      .then((json) => {
        console.log('[CHARA] knowledge file loaded successfully');
        callback(null, json);
      })
      .catch((error) => {
        console.error('[CHARA] failed to load knowledge file, using fallback:', error);
        callback(error, fallbackKnowledge());
      });
  }

  global.KnowledgeBot = {
    loadKnowledge,
    findAnswer,
    getSuggestions,
    fallbackKnowledge,
    normalizeText,
    tokenize,
    scoreItem
  };
})(window);
