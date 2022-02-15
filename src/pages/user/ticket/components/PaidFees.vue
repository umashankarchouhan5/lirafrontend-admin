<template>
    <div>
        <template v-if="payments">
            <br />
            <DataTable :actions="true"
                :data="payments"
                :columns="feeColumns"
                @on-selection-change="selectChange">
                <template slot="actionsLeft" >

                    <TableButton @click="() => view()" >
                        <img src="../../../../assets/images/eye.png" />
                        View Invoice
                    </TableButton>
                    <TableButton @click="() => receipt()" >
                        <img src="../../../../assets/images/view_receipt.png" />
                        View Receipt
                    </TableButton>

                </template>
            </DataTable>
        </template>
        <template>
            <DataTable v-if="ticket.RODPricingJson && ticket.RODPricingJson !== null"
                :data="getPricing"
                :columns="pricingTable">
            </DataTable>
        </template>
        <!-- add [0] in setPayments in ticket store index for older version to work -->
        <template v-if="showOlderVersion && payments">
            <div>
                <h6>Invoice Number: <span>:</span> {{ payments.InvoiceNumber }}</h6>
                <h6 v-if="payments.CCReference && payments.CCReference !== null">Following Fee has been paid by the applicant using {{ payments.PaymentModeDesc }} mode against {{ payments.CCReference }}</h6>
                <h6 v-else>Invoice Status: <span>:</span> {{ payments.PaymentStatus }}</h6>
            </div>
            <div>
                <p :class="$style.marginBottom"> {{ payments.Narration }} </p>
            </div>
            <div :class="$style.marginBottom" v-if="payments">
                <p :class="$style.marginBottom"> All Amounts are in {{payments.currency}}
                <div :class="$style.totalRow" v-if="payments.feeUSD > 0"> 
                    
                    <div >
                        Fees <span>:</span>
                    </div>
                    <div>
                        <p> {{ payments.feeUSD.toFixed(2) }}</p>
                    </div>
                </div>
                <div :class="$style.totalRow" v-if="payments.Taxpct > 0 && payments.Tax > 0">
                    <div>
                        {{ payments.TaxType }} Tax ({{ payments.Taxpct }}%) <span>:</span>
                    </div>
                    <div>
                        <p> {{ payments.Tax.toFixed(2) }}</p>
                    </div>
                </div>
                <div :class="$style.totalRow" v-if="payments.Interest > 0">
                    <div>
                        Interest <span>:</span>
                    </div>
                    <div>
                        <p> {{ payments.Interest.toFixed(2) }}</p>
                    </div>
                </div>
                <div :class="$style.totalRow" v-if="payments.Penalty > 0">
                    <div>
                        Penalty <span>:</span>
                    </div>
                    <div>
                        <p> {{ payments.Penalty.toFixed(2) }}</p>
                    </div>
                </div>
                <template v-if="payments.additionalCharge && payments.additionalCharge !== null">
                    <div v-for="(charge,index) in getAdditionalCharge()" :key="index">
                        <div :class="$style.totalRow"  v-if="charge.chargeAmount !== 0">
                            <div>
                                {{charge.chargeDesc}} <span>:</span>
                            </div>
                            <div>
                                <p> {{ charge.chargeAmount.toFixed(2) }}</p>
                            </div>
                        </div>
                    </div>
                </template>
                <div :class="$style.totalRow">
                    <div>
                        Total Amount Paid<span>:</span>
                    </div>
                    <div>
                        <p> {{ payments.Total.toFixed(2) }}</p>
                    </div>
                </div>
            </div>
            <DataTable v-if="ticket.RODPricingJson && ticket.RODPricingJson !== null"
                :data="getPricing"
                :columns="pricingTable">
            </DataTable>
            <br>
        </template>
        
        <FormRow>
            <div class="col-sm-12">
                <ButtonGroup>
                    <FormButton type="primary" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
                    <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
                </ButtonGroup>
            </div>
        </FormRow>

        <!-- Message popup -->
        <Popup title="Information" :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.cancel" @click="() => showWarningModal(false)">Cancel</FormButton>
                <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
            </div>
        </Popup>
    </div>
</template>

