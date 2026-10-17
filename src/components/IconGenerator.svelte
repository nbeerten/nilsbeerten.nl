<script lang="ts">
    import { DEFAULT_LOGO_OPTIONS, generateLogoSvg, hexToHsl, hslToHex } from "@lib/logo";
    import { encodePng8 } from "@lib/png8";

    interface Props {
        locale?: "en" | "nl";
    }

    let { locale = "en" }: Props = $props();
    const str = (en: string, nl: string) => (locale === "nl" ? nl : en);

    // 1. Geometry state & configs
    const geoConfigs = [
        {
            key: "waves",
            labelEn: "Waves",
            labelNl: "Golven",
            min: 3,
            max: 30,
            step: 1,
            unit: "",
        },
        {
            key: "amplitude",
            labelEn: "Amplitude",
            labelNl: "Amplitude",
            min: 0,
            max: 30,
            step: 0.5,
            unit: "",
        },
        {
            key: "radius",
            labelEn: "Radius",
            labelNl: "Straal",
            min: 150,
            max: 245,
            step: 1,
            unit: "",
        },
        {
            key: "innerScale",
            labelEn: "Monogram",
            labelNl: "Monogram",
            min: 40,
            max: 180,
            step: 1,
            unit: "%",
        },
    ] as const;

    type GeoKey = (typeof geoConfigs)[number]["key"];
    let geometry = $state<Record<GeoKey, number>>({
        waves: DEFAULT_LOGO_OPTIONS.waves,
        amplitude: DEFAULT_LOGO_OPTIONS.amplitude,
        radius: DEFAULT_LOGO_OPTIONS.radius,
        innerScale: 100,
    });

    // 2. Format & export state
    type ImageFormat = "png" | "png8" | "webp" | "jpg";
    type ImageSize = 128 | 512 | 1024 | 2048;

    let shape = $state<"square" | "circle">("square");
    let imageFormat = $state<ImageFormat>("png");
    let imageSize = $state<ImageSize>(1024);
    let copied = $state(false);

    // 3. Color target state class
    type ColorTarget = "bg" | "circle" | "inner";

    class ColorState {
        hex = $state("");
        h = $state(0);
        s = $state(0);
        l = $state(0);

        constructor(hex: string) {
            this.setHex(hex);
        }

        setHex(hex: string) {
            let val = hex.trim();
            if (!val.startsWith("#")) val = `#${val}`;
            if (/^#[0-9a-fA-F]{6}$/.test(val)) {
                this.hex = val;
                const hsl = hexToHsl(val);
                this.h = hsl.h;
                this.s = hsl.s;
                this.l = hsl.l;
            }
        }

        setHsl(h = this.h, s = this.s, l = this.l) {
            this.h = h;
            this.s = s;
            this.l = l;
            this.hex = hslToHex(h, s, l);
        }
    }

    const colors = {
        bg: new ColorState(DEFAULT_LOGO_OPTIONS.bgColor),
        circle: new ColorState(DEFAULT_LOGO_OPTIONS.circleColor),
        inner: new ColorState(DEFAULT_LOGO_OPTIONS.innerColor),
    };

    let matchMonogramWithBg = $state(true);
    let openDrawer = $state<ColorTarget | null>("bg");
    let bgMode = $state<"solid" | "pride" | "radial">("solid");

    let effectiveBgColor = $derived(bgMode !== "solid" ? bgMode : colors.bg.hex);

    let effectiveInnerColor = $derived(matchMonogramWithBg ? effectiveBgColor : colors.inner.hex);

    // 4. Reactive Preview SVG
    let previewSvg = $derived(
        generateLogoSvg({
            waves: geometry.waves,
            amplitude: geometry.amplitude,
            radius: geometry.radius,
            innerScale: geometry.innerScale / 100,
            bgColor: effectiveBgColor,
            circleColor: colors.circle.hex,
            innerColor: effectiveInnerColor,
            circleExport: false,
            responsive: true,
        })
    );

    function updateTargetHex(target: ColorTarget, hex: string) {
        if (target === "bg") bgMode = "solid";
        colors[target].setHex(hex);
        if (target === "inner") {
            matchMonogramWithBg = false;
        } else if (target === "bg" && matchMonogramWithBg) {
            colors.inner.setHex(colors.bg.hex);
        }
    }

    function updateTargetHsl(target: ColorTarget, h?: number, s?: number, l?: number) {
        if (target === "bg") bgMode = "solid";
        colors[target].setHsl(h, s, l);
        if (target === "inner") {
            matchMonogramWithBg = false;
        } else if (target === "bg" && matchMonogramWithBg) {
            colors.inner.setHex(colors.bg.hex);
        }
    }

    // 5. Presets & Actions
    const defaultGeometry = {
        waves: DEFAULT_LOGO_OPTIONS.waves,
        amplitude: DEFAULT_LOGO_OPTIONS.amplitude,
        radius: DEFAULT_LOGO_OPTIONS.radius,
        innerScale: 100,
    };

    const presets = [
        {
            id: "dark",
            labelEn: "dark",
            labelNl: "donker",
            bg: "#ffe7b3",
            circle: "#111110",
            inner: "#ffe7b3",
            geometry: { ...defaultGeometry },
        },
        {
            id: "light",
            labelEn: "light",
            labelNl: "licht",
            bg: "#111110",
            circle: "#fefdfb",
            inner: "#111110",
            geometry: { ...defaultGeometry },
        },
        {
            id: "red",
            labelEn: "red",
            labelNl: "rood",
            bg: "#e3000b",
            circle: "#fbf5ee",
            inner: "#e3000b",
            geometry: { ...defaultGeometry, radius: 210 },
        },
        {
            id: "blue",
            labelEn: "blue",
            labelNl: "blauw",
            bg: "#0078d4",
            circle: "#ffffff",
            inner: "#0078d4",
            geometry: { ...defaultGeometry, radius: 210 },
        },
        {
            id: "rainbow",
            labelEn: "rainbow",
            labelNl: "regenboog",
            bg: "pride",
            circle: "#111110",
            inner: "#ffffff",
            geometry: { ...defaultGeometry, radius: 210 },
        },
        {
            id: "christmas",
            labelEn: "christmas",
            labelNl: "kerst",
            bg: "#f8f5ee",
            circle: "#0e4a25",
            inner: "#f3c442",
            geometry: { ...defaultGeometry, radius: 210 },
        },
        {
            id: "eu",
            labelEn: "eu",
            labelNl: "eu",
            bg: "#ffcc00",
            circle: "#003399",
            inner: "#ffffff",
            geometry: { ...defaultGeometry, radius: 210 },
        },
        {
            id: "purple",
            labelEn: "purple",
            labelNl: "paars",
            bg: "#bb73ff",
            circle: "#111110",
            inner: "#bb73ff",
            geometry: { ...defaultGeometry, radius: 210 },
        },
        {
            id: "radial-gradient",
            labelEn: "radial gradient",
            labelNl: "radiaal verloop",
            bg: "radial",
            circle: "#202124",
            inner: "radial",
            geometry: { ...defaultGeometry, radius: 210 },
        },
        {
            id: "pastel-1",
            labelEn: "pastel 1",
            labelNl: "pastel 1",
            bg: "#ffddee",
            circle: "#00aa00",
            inner: "#ffddee",
            geometry: { ...defaultGeometry, radius: 210 },
        },
        {
            id: "pastel-2",
            labelEn: "pastel 2",
            labelNl: "pastel 2",
            bg: "#00aa00",
            circle: "#aaee77",
            inner: "#00aa00",
            geometry: { ...defaultGeometry, radius: 210 },
        },
    ];

    type Preset = (typeof presets)[number];

    let lastActivePreset = $state<Preset>(presets[0]);

    let activePreset = $derived.by(() => {
        const currentBg = bgMode !== "solid" ? bgMode : colors.bg.hex.toLowerCase();
        const currentCircle = colors.circle.hex.toLowerCase();
        const currentInner = effectiveInnerColor.toLowerCase();

        return (
            presets.find(
                (p) =>
                    p.bg.toLowerCase() === currentBg &&
                    p.circle.toLowerCase() === currentCircle &&
                    p.inner.toLowerCase() === currentInner &&
                    p.geometry.waves === geometry.waves &&
                    p.geometry.amplitude === geometry.amplitude &&
                    p.geometry.radius === geometry.radius &&
                    p.geometry.innerScale === geometry.innerScale
            ) ?? null
        );
    });

    let activePresetId = $derived(activePreset?.id ?? null);

    $effect(() => {
        if (activePreset) {
            lastActivePreset = activePreset;
        }
    });

    function applyPreset(p: Preset) {
        lastActivePreset = p;

        geometry.waves = p.geometry.waves;
        geometry.amplitude = p.geometry.amplitude;
        geometry.radius = p.geometry.radius;
        geometry.innerScale = p.geometry.innerScale;

        if (p.bg === "pride" || p.bg === "radial") {
            bgMode = p.bg;
            matchMonogramWithBg = p.bg === p.inner;
            colors.circle.setHex(p.circle);
            if (p.inner !== "pride" && p.inner !== "radial") {
                colors.inner.setHex(p.inner);
            }
        } else {
            bgMode = "solid";
            matchMonogramWithBg = p.bg === p.inner;
            colors.bg.setHex(p.bg);
            colors.circle.setHex(p.circle);
            colors.inner.setHex(p.inner);
        }
    }

    function resetGeometry(key: GeoKey) {
        geometry[key] = lastActivePreset.geometry[key];
    }

    function resetTargetColor(target: ColorTarget) {
        if (target === "bg") {
            if (lastActivePreset.bg === "pride" || lastActivePreset.bg === "radial") {
                bgMode = lastActivePreset.bg;
            } else {
                bgMode = "solid";
                colors.bg.setHex(lastActivePreset.bg);
                if (matchMonogramWithBg) {
                    colors.inner.setHex(lastActivePreset.bg);
                }
            }
        } else if (target === "circle") {
            colors.circle.setHex(lastActivePreset.circle);
        } else if (target === "inner") {
            const shouldMatch =
                lastActivePreset.bg === lastActivePreset.inner &&
                lastActivePreset.bg !== "pride" &&
                lastActivePreset.bg !== "radial";
            matchMonogramWithBg = shouldMatch;
            if (lastActivePreset.inner !== "pride" && lastActivePreset.inner !== "radial") {
                colors.inner.setHex(lastActivePreset.inner);
            }
        }
    }

    function invertColors() {
        if (bgMode === "pride" || bgMode === "radial") return;
        const oldBg = colors.bg.hex;
        const oldCircle = colors.circle.hex;
        colors.bg.setHex(oldCircle);
        colors.circle.setHex(oldBg);
        if (matchMonogramWithBg) colors.inner.setHex(oldCircle);
    }

    // 6. SVG / PNG Export helpers
    function getExportSvg(size?: number) {
        return generateLogoSvg({
            waves: geometry.waves,
            amplitude: geometry.amplitude,
            radius: geometry.radius,
            innerScale: geometry.innerScale / 100,
            bgColor: effectiveBgColor,
            circleColor: colors.circle.hex,
            innerColor: effectiveInnerColor,
            circleExport: shape === "circle",
            size,
            responsive: false,
        });
    }

    function triggerDownload(url: string, filename: string) {
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    function downloadSvg() {
        const blob = new Blob([getExportSvg()], { type: "image/svg+xml;charset=utf-8" });
        triggerDownload(URL.createObjectURL(blob), `nilsbeerten-logo-${shape}.svg`);
    }

    function downloadImage() {
        const targetSize = imageSize;
        const format = imageFormat;
        const mimeType =
            format === "png" || format === "png8"
                ? "image/png"
                : format === "webp"
                  ? "image/webp"
                  : "image/jpeg";
        const quality =
            format === "png" || format === "png8" ? undefined : format === "webp" ? 0.95 : 0.92;

        const img = new Image();
        const url = URL.createObjectURL(
            new Blob([getExportSvg(targetSize)], { type: "image/svg+xml;charset=utf-8" })
        );
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = canvas.height = targetSize;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                if (format === "jpg") {
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(0, 0, targetSize, targetSize);
                }
                ctx.drawImage(img, 0, 0, targetSize, targetSize);

                if (format === "png8") {
                    const imgData = ctx.getImageData(0, 0, targetSize, targetSize);
                    const png8Buffer = encodePng8(targetSize, targetSize, imgData.data);
                    const blob = new Blob([png8Buffer], { type: "image/png" });
                    triggerDownload(
                        URL.createObjectURL(blob),
                        `nilsbeerten-logo-${shape}-${targetSize}-png8.png`
                    );
                } else {
                    canvas.toBlob(
                        (blob) => {
                            if (blob)
                                triggerDownload(
                                    URL.createObjectURL(blob),
                                    `nilsbeerten-logo-${shape}-${targetSize}.${format}`
                                );
                        },
                        mimeType,
                        quality
                    );
                }
            }
            URL.revokeObjectURL(url);
        };
        img.src = url;
    }

    async function copySvg() {
        await navigator.clipboard.writeText(getExportSvg());
        copied = true;
        setTimeout(() => (copied = false), 2000);
    }

    // 7. HSL track gradient computation
    function getHslTrack(channel: "h" | "s" | "l", c: ColorState) {
        if (channel === "h")
            return "linear-gradient(to right, #e56060 0%, #e5d260 17%, #60e560 33%, #60e5d2 50%, #6080e5 67%, #d260e5 83%, #e56060 100%)";
        if (channel === "s")
            return `linear-gradient(to right, hsl(${c.h}, 0%, ${c.l}%), hsl(${c.h}, 100%, ${c.l}%))`;
        return `linear-gradient(to right, hsl(${c.h}, ${c.s}%, 5%), hsl(${c.h}, ${c.s}%, 50%), hsl(${c.h}, ${c.s}%, 95%))`;
    }

    const hslChannels = [
        { key: "h", labelEn: "Hue", labelNl: "Tint", max: 360, unit: "°" },
        { key: "s", labelEn: "Saturation", labelNl: "Verzadiging", max: 100, unit: "%" },
        { key: "l", labelEn: "Lightness", labelNl: "Helderheid", max: 100, unit: "%" },
    ] as const;

    const colorSections = [
        {
            key: "bg",
            labelEn: "Background",
            labelNl: "Achtergrond",
        },
        {
            key: "circle",
            labelEn: "Emblem fill",
            labelNl: "Embleemkleur",
        },
        {
            key: "inner",
            labelEn: "Monogram fill",
            labelNl: "Monogramkleur",
        },
    ] as const;
