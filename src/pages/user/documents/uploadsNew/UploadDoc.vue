<template>
    <FormWrapper :is-loading="isLoading">
        <!-- <PageTitle title="Document Masters" slot="title" :link="`/help/${processId}`"/> -->
        <PageTitle title="Add Documents" slot="title" />

        <ValidationObserver ref="validator">
            <FormRow v-if="$route.params.type=='license'">
                <div class="col-sm-6">
                    <FormAutoComplete v-model="license.ICSPSelectedName"
                        :onSearch="searchICSP"
                        :onSelect="selectICSP"
                        :onClear="clearICSP"
                        label="Licensee"
                        item-name="name"
                        item-value="name"
                        :clearable="true"
                        :items="license.ICSPResultsFiltered" 
                        rules="required"
                    />
                </div>
                <div class="col-sm-4">
                    <InputText label="Ticket Reference" v-model="uploadData.TicketReference" />
                </div>
            </FormRow>
            <div v-if="$route.params.type=='entity'">
                <FormRow>
                    <div class="col-sm-4">
                        <FormSelect label="Entity Type" rules="required" :items="entityTypes" item-name="longName" item-value="Name" v-model="company.EntityType" :clearable="false" />
                    </div>
                </FormRow>
                <FormRow v-if="company.EntityType !== null" >
                    <div class="col-sm-2">
                        <InputText rules="required" label="Entity Reg #"  v-model="company.CompanyRegNo" @keyup.native="searchByRegNo"  @focusout="searchByRegNoTab" />
                    </div>
                    <div class="col-sm-5">
                        <FormAutoComplete
                            label="Entity Name"
                            rules="required"
                            v-model="company.Name"
                            :onChange="onSearchName"
                            :items="companies"
                            item-value="Name"
                            item-name="Name"
                            :onSelect="onSelectCompanyByName" />
                    </div>
                </FormRow>   
            </div>
            <FormRow>
                <div class="col-sm-12">
                    <InputTextArea maxlength="250" label="Document Brief" rules="required" v-model="uploadData.DocumentBrief" />
                </div>
            </FormRow>
            <FormRow>
                
                <div class="col-sm-4">
                    <FormSelect :width="200" label="Document Category" :items="documentCategories" item-name="DisplayName" item-value="id" v-model="uploadData.documentCategory_id"  />
                </div>
                <div class="col-sm-6">
                    <InputFile 
                        label="Select File" 
                        v-model="uploadData.fileUpload"
                        :rules="{ docCheck:'pdf', checkFileRegex: true, required: true }"
                    />
                </div>
            </FormRow>
        </ValidationObserver>
        
        <ButtonGroup>
            <FormButton type="primary" @click="backToList" left-icon="ios-arrow-back" >Back</FormButton>
            <FormButton left-icon="ios-send" type="success" @click="submitAction" >Submit</FormButton>
        </ButtonGroup>

