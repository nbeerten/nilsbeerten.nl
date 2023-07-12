import { postSchema, type Post } from "$lib/posts/schema";
import type { SvelteComponent } from "svelte";

type Result<T> =
    | {
          success: true;
          data: T;
      }
    | {
          success: false;
          error: string;
          code?: number;
      };

export async function getPost(
    slug: string
): Promise<Result<{ component: typeof SvelteComponent<Record<string, unknown>>; meta: Post }>> {
    try {
        const post = await import(`../../content/posts/${slug}.svx`);
        const postMetadata = postSchema.parse(post.metadata);
        if (!postMetadata.published) {
            return {
                success: false,
                error: "Not published",
                code: 404,
            };
        }
        return {
            success: true,
            data: {
                component: post.default,
                meta: { ...postMetadata, slug },
            },
        };
    } catch (e) {
        const err = e as Error;
        return {
            success: false,
            error: err.message ?? `Could not find "${slug}"`,
            code: 404,
        };
    }
}

export async function getPosts(): Promise<Result<Post[]>> {
    let posts: Post[] = [];

    try {
        const paths = import.meta.glob("/src/content/posts/*.svx", { eager: true });

        for (const path in paths) {
            const file = paths[path];
            const slug = path.split("/").at(-1)?.replace(".svx", "");

            if (file && typeof file === "object" && "metadata" in file && slug) {
                const result = postSchema.safeParse(file.metadata);
                if (!result.success)
                    throw Error(
                        `Post "${slug}" is invalid. Error(s): ${JSON.stringify(
                            result.error.issues.map((issue) => issue.message)
                        )}`
                    ); // Skip invalid post, go to next loop iteration

                const post = { ...result.data, slug } satisfies Post;
                post.published && posts.push(post);
            }
        }
    } catch (e) {
        const err = e as Error;
        return {
            success: false,
            error: err.message,
        };
    }

    posts = posts.sort(
        (first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
    );

    return {
        success: true,
        data: posts,
    };
}
