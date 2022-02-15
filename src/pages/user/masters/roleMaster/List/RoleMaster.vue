<template>
    <div>
        <FormWrapper :is-loading="isLoading">
        <PageTitle title="Role Master" slot="title" />

        <DataTable :actions="true"
                   :data="roleMaster"
                   :columns="config"
                   :is-loading="isLoading"
                   @on-selection-change="selectChange">
            <template slot="actionsLeft">
                <TableButton @click="() => openFunc('users')">
                    <img src="../../../../../assets/images/Users.png" alt="">
                    Get Users
                </TableButton>
                <TableButton @click="() => openFunc('menus')">
                    <img src="../../../../../assets/images/GetMenus.png" />
                    Get Menus
                </TableButton>
                <TableButton @click="() => openFunc('edit')">
                    <img src="../../../../../assets/images/edit.png" />
                    Edit Role
                </TableButton>
                <TableButton @click="() => openAdd()">
                    <img src="../../../../../assets/images/plus.png" />
                    Add New Role
                </TableButton>
                <TableButton @click="() => openFunc('assign')">
                    <img src="../../../../../assets/images/Assign.png" />
                    Assign Menu
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

        <Popup :title="currentAction.title !== undefined || currentAction.title !== '' ? currentAction.title: 'Respond' "
            width="900"
            :value="isVisible"
            type="information"
            @close="() => showActionModal(false)">
            
            <ValidationObserver ref="observer" v-if="isVisible" v-slot="{ passes }" >

                <!-- Get Users -->
                <div v-if="currentAction.mode === 'users'">
                    <DataTable :actions="false"
                        :data="users"
                        :columns="usersConfig"
                        :is-loading="isLoading" />
                </div>

                <!-- menus -->
                <div v-if="currentAction.mode === 'menus'">
                    <DataTable :actions="true"
                        :data="menus"
                        :columns="menusConfig"
                        @on-selection-change="selectMenuChange"
                        :is-loading="isLoading" >
                        <template slot="actionsLeft">
                            <TableButton @click="() => changeMenu('unassign')">
                                <img src="../../../../../assets/images/Unassign.png" alt="">
                                Unassign
                            </TableButton>
                        </template>
                    </DataTable>
                </div>
                <div v-if="currentAction.mode === 'assign'">
                    <DataTable :actions="true"
                        :data="menus"
                        :columns="menusConfig"
                        @on-selection-change="selectMenuChange"
                        :is-loading="isLoading" >
                        <template slot="actionsLeft">
                            <TableButton @click="() => changeMenu('assign')">
                                <img src="../../../../../assets/images/Assign.png" alt="">
                                Assign
                            </TableButton>
                        </template>
                    </DataTable>
                </div>
                <FormRow  v-if="currentAction.mode === 'edit'">
                    <div class="col-sm-6">
                        <InputText v-model="editName" rules="required" label="Change Name" />
                    </div>
                </FormRow>
                <FormRow  v-if="currentAction.mode === 'add'">
                    <div class="col-sm-6">
                        <InputText v-model="newRoleName" rules="required" label="Name of Role" />
                    </div>
                </FormRow>

                <br />
                <ButtonGroup slot="footer">
                    <FormButton type="success" @click="passes(addRoleFunc)" v-if="currentAction.mode === 'add'">Add</FormButton>
                    <!-- <FormButton type="success" @click="passes(changeMenu)" v-if="currentAction.mode === 'menus'">Change Menu</FormButton> -->
                    <FormButton type="success" @click="passes(editRole)" v-if="currentAction.mode === 'edit'">Edit</FormButton>
                    <FormButton @click="showActionModal(false)">Cancel</FormButton>
                </ButtonGroup> 
            </ValidationObserver>
        </Popup>

    </FormWrapper>
    </div>
</template>

