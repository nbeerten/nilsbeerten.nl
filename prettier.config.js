/** @type {import("prettier").Options} */
const config = {
    useTabs: false,
    tabWidth: 4,
    singleQuote: false,
    trailingComma: "es5",
    semi: true,
    printWidth: 100,
    plugins: ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
    overrides: [{ files: "*.svelte", options: { parser: "svelte" } }],
};

export default config;
