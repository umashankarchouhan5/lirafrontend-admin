<template>
    <div :class="$style.wrapper">
        <div :class="$style.title">
            <slot name="title" />
        </div>
        <div :class="$style.content">
            <Loader v-if="isLoading" />
            <slot />
        </div>
    </div>
</template>

<script>

    import Loader from 'Components/layout/Loader'
    export default {
        name: "FormWrapper",
        components: {
            Loader
        },
        props: {
            isLoading: {
                type: Boolean,
                default: false,
            }
        }
    }
</script>

<style lang="scss" module>
    .title{
        position: sticky;
        top: 0px;
        z-index: 10;
    }
    .wrapper {
        border: 1px solid #ccc;
        border-bottom: 3px solid #6da2f9;
    }
    .content {
        padding: 40px 30px 20px;
        position: relative;
        min-height: 300px;
    }
</style>
