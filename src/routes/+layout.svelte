<script lang="ts">
    import "../app.css";
    import { Nav, Footer, ThemeToggle } from "$lib/components";

    import { dev } from "$app/environment";
    import { inject } from "@vercel/analytics";

    inject({ mode: dev ? "development" : "production" });
</script>

<svelte:head>
    <meta name="theme-color" content="#0c0a09" media="(prefers-color-scheme: dark)" />
    <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
</svelte:head>

<div
    class="flex min-h-screen flex-col justify-between overflow-x-hidden bg-white text-black dark:bg-stone-950 dark:text-stone-50"
>
    <Nav>
        <svelte:fragment slot="right">
            <ThemeToggle />
        </svelte:fragment>
    </Nav>
    <div class="topography">
        <!-- mt-16 = space for nav -->
        <div class="shell-max-w-center mt-16">
            <slot />
        </div>
    </div>

    <Footer />
</div>

<style lang="postcss">
    :global(h1, h2, h3, h4, h5, h6) {
        @apply font-display;
    }

    :global(.shell-max-w-center) {
        @apply mx-auto w-[80rem] max-w-full px-4 md:px-8;
    }

    :global(:root:is(.dark)) {
        color-scheme: dark;
    }

    .topography {
        background-image: linear-gradient(
                180deg,
                theme(colors.transparent) 50%,
                theme(colors.white) 100%
            ),
            url("/topography_light.svg");
        background-repeat: no-repeat, repeat-x;
        background-size: 100% 600px, 600px 600px;
        min-height: 600px;
    }

    :is(.dark .topography) {
        background-image: linear-gradient(
                180deg,
                theme(colors.transparent) 50%,
                theme(colors.stone.950) 100%
            ),
            url("/topography.svg");
    }
</style>
