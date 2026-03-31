import { defineMiddleware } from "astro:middleware";
import { getLocale, getUrlWithoutLocale } from "./lib/i18n/index";

export const onRequest = defineMiddleware(async (context, next) => {
    const url = new URL(context.request.url);

    // 1. Check if the locale was already passed via header during the rewrite phase
    const headerLocale = context.request.headers.get("x-internal-locale");

    // 2. Extract locale from the header, falling back to parsing the original URL
    const locale = headerLocale || getLocale(url, "en");

    // 3. Assign the locale to Astro.locals for page-level access
    context.locals.locale = locale as "en" | "nl";

    // 4. If a non-default locale is in the URL AND we aren't already in the rewrite phase
    if (!headerLocale && locale !== "en" && url.pathname.startsWith(`/${locale}`)) {
        const fullUrlString = getUrlWithoutLocale(url);
        const rewriteUrl = new URL(fullUrlString);
        const localPath = rewriteUrl.pathname + rewriteUrl.search;

        // 5. Clone the request to change the URL while preserving headers/body
        const newRequest = new Request(new URL(localPath, url.origin), context.request);

        // 6. Inject the locale into the headers so the next phase remembers it
        newRequest.headers.set("x-internal-locale", locale);

        return context.rewrite(newRequest);
    }

    return next();
});
