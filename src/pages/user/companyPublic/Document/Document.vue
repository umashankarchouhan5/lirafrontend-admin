<template>
    <FormWrapper :is-loading="isLoading" >
        <!-- <PageTitle :title="pageTitle" slot="title" :link="`/help/${processId}`"/> -->
        <PageTitle :title="PageTitle" slot="title" />
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
    import { getCompanyDocs } from "../api";
    import DataTable from 'Components/DataTable';
    import DateUtil from 'Utils/dateUtil'
    import ViewCell from './ViewCell'

    export default {
        name: "Single",
        mixins: [loadingMixin],
        data() {
            return {
                id: null,
                mode: null,
                PageTitle: 'Company Log',
                Companies: [],
                tableColumns: [
                    {
                        title: 'Document Brief',
                        key: 'DocumentBrief',
                    },
                    {
                        title: 'Document',
                        key: 'Path',
                        align: 'left',
                        width:300,
                        render:(h, params) =>{
                            return h(ViewCell, {
                                props: {
                                    row: params.row
                                }
                            });
                        }
                    },
                    {
                        title: 'Date',
                        key:'ActivityDate',
                        width:150,
                        render: (h, params) => {
                            return h('span', DateUtil.formatDate(params.row.DcoumentDate));
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
            DataTable,
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
                const data = { id: this.id }
                Promise.all([
                    getCompanyDocs(data),
                ]).then(this.handleDropdownValues)
            },
            handleDropdownValues(response) {
                this.Companies = response[0].data
                this.hideLoader();
            },
            goBack(){
                this.$router.push({ path: '/companyPublic' })
            }
        }
    }
</script>

<style lang="scss" module>
    

</style>
