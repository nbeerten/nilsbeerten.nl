import { generateWavyCirclePath, NB_MONOGRAM_PATH } from "../lib/logo";

export function GET({ request }: { request: Request }) {
    const { searchParams } = new URL(request.url);
    const round: boolean = typeof searchParams.get("round") === "string";
    const inverse: boolean = typeof searchParams.get("inverse") === "string";
    const amplitude: number = parseFloat(searchParams.get("amplitude") ?? "6.5") || 6.5;
    const waves: number = parseInt(searchParams.get("waves") ?? "12") || 12;
    const radius: number = parseFloat(searchParams.get("radius") ?? "225") || 225;
    const innerScale: number = parseFloat(searchParams.get("innerScale") ?? "1.0") || 1.0;

    const customBg = searchParams.get("bgColor");
    const customCircle = searchParams.get("circleColor");
    const customInner = searchParams.get("innerColor");

    const path = generateWavyCirclePath(256, 256, radius, waves, amplitude);
    const monogramTransform =
        innerScale === 1.0
            ? "translate(0, -10)"
            : `translate(256, 246) scale(${innerScale.toFixed(4)}) translate(-256, -256)`;

    let output: string;

    if (customBg || customCircle || customInner) {
        const bg = customBg ?? (inverse ? "#111110" : "#ffe7b3");
        const circle = customCircle ?? (inverse ? "#ffe7b3" : "#111110");
        const inner = customInner ?? bg;

        output = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <g stroke-linecap="round" fill-rule="evenodd">
            <rect width="512" height="512" rx="${round ? "512" : "0"}" ry="${round ? "512" : "0"}" fill="${bg}" />
            <path fill="${circle}" d="${path}" />
            <path fill="${inner}" transform="${monogramTransform}" d="${NB_MONOGRAM_PATH}" />
        </g>
    </svg>`;
    } else {
        output = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <g stroke-linecap="round" fill-rule="evenodd">
            <rect class="accent" width="512" height="512" rx="${round ? "512" : "0"}" ry="${round ? "512" : "0"}" />
            <path class="background" d="${path}" />
            <path class="accent" transform="${monogramTransform}" d="${NB_MONOGRAM_PATH}" />
        </g>
        <style>
            .accent {
                fill: ${inverse ? "#111110" : "#ffe7b3"};
            }
            .background {
                fill: ${inverse ? "#ffe7b3" : "#111110"};
            }

            @media (prefers-color-scheme: light) {
                .accent {
                    fill: ${inverse ? "#fefdfb" : "#111110"};
                }
                .background {
                    fill: ${inverse ? "#111110" : "#fefdfb"};
                }
            }
        </style>
    </svg>`;
    }

    return new Response(output, {
        headers: {
            "Content-Type": "image/svg+xml",
        },
    });
}
