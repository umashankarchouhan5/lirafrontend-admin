<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Inspection Findings" slot="title" />
        <DataTable 
            :actions="true"
            :data="tableData"
            :columns="columns()"
            :is-loading="isLoading"
            @on-selection-change="selectChange"
            no-data-text="No Penalty applicable or Reinspection is not completed yet"
        >
            
            <template slot="actionsLeft">
                <TableButton @click="generaInvoices()">
                    <img src="../../../../assets/images/Update.png" alt="">
                    Generate Invoice
                </TableButton>
                <TableButton @click="dispatchInvoices()">
                    <img src="../../../../assets/images/Update.png" alt="">
                    Dispatch Invoices
                </TableButton>
                
            </template>
        </DataTable>

        
        <!-- //success popup -->
        <Popup title="Success" type="success" :value="successModal.visible" @close="() => successModal.visible = false" :mask-closable="true" :closable="true">
            {{ successModal.message }}
            <FormButton slot="footer" @click="() => successModal.visible = false">Close</FormButton>
        </Popup>

        <!-- warning modal -->
        <Popup title="Information" :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.cancel" @click="() => showWarningModal(false)">Cancel
                </FormButton>
                <FormButton v-if="warningModal.buttons.confirm" type="success" @click="confirmDelete">Confirm
                </FormButton>
                <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
            </div>
        </Popup>

    </FormWrapper>
</template>

<script>
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import { inspectionPenaltySummary, generateMultiplePenaltyInvoiceByAdmin, dispatchPenaltyInvoice } from "../api";
    import tableConfig from './table';
    import loadingMixin from 'Mixins/loadingMixin';
    import validateSelectedRows from 'Mixins/validateSelectedRows';

    export default {
        name: 'Penalty',
        mixins: [ loadingMixin, validateSelectedRows ],
        components: {
            FormWrapper,
            PageTitle,
            DataTable
        },
        data() {
            return {
                tableData: [],
                columns: tableConfig,
                selectedRows: [],
                successModal: {
                    visible: false,
                    message: '',
                },
                warningModal: {
                    visible: false,
                    buttons: {
                        ok: true,
                        confirm: false,
                        cancel: false
                    }
                },
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user;
            }
        },
        created() {
            this.inspection_id = parseInt(this.$route.params.inspection_id);
            this.getData();
        },
        methods: {
            selectChange(data) {
                this.selectedRows = data;
            },
            selectChangeNew(data) {
                this.selectedRowsNew = data;
            },
            getData() {
                this.showLoader();
                inspectionPenaltySummary({ inspection_id: this.inspection_id, adminuser_id: this.userData.user_id }).then(
                    res => {
                        this.tableData = res.data[1];
                        this.hideLoader();
                    }
                )
            },
            generaInvoices() {
                if(this.validateSelectedLength()) {
                    const idString = this.selectedRows.map( row => row.company_id ).filter( item => item != null ).join(',');
                    generateMultiplePenaltyInvoiceByAdmin({ idString: idString, inspection_id: this.inspection_id, adminuser_id: this.userData.user_id }).then(
                        res => {
                            this.getData();
                            this.successModal.visible = true;
                            this.successModal.message = res.message;
                        }
                    )
                }
            },
            dispatchInvoices() {
                if(this.validateSelectedLength()) {
                    const invoice_idstring = this.selectedRows.map( row => row.invoice_id ).filter( item => item != null ).join(',');
                    dispatchPenaltyInvoice({ invoice_idstring: invoice_idstring }).then(
                        res => {
                            this.getData();
                            this.successModal.visible = true;
                            this.successModal.message = res.message;
                        }
                    )
                }
            }
        }
    }
</script>