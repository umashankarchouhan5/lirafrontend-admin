<template>
    <FormWrapper>
        <PageTitle title="Risk Matrix" slot="title" link="/help/117" :pdf="generatePdf" v-if="checkPdfVisibility" />
        <PageTitle title="Risk Matrix" slot="title" link="/help/117" v-else/>
        
        <div>
            <FormRow>
                <div class="col-sm-3">
                    <YearSelect label="Year"  v-model="filtering.yearSelected" :clearable="false" />
                </div>
                <div class="col-sm-3" v-if="!nextPage">
                    <FormAutoComplete v-model="filtering.icspName"
                        label="Service Provider"
                        item-name="name"
                        item-value="name"
                        :clearable="true"
                        :onSearch="searchICSP"
                        :onSelect="selectICSP"
                        :onClear="clearICSP"
                        :items="filtering.ICSPResultsFiltered" />
                </div>
                <div class="col-sm-2">
                    <FormButton type="primary" @click="fetchGridData()" :rounded="true">
                        <Icon type="ios-search" />
                    </FormButton>
                </div>
            </FormRow>
            <br />
        </div>
        <div  v-if="!nextPage">

            <DataTable :actions="true"
                :data="complianceList"
                :columns="tableConfig"
                :is-loading="isLoading"
                @on-selection-change="selectChange"
                @on-page-change="pageChange"
                :pagination="pagination"
                @on-sort-change="sortChange"
            >
                <template slot="actionsLeft">
                    <TableButton @click="getDataById">
                        <img src="../../../assets/images/edit.png" alt="">
                        Risk Matrix
                    </TableButton>
                </template>
                <template slot="actionsRight">
                    <TableButton @click="() => exportExcel()" v-if="checkExcelVisibility">
                        <img src="../../../assets/images/Excel_Icon.png" alt="">
                        Export Excel
                    </TableButton>
                </template>
            </DataTable>
        </div>


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
    import {  exportRiskMatrixExcel, fetchRiskMatrixForYear, searchICSPTypes } from './api';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable'
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import loadingMixin from 'Mixins/loadingMixin'
    import moment from 'moment';
    import tableConfig from './tableConfig/table'
    import FormAutoComplete from 'Components/form/FormAutoComplete';

    const DEFAULT_STATUS = 43;

    export default {
        name:'RiskMatrixGrid',
        mixins: [loadingMixin,validateSelectedRows],
        components:{
            PageTitle,
            FormWrapper,
            DataTable,
            FormAutoComplete
        },
        data(){
            return{
                instructionData:[],
                popupSuccess: {
                    isVisible: false,
                },
                nextPage: true,
                cspType:[],
                selectedStatus: null,
                yearSelected: null,
                statuses: [],
                tableConfig,
                complianceList: [],
                filtering:{
                    yearSelected: moment().year()-1,
                    icsp_id: null,
                    statuses: [],
                    selectedStatus: null,
                    ICSPResultsFiltered: [],
                    icspName: null
                },
                icspList: [],
                sorting: {
                    key: 'year',
                    order: 'asc'
                },
                pagination: {
                    perPage: 10,
                    page: 1,
                    total: 0
                },
                showExcel: false,
                showPdf: false,
            }
        },
        computed:{
            checkPdfVisibility() {
                if(this.showPdf) {
                    return true;
                } else {
                    return false;
                }
            },
            checkExcelVisibility() {
                if(this.showExcel) {
                    return true;
                } else {
                    return false;
                }
            },
            userData() {
                return this.$store.state.user.user
            },
            currentProcessId() {
                return this.$store.state.common.currentProcessId
            },
        },
        created(){
            this.getData();
        },
        methods:{
            generatePdf() {
                this.showLoader();
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;
                const filters = {
                    icsp_id: this.filtering.icsp_id
                }
                const data = {
                    year: this.filtering.yearSelected,
                    type: "riskmatrix",
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
                }
                exportRiskMatrixExcel(data).then(
                    res=> {
                        this.hideLoader();
                        window.open(res.data,'_blank');
                    }
                )
            },
            exportExcel() {
                this.showLoader();
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;
                const filters = {
                    icsp_id: this.filtering.icsp_id
                }
                const data = {
                    year: this.filtering.yearSelected,
                    type: "riskmatrix",
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
                }
                exportRiskMatrixExcel(data).then(
                    res=> {
                        this.hideLoader();
                        window.open(res.data,'_blank');
                    }
                )
            },
            clearICSP(){
                this.filtering.icsp_id = null;
                this.filtering.ICSPResultsFiltered = null;
            },
            selectICSP(name) {
                this.filtering.icsp_id = this.filtering.ICSPResultsFiltered.find(item => item.name === name).id;
            },
            searchICSP(value) {
                if (value.length > 2) {
                    this.filtering.ICSPResultsFiltered = this.icspList.filter(item => {
                        return item.name !== null ? item.name.toLowerCase().includes(value.toLowerCase()) : false;
                    })
                } else {
                    this.filtering.ICSPResultsFiltered = []
                }
            },
            getData(){
                Promise.all([
                    searchICSPTypes({department_id: this.userData.department_id})
                ]).then(this.handleDataResponse);
            },
            handleDataResponse(res){
                this.icspList = res[0].data;
            },
            getDataById(){
                if (this.validateSelectedLength(1)) {
                    var row = this.selectedRows[0];
                    this.$router.push(`riskMatrixByID/${row.Compliance_id}`)
                }
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            handleFilterValues(response){
                this.statuses = response[0].data[0];
                this.selectedStatus = 43;
            },
            
            backToInstruction(){
                this.$router.push('/tasks');
            },
            fetchGridData(){
                
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;
                const filters = {
                    icsp_id: this.filtering.icsp_id
                }
                const data = {
                    year: this.filtering.yearSelected,
                    type: "riskmatrix",
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
                }
                fetchRiskMatrixForYear(data).then(
                    res=> {
                        this.complianceList = res.data[0];
                        this.nextPage = false;
                        if (res.pdf_visibility==1) {
                            this.showPdf = true;    
                        }
                        if (res.excel_visibility==1) {
                            this.showExcel = true;
                        }
                    }
                )
            },
            
            pageChange(page) {
                this.pagination.page = page;
                this.fetchGridData()
            },
            sortChange(data) {
                this.sorting.key = data.key;
                this.sorting.order = data.order;
                this.fetchGridData()
            },
            
        }
    }
</script>


<style lang="scss" module>


    .filter {
        margin: -10px 0 10px;
    }

    .filterItem {
        display: inline-block;
        margin: 0 15px 15px 0;
    }

    .filterItemCheckbox {
        flex-basis: auto;
        align-self: flex-start;
        margin-top: 13px;
    }

</style>