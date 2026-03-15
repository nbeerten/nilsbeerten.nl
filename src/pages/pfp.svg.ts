export function GET({ request }: { request: Request }) {
    const { searchParams } = new URL(request.url);
    const round: boolean = typeof searchParams.get("round") === "string";
    const inverse: boolean = typeof searchParams.get("inverse") === "string";

    /**
     * Generates an SVG path string for a wavy circle using the same
     * derivative-based cubic Bézier approach as generateSineWavePath.
     *
     * @param cx         - Centre x of the circle in px
     * @param cy         - Centre y of the circle in px
     * @param radius     - Base radius of the circle in px
     * @param waves      - Number of full waves around the circle
     * @param amplitude  - Peak deviation from the base radius in px
     * @param segments   - Cubic Bézier segments per wave (≥4 recommended)
     * @returns SVG path `d` attribute value
     */
    function generateWavyCirclePath(
        cx: number,
        cy: number,
        radius: number,
        waves: number,
        amplitude: number,
        segments: number = 8
    ): string {
        const totalSegments = waves * segments;
        const angleStep = (2 * Math.PI) / totalSegments;

        // Radius at a given angle: base radius + sine wave oscillating `waves` times per revolution
        const r = (angle: number): number => radius + amplitude * Math.cos(waves * angle);

        // Derivative of r with respect to angle
        const dr = (angle: number): number => -amplitude * waves * Math.sin(waves * angle);

        // Cartesian position at a given angle
        const point = (angle: number): [number, number] => [
            cx + r(angle) * Math.cos(angle),
            cy + r(angle) * Math.sin(angle),
        ];

        // Tangent direction at a given angle (derivative of point w.r.t. angle)
        const tangent = (angle: number): [number, number] => {
            const rVal = r(angle);
            const drVal = dr(angle);
            // d/dθ of (r·cosθ, r·sinθ) = (dr·cosθ - r·sinθ, dr·sinθ + r·cosθ)
            return [
                drVal * Math.cos(angle) - rVal * Math.sin(angle),
                drVal * Math.sin(angle) + rVal * Math.cos(angle),
            ];
        };

        // Control point distance: one third of the arc length of each segment
        const cpScale = angleStep / 3;

        const [startX, startY] = point(0);
        let d = `M ${startX.toFixed(3)},${startY.toFixed(3)}`;

        for (let i = 0; i < totalSegments; i++) {
            const a0 = i * angleStep;
            const a1 = (i + 1) * angleStep;

            const [x0, y0] = point(a0);
            const [x1, y1] = point(a1);
            const [tx0, ty0] = tangent(a0);
            const [tx1, ty1] = tangent(a1);

            // Forward control point from a0, backward control point into a1
            const cp1x = x0 + tx0 * cpScale;
            const cp1y = y0 + ty0 * cpScale;
            const cp2x = x1 - tx1 * cpScale;
            const cp2y = y1 - ty1 * cpScale;

            d += ` C ${cp1x.toFixed(3)},${cp1y.toFixed(3)} ${cp2x.toFixed(3)},${cp2y.toFixed(3)} ${x1.toFixed(3)},${y1.toFixed(3)}`;
        }

        return d + " Z";
    }

    const path = generateWavyCirclePath(256, 256, 225, 12, 6.5);

    const output = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <g stroke-linecap="round" fill-rule="evenodd">
            <rect class="accent" width="512" height="512" rx="${round ? "512" : "0"}" ry="${round ? "512" : "0"}" />
            <path class="background" d="${path}" />
            <path class="accent" transform="translate(0, -10)" d="m145 281.5v68.1h-31.2v-126.5h28.9l2.6 16.4q5.9-9.5 16.6-14.8 10.8-5.4 23.8-5.4 23.6 0 35.8 13.8 12.3 13.8 12.3 38.7v77.8h-31.2v-70.4q0-15.6-7-23.6-7-7.9-19.6-7.9-14.3 0-22.7 9.2-8.3 9.2-8.3 24.6zm150.5 48.4-2 19.7h-28.9v-190.5h31.2v82.4q6.1-10.5 18-16.5 11.9-6 26.2-6 26.6 0 42.4 18.8 15.7 18.8 15.7 49.3 0 29.4-16.5 47.6-16.5 18.2-43.6 18.2-14.3 0-25.6-6.1-11.3-6.1-16.9-16.9zm10.2-71.9q9.7-10.8 25.9-10.8 16.1 0 25.6 10.8 9.5 10.8 9.5 27.9 0 17.2-9.3 27.8-9.3 10.6-25.7 10.6-16.1 0-25.9-10.6-9.7-10.6-9.7-27.8 0-17.2 9.7-27.9z" />
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

    return new Response(output, {
        headers: {
            "Content-Type": "image/svg+xml",
        },
    });
}
