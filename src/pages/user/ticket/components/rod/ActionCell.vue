<template>
    <div :class="$style.actions">
        <div >
            <template >
                <FormButton size="small" left-icon="md-eye" @click="onViewCompany" >View</FormButton>
                <FormButton @click="onAcknowledgeCompany"
                    size="small"
                    type="success"
                    :disabled="row.isACK == true"
                    left-icon="md-checkmark-circle-outline"
                    v-if="!readOnly">Acknowledge</FormButton>
                <FormButton @click="onConfirmCompany"
                    size="small"
                    type="success"
                    :disabled="row.isConfirm || !row.isACK"
                    left-icon="md-checkmark-circle-outline"
                    v-if="!readOnly">Confirm</FormButton>
                
            </template>
        </div>
    </div>
</template>

<script>
    import { viewCompanyDirectors, acknowledgeRODIBC, confirmRODIBC } from '../../config/api';

    export default {
        name: "ActionsCell",
        props: {
            row: {
                type: Object,
                required: true,
            },
            viewCompany: Function,
            acknowledgeCompany: Function,
            confirmCompany: Function,

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
            onAcknowledgeCompany() {
                this.acknowledgeCompany(this.row);
            },
            onConfirmCompany() {
                this.confirmCompany(this.row);
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
                color: #eac222;
                font-size: 19px;
                &:hover {
                    font-size: 19px;
                }
            }
        }
    }
</style>

