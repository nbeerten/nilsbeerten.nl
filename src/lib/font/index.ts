import { FontshareProvider } from "./providers/FontshareProvider";
import type { WebFontMeta, FontProviders, Provider } from "./types";

export type FinalFontObject = {
    css: string;
    preconnectUrl: string;
};

const Providers: Record<string, Provider> = {
    fontshare: FontshareProvider
};


export class Font {
    public fonts: WebFontMeta[] = [];

    public sources: Record<FontProviders, WebFontMeta[]>;

    private userAgentWoff2 = "'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'";

    public constructor(fonts: WebFontMeta[]) {
        this.fonts = fonts;
        this.sources = fonts.reduce((acc, font) => {
            acc[font.provider] = acc[font.provider] || [];
            acc[font.provider].push(font);
            return acc;
        }, Object.create(null));
    }

    public async get(): Promise<FinalFontObject[]> {
        const finalFonts: FinalFontObject[] = [];

        for (const provider_string in this.sources) {
            const provider = Providers[provider_string];
            if(!provider) {
                throw new Error(`Invalid font provider: ${provider_string}`);
            }
            const providerFonts = this.sources[provider_string as FontProviders];
            
            const cssUrl = provider.getCssUrl(providerFonts);

            const response = await fetch(cssUrl, {
                headers: {
                    'User-Agent': this.userAgentWoff2
                }
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch CSS: ${response.statusText} (${response.status}). URL: ${cssUrl}`);
            }
            const css = await response.text();

            finalFonts.push({
                css,
                preconnectUrl: provider.preconnectUrl,
            })
        }

        return finalFonts;
    }
}

export const range = (start: number, stop: number, step = 100) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step))