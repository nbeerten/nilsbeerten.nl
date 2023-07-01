import { init } from "satori/wasm";
import initYoga from "yoga-wasm-web";
import { initWasm } from "@resvg/resvg-wasm";

let initialized = false;

if (!initialized) {
    const yoga = await initYoga(
        await fetch("https://unpkg.com/yoga-wasm-web/dist/yoga.wasm").then((res) =>
            res.arrayBuffer()
        )
    );
    init(yoga);
    await initWasm(
        await fetch("https://unpkg.com/@resvg/resvg-wasm/index_bg.wasm").then((res) =>
            res.arrayBuffer()
        )
    );
    initialized = true;
}

export async function handle({ event, resolve }) {
    const response = await resolve(event);
    return response;
}
