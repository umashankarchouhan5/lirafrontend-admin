<template>
    <div>
        <DataTable :actions="true"
                   :data="ibcData"
                   :columns="tableColumns1">
            
        </DataTable>
                   
        <br/>
        <div  class="row" :class="$style.customRow">
            <div class="col-sm-12">
                <ButtonGroup>
                    <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
                    <FormButton type="primary" @click="viewSummary" right-icon="md-clipboard">View Summary</FormButton>
                </ButtonGroup>
            </div>
        </div>

        <!-- Popups  -->
        <Popup title="Compliance" width="700" type="info" :value="complianceModal.visible" @close="() => complianceModal.visible = false" :mask-closable="true" :closable="true">
            <DataTable 
                :data="compliances"
                :columns="complianceColumns"
            />
            <FormButton slot="footer" @click="() => complianceModal.visible = false">Close</FormButton>
        </Popup>

        <Popup title="Summary" width="1000" type="info" :value="summaryModal.visible" @close="() => summaryModal.visible = false" :mask-closable="true" :closable="true">
            <DataTable v-if="summaryData.length > 0"
                :data="summaryData"
                :columns="summaryColumns"
            />
            <p v-else>No renewal approved.</p>
            <FormButton slot="footer" @click="() => summaryModal.visible = false">Close</FormButton>
        </Popup>

        <Popup title="Annual Renewal Accept" type="info" :value="acceptModal.visible" @close="() => acceptModal.visible = false" :mask-closable="true" :closable="true">
            {{acceptModal.message}}
            <FormButton slot="footer" type="success" :disabled="confirmationLoading" @click="() => companyDecision('accept')">Ok</FormButton>
            <FormButton slot="footer" @click="() => acceptModal.visible = false">Close</FormButton>
        </Popup>

        <Popup title="Annual Renewal Reject" type="info" :value="rejectModal.visible" @close="() => rejectModal.visible = false" :mask-closable="true" :closable="true">
            {{rejectModal.message}}
            <FormButton slot="footer" type="success" :disabled="confirmationLoading" @click="() => companyDecision('reject')">Ok</FormButton>
            <FormButton slot="footer" @click="() => rejectModal.visible = false">Close</FormButton>
        </Popup>

        <Popup title="Success" type="success" :value="successModal.visible" @close="() => successModal.visible = false" :mask-closable="true" :closable="true">
            {{successModal.message}}
            <FormButton slot="footer" @click="() => successModal.visible = false">Close</FormButton>
        </Popup>
    </div>
</template>

