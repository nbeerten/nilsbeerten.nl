import type { Post } from "$lib/types";
import { postSchema } from "$lib/posts/schema";

async function getPosts() {
    let posts: Post[] = [];

    const paths = import.meta.glob("/src/content/posts/*.svx", { eager: true });

    for (const path in paths) {
        const file = paths[path];
        const slug = path.split("/").at(-1)?.replace(".svx", "");

        if (file && typeof file === "object" && "metadata" in file && slug) {
            const result = postSchema.safeParse(file.metadata);
            if (!result.success) continue; // Skip invalid post, go to next loop iteration

            const post = { ...result.data, slug } satisfies Post;
            post.published && posts.push(post);
        }
    }

    posts = posts.sort(
        (first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
    );

    return posts;
}

export async function GET() {
    const posts = await getPosts();
    return new Response(JSON.stringify(posts, null, 4));
}
