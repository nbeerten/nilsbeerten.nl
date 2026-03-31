function removeTrailingSlash(pathname: string): string {
    return pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

export function getLocale(url: string | URL, defaultLocale = "en"): string {
    const parsed = new URL(url, "http://localhost");
    const match = parsed.pathname.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)(\/|$)/);

    return match?.[1] ?? defaultLocale;
}

export function getUrlWithoutLocale(url: string | URL): string {
    const isRelative = typeof url === "string" && !url.startsWith("http");
    const parsed = new URL(url, "http://localhost");

    const localePattern = /^\/[a-z]{2}(-[A-Z]{2})?(\/|$)/;
    parsed.pathname = removeTrailingSlash(parsed.pathname.replace(localePattern, "/"));

    return isRelative ? parsed.pathname + parsed.search + parsed.hash : parsed.href;
}

export function getLocaleUrl(url: string | URL, locale: string, defaultLocale = "en"): string {
    if (locale === defaultLocale) return getUrlWithoutLocale(url);

    const isRelative = typeof url === "string" && !url.startsWith("http");

    // Base the new URL object on the already-stripped URL
    const parsed = new URL(getUrlWithoutLocale(url), "http://localhost");

    // Inject the locale into the pathname
    parsed.pathname = removeTrailingSlash(
        `/${locale}${parsed.pathname === "/" ? "" : parsed.pathname}`
    );

    return isRelative ? parsed.pathname + parsed.search + parsed.hash : parsed.href;
}

export function createLocale(url: string | URL, locale: "en" | "nl") {
    return {
        locale,
        str: <T>(en: T, nl: T): T => (locale === "nl" ? nl : en),
        getLocaleUrl: (url: string | URL, useLocale?: string) =>
            getLocaleUrl(url, useLocale || locale),
        normalizedUrl: getUrlWithoutLocale(url),
    };
}
