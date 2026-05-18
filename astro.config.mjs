// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: 'https://bradleydurham.com',
  integrations: [mdx(), sitemap()],

  fonts: [
      {
          provider: fontProviders.google(),
          name: 'Inter',
          cssVariable: '--font-sans',
          fallbacks: ['system-ui', 'sans-serif'],
          weights: ['400', '700'],
      },
      {
          provider: fontProviders.google(),
          name: 'JetBrains Mono',
          cssVariable: '--font-mono',
          fallbacks: ['ui-monospace', 'monospace'],
          weights: ['400'],
      },
      {
          provider: fontProviders.google(),
          name: 'Ephesis',
          cssVariable: '--font-signature',
          fallbacks: ['cursive'],
          weights: ['400'],
      },
  ],

  adapter: netlify(),
});