import defaultTheme from "tailwindcss/defaultTheme";
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
                        "--tw-prose-body": "var(--brand-text)",
                        "--tw-prose-headings": "var(--brand-text)",
                        "--tw-prose-lead": "var(--brand-text)",
                        "--tw-prose-links": "var(--brand-text)",
                        "--tw-prose-bold": "var(--brand-text)",
                        "--tw-prose-counters": "var(--brand-text)",
                        "--tw-prose-bullets": "var(--brand-text)",
                        "--tw-prose-hr": "var(---brand-border)",
                        "--tw-prose-quotes": "var(--brand-text)",
                        "--tw-prose-quote-borders": "var(--brand-text)",
                        "--tw-prose-captions": "var(--brand-text)",
                        "--tw-prose-code": "var(--brand-text)",
                        // "--tw-prose-invert-pre-code": theme("colors.amber[300]"), // Does not work, astro highlighting takes over
                        // "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)", // Does not work, astro highlighting takes over
                        "--tw-prose-th-borders": "var(--brand-border)",
                        "--tw-prose-td-borders": "var(--brand-border)",
                    },
                },
            }),
            colors: {
                brand: {
                    text: "var(--brand-text)",
                    muted: "var(--brand-muted)",
                    background: "var(--brand-background)",
                    border: "var(--brand-border)",
                    hr: "var(--brand-hr)",
                },
            },
        },
    },
    plugins: [
        typography(),
    ],
} satisfies Config;
