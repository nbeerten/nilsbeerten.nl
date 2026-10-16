<script lang="ts">
    import { DEFAULT_LOGO_OPTIONS, generateLogoSvg, hexToHsl, hslToHex } from "@lib/logo";

    interface Props {
        locale?: "en" | "nl";
    }

    let { locale = "en" }: Props = $props();
    const str = (en: string, nl: string) => (locale === "nl" ? nl : en);

    // 1. Geometry state & configs
    const geoConfigs = [
        { key: "waves", labelEn: "Waves", labelNl: "Golven", min: 3, max: 30, step: 1, unit: "", default: DEFAULT_LOGO_OPTIONS.waves },
        { key: "amplitude", labelEn: "Amplitude", labelNl: "Amplitude", min: 0, max: 30, step: 0.5, unit: "", default: DEFAULT_LOGO_OPTIONS.amplitude },
        { key: "radius", labelEn: "Radius", labelNl: "Straal", min: 150, max: 245, step: 1, unit: "", default: DEFAULT_LOGO_OPTIONS.radius },
        { key: "innerScale", labelEn: "Monogram", labelNl: "Monogram", min: 40, max: 180, step: 1, unit: "%", default: 100 },
    ] as const;

    type GeoKey = (typeof geoConfigs)[number]["key"];
    let geometry = $state<Record<GeoKey, number>>({
        waves: DEFAULT_LOGO_OPTIONS.waves,
        amplitude: DEFAULT_LOGO_OPTIONS.amplitude,
        radius: DEFAULT_LOGO_OPTIONS.radius,
        innerScale: 100,
    });

    // 2. Format & export state
    let shape = $state<"square" | "circle">("square");
    let pngSize = $state<512 | 1024 | 2048>(1024);
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
    let bgMode = $state<"solid" | "pride">("solid");

    let effectiveBgColor = $derived(bgMode === "pride" ? "pride" : colors.bg.hex);

    let effectiveInnerColor = $derived(
        matchMonogramWithBg ? colors.bg.hex : colors.inner.hex
    );

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
    const presets = [
        { id: "dark", labelEn: "dark", labelNl: "donker", bg: "#ffe7b3", circle: "#111110", inner: "#ffe7b3" },
        { id: "light", labelEn: "light", labelNl: "licht", bg: "#111110", circle: "#fefdfb", inner: "#111110" },
        { id: "red", labelEn: "red", labelNl: "rood", bg: "#e3000b", circle: "#fbf5ee", inner: "#e3000b" },
        { id: "blue", labelEn: "blue", labelNl: "blauw", bg: "#0078d4", circle: "#ffffff", inner: "#0078d4" },
        { id: "rainbow", labelEn: "rainbow", labelNl: "regenboog", bg: "pride", circle: "#111110", inner: "#ffffff" },
        { id: "pastel-1", labelEn: "pastel 1", labelNl: "pastel 1", bg: "#ffddee", circle: "#00aa00", inner: "#ffddee" },
        { id: "pastel-2", labelEn: "pastel 2", labelNl: "pastel 2", bg: "#00aa00", circle: "#aaee77", inner: "#00aa00" },
    ];

    let activePresetId = $derived.by(() => {
        const currentBg = bgMode === "pride" ? "pride" : colors.bg.hex.toLowerCase();
        const currentCircle = colors.circle.hex.toLowerCase();
        const currentInner = effectiveInnerColor.toLowerCase();

        const match = presets.find(
            (p) =>
                p.bg.toLowerCase() === currentBg &&
                p.circle.toLowerCase() === currentCircle &&
                p.inner.toLowerCase() === currentInner
        );
        return match ? match.id : null;
    });

    function applyPreset(p: (typeof presets)[number]) {
        if (p.id === "rainbow") {
            bgMode = "pride";
            matchMonogramWithBg = false;
            colors.circle.setHex(p.circle);
            colors.inner.setHex(p.inner);
        } else {
            bgMode = "solid";
            matchMonogramWithBg = p.bg === p.inner;
            colors.bg.setHex(p.bg);
            colors.circle.setHex(p.circle);
            colors.inner.setHex(p.inner);
        }
    }

    function invertColors() {
        if (bgMode === "pride") return;
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

    function downloadPng() {
        const targetSize = pngSize;
        const img = new Image();
        const url = URL.createObjectURL(new Blob([getExportSvg(targetSize)], { type: "image/svg+xml;charset=utf-8" }));
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = canvas.height = targetSize;
            canvas.getContext("2d")?.drawImage(img, 0, 0, targetSize, targetSize);
            canvas.toBlob((blob) => {
                if (blob) triggerDownload(URL.createObjectURL(blob), `nilsbeerten-logo-${shape}-${targetSize}.png`);
            }, "image/png");
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
        if (channel === "h") return "linear-gradient(to right, #e56060 0%, #e5d260 17%, #60e560 33%, #60e5d2 50%, #6080e5 67%, #d260e5 83%, #e56060 100%)";
        if (channel === "s") return `linear-gradient(to right, hsl(${c.h}, 0%, ${c.l}%), hsl(${c.h}, 100%, ${c.l}%))`;
        return `linear-gradient(to right, hsl(${c.h}, ${c.s}%, 5%), hsl(${c.h}, ${c.s}%, 50%), hsl(${c.h}, ${c.s}%, 95%))`;
    }

    const hslChannels = [
        { key: "h", labelEn: "Hue", labelNl: "Tint", max: 360, unit: "°" },
        { key: "s", labelEn: "Saturation", labelNl: "Verzadiging", max: 100, unit: "%" },
        { key: "l", labelEn: "Lightness", labelNl: "Helderheid", max: 100, unit: "%" },
    ] as const;

    const colorSections = [
        { key: "bg", labelEn: "Background", labelNl: "Achtergrond", defaultHex: DEFAULT_LOGO_OPTIONS.bgColor },
        { key: "circle", labelEn: "Emblem fill", labelNl: "Embleemkleur", defaultHex: DEFAULT_LOGO_OPTIONS.circleColor },
        { key: "inner", labelEn: "Monogram fill", labelNl: "Monogramkleur", defaultHex: DEFAULT_LOGO_OPTIONS.innerColor },
    ] as const;
</script>

{#snippet colorDrawer(section: (typeof colorSections)[number])}
    {@const target = section.key}
    {@const c = colors[target]}
    {@const isInner = target === "inner"}
    {@const isBg = target === "bg"}
    {@const isPrideBg = isBg && bgMode === "pride"}
    {@const displayHex = isPrideBg ? str("rainbow", "regenboog") : (isInner ? effectiveInnerColor : c.hex)}
    {@const isOpen = openDrawer === target}

    <li class="border-b border-brand-border/20 last:border-b-0 pb-1.5">
        <button
            type="button"
            onclick={() => (openDrawer = isOpen ? null : target)}
            class="group flex w-full cursor-pointer items-center justify-between py-2 text-left transition-colors">
            <div class="flex items-center gap-3">
                <span
                    class="h-4 w-4 rounded-full border border-black/10 dark:border-white/10 shrink-0 shadow-xs"
                    style:background={isPrideBg
                        ? "linear-gradient(to bottom, #e40303 0% 16.66%, #ff8c00 16.66% 33.33%, #ffed00 33.33% 50%, #008026 50% 66.66%, #004dff 66.66% 83.33%, #750787 83.33% 100%)"
                        : displayHex}></span>
                <span
                    class="text-base {isOpen
                        ? 'font-medium text-brand-text underline underline-offset-2 decoration-brand-border'
                        : 'text-brand-muted group-hover:text-brand-text'}">
                    {str(section.labelEn, section.labelNl)}
                </span>
            </div>
            <div class="flex items-center gap-3">
                <span class="font-mono text-xs uppercase tabular-nums text-brand-muted group-hover:text-brand-text">
                    {displayHex}
                </span>
                <span class="chevron text-xs text-brand-muted" class:rotate-90={isOpen}>
                    ▸
                </span>
            </div>
        </button>

        <div class="drawer-container" class:is-open={isOpen}>
            <div class="drawer-inner flex flex-col gap-3 pt-2 pb-3 px-0.5">
                {#if isPrideBg}
                    <div class="flex items-center justify-between text-xs py-1">
                        <span class="text-brand-muted font-mono">
                            {str("rainbow flag · static", "regenboogvlag · statisch")}
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
                        style="background: linear-gradient(to right, #e40303 0% 16.66%, #ff8c00 16.66% 33.33%, #ffed00 33.33% 50%, #008026 50% 66.66%, #004dff 66.66% 83.33%, #750787 83.33% 100%);">
                    </div>
                {:else}
                    <div class="flex items-center justify-between text-xs">
                        {#if isInner}
                            <div class="flex items-center gap-2 text-xs text-brand-muted">
                                <button
                                    type="button"
                                    onclick={() => {
                                        if (bgMode === "pride") bgMode = "solid";
                                        matchMonogramWithBg = true;
                                        colors.inner.setHex(colors.bg.hex);
                                    }}
                                    class="cursor-pointer transition-colors {matchMonogramWithBg
                                        ? 'text-brand-text underline underline-offset-1 font-medium'
                                        : 'text-brand-muted hover:text-brand-text'}">
                                    {str("matches background", "volgt achtergrond")}
                                </button>
                                <span class="text-brand-border">·</span>
                                <button
                                    type="button"
                                    onclick={() => (matchMonogramWithBg = false)}
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
                                value={displayHex}
                                onchange={(e) => updateTargetHex(target, e.currentTarget.value)}
                                maxlength="7"
                                class="w-18 bg-transparent text-right font-mono text-xs uppercase text-brand-text border-b border-brand-border focus:border-brand-text focus:outline-none"
                            />
                            <button
                                type="button"
                                onclick={() => {
                                    if (isInner) matchMonogramWithBg = false;
                                    updateTargetHex(target, section.defaultHex);
                                }}
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
                                    <span class="font-mono tabular-nums text-brand-text">{c[ch.key]}{ch.unit}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max={ch.max}
                                    step="1"
                                    value={c[ch.key]}
                                    oninput={(e) => {
                                        const val = +e.currentTarget.value;
                                        if (ch.key === "h") updateTargetHsl(target, val, undefined, undefined);
                                        else if (ch.key === "s") updateTargetHsl(target, undefined, val, undefined);
                                        else updateTargetHsl(target, undefined, undefined, val);
                                    }}
                                    style:background={getHslTrack(ch.key, c)}
                                    class="refined-slider hsl-track"
                                />
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
    </li>
{/snippet}

<div class="mt-8 flex flex-col gap-8 md:grid md:grid-cols-12 md:items-start md:gap-12">
    <!-- Left: Preview & Export Actions -->
    <div class="flex flex-col items-center gap-4 md:col-span-5">
        <div
            class="aspect-square w-52 sm:w-60 md:w-full md:max-w-62.5 overflow-hidden transition-all duration-200"
            style:border-radius={shape === "circle" ? "9999px" : "0px"}
            aria-label={str("Live emblem preview", "Live embleemvoorbeeld")}>
            {@html previewSvg}
        </div>

        <div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm pt-1">
            <button
                type="button"
                onclick={downloadSvg}
                class="decoration-brand-border text-brand-text hover:text-brand-muted cursor-pointer font-medium underline underline-offset-1">
                SVG
            </button>
            <span class="text-brand-border" aria-hidden="true">·</span>
            <button
                type="button"
                onclick={downloadPng}
                class="decoration-brand-border text-brand-text hover:text-brand-muted cursor-pointer font-medium underline underline-offset-1">
                PNG
            </button>
            <span class="text-brand-border" aria-hidden="true">·</span>
            <button
                type="button"
                onclick={copySvg}
                class="decoration-brand-border text-brand-text hover:text-brand-muted cursor-pointer font-medium underline underline-offset-1">
                <span>{copied ? str("Copied!", "Gekopieerd!") : str("Copy", "Kopieer")}</span>
            </button>
        </div>

        <!-- Shape & Size Toggles -->
        <div class="flex flex-col items-center gap-1.5 text-xs text-brand-muted">
            <div class="flex items-center gap-2">
                <span>{str("Shape:", "Vorm:")}</span>
                {#each ["square", "circle"] as const as s}
                    {#if s !== "square"}<span>·</span>{/if}
                    <button
                        type="button"
                        onclick={() => (shape = s)}
                        class="cursor-pointer font-medium transition-colors {shape === s
                            ? 'text-brand-text underline underline-offset-2 decoration-brand-border'
                            : 'text-brand-muted hover:text-brand-text'}">
                        {s === "square" ? str("square", "vierkant") : str("circle (pfp)", "cirkel (pfp)")}
                    </button>
                {/each}
            </div>

            <div class="flex items-center gap-2">
                <span>{str("PNG size:", "PNG grootte:")}</span>
                {#each [512, 1024, 2048] as const as size}
                    {#if size !== 512}<span>·</span>{/if}
                    <button
                        type="button"
                        onclick={() => (pngSize = size)}
                        class="cursor-pointer font-medium transition-colors {pngSize === size
                            ? 'text-brand-text underline underline-offset-2 decoration-brand-border'
                            : 'text-brand-muted hover:text-brand-text'}">
                        {size}
                    </button>
                {/each}
            </div>
        </div>
    </div>

    <!-- Right: Controls -->
    <div class="flex flex-col md:col-span-7">
        <!-- Geometry -->
        <div>
            <h2 class="font-display text-brand -ml-px text-2xl font-bold">
                {str("Geometry", "Geometrie")}
            </h2>

            <ul class="grid grid-cols-2 gap-x-8 gap-y-5 py-4">
                {#each geoConfigs as g}
                    <li class="flex flex-col gap-1.5">
                        <div class="flex items-baseline justify-between text-base">
                            <span class="font-medium text-brand-text">{str(g.labelEn, g.labelNl)}</span>
                            <div class="flex items-baseline gap-2 text-xs">
                                <span class="font-mono tabular-nums text-brand-muted">{geometry[g.key]}{g.unit}</span>
                                <button
                                    type="button"
                                    onclick={() => (geometry[g.key] = g.default)}
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
                            class="refined-slider"
                        />
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

                <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-brand-muted">
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
                    <span class="text-brand-border" aria-hidden="true">/</span>
                    <button
                        type="button"
                        onclick={invertColors}
                        class="cursor-pointer font-medium text-brand-text hover:text-brand-muted underline underline-offset-1">
                        {str("invert", "inverteer")}
                    </button>
                </div>
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
        border: 1.5px solid var(--brand-background);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
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
