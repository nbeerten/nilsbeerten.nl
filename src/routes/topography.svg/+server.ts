import topography_light from "./topography_light.svg?raw";
import topography from "./topography.svg?raw";

export const prerender = true;

export async function GET() {
    const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
        <view id="dark" viewBox="0 0 600 600" />
        ${topography}
        <view id="light" viewBox="0 0 600 600" />
        ${topography_light}
    </svg>
    `.trim();

    return new Response(svg, {
        headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "public, max-age=31536000",
        },
    });
}
