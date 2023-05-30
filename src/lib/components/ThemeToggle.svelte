<script lang="ts">
    import Sun from "@inqling/svelte-icons/heroicon-24-solid/sun.svelte";
    import Moon from "@inqling/svelte-icons/heroicon-24-solid/moon.svelte";
    import { onMount } from "svelte";

    // indicate if we're in dark mode or not
    let darkTheme: boolean;

    onMount(() => {
        // use the existence of the dark class on the html element for the initial value
        darkTheme = document.documentElement.classList.contains("dark");

        // listen for changes so we auto-adjust based on system settings
        const prefersDarkThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
        prefersDarkThemeQuery.addEventListener("change", handleChange);
    });

    function handleChange({ matches: prefersDarkTheme }: MediaQueryListEvent) {
        // only set if we haven't overridden the theme
        if (!localStorage.theme) {
            setTheme(prefersDarkTheme);
        }
    }

    function toggleTheme() {
        setTheme(!darkTheme);
    }

    function setTheme(value: boolean) {
        darkTheme = value;

        if (darkTheme) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        localStorage.theme = darkTheme ? "dark" : "light";

        // If the toggled-to theme matches the system defined theme, clear the local override
        // This effectively provides a way to override or revert to "automatic" setting mode
        if (window.matchMedia(`(prefers-color-scheme: ${localStorage.theme})`).matches) {
            localStorage.removeItem("theme");
        }
    }
</script>

<svelte:head>
    <script>
        if (
            localStorage.theme === "dark" ||
            (!localStorage.theme && window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    </script>
</svelte:head>

<!-- simple toggle version -->
<button
    class="px-2 py-1 {$$restProps['class']}"
    aria-label="Toggle theme"
    title="Toggle theme"
    on:click={toggleTheme}
>
    <Moon class="h-5 w-5 -mt-1 hidden dark:block" style={null} />
    <Sun class="h-5 w-5 -mt-1 dark:hidden" style={null} />
</button>
