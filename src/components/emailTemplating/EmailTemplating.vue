<template>
    <div>
        <ValidationObserver ref="emailValidator">
            <FormRow>
                <div class="col-sm-7">
                    <InputText readonly v-model="email.ToEmail" label="To:" />
                </div>
            </FormRow>
                
            <FormRow v-if="email.outcome == 'RFI'">
                <div class="col-sm-4">
                    <InputDate label="Deadline" :options="options" v-model="dueDate" />
                </div>
            </FormRow>

            <FormRow>
                <div class="col-sm-12">
                    <InputText v-model="email.EmailSubject" rules="required" label="Subject:" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12" v-if="email.CC && email.CC !== null">
                    <InputText v-model="email.CC" label="CC:" />
                </div>
            </FormRow>
            
            <h4>Letter to Send :</h4>
            <br />
            <FormRow>
                <div class="col-sm-12">
                    <EditorComponent v-model="email.EmailBody" :readonly="email.isEditable == 1 ? false : true" />
                    
                </div>
            </FormRow>
            
            <h4>Email Body :</h4>
            <br />
            <FormRow>
                <div class="col-sm-12">
                    <EditorComponent v-model="email.SimpleEmailBody" />
                </div>
            </FormRow>
            
            <!-- Attachments -->
            <Attachment v-if="additionalAttachment" v-model="files" :notAllAttachmentSaved="errors.notAllAttachmentSaved" @notAllSavedFalse="changeNotAllSavedStatus" /> 
        </ValidationObserver>
        <FormRow v-if=" email.Attachmentjson && email.Attachmentjson !== null ">
            <div class="col-sm-12" v-for="(file,ind) in parseAttachment(email.Attachmentjson)" :key="ind" >
                <a @click="openWindow(file.HTMLBody)">{{file.FileNamePrefix}}</a>
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-12">
                <ButtonGroup>
                    <FormButton left-icon="ios-send" type="success" @click="() => saveData()" >Preview</FormButton>
                    <FormButton  @click="() => backToList()" >Back to Tasks</FormButton>
                </ButtonGroup>
            </div>
        </FormRow>

        <!-- Preview modal -->
        <Popup title="Preview" width="1000" type="info" :value="previewModal.visible" @close="() => previewModal.visible = false" :mask-closable="true" :closable="true">
            
            <EmailPreview :email-data="previewData" />

            <FormButton slot="footer" left-icon="ios-send" type="success" @click="() => newProcessTicketHandler()" >Send </FormButton>
            <FormButton slot="footer" @click="() => previewModal.visible = false">Close</FormButton>
        </Popup>

        <!-- //success popup -->
        <Popup title="Success" type="success" :value="successModal.visible" @close="() => successModal.visible = false" :mask-closable="false" :closable="false">
            {{ successModal.message }}
            <FormButton slot="footer" @click="() => closeScreen()">Close</FormButton>
        </Popup>
    </div>
</template>

<script>
import loadingMixin from 'Mixins/loadingMixin';
    import { ValidationObserver } from 'vee-validate'
    import { updatePreview, processTicketAfterFinalResponse } from './api';
    import Attachment from 'Components/attachment';
    import EmailPreview from './EmailStructure'

    export default {
        name: "EmailTempalting",
        mixins: [loadingMixin],
        components: {
            ValidationObserver,
            Attachment,
            EmailPreview
        },
        props: {
            email: {
                type: Object,
                default: () => {}
            },
            backTo: {
                type: String,
                default: '/tasks'
            },
            TicketReference: {
                type: String,
                require: true,
            },
            additionalAttachment: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                signee_id: null,
                // TicketReference: null,
                files: [],
                dueDate: null,
                errors: {
                    notAllAttachmentSaved: false
                },
                successModal: {
                    visible: false,
                    message: ''
                },
                previewData: {},
                previewModal: {
                    visible: false
                }
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
        },
        methods: {
            backToList() {
                this.$router.push(this.backTo);
            },
            closeScreen() {
                this.successModal.visible = false;
                setTimeout(() => {
                    this.$router.push(this.backTo)
                },300)
            },
            saveData() {
                this.showLoader();
                const { EmailSubject, EmailBody, Emailtemplate_id, Attachment, DocumentName, ToEmail, printqueue, fsaref, Attachmentjson, SimpleEmailBody, isEditable, preview_id, outcome, process_id, reference_id, mode, CC } = this.email;
                const data = {
                    EmailSubject,
                    EmailBody,
                    Emailtemplate_id, 
                    Attachment, 
                    DocumentName, 
                    ToEmail, 
                    printqueue, 
                    fsaref, 
                    Attachmentjson,
                    DocAttachmentJson: JSON.stringify(this.files), 
                    SimpleEmailBody, 
                    preview_id, 
                    outcome, 
                    process_id, 
                    reference_id, 
                    mode,
                    CC
                }
                updatePreview(data).then(
                    res => {
                        this.previewData = res.data;
                        this.previewModal.visible = true;
                        this.hideLoader();
                    }
                ) 
            },
            parseAttachment(val){
                return JSON.parse(val);
            },
            openWindow(val){
                var myWindow=window.open('','','width=700,height=900');
                myWindow.document.write(val);
            },
            changeNotAllSavedStatus(val) {
                this.errors.notAllAttachmentSaved = val;
            },
            processData(response) {
                this.email = response.data[0][0];

                this.hideLoader();
            },
            newProcessTicketHandler() {
                this.$refs.emailValidator.validate().then(result => {
                    if (result) {
                        const checkAllAttachments = this.files.every( item => item.fileUpload == null ||item.fileUpload == undefined )
                        if(checkAllAttachments == true){
                            this.errors.notAllAttachmentSaved = false;
                            const { fsaref, preview_id } = this.email;

                            const data = {
                                preview_id,
                                TicketReference: this.TicketReference,
                                fsaref,
                            };

                            this.$store.commit('setLoading', true);
                            processTicketAfterFinalResponse(data).then(
                                response => {
                                    this.$store.commit('setLoading', false);
                                    this.previewModal.visible = false;
                                    this.successModal.visible = true;
                                    this.successModal.message = this.$route.name == 'Announcement' ? 'The Announcement Notice has been sent.' : response.message;
                                    
                                }).catch(() => {
                                    this.$store.commit('setLoading', false)
                                }
                            )
                        }
                        else {
                            this.previewModal.visible = false;
                            this.errors.notAllAttachmentSaved = true   
                        }
                    }
                })
            },
        }
    }
</script>
