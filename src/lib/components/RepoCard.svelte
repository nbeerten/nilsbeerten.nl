<script lang="ts">
    import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "$components/ui/card";
    import { GithubIcon } from "lucide-svelte";

    export let username = "nbeerten";
    export let repo = "nb";
    export let description: string | null = null;

    const baseGithubUrl = `//github.com`;
</script>

<Card>
    <CardHeader>
        <CardTitle tag="h3" class="flex items-center gap-2">
            <GithubIcon class="mt-0.5 h-5 w-5 flex-shrink-0" />
            <span class="truncate">
                <a
                    href="{baseGithubUrl}/{username}"
                    target="_blank"
                    class="outline-none hover:underline focus-visible:underline">{username}</a
                >
                <span class="text-stone-500 dark:text-stone-400">/</span>
                <a
                    href="{baseGithubUrl}/{username}/{repo}"
                    target="_blank"
                    class="outline-none hover:underline focus-visible:underline">{repo}</a
                >
            </span>
        </CardTitle>
    </CardHeader>
    <CardContent>
        {#if description}
            {description}
        {:else}
            <slot name="description" />
        {/if}
    </CardContent>
    <CardFooter class="h-[1lh] justify-between text-muted-foreground">
        <slot name="stats" />
    </CardFooter>
</Card>
