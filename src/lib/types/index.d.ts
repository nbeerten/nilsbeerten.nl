export type Post = {
    title: string;
    slug: string;
    description: string;
    date: string;
    categories: ("sveltekit" | "svelte")[];
    published: boolean;
};
