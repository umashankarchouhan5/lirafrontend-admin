<template> 
        <FormWrapper :is-loading="isLoading">
            <PageTitle title="Complaint Form" slot="title"/>
            <ValidationObserver ref="validator">
                
                <h4>1. Details of Complainant </h4>
                <br />
                <FormRow>
                    <div class="col-sm-2">
                        <Salutation  label="Title" rules="required"  v-model="form.Salutation" disabled />
                    </div>
                    <div class="col-sm-3">
                        <InputText  label="First Name" rules="required" v-model="form.Fname" readonly />
                    </div>
                    <div class="col-sm-3">
                        <InputText  label="Last Name" rules="required" v-model="form.Lname" readonly />
                    </div>
                    <div class="col-sm-4">
                        <InputText  label="Email"  :rules="{email: true,required: form.ComplaintMode === 145 ? true: false}" v-model="form.Email" readonly />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-6">
                        <AddressInput   label="Address" rules="required"  v-model="form.Address_id" readonly />
                    </div>
                    <div class="col-sm-6">
                        <AddressInput   label="Residence Address"   v-model="form.ResAddress_id" readonly />
                    </div>
                </FormRow>
                    
                <FormRow>
                    <div class="col-sm-4">
                        <InputText  label="Company" v-model="form.CompanyName" readonly />
                    </div>
                    <div class="col-sm-4">
                        <InputTel  label="Mobile" rules="required" v-model="form.Mobile" readonly />
                    </div>
                    <div class="col-sm-4">
                        <InputTel  label="Alternate Phone Number" v-model="form.AlternatePhone" readonly />
                    </div>
                </FormRow>
                <FormRow>
                </FormRow>
                 

                <FormRow>
                    <div class="col-sm-12">
                        <InputText  label="Subject : Brief summary about complaint" readonly v-model="form.Subject" rules="required"  />
                    </div>   
                </FormRow>

                <h6>2. Details of the incident(s)</h6>

                <p>Full name, address and contact details of licensed entity/person (s) that you wish to lodge a complaint against: </p>
                <br/>
                <FormRow>
                    <div class="col-sm-12">
                        <InputTextArea  label="Name" rules="required" rows="2" maxlength="250" readonly v-model="form.ComplaintAgainstName"  />
                    </div>   
                </FormRow>

                <FormRow>
                    <div class="col-sm-12">
                        <InputTextArea  label="Address" rules="required" rows="2" readonly maxlength="250" v-model="form.ComplaintAgainstAddress"  />
                    </div>   
                </FormRow>

                <FormRow>
                    <div class="col-sm-12">
                        <InputTextArea  label="Contact Details" rules="required" readonly rows="2" maxlength="250" v-model="form.ComplaintAgainstContactDetail"  />
                    </div>   
                </FormRow>

                <FormRow>
                    <div class="col-sm-4">
                        <InputDate  label="Date of Incident" :options="options" readonly rules="required" v-model="form.IncidentDate"  />
                    </div>   
                    <div class="col-sm-4">
                        <InputTime  label="Time of Incident (24 hours format)" readonly rules="required" v-model="form.IncidentTime"  />
                    </div>   
                </FormRow>
                
                <FormRow>
                    <div class="col-sm-12">
                        <InputTextArea  label="Please describe precisely the details of your complaint. Please write clearly and legibly." v-model="form.ComplaintSummary" rules="required" readonly rows="14" :maxlength="2000" />
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
                        <FormSelect :width="200" label="Complaint Mode" rules="required" :items="complaintModes" item-name="Name" item-value="id" v-model="form.ComplaintMode" disabled />
                    </div>
                </FormRow>
                
                <div v-if="form.ComplaintMode === 145">
                    <FormRow>
                        <div class="col-sm-4" >
                            <InputDate v-model="form.ReportingDate" label="Reporting Date" rules="required" :options="options" readonly />
                        </div>
                    </FormRow>
                    <FormRow>
                        <div class="col-sm-12" >
                        <InputTextArea v-model="form.EmailContent" label="Email Content" rules="required" rows="7" :maxlength="5000" readonly />
                        </div>
                    </FormRow>
                </div>

                <div v-if="form.ComplaintMode === 146">
                    <FormRow>
                        <div class="col-sm-4" >
                            <InputDate v-model="form.ReportingDate" label="Reporting Date" autocomplete="off" rules="required" :options="options" readonly />
                        </div>
                        
                        <div class="col-sm-8" >
                            <InputText v-model="form.ComplainantLetterReference" label="Letter Reference" rules="required" :maxlength="100" readonly  />
                        </div>
                    </FormRow>
                </div>
            </ValidationObserver>


            <FormButton @click="backToList">Back</FormButton>

           
        </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
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
    import { createDraft, uploadDocument, getComplaintMode, getComplaintData, } from '../api';

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
                    ConsentYN: '',
                    ComplainantLetterReference: '',
                    ReportingDate: null,
                    EmailContent: '',
                    ResidenceAddress: null,
                },
                complaintModes:[],
                departmentList: [],
                ticketReference: null,
                documents: {
                    additional: []
                },
                columns: tableAdditional,
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                readonly: true,
            }
        },
        computed: {
            modifiedComplaintModes(){
                var modes = this.complaintModes.filter(ele => {
                    return ele.id !== 147
                })
                return modes;
            }
        },
        created() {
            this.columns = this.columns.bind(this);
            this.getFilterData();
        },
        methods: {
            
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
                )
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
                    url: ''
                };
                this.documents.additional.push(template)
            },
            onRemoveDocument(index) {
                this.documents.additional.splice(index, 1)
            },
            
            backToList() {
                // this.modals.success.isVisible = false;
                this.$router.push('/complaint');
            },

            onFileChange(file, row) {
                this.documents[row.type][row._index].file = file;
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
                    })
                }
            },
            onChangeDocument(row) {
                if (this.validateDocument(row)) {
                    const current = this.documents[row.type][row._index];
                    current.isSaved = false;
                    current['isChange'] = true;
                }
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
