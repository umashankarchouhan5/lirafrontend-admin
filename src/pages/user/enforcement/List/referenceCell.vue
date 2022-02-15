<template>
    <div>
        <a @click="link">{{ row.TicketReference }}</a>
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
                window.open(`/tasks/${this.row.TicketReference}`,'_blank');
            },
        }
    }
</script>
