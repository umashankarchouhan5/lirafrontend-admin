<template>
    <div :class="$style.review">
        <ValidationObserver ref="validator">
            <CenterBlock width="1000">
                <Decision :variants="['APP', 'REJ', 'RFI']" :requiredRule="isRFI == true ? false : true" :readonly="readOnly" @onChange="onChangeDecision" :selectRFI="isRFI"  />

                <!-- Submit button button -->
                
                <div v-if="(!readOnly || (readOnly && ticket.outcome !== null)) && ticket.process_id !== 702 && ticket.EnableDetermination == 1 && userData.department_id !== 1 && ticket.process_id !== 804 && ticket.process_id !== 803 && isRFI == false" >
                    <FormButton 
                        type="success" 
                        @click="save('submitDecision')" 
                        left-icon="md-checkmark-circle-outline" :disabled="readOnly"
                    >
                        Submit
                    </FormButton>
                    <br />
                </div>

                <NotesTable v-if="notes.length > 0" />
                <h6 v-if="value.outcome === 'REJ' || value.outcome === 'RFI'">Comments for Applicant</h6>
                <FormRow v-if="value.outcome === 'REJ' || value.outcome === 'RFI'">
                    <div class="col-sm-12">
                        <InputTextArea name="Comment"
                            rows="4"
                            :rules="{required: value.outcome === 'REJ' || value.outcome === 'RFI'}"
                            v-model="value.comments" 
                            :readonly="readOnly"
                            :maxlength="250"
                        />
                    </div>
                </FormRow>
                <template v-if="getCommentsLog.length > 0">
                    <h6>Previous Comments</h6>
                    <FormRow>
                        <div class="col-sm-12">
                            <DataTable :data="getCommentsLog" :columns="commentLogTableColumns" />
                        </div>
                    </FormRow>
                </template>

                <!-- SUbtasks List -->
                <Actions 
                    :readonly="(readOnly && ( userData.department_id == 1 || ticket.process_id == 804 || ticket.process_id == 803)) || (ticket.isClosed == 1) || (ticket.adminuser_id !== userData.user_id)" 
                    v-if="pcAdmin.NeedAction" 
                    @actionList="onActionData">
                </Actions>

                <div :class="$style.error" v-if="errors.subTaskList" >All SubTask Must Be Closed</div>

                <!-- Documents uploaded by admin -->
                <AdminDocument readonly @docRefresh="refreshAdminDoc"  ref="adminDocTable" />
                
                <!-- checklist -->
                <h6 >Checklist</h6>
                <CheckList 
                    :readonly="(readOnly && ( userData.department_id == 1 || ticket.process_id == 804 || ticket.process_id == 803)) || (ticket.isClosed == 1) || (ticket.adminuser_id !== userData.user_id)" 
                    :reference-id="ticket.reference_id" 
                    :error="errors.checkList" 
                    @listReceived="onChangeCheckbox" 
                    @onChange="onChangeCheckbox" 
                />

                <div :class="$style.error" v-if="errors.allDocumentsAccepted">All documents must be approved!</div>
                <div :class="$style.error" v-if="errors.observationCompany">Please save company in observation tab before closing this ticket!</div>
                <div :class="$style.error" v-if="errors.checkPQApproved">Please review all PQ positions before proceeding.</div>
                
                <FormRow>
                    <div class="col-sm-12">
                        <ButtonGroup>
                            <FormButton type="primary" @click="prevStep" left-icon="ios-arrow-back" >Previous</FormButton>

                            <FormButton type="success" @click="sendEmail" left-icon="md-checkmark-circle-outline" v-if="ticket.adminuser_id == userData.user_id && pcAdmin.CanSendEmail === 1" >Send Email</FormButton>
                            
                            <FormButton type="success" @click="() => {uploadDocument.visible = true}" right-icon="md-cloud-upload-outline" :disabled="readOnly"  v-if="!readOnly && pcAdmin && pcAdmin.uploadDoc && pcAdmin.uploadDoc == 1" >Upload Document</FormButton>

                            <FormButton 
                                type="success" 
                                @click="save" 
                                left-icon="md-checkmark-circle-outline" 

                                v-if="((!readOnly && (userData.department_id == 1 || ticket.process_id == 804 || ticket.process_id == 803)) || (readOnly && ticket.EnableFinalResponse === 1 && ticket.isClosed == 0) || (!readOnly && ticket.EnableFinalResponse === 1 && userData.department_id !== 1 && ticket.process_id !== 804 && ticket.process_id !== 803)) && ticket.process_id !== 702" 

                                :disabled="(readOnly && ticket.EnableFinalResponse === 1 && (userData.department_id == 1 || ticket.process_id == 804 || ticket.process_id == 803)) || ticket.isClosed === 1"
                            >
                                <span v-if="pcAdmin.addToList && pcAdmin.addToList == 1 && value.outcome !== 'RFI' && ticket.batchCount !== 1">Add To List</span>
                                <span v-else>Final Response</span>

                            </FormButton>
                            
                            <FormButton 
                                type="success" 
                                @click="openRFI" 
                                left-icon="md-checkmark-circle-outline" 
                                :disabled="readOnly"
                                v-if="(!readOnly || (readOnly  && ticket.outcome !== null)) && isRFI == false && pcAdmin.isRFIbutton == 1  && userData.department_id !== 1 && ticket.process_id !== 804 && ticket.process_id !== 803"
                            >
                                Request for Information
                            </FormButton>
                            <FormButton type="success" @click="save" left-icon="md-checkmark-circle-outline" v-if="ticket.process_id == 702"><span>Update</span></FormButton>

                            <FormButton type="success" @click="setTicketForwarded" right-icon="md-arrow-round-forward" v-if="pcAdmin.Canforward" >{{ticket.fwdLabel}}</FormButton>

                            <FormButton type="success" @click="openEnforcement" v-if="pcAdmin.isEnforcement" >Enforcement Action</FormButton>
                        </ButtonGroup>
                    </div>
                </FormRow>
                <FormRow v-if="isTicketForwarded">
                    <Loader v-if="forwardingUsersIsLoading" />
                    <div class="col-sm-4">
                        <FormSelect v-model="userToForward" :items="forwardingUsers" item-name="forwardto" item-value="id"  />
                        <div :class="$style.error" v-if="errors.userToForward">
                            You should select user to proceed
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <FormButton @click="forwardTicketHandler" >Send</FormButton>
                    </div>
                </FormRow>
            </CenterBlock>
        </ValidationObserver>

        <!-- upload document popup -->
        <Popup title="Upload Document" width="1000" type="info" :value="uploadDocument.visible" @close="() => uploadDocument.visible = false" :mask-closable="true" :closable="true">
            
            <AdminDocument :readonly="readOnly" @docRefresh="refreshAdminDoc" />
            <FormButton slot="footer" @click="() => uploadDocument.visible = false">Close</FormButton>
        </Popup>

        <!-- request for enforcement popup -->
        <Popup title="Request for Information" width="1000" type="info" :value="rfiModal.visible" @close="() => closeRfiModal()" :mask-closable="false" :closable="true">
            <ValidationObserver ref="RFIValidator">
                <FormRow>
                    <div class="col-sm-12">
                        <InputTextArea name="Comment"
                            label="Comment"
                            rows="4"
                            :rules="{required: value.outcome === 'REJ' || value.outcome === 'RFI'}"
                            v-model="value.comments" 
                            :readonly="readOnly"
                            :maxlength="250"
                        />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-4">
                        <InputDate 
                            name="Deadline"
                            label="Deadline"
                            rows="4"
                            v-model="value.dueDate"
                            :options="options"
                        />
                    </div>
                </FormRow>
            </ValidationObserver>
            <FormButton 
                slot="footer"
                type="success" 
                @click="save('rfi')" 
                left-icon="md-checkmark-circle-outline" 
            >
                Request for Information 
            </FormButton>
            <FormButton slot="footer" @click="() => closeRfiModal()">Close</FormButton>
        </Popup>

        <!-- enforcement popup  -->
        
        <Popup title="Enforcement Action" width="1000" type="info" :value="enforcementModal" @close="() => enforcementModal = false" :mask-closable="false" :closable="true">
            <TicketHeader v-if="ticketValue" :ticketValue="ticketValue" typeOfHeader="popup" />
            <!-- <div :class="$style.checkboxStyle" >
                <FormCheckbox v-model="enforcement.signee" name="Select signee" :trueValue="1" :falseValue="0"> Select Signee </FormCheckbox>
            </div>
            <div :class="$style.indentStyle">
                <FormRow v-if="enforcement.signee == 1">
                    <div class="col-sm-4" :class="$style.filterItem">
                        <FormSelect  label="Signee" :items="signeeList" item-name="Fname" item-value="id" v-model="value.signee_id"   />
                    </div> 
                </FormRow>
            </div>
             -->
            <div :class="$style.checkboxStyle" >
                <FormCheckbox v-model="enforcement.sendLetter" name="Send Letter" :trueValue="1" :falseValue="0"> Send Letter </FormCheckbox>
            </div>

            <div :class="$style.checkboxStyle" >
                <FormCheckbox v-model="enforcement.status"  name="Update Status" :trueValue="1" :falseValue="0"> Update Status </FormCheckbox>
            </div>
            <div :class="$style.indentStyle" v-if="enforcement.status == 1">
                <ValidationObserver ref="enforcementStatusValidator">
                    <FormRow>
                        <div class="col-sm-4" :class="$style.filterItem">
                            <FormSelect :width="200" label="Enforcement Status" rules="required" :items="enforcementStatusses" item-name="name" item-value="id" v-model="value.status_id"  />
                        </div> 
                        <!-- <div class="col-sm-4">
                            <InputDate 
                                name="Deadline"
                                label="Deadline"
                                rows="4"
                                v-model="value.dueDate"
                                :options="options"
                            />
                        </div> -->
                        <div class="col-sm-4" :class="$style.filterItem">
                            <FormCheckbox v-model="enforcementIsCompliant" name="IsCompliant" :trueValue="1" :falseValue="0"> Is Compliant </FormCheckbox>
                        </div> 
                    </FormRow>
                    <FormRow>
                        <div class="col-sm-12" :class="$style.filterItem">
                            <InputTextArea 
                                name="Final Notes"
                                label="Final Notes"
                                rules="required"
                                rows="4"
                                v-model="enforcementFinalNotes" 
                                :maxlength="250"  />
                        </div>  
                    </FormRow>
                </ValidationObserver>
                <FormButton @click="() => changeStatus()" type="success">Save</FormButton>
            </div>

            <div :class="$style.checkboxStyle" >
                <FormCheckbox v-model="enforcement.restriction" name="Licensee Restriction" :trueValue="1" :falseValue="0"> Licensee Restriction </FormCheckbox>
            </div>
            <div :class="$style.indentStyle">
                <ButtonGroup v-if="enforcement.restriction == 1">
                    <FormButton @click="() => restrictUser(1)">Restrict</FormButton>
                    <FormButton @click="() => restrictUser(0)">UnRestrict</FormButton>
                    <FormButton @click="() => blockUser()">Block</FormButton>
                </ButtonGroup>
            </div>
            
            <div :class="$style.checkboxStyle" >
                <FormCheckbox v-model="enforcement.pqRegister" name="Update PQ Register" :trueValue="1" :falseValue="0"> Update PQ Register</FormCheckbox>
            </div>

            
            <div :class="$style.checkboxStyle" >
                <FormCheckbox v-model="enforcement.calendar" name="Update Calendar" :trueValue="1" :falseValue="0"> Update Calendar </FormCheckbox>
            </div>
            <!-- <div :class="$style.indentStyle">
                
                <FormRow v-if="enforcement.calendar == 1">
                    <div class="col-sm-4">
                        <InputDate 
                            name="Deadline"
                            label="Deadline"
                            rows="4"
                            v-model="value.dueDate"
                            :options="options"
                        />
                    </div>
                </FormRow>
            </div> -->
            
            <div :class="$style.checkboxStyle" >
                <FormCheckbox v-model="enforcement.notifyDirectors" name="Notify Directors" :trueValue="1" :falseValue="0"> Notify Directors </FormCheckbox>
            </div>
            
            <div :class="$style.checkboxStyle" >
                <FormCheckbox v-model="enforcement.closeTicket" name="Close Ticket" :trueValue="1" :falseValue="0"> Close Ticket </FormCheckbox>
            </div>

            <FormButton slot="footer" @click="() => enforcementModal = false">Close</FormButton>
        </Popup>
        <Popup title="Success" type="success" :value="successModal.visible" @close="() => successModal.visible = false" :mask-closable="true" :closable="true">
            {{ successModal.message }}
            <FormButton slot="footer" @click="() => successModal.visible = false">Close</FormButton>
        </Popup>
        <Popup title="Confirmation" width="600" type="info" :value="confirmationModal.visible" @close="() => openConfirmationModal(false)" :mask-closable="true" :closable="true">
            <p>Are you sure you wish to proceed with {{ getOutcomeText }} ?</p>
            <FormButton slot="footer" type="success" @click="save">Proceed</FormButton>
            <FormButton slot="footer" @click="() => openConfirmationModal(false)">Close</FormButton>
        </Popup>
       
    </div>
