<template>
    <div :class="$style.review">
        <ValidationObserver ref="validator">
            <CenterBlock width="1000">
                <Decision :variants="['APP', 'REJ', 'RFI']" :requiredRule="isRFI == true ? false : true" :readonly="readOnly" @onChange="onChangeDecision" :selectRFI="isRFI"  />

                <!-- RFI button -->
                <div v-if="(!readOnly || (readOnly && ticket.outcome !== null)) && ticket.EnableDetermination == 1 && userData.department_id !== 1 && ticket.process_id !== 804 && ticket.process_id !== 803" :disabled="readOnly">
                    <FormButton 
                        type="success" 
                        @click="save('submitDecision')" 
                        left-icon="md-checkmark-circle-outline" 
                        
                    >
                        Submit
                    </FormButton>
                    <br />
                </div>

                <NotesTable v-if="notes.length > 0" />
                <h6  v-if="value.outcome === 'REJ' || value.outcome === 'RFI'">Comments for Applicant</h6>
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

                <!-- subtasks list -->
                <Actions 
                    :readonly="(readOnly && ( userData.department_id == 1 || ticket.process_id == 804 || ticket.process_id == 803)) || (ticket.isClosed == 1) || (ticket.adminuser_id !== userData.user_id)" 
                    v-if="pcAdmin.NeedAction" 
                    @actionList="onActionData">
                </Actions>
                <div :class="$style.error" v-if="errors.subTaskList" >All SubTask Must Be Closed</div>

                <!--doc uploaded by admin list -->
                <AdminDocument readonly ref="adminDocTable" />

                <h6 >Checklist</h6>
                <CheckList 
                    :readonly="(readOnly && ( userData.department_id == 1 || ticket.process_id == 804 || ticket.process_id == 803)) || (ticket.isClosed == 1) || (ticket.adminuser_id !== userData.user_id)" 
                    :reference-id="ticket.reference_id" 
                    :error="errors.checkList" 
                    @listReceived="onChangeCheckbox" 
                    @onChange="onChangeCheckbox"
                />
                
                <div :class="$style.error" v-if="errors.rodNotAllConfirmedCheck">Please confirm all directors before closing this ticket!</div>
                <div :class="$style.error" v-if="errors.observationCompany">Please save company in observation tab before closing this ticket!</div>
                <FormRow>
                    <div class="col-sm-12">
                        <ButtonGroup>
                            <FormButton type="primary" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>

                            <FormButton type="success" @click="sendEmail" left-icon="md-checkmark-circle-outline" v-if="ticket.adminuser_id == userData.user_id && pcAdmin.CanSendEmail === 1" >Send Email</FormButton>

                            <FormButton type="success" @click="() => {uploadDocument.visible = true}" right-icon="md-cloud-upload-outline" :disabled="readOnly"  v-if="!readOnly && pcAdmin && pcAdmin.uploadDoc && pcAdmin.uploadDoc == 1" >Upload Document</FormButton>

                            <FormButton type="success" 
                                @click="save" 
                                left-icon="md-checkmark-circle-outline" 

                                v-if="((!readOnly && (userData.department_id == 1 || ticket.process_id == 804 || ticket.process_id == 803)) || (readOnly && ticket.EnableFinalResponse === 1 && ticket.isClosed == 0) || (!readOnly && ticket.EnableFinalResponse === 1 && userData.department_id !== 1 && ticket.process_id !== 804 && ticket.process_id !== 803)) && ticket.process_id !== 702" 

                                :disabled="(readOnly && ticket.EnableFinalResponse === 1 && (userData.department_id == 1 || ticket.process_id == 804 || ticket.process_id == 803)) || ticket.isClosed === 1"
                            >
                                <span v-if="pcAdmin.addToList && pcAdmin.addToList == 1 && value.outcome !== 'RFI'  && ticket.batchCount !== 1">Add To List</span>
                                <span v-else>Final Response</span>
                            </FormButton>

                            
                            <FormButton 
                                type="success" 
                                @click="openRFI" 
                                left-icon="md-checkmark-circle-outline" 
                                :disabled="readOnly" v-if="(!readOnly || (readOnly  && ticket.outcome !== null)) && isRFI == false && pcAdmin.isRFIbutton == 1  && userData.department_id !== 1 && ticket.process_id !== 804 && ticket.process_id !== 803"
                            >
                                Select RFI 
                            </FormButton>

                            <FormButton 
                                type="success" 
                                @click="save('rfi')" 
                                left-icon="md-checkmark-circle-outline" 
                                v-if="(!readOnly || (readOnly  && ticket.outcome !== null && pcAdmin.isRFIbutton == 1)) && isRFI == true" :disabled="readOnly"
                            >
                                Request for Information 
                            </FormButton>

                            <FormButton type="success" @click="setTicketForwarded" right-icon="md-arrow-round-forward" v-if="pcAdmin.Canforward" >{{ticket.fwdLabel}}</FormButton>
                        </ButtonGroup>
                    </div>
                </FormRow>
                <FormRow v-if="isTicketForwarded">
                    <Loader v-if="forwardingUsersIsLoading" />
                    <div class="col-sm-4">
                        <FormSelect v-model="userToForward" :items="forwardingUsers" item-name="forwardto" item-value="id" />
                        <div :class="$style.error" v-if="errors.userToForward">
                            You should select user to proceed
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <FormButton @click="forwardTicketHandler">Send</FormButton>
                    </div>
                </FormRow>
            </CenterBlock>
        </ValidationObserver>
        <Popup title="Upload Document" width="1000" type="info" :value="uploadDocument.visible" @close="() => uploadDocument.visible = false" :mask-closable="true" :closable="true">
            
            <AdminDocument :readonly="readOnly" @docRefresh="refreshAdminDoc" />
            <FormButton slot="footer" @click="() => uploadDocument.visible = false">Close</FormButton>
        </Popup>

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

    export default {
        name: "Review",
        props: {
            value: {
                type: Object,
                required: true,
            }
        },
        data() {
            return {
                checkList: [],
                errors: {
                    checkList: false,
                    userToForward: false,
                    rodNotAllConfirmedCheck: false,
                    subTaskList: false,
                    observationCompany: false
                },
                actionData: [],
                commentLogTableColumns,
                userToForward: null,
                isTicketForwarded: false,
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
        computed: {
            rodConfirmedCheck() {
                return this.$store.state.ticket.rodNotAllConfirmedCheck;
            },
            readOnly(){
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
            closeRfiModal() {
                this.rfiModal.visible = false;
                this.isRFI = false;
            },
            
            onActionData(data){
                this.actionData = data;
            },
            refreshAdminDoc(){
                this.uploadDocument.visible = false;
                this.$refs.adminDocTable.getData();
            },
            sendEmail(){
                this.$emit('onSendMail');
            },
            forwardTicketHandler() {
                // TODO: refactor
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
                        if(this.ticket.process_id === 111 && this.rodConfirmedCheck !== false){

                            this.errors.rodNotAllConfirmedCheck = true;
                        }
                        if(this.newCompanyModule.indexOf(this.ticket.process_id) !== -1 && (this.value.outcome === 'APP' || this.ticket.outcome == 'APP')){

                            this.errors.observationCompany = this.ticket.Company_id == null ? true : false;
                        }
                          
                        if(this.pcAdmin.NeedAction && (this.value.outcome === 'APP' || this.ticket.outcome == 'APP')){

                            this.errors.subTaskList = this.actionData.length > 0 && !this.actionData.every(item => {
                                return item.Status === "Closed"
                            });

                            this.errors.checkList = this.checkList.length > 0 && !this.checkList.every(item => item.checked);

                            if (result && !this.errors.checkList && !this.errors.rodNotAllConfirmedCheck && !this.errors.subTaskList && !this.errors.observationCompany) {

                                if(typeof this.pcAdmin == 'object' && this.pcAdmin.ReconfirmOnSubmit == 1 && this.value.outcome !== null && this.value.outcome != 'RFI' && this.confirmationModal.clicked == false ){

                                    this.openConfirmationModal(true)
                                }
                                else {
                                    this.openConfirmationModal(false)
                                    this.$emit('onFinalResponse', this.checkList);
                                }
                            }
                        }
                        else{
                            this.errors.checkList = this.checkList.length > 0 && !this.checkList.every(item => item.checked);

                            if (result && !this.errors.checkList && !this.errors.rodNotAllConfirmedCheck && !this.errors.observationCompany) {

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
