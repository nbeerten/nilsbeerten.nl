import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";
import Icons from "unplugin-icons/vite";
import tunnel from "astro-tunnel";
import sitemap from "@astrojs/sitemap";
import {
    i18n,
    filterSitemapByDefaultLocale,
    type UserI18nConfig,
} from "astro-i18n-aut/integration";
import { remarkModifiedTime, remarkTimeRead } from "./remark-plugins";
import pageInsight from "astro-page-insight";
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
        tailwind(),
        tunnel(),
        pageInsight(),
    ],
    vite: {
        plugins: [
            Icons({
                compiler: "astro",
                autoInstall: true,
            }),
        ],
        ssr: {
            external: ["node:buffer"],
        },
    },
    site: import.meta.env.CF_PAGES_URL || "https://nilsbeerten.nl",
    trailingSlash: "never",
    build: {
        format: "file",
    },
    output: "hybrid",
    adapter: cloudflare({
        imageService: "passthrough",
    }),
    markdown: {
        // @ts-expect-error Types for plugins are incorrect, wants `() => {}` but needs `() => () => {}`
        remarkPlugins: [remarkModifiedTime, remarkTimeRead],
        shikiConfig: {
            theme: await vesper(),
            wrap: true,
        },
    },
});
