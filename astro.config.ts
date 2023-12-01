import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
    integrations: [tailwind(), icon({
        include: {
            "simple-icons": ["github", "x", "discord"],
            lucide: ["mail", "arrow-left"]
        }
    }), sitemap({
        filter: page => new URL(page).toString() !== new URL("https://nilsbeerten.nl/brand/").toString()
    }), robotsTxt({
        policy: [{
            userAgent: "*",
            allow: "/",
            disallow: "/brand"
        }]
    })],
    site: "https://nilsbeerten.nl",
    output: "hybrid",
    adapter: cloudflare({
        imageService: "passthrough"
    })
});