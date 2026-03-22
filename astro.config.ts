import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";
import icons from "unplugin-icons/vite";
import tunnel from "astro-tunnel";
import sitemap from "@astrojs/sitemap";
import { remarkTimeRead } from "./remark-plugins";

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

// https://astro.build/config
export default defineConfig({
    integrations: [
        sitemap({
            i18n: {
                defaultLocale: "en",
                locales: {
                    en: "en-GB",
                    nl: "nl-NL",
                },
            },
        }),
        tunnel()
    ],
    fonts: [
        {
            provider: fontProviders.fontshare(),
            name: "Satoshi",
            cssVariable: "--font-satoshi",
            weights: ["700"],
            subsets: ["latin"],
            styles: ["normal"],
            featureSettings: `"ss03" on, "ss01" on, "cv05" on, "cv06" on, "cv11" on`,
        },
        {
            provider: fontProviders.local(),
            name: "Inter",
            cssVariable: "--font-inter",
            options: {
                variants: [
                    {
                        weight: "100 900",
                        style: "normal",
                        src: ["./src/assets/InterVariable.woff2"],
                        featureSettings: `"ss01" on, "cv05" on, "cv06" on, "cv07" on, "cv11" on`,
                    },
                    {
                        weight: "100 900",
                        style: "italic",
                        src: ["./src/assets/InterVariable-Italic.woff2"],
                        featureSettings: `"ss01" on, "cv05" on, "cv06" on, "cv07" on, "cv11" on`,
                    },
                ],
            },
        },
    ],
    vite: {
        plugins: [
            tailwindcss(),
            icons({
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
