<template>
    <a href="#" @click.prevent="handleClick">{{ row.UniqueRef}}</a>
</template>

<script>

    export default {
        name: "PQCell",
        props: {
            row: {
                type: Object,
                required: true
            }
        },
        methods: {
            handleClick() {
                window.open(`/pqReadonly/${this.row.pq_id}`, '_blank');
                // this.$router.push()
            }
        }
    }
</script>