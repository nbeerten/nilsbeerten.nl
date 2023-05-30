<script lang="ts">
    export let title: string;
</script>

<div class="px-16 pb-16 topography flex items-center h-full text-white">
    <!-- mt-16 = space for nav -->
    <div class="flex items-center">
        <div class="max-h-max py-20 flex">
            <div class="flex gap-8 justify-between w-full">
                <div class="max-w-[50ch] flex flex-col gap-4">
                    <h1 class="flex flex-col text-5xl sm:text-7xl font-extrabold">
                        {#if title}
                            <span class="text-stone-500 dark:text-stone-400">nilsbeerten.nl</span>
                            <span>{title}</span>
                        {:else}
                            <span class="text-stone-500 dark:text-stone-400">Hey, I’m</span>
                            <span>Nils Beerten</span>
                        {/if}
                    </h1>
                </div>
                <div class="min-h-0 max-h-full w-52 flex">
                    <img
                        src="https://beta.nilsbeerten.nl/logo_white.svg"
                        alt="Logo"
                        class="filter invert dark:filter-none select-none pointer-events-none min-h-0 min-w-0 h-50 w-50 max-h-full max-w-full object-contain"
                    />
                </div>
            </div>
        </div>
    </div>
</div>

<style lang="postcss">
    .topography {
        background-color: theme(colors.stone.950);
        background-image: linear-gradient(
                180deg,
                theme(colors.transparent) 50%,
                theme(colors.stone.950) 100%
            ),
            url("https://beta.nilsbeerten.nl/topography.svg");
    }
</style>
