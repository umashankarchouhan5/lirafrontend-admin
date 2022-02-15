<template>
    <FormWrapper :is-loading="isLoading">
        <!-- <PageTitle title="Document Masters" slot="title" :link="`/help/${processId}`"/> -->
        <PageTitle title="Licensee List" slot="title" :pdf="generatePdf" v-if="showPdf"/>
        <PageTitle title="Licensee List" slot="title" v-else/>
            
        <div :class="$style.filter">
            <div :class="$style.filterItem">
                <FormSelect :width="200" label="Status" :items="filtering.statuses" item-name="name" item-value="id" v-model="filtering.status_id"  />
            </div> 
            <div :class="$style.filterItem">
                <FormSelect :width="200" label="License Type" :items="filtering.entityTypes" item-name="longName" item-value="Name" v-model="filtering.EntityType"  />
            </div>
        </div>
        
        <FormRow>
            <div class="col-sm-2" :class="$style.filterItem">
                <InputText label="Reg #"  :width="200" :readonly="filtering.EntityType === null"  v-model="filtering.CompanyRegNo" @keyup.native="searchByRegNo" @focusout="searchByRegNoTab" />
            </div>
            <div class="col-sm-6" :class="$style.filterItem">
                <FormAutoComplete
                    label="Entity Name"
                    :disabled="filtering.EntityType === null"
                    v-model="filtering.Name"
                    :onChange="onSearchName"
                    :items="companies"
                    item-value="Name"
                    item-name="Name"
                    :onSelect="onSelectCompanyByName" />
            </div>
            
            <div class="col-sm-2" >
                <FormButton style="margin-top: 5px" type="primary" @click="search" :rounded="true">
                    <Icon type="ios-search" />
                </FormButton>
            </div>
         </FormRow>
        <DataTable :actions="true"
            :data="licenseeList"
            :columns="config"
            :is-loading="isLoading"
            @on-selection-change="selectChange"
            @on-page-change="pageChange"
            :pagination="pagination"
            @on-sort-change="sortChange">
            <template slot="actionsRight">
                <TableButton @click="() => exportExcel()" v-if="showExcel">
                    <img src="../../../../assets/images/Excel_Icon.png" alt="">
                    Export Excel
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

    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import config from './table';
    import loadingMixin from 'Mixins/loadingMixin';
    import FormAutoComplete from 'Components/form/FormAutoComplete';
    import { exportLicenseeExcel, getLicenseeListReport, getCompany, getCompanyStatus, fetchEntityTypeByDepartment } from '../api'

    export default {
        name: "LicenseeList",
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle,
            DataTable,
            FormAutoComplete
        },
        data() {
            return {
                filtering: {
                    EntityType: null,
                    status_id: null,
                    entityTypes: [],
                    statuses: [],
                    CompanyRegNo: '',
                    Name: '',
                    company_id: null,
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
                licenseeList: [],
                tableData: [],
                config,
                selectedRows: null,
                document_id: null,
                companies: [],
                isSelected: false,
                showExcel: false,
                showPdf: false,
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        created() {
          this.getFilterValues();
          this.getDataByFilter();
        },
        watch: {
            'filtering.EntityType': function (newValue) {
                if ( newValue == '' || newValue === undefined || newValue === null) {
                    this.resetCompany();
                    this.resetCompanies();
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
            exportExcel() {
                this.showLoader();
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;

                const filters = {};

                filters.licenseType = this.filtering.EntityType;
                filters.Name = this.filtering.Name;
                filters.status_id = this.filtering.status_id;
                filters.RegNo = this.filtering.CompanyRegNo;

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
                };
                exportLicenseeExcel(data).then(
                    res => {
                        this.hideLoader();
                        window.open(res.data,'_blank');
                    }
                )
            },
            generatePdf() {
                this.showLoader();
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;

                const filters = {};

                filters.licenseType = this.filtering.EntityType;
                filters.Name = this.filtering.Name;
                filters.status_id = this.filtering.status_id;
                filters.RegNo = this.filtering.CompanyRegNo;

                const data = {
                    user_id: this.userData.user_id,
                    type: "licensee",
                    isPdf: true,
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
                exportLicenseeExcel(data).then(
                    res => {
                        this.hideLoader();
                        window.open(res.data,'_blank');
                    }
                )
            },
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            getFilterValues() {
                this.showLoader();
                Promise.all([
                    fetchEntityTypeByDepartment({department_id: this.userData.department_id}),
                    getCompanyStatus(),
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.filtering.entityTypes = response[0].data;
                this.filtering.statuses = response[1].data;
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

                filters.licenseType = this.filtering.EntityType;
                filters.Name = this.filtering.Name;
                filters.status_id = this.filtering.status_id;
                filters.RegNo = this.filtering.CompanyRegNo;

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
                };
                getLicenseeListReport(data)
                    .then(this.handleResponse)
                    .catch(this.handleError)
            },
            handleResponse(response) {
                this.hideLoader();
                this.licenseeList = response.data[0];
                this.pagination.total = response.NumberOfRecords;
                if (response.pdf_visibility==1) {
                    this.showPdf = true;    
                }
                if (response.excel_visibility==1) {
                    this.showExcel = true;
                }
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
