<script lang="ts">
    import { cn } from "$lib/utils";

    let className: string | undefined | null = undefined;
    export { className as class };
</script>

<div
    class={cn(
        "overflow-hidden rounded-lg border bg-card px-4 py-2 text-card-foreground shadow-sm",
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
