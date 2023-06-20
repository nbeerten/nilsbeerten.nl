<script lang="ts">
    let className = "";
    export { className as class };
</script>

<div class="shell-max-w-center w-full py-2 {className} flex justify-between">
    <p class="font-medium text-stone-800 dark:text-stone-400">
        © {new Date().getFullYear()} Nils Beerten
    </p>
    <div>
        <slot name="links" />
    </div>
</div>
