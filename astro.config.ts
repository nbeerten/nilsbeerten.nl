import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";

import robotsTxt from "astro-robots-txt";

// https://astro.build/config
export default defineConfig({
    integrations: [
        tailwind(),
        icon({
            include: {
                "simple-icons": ["*"],
                lucide: ["*"],
            },
        }),
        sitemap(),
        robotsTxt(),
    ],
    site: "https://nilsbeerten.nl",
    output: "hybrid" /* This makes astro-icon work (with this switched to "server", worker.js in the outputDir is over 1 MB, too large for Cloudflare) */,
    adapter: cloudflare({
        imageService: "passthrough",
    }),
});
