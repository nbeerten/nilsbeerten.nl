<script lang="ts">
    import ArrowTopRightOnSquare from '@inqling/svelte-icons/heroicon-24-solid/arrow-top-right-on-square.svelte';
    import Github from '@inqling/svelte-icons/simple-icons/github.svelte';

    export let username = 'nbeerten';
    export let repo = 'nb';
    export let description: string | null = null;

    const baseGithubUrl = `//github.com`;
</script>

<div
    class="flex flex-col gap-2 bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded px-4 py-2 justify-between overflow-hidden"
>
    <div class="flex flex-col">
        <a href="{baseGithubUrl}/{username}/{repo}" class="contents">
            <h3 class="font-semibold flex items-center gap-2 text-2xl">
                <Github class="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span class="truncate">
                    <a href="{baseGithubUrl}/{username}">{username}</a>
                    <span class="text-stone-500 dark:text-stone-400">/</span>
                    <span>{repo}</span>
                </span>
            </h3>
            {#if description}
            <p>{description}</p>
            {:else}
            <p><slot name="description" /></p>
            {/if}
        </a>
    </div>
    <div class="flex gap-4 justify-between border-t border-stone-300 dark:border-stone-700 pt-2">
        <div class="flex items-center gap-3 text-stone-800 dark:text-stone-400">
            <slot name="languages" />
        </div>
    </div>
</div>
