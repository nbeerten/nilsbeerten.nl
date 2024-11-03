/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
    setColorScheme: (scheme: "light" | "dark" | "auto") => void;
}
