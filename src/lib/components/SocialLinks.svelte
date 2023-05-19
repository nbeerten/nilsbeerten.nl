<script lang="ts">
    import Twitter from '@inqling/svelte-icons/simple-icons/twitter.svelte';
    import Youtube from '@inqling/svelte-icons/simple-icons/youtube.svelte';
    import Discord from '@inqling/svelte-icons/simple-icons/discord.svelte';
    import Github from '@inqling/svelte-icons/simple-icons/github.svelte';
    import type { ComponentType } from 'svelte';

    let className = '';
    export { className as class };

    let socialLinks: {
        icon: ComponentType;
        url: string;
    }[] = [
        {
            icon: Twitter,
            url: 'https://twitter.com/nbertn'
        },
        {
            icon: Github,
            url: 'https://github.com/nbeerten'
        }
    ];
</script>

<div class="flex gap-2 -ml-1 {className}" {...$$restProps}>
    {#each socialLinks as link}
        <a
            href={link.url}
            target="_blank"
            rel="noreferer noopener"
            class="transition bg-transparent px-1.5 py-1 rounded-full grid place-items-center aspect-square hover:scale-125 text-stone-800 dark:text-stone-50 hover:text-white hover:bg-stone-900"
        >
            <svelte:component this={link.icon} class="h-5 w-5" />
        </a>
    {/each}
</div>
