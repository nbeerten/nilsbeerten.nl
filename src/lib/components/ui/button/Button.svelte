<script lang="ts">
    import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
    import { cn } from "$lib/utils";
    import { cva, type VariantProps } from "class-variance-authority";

    let className: string | undefined | null = undefined;
    export { className as class };
    export let href: HTMLAnchorAttributes["href"] = undefined;
    export let type: HTMLButtonAttributes["type"] = undefined;
    export let variant: VariantProps<typeof buttonVariants>["variant"] = "default";
    export let size: VariantProps<typeof buttonVariants>["size"] = "default";

    const buttonVariants = cva(
        "inline-flex items-center justify-center rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
        {
            variants: {
                variant: {
                    default: "bg-primary text-primary-foreground hover:bg-primary/90",
                    destructive:
                        "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
                    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                    ghost: "hover:bg-accent hover:text-accent-foreground",
                    link: "underline-offset-4 hover:underline text-primary"
                },
                size: {
                    default: "h-10 py-2 px-4",
                    sm: "h-9 px-3 rounded-md",
                    lg: "h-11 px-8 rounded-md"
                }
            },
            defaultVariants: {
                variant: "default",
                size: "default"
            }
        }
    );

    type Props = {
        class?: string | null;
        variant?: VariantProps<typeof buttonVariants>["variant"];
        size?: VariantProps<typeof buttonVariants>["size"];
    };

    interface AnchorElement extends Props, HTMLAnchorAttributes {
        href?: HTMLAnchorAttributes["href"];
        type?: never;
    }

    interface ButtonElement extends Props, HTMLButtonAttributes {
        type?: HTMLButtonAttributes["type"];
        href?: never;
    }

    type $$Props = AnchorElement | ButtonElement;
</script>

<svelte:element
    this={href ? "a" : "button"}
    type={href ? undefined : type}
    role="button"
    tabindex="0"
    {href}
    class={cn(buttonVariants({ variant, size, className }))}
    {...$$restProps}
    on:click
    on:change
    on:keydown
    on:keyup
    on:mouseenter
    on:mouseleave
>
    <slot />
</svelte:element>
