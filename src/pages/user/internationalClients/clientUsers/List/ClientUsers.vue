<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle :title=title slot="title"  />
        <DataTable :actions="true"
            :data="usersList"
            :columns="tableConfig"
            :is-loading="isLoading"
            @on-selection-change="selectChange"
            @on-sort-change="sortChange"
        >
            
            <!-- @on-page-change="pageChange"
            :pagination="pagination" -->
            <template slot="actionsLeft">
                <TableButton @click="addUser">
                    <img src="../../../../../assets/images/plus.png" alt="">
                    Add
                </TableButton>
                <TableButton @click="editUser">
                    <img src="../../../../../assets/images/edit.png" alt="">
                    Edit
                </TableButton>
                <TableButton @click="deleteUser">
                    <img src="../../../../../assets/images/del.png" alt="">
                    Delete
                </TableButton>
            </template>
        </DataTable>
        
        <Popup :value="successModal.visible" :title="successModal.title" type="success" @close="() => successModal.visible = false">
            <div>
                {{ successModal.message }}
            </div>
            <div slot="footer">
                <FormButton @click="() => successModal.visible = false">Close</FormButton>
            </div>
        </Popup>
        <Popup title="Information" :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.confirm" type="success" @click="confirmDelete">Confirm
                </FormButton>
                <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
                <FormButton v-if="warningModal.buttons.cancel" @click="() => showWarningModal(false)">Cancel
                </FormButton>
            </div>
        </Popup>
        <Popup title="Information" :value="deleteModal.visible" @close="() => showDeleteModal(false)">
            {{ deleteModal.message }}
            <div slot="footer">
                <FormButton v-if="deleteModal.buttons.confirm" type="success" @click="confirmDelete">Confirm
                </FormButton>
                <FormButton v-if="deleteModal.buttons.cancel" @click="() => showDeleteModal(false)">Cancel
                </FormButton>
            </div>
        </Popup>

    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable'
    import loadingMixin from 'Mixins/loadingMixin'
    import { getIntlClientUsersList, deleteIntlClientWebuser, getClientsList } from '../api'
    import tableConfig from './table'
    import validateSelectedRows from 'Mixins/validateSelectedRows';

    export default {
        name: "ClientUserCreation",
        mixins: [loadingMixin,validateSelectedRows],
        data() {
            return {
                title: '',
                isModalVisible: false,
                filtering: {
                    statuses: [],
                    statusSelected: null,
                    isRFI: false,
                    companyName: '',
                    
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
                tableConfig,
                users: [],
                selectedRows: [],
                successModal: {
                    visible: false,
                    title: 'Success',
                    message: ''
                },
                deleteModal: {
                    visible: false,
                    message: '',
                    buttons: {
                        ok: true,
                        confirm: false,
                        cancel: false
                    }
                },
            }
        },
        watch: {
            
        },
        created() {
            this.getData();
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
            usersList() {
                if(this.users.length > 0){
                    var list = this.users.map( ele => {
                        ele.Name = ele.Fname + ' ' + ele.Lname;
                        return ele;
                    })
                }
                else{
                    var list = [];
                }
                return list;
            }
        },
        components: {
            FormWrapper,
            DataTable,
            PageTitle
        },
        methods: {
            addUser(){
                var client_id = this.$route.params.client_id;
                this.$router.push(`/intlClientUserCreation/${client_id}`);
            },
            editUser(){
                 if (this.validateSelectedLength(1)) {
                    const row = this.selectedRows[0];
                    const client_id = this.$route.params.client_id;
                    this.$router.push(`/intlClientUserUpdate/${client_id}/${row.id}`)
                }
            },
            deleteUser(){
                if (this.validateSelectedLength(1)) {
                    const row = this.selectedRows[0];
                    this.deleteModal.message = 'Are you sure, you want to delete this user?';
                    this.deleteModal.buttons.confirm = true;
                    this.deleteModal.buttons.cancel = true;
                    this.showDeleteModal(true);
                }
            },
            confirmDelete(){
                const row = this.selectedRows[0];
                // console.log(row.id);return;
                deleteIntlClientWebuser({id:row.id}).then(this.handleResponse)
            },
            handleResponse(res){
                this.showDeleteModal(false);
                this.successModal.message = res.message;
                this.successModal.visible = true;
                this.getData();
            },
            showDeleteModal(value){
                this.deleteModal.visible = value;
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            sortChange(data) {
                this.sorting.key = data.key;
                this.sorting.order = data.order;
                this.getDataByFilter()
            },
            getData(){
                this.showLoader();
                if(this.$route.params.client_id){
                    //for showing client name on top + fetching users..
                    Promise.all([
                        getIntlClientUsersList({client_id: this.$route.params.client_id}),
                        getClientsList({client_id: parseInt(this.$route.params.client_id)}),
                    ]).then(this.handleAllResponse)
                    
                }
            },
            handleAllResponse(response){
                this.users = response[0].data;
                this.title = "International Client Users ("+response[1].data[0]['Name']+")";
                this.hideLoader();
            },
            pageChange(page) {
                this.pagination.page = page;
                this.getDataByFilter()
            },
        }
    }
</script>

<style lang="scss" module>


    .pagination {
        margin: 10px 0 0;
        text-align: right;
        display: flex;
        justify-content: flex-end;
        line-height: 26px;
    }

    .paginationText {
        margin: 0 20px;
    }

    .paginationButton {
        cursor: pointer;
        width: 26px;
        text-align: center;
        transition: background-color .2s ease-in-out,color .2s ease-in-out, box-shadow 200ms ease
    }
    .paginationButton:hover {
        background: #57a3f3;
        color: #fff;
        &:hover {
            box-shadow: 0 5px 11px 0 rgba(0,0,0,.18), 0 4px 15px 0 rgba(0,0,0,.15);
        }
    }

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
