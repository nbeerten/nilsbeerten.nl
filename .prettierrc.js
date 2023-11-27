/** @type {import("prettier").Config} */
export default {
    plugins: ["prettier-plugin-astro"],
    overrides: [
        {
            files: "*.astro",
            options: {
                parser: "astro",
            },
        },
    ],

    useTabs: false,
    tabWidth: 4,
    singleQuote: false,
    trailingComma: "es5",
    semi: true,
    printWidth: 100,
    bracketSameLine: true,
    htmlWhitespaceSensitivity: "css",
};
