import type { VFile } from "vfile";
import { toString } from "mdast-util-to-string";
import getReadingTime from "reading-time";

export const remarkTimeRead =
    () =>
    (
        tree: unknown,
        file: VFile & { data: { astro: { frontmatter: Record<string, unknown> } } }
    ) => {
        const textOnPage = toString(tree);
        const readingTime = getReadingTime(textOnPage);

        // Ensure reading time is at least 1 minute
        if (readingTime.minutes < 1) {
            readingTime.minutes = 1;
        }

        file.data.astro.frontmatter.readingTime = readingTime.minutes;
    };
