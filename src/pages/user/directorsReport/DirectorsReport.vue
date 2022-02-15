<template>
    <FormWrapper>
        <PageTitle title="Directors Report" slot="title" :pdf="generatePdf" v-if="showPdf" />
        <PageTitle title="Directors Report" slot="title" v-else/>
        <div >
            <ValidationObserver ref="validator">
                <FormRow>
                    <div class="col-sm-2">
                        <InputText rules="required" label="Reg #"  v-model="company.CompanyRegNo" @keyup.native="searchByRegNo" @focusout="searchByRegNoTab" />
                    </div>
                    <div class="col-sm-6">
                        <FormAutoComplete
                            label="Name"
                            rules="required"
                            v-model="company.Name"
                            :onChange="onSearchName"
                            :items="companies"
                            item-value="Name"
                            item-name="Name"
                            :onSelect="onSelectCompanyByName" />
                    </div>
                    <div :class="$style.error" v-if="customErrors.notSelectedError">
                        Please Select a valid company before proceeding
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-6">
                        <InputText label="Director Name" v-model="directorName" />
                    </div>
                    <ButtonGroup >
                        <FormButton  @click="searchDirectors()" >Search Directors</FormButton>
                    </ButtonGroup>
                </FormRow>
                
            </ValidationObserver>
            <div v-if="tableData.length > 0">
                <DataTable :actions="true"
                   :data="tableData"
                   :columns="config"
                   @on-selection-change="selectChange">
                   <template slot="actionsLeft">
                        <TableButton @click="deleteDir">
                            <img src="../../../assets/images/del.png" />
                            Delete
                        </TableButton>
                    </template>
                    <template slot="actionsRight">
                        <TableButton @click="() => exportExcel()" v-if="showExcel">
                            <img src="../../../assets/images/Excel_Icon.png" alt="">
                            Export Excel
                        </TableButton>
                    </template>
                </DataTable>
            </div>
            <Popup title="Information" :value="warningModal.visible" @close="() => showWarningModal(false)">
                {{ warningModal.message }}
                <div slot="footer">
                    <FormButton  @click="() => showWarningModal(false)">Ok</FormButton>
                </div>
            </Popup>
            <Popup title="Information" :value="deleteModal.visible" @close="() => showDeleteModal(false)">
                {{ deleteModal.message }}
                <div slot="footer">
                    <FormButton v-if="deleteModal.buttons.delete" @click="deletion">Delete</FormButton>
                    <FormButton v-if="deleteModal.buttons.cancel" @click="() => showDeleteModal(false)">Cancel</FormButton>
                </div>
            </Popup>
            <Popup :value="successModal.visible" :title="successModal.title" type="success" :closable="false" :maskable="false" @close="() => successModal.visible = false">
                <div>
                    {{ successModal.message }}
                </div>
                <div slot="footer">
                    <FormButton @click="() => backToList()">Ok</FormButton>
                </div>
            </Popup>
        </div>
        
    </FormWrapper>
</template>

