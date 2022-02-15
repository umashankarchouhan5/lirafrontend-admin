<template>
    <FormWrapper :isLoading="isTicketLoading">
        <PageTitle v-if="ticket && ticket.pageTitle && ticket.PdfPath!=undefined && ticket.PdfPath!=null " :title="ticket.pageTitle" :pdf="generatePdf" slot="title" :link="helpLink">
            <!-- :class="!readOnly ? $style.notesLink : $style.notesLinkDisabled" -->
            <!-- v-on="{click:!readOnly ? openNotes:() => {}}" -->
            <div :class="$style.notesLink" v-on="{click: openNotes}" slot="right">
                <Icon type="md-clipboard" />
                Internal Memo
            </div>
        </PageTitle>
        <PageTitle v-if="ticket && ticket.pageTitle && (ticket.PdfPath==undefined || ticket.PdfPath==null)" :title="ticket.pageTitle"  slot="title" :link="helpLink">
            <div :class="$style.notesLink" v-on="{click: openNotes}" slot="right">
                <Icon type="md-clipboard" />
                Internal Memo
            </div>
        </PageTitle>
        <template v-if="!email.isGenerated">
            <div :class="$style.info" v-if="ticket">
                <!-- first value -->
                <div :class="$style.infoBlock">
                    {{ticketReference}}
                </div>
                <!-- second value -->
                <div :class="$style.infoBlock" v-if="ticket.process_id !== 700 && ticket.process_id !== 702 && ticket.process_id !== 121 && ticket.process_id !== 345 && ticket.process_id !== 113 && ticket.process_id !== 804" >
                    <strong>{{ ticket.EntityType }}
                        <span v-if=" ticket.CompanyName !== '' && ticket.CompanyName !== ' ' && ticket.CompanyName !== null && ticket.CompanyName !== undefined && ticket.EntityType && ticket.EntityType !== null ">:</span>
                    </strong> 
                    {{ ticket.CompanyName }}
                </div>
                <div :class="$style.infoBlock" v-if="ticket.process_id === 804" >
                    <strong>{{ ticket.CompanyName }}</strong>
                </div>
                <div :class="$style.infoBlock" v-if="ticket.process_id === 345 || ticket.process_id === 113" >
                    <strong>{{ ticket.EntityType }}</strong>
                </div>
                <div :class="$style.infoBlock" v-if="ticket.process_id === 121">
                    <strong>IBC :</strong> {{ ticket.CompanyName }}
                </div>
                <div :class="$style.infoBlock" v-if="ticket.process_id === 700">
                    {{ ticket.CompanyName }}
                </div>
                <div :class="$style.infoBlock" v-if="ticket.process_id === 702">
                    <!-- {{ ticket.Licensee}} -->
                    {{ ticket.personName }}
                </div>
                <!-- third value -->
                <div :class="$style.infoBlock" v-if="ticket.process_id !== 702 && ticket.process_id !== 700 && ticket.process_id !== 804">
                    {{ ticket.ICSPname }}
                </div>
                <div :class="$style.infoBlock" v-if="ticket.process_id === 804">
                    
                </div>
                <div :class="$style.infoBlock" v-if="ticket.process_id === 702">
                    {{ ticket.position }}
                </div>
                <div :class="$style.infoBlock" v-if="ticket.process_id === 700">
                    <span v-if="ticket.isICSP">ICSP</span>
                    <span v-if="ticket.isITSP">ITSP</span>
                    <span v-if="ticket.isFSP">FSP</span>
                </div>
            </div>
            <NotesModal v-if="ticket" :reference-id="ticket.reference_id" :is-visible="isNotesVisible" @onClose="hideNotesModal">
                <!-- The Completed and Signed application in the approved form specifying the particulars of the charge -->
            </NotesModal>

            <FormRow >
                <ButtonGroup>
                    <FormButton @click="getChangeLog()" v-if="processId === 702">See Change Log</FormButton>
                    <FormButton @click="getAssesmentRecord()" v-if="processId === 702">PQ Assesment Record</FormButton>
                </ButtonGroup>
            </FormRow>
            <Wizard :steps="steps" @changeStep="setActiveStep" />
            <component :is="activeStep.component"
            
                :stepId="activeStep.id"
                @nextStep="nextStep"
                @prevStep="prevStep"
                v-model="form"
                @onFinalResponse="finalResponseHandler"
                @onRFIResponse="rfiHandler"
                @onSubmitDecision="submitDecision"
                @onForwardTicket="forwardTicketHandler"
                @onSendMail="openEmailPopup"
                v-if="ticket && activeStep" />

        </template>
        <template v-else>
            <CenterBlock :width="700">
                <ValidationObserver ref="emailValidator">
                    <FormRow>
                        <div class="col-sm-7">
                            <InputText readonly v-model="email.to" label="To:" />
                        </div>
                    </FormRow>
                        
                    <FormRow v-if="rfiSendValues.isRFI == true">
                        <div class="col-sm-4">
                            <InputDate label="Deadline" :options="options" v-model="form.dueDate" />
                        </div>
                    </FormRow>

                    <!-- Attachments -->
                    <Attachment v-model="files" v-if="form.outcome=='RFI'" :notAllAttachmentSaved="errors.notAllAttachmentSaved" @notAllSavedFalse="changeNotAllSavedStatus" > </Attachment>

                    <FormRow>
                        <div class="col-sm-12">
                            <InputText v-model="email.subject" rules="required" label="Subject:" />
                        </div>
                    </FormRow>
                    <FormRow>
                        <div class="col-sm-12" v-if="email.CC && email.CC !== null">
                            <InputText v-model="email.CC" label="CC:" />
                        </div>
                    </FormRow>
                    <FormRow>
                        <div class="col-sm-12">
                            <EditorComponent v-model="email.body" />
                            
                        </div>
                    </FormRow>
                </ValidationObserver>
                <FormRow v-if=" email.Attachmentjson && email.Attachmentjson !== null ">
                    <div class="col-sm-12" v-for="(file,ind) in parseAttachment(email.Attachmentjson)" :key="ind" >
                        <a @click="openWindow(file.HTMLBody)">{{file.FileNamePrefix}}</a>
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12">
                       <ButtonGroup>
                           <FormButton left-icon="ios-send" type="success" @click="() => processTicketHandler(1)" v-if="!pcAdmin.Printq">Send</FormButton>
                           <FormButton v-if="email.printqueue || pcAdmin.Printq" left-icon="md-print" type="success" @click="() => processTicketHandler(2)"   >Print Queue</FormButton>
                       </ButtonGroup>
                    </div>
                </FormRow>
            </CenterBlock>
        </template>
        

        <!-- Send Email Popup STart -->
        <Popup title="Send Email" type="info" width="1000" :value="emailPopup.visible" @close="() => closeEmailPopup()" :mask-closable="false" :closable="true">
            <div >
                
                <FormRow v-if="pcAdmin.CanSendEmail === 1 && emailTemplateList.length > 1">
                    <div class="col-sm-4">
                        <FormSelect label="Select Email Template" :items="emailTemplateList" item-name="Name" item-value="ID"  v-model="EmailTemplate_id" />
                    </div>
                </FormRow>
                
                <Loader v-if="emailLoader" />
                <div v-if="EmailTemplate_id !== null && emailLoader === false">
                    <FormRow>
                        <div class="col-sm-7">
                            <InputText readonly v-model="emailPopup.data.Toemail" label="To:" />
                        </div>
                    </FormRow>
                    <FormRow>
                        <div class="col-sm-7">
                            <InputText v-model="emailPopup.data.CC" label="CC:" />
                        </div>
                    </FormRow>
                    <FormRow>
                        <div class="col-sm-12">
                            <InputText v-model="emailPopup.data.Subject" label="Subject:" />
                        </div>
                    </FormRow> 
                    <Attachment v-model="emailPopup.Attachment" > </Attachment>
                    <FormRow>
                        <div class="col-sm-12">
                            <EditorComponent v-model="emailPopup.data.Body" />
                        </div>
                    </FormRow>
                </div>
            </div>

            <FormButton left-icon="ios-send" slot="footer" @click="() => sendEmail()">Send Email</FormButton>
            <FormButton slot="footer" @click="() => closeEmailPopup()">Close</FormButton>
        </Popup>

        <Popup title="Success" type="success" :value="emailSend.popupVisible" @close="() => emailSend.popupVisible = false" :mask-closable="false" :closable="false">
            {{ emailSend.message }}
            <FormButton slot="footer" @click="backToTicketList">{{backTo}}</FormButton>
            <FormButton slot="footer" @click="stayOn()">Stay on Same Page</FormButton>
        </Popup>
        
        <Popup title="Success" type="success" :value="successModal.visible" @close="() => successModal.visible = false" :mask-closable="true" :closable="true">
            {{ successModal.message }}
            <FormButton slot="footer" @click="() => successModal.visible = false">Close</FormButton>
        </Popup>
        <Popup title="Success" type="success" :value="forwardUserPopup" :mask-closable="false" :closable="false">
            Ticket has been successfully forwarded!
            <FormButton slot="footer" @click="backToTicketList">{{backTo}}</FormButton>
        </Popup>
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
    import loadingMixin from 'Mixins/loadingMixin';
    import { INCORPORATE_PROCESS_ID, CONTINUATION_PROCESS_ID, PQ_PROCESS_ID } from 'Config/processIds';
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import Wizard from 'Components/wizard/Wizard';
    import NotesModal from 'Components/notesModal/NotesModal';
    import { getTicket, saveCheckList, uploadFile, generateDecisionEmail, processTicket, assignTicket,fetchTicketEmailData,sendEmailByAdmin, fetchPQAssessmentRecord, processDecision, assignDeadline } from './config/api';
    import stepsConfig from './config/steps';
    import DateUtil from 'Utils/dateUtil';
    import Observation from './components/Observation';
    import Attachment from 'Components/attachment';
    import DataTable from 'Components/DataTable';
    import { ValidationObserver } from "vee-validate"; 
    import InputDate from 'Components/form/InputDate';

    export default {
        name: "Ticket",
        mixins: [countriesMixin,formStepsMixin,loadingMixin],
        components: {
            FormWrapper,
            PageTitle,
            Wizard,
            NotesModal,
            Observation,
            Attachment,
            DataTable,
            ValidationObserver,
            InputDate
        },
        data() {
            return {
                files: [],
                isReadonly: false,
                forwardUserPopup: false,
                isNotesVisible: false,
                ticketReference: this.$route.params.id,
                emailSend: {
                    popupVisible: false,
                    message: ''
                },
                successModal: {
                    visible : false,
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
                    Certificatebody: null
                },
                form: {
                    outcome: '',
                    comments: '',
                    DispositionString: '',
                    dueDate: ''
                },
                backTo: window.history.length > 1 ? 'Back to List' : 'Close',
                emailPopup: {
                    visible: false,
                    data: null,
                    CC: '',
                    Attachment: []
                },
                EmailTemplate_id: null,
                emailLoader: false,
                pqAssementTable:[
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
                },
                pdfLink:'',
                prevRoute: null,
                currentStep: [],
                fileUpload: null,
                rfiSendValues: {
                    isRFI: false,
                    calendar_id: 0,
                    dueDate: '',
                    dateType_id: 204,
                },
                
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() < Date.now();
                    }
                },
                errors: {
                    notAllAttachmentSaved: false
                }
            }
        },
        computed: {
            // ticketHeader(){
            //     if(this.ticket){
            //         const First = this.ticketReference;
            //         if()
            //     }
            //     else{
            //         return {First: '',Second: '',Third: ''}
            //     }
            // },
            readOnly(){
                return this.$store.state.ticket.readOnly;
            },
            isAllDocumentsApproved() {
                return this.$store.state.ticket.isAllDocumentsApproved;
            },
            forwardingUsers() {
                return this.$store.state.ticket.forwardingUsers;
            },
            isTicketLoading() {
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
                return this.$store.state.ticket.ticket;
            },
            pcAdmin(){
                return this.$store.state.ticket.pcAdmin;
            },
            emailTemplateList(){
                return this.$store.state.ticket.emailTemplateList;
            },
        },
        watch: {
            emailTemplateList(val){
                if(val && val !== null && val.length === 1){
                    this.EmailTemplate_id = val[0].ID;
                }
            },
            EmailTemplate_id(val){
                this.fetchEmailData();
            },
            ticket(newValue) {
                // if (newValue && this.steps.length === 0) {
                //     this.setStepsHandler();
                // }
            },
            pcAdmin(val){
                if(val && this.steps.length === 0){
                    this.setStepsHandler();
                    if(this.ticket && this.ticket.process_id && (this.ticket.process_id == 700 || this.ticket.process_id == 701 || this.process_id == 704)){
                        window.addEventListener("storage", this.localStorageRefreshEvent);

                    }
                }
            }
        },
        created() {
            this.getData();
                // localStorage.setItem('refreshNameReservation',true);
            if(localStorage.refreshPQ){
                localStorage.removeItem('refreshPQ')
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                if(from.name !== null){
                    vm.prevRoute = from.fullPath;
                }
            })
        },
        methods: {
            stayOn() {
                this.$router.go();
            },
            changeNotAllSavedStatus(val) {
                this.errors.notAllAttachmentSaved = val;
            },
            assignDeadlineForRFI() {
                const {  calendar_id, dateType_id } = this.rfiSendValues
                const data =  {
                    dueDate: this.form.dueDate,
                    calendar_id,
                    dateType_id: dateType_id,
                    TicketReference: this.ticket.TicketReference,
                    ...((this.ticket.company_id !== undefined && (this.ticket.company_id !== null || this.ticket.Company_id) ) && {license_id: this.ticket.license_id} ),
                    ...((this.ticket.license_id !== undefined && (this.ticket.license_id !== null || this.ticket.License_id) ) && {license_id: this.ticket.license_id} ),
                }
                
                assignDeadline(data)
            },
            localStorageRefreshEvent(event){
                if(localStorage.refreshPQ){
                    var refreshValue = JSON.parse(localStorage.getItem('refreshPQ'))
                    if(refreshValue === true){
                        // this.getData();
                        this.$router.go();
                        localStorage.removeItem('refreshPQ')
                    }
                }
            },
            uploadAdminFile(i){
                
                let data = new FormData();
                data.append('image',this.fileUpload, this.fileUpload.name)
                uploadFile(data).then(
                    res=> {
                        this.value[i].path = res.data.path;
                        this.value[i].name = res.data.name;
                        this.value[i].url = res.data.url;
                        this.fileUpload = null;

                    }
                )
            },
            getAssesmentRecord(){
                fetchPQAssessmentRecord({pq_id: this.ticket.pq_id}).then(
                    res => {
                        this.pqAssesmentData = res.data;
                        this.pqAssesmentModal.visible = true;
                    }
                )
            },
            closeEmailPopup(){
                this.emailPopup.visible = false;
                if(this.emailTemplateList.length > 1){
                    this.emailPopup.data = null;
                    this.EmailTemplate_id = null;
                }
            },
            sendEmail(){
                const data ={
                    TicketReference: this.ticket.TicketReference,
                    EmailTemplate_id: this.EmailTemplate_id,
                    CC: this.emailPopup.CC !== '' ? this.emailPopup.CC : null,
                    Attachment: this.emailPopup.Attachment.length !== 0 ? this.emailPopup.Attachment : null,

                    ...this.emailPopup.data,
                }
                sendEmailByAdmin(data).then(
                    res => {
                        this.successModal.message = res.message;
                        this.successModal.visible = true
                        this.closeEmailPopup();
                    }
                )
            },
            openEmailPopup(){
                this.emailPopup.visible = true;  
            },
            fetchEmailData(){ 
                this.emailLoader = true
                this.showLoader();
                const data = {
                    TicketReference: this.ticket.TicketReference,
                    EmailTemplate_id: this.EmailTemplate_id
                }
                fetchTicketEmailData(data).then(
                    res => {
                        this.emailPopup.data = res.data[0];
                        this.emailLoader = false;
                        this.hideLoader();
                    },
                    err => {
                        this.hideLoader();
                    }
                )
            },
            getChangeLog(){
                window.open(`/pqLog/${this.ticket.pq_id}`,'_blank');
            },
            openWindow(val){
                var myWindow=window.open('','','width=700,height=900');
                myWindow.document.write(val);
            },
            parseAttachment(val){
                return JSON.parse(val);
            },
            forwardTicketHandler(userId) {
                this.$store.commit('setLoading', true);
                assignTicket({
                    AssignTo: userId,
                    TicketReference: this.ticket.TicketReference
                })
                .then(() => {
                    this.$store.commit('setLoading', false);
                    this.forwardUserPopup = true;
                }).catch(() => {
                    this.$store.commit('setLoading', false);
                })
            },
            backToTicketList() {
                // window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/tasks');
                if(window.history.length > 1){
                    // this.prevRoute !== null ? this.$router.push(this.prevRoute) : this.$router.push(sessionStorage.getItem('previousRoute'));
                    this.prevRoute !== null ? this.$router.push(this.prevRoute) : this.$router.go(-1);
                }else{
                    window.close();
                }
                // window.history.length > 1 ? this.$router.push(this.prevRoute) : window.close();
            },
            openNotes() {
                this.isNotesVisible = true;
            },
            hideNotesModal() {
                this.isNotesVisible = false;
            },
            nextStep() {
                this.setActiveStep(this.activeStep.id + 1)
            },
            prevStep() {
                this.setActiveStep(this.activeStep.id - 1)
            },
            getData() {
                const data = {
                    ticket_reference: this.ticketReference,
                    user_id: this.userData.user_id
                }; 
                this.$store.dispatch('getTicket', data,this.userData)
            },
            setStepsHandler()  {
                // TODO: Refactor
                let selectedConfig = this.ticket.process_id;
                if (this.ticket.process_id === INCORPORATE_PROCESS_ID
                    && this.ticket.EntityType !== 'LP'
                    && this.ticket.EntityType !== 'Trust'
                    && this.ticket.EntityType !== 'Foundation' 
                    && this.ticket.step == 1) {
                    selectedConfig = `${INCORPORATE_PROCESS_ID}_init`;
                }
                if (this.ticket.process_id === CONTINUATION_PROCESS_ID
                    && this.ticket.EntityType !== 'LP'
                    && this.ticket.EntityType !== 'Trust'
                    && this.ticket.EntityType !== 'Foundation' 
                    && this.ticket.step == 1) {
                    selectedConfig = `${CONTINUATION_PROCESS_ID}_init`;
                }
                if(this.ticket.process_id === 307 && this.ticket.EntityType === 'Trust'){
                    selectedConfig = `307_init`;
                }
                if(this.ticket.process_id === 106 && this.ticket.EntityType === 'Foundation'){
                    selectedConfig = `106_foundation`;
                }
                if(this.ticket.process_id === 111 && this.ticket.invoice_id !== null){
                    selectedConfig = `111_fee`;
                }
                const stepsVar = stepsConfig[selectedConfig];
                if(this.pcAdmin.Observation === 1 && !this.findObserver(stepsVar)){
                    var observationStep = {
                        component: Observation,
                        id: stepsVar.length,
                        isActive: false,
                        title: 'Observation' 
                    }
                    stepsVar.splice(stepsVar.length - 1, 0, observationStep);
                    stepsVar[stepsVar.length -1].id = stepsVar.length;
                    this.setSteps(stepsVar);
                    this.setActiveStep(1)
                }
                else if(this.pcAdmin.Observation === 0 && this.findObserver(stepsVar)){
                    stepsVar.splice(stepsVar.length - 2, 1);
                    stepsVar[stepsVar.length -1].id = stepsVar.length ;
                    this.setSteps(stepsVar);
                    this.setActiveStep(1)
                }
                else{
                    this.setSteps(stepsConfig[selectedConfig]);
                    this.setActiveStep(1)
                }
            },
            findObserver(items){
                var check = items.find( item =>{ return item.title === 'Observation'});
                return check === undefined ? false : true;
            },
            submitDecision(){
                this.$store.commit('setLoading', true);

                const data = {
                    process_id: this.ticket.process_id,
                    reference_id: this.ticket.reference_id,
                    TicketReference: this.ticket.TicketReference,
                    outcome: this.form.outcome !== ''? this.form.outcome : this.ticket.outcome,
                    comments: this.form.comments,
                    DispositionString: this.form.DispositionString,
                };
                processDecision(data).then(
                    res => {
                        this.emailSend.message = "The determination have been updated."
                        this.emailSend.popupVisible = true;
                    }
                ).catch(() => {
                    this.$store.commit('setLoading', false)
                })
            },
            finalResponseHandler(checklist) {
                this.$store.commit('setLoading', true);

                this.generateDecisionEmailHandler()
            },
            generateDecisionEmailHandler() {
                this.$store.commit('setLoading', true);
                const data = {
                    process_id: this.ticket.process_id,
                    reference_id: this.ticket.reference_id,
                    TicketReference: this.ticket.TicketReference,
                    outcome: this.form.outcome !== ''? this.form.outcome : this.ticket.outcome,
                    comments: this.form.comments,
                    DispositionString: this.form.DispositionString,
                };
                generateDecisionEmail(data).then(
                    this.generateEmail
                ).catch(() => {
                    this.$store.commit('setLoading', false)
                })
            },
            generateEmail(response) {
                if(this.processId == 101){
                    if(localStorage.refreshNameReservation){
                        localStorage.setItem('refreshNameReservation',false);
                        localStorage.setItem('refreshNameReservation',true);
                    }
                    else{
                        localStorage.setItem('refreshNameReservation',true);
                    }
                }
                if(this.processId == 702 && this.form.outcome !== 'RFI'){
                    this.$store.commit('setLoading', false);
                    if(localStorage.refreshPQ){
                        localStorage.setItem('refreshPQ',false);
                        localStorage.setItem('refreshPQ',true);
                    }
                    else{
                        localStorage.setItem('refreshPQ',true);
                    }
                    this.emailSend.message = "The PQ form has been processed."
                    this.emailSend.popupVisible = true;
                }
                else if(response.data[0][0].isBatchResponse && response.data[0][0].isBatchResponse == 1 && this.form.outcome !== 'RFI' && this.ticket.batchCount !== 1){
                    
                    this.$store.commit('setLoading', false);
                    this.emailSend.message = "The name reservation request has been added to list of processed names."
                    this.emailSend.popupVisible = true;

                }
                else if(this.ticket.process_id == 111){
                    this.$store.commit('setLoading', false);
                    this.emailSend.message = "This ticket has been processed."
                    this.emailSend.popupVisible = true;
                }
                else{
                    this.email.isGenerated = true;
                    const { EmailSubject, EmailBody, Emailtemplate_id, Attachment, DocumentName, ToEmail, printqueue, fsaref, Attachmentjson } = response.data[0][0];
                    this.email.fsaref = fsaref;
                    this.email.subject = EmailSubject;
                    this.email.subject = EmailSubject;
                    this.email.printqueue = !!printqueue;
                    this.email.body = EmailBody;
                    this.email.id = Emailtemplate_id;
                    this.email.to = ToEmail;
                    this.email.DocumentName = DocumentName;
                    this.email.Attachmentjson = Attachmentjson;
                    this.pcAdmin.Printq = this.email.printqueue;
                    if(response.data[0][0].Certificatebody){
                        this.email.Certificatebody = response.data[0][0].Certificatebody;
                    }
                    if(response.data[0][0].CC){
                        this.email.CC = response.data[0][0].CC;
                    }
                    this.$store.commit('setLoading', false)
                }
            },
            rfiHandler() {
                this.$store.commit('setLoading', true);

                this.generateRFIDecisionEmailHandler()
            },
            generateRFIDecisionEmailHandler() {
                this.$store.commit('setLoading', true);
                const data = {
                    process_id: this.ticket.process_id,
                    reference_id: this.ticket.reference_id,
                    TicketReference: this.ticket.TicketReference,
                    outcome: 'RFI',
                    isRFI: 1,
                    comments: this.form.comments,
                    DispositionString: this.form.DispositionString,
                };
                generateDecisionEmail(data).then(this.generateRFIEmail).catch(() => {
                    this.$store.commit('setLoading', false)
                })
            },
            generateRFIEmail(response) {
                this.form.outcome = 'RFI';
                this.rfiSendValues.isRFI = true;
                this.email.isGenerated = true;
                const { EmailSubject, EmailBody, Emailtemplate_id, Attachment, DocumentName, ToEmail, printqueue, fsaref, Attachmentjson } = response.data[0][0];
                this.email.fsaref = fsaref;
                this.email.subject = EmailSubject;
                this.email.printqueue = !!printqueue;
                this.email.body = EmailBody;
                this.email.id = Emailtemplate_id;
                this.email.to = ToEmail;
                this.email.DocumentName = DocumentName;
                this.email.Attachmentjson = Attachmentjson;
                this.pcAdmin.Printq = this.email.printqueue;
                if(response.data[0][0].Certificatebody){
                    this.email.Certificatebody = response.data[0][0].Certificatebody;
                }
                if(response.data[0][0].CC){
                    this.email.CC = response.data[0][0].CC;
                }
                this.$store.commit('setLoading', false)
            },
            openCertificate(){
                var myWindow=window.open('','','width=700,height=900');
                myWindow.document.write(this.email.Certificatebody);
            },
            processTicketHandler(mode) {
                this.$refs.emailValidator.validate().then(result => {
                    if (result) {
                        const checkAllAttachments = this.files.every( item => item.fileUpload == null ||item.fileUpload == undefined )
                        if(checkAllAttachments == true){
                            this.errors.notAllAttachmentSaved = false;
                            const data = {
                                mode,
                                process_id: this.ticket.process_id,
                                reference_id: this.ticket.reference_id,
                                TicketReference: this.ticket.TicketReference,
                                outcome: this.form.outcome !== ''? this.form.outcome : this.ticket.outcome,
                                comments: this.form.comments,
                                DispositionString: this.form.DispositionString,
                                subject: this.email.subject,
                                body: this.email.body,
                                fsaref: this.email.fsaref,
                            };
                            if(this.form.outcome !== '' && this.form.outcome == 'RFI'){
                                if(this.files.length>0) {
                                    const DocAttachmentJson = JSON.stringify(this.files);
                                    data.DocAttachmentJson = DocAttachmentJson;
                                }
                            }
                            this.$store.commit('setLoading', true);
                            processTicket(data).then(response => {
                                this.$store.commit('setLoading', false);
                                this.emailSend.popupVisible = true;
                                this.emailSend.message = response.message;
                                if(this.rfiSendValues.isRFI == true) {
                                    this.assignDeadlineForRFI();
                                }
                                if(this.ticket && this.ticket.process_id && this.ticket.process_id == 702){
                                    if(localStorage.refreshPQ){
                                        localStorage.setItem('refreshPQ',false);
                                        localStorage.setItem('refreshPQ',true);
                                    }
                                    else{
                                        localStorage.setItem('refreshPQ',true);
                                    }
                                }
                            }).catch(() => {
                                this.$store.commit('setLoading', false)
                            })
                        }
                        else{
                            this.errors.notAllAttachmentSaved = true   
                        }
                    }
                })
            },
            generatePdf(){
                if(this.ticket.PdfPath!=undefined && (this.ticket.PdfPath!==null || this.ticket.PdfPath!=='')) {
                    window.open(this.ticket.PdfPath,'_blank');
                } else {
                    return false;
                }
            }
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
        margin: -39px -30px 30px;
        line-height: 35px;
        justify-content: center;
        z-index: 10;
        position: sticky;
        top: 34.5px;
        & .infoBlock:nth-child(1){
            text-align: left;
            margin: 0px auto 0xp 0px;
            width: 33.33%;
            line-height: 22px;
        }
        & .infoBlock:nth-child(2){
            text-align: center;
            margin: 0px auto;
            width: 33.33%;
            line-height: 22px;
        }
        & .infoBlock:nth-child(3){
            text-align: right;
            margin: 0px 0px 0px auto;
            width: 33.33%;
            line-height: 22px;
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
    .notesLinkDisabled{
        line-height: 35px;
        color: #000;
        font-weight: 700;
        cursor: not-allowed;
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
