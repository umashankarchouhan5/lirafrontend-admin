<template> 
        <FormWrapper :is-loading="isLoading">
            <PageTitle title="Complaint Form" slot="title"/>
            <ValidationObserver ref="validator">
                
                <h4>1. Details of Complainant </h4>
                <br />
                <FormRow>
                    <div class="col-sm-2">
                        <Salutation  label="Title" rules="required"  v-model="form.Salutation" />
                    </div>
                    <div class="col-sm-3">
                        <InputText  label="First Name" rules="required" v-model="form.Fname" />
                    </div>
                    <div class="col-sm-3">
                        <InputText  label="Last Name" rules="required" v-model="form.Lname" />
                    </div>
                    <div class="col-sm-4">
                        <InputText  label="Email"  :rules="{email: true,required: form.ComplaintMode === 145 ? true: false}" v-model="form.Email" />
                    </div>
                </FormRow>
                
                <FormRow>
                    <div class="col-sm-6">
                        <AddressInput   label="Address" vid="complainant address" rules="required"  v-model="form.Address_id" />
                    </div>
                    <div class="col-sm-6">
                        <AddressInput   label="Residence Address"   v-model="form.ResAddress_id" />
                    </div>
                </FormRow>
                    
                <FormRow>
                    <div class="col-sm-4">
                        <InputText  label="Company" v-model="form.CompanyName" />
                    </div>
                    <div class="col-sm-4">
                        <InputTel  label="Mobile" rules="required" v-model="form.Mobile" />
                    </div>
                    <div class="col-sm-4">
                        <InputTel  label="Alternate Phone Number" v-model="form.AlternatePhone" />
                    </div>
                </FormRow>
                 

                <FormRow>
                    <div class="col-sm-12">
                        <InputText  label="Subject : Brief summary about complaint" v-model="form.Subject" rules="required"  />
                    </div>   
                </FormRow>

                <h6>2. Details of the incident(s)</h6>

                <p>Full name, address and contact details of licensed entity/person (s) that you wish to lodge a complaint against: </p>
                <br/>
                <FormRow>
                    <div class="col-sm-12">
                        <InputTextArea  label="Name" rules="required" rows="2" maxlength="250" v-model="form.ComplaintAgainstName"  />
                    </div>   
                </FormRow>

                <FormRow>
                    <div class="col-sm-12">
                        <InputTextArea  label="Address" rules="required" vid="complaint against address" rows="2" maxlength="250" v-model="form.ComplaintAgainstAddress"  />
                    </div>   
                </FormRow>

                <FormRow>
                    <div class="col-sm-12">
                        <InputTextArea  label="Contact Details" rules="required" rows="2" maxlength="250" v-model="form.ComplaintAgainstContactDetail"  />
                    </div>   
                </FormRow>

                <FormRow>
                    <div class="col-sm-3">
                        <InputDate  label="Date of Incident" :options="options" rules="required" v-model="form.IncidentDate"  />
                    </div>   
                    <div class="col-sm-3">
                        <InputTime  label="Time of Incident (24 hours format)" v-model="form.IncidentTime"  />
                    </div>   
                </FormRow>
                
                <FormRow>
                    <div class="col-sm-12">
                        <InputTextArea  label="Please describe precisely the details of your complaint. Please write clearly and legibly." v-model="form.ComplaintSummary" rules="required" rows="14" :maxlength="2000" />
                    </div>   
                </FormRow>

                <div :class="$style.additional">
                    <h4>Upload documents in support of your complaint. (Please enclose copies of all relevant documents e.g. Correspondences, Agreements, Proof of payments/invoices etc.)</h4>
                    <DataTable :class="$style.documents" no-data-text="No Documents Attached" :columns="columns()" :data="documents.additional" />
                </div>
                <br />
                <br />
                <FormRow>
                    <div class="col-sm-4">
                        <FormSelect :width="200" label="Complaint Mode" rules="required" :items="modifiedComplaintModes" item-name="Name" item-value="id" v-model="form.ComplaintMode" :disabled="form.ComplaintMode === 147" />
                    </div>
                </FormRow>
                
                <div v-if="form.ComplaintMode === 145">
                    <FormRow>
                        <div class="col-sm-4" >
                            <InputDate v-model="form.ReportingDate" label="Reporting Date" name="emailReportingDate" rules="required" :options="options" />
                        </div>
                    </FormRow>
                    <FormRow>
                        <div class="col-sm-12" >
                        <InputTextArea v-model="form.EmailContent" label="Email Content" rules="required" rows="7" :maxlength="5000" />
                        </div>
                    </FormRow>
                </div>

                <div v-if="form.ComplaintMode === 146">
                    <FormRow>
                        <div class="col-sm-4" >
                            <InputDate v-model="form.ReportingDate" label="Reporting Date" name="letterReportingDate" autocomplete="off" rules="required" :options="options" />
                        </div>
                        
                        <div class="col-sm-8" >
                            <InputText v-model="form.ComplainantLetterReference" label="Letter Reference" rules="required" :maxlength="100"  />
                        </div>
                    </FormRow>
                </div>
                <!-- <FormRow>
                    <div ></div>
                    <div class="col-sm-4">
                        <p><b>Consent : </b>
                            <RadioGroup v-model="form.ConsentYN" :disabled="form.ComplaintMode === 147">
                                <Radio  label="Y" :disabled="form.ComplaintMode === 147">
                                    Yes
                                </Radio>
                                <Radio  label="N" :disabled="form.ComplaintMode === 147">
                                    No
                                </Radio>
                            </RadioGroup>
                        </p>
                    </div>
                </FormRow> -->

                <FormRow v-if="!submitted">
                    <div class="col-sm-12">
                        <ButtonGroup>
                            <FormButton
                                    left-icon="md-checkmark-circle-outline"
                                    type="success"
                                    @click="submitData()"
                                    >
                                Submit
                            </FormButton>
                        </ButtonGroup>
                    </div>
                </FormRow>
                <FormRow v-else>
                    <div class="col-sm-12">
                        <ButtonGroup>
                            <FormButton
                                    left-icon="ios-arrow-back"
                                    type="success"
                                    @click="backToList()"
                                    >
                                Back
                            </FormButton>
                            <FormButton
                                    left-icon="md-refresh"
                                    type="success"
                                    @click="resetData()"
                                    >
                                Reset
                            </FormButton>
                        </ButtonGroup>
                    </div>
                </FormRow>
            </ValidationObserver>

            <!-- Email Popup -->
            <Popup title="Email/Letter" :value="emailPopup" width="1000" :closable="true" :maskable="false" @close="() => showEmailModal(false)">
                <div :class="$style.popupRow">
                    <InputText label="To "  v-model="emailData.ToEmail" :maxlength="200" />
                </div>
                <div :class="$style.popupRow">
                    <InputText label="Subject"  v-model="emailData.EmailSubject" :maxlength="200" />
                </div>
                <FormRow>
                    <Loader v-if="!emailData.Emailbody" />
                    <div class="col-sm-12" v-else>
                        <EditorComponent v-model="emailData.Emailbody" />
                    </div>
                </FormRow>
                <FormButton @click="sendEmail('send')" left-icon="md-checkmark-circle-outline" v-if="print === 0">Send</FormButton>
                <FormButton @click="sendEmail('print')" left-icon="md-checkmark-circle-outline" v-if="print === 1">Print</FormButton>
            </Popup>

            <Popup :value="modals.success.isVisible" :closable="false" :mask-closable="false" type="success" title="Submitted Successfully"
                   >
                   {{modals.success.message}}
                <!-- <p>Your complaint has been submitted. Your reference # is <strong>{{ ticketReference }}</strong></p> -->
                <ButtonGroup slot="footer">
                    <FormButton v-if="modals.success.okButton" @click="closeSuccessModal()">Ok</FormButton>
                    <FormButton v-if="modals.success.backButton" @click="backToList">Back</FormButton>
                </ButtonGroup>
            </Popup>
        </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DateUtil from 'Utils/dateUtil';
    import { ValidationObserver } from "vee-validate"; 
    import { COMPLAINT } from 'Config/processIds';
    import tableAdditional from './table/table';
    import DataTable from 'Components/DataTable';
    import AddressInput from 'Components/form/addressInput/AddressInput';
    import InputTel from 'Components/form/InputTel';
    import InputDate from 'Components/form/InputDate';
    import InputTime from 'Components/form/InputTime';
    import Salutation from 'Components/layout/salutation.vue';
    import countriesMixin from 'Mixins/countriesMixin';
    import loadingMixin from 'Mixins/loadingMixin';
    import { createDraft, uploadDocument, submitForm, getComplaintMode, getComplaintData, sendComplaintEmailByAdmin, printLetterBody } from '../api';

    export default {
        name: "Complaint",
        mixins: [countriesMixin,loadingMixin],
        components: {
            DataTable,
            FormWrapper,
            PageTitle,
            ValidationObserver,
            AddressInput,
            InputTel,
            InputDate,
            InputTime,
            Salutation,
        },
        data() {
            return {
                form:{
                    Subject: '',
                    ComplaintAgainstContactName: '',
                    ComplaintAgainstContactDetail: '',
                    IncidentDate: null,
                    IncidentTime: '',
                    ComplaintSummary:'',
                    reference_id: 0,
                    Salutaion: '',
                    Fname: '',
                    Lname: '',
                    Mobile: '',
                    AlternatePhone: '',
                    Email: '',
                    CompanyName: '',
                    Address_id: null,
                    ComplaintMode: null,
                    Department_id: null,
                    ComplainantLetterReference: '',
                    ReportingDate: null,
                    EmailContent: '',
                    ResidenceAddress: null,
                    ConsentYN: 'Y',
                },
                complaintModes:[],
                departmentList: [],
                ticketReference: null,

                modals: {
                    success: {
                        isVisible: false,
                        message: '',
                        okButton: false,
                        backButton: false,
                    }
                },
                
                documents: {
                    additional: []
                },
                columns: tableAdditional,
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                emailData: {},
                print: null,
                emailPopup: false,
                submitted: false
            }
        },
        computed: {
            modifiedComplaintModes(){
                var modes = this.complaintModes.filter(ele => {
                    return ele.id !== 147
                })
                return modes;
            },
            isAdditionalDocSaved(){
                return this.$store.state.common.additionalUploaded;
            }
        },
        created() {
            this.columns = this.columns.bind(this);
            this.getFilterData();
            
            if( this.documents.additional.length === 0){
                this.onAddDocument();
            }
        },
        methods: {
            resetData() {
                this.form = {
                    Subject: '',
                    ComplaintAgainstContactName: '',
                    ComplaintAgainstContactDetail: '',
                    IncidentDate: null,
                    IncidentTime: '',
                    ComplaintSummary:'',
                    reference_id: 0,
                    Salutaion: '',
                    Fname: '',
                    Lname: '',
                    Mobile: '',
                    AlternatePhone: '',
                    Email: '',
                    CompanyName: '',
                    Address_id: null,
                    ComplaintMode: null,
                    Department_id: null,
                    ComplainantLetterReference: '',
                    ReportingDate: null,
                    EmailContent: '',
                    ResidenceAddress: null,
                    ConsentYN: 'Y',
                }
                this.documents.additional = [];
                this.onAddDocument();
                this.emailData = {}
                this.submitted = false
            },
            closeSuccessModal(){
                this.modals.success.isVisible = false;
                this.modals.success.okButton = false;
            },
            showEmailModal(val){
                this.emailPopup = val
            },
            sendEmail(type){
                    const { ToEmail,reference_id,EmailSubject,Emailbody,FileNamePrefix,TicketReference,EmailTemplate_id } = this.emailData;
                if(type === 'send'){
                    const data = {
                        Toemail: ToEmail,
                        reference_id,
                        Subject: EmailSubject,
                        Body: Emailbody,
                        TicketReference,
                        EmailTemplate_id
                    };
                    sendComplaintEmailByAdmin(data).then(this.handlerEmail);
                }
                else if(type === 'print'){
                    const data = {
                        Body: Emailbody,
                        FileNamePrefix,
                        EmailTemplate_id
                    }
                    printLetterBody(data).then(this.handlerEmail);
                }
            },
            handlerEmail(response){
                this.emailPopup = false;
                this.modals.success.message = response.message;
                this.modals.success.isVisible = true;
                this.modals.success.backButton = true;
                if(response.data.url){
                    window.open(response.data.url,"_blank");
                }
            },
            getComplaintDataById(){
                getComplaintData({Complaint_id: this.$route.params.id}).then(
                    res => {
                        this.form = res.data[0];
                        this.form.reference_id = this.$route.params.id;
                        var docJson = res.data[0].DocumentJson !== null ? JSON.parse(res.data[0].DocumentJson): [];
                        this.documents.additional = docJson.map( (item) => {
                            item.url = item.document_file;
                            item.isSaved = true;
                            item.type= 'additional';
                            return item;
                        })
                        // this.form.EmailContent = res.data[0].ComplainantEmailContent
                        this.hideLoader();
                    }
                )
            },
            getFilterData(){

                this.showLoader();
                
                Promise.all([
                    getComplaintMode(),
                ]).then(this.getDataHandler)
            },
            getDataHandler(res){
                this.complaintModes = res[0].data;
                
                if(this.$route.params.id){
                    this.getComplaintDataById();
                }else{
                    this.generateDraft();
                }
            },
            generateDraft(){
                createDraft({process_id: COMPLAINT}).then(
                    res => {
                        this.form.reference_id = res.data[0].reference_id;
                        this.hideLoader();
                    }
                ).catch(() => {
                    this.hideLoader();
                })
            },
            submitData(){
                this.$refs.validator.validate().then(result => {
                    if (result && this.validateAdditionalDocument()) {
                        this.showLoader();
                        submitForm(this.form).then((res) => {
                            var response = res.data[0];
                            const data = {
                                process_id: COMPLAINT,
                                reference_id: response.reference_id,
                                EmailSubject: response.EmailSubject,
                                EmailTemplate_id: response.EmailTemplate_id,
                                Emailbody: response.Emailbody,
                                FileNamePrefix: response.FileNamePrefix,
                                ToEmail: response.ToEmail,
                                TicketReference: response.TicketReference
                            }
                            this.submitted = true;
                            this.emailData = data;
                            this.print = response.printqueue;
                            this.hideLoader();
                            if(response.Emailbody !== null){
                                this.showEmailModal(true);
                                this.modals.success.message = `The complaint has been created, please ${this.print == 0 ? 'send email' : 'print the letter'}  for communication.`;
                                this.modals.success.isVisible = true;
                                this.modals.success.okButton = true
                            }
                            else{
                                this.modals.success.message = 'The complaint has been created.';
                                this.modals.success.isVisible = true;
                                this.modals.success.okButton = true;
                            }
                        }).catch(() => {
                            this.hideLoader();
                        })
                           
                    }
                })
            },
            onAddDocument() {
                const template = {
                    DocumentDate: '',
                    UploadDate: '',
                    DocumentBrief: '',
                    type: 'additional',
                    errors: [],
                    file: null,
                    DocumentName: '',
                    path: '',
                    url: '',
                    isMandatory: true,
                    isSaved: false,
                    isChange: false,
                };
                this.documents.additional.push(template)
            },
            onRemoveDocument(index) {
                this.documents.additional.splice(index, 1)
            },
            
            backToList() {
                this.modals.success.isVisible = false;
                setTimeout(() => {
                    this.$router.push('/complaint');
                }, 300);
            },

            onFileChange(file, row) {
                this.documents[row.type][row._index].file = file;
                if( file !== null) this.onSaveDocument(row);
            },

            onDateChange(data, row) {
                this.documents[row.type][row._index].DocumentDate = data;
            },

            onBriefChange(data, row) {
                this.documents[row.type][row._index].DocumentBrief = data;
            },

            onSaveDocument(row) {
                if (this.validateDocument(row)) {
                    const current = this.documents[row.type][row._index];
                    let data = new FormData();

                    if (current.DocumentBrief) {
                        data.append("DocumentBrief", current.DocumentBrief);
                    }
                    if (current.file) {
                        data.append("image", current.file, current.file.name);
                    }
                    if (current.isDateRequired) {
                        data.append("DocumentDate", current.DocumentDate);
                    }
                    data.append("reference_id", this.form.reference_id);

                    uploadDocument(data).then((res) => {
                        current.url = res.data.url;
                        current.DocumentName = current.file.name;
                        current.isSaved = true;
                        current.isChange = false;
                    })
                }
            },
            onChangeDocument(row) {
                // if (this.validateDocument(row)) {
                    const current = this.documents[row.type][row._index];
                    if(current.isSaved == false){
                        current.isSaved = true
                        current['isChange'] = false;
                    }
                    else{
                        current.isSaved = false;
                        current['isChange'] = true;
                    }
                // }
            },

            validateDocument(row) {
                const current = this.documents[row.type][row._index];
                current.errors = [];
                if (!current.DocumentName && !current.file) {
                    current.errors.push('file')
                }
                if (!current.DocumentBrief) {
                    current.errors.push('brief')
                }
                return current.errors.length === 0
            },
            validateAdditionalDocument() {
                const isAdditionalDocumentsUploaded = this.documents.additional.every( item => {
                    if(item.file !== null){
                        return item.DocumentName && item.DocumentName !== '' ? true : false;
                    }
                    else if(item.DocumentBrief && item.DocumentBrief.trim() !== ''){
                        return item.DocumentName && item.DocumentName !== '' ? true : false;
                    }
                    return true;
                })
                if (!isAdditionalDocumentsUploaded) {
                    this.$store.commit('checkAdditionalUploaded',true)
                    return false;
                }
                return true;
            },
        },
        beforeDestroy(){
            this.$store.commit('checkAdditionalUploaded',false);
        }
    }
</script>

<style lang="scss" module>

    .info {
        background: #d7d6da;
        box-shadow: 0px 2px 2px #00000059;
        width: 83%;
        font-size: 13px;
        margin: -20px auto 30px;
        hr {
            margin: 5px 15px 0;
            border: none;
            border-bottom: 1px solid #6666;
            clear: both;
        }
        &:after {
            content: '';
            display: block;
            clear: both;
        }
    }
    .infoBlock {
        line-height: 40px;
    }

    .additional {
        position: relative;
    }

    .additionalAdd {
        position: absolute;
        right: -25px;
        top: 36px;

    }

    .verify,
    .note {
        line-height: 21px;
        font-size: 15px;
        padding: 8px 0;
        font-weight: 500;
    }

    .verify {
        margin: 15px 0 -15px;
    }

    .summary {
        font-weight: 700;
        padding: 7px 4px;
    }
    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 13px;
        font-weight: 400;
    }

    .documents {

        :global {
            .ivu-table,
            .ivu-table-wrapper {
                overflow: visible;
            }
        }
    }
    
    .popupRow {
        padding: 5px 0 15px;
    }
</style>
