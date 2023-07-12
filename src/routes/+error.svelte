<script lang="ts">
    import { page } from "$app/stores";
    import { Somerset } from "somerset";
</script>

<Somerset
    title={$page.error?.message}
    titleTemplate="%s - Nils Beerten"
/>

{#if $page.error}
    <div class="max-h-max py-20">
        <div class="flex justify-between gap-8">
            <div class="flex flex-col gap-4">
                <h1 class="font-extrabold">
                    {#if $page.error.message.length < 50}
                    <span class="text-stone-500 dark:text-stone-400 text-5xl sm:text-6xl"
                        >{$page.error.message}</span>
                    {:else}
                    <span class="text-stone-500 dark:text-stone-400 text-base leading-0"
                        >Error(s): <span class="font-mono font-normal">{$page.error.message}</span></span>
                    {/if}
                    <br />
                    <span class="text-7xl">{$page.status}</span>
                </h1>
                <div class="flex flex-col gap-2">
                    <p class="text-lg font-medium text-stone-950 dark:text-stone-200">
                        <a href="/">Return to homepage</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
{/if}

<style lang="postcss">
    a {
        @apply underline;
    }
</style>
