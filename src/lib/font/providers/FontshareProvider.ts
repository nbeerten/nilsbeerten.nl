import type { Provider, FontProviders, WebFontMeta } from "../types";

export function createFontshareProvider(name: FontProviders, host: string): Provider {
    return {
        name,
        preconnectUrl: host === "https://api.fontshare.com" ? "https://cdn.fontshare.com" : host,
        getCssUrl(fonts: WebFontMeta[]) {
            const strings = fonts.map((f) => {
                let name = f.name.replace(/\s+/g, '-').toLocaleLowerCase();

                if (typeof f.weights === "string" && f.weights !== "variable") {
                    name += `@${f.weights}`;
                } else if (f.weights === "variable") {
                    name += `@${f.italic ? 2 : 1}`;
                } else if (f.weights?.length) {
                    name += `@${f.weights.flatMap(w => f.italic ? Number(w) + 1 : w).sort().join()}`;
                } else {
                    name += `@${f.italic ? 2 : 1}`
                }
                return `f[]=${name}`
            }).join('&')
            return `${host}/v2/css?${strings}&display=swap`
        },
    };
}

export const FontshareProvider = createFontshareProvider("fontshare", "https://api.fontshare.com");