<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle :title="`Notification Groups - Members (${mode.toUpperCase()})`" slot="title" />
        <TicketHeader v-if="ticketValue" :ticketValue="ticketValue" />
        <template v-if="mode == 'edit' || mode == 'view'">
            <FormRow v-if="mode == 'edit'">
                <div class="col-sm-4">
                    <InputText v-model="form.group_name" label="Group Name" rules="required" />
                </div>
            </FormRow>
            <DataTable :actions="true"
                :data="modifiedGroupUser"
                :columns="tableColumn"
                :is-loading="isLoading"
                @on-selection-change="selectChange"
            >
                <template slot="actionsLeft" v-if="mode == 'edit'">
                    <TableButton @click="() => openAddUserModal(true)">
                        <img src="../../../../assets/images/plus.png" />
                        Add User
                    </TableButton>
                    <TableButton @click="() => deleteUser()">
                        <img src="../../../../assets/images/del.png" />
                        Delete User
                    </TableButton>
                   
                </template>
            </DataTable>
            <ButtonGroup>
                <FormButton left-icon="ios-send" type="success" @click="() => editGroup()" v-if="mode == 'edit'">Save</FormButton>
                <FormButton  @click="() => backToList()" >Back</FormButton>
            </ButtonGroup>
        </template>
        <template v-else-if="mode == 'add'">
            <ValidationObserver ref="addValidator">
                <FormRow>
                    <div class="col-sm-4">
                        <InputText v-model="form.group_name" label="Group Name" rules="required" />
                    </div>
                </FormRow>
                <AdminUsers v-model="form.users" :adminUsers="adminUsers" />
                <ButtonGroup>
                    <FormButton left-icon="ios-send" type="success" @click="() => addGroup()" >Save</FormButton>
                    <FormButton  @click="() => backToList()" >Back</FormButton>
                </ButtonGroup>
            </ValidationObserver>
        </template>

 <!-- Add Modal -->
        <Popup title="Add Group" :value="addUserModal.visible" :mask-closable="false" :closable="true" @close="() => openAddUserModal(false)">
            <FormRow>
                <div class="col-sm-4">
                    <FormSelect label="Select User" v-model="selectedUser" :items="adminUsers" itemName="Name" itemValue="id"  />
                </div>
            </FormRow>
            <div slot="footer">
                <FormButton left-icon="ios-send" type="success" @click="() => addUser()">Add</FormButton>
                <FormButton left-icon="ios-close" @click="() => openAddUserModal(false)">Close</FormButton>
            </div>
        </Popup>
<!-- Delete Modal Popup -->
        <Popup title="Delete User" :value="deleteModal.visible" :mask-closable="false" :closable="true" @close="() => showDeleteModal(false)">
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

        <Popup title="Success" type="success" :value="successModal.visible" :mask-closable="false" :closable="false" @close="() => backToList()" >
            {{ successModal.message }}
            <FormButton left-icon="ios-close" slot="footer" @click="() => backToList()">Close</FormButton>
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
    import { getNotificationGroupUsers, getAdminUserList, saveNotificationGroupUsers } from '../api';
    import AdminUsers from  './components/AdminUsers'
    import { ValidationObserver } from 'vee-validate';
    
    export default {
        name: "NotificationGroupForm",
        mixins: [ loadingMixin, validateSelectedRows],
        components: {
            FormWrapper,
            PageTitle,
            DataTable,
            AdminUsers,
            ValidationObserver
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
                    message: 'Are you sure you want to delete this user from group ?'
                },
                successModal: {
                    visible: false,
                    message: ''
                },
                groupUsers: [],
                adminUsers: [],
                tableColumn,
                selectedRows: [],
                mode: null,
                sorting: {
                    key: 'id',
                    order: 'asc'
                },
                pagination: {
                    perPage: 10,
                    page: 1,
                    total: 0
                },
                addUserModal: {
                    visible: false,
                },
                selectedUser: null,
                form: {
                    group_name: '',
                    users: []
                }
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
            modifiedGroupUser() {
                return this.groupUsers.map( item => {
                    if(item.Fname) item.Name = item.Fname + ' ' + item.Lname;
                    if(item.adminuser_id) item.id = item.adminuser_id
                    return item;
                })
            },
            ticketValue() {
                if(this.groupUsers.length > 0){
                    const val = {
                        First: '',
                        Second: this.groupUsers.length > 0 ? this.groupUsers[0].group_name : '',
                        Third: ''
                    }
                    return val
                }
                return false;
            }
        },
        created() {
            this.mode = this.$route.params.mode
            if(this.$route.params.mode !== 'add' && this.$route.params.id) this.getData();
            this.getFilterValues();
        },
        methods: {
            backToList(){
                this.$router.push('/notificationGroup');
            },
            addGroup() { 
                this.$refs.addValidator.validate().then(result=> {
                    if(result){
                        const ids = this.form.users.map( ele => {
                            return ele.admin_id
                        })
                        const data = {
                            group_name: this.form.group_name,
                            group_id: null,
                            adminusers: ids
                        }
                        saveNotificationGroupUsers(data).then(
                            res => {
                                this.successModal.message = 'Notification Group added successfully.'
                                this.successModal.visible = true;
                            }
                        )
                    }
                })
            },
            editGroup() {
                const ids = this.groupUsers.map( ele => {
                    return ele.id
                })
                const data = {
                    group_id: +this.$route.params.id,
                    adminusers: ids,
                    group_name: this.form.group_name
                }
                saveNotificationGroupUsers(data).then(
                    res => {
                        this.successModal.message = 'Notification Group edited successfully.'
                        this.successModal.visible = true;
                    }
                )
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            openAddUserModal(val) {
                this.addUserModal.visible = val;
                if(val == false) this.selectedUser = null;
            },
            addUser() {
                const select = this.adminUsers.filter( ele => ele.id == this.selectedUser);
                this.groupUsers.push(select[0]);
                this.openAddUserModal(false);
            },
            deleteUser() {
                if(this.validateSelectedLength(1)){
                    let id = this.selectedRows[0].id;
                    console.log(id);
                    console.log(this.groupUsers)
                    const index = this.groupUsers.findIndex(ele => ele.adminuser_id == id)
                    console.log(index)
                    this.groupUsers.splice( index , 1)
                }

            },
            getData(){
                getNotificationGroupUsers({group_id: +this.$route.params.id}).then(
                    res => {
                        this.groupUsers = res.data;
                        if(this.mode == 'edit') this.form.group_name  = this.groupUsers[0].group_name
                    }
                )
            },
            officersData() {
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;
                const data = {
                    user_id: this.userData.user_id,
                    filterjson: {
                        filter: [{Department_id: this.userData.department_id}],
                        sort: [{ key, order }],
                        paging: [
                            {
                                startindex: perPage * (page - 1) + 1,
                                pagesize: 30
                            }
                        ]
                    }
                };
                return data;
            },
            
            getFilterValues() {
                this.showLoader();
                Promise.all([
                    getAdminUserList(this.officersData()),
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.adminUsers = response[0].data[0];
                this.hideLoader();
            },
        }
    }
</script>

<style lang="scss" module>
</style>
