<template>
    <div>
        <!-- <DataTable :actions="true"
                   :data="ticketData"
                   :columns="tableColumns">
            
        </DataTable> -->
        <DataTable :actions="true"
                   :data="ibcData"
                   :columns="tableColumns1">
            
        </DataTable>
                   
        <br/>
        <!-- <FormRow>
            <div class="col-sm-6">
                <a :href="ticket.DocumentPath" target="_blank" :class="$style.view">View File <Icon type="md-eye" :class="$style.eye" /></a>
            </div>
        </FormRow> -->
        <div  class="row" :class="$style.customRow">
            <div class="col-sm-12">
                <ButtonGroup>
                    <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
                </ButtonGroup>
            </div>
        </div>
        <Popup title="Directors" width="1100" type="info" :value="directorsList.visible" @close="() => directorsList.visible = false" :mask-closable="true" :closable="true">
            
            <DataTable :actions="true"
                :data="companyData"
                :columns="directorTable">
            </DataTable>
            <FormButton slot="footer" @click="() => directorsList.visible = false">Close</FormButton>
        </Popup>
        
        <Popup title="Director Acknowledgement" type="info" :value="acknowledgeModal.visible" @close="() => acknowledgeModal.visible = false" :mask-closable="true" :closable="true">
            {{acknowledgeModal.message}}
            <FormButton slot="footer" type="success" :disabled="acknowledgedLoading" @click="() => acknowledgeCompany()">Ok</FormButton>
            <FormButton slot="footer" @click="() => acknowledgeModal.visible = false">Close</FormButton>
        </Popup>
        <Popup title="Director Confirmation" type="info" :value="confirmModal.visible" @close="() => confirmModal.visible = false" :mask-closable="true" :closable="true">
            {{confirmModal.message}}
            <FormButton slot="footer" type="success" :disabled="confirmLoading" @click="() => confirmCompany()">Ok</FormButton>
            <FormButton slot="footer" @click="() => confirmModal.visible = false">Close</FormButton>
        </Popup>
        <Popup title="Success" type="success" :value="successModal.visible" @close="() => successModal.visible = false" :mask-closable="true" :closable="true">
            {{successModal.message}}
            <FormButton slot="footer" @click="() => successModal.visible = false">Close</FormButton>
        </Popup>
    </div>
</template>

