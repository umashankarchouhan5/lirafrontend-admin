<template>
    <FormWrapper :is-loading="isLoading" >
        <!-- <PageTitle :title="pageTitle" slot="title" :link="`/help/${processId}`"/> -->
        <PageTitle :title="CompanyName" slot="title" />
        <DataTable :actions="true"
            :data="Companies"
            :columns="tableColumns"
            :is-loading="isLoading" 
            @on-selection-change="selectChange"
            @on-page-change="pageChange"
            :pagination="pagination"
            @on-sort-change="sortChange">
        </DataTable>
        <ButtonGroup>
            <FormButton type="primary" @click="goBack()" left-icon="ios-arrow-back">Back to List</FormButton>
        </ButtonGroup>
    </FormWrapper>
</template>

<script>
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import loadingMixin from 'Mixins/loadingMixin';
    import { getCompanyLogs, getCompanyById } from "../api";
    import DataTable from 'Components/DataTable';
    import DateUtil from 'Utils/dateUtil'

    export default {
        name: "Single",
        mixins: [loadingMixin],
        data() {
            return {
                id: null,
                mode: null,
                CompanyName:'',
                PageTitle: 'Company Log',
                Companies: [],
                tableColumns: [
                    {
                        title: 'Activity',
                        key: 'Activity',
                    },
                    {
                        title: 'Date',
                        key:'ActivityDate',
                        render: (h, params) => {
                            console.log(params);
                            if( params.row.ActivityDate == '' || params.row.ActivityDate == null || params.row.ActivityDate == '1900-01-01'){
                                return '';
                            }else{
                                return h('span', DateUtil.formatDate(params.row.ActivityDate));
                            }
                        },
                    }
                ],
                sorting: {
                    key: 'id',
                    order: 'desc'
                },
                pagination: {
                    perPage: 10,
                    page: 1,
                    total: 0
                },
            }
        },
        created() {
            this.id = this.$route.params.id;
            this.getDataByFilter();
        },
        components: {
            FormWrapper,
            PageTitle,
            DataTable
        },
        methods: {
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
                this.showLoader();
                const { key, order } = this.sorting;
                const perPage = this.pagination.perPage;
                const page = this.pagination.page;
                const filters = {};
                filters.id = this.id;
                const data = {
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
                // getCompanyLogs(data)
                //     .then(this.handleResponse)
                Promise.all([
                    getCompanyLogs(data),
                    getCompanyById({id:this.id}),
                ]).then(this.handleResponse)
            },
            handleResponse(response) {
                // console.log(response);
                // return;
                this.Companies = response[0].data
                this.pagination.total = response[0].total_records;
                if(typeof response[1].data.Name !== 'undefined'){
                    this.CompanyName = this.PageTitle+' ('+response[1].data.Name+', '+response[1].data.CompanyRegNo+')';    
                }else {
                    this.CompanyName = this.PageTitle;
                }
                this.hideLoader();
            },
            goBack(){
                this.$router.push({ path: '/company' })
            }
        }
    }
</script>

<style lang="scss" module>
    

</style>
