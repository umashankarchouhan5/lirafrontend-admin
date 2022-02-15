<template>
    <router-link :to="link" target="_blank">{{ row.UniqueRef}}</router-link>
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
        computed: {
            link() {
                return `/tasks/${this.row.PQTicketReference}`
            }
        },
        methods: {
            
        }
    }
</script>