<script>

    import DataTable from 'Components/DataTable';
    import { viewCompanyDirectors, acknowledgeRODIBC, confirmRODIBC } from '../../config/api';
    import ActionCell from './ActionCell';
    import loadingMixin from 'Mixins/loadingMixin';
    import DateUtil from 'Utils/dateUtil';

    export default {
        name: "ROD",
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
                    appointment: {
                        visible: false,
                        loading: false
                    },
                    cessation: {
                        visible: false,
                        loading: false
                    },
                    changeName: {
                        visible: false,
                        loading: false
                    },
                    changeAddress: {
                        visible: false,
                        loading: false
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
                changeTypes: {
                    appointment: 'APPT',
                    cessation: 'CESS',
                    changeName: 'NAME',
                    changeAddress: 'ADDR'
                },
                data: {
                    ChangeType: null,
                    DirectorName: '',
                    EffectiveDate: '',
                    ResignationReason: '',
                    isIndividual: '1',
                    DateOfIncorporation: '',
                    DirectorType:'',
                    DirectorType_id:'',
                    Nationality:'',
                    CorporateAddress: '',
                    ResidenceAddress: '',
                    ServiceAddress: '',
                    person_id:'',
                    Nationality_id:'',
                    StartDate: '',
                    EndDate: '',
                    CompanyROD_id: '',
                    RODChangepeopleRequest_id: 0,
                },
                dateOptions: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                tableData: [],
                tableColumns: [
                    {
                        title: 'S No.',
                        key: 'id',
                        width: 50
                    },
                    {
                        title: 'Description',
                        key: 'description',
                    },
                    {
                        title: 'Count Value',
                        key: 'countValue'
                    },
                    
                ],
                
                tableColumns1: [
                    {
                        title: 'Reg No',
                        key: 'regNo',
                        width: 70,
                    },
                    {
                        title: 'IBC Name',
                        key: 'companyName'
                    },
                    {
                        title: 'ICSP Code',
                        key: 'ICSPCode',
                        width: 80,
                    },
                    {
                        title: 'Acknowledgement Date',
                        render: (h, params) => {
                            return h('span', params.row.ACKdate && DateUtil.formatDate(params.row.ACKdate));
                        },
                        width: 160
                    },
                    {
                        title: 'Confirmation Date',
                        render: (h, params) => {
                            return h('span', params.row.COnfirmDate && DateUtil.formatDate(params.row.COnfirmDate));
                        },
                        width: 130
                    },
                    {
                        title: 'Actions',
                        render: (h, params) => {
                            return h('div', [
                                h(ActionCell, {
                                    props: {
                                        row: params.row,
                                        viewCompany: this.viewCompany,
                                        acknowledgeCompany: this.acknowledgementOpen,
                                        confirmCompany: this.confirmOpen,
                                        confirmReadonly: this.confirmReadonly
                                    }
                                }),
                            ]);
                        },
                        width: 320,
                        align: 'center'
                    }
                ],
                directors: [],
                directorsType: [],
                selectedRows: [],
                companyData: [],
                directorTable: [
                    {
                        title: 'Director ID',
                        key: 'director_id',
                        width: 60
                    },
                    {
                        title: 'Director Name',
                        key: 'Directorname',
                        width: 140,
                    },
                    {
                        title: 'Position',
                        key: 'Position',
                        width: 100,
                    },
                    {
                        title: 'Incorporation/ Birth Date',
                        render: (h, params) => {
                            return h('span', params.row.IncorporationDate && DateUtil.formatDate(params.row.IncorporationDate));
                        },
                        width: 90
                    },
                    {
                        title: 'Residence Address',
                        key: 'ResidenceAddress',
                    },
                    {
                        title: 'Service Address',
                        key: 'ServiceAddress',
                    },
                    {
                        title: 'Corporate Address',
                        key: 'CorporateAddress',
                    },
                    {
                        title: 'Nationality',
                        key: 'Nationality',
                        width: 80,
                    },
                    {
                        title: 'Appointment Date',
                        render: (h, params) => {
                            return h('span', params.row.PositionStartDate && DateUtil.formatDate(params.row.PositionStartDate));
                        },
                        width: 100
                    },
                    
                    {
                        title: 'Cessation Date',
                        render: (h, params) => {
                            return h('span', params.row.PositionEndDate && DateUtil.formatDate(params.row.PositionEndDate));
                        },
                        width: 80
                    },
                ],
                directorsList: {
                    visible: false,
                },
                ibcData: [],
                confirmReadonly: false,
                acknowledgeData: {},
                confirmData: {},
                acknowledgeModal: {
                    visible: false,
                    message: 'Are you sure you want to continue with this acknowledgement?'
                },
                confirmModal: {
                    visible: false,
                    message: 'Are you sure you want to continue with this confirmation?'
                },
                successModal: {
                    visible: false,
                    message: ''
                },
                acknowledgedLoading: false,
                confirmLoading: false
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
        },
        watch: {
        },
        created() {
            if(this.ticket !== null){
                this.getIBCData();
            }
        },
        methods: {
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
            acknowledgementOpen(val){
                this.acknowledgeData = val;
                this.acknowledgeModal.visible = true;
            },
            acknowledgeCompany() {
                this.acknowledgedLoading = true;
                const data ={
                    TicketReference: this.ticket.TicketReference,
                    company_id: this.acknowledgeData.company_id
                }
                acknowledgeRODIBC(data).then(
                    res => {
                        this.acknowledgedLoading = false;
                        this.ibcData[this.acknowledgeData._index].isACK = true;
                        this.ticket.ibcJson = JSON.stringify(this.ibcData);
                        this.acknowledgeModal.visible = false;
                        this.successModal.message = `The IBC  No ${this.acknowledgeData.regNo} has been acknowledged and Email sent successfully.`;
                        this.successModal.visible = true;
                    },
                    err => {
                        this.acknowledgedLoading = false;
                    }
                )
            },
            confirmOpen(val){
                this.confirmData = val;
                this.confirmModal.visible = true;
            },
            confirmCompany() {
                this.confirmLoading = true;
                const data ={
                    TicketReference: this.ticket.TicketReference,
                    company_id: this.confirmData.company_id
                }
                confirmRODIBC(data).then(
                    res => {
                        this.confirmLoading = false; 
                        this.ibcData[this.confirmData._index].isConfirm = true;
                        this.ticket.ibcJson = JSON.stringify(this.ibcData);
                        this.confirmModal.visible = false;
                        this.successModal.message = `The IBC  No ${this.acknowledgeData.regNo} has been confirmed and Email sent successfully.`;
                        this.successModal.visible = true;
                        this.checkConfirmed();
                    },
                    err => {
                        this.confirmLoading = false;
                    }
                )
            },
            getIBCData(){
                const data = JSON.parse(this.ticket.ibcJson);
                this.ibcData = data;
                this.checkConfirmed();
            },
            viewCompany(val) {
                const data = {company_id: val.company_id, TicketReference: this.ticket.TicketReference}
                this.showLoader();
                viewCompanyDirectors(data).then(
                    res => {
                        // this.ibcData[val._index].isACK = true;
                        this.companyData = res.data;
                        this.directorsList.visible = true;
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
