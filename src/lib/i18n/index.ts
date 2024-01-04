import { getLocale } from "astro-i18n-aut";
import { getUrlWithoutLocale, getLocaleUrl } from "astro-i18n-aut";

export function createLocale(url: string | URL) {
    const locale = getLocale(url) as "en" | "nl";

    return {
        locale,
        str: createStrFunction(locale),
        getLocaleUrl: (url: string | URL, useLocale?: string) => getLocaleUrl(url, useLocale || locale),
        normalizedUrl: getUrlWithoutLocale(url),
    }
}

function createStrFunction(locale: string): (en: string, nl: string) => string;
function createStrFunction(locale: string): (en: HTMLElement, nl: HTMLElement) => HTMLElement;
function createStrFunction(locale: string): (en: string | HTMLElement, nl: string | HTMLElement) => any {
    return (en, nl) => {
        switch(locale) {
            case 'en':
                return en;
            case 'nl':
                return nl;
            default:
                return en;
        }
    }
}