import { error } from "@sveltejs/kit";
import type { Post } from "$lib/types";
import type { SvelteComponent } from "svelte";

export async function load({ params }) {
    try {
        const post = (await import(`../../../content/${params.slug}.svx`)) as {
            default: typeof SvelteComponent;
            metadata: Omit<Post, "slug">;
        };

        if (!post.metadata.published) {
            throw Error("Not published");
        }

        return {
            content: post.default,
            meta: post.metadata
        };
    } catch (e) {
        throw error(404, `Could not find ${params.slug}`);
    }
}
