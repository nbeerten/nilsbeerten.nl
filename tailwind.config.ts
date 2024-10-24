import defaultTheme from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";
import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", ...defaultTheme.fontFamily.sans],
                display: ["Satoshi", ...defaultTheme.fontFamily.sans],
            },
            typography: () => ({
                amber: {
                    css: {
                        // Only for dark mode
                        "--tw-prose-invert-body": "var(--brand-text)",
                        "--tw-prose-invert-headings": "var(--brand-text)",
                        "--tw-prose-invert-lead": "var(--brand-text)",
                        "--tw-prose-invert-links": "var(--brand-text)",
                        "--tw-prose-invert-bold": "var(--brand-text)",
                        "--tw-prose-invert-counters": "var(--brand-text)",
                        "--tw-prose-invert-bullets": "var(--brand-text)",
                        "--tw-prose-invert-hr": "var(---brand-border)",
                        "--tw-prose-invert-quotes": "var(--brand-text)",
                        "--tw-prose-invert-quote-borders": "var(--brand-text)",
                        "--tw-prose-invert-captions": "var(--brand-text)",
                        "--tw-prose-invert-code": "var(--brand-text)",
                        // "--tw-prose-invert-pre-code": theme("colors.amber[300]"), // Does not work, astro highlighting takes over
                        // "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)", // Does not work, astro highlighting takes over
                        "--tw-prose-invert-th-borders": "var(--brand-border)",
                        "--tw-prose-invert-td-borders": "var(--brand-border)",
                    },
                },
            }),
            colors: {
                brand: Object.entries({
                    text: "var(--brand-text)",
                    muted: "var(--brand-muted)",
                    background: "var(--brand-background)",
                    border: "var(--brand-border)",
                })
                    .map(([key, value]) => [
                        key,
                        `color-mix(in srgb, ${value} calc(<alpha-value> * 100%), transparent)`,
                    ])
                    // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
                    .reduce((acc, [key, value]) => ({ ...acc, [key as string]: value }), {}),
            },
        },
    },
    plugins: [
        // Plugin for grouping tailwind utilities: "x-[h-5,w-5]"
        plugin(({ matchUtilities }) => {
            matchUtilities({
                x: (value) => ({
                    [`@apply ${value.replaceAll(",", " ")}`]: {},
                }),
            });
        }),
        typography(),
    ],
} satisfies Config;
