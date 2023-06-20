<script lang="ts">
    let className = "";
    export { className as class };
</script>

<script context="module" lang="ts">
    import { Twitter, Github, type IconProps } from "lucide-svelte";
    import Discord from "@inqling/svelte-icons/simple-icons/discord.svelte";
    import type { SvelteComponent } from "svelte";

    export const socialLinks: {
        icon: typeof SvelteComponent<IconProps>;
        url?: string;
        handle: string;
    }[] = [
        {
            icon: Twitter,
            url: "https://twitter.com/nbertn",
            handle: "nbertn"
        },
        {
            icon: Github,
            url: "https://github.com/nbeerten",
            handle: "nbeerten"
        },
        {
            icon: Discord,
            handle: "@nbeerten"
        }
    ];
</script>

<div class="-ml-2 flex gap-2 {className}" {...$$restProps}>
    {#each socialLinks as link}
        {#if link.url}
            <a
                href={link.url}
                target="_blank"
                rel="noreferer noopener"
                class="flex items-center justify-center gap-x-2 rounded-full bg-transparent px-2 py-1 text-foreground transition hover:bg-stone-900"
            >
                <svelte:component this={link.icon} class="aspect-square h-5 w-5" />
                <span class="mb-0.5">{link.handle}</span>
            </a>
        {:else}
            <span
                class="flex items-center justify-center gap-x-2 rounded-full bg-transparent px-2 py-1 text-foreground transition"
            >
                <svelte:component this={link.icon} class="aspect-square h-5 w-5" />
                <span class="mb-0.5">{link.handle}</span>
            </span>
        {/if}
    {/each}
</div>
