import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
    plugins: [sveltekit(), topLevelAwait()],
    define: {
        "import.meta.env.VERCEL_ANALYTICS_ID": JSON.stringify(process.env.VERCEL_ANALYTICS_ID)
    }
});
