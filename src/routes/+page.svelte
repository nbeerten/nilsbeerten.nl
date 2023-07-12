<script lang="ts">
    import { RepoCard, PostCard } from "$lib/components";
    import { socialLinks } from "$lib/components/SocialLinks.svelte";
    import Button from "$components/ui/button/Button.svelte";
    import { page } from "$app/stores";
    import { ExternalLink, Download, Loader2, Mail } from "svelte-lucide";
    import { Somerset, SocialProfileJsonLd } from "somerset";
    import { onMount } from "svelte";

    export let data;
    const { streamed } = data;

    $: domain = $page.url.hostname;

    $: emailAddress = "";

    onMount(() => {
        emailAddress = atob("Y29udGFjdEBuaWxzYmVlcnRlbi5ubA==");
    });
</script>

<Somerset
    title="Nils Beerten"
    titleTemplate="%s"
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

<div class="relative flex max-w-[50ch] flex-col gap-4 py-20">
    <h1 class="text-5xl font-extrabold sm:text-7xl">
        <span class="text-stone-500 dark:text-stone-400">Hey, I'm</span><br />Nils Beerten.
    </h1>
    <div class="flex flex-col gap-2">
        <p class="prose text-lg font-medium text-stone-950 dark:text-stone-200">
            I enjoy coding and developing various projects as a hobby, particularly (full-stack) web
            applications and websites. Additionally, I sometimes code other stuff like a plugin for
            the game Trackmania. Online, I typically go by the usernames nbeerten or nbert.
        </p>
        <!-- <SocialLinks /> -->
    </div>
</div>

<section class="my-4 flex flex-col gap-4 py-4">
    <h2 class="text-4xl font-bold">Things I've built</h2>

    <div class="grid gap-6 lg:grid-cols-2">
        <RepoCard username="nbeerten" repo="nilsbeerten.nl">
            <svelte:fragment slot="description">
                Repository of this website, which is made with SvelteKit and TailwindCSS, and is
                hosted on Vercel. It replaces my previous website, which was made using Laravel and
                was hosted on a VPS.
            </svelte:fragment>
            <svelte:fragment slot="stats">
                <div class="flex w-full justify-end">
                    <a
                        href="https://www.nilsbeerten.nl/"
                        target="_blank"
                        rel="noreferrer"
                        class="flex items-center gap-1 hover:underline"
                    >
                        Visit <ExternalLink class="h-4 w-4" />
                    </a>
                </div>
            </svelte:fragment>
        </RepoCard>
        <RepoCard username="nbeerten" repo="tm-refresh-leaderboard">
            <svelte:fragment slot="description">
                A plugin for Openplanet, a 3rd party alternative scripting platform for the game
                Trackmania. It allows players to refresh the leaderboard at the click of a button
                and is styled to fit in with the game's UI.
            </svelte:fragment>
            <svelte:fragment slot="stats">
                <div class="flex items-center gap-2">
                    <Download class="h-5 w-5" />
                    {#await streamed.tmRefreshLeaderboardDownloads}
                        <Loader2 class="animate-spin" />
                    {:then data}
                        {data.downloads} downloads
                    {/await}
                </div>
                <div>
                    <a
                        href="https://openplanet.dev/plugin/229"
                        target="_blank"
                        rel="noreferrer"
                        class="flex items-center gap-1 hover:underline"
                    >
                        Visit <ExternalLink class="h-4 w-4" />
                    </a>
                </div>
            </svelte:fragment>
        </RepoCard>
    </div>
</section>

<section class="my-4 flex flex-col gap-4 py-4">
    <h2 class="text-4xl font-bold">Posts</h2>

    <div class="grid w-full gap-4 lg:grid-cols-2">
        {#await streamed.posts}
            <Loader2 class="col-span-full animate-spin justify-self-center" />
        {:then posts}
            {#if posts.length > 0}
                {#each posts as post}
                    <PostCard {post} />
                {/each}
            {:else}
                No posts found.
            {/if}
        {/await}
    </div>
</section>

<section class="my-4 flex flex-col gap-4 py-4">
    <hgroup>
        <h2 class="text-4xl font-bold">Contact</h2>
        <p class="text-sm text-muted-foreground">
            Send me a message and I'll get back to you as soon as possible.
        </p>
    </hgroup>

    <div class="flex w-full flex-col justify-start gap-6 md:flex-row">
        <ul class="flex flex-col gap-1">
            <li data-nosnippet>
                <Button
                    href="mailto:{emailAddress}"
                    target="_blank"
                    rel="noreferrer"
                    class="grid grid-cols-[1fr,auto,1fr] gap-4"
                >
                    <Mail class="h-5 w-5" />
                    <span class="w-full text-center"
                        ><span class="hidden">not.the.correct.</span>{emailAddress.split("@")[0]}<span class="hidden">.email</span
                        >@{emailAddress.split("@")[1]}</span
                    >
                </Button>
            </li>
            {#each socialLinks as link}
                <li>
                    {#if link.url}
                        <Button
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            class="grid grid-cols-[1fr,auto,1fr] gap-4"
                            variant="secondary"
                        >
                            <svelte:component this={link.icon} class="h-5 w-5" />
                            {link.handle}
                        </Button>
                    {:else}
                        <Button variant="ghost" class="grid w-full grid-cols-[1fr,auto,1fr] gap-4">
                            <svelte:component this={link.icon} class="h-5 w-5" />
                            {link.handle}
                        </Button>
                    {/if}
                </li>
            {/each}
        </ul>
    </div>
</section>
