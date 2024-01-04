import { z, defineCollection } from "astro:content";

const blogCollection = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        date: z.date(),
        draft: z.boolean().optional().default(false),
        description: z.string().max(160),
        language: z.enum(["en", "nl"]),
    }),
});

export const collections = {
    blog: blogCollection,
};
