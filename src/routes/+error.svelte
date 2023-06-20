<script lang="ts">
    import { page } from "$app/stores";
</script>

<svelte:head>
    <title>{$page.error?.message} - Nils Beerten</title>
</svelte:head>

<div class="max-h-max py-20">
    <div class="flex justify-between gap-8">
        <div class="flex flex-col gap-4">
            <h1 class="text-7xl font-extrabold">
                <span class="text-5xl text-stone-500 dark:text-stone-400 sm:text-6xl"
                    >{$page.error?.message}</span
                ><br />{$page.status}
            </h1>
            <div class="flex flex-col gap-2">
                <p class="text-lg font-medium text-stone-950 dark:text-stone-200">
                    <a href="/">Return to homepage</a>
                </p>
            </div>
        </div>
    </div>
</div>

<style lang="postcss">
    a {
        @apply underline;
    }
</style>
