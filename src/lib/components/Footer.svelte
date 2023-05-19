<script lang="ts">
    let className = '';
    export { className as class };
</script>

<div class="py-2 w-full shell-max-w-center {className} flex justify-between">
    <p class="text-stone-800 font-medium dark:text-stone-400">
        © {new Date().getFullYear()} Nils Beerten
    </p>
    <div>
        <slot name="links" />
    </div>
</div>
