import type { ServerlessConfig } from "@sveltejs/adapter-vercel";

export const config: ServerlessConfig = {
    isr: {
        expiration: 60 * 60 * 24
    }
};

export async function load({ fetch }) {
    const tmRefreshLeaderboardDownloads = await fetch("https://openplanet.dev/api/plugin/229", {
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

    return {
        tmRefreshLeaderboardDownloads
    };
}
