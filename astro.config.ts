import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";
import icons from "unplugin-icons/vite";
import { remarkTimeRead } from "./remark-plugins";

// https://astro.build/config
export default defineConfig({
    adapter: cloudflare(),
    integrations: [],
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
                        src: ["./src/fonts/InterVariable.woff2"],
                        featureSettings: `"ss01" on, "cv05" on, "cv06" on, "cv07" on, "cv11" on`,
                    },
                    {
                        weight: "100 900",
                        style: "italic",
                        src: ["./src/fonts/InterVariable-Italic.woff2"],
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
        build: {
            sourcemap: true,
        },
    },
    site: "https://www.nilsbeerten.nl",
    trailingSlash: "never",
    output: "server",
    markdown: {
        remarkPlugins: [remarkTimeRead],
    },
});
