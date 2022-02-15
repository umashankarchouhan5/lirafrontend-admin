<template>
    <FormWrapper :is-loading="isLoading">
        <!-- <PageTitle title="Document Masters" slot="title" :link="`/help/${processId}`"/> -->
        <PageTitle title="Dossier Report" slot="title" />

        <div v-if="dossierData.length === 0">  
            
            <ValidationObserver ref="validator">  
                <FormRow>
                    <div class="col-sm-3">
                        <FormSelect label="Department" :items="filtering.departmentList" item-name="Name" item-value="id" v-model="filtering.department_id" rules="required"  :clearable="false"  />
                    </div> 
                    <div class="col-sm-3">
                        <FormSelect label="License Type" :items="filtering.entityList" :disabled="filtering.entityList.length === 0" item-name="longName" item-value="Name" rules="required"  v-model="filtering.EntityType" :onChange="resetCompany"  />
                    </div> 
                </FormRow>
                <FormRow>
                    <div class="col-sm-3">
                        <InputText rules="required" label="Reg #" :readonly="filtering.EntityType === null || filtering.EntityType === undefined"  v-model="filtering.CompanyRegNo" @keyup.native="searchByRegNo" @focusout="searchByRegNoTab" />
                    </div>
                    <div class="col-sm-6">
                        <FormAutoComplete
                            label="Entity Name"
                            rules="required"
                            :width="300"
                            :disabled="filtering.EntityType === null || filtering.EntityType === undefined"
                            v-model="filtering.Name"
                            :onChange="onSearchName"
                            :items="companies"
                            item-value="Name"
                            item-name="Name"
                            :onSelect="onSelectCompanyByName" />
                    </div>
                </FormRow>
            </ValidationObserver>
            <FormButton  type="primary" @click="getData" >
                Submit
            </FormButton>
        </div>
        <div v-else>
            
            <Collapse v-model="openedPanel" accordion >
                <Panel name="contact_details">
                    Company Details 
                    <div slot="content">
                        <div v-for="(item,i) in getCompanyDetailsJson()" :key="i" :class="$style.dataStyle">
                            <FormRow :class="$style.dataStyleRow" v-if="item.Data !== '' && item.Data !== '1900-01-01'">
                                <div class="col-sm-12" >
                                    <b>{{item.Label}} : </b> {{item.Data}}
                                </div>
                            </FormRow>
                        </div>
                    </div>
                </Panel>
                <Panel name="management">
                    Management
                    <div slot="content">
                        
                    <DataTable :actions="true"
                        :data="managementJson"
                        :columns="config">
                        
                    </DataTable>
                    </div>
                </Panel>
                <Panel name="statistic" v-if="getStatisticsJson().length > 0">
                    Statistics 
                    <div slot="content">
                        <div v-for="(item,i) in getStatisticsJson()" :key="i" :class="$style.dataStyle">
                        <FormRow :class="$style.dataStyleRow">
                            <div class="col-sm-12" >
                                <b>{{item.Label}} : </b> {{item.Data}}
                            </div>
                        </FormRow>
                        </div>
                    </div>
                </Panel>
                <Panel name="documents">
                    Documents
                    <p slot="content">
                        <router-link :to="`/documents/${filtering.EntityType}/${filtering.CompanyRegNo}/${filtering.company_id}`" target="_blank">Go to Documents</router-link>
                        <!-- <router-link :to="{name: 'Documents',params: {entity:filtering.EntityType,entityReg:filtering.CompanyRegNo,entityName: filtering.Name}}" target="_blank">Go to Documents</router-link> -->
                    </p>
                </Panel>
                <Panel name="communication">
                    Communication
                    <p slot="content">
                        <!-- <router-link to="/correspondence" target="_blank">Go to Correspondence</router-link> -->
                        <router-link :to="`/correspondence/${filtering.CompanyRegNo}/${filtering.company_id}`" target="_blank">Go to Correspondence</router-link>
                    </p>
                </Panel>
                <Panel name="compliance">
                    Compliance
                    <p slot="content">
                        <!-- <router-link to="/correspondence" target="_blank">Go to Correspondence</router-link> -->
                        <router-link :to="`/company/compliance/dossier/${filtering.company_id}`" target="_blank">Go to Compliance</router-link>
                    </p>
                </Panel>
            </Collapse>

            <br />
            
            <FormButton  type="primary" @click="backToFilters" >
                Back
            </FormButton>

        </div>

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

    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import config from './table';
    import loadingMixin from 'Mixins/loadingMixin';
    import FormAutoComplete from 'Components/form/FormAutoComplete';
    import { getDepartmentList, fetchEntityTypeByDepartment, fetchDossierReport, getCompany } from '../api'
    import { Panel, Collapse } from 'view-design'
    import DataTable from 'Components/DataTable';
    import { ValidationObserver } from "vee-validate"; 

    export default {
        name: "DossierReport",
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle,
            FormAutoComplete,
            Panel, 
            Collapse,
            DataTable,
            ValidationObserver
        },
        data() {
            return {
                
                openedPanel: '',
                filtering: {
                    EntityType: null,
                    entityList: [],
                    departmentList: [],
                    department_id: null, 
                    CompanyRegNo: '',
                    Name: '',
                    company_id: null,
                },
                warningModal: {
                    visible: false,
                    buttons: {
                        ok: true,
                        confirm: false,
                        cancel: false
                    }
                },
                dossierData: [],
                tableData: [],
                config,
                selectedRows: null,
                document_id: null,
                companies: [],
                isSelected: false,
                managementJson: []
            }
        },
        
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        created() {
            this.filtering.department_id = this.userData.department_id
            this.getFilterValues();
            if(this.$route.params.licenseType && this.$route.params.id){
                this.filtering.EntityType = this.$route.params.licenseType;
                this.filtering.company_id = parseInt(this.$route.params.id);
                this.filtering.CompanyRegNo = this.$route.params.CompanyRegNo;
                this.getDataWhenID();
            }
        },
        watch: {
            'filtering.EntityType': function (newValue) {
                if ( newValue == '' || newValue === undefined || newValue === null) {
                    this.resetCompany();
                    this.resetCompanies();
                }
            },
            'filtering.department_id': function (newValue) {
                if(newValue !== null || newValue !== undefined){
                    this.fetchEntity();

                }
            },
            'filtering.CompanyRegNo': function (newValue) {
                if ( newValue == '') {
                    this.resetCompany();
                    this.resetCompanies();
                }
            },
            'filtering.Name': function (newValue) {
                if ( newValue == '') {
                    this.resetCompany();
                    this.resetCompanies();
                }
            }

        },
        methods: {
            backToFilters(){
                this.dossierData = []
            },
            getStatisticsJson(){
                var statistics = this.dossierData[0].StatisticsJson;
                if( statistics!== null & statistics !== ''){
                    return JSON.parse(statistics);
                }
                else{
                    return []
                }
            },
            getManagementJson(){
                var management = this.dossierData[0].ManagementJson;
                if( management!== null & management !== ''){
                    return JSON.parse(management);
                }
                else{
                    return []
                }
            },
            getCompanyDetailsJson(){
                const data = JSON.parse(this.dossierData[0].CompanyDetailsJson);
                const modData = data.filter( item => {
                    return item.Data !=='' && item.Data !== ' ' && item.Data !== '1900-01-01';
                })
                return modData;
            },
            fetchEntity(){
                fetchEntityTypeByDepartment({department_id: this.filtering.department_id}).then(
                    res=> {
                        this.filtering.entityList = res.data;
                    }
                )
            },
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            getFilterValues() {
                this.showLoader();
                Promise.all([
                    getDepartmentList(),
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.filtering.departmentList = response[0].data;
                this.hideLoader();
            },
            getData() {
                this.$refs.validator.validate().then(result => {
                    if (result) {
                        this.showLoader();

                        const data = {};

                        data.entityType = this.filtering.EntityType;
                        data.company_id = this.filtering.company_id;

                        fetchDossierReport(data)
                            .then(this.handleResponse)
                            .catch(this.handleError)
                    
                    }
                })
            },
            getDataWhenID() {
                this.showLoader();
                const data = {};

                data.entityType = this.filtering.EntityType;
                data.company_id = this.filtering.company_id;

                fetchDossierReport(data)
                    .then(this.handleResponse)
                    .catch(this.handleError)
            },
            handleResponse(response) {
                this.hideLoader();
                this.dossierData = response.data;
                this.managementJson = this.getManagementJson();
            },
            validateSelectedLength(value) {
                if (this.selectedRows.length === value) {
                    return true;
                }
                if (value === 1 && this.selectedRows.length !== 1) {
                    this.warningModal.message = 'Select one row please.';
                    this.showWarningModal(true);
                    return false
                }
                if (this.selectedRows.length === 0) {
                    this.warningModal.message = 'Select at least one row!';
                    this.showWarningModal(true);
                    return false
                }
                return true;
            },
            searchByRegNoTab() {
                
                if (!this.isSelected) {
                    const { CompanyRegNo } = this.filtering;
                    const { EntityType } = this.filtering;
                    if (CompanyRegNo ) {
                        getCompany({
                            EntityType: EntityType,
                            Name: '',
                            RegNo: CompanyRegNo,
                        }).then(res => {
                            if (res.data[0] && res.data[0].length > 0) {
                                var company = res.data[0][0];
                                this.filtering.company_id = company.id
                                this.filtering.EntityType = company.EntityType;
                                this.filtering.Name = company.Name;
                                this.filtering.CompanyRegNo = company.CompanyRegNo;
                                this.isSelected = false;
                            }
                        })
                        
                    }
                }
            },
            searchByRegNo(event) {
                if(event.keyCode === 13){
                    if (!this.isSelected) {
                        const { CompanyRegNo } = this.filtering;
                        const { EntityType } = this.filtering;
                        if (CompanyRegNo ) {
                            getCompany({
                                EntityType: EntityType,
                                Name: '',
                                RegNo: CompanyRegNo,
                            }).then(res => {
                                if (res.data[0] && res.data[0].length > 0) {
                                    var company = res.data[0][0];
                                    this.filtering.company_id = company.id
                                    this.filtering.EntityType = company.EntityType;
                                    this.filtering.Name = company.Name;
                                    this.filtering.CompanyRegNo = company.CompanyRegNo;
                                    this.isSelected = false;
                                }
                            })
                            
                        }
                    }
                }
            },
            onSelectCompanyByName(value) {
                var company = this.companies.find(item => item.Name === value);

                this.filtering.company_id = company.id;
                this.filtering.EntityType = company.EntityType;
                this.filtering.Name = company.Name;
                this.filtering.CompanyRegNo = company.CompanyRegNo;

                this.isSelected = true;
            },
            resetCompany() {
                if(!this.readonly){
                    // this.filtering.EntityType = null;
                    this.filtering.Name = '';
                    this.filtering.CompanyRegNo ='';
                    this.filtering.company_id = null;
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
                const { EntityType } = this.filtering;
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
    .dataStyle{
        &:nth-child(even){
            background: #f6f6f6
        }
        &:nth-child(odd){
            background: #ffffff
        }
        .dataStyleRow{

            padding: 10px 15px;
            margin: 0px 5px;
        }
    }
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



</style>
