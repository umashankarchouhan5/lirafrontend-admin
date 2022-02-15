<template>
    <div>
        <template  v-if="ticket.process_id === 804">
            <ValidationObserver ref="observation" v-slot="{ passes }">
                
                    <FormRow >
                        <div class="col-sm-4">
                            <FormSelect  label="Department"  rules="required" :disabled="readOnly" :items="departments" item-name="Name" item-value="id" v-model="ticket.Department_id" />
                        </div>
                        <div class="col-sm-4">
                            <FormSelect  label="Investigating officer" :disabled="readOnly" :items="roles" item-name="Name" item-value="id" v-model="ticket.InvestigatingOfficer_id" />
                        </div>
                    </FormRow>
                    <FormRow>
                        <div class="col-sm-5">
                            <FormAutoComplete
                                label="Search Company"
                                v-model="companyName"
                                :disabled="readOnly"
                                :onChange="onSearchName"
                                :items="companies"
                                item-value="Name"
                                item-name="Name"
                                :onSelect="onSelectCompanyByName" />
                        </div>
                        
                        <div class="col-sm-4" >
                            <FormCheckbox v-model="rfiValues.isResolved"  name="Spot Check" :trueValue="1" :falseValue="0"> Is Resolved </FormCheckbox>
                        </div>
                    </FormRow>
                    <FormRow v-if="ticket.company_id && ticket.company_id !== null">
                        <div class="col-sm-6">
                            <strong>Entity: </strong> {{ticket.entityName}}
                        </div>
                        <div class="col-sm-6">
                            <strong>Entity Type: </strong> {{ticket.entityType}}
                        </div>
                    </FormRow>
                    <FormRow >
                        <div class="col-sm-12">
                            <InputTextArea :readonly="readOnly" name="comments" label="Final Notes" rows="5" v-model="rfiValues.comments" />
                        </div>
                    </FormRow>

                    <FormRow>
                        <ButtonGroup>
                            <FormButton type="primary" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
                            <FormButton left-icon="ios-send" type="success" v-if="!readOnly" @click="passes(updateForm)">Save</FormButton>
                            <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
                        </ButtonGroup>
                    </FormRow>
            </ValidationObserver>
        </template>
        <template v-if="ticket.process_id === 803">
            <ValidationObserver ref="observation" v-slot="{ passes }" >
                <FormRow>
                    <div class="col-sm-5">
                        <FormAutoComplete
                            label="Search Company"
                            v-model="companyName"
                            :disabled="readOnly"
                            :onChange="onSearchName"
                            :items="companies"
                            item-value="Name"
                            item-name="Name"
                            :onSelect="onSelectCompanyByName" />
                    </div>
                </FormRow>
                <FormRow v-if="ticket.company_id && ticket.company_id !== null">
                    <div class="col-sm-6">
                        <strong>Entity: </strong> {{ticket.entityName}}
                    </div>
                    <div class="col-sm-6">
                        <strong>Entity Type: </strong> {{ticket.entityType}}
                    </div>
                </FormRow>
                <FormRow >
                    <!-- <div class="col-sm-5">
                        <FormAutoComplete 
                            :disabled="readOnly"
                            v-model="ICSPName"
                            :onSearch="searchICSP"
                            :onSelect="selectICSP"
                            :onClear="clearICSP"
                            label="Service Provider"
                            item-name="name"
                            item-value="name"
                            :clearable="true"
                            :items="ICSPResultsFiltered" />
                    </div> -->
                    <div class="col-sm-4">
                        <FormAutoComplete
                            label="Search Person"
                            :disabled="readOnly"
                            v-model="personName"
                            :onChange="onSearchPersonName"
                            :items="persons"
                            item-value="FullName"
                            item-name="FullName"
                            :onSelect="onSelectPersonByName" />
                    </div>
                    <div class="col-sm-3">
                        <FormSelect  label="Filled Type" :items="filledType" item-name="name" item-value="value" :disabled="readOnly" v-model="rfiValues.filledfullPartial"  />
                    </div>
                </FormRow>
                <FormRow>
                    <!-- <div class="col-sm-3">
                        <FormSelect  label="Entity Type" :items="entityTypes" item-name="Name" item-value="Name" :disabled="readOnly" v-model="rfiValues.EntityType"  />
                    </div> -->
                    
                </FormRow>
                <FormRow >
                    <div class="col-sm-12">
                        <InputTextArea :readonly="readOnly" name="comments" label="Final Notes" rows="5" v-model="rfiValues.comments" />
                    </div>
                </FormRow>

                <FormRow>
                    <ButtonGroup>
                        <FormButton type="primary" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
                        <FormButton left-icon="ios-send" type="success" v-if="!readOnly" @click="passes(updateForm)">Save</FormButton>
                        <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
                    </ButtonGroup>
                </FormRow>
            </ValidationObserver>
        </template>
        <template  v-if="ticket.process_id === 1501 || ticket.process_id === 1502 || ticket.process_id === 1503 || ticket.process_id === 1504 || ticket.process_id === 1505">
            <ValidationObserver ref="observation" v-slot="{ passes }">
                
                    <FormRow >
                        <div class="col-sm-4">
                            <InputDate  label="Deadline"  rules="required" :readonly="readOnly"  v-model="ticket.deadline" />
                        </div>
                    </FormRow>
                    <FormRow>
                        <div class="col-sm-12">
                            <InputTextArea  label="Final Action Notes" :readonly="readOnly" :row="3" v-model="ticket.finalActionNotes" />
                        </div>
                    </FormRow>

                    <FormRow>
                        <ButtonGroup>
                            <FormButton type="primary" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
                            <FormButton left-icon="ios-send" type="success" v-if="!readOnly" @click="passes(updateForm)">Save</FormButton>
                            <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
                        </ButtonGroup>
                    </FormRow>
            </ValidationObserver>
        </template>
        <template  v-if="ticket.process_id === 106">
            <ValidationObserver ref="observation" v-slot="{ passes }">
                
                <FormRow >
                    <div class="col-sm-12">
                        <InputTextArea :readonly="readOnly" name="comments" label="Reason" rows="5" v-model="ticket.cessationReason" />
                    </div>
                </FormRow>

                <FormRow>
                    <ButtonGroup>
                        <FormButton type="primary" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
                        <FormButton left-icon="ios-send" type="success" v-if="!readOnly" @click="passes(updateForm)">Save</FormButton>
                        <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
                    </ButtonGroup>
                </FormRow>
            </ValidationObserver>
        </template>
        <!-- certificate of good standing & similars -->
        <template  v-if="ticket.process_id === 501 || ticket.process_id === 502 || ticket.process_id === 300 || ticket.process_id === 311 || ticket.process_id === 301 || ticket.process_id === 140">
            <ValidationObserver ref="observation" v-slot="{ passes }">
                <h4>User Submitted Info</h4>
                <br />
                <FormRow>
                    <div class="col-sm-3">
                        <InputText readonly label="Entity Type" :value="ticket.EntityType" />
                    </div>
                    <div class="col-sm-3">
                        <InputText readonly label="Reg No." :value="ticket.typeCompanyReg" />
                    </div>
                    <div class="col-sm-6">
                        <InputText readonly label="Company Name" :value="ticket.typeCompanyName" />
                    </div>
                </FormRow>
                <FormRow v-if="ticket.process_id === 140">
                    <div class="col-sm-3">
                        <InputText label="Enter Number of Pages" v-model="ticket.numPages" />
                    </div>
                </FormRow>
                <h4>Enter Company to be submitted </h4>
                <br />
                <FormRow >
                    <div class="col-sm-3">
                        <InputText rules="required" label="Reg #"  v-model="checkCompany.CompanyRegNo" @keyup.native="searchByRegNo" @focusout="searchByRegNoTab" />
                    </div>
                    <div class="col-sm-6">
                        <FormAutoComplete
                            label="Company Name"
                            rules="required"
                            v-model="checkCompany.CompanyName"
                            :onChange="onSearchCheckName"
                            :items="companies"
                            item-value="Name"
                            item-name="Name"
                            :onSelect="onSelectCheckCompanyByName" />
                    </div>
                    <div class="col-sm-3">
                        <FormButton left-icon="ios-send" type="success" v-if="!readOnly" @click="passes(updateForm)">Save</FormButton></div>
                </FormRow>
                <div :class="$style.error" v-if="errors.companyNotSelected" >Please select a valid company before saving .</div>
                <FormRow>
                    <ButtonGroup>
                        <FormButton type="primary" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
                        <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
                    </ButtonGroup>
                </FormRow>
            </ValidationObserver>
        </template>
    </div>
