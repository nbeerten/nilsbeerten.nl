type Route = {
    label: string;
    path: string;
};

export function createNavigation(routes: Route[], currentUrl: string | URL) {
    const currentUrlObject = new URL(currentUrl);
    const processedRoute = routes.map((route) => {
        console.log(new URL("/blog", "https://nilsbeerten.nl/blog").pathname === currentUrlObject.pathname);
        return {
            ...route,
            active: new URL(route.path, currentUrl).pathname === currentUrlObject.pathname,
        };
    });

    return processedRoute;
}
