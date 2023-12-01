import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";
import Icons from "unplugin-icons/vite";

// https://astro.build/config
export default defineConfig({
    integrations: [tailwind()],
    vite: {
        plugins: [
            Icons({
                compiler: "astro",
                autoInstall: true,
            }),
        ],
    },
    site: import.meta.env.CF_PAGES_URL || "https://nilsbeerten.nl",
    output: "hybrid",
    adapter: cloudflare({
        imageService: "passthrough",
    }),
});
