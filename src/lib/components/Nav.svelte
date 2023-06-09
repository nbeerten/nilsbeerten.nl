<nav class="z-50 absolute top-0 left-0 right-0 h-16">
    <div class="flex h-full items-center gap-8 py-2 shell-max-w-center justify-between">
        <div class="flex items-center gap-8">
            <div class="font-display font-bold flex gap-3 items-center">
                <a href="/" class="contents">
                    <slot name="logo">
                        <img
                            class="h-8 w-8 filter invert dark:filter-none"
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
