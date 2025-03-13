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

        file.data.astro.frontmatter.readingTime = readingTime.minutes;
    };
