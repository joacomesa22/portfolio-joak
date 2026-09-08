// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  build: {
    // The stylesheet is small enough (~11 kB over the wire) that a separate
    // request for it costs more than it saves: while it is in flight the
    // document can be painted unstyled, which is exactly what a force-reload
    // does. Inlined, there is nothing left to wait for.
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
