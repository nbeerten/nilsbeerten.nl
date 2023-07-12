import { error } from "@sveltejs/kit";
import { getPost } from "$lib/posts/index";

export async function load({ params }) {
    const postresult = await getPost(params.slug);

    if (!postresult.success) throw error(postresult.code ?? 404, postresult.error);

    return postresult.data;
}
