import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";
import Icons from "unplugin-icons/vite";
import tunnel from "astro-tunnel";
// @ts-expect-error
import lighthouse from "astro-lighthouse";
import sitemap from "@astrojs/sitemap";
import { i18n, filterSitemapByDefaultLocale } from "astro-i18n-aut/integration";

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

const i18nConfig = {
    defaultLocale: "en",
    locales: {
        "en": "en-UK",
        "nl": "nl-NL",
    }
}

// https://astro.build/config
export default defineConfig({
    integrations: [
        i18n(i18nConfig),
        sitemap({
            i18n: i18nConfig,
            filter: filterSitemapByDefaultLocale({ defaultLocale: i18nConfig.defaultLocale }),
        }),
        tailwind(), 
        tunnel(), 
        lighthouse(), 
    ],
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
        runtime: {
            mode: "off",
        },
    }),
    markdown: {
        shikiConfig: {
            theme: await vesper(),
            wrap: true,
        },
    },
});