</script>

{#snippet colorDrawer(section: (typeof colorSections)[number])}
    {@const target = section.key}
    {@const c = colors[target]}
    {@const isInner = target === "inner"}
    {@const isBg = target === "bg"}
    {@const isPride = (isBg && bgMode === "pride") || (isInner && effectiveInnerColor === "pride")}
    {@const isRadial = (isBg && bgMode === "radial") || (isInner && effectiveInnerColor === "radial")}
    {@const displayHex = isPride
        ? str("rainbow", "regenboog")
        : isRadial
          ? str("radial gradient", "radiaal verloop")
          : isInner
            ? effectiveInnerColor
            : c.hex}
    {@const isOpen = openDrawer === target}

    <li class="border-b border-brand-border/20 last:border-b-0">
        <button
            type="button"
            onclick={() => (openDrawer = isOpen ? null : target)}
            class="group flex w-full cursor-pointer items-center justify-between py-2 text-left transition-colors">
            <div class="flex items-center gap-3">
                <span
                    class="h-4 w-4 rounded-full border border-black/10 dark:border-white/10 shrink-0 shadow-xs"
                    style:background={isPride
                        ? "linear-gradient(in oklch to bottom, #e40303, #ff8c00, #ffed00, #008026, #004dff, #750787)"
                        : isRadial
                          ? "conic-gradient(in oklch from 0deg, #fe4845 0deg, #3386fe 90deg, #13ba60 180deg, #ffce10 270deg, #fe4845 360deg)"
                          : displayHex}></span>
                <span
                    class="text-base {isOpen
                        ? 'font-medium text-brand-text underline underline-offset-2 decoration-brand-border'
                        : 'text-brand-muted group-hover:text-brand-text'}">
                    {str(section.labelEn, section.labelNl)}
                </span>
            </div>
            <div class="flex items-center gap-3">
                <span
                    class="font-mono text-xs uppercase tabular-nums text-brand-muted group-hover:text-brand-text">
                    {displayHex}
                </span>
                <span class="chevron text-xs text-brand-muted" class:rotate-90={isOpen}> ▸ </span>
            </div>
        </button>

        <div class="drawer-container" class:is-open={isOpen}>
            <div class="drawer-inner">
                <div class="flex flex-col gap-3 pt-1 pb-3 px-0.5">
                    {#if isBg && bgMode === "pride"}
                        <div class="flex items-center justify-between text-xs py-1">
                            <span class="text-brand-muted font-mono">
                                {str("rainbow gradient · static", "regenboogverloop · statisch")}
                            </span>
                            <button
                                type="button"
                                onclick={() => (bgMode = "solid")}
                                class="text-brand-muted hover:text-brand-text cursor-pointer underline underline-offset-1 text-xs">
                                {str("switch to solid", "naar egale kleur")}
                            </button>
                        </div>
                        <div
                            class="h-2 w-full rounded-full"
                            style="background: linear-gradient(in oklch to right, #e40303, #ff8c00, #ffed00, #008026, #004dff, #750787);">
                        </div>
                    {:else if isBg && bgMode === "radial"}
                        <div class="flex items-center justify-between text-xs py-1">
                            <span class="text-brand-muted font-mono">
                                {str("radial gradient · static", "radiaal verloop · statisch")}
                            </span>
                            <button
                                type="button"
                                onclick={() => (bgMode = "solid")}
                                class="text-brand-muted hover:text-brand-text cursor-pointer underline underline-offset-1 text-xs">
                                {str("switch to solid", "naar egale kleur")}
                            </button>
                        </div>
                        <div
                            class="h-2 w-full rounded-full"
                            style="background: linear-gradient(in oklch to right, #fe4845, #ffce10, #13ba60, #3386fe);">
                        </div>
                    {:else}
                        <div class="flex items-center justify-between text-xs">
                            {#if isInner}
                                <div class="flex items-center gap-2 text-xs text-brand-muted">
                                    <button
                                        type="button"
                                        onclick={() => {
                                            matchMonogramWithBg = true;
                                            if (bgMode === "solid") {
                                                colors.inner.setHex(colors.bg.hex);
                                            }
                                        }}
                                        class="cursor-pointer transition-colors {matchMonogramWithBg
                                             ? 'text-brand-text underline underline-offset-1 font-medium'
                                             : 'text-brand-muted hover:text-brand-text'}">
                                        {str("matches background", "volgt achtergrond")}
                                    </button>
                                    <span class="text-brand-border">·</span>
                                    <button
                                        type="button"
                                        onclick={() => {
                                            matchMonogramWithBg = false;
                                            if (effectiveInnerColor === "radial" || effectiveInnerColor === "pride") {
                                                colors.inner.setHex(colors.bg.hex);
                                            }
                                        }}
                                        class="cursor-pointer transition-colors {!matchMonogramWithBg
                                            ? 'text-brand-text underline underline-offset-1 font-medium'
                                            : 'text-brand-muted hover:text-brand-text'}">
                                        {str("independent", "onafhankelijk")}
                                    </button>
                                </div>
                            {:else}
                                <span class="text-brand-muted font-mono tabular-nums">
                                    {c.h}° · {c.s}% · {c.l}%
                                </span>
                            {/if}

                            <div class="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={isInner ? c.hex : displayHex}
                                    onchange={(e) => updateTargetHex(target, e.currentTarget.value)}
                                    maxlength="7"
                                    class="w-18 bg-transparent text-right font-mono text-xs uppercase text-brand-text border-b border-brand-border focus:border-brand-text focus:outline-none" />
                                <button
                                    type="button"
                                    onclick={() => resetTargetColor(target)}
                                    class="text-brand-muted hover:text-brand-text cursor-pointer underline underline-offset-1 text-xs">
                                    {str("reset", "herstel")}
                                </button>
                            </div>
                        </div>

                        <!-- Sliders -->
                        <div class="flex flex-col gap-2 pt-0.5">
                            {#each hslChannels as ch}
                                <div class="flex flex-col gap-1">
                                    <div class="flex justify-between text-xs text-brand-muted">
                                        <span>{str(ch.labelEn, ch.labelNl)}</span>
                                        <span class="font-mono tabular-nums text-brand-text"
                                            >{c[ch.key]}{ch.unit}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max={ch.max}
                                        step="1"
                                        value={c[ch.key]}
                                        oninput={(e) => {
                                            const val = +e.currentTarget.value;
                                            if (ch.key === "h")
                                                updateTargetHsl(target, val, undefined, undefined);
                                            else if (ch.key === "s")
                                                updateTargetHsl(target, undefined, val, undefined);
                                            else updateTargetHsl(target, undefined, undefined, val);
                                        }}
                                        style:background={getHslTrack(ch.key, c)}
                                        class="refined-slider hsl-track" />
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </li>
{/snippet}

<div class="mt-8 flex flex-col gap-8 md:grid md:grid-cols-12 md:items-start md:gap-12">
    <!-- Left: Preview & Export Actions -->
    <div class="flex flex-col items-center gap-4 md:col-span-5">
        <div
            class="aspect-square w-52 sm:w-60 md:w-full md:max-w-62.5 overflow-hidden transition-all duration-200"
            style:border-radius={shape === "circle" ? "9999px" : "0.5rem"}
            aria-label={str("Live emblem preview", "Live embleemvoorbeeld")}>
            {@html previewSvg}
        </div>

        <!-- Export & Shape Controls -->
        <div class="flex w-full max-w-62.5 flex-col gap-3 text-xs">
            <!-- 1. Shape -->
            <div class="flex items-center justify-between border-b border-brand-border/20 pb-2.5">
                <span class="text-brand-muted">{str("Shape:", "Vorm:")}</span>
                <div class="flex items-center gap-2">
                    {#each ["square", "circle"] as const as s, idx}
                        {#if idx > 0}<span class="text-brand-border">·</span>{/if}
                        <button
                            type="button"
                            onclick={() => (shape = s)}
                            class="cursor-pointer font-medium transition-colors {shape === s
                                ? 'text-brand-text underline underline-offset-2 decoration-brand-border'
                                : 'text-brand-muted hover:text-brand-text'}">
                            {s === "square" ? str("square", "vierkant") : str("circle", "cirkel")}
                        </button>
                    {/each}
                </div>
            </div>

            <!-- 2. SVG -->
            <div class="flex items-center justify-between border-b border-brand-border/20 pb-2.5">
                <span class="text-brand-muted">SVG:</span>
                <div class="flex items-center gap-3">
                    <button
                        type="button"
                        onclick={downloadSvg}
                        class="cursor-pointer font-medium text-brand-text underline underline-offset-1 decoration-brand-border hover:text-brand-muted transition-colors">
                        {str("Download", "Download")}
                    </button>
                    <span class="text-brand-border">·</span>
                    <button
                        type="button"
                        onclick={copySvg}
                        class="cursor-pointer font-medium text-brand-text underline underline-offset-1 decoration-brand-border hover:text-brand-muted transition-colors">
                        {copied ? str("Copied!", "Gekopieerd!") : str("Copy", "Kopieer")}
                    </button>
                </div>
            </div>

            <!-- 3. Image -->
            <div class="flex flex-col gap-2">
                <div class="flex items-center justify-between">
                    <span class="text-brand-muted">{str("Format:", "Formaat:")}</span>
                    <div class="flex items-center gap-2">
                        {#each ["png", "png8", "webp", "jpg"] as const as fmt, idx}
                            {#if idx > 0}<span class="text-brand-border">·</span>{/if}
                            <button
                                type="button"
                                onclick={() => (imageFormat = fmt)}
                                class="cursor-pointer font-medium uppercase transition-colors {imageFormat === fmt
                                    ? 'text-brand-text underline underline-offset-2 decoration-brand-border'
                                    : 'text-brand-muted hover:text-brand-text'}">
                                {fmt === "png8" ? "PNG-8" : fmt}
                            </button>
                        {/each}
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <span class="text-brand-muted">{str("Size:", "Grootte:")}</span>
                    <div class="flex items-center gap-2">
                        {#each [128, 512, 1024, 2048] as const as size, idx}
                            {#if idx > 0}<span class="text-brand-border">·</span>{/if}
                            <button
                                type="button"
                                onclick={() => (imageSize = size)}
                                class="cursor-pointer font-medium tabular-nums transition-colors {imageSize === size
                                    ? 'text-brand-text underline underline-offset-2 decoration-brand-border'
                                    : 'text-brand-muted hover:text-brand-text'}">
                                {size}
                            </button>
                        {/each}
                    </div>
                </div>

                <div class="pt-1 text-center">
                    <button
                        type="button"
                        onclick={downloadImage}
                        class="cursor-pointer font-medium text-brand-text underline underline-offset-1 decoration-brand-border hover:text-brand-muted transition-colors">
                        {str(
                            `Download ${imageFormat === "png8" ? "PNG-8" : imageFormat.toUpperCase()}`,
                            `Download ${imageFormat === "png8" ? "PNG-8" : imageFormat.toUpperCase()}`
                        )}
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Right: Controls -->
    <div class="flex flex-col md:col-span-7">
        <!-- Presets -->
        <div
            class="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-brand-border/40 pb-3 text-xs text-brand-muted">
            <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>{str("Presets:", "Voorinstellingen:")}</span>
                {#each presets as preset, idx}
                    {#if idx > 0}<span class="text-brand-border">·</span>{/if}
                    <button
                        type="button"
                        onclick={() => applyPreset(preset)}
                        class="cursor-pointer transition-colors {activePresetId === preset.id
                            ? 'font-medium text-brand-text underline underline-offset-2 decoration-brand-border'
                            : 'text-brand-muted hover:text-brand-text underline underline-offset-1'}">
                        {str(preset.labelEn, preset.labelNl)}
                    </button>
                {/each}
            </div>
        </div>

        <!-- Geometry -->
        <div>
            <h2 class="font-display text-brand -ml-px text-2xl font-bold">
                {str("Geometry", "Geometrie")}
            </h2>

            <ul class="grid grid-cols-2 gap-x-8 gap-y-5 py-4">
                {#each geoConfigs as g}
                    <li class="flex flex-col gap-1.5">
                        <div class="flex items-baseline justify-between text-base">
                            <span class="font-medium text-brand-text"
                                >{str(g.labelEn, g.labelNl)}</span>
                            <div class="flex items-baseline gap-2 text-xs">
                                <span class="font-mono tabular-nums text-brand-muted"
                                    >{geometry[g.key]}{g.unit}</span>
                                <button
                                    type="button"
                                    onclick={() => resetGeometry(g.key)}
                                    class="text-brand-muted hover:text-brand-text cursor-pointer underline underline-offset-1 text-xs">
                                    {str("reset", "herstel")}
                                </button>
                            </div>
                        </div>
                        <input
                            type="range"
                            min={g.min}
                            max={g.max}
                            step={g.step}
                            bind:value={geometry[g.key]}
                            class="refined-slider" />
                    </li>
                {/each}
            </ul>
        </div>

        <div class="my-5 h-px w-full bg-brand-border/40"></div>

        <!-- Palette -->
        <div>
            <div class="flex flex-wrap items-baseline justify-between gap-2">
                <h2 class="font-display text-brand -ml-px text-2xl font-bold">
                    {str("Palette", "Palet")}
                </h2>

                <button
                    type="button"
                    onclick={invertColors}
                    class="cursor-pointer font-medium text-brand-text hover:text-brand-muted underline underline-offset-1 text-xs">
                    {str("invert", "inverteer")}
                </button>
            </div>

            <ul class="flex flex-col gap-1.5 pt-3">
                {#each colorSections as section}
                    {@render colorDrawer(section)}
                {/each}
            </ul>
        </div>
    </div>
</div>

<style>
    :global(.aspect-square svg) {
        width: 100% !important;
        height: 100% !important;
        display: block !important;
    }

    .drawer-container {
        display: grid;
        grid-template-rows: 0fr;
        transition:
            grid-template-rows 250ms cubic-bezier(0.16, 1, 0.3, 1),
            opacity 200ms ease;
        opacity: 0;
        overflow: hidden;
    }

    .drawer-container.is-open {
        grid-template-rows: 1fr;
        opacity: 1;
    }

    .drawer-inner {
        overflow: hidden;
        min-height: 0;
    }

    .chevron {
        display: inline-block;
        transition: transform 250ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    input[type="range"].refined-slider {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 2px;
        border-radius: 9999px;
        background: var(--brand-hr);
        outline: none;
        cursor: pointer;
        margin: 6px 0;
        padding: 0;
        display: block;
    }

    input[type="range"].refined-slider::-webkit-slider-runnable-track,
    input[type="range"].refined-slider::-moz-range-track {
        height: 2px;
        border-radius: 9999px;
        background: inherit;
    }

    input[type="range"].refined-slider::-webkit-slider-thumb,
    input[type="range"].refined-slider::-moz-range-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--brand-text);
        border: none;
        box-shadow: none;
        cursor: grab;
        margin-top: -4px;
        transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
    }

    input[type="range"].refined-slider:hover::-webkit-slider-thumb,
    input[type="range"].refined-slider:hover::-moz-range-thumb {
        transform: scale(1.35);
    }

    input[type="range"].refined-slider:active::-webkit-slider-thumb,
    input[type="range"].refined-slider:active::-moz-range-thumb {
        cursor: grabbing;
        transform: scale(1.5);
    }

    input[type="range"].refined-slider.hsl-track {
        height: 3px;
    }
    input[type="range"].refined-slider.hsl-track::-webkit-slider-runnable-track,
    input[type="range"].refined-slider.hsl-track::-moz-range-track {
        height: 3px;
    }
</style>
