<template>
    <!-- <PageSimple> -->
        <FormWrapper :is-loading="isLoading">
            <PageTitle :title=title slot="title" :pdf="generatePdf" v-if="showPdf"/>
            <PageTitle :title=title slot="title" v-else/>

            <ValidationObserver ref="validator">
                <div :class="$style.filter">
                    <div :class="$style.filterItem">
                        <FormSelect :width="200" label="Select Report" :items="filtering.reports" item-name="Name" item-value="id" v-model="filtering.reportSelected" :onChange="filterFormats" rules="required"/>
                    </div>
                    <div :class="$style.filterItem">
                        <FormSelect :width="200" label="Group By" :items="[{ value: 'Day', label: 'Daily'}, { value: 'Week', label: 'Week'}, { value: 'Month', label: 'Month'}, { value: 'Qtr', label: 'Quarter'}, { value: 'Year', label: 'Year'}]" rules="required" item-name="label" item-value="value" v-model="filtering.period" />
                    </div>
                    <div :class="$style.filterItem">
                        <InputDate label="Select Dates" type="daterange" v-model="filtering.dates" />
                    </div>
                    <div :class="$style.filterItem">
                        <FormSelect :width="200" label="Report Format" :items="FormatItems" item-name="label" item-value="value" v-model="filtering.reportType"  rules="required"/>
                    </div>
                    <div :class="$style.filterItem" v-if="isRFI">
                        <FormSelect :width="200" label="Local or International" :items="LocalIntl" item-name="label" item-value="value" v-model="filtering.localIntl" />
                    </div>
                    
                    <div :class="$style.filterItem" v-if="filtering.reportSelected == 34">
                        <YearSelect :width="200" label="Select Year" v-model="filtering.year" rules="required" />
                    </div>
                    <div :class="$style.filterIconItem">
                        <FormButton style="margin-top: 5px" type="primary" @click="validateTicket" :rounded="true">
                            <Icon type="ios-search" />
                        </FormButton>
                    </div>
                </div>
            </ValidationObserver>
                <DataTable :actions="true"
                        :data="entities"
                        :columns="config"
                        :is-loading="isLoading"
                        @on-selection-change="selectChange"
                        @on-page-change="pageChange"
                        :pagination="pagination"
                        @on-sort-change="sortChange" v-if="entities.length>0 || isSearched==true">
                    <template slot="actionsRight">
                        <TableButton @click="() => exportExcel()" v-if="showExcel">
                            <img src="../../../../assets/images/Excel_Icon.png" alt="">
                            Export Excel
                        </TableButton>
                    </template>
                </DataTable>

            <ColumnChart :data="chartData" v-if="chartData.length > 0 && filtering.reportType == 'columnChart'" />
            <LineChartApex :data="chartData" v-if="chartData.length > 0 && filtering.reportType == 'lineChart'" />
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
    import InputDate from 'Components/form/InputDate';
    import config from './table';
    import { ValidationObserver } from "vee-validate";
    import loadingMixin from 'Mixins/loadingMixin';
    import { getAllStats, getReportData, exportIBCStat, exportIBCMultiStat} from '../api'
    
    export default {
        name: "Company",
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle,
            DataTable,
            InputDate,
            ValidationObserver,
            // PageSimple,
        },
        data() {
            return {
                filtering: {
                    period: 'Month',
                    reports: [],
                    reportSelected: null,
                    dates: '',
                    reportType: '',
                    localIntl: '',
                    year: (new Date()).getFullYear(),
                },
                FormatItems: [{ value: 'pdf', label: 'PDF'}, { value: 'xls', label: 'Excel'},
                    // {value:'lineChart', label:'Line Chart'},{value:'columnChart', label:'Column Chart'}
                ],
                LocalIntl: [{ value: 'L', label: 'Local'}, { value: 'I', label: 'International'}],
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
                tableData: [],
                config,
                selectedRows: [],
                showExcel: false,
                showPdf: false,
                title: '',
                isGrid: false,
                isRFI: false,
                chartData: []
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        watch: {
            'filtering.reportSelected': function() {
                this.chartData = [];
            }
        },
        created() {
            this.getReportData();
            this.getFilterValues();
        },
        methods: {
            validateTicket() {
                this.$refs.validator.validate().then((result) => {
                    if(result) {
                        this.getDataByFilter();
                    }
                });
            },
            filterFormats(e) {
                this.filtering.reports.filter((item) => {
                    this.filtering.reportType = null;
                    if (item.id==e) {
                        if (item.isGrid==1) {
                            this.FormatItems = [];
                            this.isGrid = true;
                        } else {
                            if (item.isPdf==1 && item.isXls==1) {
                                this.FormatItems = [{ value: 'pdf', label: 'PDF'}, { value: 'xls', label: 'Excel'},
                                // {value:'lineChart', label:'Line Chart'},{value:'columnChart', label:'Column Chart'}
                                ];
                            } else if (item.isPdf==1 && (item.isXls==0 || item.isXls==null)) {
                                this.FormatItems = [{ value: 'pdf', label: 'PDF'},
                                // {value:'lineChart', label:'Line Chart'},{value:'columnChart', label:'Column Chart'}
                                ];
                            } else if (item.isXls==1 && (item.isPdf==0 || item.isPdf==null)) {
                                this.FormatItems = [{ value: 'xls', label: 'Excel'},
                                // {value:'lineChart', label:'Line Chart'},{value:'columnChart', label:'Column Chart'}
                                ];
                            } else {
                                this.FormatItems = [
                                        // {value:'lineChart', label:'Line Chart'},{value:'columnChart', label:'Column Chart'}
                                    ];
                            }
                        }

                    }
                })

                //For showing Local & International selection
                if(e==26) {
                    this.isRFI = true;
                } else {
                    this.isRFI = false;
                }
            },
            getReportData() {
                getReportData({Code:"AllStats"}).then(
                    res => {
                        this.hideLoader();
                        this.title = res.data.Name;
                    }
                )
            },
            getFilterValues() {
                this.showLoader();
                Promise.all([
                    getAllStats(),
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.filtering.reports = response[0].data;
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
            getDataByFilter() {
                // this.showLoader();
                const { key, order } = this.sorting;
                const perPage = this.pagination.perPage;
                const page = this.pagination.page;
                const filters = {};

                filters.period = this.filtering.period;
                filters.report_id = this.filtering.reportSelected;
                filters.DateFrom = this.filtering.dates[0];
                filters.DateTo = this.filtering.dates[1];
                filters.reportType = this.filtering.reportType == 'lineChart' || this.filtering.reportType == 'columnChart' ? 'chart' : this.filtering.reportType;
                filters.localIntl = this.filtering.localIntl;
                if(this.filtering.reportSelected == 34) filters.year = this.filtering.year

                const data = {
                    user_id: this.userData.user_id,
                    // type: "IBCStat001",
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

                var isMultiTable = false;
                this.filtering.reports.filter((item) => {
                    if (item.id==this.filtering.reportSelected) {
                        if(item.Code=="LicenseeStat001") {
                            isMultiTable = true;
                        }
                        if(item.Code=="MultiStat001") {
                            isMultiTable = true;
                        }
                    }
                })
                if (isMultiTable) {
                    exportIBCMultiStat(data)
                        .then(this.handleResponse)
                } else {
                    exportIBCStat(data)
                        .then(this.handleResponse)
                }
                
            },
            handleResponse(response) {
                this.hideLoader();
                if(this.isGrid && (this.filtering.reportType !== 'lineChart' && this.filtering.reportType !== 'columnChart')) {
                    this.entities = response.data;
                    this.chartData = []
                }
                else if(this.filtering.reportType == 'lineChart' || this.filtering.reportType == 'columnChart'){
                    this.chartData = []
                    this.chartData = response.chart_data;
                } 
                else {
                    this.chartData = []
                    window.open(response.data,'_blank');
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
        // max-width: 1000px;
        flex-wrap: wrap;
        align-items: flex-end;
    }
    .filterItem {
        flex: 0 0 200px;
        margin: 0 20px 20px 0;
    }
    .filterIconItem {
        flex: 0 0 50px;
        margin: 0 20px 20px 0;
    }
    .popupRow {
        padding: 5px 0 15px;
    }
</style>
