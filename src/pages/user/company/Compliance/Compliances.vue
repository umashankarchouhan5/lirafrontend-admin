<template>
    <!-- <PageSimple> -->
        <FormWrapper :is-loading="isLoading">
            <PageTitle :title="PageTitle" slot="title" />
            
            <TicketHeader  :ticketValue="ticketValue" />
            <DataTable :actions="true"
                    :data="compliances"
                    :columns="config"
                    :is-loading="isLoading"
                    @on-selection-change="selectChange"
                    @on-page-change="pageChange"
                    :pagination="pagination"
                    @on-sort-change="sortChange">
                <template slot="actionsLeft" v-if="showOptions">
                    <TableButton @click="add">
                        <img src="../../../../assets/images/plus.png" />
                        Add
                    </TableButton>
                    <TableButton @click="edit">
                        <img src="../../../../assets/images/edit.png" />
                        Edit
                    </TableButton>
                    <TableButton @click="deleteCompliance">
                        <img src="../../../../assets/images/del.png" />
                        Delete
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
            <Popup title="Information" :value="deleteModal.visible" @close="() => showDeleteModal(false)">
                {{ deleteModal.message }}
                <div slot="footer">
                    <FormButton v-if="deleteModal.buttons.delete" @click="deletion">Delete</FormButton>
                    <FormButton v-if="deleteModal.buttons.cancel" @click="() => showDeleteModal(false)">Cancel</FormButton>
                </div>
            </Popup>
            <Popup :value="successModal.visible" :title="successModal.title" type="success" :closable="false" :maskable="false" @close="() => successModal.visible = false">
                <div>
                    {{ successModal.message }}
                </div>
                <div slot="footer">
                    <FormButton @click="() => backToList()">Ok</FormButton>
                </div>
            </Popup>
            <ButtonGroup>
                <FormButton type="primary" @click="goBack()" left-icon="ios-arrow-back">Back to List</FormButton>
            </ButtonGroup>
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
    import { getCompanyById, deleteCompanyCompliance, getCompanyCompliances } from '../api'
    
    export default {
        name: "Company",
        mixins: [loadingMixin],
        data() {
            return {
                filtering: {
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
                successModal: {
                    visible: false,
                    title: 'Success',
                    message: ''
                },
                deleteModal: {
                    visible: false,
                    buttons: {
                        delete: true,
                        confirm: false,
                        cancel: true
                    }
                },
                compliances: [],
                tableData: [],
                config,
                selectedRows: [],
                PageTitle: 'Company Compliance List',
                CompanyName: '',
                CompanyRegNo: '',
                Entitytype: '',
                showOptions: true,
            }
        },
        created() {
        //   this.getFilterValues();
            this.id = this.$route.params.id;
            this.getDataByFilter();
            if(this.$route.name=="CompanyComplianceFromDossier") {
                this.showOptions = false;
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
            
            ticketValue() {
                return {
                    First: this.CompanyRegNo,
                    Second: this.Entitytype,
                    Third: this.CompanyName
                }
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
                filters.id = this.id;
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
                // getCompanyCompliances(data)
                //     .then(this.handleResponse)
                Promise.all([
                    getCompanyCompliances(data),
                    getCompanyById({id:this.id}),
                ]).then(this.handleResponse)
            },
            handleResponse(response) {
                this.hideLoader();
                // console.log(response);
                // return;
                this.compliances = response[0].data;
                this.pagination.total = response[0].total_records;
                if(typeof response[1].data.Name !== 'undefined'){
                    this.CompanyName = response[1].data.Name;    
                    this.CompanyRegNo = response[1].data.CompanyRegNo;
                    this.Entitytype = response[1].data.Entitytype;
                }else {
                    this.CompanyName = this.PageTitle;
                }
            },
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            showDeleteModal(value) {
                this.deleteModal.visible = value;
            },
            showSuccessModal(val){
                this.successModal.visible = val;
            },
            backToList(){
                this.showSuccessModal(false);
            },
            goBack(){
                this.$router.push({ path: '/company' })
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
                    this.$router.push({ path: `/company/${mode}/${id}` })
                }
            },
            add(){
                this.$router.push(`/company/compliance/add/${this.id}`);
            },
            edit(){
                if (this.validateSelectedLength(1)) {
                    const row = this.selectedRows[0];
                    this.$router.push(`/company/compliance/edit/${this.id}/${row.id}`);
                }
            },
            deleteCompliance(){
                if (this.validateSelectedLength(1)) {
                    this.deleteModal.message = 'Are you sure you want to delete this?';
                    this.showDeleteModal(true);
                    return false
                }
            },
            deletion(){
                const row = this.selectedRows[0];
                deleteCompanyCompliance({id:row.id})
                    .then(this.handleDeleteResponse)
            },
            handleDeleteResponse(response){
                this.showDeleteModal(false);
                this.successModal.message = 'Company compliance is deleted successfully';
                this.showSuccessModal(true);
                this.getDataByFilter()
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
