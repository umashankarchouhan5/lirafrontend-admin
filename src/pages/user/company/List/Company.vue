<template>
    <!-- <PageSimple> -->
        <FormWrapper :is-loading="isLoading">
            <PageTitle title="Company List" slot="title" :pdf="generatePdf" v-if="showPdf"/>
            <PageTitle title="Company List" slot="title" v-else/>
            <div :class="$style.filter">
                <div :class="$style.filterItem">
                    <InputText v-model="filtering.Name" label="Company Name" />
                </div>
                <div :class="$style.filterItem">
                    <InputText v-model="filtering.RegNo" label="Registration No." />
                </div>
                <div :class="$style.filterItem">
                    <FormSelect :width="200" label="Status" :items="filtering.status" item-name="name" item-value="id" v-model="filtering.statusSelected" />
                </div>
                <div :class="$style.filterItem">
                    <FormSelect :width="200" label="Entity Type" :items="filtering.entityTypes" item-name="Name" item-value="Name" v-model="filtering.entityTypeSelected"  />
                </div>
                <div :class="$style.filterItem">
                    <FormSelect :width="200" label="Licensee" :items="filtering.ICSP" item-name="name" item-value="id" v-model="filtering.icspSelected" />
                </div>
                <!-- <div :class="$style.filterItem">
                    <InputDate label="Select Dates" type="daterange" v-model="filtering.dates" />
                </div> -->
                <div :class="$style.filterItem">
                    <FormButton style="margin-top: 5px" type="primary" @click="search" :rounded="true">
                        <Icon type="ios-search" />
                    </FormButton>
                </div>
            </div>
            <DataTable :actions="true"
                    :data="companies"
                    :columns="config"
                    :is-loading="isLoading"
                    @on-selection-change="selectChange"
                    @on-page-change="pageChange"
                    :pagination="pagination"
                    @on-sort-change="sortChange" v-if="companies.length>0 || isSearched==true">
                <template slot="actionsLeft">
                    <TableButton @click="compliance">
                        <img src="../../../../assets/images/edit.png" />
                        Compliance Notes
                    </TableButton>
                    <TableButton @click="directors">
                        <img src="../../../../assets/images/user-manage.png" />
                        Directors
                    </TableButton>
                    <TableButton @click="log" v-if="viewLog==1">
                        <img src="../../../../assets/images/eye.png" />
                        View Log
                    </TableButton>
                </template>
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
                    <FormButton v-if="warningModal.buttons.cancel" @click="() => showWarningModal(false)">Cancel</FormButton>
                    <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
                </div>
            </Popup>
        </FormWrapper>
    <!-- </PageSimple> -->
</template>

