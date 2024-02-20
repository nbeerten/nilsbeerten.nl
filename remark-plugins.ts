import { execSync } from "child_process";
import type { VFile } from "vfile";
import { toString } from "mdast-util-to-string";
import getReadingTime from "reading-time";

export const remarkModifiedTime =
    () =>
    (_: unknown, file: VFile & { data: { astro: { frontmatter: Record<string, unknown> } } }) => {
        const filepath = file.history[0];
        const result = execSync(`git log -1 --pretty="format:%cI" "${filepath}"`);
        file.data.astro.frontmatter.lastModified = result.toString();
    };

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
