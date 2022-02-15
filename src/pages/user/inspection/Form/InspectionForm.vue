<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Inspection" slot="title" />

        <ValidationObserver ref="validator">
            <FormRow>
                <div class="col-sm-3">
                    <FormSelect label="Inspection Type" rules="required" :items="form.inspectionTypes" item-name="Name" item-value="id" v-model="form.inspectionType_id" :clearable="false" :disabled="readonly" />
                </div>
                <div class="col-sm-4">
                    <FormSelect label="License Type" rules="required" :items="form.licenseTypes" item-name="longName" item-value="Name" v-model="form.licenseType" :clearable="false" :disabled="$route.params.id ? true: false" />
                </div>
            </FormRow>
            <FormRow v-if="form.licenseType !== null" >
                <div class="col-sm-2">
                    <!-- ${form.licenseType} -->
                    <InputText rules="required" :label="`License #`"  v-model="form.licenseRegNo" @keyup.native="searchByRegNo"  @focusout="searchByRegNoTab" :readonly="readonly" />
                </div>
                <div class="col-sm-5">
                    <!-- ${form.licenseType}  -->
                    <FormAutoComplete
                        :label="`Name`"
                        rules="required"
                        v-model="form.licenseeName"
                        :onChange="onSearchName"
                        :items="form.licensees"
                        item-value="CompanyName"
                        item-name="CompanyName"
                        :onSelect="onSelectLicenseeByName"
                        :disabled="readonly" />
                </div>
            </FormRow>
            <FormRow v-if="form.company_id !== null && form.inspectionType_id !== 5">
                <div class="col-sm-8" >
                    <AddressInput v-model="form.address_id" label="Office Address" readonly/>
                </div>
            </FormRow>
            <FormRow v-if="form.company_id !== null && form.inspectionType_id == 5">
                <div class="col-sm-8" >
                    <AddressInput v-model="form.officeAddress_id" rules="required" label="Office Address" :country_id="185" :readonly="readonly" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-2">
                    <InputDate  label="Inspection Date" rules="required" type="date" v-model="form.inspectionDate" :options="options" :readonly="readonly && !editMode" />
                </div>
                <div class="col-sm-2">
                    <InputTime  label="Inspection Time" rules="required" v-model="form.inspectionTime" :readonly="readonly && !editMode" />
                </div>
                <div class="col-sm-4" >
                    <FormCheckbox v-model="form.isSpotCheck"  name="Spot Check" :trueValue="1" :falseValue="0" :disabled="readonly && !editMode"> Spot Check </FormCheckbox>
                </div> 
            </FormRow>
         
            <!-- //Inspection Items  -->

            <FormRow :class="$style.indentClass" v-if="form.license_id !== null && userData.department_id == 2 && form.inspectionType_id !== null">
                <div class="col-sm-3">
                    <FormSelect label="Select Inspection Item EntityType" :items="getEntityType" rules="required" item-name="name" item-value="name" v-model="inspectionItemEntityType" :vid="`entity`" :disabled="readonly" />
                </div>
                
            </FormRow>  

            <div v-if="form.license_id !== null && userData.department_id == 2 && form.inspectionType_id !== null" class="boxStyle">
                <FormRow>
                    <div class="col-sm-5"><h6>Provisions of Act to be Inspected</h6></div>
                    <div class="col-sm-5" v-if="inspectionItemEntityType !== null && inspectionItemEntityType !== undefined">
                        <FormCheckbox v-model="selectAll"  name="Select All" :trueValue="1" :falseValue="0" :disabled="readonly && !editMode"> Select All </FormCheckbox>
                    </div> 
                </FormRow>
                
                <div :class="$style.marginLeft15">
                    <InspectionItemsRecord :entityTypes="getEntityType" :entityType="inspectionItemEntityType" :inspectionItems="inspectionItems" v-model="form.inspectionItemJson" v-if="userData.department_id == 2" :readonly="readonly && !editMode" />
                </div>
            </div>

            <!-- //Entities  -->
            <div class="boxStyle" v-if="userData.department_id == 2 && form.inspectionType_id == 3 && form.license_id !== null">
                <Entities v-model="form.entityJson" :entityTypes="getEntityType" :entityType="inspectionItemEntityType"  :readonly="readonly && !editMode" />
            </div>
            

            <div v-if="form.license_id !== null && userData.department_id == 2 && form.inspectionType_id == 1" class="boxStyle">
                <template v-if="!entityLock && $route.name !== 'ViewInspectionFormByID'">
                    <h6>Upload Entities to be inspected.</h6>

                    <FormRow :class="$style.indentClass">
                        <div class="col-sm-8">
                            <div :class="$style.excelFile">
                                <div :class="$style.excelFileLabel">
                                    <span>Choose File:</span>
                                </div>
                                <div :class="$style.excelFileInput">
                                    <InputFile :value="fileXSLS" name="ExcelUpload" @onChange="fileXSLSUploadHandler" :rules="{required: true,docCheck: 'xlsx,xls',checkFileRegex: true}" :disabled="readonly && !editMode" />
                                </div>
                                <div :class="$style.marginLeft30">
                                    <FormButton type="info" @click="() => {entityLock = !entityLock}" v-if="editMode">Cancel</FormButton>
                                </div>
                            </div>
                            <div><a href="http://fsa.lira2021.in/uploads/IBC_Inspection_Sample.xls">View Sample</a></div>
                        </div>
                        
                    </FormRow>
                </template>

                <template v-else>
                    <h6>Uploaded Entities to be inspected.</h6>

                    <ButtonGroup >
                        <FormButton :prevent-default="false"  :href="form.excelDataURL" target="_blank" tag="a" left-icon="md-eye">View Entities</FormButton>
                        <FormButton v-if="$route.name !== 'ViewInspectionFormByID'" type="info" @click="() => {entityLock = !entityLock}">Change Entities</FormButton>
                    </ButtonGroup>
                </template>

                <div v-if="customErrors.noEntity.status" :class="$style.error">
                    <span v-if="customErrors.noEntity.message !== '' && customErrors.noEntity.message !== ' '">{{customErrors.noEntity.message}}</span>
                    <span v-else>Error in file. To see <a :href="customErrors.noEntity.errorURL" target="_blank"> Click Here</a></span>
                </div>

                <FormRow v-if="form.excelDataURL && !entityLock && $route.name !== 'ViewInspectionFormByID'">
                    <div class="col-sm-4">
                        <FormButton :prevent-default="false" size="small" :href="form.excelDataURL" target="_blank" tag="a" left-icon="md-eye">View Entities</FormButton>
                    </div>
                </FormRow>

            </div>

            <!-- //Inspection Team -->
            <div class="boxStyle">
                <InspectionTeam v-model="form.inspectionTeamJson" :adminUsers="adminUsers" v-if="adminUsers" :readonly="readonly && !editMode" />
                <FormRow :class="$style.marginLeft15">
                    <div class="col-sm-3">
                        <FormSelect label="Select Team Lead" rules="required" :items="selectedInspectionTeam" item-name="Name" item-value="id" v-model="inspectionTeamLead" :disabled="readonly && !editMode" />
                    </div>
                </FormRow>
            </div>
            

            <!-- //Document required -->
            <div class="boxStyle">
                <RequiredDocuments v-model="form.requestedDocumentJson" :readonly="readonly && !editMode" />

            </div>
            

            <FormRow>
                <div class="col-sm-12">
                    <InputTextArea label="Inspection Objective" rules="required" v-model="form.inspectionObjective" rows="4" maxlength="2000" :readonly="readonly && !editMode" />
                </div>
            </FormRow>
            
            <FormRow>
                <div class="col-sm-12">
                    <InputTextArea label="Inspection Scope Narration" rules="required" v-model="form.inspectionScopeNarration" rows="4" maxlength="2000" :readonly="readonly && !editMode" />
                </div>
            </FormRow>
            
        </ValidationObserver>
        <ButtonGroup>
            <FormButton type="primary" @click="backToList" left-icon="ios-arrow-back" >Back</FormButton>
            <FormButton v-if="!readonly || editMode" left-icon="ios-send" type="success" @click="submitInspection" >Submit</FormButton>
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
        
        <Popup title="Success" type="success" :value="successModal.isVisible" @close="() => successModal.isVisible = false"  :closable="false" :mask-closable="false" >
            {{ successModal.message }}
            <div slot="footer">
                <FormButton  @click="() => backToList()">Back To List</FormButton>
            </div>
        </Popup>

    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import InputDate from 'Components/form/InputDate';
    import InputTime from 'Components/form/InputTime';
    import FormAutoComplete from 'Components/form/FormAutoComplete';
    import loadingMixin from 'Mixins/loadingMixin';
    import AddressInput from 'Components/form/addressInput/AddressInput';
    import Entities from './components/entities';
    import InspectionTeam from './components/inspectionTeam';
    import RequiredDocuments from './components/requiredDocuments';
    import InspectionItemsRecord from './components/InspectionItemsRecord';
    import { ValidationObserver } from "vee-validate"; 
    import { getInspectionTypebyDepartment, fetchEntityTypeByDepartment, getLicenseeList, fetchRandomInspectionSample,inspectionPlanbyAdminuser, getAdminUserList, fetchInspectionPlanbyId,fetchInspectionItem, uploadRandomSample } from '../api';

    export default {
        name: "InspectionForm",
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle,
            InputDate,
            FormAutoComplete,
            InputTime,
            AddressInput,
            Entities,
            InspectionTeam,
            RequiredDocuments,
            InspectionItemsRecord,
            ValidationObserver
        },
        data() {
            return {
                form: {
                    process_id: 1205,
                    reference_id: 0,
                    inspectionTypes: [],
                    inspectionType_id: null,
                    licenseTypes: [],
                    licenseType: null,
                    licensees: [],
                    licenseeName: null,
                    licenseRegNo: '',
                    license_id: null,
                    address_id: null,
                    inspectionDate: '',
                    inspectionTime: '08:00',
                    entityJson: [],
                    inspectionTeamJson: [],
                    inspectionScopeNarration: '',
                    inspectionObjective: '',
                    company_id: null,
                    sampleSize: 0,
                    sampleEntity: null,
                    inspectionItem: null,
                    inspectionItemJson: [],
                    requestedDocumentJson: [],
                    excelDataURL: '',
                    isSpotCheck: false,
                    officeAddress_id: null,
                },
                inspectionTeamLead: null,
                inspectionItemEntityType: null,
                selectAll: 0,
                inspectionItems: [],
                entityTypes: {
                    1: {
                        ICSP: [{name:'IBC'},{name:'LP'}],
                        ITSP: [{name:'Trust'}],
                        FSP: [{name:'Foundation'}]
                    },
                    2:{
                        ICSP: [{name: 'ICSP'}],
                        ITSP: [{name: 'ITSP'}],
                        FSP: [{name: 'FSP'}]
                    },
                    3: {
                        ICSP: [{name:'IBC'},{name:'LP'}],
                        ITSP: [{name:'Trust'}],
                        FSP: [{name:'Foundation'}]
                    },
                    5: {
                        ICSP: [{name: 'ICSP'}],
                        ITSP: [{name: 'ITSP'}],
                        FSP: [{name: 'FSP'}]
                    }
                },
                adminUsers: [],
                sorting: {
                    key: 'id',
                    order: 'desc'
                },
                pagination: {
                    perPage: 10,
                    page: 1,
                    total: 0
                },
                warningModal: {
                    visible: false,
                    buttons: {
                        ok: true,
                        confirm: false,
                        cancel: false
                    }
                },
                tableData: [],
                selectedRows: null,
                document_id: null,
                companies: [],
                isSelected: false,
                uploadData:{
                    documentBrief: '',
                    documentDate: '',
                    fileUpload: null
                },
                
                successModal: {
                    isVisible: false,
                    message: '',
                },
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() < Date.now();
                    }
                },
                customErrors: {
                    noEntity: {
                        status: false,
                        message: '',
                        errorURL: '',
                    }
                },
                fileXSLS: null,
                isReInspection: false,
                readonly: false,
                editMode: false,
                entityLock: false
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
            selectedInspectionTeam() {
                return this.adminUsers.filter( item => {
                    return this.form.inspectionTeamJson.filter(val => {
                        return val.adminuser_id == item.id
                    }).length > 0;
                })
            },
            getEntityType() {
                if(this.form.inspectionType_id && this.form.inspectionType_id !== null && this.userData && this.userData.department_id == 2){
                    if( this.form.inspectionType_id == 1 || this.form.inspectionType_id == 2 || this.form.inspectionType_id == 3 || this.form.inspectionType_id == 5 ){

                        return this.entityTypes[this.form.inspectionType_id][this.form.licenseType];
                    }
                    else{
                        return this.entityTypes[1][this.form.licenseType];
                    }
                }else{
                    return this.entityTypes[1][this.form.licenseType];
                }
            },
        },
        watch: {
            getEntityType(val) {
                if(val && val !== null && val.length == 1){
                    this.inspectionItemEntityType = val[0].name;
                }
            },
            'form.license_id': function() {
                this.customErrors.noEntity.status = false;
                this.customErrors.noEntity.message = '';
                this.customErrors.noEntity.errorURL = '';
                this.form.sampleSize = 0;
                this.form.sampleEntity = null;
                // this.form.excelDataURL = '';
                this.fileXSLS = null;
                this.form.entityJson = [];
            },
            'form.licenseeName': function(val) {
                if(val === null || val === undefined || val == ''){
                    this.resetCompany();
                    this.resetCompanies()
                    this.isSelected = false;
                }
            },
            'form.licenseRegNo': function(val) {
                if(val === null || val === undefined || val == ''){
                    this.resetCompany();
                    this.resetCompanies()
                    this.isSelected = false;
                }
                else{
                    if(this.form.inspectionType_id == 5) {
                        this.inspectionItemEntityType = this.entityTypes[5][this.form.licenseType][0].name;
                    }
                }
            },
            'form.licenseType': function(val) {
                if(!this.$route.params.id){
                    const formConst = {
                        licensees: [],
                        licenseeName: null,
                        licenseRegNo: '',
                        license_id: null,
                        address_id: null,
                        inspectionDate: null,
                        inspectionTime: '08:00',
                        inspectionScopeNarration: '',
                        inspectionObjective: '',
                        company_id: null,
                        sampleSize: 0,
                        sampleEntity: null,
                        inspectionItem: null,
                        requestedDocumentJson: [],
                        inspectionTeamJson: [],
                        inspectionItemJson: [],
                        entityJson: [],
                        excelDataURL: '',
                    }
                    this.fileXSLS = null;
                    for (const [key, value] of Object.entries(formConst)) {
                        this.form[key] = value;
                    }
                    this.inspectionTeamLead = null; 
                    this.inspectionItemEntityType = null;
                    this.selectAll = 0;
                }
                if(val !== null && val !== undefined && this.form.licenseTypes.length > 0){
                    this.form.process_id = this.form.licenseTypes.find( item => {
                        return item.Name === val
                    }).inspectionProcess_id
                }
            },
            inspectionTeamLead(val) {
                if(val !== null || val !== undefined){
                    this.form.inspectionTeamJson.map( item => {
                        if(item.adminuser_id == val){
                            item.isTeamLead = 1;
                        }
                        else{
                            item.isTeamLead = 0;
                        }
                    })
                }
            },
            inspectionItemEntityType(val) {
                this.form.inspectionItemJson.forEach(item => {
                    item.EntityType = this.inspectionItemEntityType
                })
                this.selectAll = 0;
                if(val !== undefined && val !== null){
                    this.getInspectionItem();
                }
            },
            selectAll(val) {
                if(val == 1) {
                    // this.$set(this.value,[]);
                    this.form.inspectionItemJson = [];
                    this.inspectionItems.forEach(item => {
                        this.form.inspectionItemJson.push({
                            inspectionItem_id: item.id,
                            EntityType: this.inspectionItemEntityType,
                        })
                    })
                }
                if(val == 0) {
                    const jsonFilledLength = this.form.inspectionItemJson.filter(item => {
                        return item.inspectionItem_id !== null
                    }).length;
                    if(jsonFilledLength == this.inspectionItems.length ){
                        this.form.inspectionItemJson = [];
                    }
                    
                }
            },
            'form.inspectionItemJson': function(val){
                if(val.length > 0){
                    const jsonFilledLength = val.filter(item => {
                        return item.inspectionItem_id !== null
                    }).length;
                    if(jsonFilledLength !== this.inspectionItems.length && this.selectAll == 1){
                        this.selectAll = 0;
                    }
                }
            }
        },
        created() {
            this.getFilterValues();
            if(this.$route.name == 'ViewInspectionFormByID'){
                this.readonly = true;
            }
        },
        methods: {
            fileXSLSUploadHandler(file) {
                this.fileXSLS = file;
                if(file && file != null) this.uploadExcel();
            },
            uploadExcel() {
                const formData = new FormData();
                formData.append('sample', this.fileXSLS);
                formData.append('license_id', this.form.license_id);
                uploadRandomSample(formData).then(
                    res => {
                        if(res.data.error_count == 0){
                            this.customErrors.noEntity.status = false;
                            this.customErrors.noEntity.errorURL = '';
                            this.form.entityJson = res.data.data;
                            this.form.excelDataURL = res.data.url;
                        }
                        else{
                            this.form.excelDataURL = '';
                            this.customErrors.noEntity.errorURL = res.data.url;
                            this.customErrors.noEntity.status = true;
                        }
                    }
                )
            },
            getInspectionItem(){
                fetchInspectionItem({entityType: this.inspectionItemEntityType}).then(
                    res => {
                        this.inspectionItems = res.data[0];
                    }
                )
            },
            fetchData(){
                this.showLoader();
                fetchInspectionPlanbyId({inspection_id: parseInt(this.$route.params.id)}).then(
                    res => {
                        const data = res.data[0];
                        const form = this.form;
                        form.inspectionType_id = data.inspectionType_id;
                        form.licenseType = data.LicenseType;
                        form.inspectionType_id !== 5 ?form.address_id = data.address_id : form.officeAddress_id = data.address_id;
                        form.company_id = data.company_id;
                        form.entityJson = JSON.parse(data.entityJson);
                        form.inspectionDate = data.inspectionDate;
                        form.inspectionItemJson = JSON.parse(data.inspectionItemJson);
                        form.inspectionObjective = data.inspectionObjective;
                        form.inspectionScopeNarration = data.inspectionScopeNarration;
                        form.inspectionTeamJson = JSON.parse(data.inspectionTeamJson);
                        form.inspectionTime = data.inspectionTime;
                        form.license_id = data.license_id;
                        form.requestedDocumentJson = data.requestedDocumentJson != null ? JSON.parse(data.requestedDocumentJson) : [];
                        form.reference_id = parseInt(this.$route.params.id);
                        form.licenseeName = data.LicenseeName;
                        form.licenseRegNo = data.CompanyRegNo;
                        form.process_id = data.process_id;
                        form.excelDataURL = data.entityXLSpath;

                        if(data.parent_id!==null) {
                            this.isReInspection = true;
                        }

                        this.inspectionTeamLead = form.inspectionTeamJson.filter( item => {
                            return item.isTeamLead == 1
                        })[0].adminuser_id;

                        if(form.inspectionItemJson.length > 0 && this.$route.params.id ){
                            this.inspectionItemEntityType = form.inspectionItemJson[0].EntityType;                    
                        }

                        // this.form.excelDataURL = data.entityXLSpath;
                        this.hideLoader();
                        this.form.inspectionTypes.filter(item => {
                            if (item.id==4 && this.isReInspection) {
                                this.form.inspectionType_id = 4;
                            }
                        })
                        if(data.Status_id !== 401){
                            this.readonly = true;
                        }
                    }
                )
            },
            submitInspection(){
                this.$refs.validator.validate().then(result => {
                    if (result) {
                        const { process_id, reference_id, inspectionType_id, licenseType, license_id, address_id, inspectionDate, inspectionTime, entityJson, inspectionTeamJson, inspectionScopeNarration, inspectionObjective, company_id, inspectionItemJson, requestedDocumentJson, isSpotCheck, officeAddress_id } = this.form;
                        
                        inspectionItemJson.forEach( item => item.EntityType= this.inspectionItemEntityType )
                        if( this.userData.department_id == 2){
                            const data= {
                                process_id,
                                reference_id,
                                inspectionType_id,
                                licenseType,
                                license_id,
                                address_id: inspectionType_id == 5 ? officeAddress_id : address_id,
                                company_id,
                                inspectionDate,
                                inspectionTime,
                                entityJson: inspectionType_id == 2 || inspectionType_id == 5 ? JSON.stringify([{company_id: company_id, entityType: licenseType}]) : JSON.stringify(entityJson),
                                inspectionTeamJson: JSON.stringify(inspectionTeamJson),
                                inspectionScopeNarration,
                                inspectionObjective,
                                requestedDocumentJson: JSON.stringify(requestedDocumentJson),
                                inspectionItemJson: JSON.stringify(inspectionItemJson),
                                entityXLSpath: this.form.excelDataURL,
                                isSpotCheck: isSpotCheck,  
                            }
                            this.submitData(data);
                        }
                        else{
                            const data= {
                                process_id,
                                reference_id,
                                inspectionType_id,
                                licenseType,
                                license_id,
                                address_id: inspectionType_id == 5 ? officeAddress_id : address_id,
                                company_id,
                                inspectionDate,
                                inspectionTime,
                                entityJson: JSON.stringify([{company_id: company_id, entityType: licenseType}]),
                                inspectionTeamJson: JSON.stringify(inspectionTeamJson),
                                inspectionScopeNarration,
                                inspectionObjective,
                                requestedDocumentJson: JSON.stringify(requestedDocumentJson),
                                inspectionItemJson: JSON.stringify([{inspectionItem_id: 9}]),
                                entityXLSpath: this.form.excelDataURL,
                                ...(inspectionType_id == 8 && {isSpotCheck: isSpotCheck})
                            }
                            this.submitData(data);
                        }
                    }
                })
            },
            submitData(data){
                inspectionPlanbyAdminuser(data).then(
                    res => {
                        this.successModal.message = 'The Inspection Plan has been saved.';
                        this.successModal.isVisible = true;
                    }
                )
            },
            generateSample(){
                const data = {entityType: this.form.sampleEntity, sampleSize: this.form.sampleSize, license_id: this.form.license_id};
                fetchRandomInspectionSample(data).then(
                    res => {
                        if(res.data.data.length > 0){
                            this.customErrors.noEntity.status = false;
                            this.form.entityJson = res.data.data;
                            this.form.excelDataURL = res.data.url;
                        }
                        else{
                            this.customErrors.noEntity.message = `No ${this.form.sampleEntity} found for ${this.form.licenseeName}.`;
                            this.customErrors.noEntity.status = true;
                        }
                    }
                )
            },
            backToList(){
                this.successModal.isVisible = false;
                setTimeout(() => {this.$router.push('/inspection')}, 300);
            },
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            getFilterValues() {
                this.showLoader();
                
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;
                const data = {
                    user_id: this.userData.user_id,
                    filterjson: {
                        filter: [{Department_id: this.userData.department_id}],
                        sort: [{ key, order }],
                        paging: [
                            {
                                startindex: perPage * (page - 1) + 1,
                                pagesize: 30
                            }
                        ]
                    }
                };
                Promise.all([
                    getInspectionTypebyDepartment({department_id: this.userData.department_id}),
                    fetchEntityTypeByDepartment({department_id: this.userData.department_id, csl: 0}),
                    getAdminUserList(data)
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.form.inspectionTypes = response[0].data[0];
                this.form.licenseTypes = response[1].data;
                this.adminUsers = response[2].data[0];
                this.hideLoader();
                    
                if(this.$route.params.id){
                    this.fetchData();
                } 
                if(this.$route.name == 'InspectionFormByID') {
                    this.editMode = true;
                    this.entityLock = true;

                }
            },
            getData(val) {
                this.showLoader();
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;

                const filters = {};
                filters.Name = val;
                filters.licenseType = this.form.licenseType;

                const data = {
                    user_id: this.userData.user_id,
                    type: "licensee",
                    filterjson: {
                        filter: [filters],
                        sort: [{ key, order }],
                        paging: [
                            {
                                startindex: perPage * (page - 1) + 1,
                                pagesize: perPage
                            }
                        ]
                    }
                }
                getLicenseeList(data)
                    .then(this.handleResponse)
                    .catch(this.handleError)
            },
            handleResponse(response) {
                this.hideLoader();
                this.form.licensees = response.data[0];
                
                this.pagination.total = response.NumberOfRecords;
            },
            searchByRegNoTab() {
                if (!this.isSelected && this.form.licenseRegNo !== '') {
                    this.getLicenseeByRegNo();
                }
            },
            searchByRegNo(event) {
                if(event.keyCode === 13  && this.form.licenseRegNo !== ''){
                    if (!this.isSelected) {
                        this.getLicenseeByRegNo();
                            
                    }
                }
            },
            getLicenseeByRegNo() {
                this.showLoader();
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;

                const filters = {};
                filters.licenseType = this.form.licenseType;
                filters.RegNo = this.form.licenseRegNo;

                const data = {
                    user_id: this.userData.user_id,
                    type: "licensee",
                    filterjson: {
                        filter: [filters],
                        sort: [{ key, order }],
                        paging: [
                            {
                                startindex: perPage * (page - 1) + 1,
                                pagesize: perPage
                            }
                        ]
                    }
                }
                getLicenseeList(data)
                    .then(
                        res => {
                            if(res.data && res.data[0] && res.data[0][0]){
                                const licensee = res.data[0][0];
                                this.form.license_id = licensee.License_id;
                                this.form.company_id = licensee.Company_id;
                                this.form.address_id = licensee.Address_id; 
                                this.form.licenseeName = licensee.CompanyName;
                            }
                            this.hideLoader();
                        }
                    )
                    .catch(this.handleError)
            },
            onSelectLicenseeByName(value) {
                const licensee = this.form.licensees.find(item => item.CompanyName === value);
                this.form.license_id = licensee.License_id;
                this.form.company_id = licensee.Company_id;
                this.form.address_id = licensee.Address_id;
                this.form.licenseRegNo = licensee.License
                // this.isSelected = true;
            },
            resetCompany() {
                if(!this.readonly){
                    this.form.license_id = null;
                    this.form.address_id = null;
                    this.form.licenseeName = '';
                    this.form.licenseRegNo ='';
                    this.form.company_id = null;
                }
            },
            validateQuery(value) {
                return value.length >= 3
            },
            resetCompanies() {
                this.form.licensees = [];
            },
            onSearchName(val) {
                if (this.validateQuery(val) && !this.isSelected) {
                    this.getData(val);
                }
            },
        }
    }
</script>

<style lang="scss" module>
    .buttonpad{
        cursor: pointer;
        padding-top: 13px;
    }
    .excelFile {
        display: flex;
        padding: 5px 0;
    }

    .excelFileLabel {
        width: 120px;
        flex-shrink: 0;
        flex-grow: 0;
        align-items: center;
        display: flex;
    }

    .excelFileInput {
        flex-grow: 1;
    }
    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 11px;
        margin: 10px 0;
        font-weight: 400;
    }
    .indentClass{
        margin-left: 0px;
    }
    .marginLeft15 {
        margin-left: 15px
    }
    .marginLeft30 {
        margin-left: 30px
    }
    .boxStyle {
        padding: 15px;
        // border: 1px solid #ccc;
        position: relative;
        margin: 10px 0px;
        box-shadow: 0px 5px 15px rgba(0,0,0,0.1);    
    }


</style>
