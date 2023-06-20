import type { EdgeConfig } from "@sveltejs/adapter-vercel";
import type { Post } from "$lib/types";

export const config: EdgeConfig = {
    runtime: "edge"
};

export async function load({ fetch }) {
    const tmRefreshLeaderboardDownloads = fetch("https://openplanet.dev/api/plugin/229", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "User-Agent": "nilsbeerten.nl/1.0 (https://github.com/nbeerten/nilsbeerten.nl)"
        }
    }).then(
        (res) =>
            res.json() as Promise<
                Record<string, unknown> & {
                    downloads: number;
                }
            >
    );

    const posts: Promise<Post[]> = fetch("/api/posts").then((res) => res.json());

    return {
        streamed: {
            tmRefreshLeaderboardDownloads,
            posts
        }
    };
}
