import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { html as toReactElement } from "satori-html";
import Og from "./Og.svelte";
import type { SvelteComponent } from "svelte";

const fontFile = await fetch("https://beta.nilsbeerten.nl/fonts/excon/Excon-Black.ttf");
const fontData: ArrayBuffer = await fontFile.arrayBuffer();

const height = 630;
const width = 1200;

function componentToMarkup(component: typeof SvelteComponent, props: Record<string, unknown> = {}) {
    const SvelteRenderedMarkup = (component as unknown as SvelteComponent).render(props);
    let htmlTemplate = `${SvelteRenderedMarkup.html}`;
    if (SvelteRenderedMarkup && SvelteRenderedMarkup.css && SvelteRenderedMarkup.css.code) {
        htmlTemplate = `${SvelteRenderedMarkup.html}<style>${SvelteRenderedMarkup.css.code}</style>`;
    }
    return htmlTemplate;
}

export async function GET({ url }) {
    const html = toReactElement(
        componentToMarkup(Og, {
            title: url.searchParams.get("title")
        })
    );
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
            "content-type": "image/png"
        }
    });
}
