<script lang="ts">
    import { cn } from "$lib/utils";

    let className: string | undefined | null = undefined;
    export { className as class };
</script>

<div
    class={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm px-4 py-2 overflow-hidden",
        className
    )}
    {...$$restProps}
    on:click
    on:focusin
    on:focusout
    on:mouseenter
    on:mouseleave
    role="none"
>
    <slot />
</div>
