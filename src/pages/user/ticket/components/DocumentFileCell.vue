<template>
    <div :class="$style.flex">
        <div >
            <template >
                {{row.name}}
            </template>
        </div>
    </div>
</template>

<script>

    export default {
        name: "DocumentFileCell",
        props: {
            row: {
                type: Object,
                required: true,
            },
        },
        computed:{
        },
        methods: {
        }
    }
</script>

<style lang="scss" module>


    .flex {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow-wrap: anywhere;
    }
</style>

