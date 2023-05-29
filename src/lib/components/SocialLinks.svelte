<script lang="ts">
    import Twitter from '@inqling/svelte-icons/simple-icons/twitter.svelte';
    import Github from '@inqling/svelte-icons/simple-icons/github.svelte';
    import type { ComponentType } from 'svelte';

    let className = '';
    export { className as class };

    let socialLinks: {
        icon: ComponentType;
        url: string;
        handle: string;
    }[] = [
        {
            icon: Twitter,
            url: 'https://twitter.com/nbertn',
            handle: 'nbertn'
        },
        {
            icon: Github,
            url: 'https://github.com/nbeerten',
            handle: 'nbeerten'
        }
    ];
</script>

<div class="flex gap-2 -ml-2 {className}" {...$$restProps}>
    {#each socialLinks as link}
        <a
            href={link.url}
            target="_blank"
            rel="noreferer noopener"
            class="transition bg-transparent px-2 py-1 rounded-full flex items-center justify-center gap-x-2 text-stone-800 dark:text-stone-50 hover:text-white hover:bg-stone-900"
        >
            <svelte:component this={link.icon} class="h-5 w-5 aspect-square" />
            <span class="mb-0.5">{link.handle}</span>
        </a>
    {/each}
</div>