<script>

    import { ValidationObserver } from 'vee-validate'
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import loadingMixin from 'Mixins/loadingMixin';
    import config from './table';
    import usersConfig from './userTable';
    import menusConfig from './menusTable';
    import { fetchRoles, fetchUserForRoles, fetchMenusForRole, removeAdminMenuFromRole, editRoleById, addRole, assignMenusToRole, fetchAdminMenu } from '../api';

    export default {
        name: 'RoleMaster',
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle,
            DataTable,
            ValidationObserver,
        },
        data(){
            return{
                warningModal: {
                    visible: false,
                    buttons: {
                        ok: true,
                        confirm: false,
                        cancel: false
                    }
                },
                tableData: [],
                users: [],
                menus: [],
                config,
                usersConfig,
                menusConfig,
                selectedRows: [],
                selectedMenus: [],
                roleMaster: [],
                currentAction:{
                    title: '',
                    visible: false,
                    mode: null,
                },
                isVisible: false,
                editName: '',
                newRoleName: '',
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        created() {
            this.getRoles();
        },
        watch: {
        },
        methods: {
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            getRoles() {
                this.showLoader();
                Promise.all([
                    fetchRoles(),
                ]).then(this.handleRoles)
            },
            handleRoles(response) {
                this.roleMaster = response[0].data;
                this.hideLoader();
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            selectMenuChange(data) {
                this.selectedMenus = data;

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
            validateSelectedMenuLength(value) {
                if (this.selectedMenus.length === value) {
                    return true;
                }
                if (value === 1 && this.selectedMenus.length !== 1) {
                    this.warningModal.message = 'Select one row please.';
                    this.showWarningModal(true);
                    return false
                }
                if (this.selectedMenus.length === 0) {
                    this.warningModal.message = 'Select at least one row!';
                    this.showWarningModal(true);
                    return false
                }
                return true;
            },
            showActionModal(val){
                this.isVisible = val;
                if(val === false){
                    this.selectedMenus = [];
                }
            },
            openFunc(mode) {
                if (this.validateSelectedLength(1)) {

                    let id = this.selectedRows[0].id; 
                    this.mode = mode;

                    if( mode== 'users' ){ 
                        const action = {
                            title: 'Users',
                            mode: 'users',
                            visible: true,
                        }

                        fetchUserForRoles({role_id: id}).then(
                            res => {
                                this.users = res.data;
                                this.setCurrentAction(action)
                                this.showActionModal(true);
                            }
                        )

                    }

                    else if( mode== 'menus' ){
                        const action = {
                            title: 'Menus for Role',
                            mode: 'menus',
                            visible: true,
                        }
                        
                        fetchMenusForRole({role_id: id}).then(
                            res =>{
                                this.menus = res.data;
                                this.setCurrentAction(action)
                                this.showActionModal(true);
                            }
                        )
                        

                    }

                    else if( mode== 'edit' ){
                        const action = {
                            title: 'Edit Role',
                            mode: 'edit',
                            visible: true,
                        }
                        this.editName = this.selectedRows[0].Name;
                        this.setCurrentAction(action)
                        this.showActionModal(true);
                        
                    }
                    else if( mode== 'assign' ){
                        const action = {
                            title: 'Assign Menu',
                            mode: 'assign',
                            visible: true,
                        }
                        fetchAdminMenu({role_id: id}).then(
                            res =>{
                                this.menus = res.data;
                                this.setCurrentAction(action)
                                this.showActionModal(true);
                            }
                        )

                        
                    }
                }
            },
            openAdd() {
                const action = {
                    title: 'Add Role',
                    mode: 'add',
                    visible: true,
                }
                this.setCurrentAction(action)
                this.showActionModal(true);
                
            },
            setCurrentAction(action){
                this.currentAction = action;
            },
            addRoleFunc(){
                addRole({Name: this.newRoleName}).then(
                    res => {
                        this.showActionModal(false);
                        this.warningModal.message = res.message;
                        this.showWarningModal(true);
                        this.getRoles();
                    }
                )
            },
            changeMenu(type){
                
                if (this.validateSelectedMenuLength()) {
                    if(type === 'assign'){
                        
                        let id = this.selectedRows[0].id; 
                        var menuIds = this.selectedMenus.map(row => row.id).join(', ');
                        assignMenusToRole({role_id: id,adminmenu_idstring:menuIds}).then(
                            res => {
                                this.showActionModal(false);
                                this.warningModal.message = res.message;
                                this.showWarningModal(true);
                                this.getRoles()

                            }
                        )

                    }
                    else if(type === 'unassign'){
                        let id = this.selectedRows[0].id; 
                        var menuIds = '';
                        this.selectedMenus.forEach( ele => {
                            menuIds = menuIds + ele.id + ',';
                        });
                        
                        removeAdminMenuFromRole({role_id: id,adminmenu_idstring:menuIds}).then(
                            res => {
                                this.showActionModal(false);
                                this.warningModal.message = res.message;
                                this.showWarningModal(true);
                                this.getRoles();
                            }
                        )

                    }
                }

            },
            editRole(){
                let id = this.selectedRows[0].id; 
                editRoleById({role_id: id, Name: this.editName}).then(
                    res => {
                        this.showActionModal(false);
                        this.warningModal.message = res.message;
                        this.showWarningModal(true);
                        this.getRoles();
                    }
                )
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
        align-items: flex-end;
    }

    .filterItem {
        flex: 0 0 180px;
        margin-right: 20px;
    }

    .popupRow {
        padding: 5px 0 15px;
    }
    .popPadding{
        padding: 0px 0px;
    }



</style>
