import { getUrlWithoutLocale } from "astro-i18n-aut";

type Route = {
    label: string;
    path: string;
};

export function createNavigation(routes: Route[], currentUrl: string | URL) {
    const normalizedCurrentPath = getUrlWithoutLocale(new URL(currentUrl).pathname);
    const processedRoute = routes.map((route) => {
        const normalizedPath = getUrlWithoutLocale(route.path);
        return {
            ...route,
            active: normalizedPath === normalizedCurrentPath,
        };
    });

    return processedRoute;
}
