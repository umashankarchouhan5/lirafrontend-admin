<template>
    <div>
        <router-link v-if="row.TaskType === 0" :to="link">{{ row.TicketReference }}</router-link>
        <router-link v-if="row.TaskType !== 0" :to="subLink">{{ row.TicketReference }}</router-link>
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
            link() {
                return `/tasks/${this.row.TicketReference}`;
            },
            subLink() {
                return `/subTask/${this.row.TicketReference}/${this.row.Reference_id}`;
            }
        }
    }
</script>
