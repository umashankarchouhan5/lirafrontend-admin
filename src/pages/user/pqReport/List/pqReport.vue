<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="PQ Report" slot="title" />

        <!-- Old PQ report style     -->
        <!-- <ValidationObserver ref="validator"> 
            <FormRow >
                <div class="col-sm-3">
                    <FormAutoComplete label="PQ ID"
                        v-model="pq.UniqueRef"
                        :items="pq_list"
                        item-value="UniqueRef"
                        item-name="UniqueRef"
                        rules="required"
                        placeholder="Enter PQID"
                        :isLoading="loaders.pqId"
                        :onSelect="onSelectPQ" 
                        @keyup.native="searchForPQHandler"
                        @focusout="searchForPQHandlerTab"
                    />
                </div>
                <div class="col-sm-6">
                    <FormAutoComplete label="Name"
                        v-model="pq.Name"
                        :items="pq_list"
                        item-value="UniqueRef"
                        item-name="Name"
                        :isLoading="loaders.pqName"
                        rules="required"
                        :onSelect="onSelectPQ" 
                    />
                </div>
            </FormRow>
        <p :class="$style.error">{{isMessage}}</p>
        </ValidationObserver>
        
        <FormButton  type="primary"  @click="getData" :disabled="!isSelected" :title="isSelected ? '' :'Select a PQ ID first'" >
            Submit
        </FormButton> -->


        <div :class="$style.filter">
            <div :class="$style.filterItem">
                <InputText rules="required" label="PQ Name"  v-model="filtering.name" />
            </div>
            <div :class="$style.filterItem">
                <InputText rules="required" label="PQ ID"  v-model="filtering.uniqueRef" />
            </div>
            <div :class="$style.filterItem">
                <InputText rules="required" label="Passport"  v-model="filtering.passport" />
            </div>
            
            <div :class="$style.filterItemShort">
                <FormCheckbox v-model="filtering.isDead" :trueValue="1" :falseValue="0">
                    Is Deceased
                </FormCheckbox>
            </div>
        </div>
        <div :class="$style.filter">
            <div :class="$style.filterItem">
                <InputText rules="required" label="Reg #"  v-model="filtering.CompanyRegNo" @keyup.native="searchByRegNo" @focusout="searchByRegNoTab" />
            </div>
            <div :class="$style.filterItem">
                <FormAutoComplete
                    label="Company Name"
                    rules="required"
                    v-model="filtering.Name"
                    :onChange="onSearchName"
                    :items="companies"
                    item-value="Name"
                    item-name="Name"
                    :onSelect="onSelectCompanyByName" />
            </div>
            <div :class="$style.filterItem">
                <FormSelect :width="200" label="Status" :items="filtering.status" item-name="name" item-value="id" v-model="filtering.statusSelected" />
            </div>
            <div :class="$style.filterItem">
                <FormButton style="margin-top: 5px" type="primary" @click="search" :rounded="true">
                    <Icon type="ios-search" />
                </FormButton>
            </div>
        </div>
        <DataTable :actions="true"
            :data="tableData"
            :columns="config"
            :is-loading="isLoading"
            @on-selection-change="selectChange"
            @on-page-change="pageChange"
            :pagination="pagination"
            @on-sort-change="sortChange"
            v-if="isSearched == true"
        >
            <template slot="actionsLeft">
                <TableButton @click="openPQ()">
                    <img src="../../../../assets/images/eye.png" />
                    View
                </TableButton>
                <TableButton @click="openPQModal()">
                    <img src="../../../../assets/images/upload.png" />
                    Update
                </TableButton>
            </template>
        </DataTable>
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
        <!-- PQ Modal  -->
        <Popup title="PQ Update" :value="pqModal.visible" @close="() => showUpdatePQModal(false)">
            <FormRow>
                <div class="col-sm-6">
                    <FormSelect :width="200" label="Status" :items="filtering.status" item-name="name" item-value="id" v-model="pqStatus_id" />
                </div>
                <div class="col-sm-6">
                    <FormCheckbox v-model="pqIsDead" :trueValue="1" :falseValue="0">
                        Is Deceased
                    </FormCheckbox>
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <InputTextArea label="Comments" v-model="pqComments" />
                </div>
            </FormRow>
            <div slot="footer">
                <FormButton  @click="() => updatePQ()">Submit</FormButton>
                <FormButton  @click="() => showUpdatePQModal(false)">Close</FormButton>
            </div>
        </Popup>

    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import config from './table';
    import loadingMixin from 'Mixins/loadingMixin';
    import { fetchPQSearchbyAdmin, getPQFormData, getPQList, getCompany, getCompanyStatus, updatePQStatusByAdmin, getCompanyRegName } from '../api'
    import FormAutoComplete from 'Components/form/FormAutoComplete';
    import DataTable from 'Components/DataTable';
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    // import { ValidationObserver } from "vee-validate"; 

    export default {
        name: "PQReport",
        mixins: [loadingMixin,validateSelectedRows],
        components: {
            FormWrapper,
            PageTitle,
            FormAutoComplete,
            DataTable,
            // ValidationObserver
        },
        data() {
            return {
                loaders: {
                    pqId: false,
                    pqName: false
                },
                pq: {
                    UniqueRef: '',
                    Name: '',
                    id: ''
                },
                pq_list: [],
                warningModal: {
                    visible: false,
                    buttons: {
                        ok: true,
                        confirm: false,
                        cancel: false
                    }
                },
                pqData: [],
                filtering: {
                    status: [],
                    statusSelected: null,
                    CompanyRegNo: '',
                    Name: '',
                    company_id: null,
                    companyResults: [],
                    companyResultsFiltered: [],
                    name: null,
                    passport: null,
                    isDead: 0,
                    uniqueRef: null,
                },
                isSelected: false,
                config,
                isMessage: '',
                sorting: {
                    key: 'id',
                    order: 'desc'
                },
                pagination: {
                    perPage: 10,
                    page: 1,
                    total: 0
                },
                companies: [],
                tableData: [],
                selectedRows: [],
                isSearched: false,
                pqModal: {
                    visible: false
                },
                pqComments: '',
                pqStatus_id: null,
                pqIsDead: 0,
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        watch: {
            'pq.Name': function(val) {
                if(val == null || val == undefined || val == ''){
                    this.reset();
                }else{
                    if (this.validateValue(val)) {
                        this.loaders.pqName = true;
                        this.searchForPQHandler1()
                    }
                }
            },
            'pq.UniqueRef': function(val) {
                if(val == null || val == undefined || val == ''){
                    this.reset();
                }
            },

        },
        created() {
            this.getFilterValues();
            if(this.$route.params.company_id){
                this.filtering.company_id = parseInt(this.$route.params.company_id);
                this.getCompanyReg()
                this.getDataByFilter();
                this.$router.replace('/PQReport')
            }
        },
        methods: {
            getCompanyReg() {
                getCompanyRegName({company_id: this.filtering.company_id}).then(
                    res => {
                        this.filtering.CompanyRegNo = res.data[0].CompanyRegNo;
                        this.filtering.Name = res.data[0].Name;
                    }
                )
            },
            showUpdatePQModal(val) {
                this.pqModal.visible = val;
            },
            openPQModal() {
                if(this.validateSelectedLength(1)) {
                    this.showUpdatePQModal(true);
                }
            },
            updatePQ() {
                if(this.validateSelectedLength(1)) {
                    const row = this.selectedRows[0];
                    const data = {
                        pq_id: row.pq_id,
                        comments: this.pqComments,
                        adminuser_id: this.userData.user_id,
                        isDead: this.pqIsDead,
                        status_id: this.pqStatus_id
                    }
                    updatePQStatusByAdmin(data).then(
                        res => {
                            this.showUpdatePQModal(false);
                        }
                    )
                }
            },
            openPQ() {
                if(this.validateSelectedLength(1)) {
                    const row = this.selectedRows[0];
                    window.open(`/pqReadonly/${row.pq_id}`, '_blank');
                }
            },
            getDataByFilter() {
                this.showLoader();
                const { key, order } = this.sorting;
                // const { perPage, page } = this.pagination;
                const perPage = this.pagination.perPage;
                const page = this.pagination.page;
                const filters = {};

                filters.company_id = this.filtering.company_id;
                filters.status_id = this.filtering.statusSelected;
                filters.name = this.filtering.name;
                filters.passport = this.filtering.passport;
                filters.uniqueRef = this.filtering.uniqueRef;
                filters.isDead = this.filtering.isDead;

                const data = {
                    // user_id: this.userData.user_id,
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
                };
                getPQList(data)
                    .then(this.handleResponse1)
            },
            handleResponse1(response) {
                this.hideLoader();
                // if(typeof response.viewLog !=="undefined" && response.viewLog==1) {
                //     this.viewLog = 1;
                // }
                this.tableData = response.data[0];
                this.pagination.total = response.NumberOfRecords;
                this.isSearched = true;
                // if (response.pdf_visibility==1) {
                //     this.showPdf = true;    
                // }
                // if (response.excel_visibility==1) {
                //     this.showExcel = true;
                // }
            },
            getFilterValues() {
                this.showLoader();
                Promise.all([
                    getCompanyStatus({statusType_id: 2}),
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.filtering.status = response[0].data[0];
                this.hideLoader();
            },
            sortChange(data) {
                this.sorting.key = data.key;
                this.sorting.order = data.order;
                this.getDataByFilter()
            },
            pageChange(page) {
                this.pagination.page = page;
                this.getDataByFilter()
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            search(){
                this.pagination.page = 1;
                this.getDataByFilter()
            },

            // company search start 
            
            searchByRegNoTab() {
                this.searchByRegNoDefault();
            },
            searchByRegNoDefault() {
                
                if (!this.isSelected) {
                    const { CompanyRegNo } = this.filtering;
                    if (CompanyRegNo ) {
                        getCompany({
                            Name: '',
                            RegNo: CompanyRegNo,
                        }).then(res => {
                            if (res.data[0] && res.data[0].length > 0) {
                                var company = res.data[0][0];
                                this.filtering.company_id = company.id
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
                    this.searchByRegNoDefault();
                }
            },
            onSelectCompanyByName(value) {
                var company = this.companies.find(item => item.Name === value);

                this.filtering.company_id = company.id;
                this.filtering.Name = company.Name;
                this.filtering.CompanyRegNo = company.CompanyRegNo;

                this.isSelected = true;
            },
            resetCompany() {
                if(!this.readonly){
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
                getCompany({
                    Name,
                    RegNo: '',
                }).then(res => {
                    this.companies = res.data[0];
                })
            },

            //company search ended
            
            //pq search
            onSelectPQ(pq_id) {
                this.pq = this.pq_list.find(item => item.UniqueRef === pq_id);
                this.isSelected = true;
            },
            searchForPQHandler(event) {
                if(event.keyCode === 9 ||  event.keyCode === 13){
                    if (this.validateValueNew()) {
                        this.loaders.pqId = true;
                        const { Name, UniqueRef } = this.pq;
                        fetchPQSearchbyAdmin({
                            UniqueRef,
                            // Name,
                        }).then(res => {
                            this.loaders.pqName = false;
                            this.loaders.pqId = false;
                            this.pq_list = res.data[0];
                            if(this.pq_list.length === 1){
                                this.pq = this.pq_list[0];
                                this.isMessage = '';
                                this.isSelected = true;
                            }
                            
                            if(this.pq_list.length === 0){
                                this.pq.Name = '';
                                this.pq.id = ''
                                this.isSelected = false;
                                this.isMessage = 'No PQ found.';
                            }
                        })
                    }
                }
            },
            searchForPQHandlerTab() {
                if (this.validateValueNew()) {
                    this.loaders.pqId = true;
                    const { Name, UniqueRef } = this.pq;
                    fetchPQSearchbyAdmin({
                        UniqueRef,
                        // Name,
                    }).then(res => {
                        this.loaders.pqName = false;
                        this.loaders.pqId = false;
                        this.pq_list = res.data[0];
                        if(this.pq_list.length === 1){
                            this.pq = this.pq_list[0];
                            this.isSelected = true;
                            this.isMessage = ''
                        }
                        if(this.pq_list.length === 0){
                            this.pq.Name = '';
                            this.pq.id = ''
                            this.isSelected = false;
                            this.isMessage = 'No PQ found.'
                        }
                    })
                }
            },
            searchForPQHandler1() {
                this.loaders.pqId = true;
                const { Name, UniqueRef } = this.pq;
                fetchPQSearchbyAdmin({
                    // UniqueRef,
                    Name,
                }).then(res => {
                    this.loaders.pqName = false;
                    this.loaders.pqId = false;
                    this.pq_list = res.data[0];
                    this.isSelected = true;
                    this.isMessage = ''
                })
            },
            validateValueNew() {
                return this.pq.UniqueRef.length >=1
            },
            validateValue(value) {
                return value.length >=3
            },
            reset() {
                this.pq = {
                    UniqueRef: '',
                    Name: '',
                    id: ''
                };
                this.data = {
                    position_id: null,
                    Licensee: null,
                    icsp_id: null,
                    name: null,
                }
                this.isSelected = false;
                this.pq_list = [];
                this.isMessage = '';
            },
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            getData() {
                this.$refs.validator.validate().then(result => {
                    if (result) {
                        if(this.pq.id !== ''){
                            window.open(`/pqReadonly/${this.pq.pq_id}`, '_blank');
                            const data= {
                                pq_id: this.pq.pq_id
                            }
                            getPQFormData(data)
                                .then(this.handleResponse)
                                .catch(this.handleError)
                        }
                        else{
                            this.isMessage = 'No PQ ID selected.'
                        }
                    }
                })
            },
            handleResponse(response) {
                this.hideLoader();
                this.pqData = response.data[0];
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
            
        }
    }
</script>

<style lang="scss" module>

    .filter {
        margin: -10px 0 25px;
        display: flex;
        align-items: flex-end;
    }

    .filterItem {
        flex: 0 0 180px;
        margin-right: 20px;
    }

    .popupRow {
        padding: 5px 0 15px;
    }

    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 13px;
        font-weight: 400;
        margin-bottom: 10px;
    }
    .filterItemShort {
        flex: 0 0 140px;
        margin-right: 20px;
    }


</style>
