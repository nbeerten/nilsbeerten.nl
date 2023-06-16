<script lang="ts">
    import { browser } from "$app/environment";
    import { Tag } from "lucide-svelte";
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
                url: `${domain}/api/og?title=${data.meta.title}`,
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
        <h1 class="text-4xl sm:text-5xl font-extrabold font-display">{data.meta.title}</h1>
        {#if browser}
            <p class="font-medium pt-2">Published at {new Date(data.meta.date).toDateString()}</p>
        {/if}
    </hgroup>

    <div class="flex gap-4">
        {#each data.meta.categories as category}
            <span class="rounded-full bg-background border px-4 flex items-center gap-2"
                ><Tag class="h-3 w-3 mt-px" />{category}</span
            >
        {/each}
    </div>

    <div class="prose prose-stone dark:prose-invert">
        <svelte:component this={data.content} />
    </div>
</article>
