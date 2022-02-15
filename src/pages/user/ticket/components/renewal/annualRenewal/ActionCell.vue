<template>
    <div :class="$style.actions">
        <div >
            <template >
                <FormButton size="small" left-icon="md-eye" @click="onViewCompany" >View</FormButton>
                <FormButton @click="onAcceptCompany"
                    size="small"
                    type="success"
                    :disabled="row.renewalStatus == 'Approved'"
                    left-icon="md-checkmark-circle-outline"
                    v-if="!readOnly">Approve</FormButton>
                <FormButton @click="onRejectCompany"
                    size="small"
                    type="danger"
                    :disabled="row.renewalStatus == 'Rejected'"
                    left-icon="md-cross"
                    v-if="!readOnly">Reject</FormButton>
                
            </template>
        </div>
    </div>
</template>

<script>

    export default {
        name: "ActionsCell",
        props: {
            row: {
                type: Object,
                required: true,
            },
            viewCompany: Function,
            acceptCompany: Function,
            rejectCompany: Function,

        },
        computed:{
            readOnly(){
                return this.$store.state.ticket.readOnly;
            },
            ticket() {
                return this.$store.state.ticket.ticket;
            },
        },
        methods: {
            onViewCompany() {
                this.viewCompany(this.row);
            },
            onAcceptCompany() {
                this.acceptCompany(this.row);
            },
            onRejectCompany() {
                this.rejectCompany(this.row);
            }
        }
    }
</script>

<style lang="scss" module>

    .accepted {
        color: #55a7a0;
        padding: 0 7px;
        min-width: 70px;
        height: 22px;
        line-height: 22px;
    }

    .actions {
        display: flex;
        align-items: center;
        justify-content: center;
        a,
        button {
            margin: 0 5px
        }
        div {
            margin: 0 5px;
            color: #55a7a0;
            display: inline-block;
            &:hover {
                color: #55a7a0;
            }
            &.error {
                color: #ff3547;
                font-size: 19px;
                &:hover {
                    font-size: 19px;
                }
            }
        }
    }
</style>

