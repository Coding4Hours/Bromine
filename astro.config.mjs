// @ts-check
import { defineConfig } from "astro/config"
import tailwindcss from "@tailwindcss/vite"
import icon from "astro-icon"

import cloudflare from "@astrojs/cloudflare"

export default defineConfig({
  integrations: [icon(), (await import("@playform/compress")).default()],

  vite: {
    build: {
      sourcemap: true, // enable production source maps
    },
    css: {
      devSourcemap: true, // enable CSS source maps during development
    },
    plugins: [tailwindcss()],
  },

  output: "server",
  adapter: cloudflare({
    imageService: "cloudflare",
  }),
  experimental: {
    preserveScriptOrder: true,
  },
})
