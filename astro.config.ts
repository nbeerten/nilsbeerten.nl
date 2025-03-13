import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";
import Icons from "unplugin-icons/vite";
import tunnel from "astro-tunnel";
import sitemap from "@astrojs/sitemap";
import {
    i18n,
    filterSitemapByDefaultLocale,
    type UserI18nConfig,
} from "astro-i18n-aut/integration";
import { remarkTimeRead } from "./remark-plugins";
import pageInsight from "astro-page-insight";
// import alpinejs from "@astrojs/alpinejs";
const vesper = async () => {
    const response = await fetch(
        "https://raw.githubusercontent.com/raunofreiberg/vesper/main/themes/Vesper-dark-color-theme.json"
    );
    const text = await response.text();
    const sanitizedText = text.replace(
        /\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g,
        (match, group) => (group ? "" : match)
    );
    return JSON.parse(sanitizedText);
};
const i18nConfig: UserI18nConfig = {
    defaultLocale: "en",
    locales: {
        en: "en-UK",
        nl: "nl-NL",
    },
    exclude: ["pages/open-graph/**/*", "pages/api/**/*"],
};

// https://astro.build/config
export default defineConfig({
    integrations: [
        i18n(i18nConfig),
        sitemap({
            i18n: i18nConfig,
            filter: filterSitemapByDefaultLocale({
                defaultLocale: i18nConfig.defaultLocale,
            }),
        }),
        tunnel(),
        pageInsight(),
        // alpinejs(),
    ],
    vite: {
        plugins: [
            tailwindcss(),
            Icons({
                compiler: "astro",
                autoInstall: true,
            }),
        ],
        ssr: {
            external: ["node:buffer"],
        },
        build: {
            sourcemap: true,
        },
    },
    site: import.meta.env.CF_PAGES_URL || "https://www.nilsbeerten.nl",
    trailingSlash: "never",
    build: {
        format: "file",
    },
    output: "server", // Astro 5.0 removed "hybrid", which is now "static", which essentially is still "hybrid".
    adapter: cloudflare({
        imageService: "passthrough",
    }),
    markdown: {
        // @ts-expect-error
        remarkPlugins: [remarkTimeRead],
        shikiConfig: {
            theme: await vesper(),
            wrap: true,
        },
    },
});
