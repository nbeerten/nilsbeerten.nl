import type { VFile } from "vfile";
import { toString } from "mdast-util-to-string";
import getReadingTime from "reading-time";

export const remarkTimeRead = () => (tree: any, file: VFile) => {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);

    // Cast the data object internally to avoid narrowing the transformer signature
    const data = file.data as { astro: { frontmatter: Record<string, unknown> } };

    // Minimum of 1 minute
    if (readingTime.minutes < 1) {
        readingTime.minutes = 1;
    }

    // Astro automatically provides the frontmatter object, so we can assign directly
    data.astro.frontmatter.readingTime = readingTime.minutes;
};
