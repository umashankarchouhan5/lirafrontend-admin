<template>
    <div>
        <a @click="openPopup">{{ row.FSATicketReference }}</a>
        <!-- <p  v-else>{{ row.FSATicketReference }}</p> -->
    </div>
</template>

<script>
    export default {
        name: "RefCell",
        props: {
            row: {
                type: Object,
                required: true
            },
            onOpenPop: Function,
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
        },
        methods:{
            openPopup(){
                this.onOpenPop(this.row)
            }
        }
    }
</script>
