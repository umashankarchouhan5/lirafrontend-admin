<template>
    <div>
        <div >
            <DataTable :actions="true"
                :data="personTicket"
                :columns="tableColumns">
            </DataTable> 

            <br />

            <h6>Provide details of the legal advisor(s) of the proposed licensee. (It is recommended that the legal advisor be based in Seychelles)</h6>
            <br />
            <LegalAuditor v-model="legalJson" />
            
            <h6>Please provide details of the Auditors of the proposed licensee.</h6>
            <br />
            <LegalAuditor v-model="auditorJson" />

            <br />
            <ButtonGroup >
                <FormButton type="primary" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
                <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
            </ButtonGroup>
        </div>
    </div>
</template>

<script>

    import DataTable from 'Components/DataTable'
    import valueMixin from 'Mixins/loadingMixin'
    import DateUtil from 'Utils/dateUtil'
    import PQCell from './component/PQAction'
    import LegalAuditor from './component/legal-auditor'


    export default {
        name: "CompanyPersons",
        mixins: [valueMixin],
        components: {
            DataTable,
            LegalAuditor
        },
        props: {
            value: Object,
            readonly: Boolean
        },
        data() {
            return {
                isVisible: false,
                loaders: {
                    pqId: false,
                    pqName: false
                },
                pq: {
                    UniqueRef: '',
                    Name: '',
                    id: ''
                },
                pq_list: [],
                positions: [],
                data: {
                    position: null,
                    Licensee: null,
                    icsp_id: null,
                    name: null,
                },
                tableData: [],
                tableColumns: [
                    {
                        title: 'PQ ID',
                        key:'UniqueRef',
                        render:(h,params) =>{
                            return h(PQCell,{
                                props: {
                                    row: params.row
                                }
                            });
                        },
                        width: 110
                    },
                    {
                        title: 'Name',
                        key: 'personname',
                        maxWidth: 250
                    },
                    {
                        title: 'Position',
                        key:'Position',
                    },
                    {
                        title: 'Status',
                        key:'Status',
                        width: 100
                    },
                    
                ]
            }
        },
        watch: {
        },
        computed: {
            legalJson() {
                return this.ticket.legalJson !== null && this.ticket.legalJson !== '' ? JSON.parse(this.ticket.legalJson) : []
            },
            auditorJson() {
                return this.ticket.auditorJson !== null && this.ticket.auditorJson !== '' ? JSON.parse(this.ticket.auditorJson) : []
            },
            ticket() {
                return this.$store.state.ticket.ticket;
            },
            personTicket(){
                var ticket = this.$store.state.ticket.ticket;
                
                if(ticket.persons){
                    var personTicket = ticket.persons.map((val) =>{
                        val.personname = val.Fname + ' ' +val.Lname;
                        return val;
                    })
                    return personTicket;
                }else{
                    return [];
                }
            }
        },
        methods: {
            nextStep() {
                this.$emit('nextStep')
            },
            prevStep() {
                this.$emit('prevStep')
            },
           
            async getPositions() {
                const positions = await fetchPQPosition();
                this.positions = positions.data;
            },
            async getPeople() {
                const data = {
                    icsprequest_id: this.userData.icsp_id
                };
                const tableData = await getICSPRequestPeople(data);
                this.tableData = tableData.data;
            },
            async test() {
                const result = await this.$refs.validator.validate();
                if (result) {
                        this.showLoader();
                        const data = {
                            pq_id: this.pq.pq_id,
                            position: this.data.position.Name,
                            persontype_id: this.data.position.id,
                            icsprequest_id: this.userData.icsp_id
                        };
                        const response = await assignPosition(data);
                        this.hideLoader();
                        this.reset();
                        this.isVisible=false;
                }
            },
        }
    }
</script>