<!-- Message popup -->
        <Popup title="Information" :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.cancel" @click="() => showWarningModal(false)">Cancel
                </FormButton>
                <FormButton v-if="warningModal.buttons.confirm" type="success" @click="confirmDelete">Confirm
                </FormButton>
                <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
            </div>
        </Popup>
        <Popup title="Success" type="success" :value="successModal.visible" :mask-closable="false" :closable="false" @close="() => successModal.visible = false">
            {{ successModal.message }}
            <div slot="footer">
                <FormButton @click="() => backToList()">Back to List</FormButton>
            </div>
        </Popup>

    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import FormAutoComplete from 'Components/form/FormAutoComplete';
    import loadingMixin from 'Mixins/loadingMixin';
    import { getDocumentCategories, getCompany, adminStorebylicense, fetchEntityTypeByDepartment, searchICSPTypes } from '../api';
    import { ValidationObserver } from "vee-validate"; 

    export default {
        name: "UploadDocuments",
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle,
            FormAutoComplete,
            ValidationObserver
        },
        data() {
            return {
                warningModal: {
                    visible: false,
                    buttons: {
                        ok: true,
                        confirm: false,
                        cancel: false
                    }
                },
                successModal: {
                    visible: false,
                    message: ''
                },
                document_id: null,
                companies: [],
                isSelected: false,
                uploadData:{
                    DocumentBrief: '',
                    documentCategory_id: null,
                    fileUpload: null,
                    company_id: null,
                    license_id: null,
                    TicketReference: ''
                },
                company: {
                    Name: '',
                    CompanyRegNo: null,
                    EntityType: null,
                },
                documentCategories: [],
                entityTypes: [],
                license: {
                    ICSPSelectedName:'',
                    ICSPResultsFiltered: [],
                    ICSPResults: []
                }
            }
        },
        created() {
          this.getFilterValues();
        //   this.getDataByFilter();
        },
        watch: {
            'company.CompanyRegNo': function (newValue) {
                if ( newValue == '') {
                    this.resetCompany();
                    this.resetCompanies();
                }
            },
            'company.Name': function (newValue) {
                if ( newValue == '') {
                    this.resetCompany();
                    this.resetCompanies();
                }
            },
            'license.ICSPSelectedName': function(val) {
                // if(val == null || val == undefined) {
                    
                // }
                this.resetCompany();
                this.resetCompanies();
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
        },
        methods: {
            clearICSP(){
                this.uploadData.license_id = null;
                this.license.ICSPResultsFiltered = null;
            },
            selectICSP(name) {
                this.uploadData.license_id = this.license.ICSPResultsFiltered.find(item => item.name === name).license_id;
            },
            searchICSP(value) {
                if (value.length > 2) {
                    this.license.ICSPResultsFiltered = this.license.ICSPResults.filter(item => {
                        return item.name !== null ? item.name.toLowerCase().includes(value.toLowerCase()) : null;
                    })
                } else {
                    this.license.ICSPResultsFiltered = []
                }
                if(value === ''){
                    this.uploadData.license_id = null;
                }
            },
            backToList(){
                this.successModal.visible = false;
                setTimeout(() => {
                    this.$router.push('/documents');
                },300)
            },
            submitAction(){
                this.$refs.validator.validate().then(results =>{
                    if(results){
                        const { TicketReference, license_id, company_id, DocumentBrief, documentCategory_id, fileUpload } = this.uploadData
                        let  data = new FormData();
                        data.append('image', fileUpload, fileUpload.name);
                        data.append('TicketReference', TicketReference);
                        if(this.$route.params.type == 'license') {
                            data.append('license_id', license_id);
                        }
                        if(this.$route.params.type == 'entity') {
                            data.append('company_id',company_id);
                        }
                        data.append('DocumentBrief',DocumentBrief);
                        data.append('documentCategory_id', documentCategory_id);
                        adminStorebylicense(data).then(
                            res => {
                                this.successModal.visible = true;
                                this.successModal.message = 'Document uploaded';
                            }
                        )
                    }
                })
            },
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            getFilterValues() {
                this.showLoader();
                const type = this.$route.params.type;
                Promise.all([
                    searchICSPTypes({department_id: this.userData.department_id}),
                    fetchEntityTypeByDepartment({ department_id: this.userData.department_id, subEntity: 1 }), 
                    getDocumentCategories(),
                    // ...(type == 'license' && searchICSPTypes({department_id: this.userData.department_id}))
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.license.ICSPResults = response[0].data,
                this.entityTypes = response[1].data;
                this.documentCategories = response[2].data;
                this.hideLoader();
            },

  
            searchByRegNoTab() {
                
                if (!this.isSelected) {
                    const { CompanyRegNo } = this.company;
                    const { EntityType } = this.company;
                    if (CompanyRegNo ) {
                        getCompany({
                            EntityType: EntityType,
                            Name: '',
                            RegNo: CompanyRegNo,
                            icsp_id: this.uploadData.license_id
                        }).then(res => {
                            if (res.data[0] && res.data[0].length > 0) {
                                var company = res.data[0][0];
                                this.uploadData.company_id = company.id
                                this.company.EntityType = company.EntityType;
                                this.company.Name = company.Name;
                                this.company.CompanyRegNo = company.CompanyRegNo;
                                this.isSelected = false;
                            }
                        })
                        
                    }
                }
            },
            searchByRegNo(event) {
                if(event.keyCode === 13){
                    if (!this.isSelected) {
                        const { CompanyRegNo } = this.company;
                        const { EntityType } = this.company;
                        if (CompanyRegNo ) {
                            getCompany({
                                EntityType: EntityType,
                                Name: '',
                                RegNo: CompanyRegNo,
                                icsp_id: this.uploadData.license_id
                            }).then(res => {
                                if (res.data[0] && res.data[0].length > 0) {
                                    var company = res.data[0][0];
                                    this.uploadData.company_id = company.id
                                    this.company.EntityType = company.EntityType;
                                    this.company.Name = company.Name;
                                    this.company.CompanyRegNo = company.CompanyRegNo;
                                    this.isSelected = false;
                                }
                            })
                            
                        }
                    }
                }
            },
            onSelectCompanyByName(value) {
                var company = this.companies.find(item => item.Name === value);

                this.uploadData.company_id = company.id;
                this.company.EntityType = company.EntityType;
                this.company.Name = company.Name;
                this.company.CompanyRegNo = company.CompanyRegNo;

                this.isSelected = true;
            },
            resetCompany() {
                if(!this.readonly){
                    this.company.EntityType = null;
                    this.company.Name = '';
                    this.company.CompanyRegNo ='';
                    this.uploadData.company_id = null;
                }
            },
            validateQuery(value) {
                return value.length >= 3
            },
            resetCompanies() {
                this.companies = [];
            },
            onSearchName(val) {
                if (this.validateQuery(val) && !this.isSelected) {
                    this.resetCompanies();
                    this.searchForCompany(val);
                }
                this.isSelected = false;
            },
            searchForCompany(Name) {
                const { EntityType } = this.company;
                getCompany({
                    EntityType,
                    Name,
                    RegNo: '',
                    icsp_id: this.uploadData.license_id
                }).then(res => {
                    this.companies = res.data[0];
                })
            },
        }
    }
</script>

<style lang="scss" module>


</style>
