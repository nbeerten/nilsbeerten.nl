import { getCollection } from "astro:content";
import { OGImageRoute } from "astro-og-canvas";

const blogEntries = await getCollection("blog");
const blogPages = Object.fromEntries(blogEntries.map(({ slug, data }) => [`blog-${slug}`, data]));

export const { getStaticPaths, GET } = OGImageRoute({
    // Tell us the name of your dynamic route segment.
    // In this case it’s `route`, because the file is named `[...route].ts`.
    param: "route",

    // A collection of pages to generate images for.
    // The keys of this object are used to generate the path for that image.
    // In this example, we generate one image at `/open-graph/example.png`.
    pages: {
        home: {
            title: "nilsbeerten.nl",
            description: "Personal website of Nils Beerten, aka nbeerten, nbert.",
        },
        blog: {
            title: "Blog",
            description: "Description of this page shown in smaller text",
        },
        "404": {
            title: "404",
            description: "Page not found",
        },
        ...blogPages,
    },

    // For each page, this callback will be used to customize the OpenGraph image.
    getImageOptions: (_, page) => ({
        title: page.title,
        description: page.description,
        logo: {
            path: "./public/favicon.png",
            size: [200, 200],
        },
        bgGradient: [[0, 0, 0]],
        border: {
            /** RGB border color, e.g. `[0, 255, 0]`. */
            color: [255, 231, 179],
            /** Border width. Default: `0`. */
            width: 10,
            /** Side of the image to draw the border on. Inline start/end respects writing direction. */
            side: "inline-start",
        },
        font: {
            title: {
                color: [255, 231, 179],
                families: ["Satoshi"],
                weight: "Black",
                size: 90,
            },
            description: {
                color: [255, 231, 179],
                families: ["Inter"],
                weight: "Normal",
                size: 35,
            },
        },
        fonts: [
            "./src/pages/open-graph/Satoshi-Black.ttf",
            "./src/pages/open-graph/Inter-Regular.ttf",
        ],
        // There are a bunch more options you can use here!
    }),
});
