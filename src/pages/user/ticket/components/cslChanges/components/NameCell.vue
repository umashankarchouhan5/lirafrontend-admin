<template>
    <a @click="link" >{{ `${row.Name}` }}</a>
    <!-- <p>{{ `${row.Name}` }}</p> -->
</template>

<script>
    export default {
        name: "ReferenceCell",
        props: {
            row: {
                type: Object,
                required: true
            },
            openPop: Function,
        },
        methods: {
            link() {
                this.openPop(this.row)
            }
        }
    }
</script>
