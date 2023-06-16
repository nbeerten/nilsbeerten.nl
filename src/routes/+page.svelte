<script lang="ts">
    import { SocialLinks, RepoCard } from "$lib/components";
    import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "$components/ui/card";
    import { page } from "$app/stores";
    import Typescript from "@inqling/svelte-icons/simple-icons/typescript.svelte";
    import Svelte from "@inqling/svelte-icons/simple-icons/svelte.svelte";
    import TailwindCSS from "@inqling/svelte-icons/simple-icons/tailwindcss.svelte";
    import Vercel from "@inqling/svelte-icons/simple-icons/vercel.svelte";
    import { Download, CurlyBraces, Loader2 as Loader } from "lucide-svelte";
    import { browser } from "$app/environment";
    import { Somerset, SocialProfileJsonLd } from "somerset";

    export let data;
    const { streamed } = data;

    $: domain = $page.url.hostname;
</script>

<Somerset
    title="Nils Beerten"
    description="Hey, I'm Nils Beerten. I enjoy coding and developing various projects as a hobby, particularly (full-stack) web applications and websites. Online, I typically go by the usernames nbeerten or nbert."
    openGraph={{
        url: $page.url.toString(),
        title: "Nils Beerten",
        description:
            "Hey, I'm Nils Beerten. I enjoy coding and developing various projects as a hobby, particularly (full-stack) web applications and websites. Online, I typically go by the usernames nbeerten or nbert.",
        images: [
            {
                url: `https://${domain}/api/og`,
                alt: "Home - Nils Beerten"
            }
        ]
    }}
    twitter={{
        handle: "@nbertn",
        cardType: "summary_large_image"
    }}
/>

<SocialProfileJsonLd
    type="Person"
    name="Nils Beerten"
    url="https://nilsbeerten.nl"
    sameAs={[
        "https://twitter.com/nbeerten",
        "https://youtube.com/nbertn",
        "https://github.com/nbeerten",
        "https://twitch.tv/nbeerten"
    ]}
/>

<div class="max-w-[50ch] py-20 flex flex-col gap-4 relative">
    <h1 class="text-5xl sm:text-7xl font-extrabold">
        <span class="text-stone-500 dark:text-stone-400">Hey, I'm</span><br />Nils Beerten.
    </h1>
    <div class="flex flex-col gap-2">
        <p class="text-stone-950 dark:text-stone-200 font-medium text-lg prose">
            I enjoy coding and developing various projects as a hobby, particularly (full-stack) web
            applications and websites. Additionally, I sometimes code other stuff like a plugin for
            the game Trackmania. Online, I typically go by the usernames nbeerten or nbert.
        </p>
        <SocialLinks />
    </div>
</div>

<section class="flex flex-col gap-4 my-4 py-4">
    <h2 class="text-4xl font-bold">Things I've built</h2>

    <div class="grid gap-4 lg:grid-cols-2">
        <RepoCard username="nbeerten" repo="nilsbeerten.nl">
            <svelte:fragment slot="description">
                Repository of this website, which is made with SvelteKit and TailwindCSS, and is
                hosted on Vercel. It replaces my previous website, which was made using Laravel and
                was hosted on a VPS.
            </svelte:fragment>
            <svelte:fragment slot="languages">
                <Typescript class="h-5 w-5" />
                <Svelte class="h-5 w-5" />
                <TailwindCSS class="h-5 w-5" />
                <Vercel class="h-5 w-5" />
            </svelte:fragment>
        </RepoCard>

        <RepoCard username="nbeerten" repo="tm-refresh-leaderboard">
            <svelte:fragment slot="description">
                A plugin for Openplanet, a 3rd party alternative scripting platform for the game
                Trackmania. It allows players to refresh the leaderboard at the click of a button
                and is styled to fit in with the game's UI.
            </svelte:fragment>
            <svelte:fragment slot="languages">
                <span class="flex gap-2"><CurlyBraces class="h-5 w-5" /></span>
            </svelte:fragment>
            <svelte:fragment slot="stats">
                <Download class="h-5 w-5" />
                {#await streamed.tmRefreshLeaderboardDownloads}
                    <Loader class="animate-spin" />
                {:then data}
                    {data.downloads} downloads
                {/await}
            </svelte:fragment>
        </RepoCard>
    </div>
</section>

<section class="flex flex-col gap-4 my-4 py-4">
    <h2 class="text-4xl font-bold">Posts</h2>

    <div class="grid gap-4 lg:grid-cols-2 w-full">
        {#await streamed.posts}
            <Loader class="animate-spin justify-self-center col-span-full" />
        {:then posts}
            {#if posts.length > 0}
                {#each posts as post}
                    <Card>
                        <CardHeader>
                            <CardTitle tag="h3">
                                {post.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {post.description}
                        </CardContent>
                        <CardFooter class="flex gap-2 justify-between text-muted-foreground">
                            {#if browser}
                                <span>{new Date(post.date).toLocaleDateString()}</span>
                            {/if}

                            <a
                                href="/post/{post.slug}"
                                target="_blank"
                                rel="noreferrer"
                                class="underline"
                            >
                                Read more
                            </a>
                        </CardFooter>
                    </Card>
                {/each}
            {:else}
                No posts found.
            {/if}
        {/await}
    </div>
</section>
