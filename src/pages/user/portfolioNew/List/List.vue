<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Portfolio" slot="title" />
        <div>
            <DataTable :actions="true"
                :data="rules"
                :columns="tableColumn"
                :is-loading="isLoading"
                @on-page-change="pageChange"
                :pagination="pagination"
                @on-selection-change="selectChange"
            >
                <template slot="actionsLeft">
                    <TableButton @click="() => addRule()">
                        <img src="../../../../assets/images/plus.png" />
                        Add
                    </TableButton>
                    <TableButton @click="() => editRule()">
                        <img src="../../../../assets/images/edit.png" />
                        Edit
                    </TableButton>
                    <TableButton @click="() => showDeleteModal(true)">
                        <img src="../../../../assets/images/del.png" />
                        Delete
                    </TableButton>
                </template>
            </DataTable>
        </div>

<!-- Delete Modal Popup -->
        <Popup title="Delete Rule" :value="deleteModal.visible" :mask-closable="false" :closable="true" @close="() => showDeleteModal(false)">
            {{deleteModal.message}}
            <div slot="footer">
                <FormButton left-icon="ios-send" type="success" @click="() => deleteRule()">Delete</FormButton>
                <FormButton left-icon="ios-close" @click="() => showDeleteModal(false)">Close</FormButton>
            </div>
        </Popup>

<!-- Message popup -->
        <Popup title="Information" :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.cancel" @click="() => showWarningModal(false)">Cancel</FormButton>
                <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
            </div>
        </Popup>

        <Popup title="Success" type="success" :value="successModal.visible" @close="() => successModal.visible = false" >
            {{ successModal.message }}
            <FormButton left-icon="ios-close" slot="footer" @click="() => successModal.visible = false">Close</FormButton>
        </Popup>

    </FormWrapper>
</template>

<script>
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import tableColumn from './table';
    import loadingMixin from 'Mixins/loadingMixin';
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import { listPortfolioRule, deletePortfolioRuleById  } from '../api';
    
    export default {
        name: "PortfolioList",
        mixins: [ loadingMixin, validateSelectedRows],
        components: {
            FormWrapper,
            PageTitle,
            DataTable,
        },
        data() {
            return {
                warningModal: {
                    visible: false,
                    buttons: {
                        ok: true,
                        confirm: false,
                        cancel: false
                    }
                },
                deleteModal: {
                    visible: false,
                    message: 'Are you sure you want to delete this rule ?'
                },
                successModal: {
                    visible: false,
                    message: ''
                },
                rules: [],
                tableData: [],
                tableColumn,
                selectedRows: [],
                pagination: {
                    perPage: 10,
                    page: 1,
                    total: 0
                },
                sorting: {
                    key: 'id',
                    order: 'asc'
                },
            }
        },
        created() {
            this.getData();
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        methods: {
            addRule() {
                this.$router.push('/portfolioCreate');
            },
            editRule() {
                if(this.validateSelectedLength(1)){
                    this.$router.push(`/portfolioEdit/${this.selectedRows[0].id}`);
                }
            },
            deleteRule() {
                if(this.validateSelectedLength(1)){
                    var row = this.selectedRows[0];
                    deletePortfolioRuleById({id: row.id}).then(
                        res => {
                            this.getData();
                            this.showDeleteModal(false);
                            this.successModal.message = res.message;
                            this.successModal.visible = true;
                        }
                    )
                }
            },
            showDeleteModal(val) {
                if(this.validateSelectedLength(1)){
                    this.deleteModal.visible = val;
                }
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            pageChange(page) {
                this.pagination.page = page;
                this.getData()
            },
            search(){
                this.pagination.page = 1;
                this.getData()
            },
            getData() {
                this.showLoader();
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;

                const filters = {};
                filters.department_id = this.userData.department_id;
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
                listPortfolioRule(data)
                    .then(this.handleResponse)
            },
            handleResponse(response) {
                this.hideLoader();
                this.rules = response.data; 
                this.pagination.total = response.NumberOfRecords;
            },
        }
    }
</script>

<style lang="scss" module>
</style>
