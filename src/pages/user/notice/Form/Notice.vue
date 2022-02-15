<template>
    <FormWrapper>
        <PageTitle title="Notice" slot="title"  />
        <template v-if="!noticeGenerated">
            <ValidationObserver ref="validator">  
                <FormRow>
                    <div class="col-sm-6" :class="$style.filterItem">
                        <FormSelect  label="Notice Type" :items="noticeTypes"  item-name="Name" item-value="id" rules="required"  v-model="form.notice_id"   />
                    </div> 
                </FormRow>
                <FormRow v-if="form.notice_id !== null">
                    <div class="col-sm-4" :class="$style.filterItem">
                        <FormSelect  label="Signee" :items="form.Signees"  item-name="Fname" item-value="id" v-model="form.signee_id"   />
                    </div> 
                </FormRow>
                <!-- <FormRow v-if="isMultipleCompany === 0">
                    <div class="col-sm-4" :class="$style.filterItem">
                        <InputText rules="required" :width="200" label="Reg #" :readonly="form.EntityType === null || form.EntityType === undefined"  v-model="form.CompanyRegNo" @keyup.native="searchByRegNo" @focusout="searchByRegNoTab" />
                    </div>
                </FormRow> -->
                <FormRow v-if="form.notice_id !== null">
                    <div class="col-sm-12">
                        <ButtonGroup >
                            <FormButton  type="primary" @click="() => getAllCompany()" >
                                Get All Companies 
                            </FormButton>
                            
                            <FormButton  type="primary" @click="addCompany(true)" >
                                Add Companies
                            </FormButton>
                        </ButtonGroup>
                    </div>
                </FormRow>
                <FormRow v-if="form.notice_id !== null && isAddCompany">
                    <div class="col-sm-3">
                        <InputText :width="200" label="Reg #" :readonly="form.EntityType === null || form.EntityType === undefined"  v-model="form.CompanyRegNo" @keyup.native="searchByRegNo" @focusout="searchByRegNoTab" />
                    </div>
                    <div class="col-sm-6">
                        <FormAutoComplete
                            label="Entity Name"
                            :width="300"
                            :disabled="form.EntityType === null || form.EntityType === undefined"
                            v-model="form.Name"
                            :onChange="onSearchName"
                            :items="companies"
                            item-value="Name"
                            item-name="Name"
                            :onSelect="onSelectCompanyByName" />
                    </div>
                    <div class="col-sm-3">
                        <FormButton  type="primary" @click="addCompanyToJson()" >
                            Add Company
                        </FormButton>
                    </div>
                </FormRow>
                <div :class="$style.error" v-if="errorList.notSelected">Company must be selected first.</div>
                <div v-if="form.notice_id !== null">    
                    <DataTable :actions="true"
                        :data="companyEligibleJson"
                        :columns="tableColumn"
                        :is-loading="isLoading"
                        @on-selection-change="selectChange"
                    >
                        <template slot="actionsLeft">
                            <TableButton @click="submitDataNew">
                                <img src="../../../../assets/images/plus.png" alt="">
                                Generate
                            </TableButton>
                        </template>
                    </DataTable>
                </div>
            </ValidationObserver>
        </template>
        <template v-else>
            <CenterBlock :width="700">
                <FormRow>
                    <div class="col-sm-7">
                        <InputText readonly v-model="email.ToEmail" label="To:" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12">
                        <InputText v-model="email.EmailSubject" label="Subject:" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12">
                        <EditorComponent v-model="email.EmailBody" /> 
                        
                    </div>
                </FormRow>
                <FormRow v-if="(email.printqueue) && email.Attachmentjson && email.Attachmentjson !== null ">
                    <div class="col-sm-12" v-for="(file,ind) in parseAttachment(email.Attachmentjson)" :key="ind" >
                        <a @click="openWindow(file.HTMLBody)">{{file.FileNamePrefix}}</a>
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12">
                       <ButtonGroup>
                           <!-- <FormButton  v-if="!email.printqueue" left-icon="ios-send" type="success" @click="() => processNoticeHandler()" >Send</FormButton> -->
                           
                           <FormButton  left-icon="md-print" type="success" @click="() => processNoticeHandler()"   >Print Queue</FormButton>
                           <FormButton  type="primary" @click="backToHome()" >Back to Home</FormButton>
                       </ButtonGroup>
                    </div>
                </FormRow>
            </CenterBlock>
        </template>
        
        <Popup title="Success" type="success" :value="successModal.visible" :closable="false" :maskable="false" >
            {{ successModal.message }}
            <FormButton slot="footer" @click="backToHome()">Back To Home</FormButton>
        </Popup>
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
    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import {  generateNotice, processNotice, getNoticeTypebyDepartment, fetchEntityTypeByDepartment, getCompany, generateNoticeEligible, getEligibleByNotice, getSigneeList, sendNoticeToPrintqueue, } from '../api';
    import PageTitle from 'Components/layout/PageTitle';
    import loadingMixin from 'Mixins/loadingMixin'
    import FormAutoComplete from 'Components/form/FormAutoComplete';
    import { ValidationObserver } from "vee-validate"; 
    import DataTable from 'Components/DataTable';
    import validateSelectedRows from 'Mixins/validateSelectedRows';

    export default {
        name:'Notice',
        mixins: [ loadingMixin, validateSelectedRows ],
        components:{
            PageTitle,
            FormWrapper,
            FormAutoComplete,
            ValidationObserver,
            DataTable
        },
        data(){
            return{
                noticeTypes: [],
                form: {
                    notice_id: null,
                    EntityType: null,
                    entityList: [],
                    departmentList: [],
                    department_id: null, 
                    CompanyRegNo: '',
                    Name: '',
                    company_id: null,
                    Signees: [],
                    signee_id: null,
                },
                companies: [],
                isSelected: false,
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
                noticeGenerated: false,
                email: {},
                isMultipleCompany: null,
                isAddCompany: false,
                companyEligibleJson: [],
                companyIdStringJson: [],
                errorList: {
                    notSelected: false,
                },
                tableColumn: [
                    {
                        type: 'selection',
                        width: 40,
                        align: 'center'
                    },
                    {
                        title: 'Reg No.',
                        key: 'companyRegNo',
                        width: 100,
                    },
                    {
                        title: 'Company Name',
                        key: 'companyName',
                    },
                ],
                selectedRows: [],
            }
        },
        computed:{
            userData() {
                return this.$store.state.user.user
            },
        },
        watch: {
            'form.EntityType': function (newValue) {
                if ( newValue == '' || newValue === undefined || newValue === null) {
                    this.resetCompany();
                    this.resetCompanies();
                }
            },
            'form.department_id': function (newValue) {
                if(newValue !== null || newValue !== undefined){
                    this.fetchEntity();

                }
            },
            'form.CompanyRegNo': function (newValue) {
                if ( newValue == '') {
                    this.resetCompany();
                    this.resetCompanies();
                }
            },
            'form.Name': function (newValue) {
                if ( newValue == '') {
                    this.resetCompany();
                    this.resetCompanies();
                }
            },
            'form.notice_id': function (val) {
                if(val !== undefined && val !== null){
                    this.form.EntityType = this.noticeTypes.filter( item => {
                        return item.id == val;
                    })[0].EntityType;
                    this.isMultipleCompany = this.noticeTypes.filter( item => {
                        return item.id == val;
                    })[0].isMultiCompany;
                    this.isAddCompany = false;
                    this.companyEligibleJson = [];
                }
                if(val == null){
                    this.isMultipleCompany = null;
                    this.form.EntityType = null;
                    this.isAddCompany = false;
                    this.companyEligibleJson = [];
                }
            }

        },
        created(){
            this.getData();
        },
        methods:{
            selectChange(data) {
                this.selectedRows = data;
            },
            addCompanyToJson(){
                if(this.form.company_id !== null){
                    this.errorList.notSelected = false;
                    this.companyEligibleJson.push({
                        companyRegNo: this.form.CompanyRegNo,
                        companyName: this.form.Name,
                        company_id: this.form.company_id
                    })
                    this.resetCompany();
                }
                else{
                    this.errorList.notSelected = true;
                }
            },
            addCompany(val) {
                this.isAddCompany = val;
                this.companyEligibleJson = [];
                if(val == false){
                    this.resetCompany();
                    this.resetCompanies();
                }

            },
            getAllCompany() {
                this.isAddCompany = false;
                getEligibleByNotice({notice_id: this.form.notice_id}).then(
                    res => {
                        const arr = res.data[0];
                        this.companyEligibleJson = arr;
                    }
                )
            },
            backToHome() {
                this.successModal.visible = false;
                this.$router.push('/notice');
            },
            processNoticeHandler(){
                const { EmailBody, EmailSubject, Emailtemplate_id, ToEmail, companyJson, fsaref } = this.email;
                // if(this.isMultipleCompany == 1){
                    const data = {
                        notice_id: this.form.notice_id,
                        emailTemplate_id: Emailtemplate_id,
                        toEmail: ToEmail,
                        subject: EmailSubject,
                        body: EmailBody,
                        fsaref,
                        companyJson
                    }
                    // processNotice(data)
                    sendNoticeToPrintqueue(data).then(
                        res => {
                            this.successModal.message = 'Notice has been sent to Print Queue.';
                            this.successModal.visible = true;
                        }
                    )
                // }
                // else if(this.isMultipleCompany == 0){
                //     const data = {
                //         notice_id: this.form.notice_id,
                //         emailTemplate_id: Emailtemplate_id,
                //         toEmail: ToEmail,
                //         subject: EmailSubject,
                //         body: EmailBody,
                //         fsaref,
                //         company_id: this.form.company_id
                //     }
                //     // processNotice(data)
                //     sendNoticeToPrintqueue(data).then(
                //         res => {
                //             this.successModal.message = 'Notice has been sent to Print Queue.';
                //             this.successModal.visible = true;
                            
                //         }
                //     )
                // }
            },
            submitDataNew() {
                this.$refs.validator.validate().then(result => {
                    if (result) {
                        const { notice_id, company_id, signee_id } = this.form;
                        // this.companyIdStringJson = [];
                        // const idString = this.companyEligibleJson.map(row => row.company_id).join(',');
                        const rows = this.selectedRows;
                        if( this.isMultipleCompany === 0 ){
                            if(this.validateSelectedLength(1)){
                                const idString = rows.map(row => row.company_id).join(',');
                                const data = {
                                    notice_id,
                                    idString,
                                    signee_id: signee_id
                                }
                                generateNoticeEligible(data).then(
                                    res => {
                                        this.email = res.data[0][0]
                                        this.noticeGenerated = true; 
                                    }
                                )
                            }
                        }
                        else if( this.isMultipleCompany === 1){
                            if(this.validateSelectedLength()){
                                const idString = rows.map(row => row.company_id).join(',');
                                const data = {
                                    notice_id,
                                    signee_id: signee_id,
                                    idString
                                }
                                generateNoticeEligible(data).then(
                                    res => {
                                        this.email = res.data[0][0]
                                        this.noticeGenerated = true; 
                                    }
                                )
                            }
                        }
                    }
                })
            },
            submitData(){
                this.$refs.validator.validate().then(result => {
                    if (result) {
                        const { notice_id, company_id } = this.form;
                        if( this.isMultipleCompany === 0 ){
                            const data = {
                                notice_id,
                                company_id
                            }
                            generateNotice(data).then(
                                res => {
                                    this.email = res.data[0][0]
                                    this.noticeGenerated = true; 
                                }
                            )
                        }
                        else if( this.isMultipleCompany === 1){
                            const data = {
                                notice_id,
                            }
                            generateNotice(data).then(
                                res => {
                                    this.email = res.data[0][0]
                                    this.noticeGenerated = true; 
                                }
                            )
                        }
                    }
                })
            },
            getData(){
                Promise.all([
                    getNoticeTypebyDepartment({department_id: this.userData.department_id}),
                    fetchEntityTypeByDepartment({department_id: this.userData.department_id}),
                    getSigneeList()
                ]).then(this.handleResponse)
            },
            handleResponse(response){
                this.noticeTypes = response[0].data[0];
                this.form.entityList = response[1].data;
                this.form.Signees = response[2].data;
            },
            searchByRegNoTab() {
                
                if (!this.isSelected) {
                    const { CompanyRegNo } = this.form;
                    const { EntityType } = this.form;
                    if (CompanyRegNo ) {
                        getCompany({
                            EntityType: EntityType,
                            Name: '',
                            RegNo: CompanyRegNo,
                        }).then(res => {
                            if (res.data[0] && res.data[0].length > 0) {
                                var company = res.data[0][0];
                                this.form.company_id = company.id
                                this.form.EntityType = company.EntityType;
                                this.form.Name = company.Name;
                                this.form.CompanyRegNo = company.CompanyRegNo;
                                this.isSelected = false;
                            }
                        })
                        
                    }
                }
            },
            searchByRegNo(event) {
                if(event.keyCode === 13){
                    if (!this.isSelected) {
                        const { CompanyRegNo } = this.form;
                        const { EntityType } = this.form;
                        if (CompanyRegNo ) {
                            getCompany({
                                EntityType: EntityType,
                                Name: '',
                                RegNo: CompanyRegNo,
                            }).then(res => {
                                if (res.data[0] && res.data[0].length > 0) {
                                    var company = res.data[0][0];
                                    this.form.company_id = company.id
                                    this.form.EntityType = company.EntityType;
                                    this.form.Name = company.Name;
                                    this.form.CompanyRegNo = company.CompanyRegNo;
                                    this.isSelected = false;
                                }
                            })
                            
                        }
                    }
                }
            },
            onSelectCompanyByName(value) {
                var company = this.companies.find(item => item.Name === value);

                this.form.company_id = company.id;
                this.form.EntityType = company.EntityType;
                this.form.Name = company.Name;
                this.form.CompanyRegNo = company.CompanyRegNo;

                this.isSelected = true;
            },
            resetCompany() {
                if(!this.readonly){
                    // this.form.EntityType = null;
                    this.form.Name = '';
                    this.form.CompanyRegNo ='';
                    this.form.company_id = null;
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
                const { EntityType } = this.form;
                getCompany({
                    EntityType,
                    Name,
                    RegNo: '',
                }).then(res => {
                    this.companies = res.data[0];
                })
            },
        }
    }
</script>


<style lang="scss" module>
    .filter {
        margin: -10px 0 25px;
        display: flex;
        align-items: flex-end;
        flex-wrap: wrap;
    }

    .filterItem {
        flex: 0 0 180px;
        margin-right: 20px;
        margin-bottom: 20px;
    }

    .popupRow {
        padding: 5px 0 15px;
    }
    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 13px;
        font-weight: 400;
        margin-bottom: 20px;
    }

    
</style>