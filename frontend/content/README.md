# Tina-driven content

All website copy is driven by JSON in this folder so you can edit text without touching code.

## Structure (same idea as buzzoid.com)

- **`global/index.json`** – Header, footer, service bar, cart, and auth strings used across the site.
- **`home/home.json`** – Home page sections: hero, services, why choose us, FAQ, comparison, experts, testimonials, CTA, etc.

## Editing content

1. **Direct edit** – Change `content/global/index.json` and `content/home/home.json`. The app loads these at build time.
2. **Tina Cloud** (optional) – To use the visual editor, add [Tina CMS](https://tina.io) and point it at this folder. The schema in `tina/config.js` describes the content shape.

## Adding new pages

1. Add a new JSON file under `content/` (e.g. `content/pages/contact.json`).
2. In `ContentContext.jsx`, import it and add it to the context value.
3. In your page component, use `useContent()` or a dedicated hook to read the data.
