import { error } from "@sveltejs/kit";
import { postSchema } from "$lib/posts/schema";

export async function load({ params }) {
    try {
        const post = await import(`../../../content/posts/${params.slug}.svx`);

        const postMetadata = postSchema.parse(post.metadata);

        if (!postMetadata.published) {
            throw Error("Not published");
        }

        return {
            content: post.default,
            meta: { ...postMetadata, slug: params.slug }
        };
    } catch (e) {
        throw error(404, `Could not find ${params.slug}`);
    }
}