<script>
    
    import DataTable from 'Components/DataTable';
    import { fetchReceiptByInvoiceId } from '../config/api';
    import DateUtil from 'Utils/dateUtil'
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import AmountCell from './AmountMod';

    export default {
        name: "PaidFees",
        mixins: [validateSelectedRows],
        components: {
            DataTable
        },
        data() {
            return {
                showOlderVersion: false,
                pricingTable: [
                    {
                        title: 'Reg No',
                        key: 'companyRegNo',
                    },
                    {
                        title: 'Company Name',
                        key: 'companyName',
                    },
                    {
                        title: 'Description',
                        key: 'description',
                    },
                    {
                        title: 'Fee',
                        key: 'fee',
                        width: 100,
                    },
                    {
                        title: 'Tax',
                        key: 'tax',
                        width: 80,
                    },
                    {
                        title: 'Penalty',
                        key: 'penalty',
                        width: 80
                    },
                    {
                        title: 'Total',
                        key: 'total',
                        width: 120
                    },
                ],
                feeColumns: [
                    {
                        type: 'selection',
                        width: 40,
                        align: 'center'
                    },
                    {
                        title: 'Invoice Number',
                        key: 'InvoiceNumber',
                        minWidth: 100,
                    },
                    {
                        title: 'Payment Mode',
                        key: 'PaymentMode',
                        width: 120
                    },
                    {
                        title: 'Amount',
                        width: 100,
                        render: (h,params) => {
                            return h(AmountCell,{
                                props: {
                                    amount: params.row.fee,
                                    row: params.row
                                }
                            })
                        }
                    },
                    {
                        title: 'Currency',
                        key: 'currency',
                        width: 80,
                    },
                    {
                        title: 'CC Reference',
                        key: 'CCReference',
                        width: 100,
                    },
                    {
                        title: 'TransReference',
                        key: 'FSATransReference',
                        width: 110,
                    },
                    {
                        title: 'Invoice Date',
                        render: (h, params) => {
                            return h('span', DateUtil.formatDate(params.row.effectivedate));
                        },
                        width: 120
                    },
                    {
                        title: 'Status',
                        key: 'StatusDescription',
                        maxWidth: 140,
                        minWidth: 100
                    },
                ],
                selectedRows: [],
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
            processId() {
                return this.$store.state.common.currentProcessId
            },
            payments() {
                return this.$store.state.ticket.payments;
            },
            ticket() {
                return this.$store.state.ticket.ticket;
            },
            getPricing() {
                return JSON.parse(this.ticket.RODPricingJson)
            },
        },
        methods: {
            selectChange(data) {
                this.selectedRows = data;
            },
            view() {
                if (this.validateSelectedLength(1)) {
                    let data = this.selectedRows[0];
                    if( data.DocumentPath != '' && data.DocumentPath != null ){
                        window.open(data.DocumentPath, "_blank");
                    }else{
                        this.warningModal.message = 'No attachment found for this Invoice.';
                        this.showWarningModal(true);
                        return false;
                    }
                }
            },
            receipt(){
                if (this.validateSelectedLength(1)) {
                    let data = this.selectedRows[0];
                    if (data.StatusDescription == 'Pending Payment') {
                        this.warningModal.message = 'This invoice has not been paid';
                        this.showWarningModal(true);
                        return false;
                    } else {
                        fetchReceiptByInvoiceId({invoice_id: data.invoice_id}).then(
                        res=>{
                            window.open(res.data,'_blank');
                        }
                    )
                    }
                }
            },
            getAdditionalCharge() {
                return JSON.parse(this.payments.additionalCharge)
            },
            nextStep() {
                this.$emit('nextStep')
            },
            prevStep() {
                this.$emit('prevStep')
            },
            mapCurrencyToSign() {
                if (this.payments && this.payments.currency) {
                    if (this.payments.currency === 'USD') {
                        return '$'
                    }
                    return ''
                }
                return ''
            }
        }
    }
</script>

<style lang="scss" module>
    .marginBottom {
        margin-bottom: 20px;
    }
    .totalRow,
    .totalRowSummary {
        // border-bottom: 1px solid #fff;
        // background: #f4f4f4;
        display: flex;
        > div {
            padding: 10px 0px;
            display: flex;
            font-weight: 500;
            // &:nth-child(1) {
            //     width: 45%;
            // }
            &:nth-child(1) {
                width: 30%;
                max-width: 200px;
                min-width: 150px;
                span {
                    margin-left: auto;
                }
            }
            &:nth-child(2) {
                width: 25%;
                max-width: 150px;
                min-width: 150px;
                padding-left: 40px;
                font-size: 14px;
                text-align: right;
                p{
                    margin-left: auto;
                    margin-bottom: 0px;
                }
            }
        }
    }

    .totalRowSummary {
        > div {
            &:first-child {
                font-size: 15px;
                font-weight: 500;
            }
            &:last-child {
                font-size: 17px;
                font-weight: 700;
            }
        }
    }
</style>
