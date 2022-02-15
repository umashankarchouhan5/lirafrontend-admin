<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="User List" slot="title" />
         <div :class="$style.filter">
            <div :class="$style.filterItem">
                <InputText v-model="filtering.Name" label="Name" />
            </div>
            <div :class="$style.filterItem">
                <FormSelect :width="200" label="Department" :items="filtering.departments" item-name="Name" item-value="id" v-model="filtering.departmentSelected" />
            </div>
            <div :class="$style.filterItem">
                <FormSelect :width="200" label="Role" :items="filtering.roles" item-name="Name" item-value="id" v-model="filtering.roleSelected" />
            </div>
            <FormButton style="margin-top: 5px" type="primary" @click="search" :rounded="true">
                <Icon type="ios-search" />
            </FormButton>
        </div>
        <DataTable :actions="true"
                   :data="Users"
                   :columns="config"
                   :is-loading="isLoading"
                   @on-selection-change="selectChange"
                   @on-page-change="pageChange"
                   :pagination="pagination"
                   @on-sort-change="sortChange">
            <template slot="actionsLeft">
                <TableButton @click="() => addNew()">
                    <img src="../../../../assets/images/plus.png" alt="">
                    Add
                </TableButton>
                <TableButton @click="() => pushTo('edit')">
                    <img src="../../../../assets/images/edit.png" />
                    Edit
                </TableButton>
                <TableButton @click="() => pushTo('del')">
                    <img src="../../../../assets/images/del.png" />
                    Delete
                </TableButton>
                <TableButton @click="() => pushTo('view')">
                    <img src="../../../../assets/images/eye.png" />
                    View
                </TableButton>
                <TableButton @click="() => openResetModal()">
                    <img src="../../../../assets/images/mail.png" />
                    Reset Password
                </TableButton>
            </template>
        </DataTable>

