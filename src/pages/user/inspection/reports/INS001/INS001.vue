<template>
    <!-- <PageSimple> -->
        <FormWrapper :is-loading="isLoading">
            <!-- <PageTitle title="Non Compliant Entities" slot="title" :pdf="generatePdf" v-if="showPdf"/>
            <PageTitle title="Non Compliant Entities" slot="title" v-else/> -->
            <PageTitle title="Non Compliant Entities" slot="title" />
            <div :class="$style.filter">
                <div :class="$style.filterItem">
                    <FormSelect :width="200" label="Entity Type" :items="filtering.entityTypes" item-name="Name" item-value="Name" v-model="filtering.entityTypeSelected"  />
                </div>
                <div :class="$style.filterItem">
                    <FormSelect :width="200" label="Licensee" :items="filtering.ICSP" item-name="name" item-value="id" v-model="filtering.icspSelected" />
                </div>
                <div :class="$style.filterItem">
                    <InputDate label="Select Dates" type="daterange" v-model="filtering.dates" />
                </div>
                <div :class="$style.filterItem">
                    <FormButton style="margin-top: 5px" type="primary" @click="search" :rounded="true">
                        <Icon type="ios-search" />
                    </FormButton>
                </div>
            </div>
            <div v-if="entities.length == 0 && isSearched">
                No data found
            </div>
            <ButtonGroup v-if="entities.length > 0">
                <FormButton type="success" @click="generatePdf()">Download PDF</FormButton>
                <FormButton type="success" @click="exportExcel()">Download Excel</FormButton>
            </ButtonGroup>
            <!-- <DataTable :actions="true"
                    :data="entities"
                    :columns="config"
                    :is-loading="isLoading"
                    @on-selection-change="selectChange"
                    @on-page-change="pageChange"
                    :pagination="pagination"
                    @on-sort-change="sortChange" v-if="entities.length>0 || isSearched==true">
                <template slot="actionsRight">
                    <TableButton @click="() => exportExcel()" v-if="showExcel">
                        <img src="../../../../../assets/images/Excel_Icon.png" alt="">
                        Export Excel
                    </TableButton>
                </template>
            </DataTable> -->
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
    // import DataTable from 'Components/DataTable';
    import InputDate from 'Components/form/InputDate';
    import config from './table';
    import loadingMixin from 'Mixins/loadingMixin';
    import { exportINS001Excel, getICSP, getEntityType, getNonCompliants } from '../../api'
    
    export default {
        name: "Company",
        mixins: [loadingMixin],
        data() {
            return {
                filtering: {
                    ICSP: [],
                    icspSelected: null,
                    entityTypes: [],
                    entityTypeSelected: null,
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
                entities: [],
                // tableData: [],
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
            // DataTable,
            InputDate,
            // PageSimple,
        },
        methods: {
            exportExcel() {
                this.showLoader();
                const { key, order } = this.sorting;
                const perPage = this.pagination.perPage;
                const page = this.pagination.page;
                const filters = {};

                filters.ICSP_id = this.filtering.icspSelected;
                filters.EntityType = this.filtering.entityTypeSelected;
                filters.DateFrom = this.filtering.dates[0];
                filters.DateTo = this.filtering.dates[1];

                const data = {
                    user_id: this.userData.user_id,
                    type: "INS001",
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
                exportINS001Excel(data).then(
                    res => {
                        this.hideLoader();
                        window.open(res.data,'_blank');
                    },
                    err => {
                        this.hideLoader();
                    }
                )
            },
            generatePdf() {
                this.showLoader();
                const { key, order } = this.sorting;
                const perPage = this.pagination.perPage;
                const page = this.pagination.page;
                const filters = {};

                filters.ICSP_id = this.filtering.icspSelected;
                filters.EntityType = this.filtering.entityTypeSelected;
                filters.DateFrom = this.filtering.dates[0];
                filters.DateTo = this.filtering.dates[1];

                const data = {
                    user_id: this.userData.user_id,
                    type: "INS001",
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
                exportINS001Excel(data).then(
                    res => {
                        this.hideLoader();
                        window.open(res.data,'_blank');
                    },
                    err => {
                        this.hideLoader();
                    }
                )
            },
            getFilterValues() {
                this.showLoader();
                Promise.all([
                    getEntityType(),
                    getICSP({department_id: this.userData.department_id}),
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.filtering.entityTypes = response[0].data;
                this.filtering.ICSP = response[1].data.filter(item => {
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
                const perPage = this.pagination.perPage;
                const page = this.pagination.page;
                const filters = {};

                filters.ICSP_id = this.filtering.icspSelected;
                filters.EntityType = this.filtering.entityTypeSelected;
                filters.DateFrom = this.filtering.dates[0];
                filters.DateTo = this.filtering.dates[1];

                const data = {
                    user_id: this.userData.user_id,
                    type: "INS001",
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
                getNonCompliants(data)
                    .then(this.handleResponse, this.hideLoader())
            },
            handleResponse(response) {
                this.hideLoader();
                this.isSearched = true;
                if(typeof response.viewLog !=="undefined" && response.viewLog==1) {
                    this.viewLog = 1;
                }
                this.entities = response.data[0];
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
