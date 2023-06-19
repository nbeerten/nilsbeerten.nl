<script lang="ts">
    import { SocialLinks, RepoCard } from "$lib/components";
    import {
        Card,
        CardContent,
        CardFooter,
        CardHeader,
        CardTitle,
        CardDescription
    } from "$components/ui/card";
    import { Input } from "$components/ui/input";
    import { Label } from "$components/ui/label";
    import { Textarea } from "$components/ui/textarea";
    import { Button } from "$components/ui/button";
    import { Alert, AlertTitle } from "$components/ui/alert";
    import { page } from "$app/stores";
    import { Typescript, Svelte, Tailwindcss, Vercel } from "@inqling/svelte-icons/simple-icons";
    import { Download, CurlyBraces, Loader2 as Loader, Send } from "lucide-svelte";
    import { browser } from "$app/environment";
    import { Somerset, SocialProfileJsonLd } from "somerset";
    import { superForm } from "sveltekit-superforms/client";

    export let data;
    const { streamed } = data;

    $: domain = $page.url.hostname;

    const { form, errors, constraints, enhance, message } = superForm(data.contactForm, {
        clearOnSubmit: "errors-and-message",
        resetForm: true
    });
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
        <SocialLinks />
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
            <svelte:fragment slot="languages">
                <Typescript class="h-5 w-5" />
                <Svelte class="h-5 w-5" />
                <Tailwindcss class="h-5 w-5" />
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

<section class="my-4 flex flex-col gap-4 py-4">
    <h2 class="text-4xl font-bold">Posts</h2>

    <div class="grid w-full gap-4 lg:grid-cols-2">
        {#await streamed.posts}
            <Loader class="col-span-full animate-spin justify-self-center" />
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
                        <CardFooter class="flex justify-between gap-2 text-muted-foreground">
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

<section class="my-4 flex flex-col gap-4 py-4">
    <h2 class="text-4xl font-bold">Contact</h2>

    <div class="flex w-full flex-col justify-start gap-6 md:flex-row">
        <Card class="min-w-[26rem]">
            <CardHeader>
                <CardTitle tag="h3">Contact form</CardTitle>
                <CardDescription>
                    Send me a message and I'll get back to you as soon as possible.
                </CardDescription>
            </CardHeader>
            <CardContent class="mt-2 flex flex-col gap-2">
                <form method="POST" use:enhance class="flex flex-col gap-1">
                    <div>
                        <Label for="email">Your email</Label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="email@example.com"
                            bind:value={$form.email}
                            {...$constraints.email}
                        />
                        {#if $errors.email}<span class="text-sm text-destructive"
                                >{$errors.email}</span
                            >{/if}
                    </div>
                    <div>
                        <Label for="name">Your name</Label>
                        <Input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            bind:value={$form.name}
                            {...$constraints.name}
                        />
                        {#if $errors.name}<span class="invalid">{$errors.name}</span>{/if}
                    </div>
                    <div>
                        <Label for="subject">Subject</Label>
                        <Input
                            type="text"
                            id="subject"
                            name="subject"
                            placeholder="Subject"
                            bind:value={$form.subject}
                            {...$constraints.subject}
                        />
                        {#if $errors.subject}<span class="invalid">{$errors.subject}</span>{/if}
                    </div>
                    <div>
                        <Label for="message">Your message</Label>
                        <Textarea
                            id="message"
                            name="message"
                            placeholder="Your message here"
                            bind:value={$form.message}
                            {...$constraints.message}
                        />
                        {#if $errors.message}<span class="invalid">{$errors.message}</span>{/if}
                    </div>
                    <div class="hidden">
                        <Input
                            type="text"
                            id="honeypot"
                            name="honeypot"
                            bind:value={$form.honeypot}
                        />
                    </div>
                    <Button type="submit" class="flex items-center gap-2"
                        ><Send class="h-4 w-4" /> Submit</Button
                    >
                </form>

                {#if $message}
                    <Alert variant="success">
                        <Send class="h-4 w-4" />
                        <AlertTitle>{$message}</AlertTitle>
                    </Alert>
                {/if}
            </CardContent>
        </Card>

        <Card class="h-min">
            <CardHeader>
                <CardTitle tag="h3">Or contact me through my socials...</CardTitle>
                <CardDescription>
                    Send me a message and I'll get back to you as soon as possible.
                </CardDescription>
            </CardHeader>
            <CardContent class="mt-2 flex flex-col gap-2">
                <SocialLinks class="flex-col items-start gap-0" />
            </CardContent>
        </Card>
    </div>
</section>
