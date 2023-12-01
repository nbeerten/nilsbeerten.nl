export type FontProviders = 'fontshare';

export interface Provider {
    name: FontProviders
    preconnectUrl: string
    getCssUrl(fonts: WebFontMeta[]): string
}

export type WebFontMeta = {
    name: string
    weights?: (string | number)[] | "variable"
    italic?: boolean
    provider: "fontshare"
};