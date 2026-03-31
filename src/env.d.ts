// src/env.d.ts
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
    setColorScheme: (scheme: "light" | "dark" | "auto") => void;
}

// Add the App namespace to declare local variables
declare namespace App {
    interface Locals {
        locale: "en" | "nl";
    }
}
