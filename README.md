# bradley-durham-blog

Personal blog and portfolio site for Bradley Durham. Built with Astro 6, deployed to Netlify.

## Stack

- **Framework:** Astro 6 (static site generation)
- **Adapter:** Netlify
- **Content:** Markdown / MDX via Astro Content Collections
- **Fonts:** Inter, JetBrains Mono, Ephesis (Google Fonts)
- **Features:** RSS feed, sitemap, MDX support, photo gallery, /now page

## Project Structure

```
src/
├── components/       # Astro components (Header, Footer, etc.)
├── content/
│   └── blog/         # Markdown/MDX blog posts
├── data/             # JSON data files (e.g. now.json)
├── layouts/          # Page layouts
├── pages/            # Routes (index, blog, about, now, photos, rss)
├── assets/           # Images, fonts
└── styles/           # Global CSS
astro.config.mjs
netlify.toml
```

## Commands

| Command           | Action                              |
| :---------------- | :---------------------------------- |
| `npm install`     | Install dependencies                |
| `npm run dev`     | Start dev server at localhost:4321  |
| `npm run build`   | Build to `./dist/`                  |
| `npm run preview` | Preview production build locally    |

## Deployment

Pushes to `main` deploy automatically via Netlify. Build command: `npm run build`, publish dir: `dist`.
