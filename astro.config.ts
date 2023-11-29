import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";

import vercel from "@astrojs/vercel/serverless";

const VERCEL_PREVIEW_SITE = (process.env.VERCEL_ENV !== "production" &&	process.env.VERCEL_URL) ? `https://${process.env.VERCEL_URL}` : false;

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
    site: VERCEL_PREVIEW_SITE || "https://nilsbeerten.nl",
    output: "server",
    adapter: vercel({
        webAnalytics: {
            enabled: true,
        },
        speedInsights: {
            enabled: true,
        },
    }),
});
