// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import icons from "astro-icons";

import netlify from "@astrojs/netlify";

import playformCompress from "@playform/compress";

// https://astro.build/config
export default defineConfig({
    integrations: [icons(), playformCompress()],
    vite: { plugins: [tailwindcss()] },
    adapter: netlify(),
});