<script>
    
    import FormWrapper from 'Components/form/FormWrapper';
    import FormAutoComplete from 'Components/form/FormAutoComplete';
    import PageTitle from 'Components/layout/PageTitle';
    import { exportDirectorsExcel, companyDirectors, getCompany, deleteDirector } from './api';
    import { ValidationObserver } from "vee-validate";
    import DataTable from 'Components/DataTable';
    import config from './table';

    export default {
        name: "DirectorsReport",
        components: {
            FormAutoComplete,
            FormWrapper,
            PageTitle,
            ValidationObserver,
            DataTable
        },
        data(){
            return {
                companies: [],
                company: {
                    EntityType: 'IBC',
                    Name: '',
                    CompanyRegNo: '',
                    id: null,
                },
                directorName: null,
                isSelected: false,
                customErrors: {
                    notSelectedError: false,
                },
                deleteModal: {
                    visible: false,
                    buttons: {
                        delete: true,
                        confirm: false,
                        cancel: true
                    }
                },
                successModal: {
                    visible: false,
                    title: 'Success',
                    message: ''
                },
                warningModal: {
                    visible: false,
                    message: '',
                },
                tableData: [],
                config,
                selectedRows: [],
                showExcel: false,
                showPdf: false,
            }
        },
        created(){
        },
        computed:{
            userData() {
                return this.$store.state.user.user;
            },
        },
        watch:{
            'company.Name': function(val){
                if(val === ''){
                    this.isSelected = false;
                    this.reset();
                }
            },
            'company.CompanyRegNo': function(val){
                if(val === '' || val === null || val === undefined){
                    this.isSelected = false;
                    this.reset();
                }
            }
        },
        methods: {
            exportExcel() {
                const data = {
                    directorJson: {
                        company_id: this.company.id,
                        directorName: this.directorName
                    }
                }
                exportDirectorsExcel(data).then(
                    res => {
                        window.open(res.data,'_blank');
                    }
                )
            },
            generatePdf() {
                const data = {
                    isPdf: true,
                    directorJson: {
                        company_id: this.company.id,
                        directorName: this.directorName
                    }
                }
                exportDirectorsExcel(data).then(
                    res => {
                        window.open(res.data,'_blank');
                    }
                )
            },
            searchDirectors() {
                // if(this.directorName.trim() === '' ){
                //     this.$refs.validator.validate().then((result) => {
                //         if (result) {
                //             if(this.isSelected){
                //                 this.customErrors.notSelectedError = false;
                                const data = {
                                    directorJson: {
                                        company_id: this.company.id,
                                        directorName: this.directorName
                                    }
                                }
                                companyDirectors(data).then(
                                    res => {
                                        this.tableData = res.data;
                                        if (res.pdf_visibility==1) {
                                            this.showPdf = true;    
                                        }
                                        if (res.excel_visibility==1) {
                                            this.showExcel = true;
                                        }
                                    }
                                )
                //             }
                //             else{
                //                 this.customErrors.notSelectedError = true;
                //             }
                //         }
                //         else{
                //             this.customErrors.notSelectedError = false;
                //         }
                //     })
                // }
                // else{
                //     const data = {
                //         directorJson: {
                //             company_id: null,
                //             directorName: this.directorName
                //         }
                //     }
                //     companyDirectors(data).then(
                //         res => {
                //             this.tableData = res.data;
                //         }
                //     )
                // }
            },
            showWarningModal(val){
                this.warningModal.visible = val;
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            showSuccessModal(val){
                this.successModal.visible = val;
            },
            backToList(){
                this.showSuccessModal(false);
            },
            searchByRegNo(event) {
                if(event.keyCode === 13 || event.keyCode === 9){
                    this.searchByRegDefault();
                }
            },
            searchByRegNoTab() {
                this.searchByRegDefault();
            },
            searchByRegDefault(){
                const { CompanyRegNo, EntityType } = this.company;
                if (CompanyRegNo ) {
                        getCompany({
                            Name: '',
                            RegNo: CompanyRegNo,
                            EntityType: EntityType
                        }).then(res => {
                            if (res.data[0] && res.data[0].length > 0) {
                                this.company = res.data[0][0];
                                this.isSelected = true;
                            }
                        }
                    )
                }
            },
            onSelectCompanyByName(value) {
                this.company = this.companies.find(item => item.Name === value);
                this.isSelected = true;
            },
            reset() {
                this.resetCompany();
                this.entityTypes = [];
                this.companies = [];
                this.isSelected = false;
            },
            resetCompany() {
                this.company = {
                    Name: '',
                    CompanyRegNo: '',
                    EntityType: 'IBC',
                    id: null,
                };
            },
            validateQuery(value) {
                return value.length >= 3
            },resetCompanies() {
                this.companies = [];
            },
            onSearchName(val) {
                if ( this.validateQuery(val) && !this.isSelected ) {
                    this.resetCompanies();
                    this.searchForCompany(val);
                }
                // this.isSelected = false;
            },
            searchForCompany(Name) {
                getCompany({
                    EntityType: this.company.EntityType,
                    Name,
                    RegNo: '',
                }).then(res => {
                    this.companies = res.data[0];
                })
            },
            validateSelectedLength(value) {
                if (this.selectedRows.length === value) {
                    return true;
                }
                if (this.selectedRows.length === 0) {
                    this.warningModal.message = 'Select at least one row!';
                    this.showWarningModal(true);
                    return false
                }
                if (value === 1 && this.selectedRows.length !== 1) {
                    this.warningModal.message = 'Select one row please.';
                    this.showWarningModal(true);
                    return false
                }
                return true;
            },
            showDeleteModal(value) {
                this.deleteModal.visible = value;
            },
            deleteDir() {
                if (this.validateSelectedLength(1)) {
                    this.deleteModal.message = 'Are you sure you want to delete this?';
                    this.showDeleteModal(true);
                    return false
                }
            },
            deletion(){
                const row = this.selectedRows[0];
                console.log(row);
                deleteDirector({id:row.CompanyRODRequestData_id})
                    .then(this.handleDeleteResponse)
            },
            handleDeleteResponse(response) {
                this.showDeleteModal(false);
                this.successModal.message = 'Director is deleted successfully';
                this.showSuccessModal(true);
                this.searchDirectors
            },
        }
    }
</script>

<style lang="scss" module>
    
    .error {
        color: #ff3547;
        position: absolute;
        max-width: 100%;
        left: 0;
        font-size: 11px;
        line-height: 13px;
        bottom: -15px;
        font-weight: 400;
    }
</style>