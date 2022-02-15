<template>
    <FormWrapper :is-loading="isLoading">
        <!-- <PageTitle title="Document Masters" slot="title" :link="`/help/${processId}`"/> -->
        <PageTitle title="Documents" slot="title" />
            
        <div :class="$style.filter">
            <div :class="$style.filterItem">
                <InputText rules="required" label="Reg #"  v-model="filtering.CompanyRegNo" @keyup.native="searchByRegNo" @focusout="searchByRegNoTab" />
            </div>
            <div :class="$style.filterItem">
                <FormAutoComplete
                    label="Entity Name"
                    rules="required"
                    v-model="filtering.Name"
                    :onChange="onSearchName"
                    :items="companies"
                    item-value="Name"
                    item-name="Name"
                    :onSelect="onSelectCompanyByName" />
            </div>
            <div :class="$style.filterItem">
                <FormSelect :width="200" label="Document Category" :items="filtering.documentCategories" item-name="DisplayName" item-value="id" v-model="filtering.selectedCategory"  />
            </div>
            <div :class="$style.filterItem">
                <InputDate style="width: 200px" label="Select Date Range" type="daterange" v-model="filtering.dates" />
            </div>
            
        </div>

            <FormRow >
                <div class="col-sm-2">
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
                <div class="col-sm-4">
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
                <div class="col-sm-3">
                    <FormButton style="margin-top: 5px" type="primary" @click="search" :rounded="true">
                        <Icon type="ios-search" />
                    </FormButton>
                </div>
            </FormRow>
        <DataTable :actions="true"
            :data="Documents"
            :columns="config"
            :is-loading="isLoading"
            @on-selection-change="selectChange"
            @on-page-change="pageChange"
            :pagination="pagination"
            @on-sort-change="sortChange">
            
            <template slot="actionsLeft">
                <TableButton @click="() => view()" >
                    <img src="../../../../assets/images/eye.png" />
                    View Document
                </TableButton>
                <TableButton @click="() => openDoc('license')" >
                    <img src="../../../../assets/images/plus.png" />
                    Add License Document
                </TableButton>
                <TableButton @click="() => openDoc('entity')" >
                    <img src="../../../../assets/images/plus.png" />
                    Add Entity Document
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
        
        <Popup title="Upload Document" width="700" type="info" :value="uploadDocument.visible" @close="() => uploadDocument.visible = false" :mask-closable="true" :closable="true">
            
            <AdminDocument v-if="uploadDocument.visible" />
            <FormButton slot="footer" @click="() => uploadDocument.visible = false">Close</FormButton>
        </Popup>
    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import InputDate from 'Components/form/InputDate';
    import FormAutoComplete from 'Components/form/FormAutoComplete';
    import config from './table';
    import loadingMixin from 'Mixins/loadingMixin';
    import AdminDocument from 'Components/adminDocument';
    import {  getCompanyDocArchive, getProcesses, getDocuments, getDocumentCategories, getCompany, fetchPQSearchbyAdmin } from '../api'

    export default {
        name: "Documents",
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle,
            DataTable,
            InputDate,
            FormAutoComplete,
            AdminDocument,
        },
        props: {
            entity: String,
            entityReg: [String,Number],
            entityName: String,
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
                filtering: {
                    dates: '',
                    entityTypes: [],
                    entityTypeSelected: null,
                    documentCategories: [],
                    selectedCategory: null,
                    EntityType: null,
                    CompanyRegNo: '',
                    Name: '',
                    company_id: null,
                    pqName: '',
                    uniqueRef: '',
                },
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
                Documents: [],
                tableData: [],
                config,
                selectedRows: null,
                document_id: null,
                companies: [],
                isSelected: false,
                uploadDocument: {
                    visible: false,
                },
                isSearched: false,
                entityDocModal: {
                    visible: false,
                },
                licenseDocModal: {
                    visible: false
                }
            }
        },
        created() {
            if(this.$route.params.entity && this.$route.params.company_id && this.$route.params.entityReg){
                this.filtering.EntityType = this.$route.params.entity;
                this.filtering.company_id = this.$route.params.company_id;
                this.filtering.CompanyRegNo = this.$route.params.entityReg;
                this.searchByRegNoTab();
                this.getFilterValues();
                
            }
            else{
                this.getFilterValues();
            }
        },
        watch: {
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
            },
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
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        methods: {
            openDoc(type){
                this.$router.push(`/documents/add/${type}`)
            },
            goToUpload(){
                this.$store.commit('setDocumentFilter',this.filtering);
                this.$router.push('/documentUpload');
            },
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            view() {
                if (this.validateSelectedLength(1)) {
                    let data = this.selectedRows[0];
                    getCompanyDocArchive({id: data.id}).then(
                        res=>{
                            window.open(res.data,"_blank");
                        }
                    )
                }
            },
            getFilterValues() {
                this.showLoader();
                Promise.all([
                    getDocumentCategories(),
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.filtering.documentCategories = response[0].data;
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
            getDataByFilter() {
                this.showLoader();
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;

                const filters = {};

                filters.company_id = this.filtering.company_id;
                // filters.EntityType = this.filtering.EntityType;
                filters.documentCategory_id = this.filtering.selectedCategory;
                filters.DateFrom = this.filtering.dates[0];
                filters.DateTo = this.filtering.dates[1];
                // filters.name = this.filtering.pqName;
                filters.pq_id = this.pq.pq_id;

                const data = {
                    user_id: this.userData.user_id,
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
                getDocuments(data)
                    .then(this.handleResponse)
                    .catch(this.handleError)
            },
            handleResponse(response) {
                this.hideLoader();
                this.Documents = response.data[0];
                this.pagination.total = response.NumberOfRecords;
                this.isSearched = true;
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
            pushTo(mode) {
                if (this.validateSelectedLength(1)) {
                    let Documentcode = this.selectedRows[0].id; // allow only the first row
                    if( mode== 'edit' ){ // edit is clicked
                        this.$router.push({ path: `/DocumentMasters/edit/${Documentcode}` })
                    }else if( mode== 'del' ){
                        this.$router.push({ path: `/DocumentMasters/del/${Documentcode}` })
                    }else if( mode== 'view' ){
                        this.$router.push({ path: `/DocumentMasters/view/${Documentcode}` })
                    }
                }
            },
            addNew() {
                this.$router.push({ path: `/DocumentMasters/add` })
            },

            //company search methods
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
                                this.resetCompanies();
                                if(this.$route.params.entity && this.$route.params.company_id && this.$route.params.entityReg){
                                    this.getDataByFilter()
                                }
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
                                    this.resetCompanies();
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
                    this.filtering.EntityType = null;
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

            //pq search start 

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
    }

    .popupRow {
        padding: 5px 0 15px;
    }



</style>
