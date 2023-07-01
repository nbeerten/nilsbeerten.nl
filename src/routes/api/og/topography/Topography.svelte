<script lang="ts">
    import svgFile from "/static/topography.svg?raw";
    const b64 = btoa(svgFile);
</script>

<div
    class="topography flex h-[630px]"
    style="background-image: url(data:image/svg+xml;base64,{b64});"
/>

<style lang="postcss">
    .topography {
        background-color: theme(colors.stone.950);
    }
</style>
