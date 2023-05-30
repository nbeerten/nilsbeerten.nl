<script lang="ts">
    import { SocialLinks } from "$lib/components";
</script>

<svelte:head>
    <title>TMA Signs - Nils Beerten</title>
    <meta name="robots" content="noindex none noarchive noimageindex" />
</svelte:head>

<div class="max-h-max py-20">
    <div class="flex gap-8 justify-between">
        <div class="max-w-[50ch] flex flex-col gap-4">
            <h1 class="text-5xl sm:text-7xl font-extrabold">
                <span class="text-stone-500 dark:text-stone-400 text-4xl sm:text-6xl"
                    >This tool has been</span
                ><br />shut down.
            </h1>
            <div class="flex flex-col gap-2">
                <p class="text-stone-950 dark:text-stone-200 font-medium text-lg prose">
                    This new website is no longer hosted on a platform that supports PHP and
                    especially PHP's Imagick, which was used to generate the signs. Because of that,
                    this tool has been shut down. If you absolutely need a text sign, you can
                    contact me and I'll be able to generate them manually.
                </p>
                <SocialLinks />
            </div>
        </div>
        <div class="min-h-0 max-h-full w-52 aspect-square hidden lg:flex">
            <img
                src="/logo_white.svg"
                alt="Logo"
                class="filter invert dark:filter-none select-none pointer-events-none min-h-0 min-w-0 h-50 w-50 max-h-full max-w-full object-contain"
            />
        </div>
    </div>
</div>
