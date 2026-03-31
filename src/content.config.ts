import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
    loader: glob({ base: "./src/blog", pattern: "**/*.md" }),
    schema: z.object({
        title: z.string(),
        date: z.coerce.date(),
        draft: z.boolean().optional().default(false),
        description: z.string().max(160),
        language: z.enum(["en", "nl"]),
    }),
});

export const collections = {
    blog,
};