<!-- Message popup -->
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

        <Popup title="Reset Password" :value="resetModal.visible" @close="() => resetModal.visible = false">
            Confirm to reset password of selected user.
            <div slot="footer">
                <FormButton  type="success" @click="resetPassword">Confirm</FormButton>
                <FormButton  @click="() => resetModal.visible = false">Cancel</FormButton>
            </div>
        </Popup>
        <Popup title="Success" type="success" :value="successModal.visible" @close="() => showSuccessModal(false)">
            {{successModal.message}}
            <div slot="footer">
                <FormButton  @click="() => showSuccessModal(false)">Close</FormButton>
            </div>
        </Popup>

    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import config from './table';
    import loadingMixin from 'Mixins/loadingMixin';
    import {  getAdminUserList, getDepartments, getRoles, checkUser } from '../api'
    export default {
        name: "Users",
        mixins: [loadingMixin],
        data() {
            return {
                filtering: {
                    Name: null,
                    departmentSelected: null,
                    departments: [],
                    roleSelected: null,
                    roles: []
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
                Users: [],
                tableData: [],
                config,
                selectedRows: null,
                resetModal: {
                    visible: false,
                },
                successModal: {
                    visible: false,
                    message: '',
                },
            }
        },
        created() {
          this.getFilterValues();
          this.getDataByFilter();
        },
        watch: { },
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        components: {
            FormWrapper,
            PageTitle,
            DataTable
        },
        methods: {
            showSuccessModal(val){
                this.successModal.visible = val;
            },
            openResetModal(){
                if(this.validateSelectedLength(1)){
                    this.resetModal.visible = true;
                }
            },
            resetPassword(){
                    const data ={
                        email: this.selectedRows[0].email
                    }
                    checkUser(data).then(
                        res => {
                            this.resetModal.visible = false;
                            this.successModal.message = 'Password is sent to associated email id';
                            this.showSuccessModal(true);
                        } 
                    )
            },
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            getFilterValues() {
                this.showLoader();
                const data = { TableName: 'MasDepartment' };
                Promise.all([
                    getDepartments(data),
                    getRoles(),
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.filtering.departments = response[0].data;
                this.filtering.roles = response[1].data;
            },
            sortChange(data) {
                this.sorting.key =  data.key;
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
                const { perPage, page } = this.pagination;

                const filters = {};

                // Ignore other filters if we have UserName
                if (this.filtering.Name) {
                    filters.Name = this.filtering.Name
                } else {
                    filters.Department_id = this.filtering.departmentSelected;
                    filters.role_id = this.filtering.roleSelected;
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
                getAdminUserList(data)
                    .then(this.handleResponse)
            },
            handleResponse(response) {
                this.hideLoader();
                this.Users = response.data[0];
                this.pagination.total = response.NumberOfRecords;
            },
            validateSelectedLength(value) {
                if (this.selectedRows.length === value) {
                    return true;
                }
                if (value === 1 && this.selectedRows.length !== 1) {
                    this.warningModal.message = 'Select one row please.';
                    this.showWarningModal(true);
                    return false
                }
                if (this.selectedRows.length === 0) {
                    this.warningModal.message = 'Select at least one row!';
                    this.showWarningModal(true);
                    return false
                }
                return true;
            },
            pushTo(mode) {
                if (this.validateSelectedLength(1)) {
                    let userSelected = this.selectedRows[0].EmpCode; // allow only the first row
                    if( mode== 'edit' ){ // edit is clicked
                        this.$router.push({ path: `/users/edit/${userSelected}` })
                    }else if( mode== 'del' ){
                        this.$router.push({ path: `/users/del/${userSelected}` })
                    }else if( mode== 'view' ){
                        this.$router.push({ path: `/users/view/${userSelected}` })
                    }
                }
            },
            addNew() {
                this.$router.push({ path: `/users/add` })
            },
        }
    }
</script>

<style lang="scss" module>

    .currentEntityFile {
        display: inline-flex;
        span {
            margin-left: 20px;
            padding: 3px;
            cursor: pointer;
        }
    }

    .bulkFilesError {
        position: absolute;
        z-index: 4;
        bottom: 5px;
        left: 11px;
        font-size: 11px;
        color: #ff3547
    }

    .exampleFile {
        display: inline-block;
        margin-top: 10px;
    }

    .uploadedFiles {
        background: rgb(241, 241, 241);
        height: 200px;
        width: calc(100%/2 - 8px);
        padding: 10px 15px;
        border-radius: 4px;
        overflow: auto;
    }

    .bulkFile {
        display: flex;
        border-bottom: 1px solid darken(rgb(241, 241, 241), 10%);
        align-items: center;
        &:last-child {
            border-bottom: none;
        }
    }

    .removeBulkFile {
        cursor: pointer;
        padding: 3px;
        margin-left: auto;
    }

    .excelFile {
        display: flex;
        padding: 5px 0;
    }

    .excelFileLabel {
        width: 120px;
        flex-shrink: 0;
        flex-grow: 0;
        align-items: center;
        display: flex;
    }

    .excelFileInput {
        flex-grow: 1;
    }

    .progress {
        margin: 0 20px;
        progress {
            width: 100%;
        }
    }

    .upload {
        width: calc(100%/2 - 8px);
        height: 200px;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        &:hover {
            .uploadArea {
                background: darken(#f2f2f2, 5%);
                border: 2px dashed  darken(#e3e3e3, 5%);
            }
        }
        .uploadArea {
            position: absolute;
            pointer-events: none;
            background: #f2f2f2;
            border: 2px dashed #e3e3e3;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
            outline: none;
            display: flex;
            align-items: center;
            text-align: center;
            justify-content: center;
        }
        input {
            width: 100%;
            height: 100%;
        }
    }

    .files {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    }

    .filter {
        margin: -10px 0 25px;
        display: flex;
        align-items: flex-end;
    }

    .filterItem {
        flex: 0 0 180px;
        margin-right: 20px;
    }

    .popupRow {
        padding: 5px 0 15px;
    }



</style>
