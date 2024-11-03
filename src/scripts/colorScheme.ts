// ColorSchemeManager.ts

class ColorSchemeManager {
    private static previousLabelTransitionTimeout: NodeJS.Timeout | number | null = null;

    static getStoredColorScheme(): "light" | "dark" | "auto" | null {
        return window.localStorage.getItem("color-scheme") as "light" | "dark" | "auto" | null;
    }

    static setStoredColorScheme(colorScheme: "light" | "dark" | "auto"): void {
        colorScheme === "auto"
            ? window.localStorage.removeItem("color-scheme")
            : window.localStorage.setItem("color-scheme", colorScheme);
    }

    static detectPrefersDarkScheme(): boolean {
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    static applyColorScheme(document: Document): void {
        const colorScheme = this.getStoredColorScheme();
        const prefersDarkScheme = colorScheme
            ? colorScheme === "dark"
            : this.detectPrefersDarkScheme();

        document.documentElement.classList.toggle("dark", prefersDarkScheme);
        document.documentElement.classList.toggle("light", !prefersDarkScheme);

        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            const backgroundColor = getComputedStyle(document.documentElement)
                .getPropertyValue("--brand-background")
                .trim();
            metaThemeColor.setAttribute("content", backgroundColor);
        }
    }

    static setColorScheme(colorScheme: "light" | "dark" | "auto"): void {
        this.setStoredColorScheme(colorScheme);
        this.applyColorScheme(document);
    }

    static initializeColorSchemeToggler(document: Document): void {
        const colorSchemeToggle = document.querySelector(".colorscheme-toggle") as HTMLDivElement;
        const currentColorScheme = this.getStoredColorScheme() || "auto";
        const colorSchemeInput = colorSchemeToggle?.querySelector(
            `input[value="${currentColorScheme}"]`
        ) as HTMLInputElement;

        if (colorSchemeInput) colorSchemeInput.checked = true;

        colorSchemeToggle?.addEventListener("change", (event) => {
            const selectedColorScheme = (event.target as HTMLInputElement).value;
            this.applyTransitionToLabels(document);
            this.setColorScheme(
                selectedColorScheme === "light" || selectedColorScheme === "dark"
                    ? selectedColorScheme
                    : "auto"
            );
        });
    }

    private static applyTransitionToLabels(document: Document): void {
        const transitionDuration = 0.2;
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (this.previousLabelTransitionTimeout) clearTimeout(this.previousLabelTransitionTimeout);

        if (prefersReducedMotion) return;

        document.querySelectorAll(".colorscheme-toggle > label").forEach((label) => {
            (label as HTMLLabelElement).style.transition = `all ${transitionDuration}s ease-in-out`;
        });

        this.previousLabelTransitionTimeout = setTimeout(() => {
            document.querySelectorAll(".colorscheme-toggle > label").forEach((label) => {
                (label as HTMLLabelElement).style.transition = "";
            });
            this.previousLabelTransitionTimeout = null;
        }, transitionDuration * 1000);
    }
}

// Export the ColorSchemeManager as default so it can be imported elsewhere
export default ColorSchemeManager;
