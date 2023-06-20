import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
    content: ["./src/**/*.{html,js,svelte,ts}"],
    darkMode: "class",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px"
            }
        },
        extend: {
            fontFamily: {
                sans: ["Satoshi", ...defaultTheme.fontFamily.sans],
                display: ["Excon", ...defaultTheme.fontFamily.sans]
            },
            colors: {
                border: "color-mix(in oklab, var(--border), transparent calc(100% - calc(<alpha-value> * 100%)))",
                input: "color-mix(in oklab, var(--input), transparent calc(100% - calc(<alpha-value> * 100%)))",
                ring: "color-mix(in oklab, var(--ring), transparent calc(100% - calc(<alpha-value> * 100%)))",
                background:
                    "color-mix(in oklab, var(--background), transparent calc(100% - calc(<alpha-value> * 100%)))",
                foreground:
                    "color-mix(in oklab, var(--foreground), transparent calc(100% - calc(<alpha-value> * 100%)))",
                primary: {
                    DEFAULT:
                        "color-mix(in oklab, var(--primary), transparent calc(100% - calc(<alpha-value> * 100%)))",
                    foreground:
                        "color-mix(in oklab,  var(--primary-foreground), transparent calc(100% - calc(<alpha-value> * 100%)))"
                },
                secondary: {
                    DEFAULT:
                        "color-mix(in oklab, var(--secondary), transparent calc(100% - calc(<alpha-value> * 100%)))",
                    foreground:
                        "color-mix(in oklab, var(--secondary-foreground), transparent calc(100% - calc(<alpha-value> * 100%)))"
                },
                destructive: {
                    DEFAULT:
                        "color-mix(in oklab, var(--destructive), transparent calc(100% - calc(<alpha-value> * 100%)))",
                    foreground:
                        "color-mix(in oklab, var(--destructive-foreground), transparent calc(100% - calc(<alpha-value> * 100%)))"
                },
                muted: {
                    DEFAULT:
                        "color-mix(in oklab, var(--muted), transparent calc(100% - calc(<alpha-value> * 100%)))",
                    foreground:
                        "color-mix(in oklab, var(--muted-foreground), transparent calc(100% - calc(<alpha-value> * 100%)))"
                },
                accent: {
                    DEFAULT:
                        "color-mix(in oklab, var(--accent), transparent calc(100% - calc(<alpha-value> * 100%)))",
                    foreground:
                        "color-mix(in oklab, var(--accent-foreground), transparent calc(100% - calc(<alpha-value> * 100%)))"
                },
                popover: {
                    DEFAULT:
                        "color-mix(in oklab, var(--popover), transparent calc(100% - calc(<alpha-value> * 100%)))",
                    foreground:
                        "color-mix(in oklab, var(--popover-foreground), transparent calc(100% - calc(<alpha-value> * 100%)))"
                },
                card: {
                    DEFAULT:
                        "color-mix(in oklab, var(--card), transparent calc(100% - calc(<alpha-value> * 100%)))",
                    foreground:
                        "color-mix(in oklab, var(--card-foreground), transparent calc(100% - calc(<alpha-value> * 100%)))"
                }
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)"
            }
        }
    },
    plugins: [typography(), tailwindcssAnimate]
} satisfies Config;
