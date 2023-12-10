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
            typography: ({ theme }: { theme: (str: string) => string }) => ({
                amber: {
                    css: {
                        // Only for dark mode
                        "--tw-prose-invert-body": theme("colors.amber[100]"),
                        "--tw-prose-invert-headings": theme("colors.amber[100]"),
                        "--tw-prose-invert-lead": theme("colors.amber[100]"),
                        "--tw-prose-invert-links": theme("colors.amber[100]"),
                        "--tw-prose-invert-bold": theme("colors.amber[100]"),
                        "--tw-prose-invert-counters": theme("colors.amber[100]"),
                        "--tw-prose-invert-bullets": theme("colors.amber[100]"),
                        "--tw-prose-invert-hr": theme("colors.amber[100]/25%"),
                        "--tw-prose-invert-quotes": theme("colors.amber[100]"),
                        "--tw-prose-invert-quote-borders": theme("colors.stone[900]"),
                        "--tw-prose-invert-captions": theme("colors.amber[400]"),
                        "--tw-prose-invert-code": theme("colors.amber[100]"),
                        "--tw-prose-invert-pre-code": theme("colors.amber[300]"), // Does not work, astro highlighting takes over
                        "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)", // Does not work, astro highlighting takes over
                        "--tw-prose-invert-th-borders": theme("colors.amber[100]/25%"),
                        "--tw-prose-invert-td-borders": theme("colors.stone[900]"),
                    },
                },
            }),
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
