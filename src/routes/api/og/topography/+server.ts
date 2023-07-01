import satori from "satori/wasm";
import { Resvg } from "@resvg/resvg-wasm";
import { html as toReactElement } from "satori-html";
import Topography from "./Topography.svelte";
import type { SvelteComponent } from "svelte";
import type { EdgeConfig } from "@sveltejs/adapter-vercel";

export const config: EdgeConfig = {
    runtime: "edge"
};

const height = 630;
const width = 1200;

type ComponentType = typeof SvelteComponent & {
    render: (props: Record<string, unknown>) => { html: string; css: { code: string } };
};

function componentToMarkup(component: unknown, props: Record<string, unknown> = {}) {
    const SvelteRenderedMarkup = (component as unknown as ComponentType).render(props);
    let htmlTemplate = `${SvelteRenderedMarkup.html}`;
    if (SvelteRenderedMarkup && SvelteRenderedMarkup.css && SvelteRenderedMarkup.css.code) {
        htmlTemplate = `${SvelteRenderedMarkup.html}<style>${SvelteRenderedMarkup.css.code}</style>`;
    }
    return htmlTemplate;
}

export async function GET({ fetch }) {
    const fontFile = await fetch("/fonts/excon/Excon-Black.ttf");
    const fontData: ArrayBuffer = await fontFile.arrayBuffer();

    const html = toReactElement(componentToMarkup(Topography));

    const svg = await satori(html, {
        fonts: [
            {
                name: "Inter Latin",
                data: fontData,
                style: "normal"
            }
        ],
        height,
        width
    });

    const resvg = new Resvg(svg, {
        fitTo: {
            mode: "width",
            value: width
        }
    });

    const image = resvg.render();

    return new Response(image.asPng(), {
        headers: {
            "content-type": "image/png",
            "cache-control": "public, max-age=604800"
        }
    });
}
