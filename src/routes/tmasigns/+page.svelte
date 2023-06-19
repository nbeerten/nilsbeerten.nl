<script lang="ts">
    import { SocialLinks } from "$lib/components";
</script>

<svelte:head>
    <title>TMA Signs - Nils Beerten</title>
    <meta name="robots" content="noindex none noarchive noimageindex" />
</svelte:head>

<div class="max-h-max py-20">
    <div class="flex justify-between gap-8">
        <div class="flex max-w-[50ch] flex-col gap-4">
            <h1 class="text-5xl font-extrabold sm:text-7xl">
                <span class="text-4xl text-stone-500 dark:text-stone-400 sm:text-6xl"
                    >This tool has been</span
                ><br />shut down.
            </h1>
            <div class="flex flex-col gap-2">
                <p class="prose text-lg font-medium text-stone-950 dark:text-stone-200">
                    This new website is no longer hosted on a platform that supports PHP and
                    especially PHP's Imagick, which was used to generate the signs. Because of that,
                    this tool has been shut down. If you absolutely need a text sign, you can
                    contact me and I'll be able to generate them manually.
                </p>
                <SocialLinks />
            </div>
        </div>
        <div class="hidden aspect-square max-h-full min-h-0 w-52 lg:flex">
            <img
                src="/logo_white.svg"
                alt="Logo"
                class="h-50 w-50 pointer-events-none max-h-full min-h-0 min-w-0 max-w-full select-none object-contain invert filter dark:filter-none"
            />
        </div>
    </div>
</div>
