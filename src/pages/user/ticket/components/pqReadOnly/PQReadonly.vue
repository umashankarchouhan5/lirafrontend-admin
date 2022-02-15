<template>
    <FormWrapper :isLoading="isLoading">
        <PageTitle v-if="ticket" title="PQ Form" slot="title" :link="helpLink">
        </PageTitle>
        <template >
            
            <FormRow >
                <ButtonGroup>
                    <FormButton @click="getChangeLog()" >See Change Log</FormButton>
                    <FormButton @click="getAssesmentRecord()" >PQ Assesment Record</FormButton>
                </ButtonGroup>
            </FormRow>
            <Wizard :steps="steps" @changeStep="setActiveStep" />
            <component :is="activeStep.component"
                       @nextStep="nextStep"
                       @prevStep="prevStep"
                       v-model="form"
                       v-if="ticket && activeStep" />
        </template>
        
        <Popup title="PQ Assesment Record" width="700" type="info" :value="pqAssesmentModal.visible" @close="() => pqAssesmentModal.visible = false" :mask-closable="true" :closable="true">
            
            <DataTable :actions="true"
                :data="pqAssesmentData"
                :columns="pqAssementTable"
                :is-loading="isLoading">
            </DataTable>
            <FormButton slot="footer" @click="() => pqAssesmentModal.visible = false">Close</FormButton>
        </Popup>
    </FormWrapper>
</template>

<script>

    import countriesMixin from 'Mixins/countriesMixin';
    import formStepsMixin from 'Mixins/formStepsMixin';
    import { INCORPORATE_PROCESS_ID, CONTINUATION_PROCESS_ID, PQ_PROCESS_ID } from 'Config/processIds';
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import Wizard from 'Components/wizard/Wizard';
    import { getTicket, saveCheckList, forwardTicket, generateDecisionEmail, processTicket, assignTicket, fetchPQAssessmentRecord } from '../../config/api';
    import stepsConfig from './steps';
    import DateUtil from 'Utils/dateUtil';
    import { getTicketData } from './api';
    import DataTable from 'Components/DataTable';

    export default { 
        name: "PQReadonly",
        mixins: [countriesMixin,formStepsMixin],
        components: {
            FormWrapper,
            PageTitle,
            Wizard,
            DataTable
        },
        data() {
            return {
                isReadonly: false,
                forwardUserPopup: false,
                isNotesVisible: false,
                ticketReference: this.$route.params.id,
                emailSend: {
                    popupVisible: false,
                    message: ''
                },
                email: {
                    isGenerated: false,
                    printqueue: null,
                    fsaref: '',
                    subject: '',
                    body: '',
                    id: '',
                    DocumentName: '',
                    Attachment: '',
                },
                form: {
                    outcome: '',
                    comments: '',
                    DispositionString: '',
                },pqAssementTable:[
                    {
                        title: 'Licensee Name',
                        key: 'CompanyName',
                    },
                    {
                        title: 'License',
                        key: 'License',
                        width: 100,
                    },
                    {
                        title: 'Position',
                        key: 'Position',
                        width: 110,
                    },
                    {
                        title: 'Status',
                        key: 'Status',
                        width: 110,
                    },
                    {
                        title: 'Status Date',
                        width: 100,
                        render: (h, params) => {
                            return h('span', params.row.StatusDate !== null ? DateUtil.formatDate(params.row.StatusDate) : '');
                        },
                    },
                ],
                pqAssesmentData:[],
                pqAssesmentModal: {
                    visible: false,
                }
                // ticket: [],
            }
        },
        watch: {
            ticket(newValue) {
                if (newValue && this.steps.length === 0) {
                    this.setStepsHandler();
                }
            },
        },
        computed: {
            readOnly(){
                return this.$store.state.ticket.readOnly;
            },
            isAllDocumentsApproved() {
                return this.$store.state.ticket.isAllDocumentsApproved;
            },
            forwardingUsers() {
                return this.$store.state.ticket.forwardingUsers;
            },
            isLoading() {
                return this.$store.state.ticket.isLoading;
            },
            pageTitle() {
              return `Reference ${this.ticketReference}`
            },
            userData() {
                return this.$store.state.user.user
            },
            processId() {
                return this.$store.state.common.currentProcessId
            },
            helpLink() {
                return this.processId ? `/help/${this.processId}` : null;
            },
            updateDate() {
                return this.ticket ? DateUtil.formatDateWithTime(this.ticket.updated_at) : '';
            },
            ticket() {
                return this.$store.state.ticket.pqRead;
            },
            pcAdmin(){
                return this.$store.state.ticket.pcAdmin;
            },
        },
        created(){
            this.getData();
        },
        methods: {
            
            getAssesmentRecord(){
                fetchPQAssessmentRecord({pq_id: parseInt(this.$route.params.id)}).then(
                    res => {
                        this.pqAssesmentData = res.data;
                        this.pqAssesmentModal.visible = true;
                    }
                )
            },
            getChangeLog(){
                window.open(`/pqLog/${this.$route.params.id}`,'_blank');
            },
            nextStep() {
                this.setActiveStep(this.activeStep.id + 1)
            },
            prevStep() {
                this.setActiveStep(this.activeStep.id - 1)
            },
            getData() {
                // const data = {
                //     ticket_reference: this.ticketReference,
                //     user_id: this.userData.user_id
                // }; 
                // this.$store.dispatch('getTicket', data)
                const data = {pq_id: this.$route.params.id};
                this.$store.dispatch('getPQData', data)
                // getTicketData({pq_id: this.$route.params.id}).then(
                //     res=>{
                //         this.ticket = res.data[0];
                //     }
                // );
            },
            setStepsHandler()  {
                this.setSteps(stepsConfig);
                this.setActiveStep(1)
            },
        },
    }
</script>

<style lang="scss" module>
    .info {
        background: #d7d6da;
        box-shadow: 0 2px 2px #00000059;
        padding: 0 15px;
        display: flex;
        font-size: 13px;
        margin: -39px -20px 30px;
        line-height: 35px;
        justify-content: center;
        z-index: 10;
        position: sticky;
        top: 34.5px;
        & .infoBlock:nth-child(1){
            text-align: left;
            margin: 0px auto 0xp 0px;
            width: 33.33%
        }
        & .infoBlock:nth-child(2){
            text-align: center;
            margin: 0px auto;
            width: 33.33%
        }
        & .infoBlock:nth-child(3){
            text-align: right;
            margin: 0px 0px 0px auto;
            width: 33.33%
        }
    }

    .reference {
        font-size: 14px;
        line-height: 35px;
    }

    .notesLink {
        line-height: 35px;
        color: #000;
        font-weight: 700;
        cursor: pointer;
        transition: color 200ms ease;
        :global {
            .ivu-icon {
                font-size: 21px;
                margin-right: 3px;
                margin-top: -2px;
                vertical-align: middle;
            }
        }
    }
</style>
<style>
    .tox-statusbar__branding {
        opacity: 0;
    }
</style>
