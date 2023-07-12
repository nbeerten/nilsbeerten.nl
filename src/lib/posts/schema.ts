import { z } from "zod";

export const postSchema = z.object({
    title: z.string(),
    description: z.string().max(160),
    date: z
        .string()
        .regex(
            /[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}\s[0-9]{2}:[0-9]{2}/gm,
            "Date for post must be in format YYYY-MM-DD HH:mm"
        ),
    categories: z.array(z.string()),
    published: z.boolean(),
    slug: z
        .string()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/gm)
        .optional(),
});

export type Post = z.infer<typeof postSchema>;
