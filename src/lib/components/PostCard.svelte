<script lang="ts">
    import { browser } from "$app/environment";
    import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "$components/ui/card";
    import type { Post } from "$lib/posts/schema";

    export let post: Post;
</script>

<Card>
    <a href="/post/{post.slug}" class="contents">
        <CardHeader>
            <CardTitle tag="h3">
                {post.title}
            </CardTitle>
        </CardHeader>
        <CardContent>
            {post.description}
        </CardContent>
    </a>
    <CardFooter class="flex justify-between gap-2 text-muted-foreground">
        {#if browser}
            <span>{new Date(post.date).toLocaleDateString()}</span>
        {/if}

        <a href="/post/{post.slug}" class="hover:underline"> Read more </a>
    </CardFooter>
</Card>
