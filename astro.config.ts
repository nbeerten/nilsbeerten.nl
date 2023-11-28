import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";

import vercel from "@astrojs/vercel/serverless";

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
        sitemap({
            filter: (page) =>
                new URL(page).toString() !== new URL("https://nilsbeerten.nl/brand/").toString(),
        }),
        robotsTxt({
            policy: [
                {
                    userAgent: "*",
                    allow: "/",
                    disallow: "/brand",
                },
            ],
        }),
    ],
    site: "https://nilsbeerten.nl",
    output: "hybrid" /* This makes astro-icon work (with this switched to "server", worker.js in the outputDir is over 1 MB, too large for Cloudflare) */,
    adapter: vercel({
        webAnalytics: {
            enabled: true,
        },
        speedInsights: {
            enabled: true,
        },
    }),
});
