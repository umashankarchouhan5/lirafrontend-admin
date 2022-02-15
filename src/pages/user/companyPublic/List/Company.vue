<template>
    <PageSimple>
        <FormWrapper :is-loading="isLoading">
            <PageTitle title="Company List" slot="title" />
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
                    <FormSelect :width="200" label="ICSP" :items="filtering.ICSP" item-name="name" item-value="id" v-model="filtering.icspSelected" />
                </div>
                <div :class="$style.filterItem">
                    <InputDate label="Select Dates" type="daterange" v-model="filtering.dates" />
                </div>
                <FormButton style="margin-top: 5px" type="primary" @click="search" :rounded="true">
                    <Icon type="ios-search" />
                </FormButton>
            </div>
            <DataTable :actions="true"
                    :data="companies"
                    :columns="config"
                    :is-loading="isLoading"
                    @on-selection-change="selectChange"
                    @on-page-change="pageChange"
                    :pagination="pagination"
                    @on-sort-change="sortChange">
                <!-- <template slot="actionsLeft">
                    <TableButton @click="() => render('log')">
                        <img src="../../../../assets/images/eye.png" />
                        View Log
                    </TableButton>
                    <TableButton @click="() => render('doc')" >
                        <img src="../../../../assets/images/eye.png" />
                        View Documents
                    </TableButton>
                </template> -->
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
    </PageSimple>
</template>

<script>
    import PageSimple from 'Components/layout/user/PageSimple';
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import InputDate from 'Components/form/InputDate';
    import config from './table';
    import loadingMixin from 'Mixins/loadingMixin';
    import { getCompanyStatus, getICSP, getEntityType, getCompanies } from '../api'
    
    export default {
        name: "DocumentMasters",
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
            }
        },
        created() {
          this.getFilterValues();
          this.getDataByFilter();
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
            InputDate,
            PageSimple,
        },
        methods: {
            getFilterValues() {
                this.showLoader();
                Promise.all([
                    getEntityType(),
                    getCompanyStatus(),
                    getICSP({department_id: this.userData.department_id}),
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.filtering.entityTypes = response[0].data;
                this.filtering.status = response[1].data;
                this.filtering.ICSP = response[2].data;
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
                this.companies = response.data[0];
                this.pagination.total = response.NumberOfRecords;
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
                    let id = this.selectedRows[0].company_id; // allow only the first row
                    this.$router.push({ path: `/companyPublic/${mode}/${id}` })
                }
            }
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
