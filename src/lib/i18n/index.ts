export function getLocale(url: string | URL, defaultLocale = "en"): string {
    const pathname = url instanceof URL ? url.pathname : new URL(url, "http://localhost").pathname;

    const match = pathname.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)(\/|$)/);
    return match?.[1] ?? defaultLocale;
}

export function getUrlWithoutLocale(url: string | URL): string {
    const parsed = typeof url === "string" ? new URL(url, "http://localhost") : url;
    const localePattern = /^\/[a-z]{2}(-[A-Z]{2})?(\/|$)/;
    const stripped = parsed.pathname.replace(localePattern, "/");

    return typeof url === "string" && !url.startsWith("http")
        ? stripped + parsed.search + parsed.hash
        : parsed.origin + stripped + parsed.search + parsed.hash;
}

export function getLocaleUrl(url: string | URL, locale: string, defaultLocale = "en"): string {
    const withoutLocale = getUrlWithoutLocale(url);

    if (locale === defaultLocale) return withoutLocale;

    const isRelative = typeof url === "string" && !url.startsWith("http");

    if (isRelative) {
        return `/${locale}${withoutLocale === "/" ? "" : withoutLocale}`;
    }

    const parsed = url instanceof URL ? url : new URL(url);
    const newPath = `/${locale}${withoutLocale === "/" ? "" : new URL(withoutLocale, parsed.origin).pathname}`;
    return parsed.origin + newPath + parsed.search + parsed.hash;
}

export function createLocale(url: string | URL) {
    const locale = getLocale(url) as "en" | "nl";

    return {
        locale,
        str: createStrFunction(locale),
        getLocaleUrl: (url: string | URL, useLocale?: string) =>
            getLocaleUrl(url, useLocale || locale),
        normalizedUrl: getUrlWithoutLocale(url),
    };
}

function createStrFunction(locale: string): (en: string, nl: string) => string;
function createStrFunction(locale: string): (en: HTMLElement, nl: HTMLElement) => HTMLElement;
function createStrFunction(
    locale: string
): (en: string | HTMLElement, nl: string | HTMLElement) => any {
    return (en, nl) => {
        switch (locale) {
            case "en":
                return en;
            case "nl":
                return nl;
            default:
                return en;
        }
    };
}
