<template>
    <a @click="() => link()">{{ row.UniqueRef }}</a>
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
                window.open(`/pqReadonly/${this.row.pq_id}`, '_blank');
            }
        }
    }
</script>
