<script lang="ts">
    import { browser } from "$app/environment";
    import * as Icon from "svelte-lucide";
    import { Somerset, ArticleJsonLd } from "somerset";
    import { page } from "$app/stores";

    $: domain = $page.url.hostname;

    export let data;
</script>

<Somerset
    title={data.meta.title}
    titleTemplate="%s - Nils Beerten"
    description={data.meta.description}
    openGraph={{
        title: data.meta.title + " - Nils Beerten",
        description: data.meta.description,
        images: [
            {
                url: `https://${domain}/api/og?title=${data.meta.title}`,
                alt: data.meta.title
            }
        ]
    }}
/>

<ArticleJsonLd
    type="BlogPosting"
    url={`${domain}/post/${data.meta.slug}`}
    title={data.meta.title}
    description={data.meta.description}
    images={[`${domain}/api/og?title=${data.meta.title}`]}
    authorName="Nils Beerten"
    datePublished={new Date(data.meta.date).toISOString()}
    isAccessibleForFree={true}
    keyOverride={undefined}
/>

<article class="flex flex-col gap-2 pt-16">
    <hgroup>
        <h1 class="font-display text-4xl font-extrabold sm:text-5xl">{data.meta.title}</h1>
        {#if browser}
            <p class="pt-2 font-medium text-muted-foreground">
                Published at {new Date(data.meta.date).toLocaleString("en-UK", {
                    timeStyle: "short",
                    dateStyle: "short"
                })}
            </p>
        {/if}
    </hgroup>

    <div class="flex gap-4">
        {#each data.meta.categories as category}
            <span class="flex items-center gap-2 rounded-full border bg-background px-4"
                ><Icon.Tag class="mt-px h-3 w-3" />{category}</span
            >
        {/each}
    </div>

    <div class="prose-lg prose-stone text-foreground dark:prose-invert">
        <svelte:component this={data.content} />
    </div>
</article>