</template>

<script>
    import DataTable from 'Components/DataTable';
    import CheckList from 'Components/checkList/CheckList';
    import NotesTable from 'Components/notesTable/NotesTable'
    import Decision from 'Components/decision/Decision'
    import commentLogTableColumns from '../config/commentLogTableColumns.js'
    import { ValidationObserver } from 'vee-validate'
    import Actions from 'Components/layout/user/actions';
    import AdminDocument from 'Components/adminDocument';
    import InputDate from 'Components/form/InputDate';
    import { getSigneeList, getEnforcementStatus, restrictLicensee , blockLicensee, enforcementByAdminUser, updateObservation } from '../config/api';

    export default {
        name: "Review",
        data() {
            return {
                
                checkList: [],
                errors: {
                    checkList: false,
                    allDocumentsAccepted: false,
                    userToForward: false,
                    subTaskList: false,
                    observationCompany: false,
                    checkPQApproved: false,
                },
                commentLogTableColumns,
                userToForward: null,
                isTicketForwarded: false,
                actionData: [],
                uploadDocument: {
                    visible: false,
                },
                isRFI: false,
                rfiModal: {
                    visible: false,
                },
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() < Date.now();
                    }
                },
                enforcementModal: false,
                enforcementAction: null,
                enforcementActions: [
                    { name: 'Select Signee', value: 'signee' },
                    { name: 'Send Letter', value: 'sendLetter' },
                    { name: 'Update PQ Register', value: 'pqRegister' },
                    { name: 'Update Calendar', value: 'calendar' },
                    { name: 'Update Status', value: 'status' },
                    { name: 'License Restriction', value: 'restriction' },
                    { name: 'Notify Directors', value: 'notifyDirectors' },
                    { name: 'Close Ticket', value: 'closeTicket' },
                ],
                signeeList: [],
                enforcementStatusses: [],
                enforcement: {
                    signee: 0,
                    sendLetter: 0,
                    pqRegister: 0,
                    calendar: 0,
                    status: 0,
                    restriction: 0,
                    notifyDirectors: 0,
                    closeTicket: 0,
                },
                enforcementIsCompliant: 0,
                enforcementFinalNotes: '',
                successModal: {
                    visible : false,
                    message: ''
                },
                ticketValue: null,
                confirmationModal: {
                    visible: false,
                    clicked: false,
                }
            }
        },
        components: {
            DataTable,
            CheckList,
            NotesTable,
            Decision,
            ValidationObserver,
            Actions,
            AdminDocument,
            InputDate
        },
        props: {
            value: {
                type: Object,
                required: true,
            }
        },
        watch: {
            enforcementAction(val) {
                if(val == 'sendLetter') {
                    this.enforcementModal == false;
                    this.sendEmail();
                }
                else if( val == 'signee'){
                    getSigneeList().then(
                        res => {
                            this.signeeList = res.data;
                        }
                    )
                }
                else if( val== 'status'){
                    getEnforcementStatus().then(
                        res => {
                            this.enforcementStatusses = res.data;
                        }
                    )
                }
            },
            'enforcement.signee': function(val) {
                if(val == 1) {
                    getSigneeList().then(
                        res => {
                            this.signeeList = res.data;
                        }
                    )
                }
            },
            'enforcement.sendLetter': function(val) {
                if(val == 1) {
                    this.enforcementModal == false;
                    this.sendEmail();
                }
            },
            'enforcement.status': function(val) {
                if(val == 1) {
                    getEnforcementStatus().then(
                        res => {
                            this.enforcementStatusses = res.data;
                        }
                    )
                }
            },
            'enforcement.pqRegister': function(val) {
                if(val == 1) {
                    window.open(`/PQReport/${this.ticket.company_id}`,'_blank')
                    // this.$router.push(`/PQReport/${this.ticket.company_id}`)
                }
            },
            'enforcement.calendar': function(val) {
                if(val == 1) {
                    window.open(`/companyCalendar/${this.ticket.company_id}`,'_blank')
                    // this.$router.push(`/companyCalendar/${this.ticket.company_id}`)
                }
            },
        },
        computed: {
            readOnly() {
                return this.$store.state.ticket.readOnly;
            },
            forwardingUsers() {
                return this.$store.state.ticket.forwardingUsers;
            },
            forwardingUsersIsLoading() {
                return this.$store.state.ticket.forwardingUsersIsLoading;
            },
            ticket() {
                return this.$store.state.ticket.ticket;
            },
            isAllDocumentsApproved() {
                return this.$store.state.ticket.isAllDocumentsApproved;
            },
            processId() {
                return this.$store.state.common.currentProcessId
            },
            userData() {
                return this.$store.state.user.user
            },
            notes() {
                return this.$store.state.notesTable.notes
            },
            pcAdmin(){
                return this.$store.state.ticket.pcAdmin;
            },
            newCompanyModule() {
                return this.$store.state.ticket.newCompanyModule;
            },
            getCommentsLog() {
                if(typeof this.ticket.commentLog == 'string'){
                    return JSON.parse(this.ticket.commentLog);
                }
                else if(this.ticket.commentLog == null ){
                    return [];
                }
                else{
                    return this.ticket.commentLog;
                }
            },
            getOutcomeText() {
                if(this.value.outcome == 'APP') return 'Approval';
                else if(this.value.outcome == 'REJ') return 'Rejection';
                else return '';
            }
        },
        methods: {

            openConfirmationModal(val) {
                console.log(val)
                this.confirmationModal.visible = val;
                this.confirmationModal.clicked = val;
            },
            changeStatus() {
                this.$refs.enforcementStatusValidator.validate().then(result => {
                    if(result){
                        const data = {
                            isCompliant: this.enforcementIsCompliant,
                            finalActionNotes: this.enforcementFinalNotes,
                            status_id: this.value.status_id,
                            process_id: this.ticket.process_id,
                            reference_id: this.ticket.reference_id,
                            license_id: this.ticket.license_id,
                            TicketReference: this.ticket.TicketReference,
                            // deadline: this.ticket.deadline,
                        } 
                        updateObservation(data).then(
                            res => {
                                this.enforcement.status = 0;
                                this.enforcementModal = false;
                                this.successModal.message = "The Status of Enforcement Action has been updated.";
                                this.successModal.visible = true;
                            }
                        )
                    }
                })
            },
            restrictUser(type) {
                const data = {
                    license_id: this.ticket.license_id,
                    restrict: type
                }
                restrictLicensee(data).then(
                    res => {
                        this.enforcementModal = false;
                        this.successModal.message = res.message;
                        this.successModal.visible = true;
                    }
                )
            },
            blockUser() {
                const data = {
                    license_id: this.ticket.license_id,
                }
                blockLicensee(data).then(
                    res => {
                        this.enforcementModal = false;
                        this.successModal.message = res.message;
                        this.successModal.visible = true;
                    }
                )
            },
            openEnforcement() {
                this.enforcementModal = true;
                this.ticketValue = {
                    First: this.ticket.CompanyName,
                    Second: '',
                    Third: this.ticket.Type
                }
            },
            closeRfiModal() {
                this.rfiModal.visible = false;
                this.isRFI = false;
            },
            refreshAdminDoc(){
                this.uploadDocument.visible = false;
                this.$refs.adminDocTable.getData();
            },
            sendEmail(){
                this.$emit('onSendMail');
            },
            onActionData(data){
                this.actionData = data;
            },
            forwardTicketHandler() {
                this.errors.userToForward = this.isTicketForwarded && !this.userToForward;
                if (!this.errors.userToForward) {
                    this.$emit('onForwardTicket', this.userToForward)
                }
            },
            setTicketForwarded() {
                this.isTicketForwarded = true;
                this.$store.dispatch('fetchForwardingUsers', {
                    process_id: this.ticket.process_id,
                    reference_id: this.ticket.reference_id,
                })
            },
            onChangeCheckbox(data) {
                this.checkList = data
            },
            onChangeDecision(data) {
                this.value.comments = data.DispositionDescriptions;
                this.value.DispositionString = data.DispositionString;
                this.value.outcome = data.outcome;
                if( this.value.outcome !== 'RFI'){
                    this.isRFI = false;
                }
            },
            prevStep() {
                this.$emit('prevStep')
            },
            openRFI() {
                this.value.outcome = 'RFI';
                this.isRFI = true;
                this.rfiModal.visible = true;
            },
            save(val) {
                this.$refs.validator.validate().then(result => {
                    if((val !== undefined && val == 'rfi') || this.value.outcome == 'RFI'){
                        this.$refs.RFIValidator.validate().then(result => {
                            if(result){
                                this.closeRfiModal();
                                this.$emit('onRFIResponse', this.checkList);
                            }
                        })
                    }
                    else if(val !== undefined && val == 'submitDecision'){
                        this.$emit('onSubmitDecision', this.checkList);
                    }
                    else{
                        this.errors.checkList = this.checkList.length > 0 && !this.checkList.every(item => item.checked);

                        if (this.value.outcome === 'APP' || this.ticket.outcome == 'APP') {

                            this.errors.allDocumentsAccepted = !this.isAllDocumentsApproved;
                        }
                        if( (this.ticket.process_id == 700 || this.ticket.process_id == 701 || this.ticket.process_id == 704) && (this.value.outcome === 'APP' || this.ticket.outcome == 'APP') ){

                            this.errors.checkPQApproved = this.ticket.persons && this.ticket.persons.length > 0 && !this.ticket.persons.every( item => {
                                return item.Status_id == 30 || item.Status_id == 31
                            })
                        }
                        if(this.newCompanyModule.indexOf(this.ticket.process_id) !== -1 && (this.value.outcome === 'APP'|| this.ticket.outcome == 'APP')){

                            this.errors.observationCompany = this.ticket.Company_id == null ? true : false;
                        }

                        if(this.pcAdmin.NeedAction && (this.value.outcome === 'APP' || this.ticket.outcome == 'APP')){

                            this.errors.subTaskList = this.actionData.length > 0 && !this.actionData.every(item => {
                                return item.Status === "Closed"
                            });
                            if (this.value.outcome === 'APP' || this.ticket.outcome == 'APP') {

                                if (result && !this.errors.checkList && !this.errors.allDocumentsAccepted && !this.errors.subTaskList  && !this.errors.observationCompany && !this.errors.checkPQApproved) {

                                    if (typeof this.pcAdmin == 'object' && this.pcAdmin.ReconfirmOnSubmit == 1 && this.value.outcome !== null && this.value.outcome != 'RFI' && this.confirmationModal.clicked == false ){

                                        this.openConfirmationModal(true)
                                    }
                                    else {
                                        this.openConfirmationModal(false)
                                        this.$emit('onFinalResponse', this.checkList);
                                    }
                                    
                                }
                            }else{

                                if (result && !this.errors.checkList && !this.errors.allDocumentsAccepted) {

                                    if(typeof this.pcAdmin == 'object' && this.pcAdmin.ReconfirmOnSubmit == 1 && this.value.outcome !== null && this.value.outcome != 'RFI' && this.confirmationModal.clicked == false ){

                                        this.openConfirmationModal(true)
                                    }
                                    else {
                                        this.openConfirmationModal(false)
                                        this.$emit('onFinalResponse', this.checkList);
                                    }
                                }

                            }
                        }
                        else{

                            if (result && !this.errors.checkList && !this.errors.allDocumentsAccepted && !this.errors.observationCompany && !this.errors.checkPQApproved) {
                                
                                if(typeof this.pcAdmin == 'object' && this.pcAdmin.ReconfirmOnSubmit == 1 && this.value.outcome !== null && this.value.outcome != 'RFI' && this.confirmationModal.clicked == false ){

                                    this.openConfirmationModal(true)
                                }
                                else {
                                    this.openConfirmationModal(false)
                                    this.$emit('onFinalResponse', this.checkList);
                                }
                            }
                        }
                    }
                    
                });
                
            },
        }
    }
</script>

<style lang="scss" module>
    .indentStyle {
        margin-left: 20px;
    }
    .checkboxStyle {
        padding: 5px 8px;
        border-bottom: 1px solid #e1e1e1;
        background: lighten(#ccc, 17%);
        margin-bottom: 10px;
    }
    .review {
        h6 {
            font-size: 14px;
            margin: 40px 0 5px;
        }
    }
    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 13px;
        font-weight: 400;
        margin-bottom: 20px;
    }
</style>
