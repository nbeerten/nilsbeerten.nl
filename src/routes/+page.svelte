<script lang="ts">
    import { SocialLinks, RepoCard } from '$lib/components';
    import { page } from '$app/stores';
    import Typescript from '@inqling/svelte-icons/simple-icons/typescript.svelte';
    import Svelte from '@inqling/svelte-icons/simple-icons/svelte.svelte';
    import CodeBracketSquare from '@inqling/svelte-icons/heroicon-24-solid/code-bracket-square.svelte';
    import TailwindCSS from '@inqling/svelte-icons/simple-icons/tailwindcss.svelte';
    import Vercel from '@inqling/svelte-icons/simple-icons/vercel.svelte';
    import ArrowDownTray from '@inqling/svelte-icons/heroicon-20-solid/arrow-down-tray.svelte';

    export let data;
    const { tmRefreshLeaderboardDownloads } = data;
</script>

<svelte:head>
    <title>Nils Beerten</title>
    <meta
        name="description"
        content="Hey, I'm Nils Beerten. I enjoy coding and developing various projects as a hobby, particularly (full-stack) web applications and websites. Online, I typically go by the usernames nbeerten or nbert."
    />

    <meta property="og:title" content="Nils Beerten" />
    <meta
        property="og:description"
        content="Hey, I'm Nils Beerten. I enjoy coding and developing various projects as a hobby, particularly (full-stack) web applications and websites. Online, I typically go by the usernames nbeerten or nbert."
    />
    <meta property="og:image" content="https://beta.nilsbeerten.nl/api/og" />
    <meta property="og:url" content={$page.url.toString()} />
</svelte:head>

<div class="max-w-[50ch] py-20 flex flex-col gap-4 relative">
    <h1 class="text-5xl sm:text-7xl font-extrabold">
        <span class="text-stone-500 dark:text-stone-400">Hey, I'm</span><br />Nils Beerten.
    </h1>
    <div class="flex flex-col gap-2">
        <p class="text-stone-950 dark:text-stone-200 font-medium text-lg prose">
            I enjoy coding and developing various projects as a hobby, particularly
            (full-stack) web applications and websites. Additionally, I sometimes code other
            stuff like a plugin for the game Trackmania. Online, I typically go by the
            usernames nbeerten or nbert.
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
                <span class="flex gap-2"><CodeBracketSquare class="h-5 w-5 scale-125" /></span>
            </svelte:fragment>
            <svelte:fragment slot="stats">
                <ArrowDownTray class="h-5 w-5 mb-1" /> {tmRefreshLeaderboardDownloads.downloads} downloads
            </svelte:fragment>
        </RepoCard>
    </div>
</section>
