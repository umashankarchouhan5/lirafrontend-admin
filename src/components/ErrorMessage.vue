<template>
    <div :class="$style.errorMessage">
        <slot />
    </div>

</template>

<style lang="scss" module>
    .errorMessage {
        color: #ff3547;
        font-size: 11px;
        line-height: 13px;
        font-weight: 400;
    }
</style>