<script lang="ts">
    import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "$components/ui/card";
    import { GithubIcon } from "lucide-svelte";

    export let username = "nbeerten";
    export let repo = "nb";
    export let description: string | null = null;

    const baseGithubUrl = `//github.com`;
</script>

<Card>
    <a href="{baseGithubUrl}/{username}/{repo}" class="contents" target="_blank">
        <CardHeader>
            <CardTitle tag="h3" class="flex items-center gap-2">
                <GithubIcon class="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span class="truncate">
                    <a
                        href="{baseGithubUrl}/{username}"
                        target="_blank"
                        class="focus-visible:underline outline-none">{username}</a
                    >
                    <span class="text-stone-500 dark:text-stone-400">/</span>
                    <a
                        href="{baseGithubUrl}/{username}/{repo}"
                        target="_blank"
                        class="focus-visible:underline outline-none">{repo}</a
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
    </a>
    <CardFooter class="justify-between border-t pt-2 text-muted-foreground">
        <div class="flex items-center gap-3">
            <slot name="languages" />
        </div>
        <div class="flex items-center gap-2 h-[1lh]">
            <slot name="stats" />
        </div>
    </CardFooter>
</Card>
