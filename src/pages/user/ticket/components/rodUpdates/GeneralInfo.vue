<template>
    <div>
        <DataTable :actions="true"
                   :data="ticketData"
                   :columns="tableColumns">
            
        </DataTable>
        <br/>
        <div  class="row" :class="$style.customRow">
            <div class="col-sm-12">
                <ButtonGroup>
                    <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
                </ButtonGroup>
            </div>
        </div>
    </div>
</template>

<script>

    import DataTable from 'Components/DataTable'
    import DateUtil from 'Utils/dateUtil';

    export default {
        name: "CompanyPersons",
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
                    // {
                    //     type: 'selection',
                    //     width: 38,
                    //     align: 'center'
                    // },
                    {
                        title: 'Director Name',
                        key: 'DirectorName',
                    },
                    {
                        title: 'ROD Action',
                        key: 'ChangeAction',
                    },
                    {
                        title: 'Director Type',
                        key: 'DirectorType'
                    },
                    {
                        title:'Nationality',
                        key: 'Nationality'
                    },
                    {
                        title: 'Incorporation Date',
                        key: 'IncorporationDate'
                    },
                    {
                        title: "Service Address",
                        key: "ServiceAddress"
                    },
                    {
                        title: 'Is Individual',
                        key: 'isIndividual',
                        render: (h, params) => {
                            if(params.row.isIndividual == 1){
                                return h('span','Yes');
                            }else{
                                return h('span', 'No');
                            }
                        },
                    },
                    {
                        title: 'Corporate Address',
                        key:'CorporateAddress',
                    },
                    {
                        title: 'Residence Address',
                        key:'ResidenceAddress',
                    },
                    {
                        title: 'Effective Date',
                        render: (h, params) => {
                            return h('span', DateUtil.formatDate(params.row.effectivedate));
                        },
                        align: 'left',
                    }
                ],
                directors: [],
                directorsType: [],
                selectedRows: [],
            }
        },
        computed: {
            ticket() {
                return this.$store.state.ticket.ticket;
            },
            ticketData() {
                var data = JSON.parse(this.ticket.RODChangeList);
                return data;
            }
        },
        components: {
            DataTable,
        },
        props: {
            value: Object,
            readonly: Boolean 
        },
        methods: {
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