</template>
<script>
    import { getDepartments, fetchRoles, updateObservation, getAdminUserList, getCompany, getPersonbyName, searchICSPTypes, fetchEntityTypeByDepartment } from '../config/api';
    import { ValidationObserver } from "vee-validate";
    import loadingMixin from 'Mixins/loadingMixin';
    import FormAutoComplete from 'Components/form/FormAutoComplete';
    import InputDate from 'Components/form/InputDate';

    export default {
        name: 'Observation',
        mixins: [loadingMixin],
        components: {
            ValidationObserver,
            FormAutoComplete,
            InputDate
        },
        data(){
            return {
                departments: [],
                roles: [],
                icspList: [],
                rfiValues: {
                    // icsp_id: null,
                    company_id: null,
                    person_id: null,
                    // EntityType: null,
                    filledfullPartial: null,
                    comments: '',
                    isResolved: 0,
                },
                ICSPResultsFiltered: [],
                ICSPName: '',
                companies: [],
                companyName: '',
                company: {},
                personName: '',
                persons: [],
                person: {},
                entityTypes: [],
                filledType: [
                    {
                        name: 'Full',
                        value: 'Full'
                    },
                    {
                        name: 'Partial',
                        value: 'P'
                    }
                ],
                checkCompany: {
                    CompanyName: '',
                    CompanyRegNo: '',
                    company_id: null,
                },
                isCheckSelected: false,
                errors: {companyNotSelected: false}
            }
        },
        computed:{
            readOnly() {
                return this.$store.state.ticket.readOnly;
            },
            userData() {
                return this.$store.state.user.user
            },
            ticket() {
                return this.$store.state.ticket.ticket;
            },
            newCompanyModule() {
                return this.$store.state.ticket.newCompanyModule;
            }
        },
        created() {
            if(this.ticket && this.ticket !== null && this.ticket.process_id === 804){
                this.getDropdownValues();
                if(this.ticket.Department_id !== null && this.ticket.Department_id !== undefined) this.fetchUsers();   
            }
            else if(this.ticket && this.ticket !== null && this.ticket.process_id === 803){
                this.getRFIDropdownValues();
            }
            if(this.ticket && this.ticket.process_id && this.newCompanyModule.indexOf( this.ticket.process_id) !== -1 && this.ticket.typeCompanyReg && this.ticket.typeCompanyReg !== null){
                this.checkCompany.CompanyRegNo = this.ticket.typeCompanyReg;
                this.searchByRegNoTab();
            }
            if(this.ticket && this.ticket.company_id && this.ticket.company_id !== null){
                this.rfiValues.company_id = this.ticket.company_id;
            }
            if(this.ticket && this.ticket.comments && this.ticket.comments !== ''){
                this.rfiValues.comments = this.ticket.comments;
            }
            if(this.ticket && this.ticket.IsResolved && this.ticket.IsResolved !== '' && this.ticket.IsResolved !== null){
                this.rfiValues.isResolved = this.ticket.IsResolved;
            }
        },
        watch:{
            'ticket.Department_id': function(val){
                if(val !== null){
                    this.fetchUsers();
                }
            },
            ICSPName: function (val) {
                if (val === ''){
                    this.rfiValues.icsp_id = null;
                    this.ICSPResultsFiltered = [];
                }
            },
            'checkCompany.CompanyRegNo': function (val) {
                if ( val == '') {
                    this.resetCheckCompany();
                    this.resetCompanies();
                }
            },
            'checkCompany.CompanyName': function (val) {
                if ( val == '' || val == undefined) {
                    this.resetCheckCompany();
                    this.resetCompanies();
                }
            },
            "rfiValues.company_id": function(val) {
                if(val !== undefined && val !== null){
                    this.ticket.company_id = val;
                }
            }
         },
        methods: {
            // Search company for certificate of good standing
            searchByRegNoTab() {
                if (!this.isCheckSelected) {
                    this.searchCompanyDefault();
                }
            },
            searchByRegNo(event) {
                if(event.keyCode === 13){
                    if (!this.isCheckSelected) {
                        this.searchCompanyDefault();
                    }
                }
            },
            searchCompanyDefault() {
                const { CompanyRegNo } = this.checkCompany;
                if (CompanyRegNo ) {
                    getCompany({
                        EntityType: this.ticket.EntityType,
                        Name: '',
                        RegNo: CompanyRegNo,
                    }).then(res => {
                        if (res.data[0] && res.data[0].length > 0) {
                            var company = res.data[0][0];
                            this.checkCompany.company_id = company.id
                            this.checkCompany.CompanyName = company.Name;
                            this.checkCompany.CompanyRegNo = company.CompanyRegNo;
                            this.isCheckSelected = false;
                        }
                    })
                    
                }
            },
            onSelectCheckCompanyByName(value) {
                var company = this.companies.find(item => item.Name === value);

                this.checkCompany.company_id = company.id;
                this.checkCompany.CompanyName = company.Name;
                this.checkCompany.CompanyRegNo = company.CompanyRegNo;

                this.isCheckSelected = true;
            },
            resetCheckCompany() {
                if(!this.readonly){
                    this.checkCompany.CompanyName = '';
                    this.checkCompany.CompanyRegNo ='';
                    this.checkCompany.company_id = null;
                }
            },
            validateQuery(value) {
                return value.length >= 3
            },
            resetCompanies() {
                this.companies = [];
            },
            onSearchCheckName(val) {
                if (this.validateQuery(val) && !this.isCheckSelected) {
                    this.resetCompanies();
                    this.searchForCheckCompany(val);
                }
                this.isCheckSelected = false;
            },
            searchForCheckCompany(Name) {
                getCompany({
                    EntityType: this.ticket.EntityType,
                    Name,
                    RegNo: '',
                }).then(res => {
                    this.companies = res.data[0];
                })
            },


            //Search Person
            onSelectPersonByName(value) {
                this.person = this.persons.find(item => item.FullName === value);
                this.rfiValues.person_id = this.person.id;
            },
            onSearchPersonName(val) {
                if (val.length > 2) {
                    this.searchForPerson(val);
                }
            },
            searchForPerson(Name) {
                getPersonbyName({
                    Name,
                }).then(res => {
                    this.persons = res.data[0];
                })
            },
            //Search Company
            onSelectCompanyByName(value) {
                this.company = this.companies.find(item => item.Name === value);
                this.rfiValues.company_id = this.company.id;
                this.ticket.entityName = this.company.Name;
                this.ticket.entityType = this.company.EntityType;
            },
            onSearchName(val) {
                if (val.length > 2) {
                    this.searchForCompany(val);
                }
            },
            searchForCompany(Name) {
                getCompany({
                    Name,
                    RegNo: '',
                }).then(res => {
                    this.companies = res.data[0];
                })
            },
            //Select ICSP
            clearICSP(){
                this.rfiValues.icsp_id = null;
                this.ICSPResultsFiltered = [];
            },
            selectICSP(name) {
                this.rfiValues.icsp_id = this.ICSPResultsFiltered.find(item => item.name === name).id;
            },
            searchICSP(value) {
                if (value.length > 2) {
                    this.ICSPResultsFiltered = this.icspList.filter(item => {
                        return item.name !== null ? item.name.toLowerCase().includes(value.toLowerCase()) : false;
                    })
                } else {
                    this.ICSPResultsFiltered = []
                }
                if(value === ''){
                    this.rfiValues.icsp_id = null;
                }
            },
            //getRFI values
            getRFIDropdownValues() {
                this.showLoader();
                Promise.all([
                    searchICSPTypes({department_id: this.userData.department_id}),
                    fetchEntityTypeByDepartment({department_id: this.userData.department_id}),
                ]).then(this.handleRFIDropdownValues)
            },
            handleRFIDropdownValues(response){
                this.icspList = response[0].data;
                this.entityTypes = response[1].data;
                this.hideLoader();
            },
            getDropdownValues() {
                this.showLoader();
                const data = { TableName: 'MasDepartment' };
                Promise.all([
                    getDepartments(data),
                ]).then(this.handleDropdownValues)
            },
            handleDropdownValues(response) {
                this.departments = response[0].data;
                this.hideLoader();
            },
            //Fetch Admin Users
            fetchUsers(){
                const data = {
                    filterjson: {
                        filter: [
                            {
                                Department_id: this.ticket.Department_id
                            }
                        ],
                        paging: [{startindex: 1, pagesize: 100}],
                        sort: [{key: "id", order: "desc"}]
                    }
                }
                getAdminUserList(data).then(
                    res => {
                        this.roles = res.data[0];
                    }
                )
            },
            //Send observations
            updateForm(){
                this.setData().then(
                    response => {
                        if( this.newCompanyModule.indexOf( this.ticket.process_id) !== -1 ) {
                            if(this.checkCompany.company_id !== null) {
                                this.errors.companyNotSelected = false;
                                updateObservation(response).then(
                                    res => {
                                        if( this.newCompanyModule.indexOf(this.ticket.process_id) !== -1 ){
                                            this.ticket.Company_id = this.checkCompany.company_id;
                                            this.ticket.CompanyRegNo = this.checkCompany.CompanyRegNo;
                                            this.ticket.CompanyName = this.checkCompany.CompanyName;
                                        }
                                        this.nextStep();
                                    }
                                )
                            }
                            else{
                                this.errors.companyNotSelected = true;
                            }
                        }
                        else{
                            updateObservation(response).then(
                                res => {
                                    if(this.newCompanyModule.indexOf( this.ticket.process_id) !== -1 ){
                                        this.ticket.Company_id = this.checkCompany.company_id;
                                        this.ticket.CompanyRegNo = this.checkCompany.CompanyRegNo;
                                        this.ticket.CompanyName = this.checkCompany.CompanyName;
                                    }
                                    this.nextStep();
                                }
                            )
                        }
                    }
                )
            },
            async setData(){
                if(this.ticket.process_id === 804){
                    const data = {
                        process_id: this.ticket.process_id,
                        TicketReference: this.ticket.TicketReference,
                        department_id: this.ticket.Department_id,
                        investigating_id: this.ticket.InvestigatingOfficer_id,
                        comments: this.rfiValues.comments,
                        company_id: this.rfiValues.company_id,
                        isResolved: this.rfiValues.isResolved

                    };
                    return data;
                }
                else if(this.ticket.process_id === 803){
                    const data = {
                        TicketReference: this.ticket.TicketReference,
                        process_id: this.ticket.process_id,
                        ...this.rfiValues
                    }
                    return data;
                }
                else if(this.ticket.process_id === 1501 || this.ticket.process_id === 1502 || this.ticket.process_id === 1503 || this.ticket.process_id === 1504 || this.ticket.process_id === 1505){
                    const data = {
                        TicketReference: this.ticket.TicketReference,
                        process_id: this.ticket.process_id,
                        deadline: this.ticket.deadline,
                        finalActionNotes: this.ticket.finalActionNotes
                    }
                    return data;
                }
                else if(this.ticket.process_id === 106){
                    const data = {
                        TicketReference: this.ticket.TicketReference,
                        process_id: this.ticket.process_id,
                        company_id: this.ticket.company_id,
                        comments: this.ticket.cessationReason
                    }
                    return data;
                }
                else if( this.newCompanyModule.indexOf(this.ticket.process_id) !== -1 ) {
                    const data = {
                        TicketReference: this.ticket.TicketReference,
                        process_id: this.ticket.process_id,
                        company_id: this.checkCompany.company_id,
                        ...(this.ticket.process_id === 140 && {numPages: this.ticket.numPages})
                    }
                    return data;
                }
            },
            nextStep() {
                this.$emit('nextStep')
            },
            prevStep() {
                this.$emit('prevStep')
            },
        }
    
    }
</script>
<style lang="scss" module>
    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 13px;
        font-weight: 400;
        margin-bottom: 20px;
    }
</style>