export const NB_MONOGRAM_PATH =
    "m145 281.5v68.1h-31.2v-126.5h28.9l2.6 16.4q5.9-9.5 16.6-14.8 10.8-5.4 23.8-5.4 23.6 0 35.8 13.8 12.3 13.8 12.3 38.7v77.8h-31.2v-70.4q0-15.6-7-23.6-7-7.9-19.6-7.9-14.3 0-22.7 9.2-8.3 9.2-8.3 24.6zm150.5 48.4-2 19.7h-28.9v-190.5h31.2v82.4q6.1-10.5 18-16.5 11.9-6 26.2-6 26.6 0 42.4 18.8 15.7 18.8 15.7 49.3 0 29.4-16.5 47.6-16.5 18.2-43.6 18.2-14.3 0-25.6-6.1-11.3-6.1-16.9-16.9zm10.2-71.9q9.7-10.8 25.9-10.8 16.1 0 25.6 10.8 9.5 10.8 9.5 27.9 0 17.2-9.3 27.8-9.3 10.6-25.7 10.6-16.1 0-25.9-10.6-9.7-10.6-9.7-27.8 0-17.2 9.7-27.9z";

export interface LogoOptions {
    amplitude?: number;
    waves?: number;
    radius?: number;
    innerScale?: number;
    circleExport?: boolean;
    bgColor?: string;
    circleColor?: string;
    innerColor?: string;
    size?: number;
    responsive?: boolean;
}

export const DEFAULT_LOGO_OPTIONS: Required<Omit<LogoOptions, "responsive">> = {
    amplitude: 6.5,
    waves: 12,
    radius: 225,
    innerScale: 1.0,
    circleExport: false,
    bgColor: "#ffe7b3",
    circleColor: "#111110",
    innerColor: "#ffe7b3",
    size: 512,
};

/**
 * Generates an SVG path string for a wavy circle using the derivative-based
 * cubic Bézier approach.
 *
 * @param cx         - Centre x of the circle in px
 * @param cy         - Centre y of the circle in px
 * @param radius     - Base radius of the circle in px
 * @param waves      - Number of full waves around the circle
 * @param amplitude  - Peak deviation from the base radius in px
 * @param segments   - Cubic Bézier segments per wave (≥4 recommended)
 * @returns SVG path `d` attribute value
 */
export function generateWavyCirclePath(
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

        const cp1x = x0 + tx0 * cpScale;
        const cp1y = y0 + ty0 * cpScale;
        const cp2x = x1 - tx1 * cpScale;
        const cp2y = y1 - ty1 * cpScale;

        d += ` C ${cp1x.toFixed(3)},${cp1y.toFixed(3)} ${cp2x.toFixed(3)},${cp2y.toFixed(3)} ${x1.toFixed(3)},${y1.toFixed(3)}`;
    }

    return d + " Z";
}

export const PRIDE_GRADIENT_ELEMENT = `<linearGradient id="pride-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#e40303" />
            <stop offset="5%" stop-color="#ed3b00" />
            <stop offset="10%" stop-color="#f55a00" />
            <stop offset="15%" stop-color="#fb7400" />
            <stop offset="20%" stop-color="#ff8c00" />
            <stop offset="25%" stop-color="#ffa300" />
            <stop offset="30%" stop-color="#ffbb00" />
            <stop offset="35%" stop-color="#ffd400" />
            <stop offset="40%" stop-color="#ffed00" />
            <stop offset="45%" stop-color="#c5d300" />
            <stop offset="50%" stop-color="#8db813" />
            <stop offset="55%" stop-color="#559d20" />
            <stop offset="60%" stop-color="#008026" />
            <stop offset="65%" stop-color="#008864" />
            <stop offset="70%" stop-color="#0085a2" />
            <stop offset="75%" stop-color="#0072db" />
            <stop offset="80%" stop-color="#004dff" />
            <stop offset="85%" stop-color="#4d37e8" />
            <stop offset="90%" stop-color="#6425cb" />
            <stop offset="95%" stop-color="#7015aa" />
            <stop offset="100%" stop-color="#750787" />
        </linearGradient>`;

export const PRIDE_GRADIENT_DEFS = `<defs>
        ${PRIDE_GRADIENT_ELEMENT}
    </defs>`;

export const RADIAL_GRADIENT_ELEMENT = `<radialGradient id="radial-grad-blue" cx="100%" cy="65%" r="70%">
            <stop offset="0%" stop-color="#3386fe" stop-opacity="1" />
            <stop offset="50%" stop-color="#3386fe" stop-opacity="0.85" />
            <stop offset="100%" stop-color="#3386fe" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="radial-grad-green" cx="25%" cy="100%" r="65%">
            <stop offset="0%" stop-color="#13ba60" stop-opacity="1" />
            <stop offset="50%" stop-color="#13ba60" stop-opacity="0.85" />
            <stop offset="100%" stop-color="#13ba60" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="radial-grad-yellow" cx="0%" cy="40%" r="65%">
            <stop offset="0%" stop-color="#ffce10" stop-opacity="1" />
            <stop offset="50%" stop-color="#ffce10" stop-opacity="0.85" />
            <stop offset="100%" stop-color="#ffce10" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="radial-grad-red" cx="50%" cy="0%" r="65%">
            <stop offset="0%" stop-color="#fe4845" stop-opacity="1" />
            <stop offset="50%" stop-color="#fe4845" stop-opacity="0.85" />
            <stop offset="100%" stop-color="#fe4845" stop-opacity="0" />
        </radialGradient>
        <pattern id="radial-gradient" width="512" height="512" patternUnits="userSpaceOnUse">
            <rect width="512" height="512" fill="#202124" />
            <rect width="512" height="512" fill="url(#radial-grad-green)" />
            <rect width="512" height="512" fill="url(#radial-grad-blue)" />
            <rect width="512" height="512" fill="url(#radial-grad-yellow)" />
            <rect width="512" height="512" fill="url(#radial-grad-red)" />
        </pattern>
        <pattern id="google-gradient" width="512" height="512" patternUnits="userSpaceOnUse">
            <rect width="512" height="512" fill="url(#radial-gradient)" />
        </pattern>`;