<script>
    // import PageSimple from 'Components/layout/user/PageSimple';
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    // import InputDate from 'Components/form/InputDate';
    import config from './table';
    import loadingMixin from 'Mixins/loadingMixin';
    import { exportEntitiesExcel, getCompanyStatus, getICSP, getEntityType, getCompanies, fetchEntityTypeByDepartment } from '../api'
    
    export default {
        name: "Company",
        mixins: [loadingMixin],
        data() {
            return {
                filtering: {
                    status: [],
                    statusSelected: null,
                    ICSP: [],
                    icspSelected: null,
                    entityTypes: [],
                    entityTypeSelected: null,
                    Name: null,
                    RegNo: null,
                    dates: '',
                },
                viewLog: 0,
                isSearched: false,
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
                companies: [],
                tableData: [],
                config,
                selectedRows: [],
                showExcel: false,
                showPdf: false,
            }
        },
        created() {
          this.getFilterValues();
        //   this.getDataByFilter();
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        components: {
            FormWrapper,
            PageTitle,
            DataTable,
            // InputDate,
            // PageSimple,
        },
        methods: {
            exportExcel() {
                const { key, order } = this.sorting;
                // const { perPage, page } = this.pagination;
                const perPage = this.pagination.perPage;
                const page = this.pagination.page;
                const filters = {};

                // Ignore other filters if we have RegNo
                if (this.filtering.RegNo) {
                    filters.RegNo = this.filtering.RegNo
                } else {
                    filters.Name = this.filtering.Name;
                    filters.status_id = this.filtering.statusSelected;
                    filters.ICSP_id = this.filtering.icspSelected;
                    filters.DateFrom = this.filtering.dates[0];
                    filters.DateTo = this.filtering.dates[1];
                    filters.EntityType = this.filtering.entityTypeSelected;
                }

                const data = {
                    user_id: this.userData.user_id,
                    type: "companies",
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
                exportEntitiesExcel(data).then(
                    res => {
                        window.open(res.data,'_blank');
                    }
                )
            },
            generatePdf() {
                const { key, order } = this.sorting;
                // const { perPage, page } = this.pagination;
                const perPage = this.pagination.perPage;
                const page = this.pagination.page;
                const filters = {};

                // Ignore other filters if we have RegNo
                if (this.filtering.RegNo) {
                    filters.RegNo = this.filtering.RegNo
                } else {
                    filters.Name = this.filtering.Name;
                    filters.status_id = this.filtering.statusSelected;
                    filters.ICSP_id = this.filtering.icspSelected;
                    filters.DateFrom = this.filtering.dates[0];
                    filters.DateTo = this.filtering.dates[1];
                    filters.EntityType = this.filtering.entityTypeSelected;
                }

                const data = {
                    user_id: this.userData.user_id,
                    type: "companies",
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
                exportEntitiesExcel(data).then(
                    res => {
                        window.open(res.data,'_blank');
                    }
                )
            },
            getFilterValues() {
                this.showLoader();
                Promise.all([
                    fetchEntityTypeByDepartment({ department_id: this.userData.department_id, subEntity: 1}),
                    getCompanyStatus(),
                    getICSP({department_id: this.userData.department_id}),
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.filtering.entityTypes = response[0].data;
                this.filtering.status = response[1].data;
                // this.filtering.ICSP = response[2].data;
                this.filtering.ICSP = response[2].data.filter(item => {
                        return item.name !== null;
                    })
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
                // const { perPage, page } = this.pagination;
                const perPage = this.pagination.perPage;
                const page = this.pagination.page;
                const filters = {};

                // Ignore other filters if we have RegNo
                if (this.filtering.RegNo) {
                    filters.RegNo = this.filtering.RegNo
                } else {
                    filters.Name = this.filtering.Name;
                    filters.status_id = this.filtering.statusSelected;
                    filters.ICSP_id = this.filtering.icspSelected;
                    filters.DateFrom = this.filtering.dates[0];
                    filters.DateTo = this.filtering.dates[1];
                    filters.EntityType = this.filtering.entityTypeSelected;
                }

                const data = {
                    user_id: this.userData.user_id,
                    type: "companies",
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
                getCompanies(data)
                    .then(this.handleResponse)
            },
            handleResponse(response) {
                this.hideLoader();
                this.isSearched = true;
                if(typeof response.viewLog !=="undefined" && response.viewLog==1) {
                    this.viewLog = 1;
                }
                this.companies = response.data[0];
                this.pagination.total = response.NumberOfRecords;
                if (response.pdf_visibility==1) {
                    this.showPdf = true;    
                }
                if (response.excel_visibility==1) {
                    this.showExcel = true;
                }
            },
            showWarningModal(value) {
                this.warningModal.visible = value;
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
            render(mode){
                if (this.validateSelectedLength(1)) {
                    let id = this.selectedRows[0].id; // allow only the first row
                    this.$router.push({ path: `/company/${mode}/${id}` })
                }
            },
            log(){
                if (this.validateSelectedLength(1)) {
                    const row = this.selectedRows[0];
                    this.$router.push(`/company/companyLog/${row.id}`);
                }
            },
            directors(){
                if (this.validateSelectedLength(1)) {
                    const row = this.selectedRows[0];
                    if(row.Entitytype!=="IBC")
                    {
                        this.warningModal.message = 'Select IBC type only.';
                        this.showWarningModal(true);
                        return false;
                    }else {
                        this.$router.push(`/company/companyDirectors/${row.id}`);
                    }
                }
            },
            compliance(){
                if (this.validateSelectedLength(1)) {
                    const row = this.selectedRows[0];
                    this.$router.push(`/company/compliance/${row.id}`);
                }
            },
        }
    }
</script>

<style lang="scss" module>

    .progress {
        margin: 0 20px;
        progress {
            width: 100%;
        }
    }
    .filter {
        margin: -10px 0 25px;
        display: flex;
        max-width: 1000px;
        flex-wrap: wrap;
        align-items: flex-end;
    }
    .filterItem {
         flex: 0 0 200px;
        margin: 0 20px 20px 0;
    }
    .popupRow {
        padding: 5px 0 15px;
    }
</style>
