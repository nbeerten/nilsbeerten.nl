import * as iq from 'image-q';
import { encode as encodeFastPng } from 'fast-png';

/**
 * Encodes an RGBA pixel buffer into an indexed PNG-8 binary buffer.
 *
 * Uses image-q for optimal 256-color palette quantization and fast-png for PNG-8 (PLTE + tRNS) encoding.
 * Ensures transparent and semi-transparent palette entries are placed first to maintain tRNS specification alignment.
 */
export function encodePng8(
    width: number,
    height: number,
    rgbaBuffer: Uint8Array | Uint8ClampedArray
): Uint8Array {
    const rawData =
        rgbaBuffer instanceof Uint8Array
            ? rgbaBuffer
            : new Uint8Array(rgbaBuffer.buffer, rgbaBuffer.byteOffset, rgbaBuffer.byteLength);

    const inPointContainer = iq.utils.PointContainer.fromUint8Array(rawData, width, height);
    const paletteObj = iq.buildPaletteSync([inPointContainer], { colors: 256 });
    const points = paletteObj.getPointContainer().getPointArray();

    // Group non-opaque colors first so tRNS alpha ordering matches the palette prefix
    const nonOpaque: number[][] = [];
    const opaque: number[][] = [];
    for (const p of points) {
        if (p.a < 255) {
            nonOpaque.push([p.r, p.g, p.b, p.a]);
        } else {
            opaque.push([p.r, p.g, p.b, p.a]);
        }
    }
    const sortedPalette = [...nonOpaque, ...opaque];

    // Quick map lookup for 32-bit RGBA integer keys
    const colorToIndex = new Map<number, number>();
    for (let idx = 0; idx < sortedPalette.length; idx++) {
        const c = sortedPalette[idx];
        if (!c) continue;
        const c0 = c[0] ?? 0;
        const c1 = c[1] ?? 0;
        const c2 = c[2] ?? 0;
        const c3 = c[3] ?? 255;
        const key = ((c0 << 24) | (c1 << 16) | (c2 << 8) | c3) >>> 0;
        colorToIndex.set(key, idx);
    }

    // Apply palette quantization
    const outPointContainer = iq.applyPaletteSync(inPointContainer, paletteObj);
    const outArray = outPointContainer.toUint8Array();
    const indexedData = new Uint8Array(width * height);

    for (let i = 0; i < indexedData.length; i++) {
        const offset = i * 4;
        const r = outArray[offset] ?? 0;
        const g = outArray[offset + 1] ?? 0;
        const b = outArray[offset + 2] ?? 0;
        const a = outArray[offset + 3] ?? 255;
        const key = ((r << 24) | (g << 16) | (b << 8) | a) >>> 0;

        let idx = colorToIndex.get(key);
        if (idx === undefined) {
            let minDist = Infinity;
            idx = 0;
            for (let j = 0; j < sortedPalette.length; j++) {
                const c = sortedPalette[j];
                if (!c) continue;
                const c0 = c[0] ?? 0;
                const c1 = c[1] ?? 0;
                const c2 = c[2] ?? 0;
                const c3 = c[3] ?? 255;
                const dist =
                    (r - c0) ** 2 + (g - c1) ** 2 + (b - c2) ** 2 + (a - c3) ** 2;
                if (dist < minDist) {
                    minDist = dist;
                    idx = j;
                }
            }
        }
        indexedData[i] = idx;
    }

    const encoded = encodeFastPng({
        width,
        height,
        data: indexedData,
        depth: 8,
        channels: 1,
        palette: sortedPalette,
    });

    // Return a trimmed copy so that .buffer matches .byteLength exactly without trailing data after IEND
    return encoded.slice();
}
