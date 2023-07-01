// import type { Metric } from "web-vitals";

// export type WebVitalsBody = {
//     dsn: string;
//     event_name: string;
//     href: string;
//     id: string;
//     page: string;
//     speed: string;
//     value: string;
// };

// interface MetricOption {
//     params: Record<string, string>;
//     url: URL;
// }

// export function webVitals() {
//     return {};
// }

// function getConnectionSpeed() {
//     if ("connection" in navigator && navigator["connection"]) {
//         const connection = navigator["connection"] as { effectiveType: string };
//         return connection.effectiveType || "";
//     }

//     return "";
// }

// export async function sendWebVitals(metric: Metric, options: MetricOption) {
//     const page = Object.entries(options.params).reduce(
//         (acc, [key, value]) => acc.replace(value, `[${key}]`),
//         options.url.pathname
//     );

//     const dsn = "VERCEL_ANALYTICS_ID" in import.meta.env ? import.meta.env.VERCEL_ANALYTICS_ID : "";

//     const vitalsUrl = "https://vitals.vercel-analytics.com/v1/vitals";

//     await fetch(vitalsUrl, {
//         body: JSON.stringify({
//             dsn: dsn,
//             event_name: metric.name,
//             href: options.url,
//             id: metric.id,
//             page: page,
//             speed: getConnectionSpeed(),
//             value: metric.value
//         }),
//         headers: {
//             Authorization: "Bearer <TOKEN>"
//         },
//         method: "POST"
//     });
//     return {};
// }
