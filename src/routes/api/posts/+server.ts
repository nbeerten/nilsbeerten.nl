import { getPosts } from "$lib/posts/index";
import { error } from "@sveltejs/kit";

export async function GET() {
    const posts = await getPosts();
    if (!posts.success) throw error(404, posts.error);

    return new Response(JSON.stringify(posts.data, null, 4));
}
