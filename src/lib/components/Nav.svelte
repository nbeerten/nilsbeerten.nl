<nav class="absolute left-0 right-0 top-0 z-50 h-16">
    <div class="shell-max-w-center flex h-full items-center justify-between gap-8 py-2">
        <div class="flex items-center gap-8">
            <div class="flex items-center gap-3 font-display font-bold">
                <a href="/" class="contents">
                    <slot name="logo">
                        <img
                            class="h-8 w-8 invert filter dark:filter-none"
                            src="/logo_white.svg"
                            alt="Logo"
                        />
                    </slot>
                </a>
            </div>
        </div>

        <div>
            <slot name="right" />
        </div>
    </div>
</nav>
