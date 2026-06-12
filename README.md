# spurl-widgets-
Widgets for my website.

## Chatbot for Hostinger / GitHub Pages

The standalone chatbot page is ready to use on your live site:
- Main page: chatbot.html
- Embed-friendly page: chatbot-embed.html
- Floating widget page: widget-floating.html
- Static widget page: widget.html

### Final folder structure

```text
.
├── chatbot.html
├── chatbot-embed.html
├── widget.html
├── widget-floating.html
├── css/
│   ├── chatbot.css
│   ├── chatbot-embed.css
├── data/
│   └── spurl-knowledge.json
├── js/
│   ├── chatbot.js
│   ├── knowledge-bot.js
│   └── carousel.js
└── README.md
```

### Knowledge base approach

- All chatbot answers now come from data/spurl-knowledge.json.
- The static JavaScript loader fetches the JSON file at runtime, which keeps the solution GitHub Pages compatible.
- The structure is designed for future migration to OpenAI, Claude or Gemini APIs by keeping each answer in a predictable schema.

### Recommended additional FAQ entries

Add these common customer questions to the knowledge base as your product information becomes confirmed:

1. Do you offer custom sizes for wooden kitchen pieces?
2. What wood types are used in your products?
3. How should I care for and maintain handcrafted wooden items?
4. Do you provide gift packaging or branded presentation?
5. Can I order a rush production or express dispatch?
6. Do you accept returns or exchanges on made-to-order items?
7. Are your products suitable for indoor use only?
8. Can I request a custom engraving or personalised message?
9. How long does it take to make a bespoke item?
10. Do you offer matching sets or coordinating pieces?

To place it on your Hostinger website, use an iframe pointing at your GitHub Pages URL:

```html
<iframe
  src="https://YOUR-GITHUB-USER.github.io/spurl-widgets-/chatbot-embed.html"
  title="Spurl Assistant"
  width="100%"
  height="760"
  style="border: 0; border-radius: 18px;"
></iframe>
```

If you publish this repo to GitHub Pages, the page above will load the chatbot directly from the hosted URL.
