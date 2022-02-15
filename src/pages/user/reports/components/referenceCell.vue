<template>
    <div>
        <a v-if="row.URL && row.URL !== null" :href="row.URL" target="_blank">{{row.Code}}</a>
    </div>
</template>

<script>
    export default {
        name: "ReferenceCell",
        props: {
            row: {
                type: Object,
                required: true
            }
        },
        methods: {
            link() {
                window.open(this.row.URL);
            },
        }
    }
</script>
