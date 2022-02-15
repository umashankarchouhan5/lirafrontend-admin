<template>
    <div>
        <!-- <router-link :to="link">{{ row.TicketReference }}</router-link> -->
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
        computed: {
            // link() {
            //     return window.open(`/tasks/${this.row.TicketReference}`,'_blank');
            // },
        },
        methods: {
            link() {
                window.open(`/tasks/${this.row.TicketReference}`,'_blank');
            },
        }
    }
</script>