export const GOOGLE_GRADIENT_ELEMENT = RADIAL_GRADIENT_ELEMENT;

export const RADIAL_GRADIENT_DEFS = `<defs>
        ${RADIAL_GRADIENT_ELEMENT}
    </defs>`;

export const GOOGLE_GRADIENT_DEFS = RADIAL_GRADIENT_DEFS;

/**
 * Generates the complete SVG markup for the logo.
 */
export function generateLogoSvg(options: LogoOptions = {}): string {
    const opts = { ...DEFAULT_LOGO_OPTIONS, ...options };
    const wavyPath = generateWavyCirclePath(256, 256, opts.radius, opts.waves, opts.amplitude);

    // At innerScale = 1: translate(256, 246) scale(1) translate(-256, -256) == translate(0, -10)
    const monogramTransform = `translate(256, 246) scale(${opts.innerScale.toFixed(4)}) translate(-256, -256)`;

    const widthAttr = opts.responsive ? "100%" : `${opts.size}`;
    const heightAttr = opts.responsive ? "100%" : `${opts.size}`;
    const styleAttr = opts.responsive ? ' style="width: 100%; height: 100%; display: block;"' : "";

    const isPrideBg = opts.bgColor === "pride";
    const isPrideInner = opts.innerColor === "pride";
    const isRadialBg =
        opts.bgColor === "radial" ||
        opts.bgColor === "radial-gradient" ||
        opts.bgColor === "google";
    const isRadialInner =
        opts.innerColor === "radial" ||
        opts.innerColor === "radial-gradient" ||
        opts.innerColor === "google";

    const bgFill = isPrideBg
        ? "url(#pride-gradient)"
        : isRadialBg
          ? "url(#radial-gradient)"
          : opts.bgColor;

    const innerFill = isPrideInner
        ? "url(#pride-gradient)"
        : isRadialInner
          ? "url(#radial-gradient)"
          : opts.innerColor;

    const needsPride = isPrideBg || isPrideInner;
    const needsRadial = isRadialBg || isRadialInner;
    const defsContent = [
        needsPride ? PRIDE_GRADIENT_ELEMENT : "",
        needsRadial ? RADIAL_GRADIENT_ELEMENT : "",
    ]
        .filter(Boolean)
        .join("\n        ");
    const defsBlock = defsContent ? `<defs>\n        ${defsContent}\n    </defs>` : "";

    return `<svg width="${widthAttr}" height="${heightAttr}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"${styleAttr}>
    ${defsBlock}
    <g stroke-linecap="round" fill-rule="evenodd">
        <rect width="512" height="512" rx="${opts.circleExport ? "512" : "0"}" ry="${opts.circleExport ? "512" : "0"}" fill="${bgFill}" />
        <path fill="${opts.circleColor}" d="${wavyPath}" />
        <path fill="${innerFill}" transform="${monogramTransform}" d="${NB_MONOGRAM_PATH}" />
    </g>
</svg>`;
}

export interface HSLColor {
    h: number;
    s: number;
    l: number;
}

/**
 * Converts a hex color string (#rgb or #rrggbb) to HSL values.
 */
export function hexToHsl(hex: string): HSLColor {
    let cleanHex = hex.replace("#", "").trim();
    if (cleanHex.length === 3) {
        cleanHex = cleanHex
            .split("")
            .map((c) => c + c)
            .join("");
    }
    if (cleanHex.length !== 6) {
        return { h: 0, s: 0, l: 0 };
    }

    const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / d + 2) / 6;
                break;
            case b:
                h = ((r - g) / d + 4) / 6;
                break;
        }
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    };
}

/**
 * Converts HSL values (h: 0-360, s: 0-100, l: 0-100) to hex string (#rrggbb).
 */
export function hslToHex(h: number, s: number, l: number): string {
    h = ((h % 360) + 360) % 360;
    const sNorm = Math.max(0, Math.min(100, s)) / 100;
    const lNorm = Math.max(0, Math.min(100, l)) / 100;

    const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = lNorm - c / 2;
    let r = 0,
        g = 0,
        b = 0;

    if (h >= 0 && h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (h >= 60 && h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (h >= 120 && h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (h >= 180 && h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (h >= 240 && h < 300) {
        r = x;
        g = 0;
        b = c;
    } else {
        r = c;
        g = 0;
        b = x;
    }

    const toHex = (n: number) => {
        const hex = Math.round((n + m) * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
