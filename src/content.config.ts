import { z, defineCollection } from "astro:content";
import { glob } from 'astro/loaders';

const blog = defineCollection({
    loader: glob({ pattern: '**\/*.md', base: "./src/blog" }),
    schema: z.object({
        title: z.string(),
        date: z.date(),
        draft: z.boolean().optional().default(false),
        description: z.string().max(160),
        language: z.enum(["en", "nl"]),
    }),
});

export const collections = {
    blog,
};
