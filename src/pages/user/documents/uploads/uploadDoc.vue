<template>
    <FormWrapper :is-loading="isLoading">
        <!-- <PageTitle title="Document Masters" slot="title" :link="`/help/${processId}`"/> -->
        <PageTitle title="Documents" slot="title" />
        
        <div :class="$style.filter">
            <div :class="$style.filterItem">
                <FormSelect :width="200" label="Entity Type" :items="filtering.entityTypes" item-name="Name" item-value="Name" v-model="filtering.EntityType"  />
            </div> 
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

        </div>

        <br />

        <div :class="$style.filter">
            <div :class="$style.filterItem">
                <FormSelect :width="200" label="Process Type" :items="filtering.processTypes" item-name="Name" item-value="id" v-model="filtering.processTypeSelected" />
            </div>
            <div :class="$style.filterItem" v-if="filtering.processTypeSelected">
                <FormSelect :width="200" label="Process Name" :items="filtering.processNames" item-name="Name" item-value="id" v-model="filtering.processNameSelected" />
            </div>
            <div :class="$style.filterItem">
                <InputDate style="width: 200px" label="Select Date Range" type="daterange" v-model="filtering.dates" />
            </div>
            <!-- <div :class="$style.filterItem">
                <InputText v-model="filtering.DocumentBrief" label="Document Brief" />
            </div>
            <br /> -->
            <div :class="$style.filterItem">
                <FormSelect :width="200" label="Document Category" :items="filtering.documentCategories" item-name="DisplayName" item-value="id" v-model="filtering.selectedCategory"  />
            </div>
            
            <FormButton style="margin-top: 5px" type="primary" @click="search" :rounded="true">
                <Icon type="ios-search" />
            </FormButton>

         </div>
            
        <DataTable :actions="true"
                   :data="Documents"
                   :highlightRow="true"
                   :columns="config"
                   :is-loading="isLoading"
                   @on-single-selection="selectChange"
                   @on-page-change="pageChange"
                   :pagination="pagination"
                   @on-sort-change="sortChange">
        </DataTable>
        <FormRow>
            <div class="col-sm-8">
                <InputText label="Document Brief" v-model="uploadData.documentBrief" />
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-2">
                <InputDate style="width: 200px" label="Document Date" type="date" v-model="uploadData.documentDate" />
            </div>
            <div class="col-sm-6">
                <InputFile 
                    label="Select File" 
                    v-model="uploadData.fileUpload"
                    :rules="{ checkFileRegex: true }"
                />
            </div>
        </FormRow>
        
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
    import { getProcessTypes, getProcesses, getEntityType, getDocuments, getDocumentCategories, getCompany, } from '../api'

    export default {
        name: "UploadDocuments",
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle,
            DataTable,
            InputDate,
            FormAutoComplete
        },
        data() {
            return {
                filtering: {
                    processTypes: [],
                    processTypeSelected: null,
                    processNames: [],
                    dates: '',
                    processNameSelected: null,
                    entityTypes: [],
                    entityTypeSelected: null,
                    documentCategories: [],
                    selectedCategory: null,
                    EntityType: null,
                    CompanyRegNo: '',
                    Name: '',
                    company_id: null,
                },
                sorting: {
                    key: 'id',
                    order: 'asc'
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
                uploadData:{
                    documentBrief: '',
                    documentDate: '',
                    fileUpload: null
                }
            }
        },
        created() {
          this.getFilterValues();
        //   this.getDataByFilter();
        },
        watch: {
            'filtering.processTypeSelected': function (newValue) {
                if (newValue) {
                    this.showLoader();
                    getProcesses(newValue).then(res => {
                        this.hideLoader();
                        this.filtering.processNames = res.data
                    }).catch(this.hideLoader)
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
        computed: {
            userData() {
                return this.$store.state.user.user
            },
            filterData() {
                return this.$store.state.common.documentFilters;
            }
        },
        methods: {
            backToList(){
                this.$router.push('/documents')
            },
            submitAction(){

            },
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            getFilterValues() {
                this.showLoader();
                Promise.all([
                    getProcessTypes(),
                    getEntityType(),
                    getDocumentCategories(),
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.filtering.processTypes = response[0].data;
                this.filtering.entityTypes = response[1].data;
                this.filtering.documentCategories = response[2].data;
                if(this.filterData !== null){
                    this.filtering = this.filterData
                    this.getDataByFilter();
                }else{
                    this.getDataByFilter();
                }
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
                this.uploadData.documentBrief = this.selectedRows.DocumentBrief;
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
                filters.process_id = this.filtering.processNameSelected;
                filters.process_type = this.filtering.processTypeSelected;
                filters.EntityType = this.filtering.EntityType;
                filters.documentCategory_id = this.filtering.selectedCategory;
                filters.DateFrom = this.filtering.dates[0];
                filters.DateTo = this.filtering.dates[1];

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
            addNew() {
                this.$router.push({ path: `/DocumentMasters/add` })
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



</style>
