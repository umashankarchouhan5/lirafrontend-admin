<template>
    <div :class="$style.actions">
        <div >
            <template v-if="row.name">
                <FormButton :prevent-default="false" size="small" type="text" :href="row.url" target="_blank" v-if="row.name" tag="a" left-icon="md-eye">View</FormButton>
                <ButtonGroup>
                    <FormButton @click="acceptDocumentHandler"
                        size="small"
                        type="success"
                        left-icon="md-checkmark-circle-outline"
                        v-if="!row.isAccepted && !row.isRejected && (!readOnly || (readOnly && userData.department_id !== 1 && ticket.process_id !== 804 && ticket.process_id !== 803 && ticket.isClosed != 1)) && $route.name !== 'PQReadonly' && ticket.adminuser_id == userData.user_id">
                        Approve
                    </FormButton>
                    <FormButton @click="rejectDocumentHandler"
                        size="small"
                        type="danger"
                        left-icon="md-close-circle"
                        v-if="!row.isAccepted && !row.isRejected && (!readOnly || (readOnly && userData.department_id !== 1 && ticket.process_id !== 804 && ticket.process_id !== 803 && ticket.isClosed != 1)) && $route.name !== 'PQReadonly' && ticket.AllowDocumentRejection == 1 && ticket.adminuser_id == userData.user_id">
                        Reject
                    </FormButton>
                </ButtonGroup>
                <div v-if="row.isAccepted" :class="$style.accepted">
                    <Icon type="md-checkmark-circle-outline" />
                    Accepted
                </div>
                <div v-if="row.isRejected" :class="$style.rejected">
                    <Icon type="md-close-circle" />
                    Rejected
                </div>
            </template>
            <template v-if="!row.name && !isOptional && !isAdditional">
                <div :class="$style.error">
                    <Icon type="md-warning" />
                </div>
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
            isAdditional: Boolean,
            isOptional: Boolean
        },
        computed:{
            readOnly(){
                return this.$store.state.ticket.readOnly;
            },
            ticket() {
                return this.$store.state.ticket.ticket;
            },
            userData() {
                return this.$store.state.user.user
            },
        },
        methods: {
            acceptDocumentHandler(e) {
                e.preventDefault();
                const data = {
                    documentdata_id: this.row.documentdata_id,
                };
                if (this.isAdditional ) {
                    data.isAdditional = Number(this.isAdditional)
                }
                this.$store.dispatch('acceptDocument', data)
            },
            rejectDocumentHandler(e) {
                e.preventDefault();
                const data = {
                    documentdata_id: this.row.documentdata_id,
                };
                if (this.isAdditional ) {
                    data.isAdditional = Number(this.isAdditional)
                }
                this.$store.dispatch('rejectDocument', data)
            },
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
    .rejected {
        color: #ff3547!important;
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
                color: #eac222;
                font-size: 19px;
                &:hover {
                    font-size: 19px;
                }
            }
        }
    }
</style>

