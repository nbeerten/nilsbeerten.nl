import defaultTheme from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", ...defaultTheme.fontFamily.sans],
                display: ["Satoshi", ...defaultTheme.fontFamily.sans],
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
    ],
};
