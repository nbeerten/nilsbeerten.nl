<script lang="ts">
    export let title: string;
</script>

<div class="topography flex h-full items-center px-16 pb-16 text-white">
    <!-- mt-16 = space for nav -->
    <div class="flex items-center">
        <div class="flex max-h-max py-20">
            <div class="flex w-full justify-between gap-8">
                <div class="flex max-w-[50ch] flex-col gap-4">
                    <h1 class="flex flex-col text-7xl font-extrabold">
                        {#if title}
                            <span>{title}</span>
                            <span class="text-6xl text-stone-600">nilsbeerten.nl</span>
                        {:else}
                            <span class="text-stone-400">Hey, I’m</span>
                            <span>Nils Beerten</span>
                        {/if}
                    </h1>
                </div>
                <div class="flex max-h-full min-h-0 w-52">
                    <img
                        src="https://beta.nilsbeerten.nl/logo_white.svg"
                        alt="Logo"
                        class="h-50 w-50 pointer-events-none max-h-full min-h-0 min-w-0 max-w-full select-none object-contain filter-none"
                    />
                </div>
            </div>
        </div>
    </div>
</div>

<style lang="postcss">
    .topography {
        background-color: theme(colors.stone.950);
        background-image: url(https://nilsbeerten.nl/topography.svg);
    }
</style>
