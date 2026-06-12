# Hostinger CAINT floating widget setup

## Why the iframe approach is limiting

The current iframe model forces the widget into a fixed rectangular box. That box is constrained by the page layout, so the launcher appears inside the iframe area instead of the real browser viewport, the panel is clipped by the iframe boundaries, and empty space remains even when the iframe background is transparent. A true floating widget must be injected at the page level, not nested inside a frame.

## Preferred architecture

Use a script-injected floating widget rather than an iframe:

- it is anchored to the viewport with fixed positioning
- it is not limited by any container or page section
- it works with Hostinger Global Code / Custom Code injection
- it reuses the existing CAINT branding and knowledge base logic

## Files involved

- Create / update:
  - js/hostinger-widget-loader.js — lightweight loader that injects the floating widget into the page
  - js/knowledge-bot.js — updated to resolve the knowledge file from the loader base URL
- Keep using:
  - data/spurl-knowledge.json
  - js/chatbot.js

## Easiest deployment for Hostinger

1. Publish this repository to GitHub Pages (or another public static host).
2. Copy the public script URL for the loader file, for example:
   https://<your-user>.github.io/spurl-widgets-/js/hostinger-widget-loader.js
3. In Hostinger, open Website > Website Builder > Custom Code / Global Code Injection.
4. Paste the following snippet before the closing body tag:

```html
<script src="https://<your-user>.github.io/spurl-widgets-/js/hostinger-widget-loader.js" defer></script>
```

5. Save and publish.

The loader will inject the CAINT launcher and chat panel directly into every page where the snippet is active.