<script>

    import DataTable from 'Components/DataTable';
    import { annualRenewalRequestApprovalByadminUser, annualRenewalApprovedSummary, getCompanyCompliances } from '../../../config/api';
    import ActionCell from './ActionCell';
    import loadingMixin from 'Mixins/loadingMixin';
    import DateUtil from 'Utils/dateUtil';

    export default {
        name: "AnnualRenewal",
        mixins: [ loadingMixin ],
        components: {
            DataTable,
        },
        props: {
            value: Object,
            readonly: Boolean 
        },
        data() {
            return {
                modals: {
                    warning: {
                        visible: false
                    },
                    success: {
                        visible: false,
                        loading: false
                    },
                    ticket: {
                        visible: false,
                        loading: false,
                        message: ''
                    }
                },
                peopleList: [],
                dateOptions: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                tableData: [],
                
                
                tableColumns1: [
                    {
                        title: 'Reg No',
                        key: 'companyRegno',
                        width: 70,
                    },
                    {
                        title: 'Name',
                        key: 'Name',
                        minWidth: 120
                    },
                    {
                        title: 'Status',
                        key: 'status',
                        width: 120,
                    },
                    {
                        title: 'Renewal Status',
                        key: 'renewalStatus',
                        width: 120,
                    },
                    {
                        title: 'Annual Fee Due Date',
                        render: (h, params) => {
                            return h('span', params.row.AnnualfeeDueDate && DateUtil.formatDate(params.row.AnnualfeeDueDate));
                        },
                        width: 160
                    },
                    {
                        title: 'Status Date',
                        render: (h, params) => {
                            return h('span', params.row.statusDate && DateUtil.formatDate(params.row.statusDate));
                        },
                        width: 100
                    },
                    {
                        title: 'Actions',
                        render: (h, params) => {
                            return h('div', [
                                h(ActionCell, {
                                    props: {
                                        row: params.row,
                                        viewCompany: this.viewCompany,
                                        acceptCompany: this.acceptOpen,
                                        rejectCompany: this.rejectOpen,
                                        confirmReadonly: this.confirmReadonly
                                    }
                                }),
                            ]);
                        },
                        width: 320,
                        align: 'center'
                    }
                ],
                selectedRows: [],
                companyData: [],
                
                ibcData: [],
                confirmReadonly: false,
                selectedData: {},
                acceptModal: {
                    visible: false,
                    message: 'Are you sure you want to approve ?'
                },
                rejectModal: {
                    visible: false,
                    message: 'Are you sure you want to reject ?'
                },
                successModal: {
                    visible: false,
                    message: ''
                },
                confirmationLoading: false,
                compliances: [],
                complianceModal: {
                    visible: false,
                    message: ''
                },
                complianceColumns: [
                    
                    {
                        title: 'Notes',
                        key: 'notes',
                    },
                    {
                        title: 'Status',
                        key: 'ComplianceStatus',
                    },
                    {
                        title: 'Compliance Date',
                        key: 'created_at',
                        render: (h, params) => {
                            return h('span', DateUtil.formatDateWithTime(params.row.created_at));
                        },
                    },
                ],
                
                summaryColumns: [
                    
                    {
                        title: 'Reg No.',
                        key: 'companyRegNo',
                        width: 80
                    },
                    {
                        title: 'Name',
                        key: 'companyName',
                        maxWidth: 180
                    },
                    {
                        title: 'Description',
                        key: 'description',
                    },
                    {
                        title: 'Renewal Year',
                        key: 'renewalyear',
                        width: 100
                    },
                    {
                        title: 'Fee',
                        key: 'fee',
                        width: 80
                    },
                    {
                        title: 'Penalty',
                        key: 'penalty',
                        width: 80
                    },
                    {
                        title: 'Tax',
                        key: 'tax',
                        width: 80
                    },
                ],
                summaryModal: {
                    visible: false,
                },
                summaryData: [],
            }
        },
        computed: {
            ticket() {
                return this.$store.state.ticket.ticket;
            },
            readOnly(){
                return this.$store.state.ticket.readOnly;
            },
            ticketData() {
                const data = JSON.parse(this.ticket.Stats);
                return data;
            },
            userData() {
                return this.$store.state.user.user
            }
        },
        watch: {
        },
        created() {
            if(this.ticket !== null){
                this.getIBCData();
            }
        },
        methods: {
            viewSummary() {
                this.showLoader()
                annualRenewalApprovedSummary({TicketReference: this.$route.params.id}).then(
                    res => {
                        this.summaryData = res.data;
                        this.summaryModal.visible = true;
                        this.hideLoader();
                    },
                    err => {
                        this.hideLoader();
                    }
                )
            },
            checkConfirmed() {
                if(this.readOnly == true){

                }else{
                    const allNotConfirmed = this.ibcData.filter(item => {return item.isConfirm == null})
                    if(allNotConfirmed.length > 0){
                        this.$store.commit('setRODConfirmCheck',true);
                    }else{
                        this.$store.commit('setRODConfirmCheck',false);
                    }

                }
            },
            acceptOpen(val){
                this.selectedData = val;
                this.acceptModal.visible = true;
            },
            companyDecision(val) {
                this.confirmationLoading = true;
                const data ={
                    TicketReference: this.$route.params.id,
                    company_id: this.selectedData.company_id,
                    outcome: val == 'accept' ? 'APP' : 'REJ'
                }
                annualRenewalRequestApprovalByadminUser(data).then(
                    res => {
                        this.confirmationLoading = false;
                        this.ibcData[this.selectedData._index].renewalStatus = val == 'accept' ? 'Approved' : 'Rejected';
                        this.ticket.ibcJson = JSON.stringify(this.ibcData);
                        val == 'accept' ? (this.acceptModal.visible = false) : (this.rejectModal.visible = false);
                        this.successModal.message = `Annual Renewal action has been updated.`;
                        this.successModal.visible = true;
                    },
                    err => {
                        this.confirmationLoading = false;
                    }
                )
            },
            rejectOpen(val){
                this.selectedData = val;
                this.rejectModal.visible = true;
            },
            getIBCData(){
                const data = JSON.parse(this.ticket.companyJson);
                this.ibcData = data;
                this.checkConfirmed();
            },
            viewCompany(val) {
                const filters = {};
                filters.id = val.company_id;
                const data = {
                    user_id: this.userData.user_id,
                    filterjson: {
                        filter: [filters],
                        
                    }
                };
                this.showLoader();
                getCompanyCompliances(data).then(
                    res => {
                        // this.ibcData[val._index].isACK = true;
                        this.companyData = res.data;
                        this.complianceModal.visible = true;
                        this.hideLoader();
                    },
                    err => {
                        this.hideLoader();
                    }
                )
            },
            dateFormat(date){
                return DateUtil.formatDate(date);
            },
            nextStep() {
                this.$emit('nextStep')
            },
            prevStep() {
                this.$emit('prevStep')
            }
        }
    }
</script>

<style lang="scss" module>
    .customRow{
        margin-bottom: 15px;
    }
    .rightAlign{
        text-align: right;
    }

    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 13px;
        font-weight: 400;
    }

</style>
