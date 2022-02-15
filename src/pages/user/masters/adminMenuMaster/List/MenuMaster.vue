<template>
    <div>
        <FormWrapper :is-loading="isLoading">
        <PageTitle title="AdminMenu Master" slot="title" />

        <div>

            <div :class="$style.filter">
                
                <div :class="$style.filterItem">
                    <FormSelect :width="200" label="Departments" :items="departmentList" item-name="Name" item-value="id" v-model="departmentId" />
                </div>
                
                <FormButton style="margin-top: 5px" type="primary" @click="getData" :rounded="true">
                    <Icon type="ios-search" />
                </FormButton>

            </div>

            <DataTable :actions="true"
                :data="menuList"
                :columns="config"
                :is-loading="isLoading"
                @on-selection-change="selectChange">
                <template slot="actionsLeft">
                    <TableButton @click="() => openFunc('addSubmenu')">
                        <img src="../../../../../assets/images/plus.png" alt="">
                        Add New Submenu
                    </TableButton>
                    <TableButton @click="() => openFunc('addMenu')">
                        <img src="../../../../../assets/images/plus.png" />
                        Add New Menu
                    </TableButton>
                    <TableButton @click="() => openFunc('editSubmenu')">
                        <img src="../../../../../assets/images/edit.png" />
                        Edit Submenu
                    </TableButton>
                    <TableButton @click="() => openFunc('editMenu')">
                        <img src="../../../../../assets/images/edit.png" />
                        Edit Menu
                    </TableButton>
                    <TableButton @click="() => openFunc('assign')">
                        <img src="../../../../../assets/images/Assign.png" />
                        Assign Role 
                    </TableButton>
                    
                    <TableButton @click="() => openFunc('unassign')">
                        <img src="../../../../../assets/images/Unassign.png" />
                        UnAssign Role
                    </TableButton>
                </template>
            </DataTable>

        </div>

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
            width="620"
            :value="isVisible"
            type="information"
            @close="() => showActionModal(false)">
            
            <ValidationObserver ref="observer" v-if="isVisible" v-slot="{ passes }" >
                <div v-if="currentAction.mode === 'addSubmenu' || currentAction.mode === 'editSubmenu' ||currentAction.mode === 'addMenu'" :class="$style.popPadding">
                    <div v-if="currentAction.mode !== 'addMenu'" >
                        
                        <FormRow>
                            <FormSelect  label="Parent" rules="required" :items="topMenu" item-name="Name" item-value="id" v-model="dataToSend.parent_id" />
                        </FormRow>
                    </div>

                    <div >
                        <FormRow>
                            <InputText v-model="dataToSend.adminmenuName" rules="required" label="Admin Menu Name" />
                        </FormRow>
                        <FormRow>
                            <InputText v-model="dataToSend.process_id" type="number" label="Process ID" />
                        </FormRow>
                        <FormRow>
                            <FormSelect  label="Departments" :items="departmentList" item-name="Name" item-value="id" v-model="dataToSend.department_id" />
                        </FormRow>
                        <FormRow>
                            <InputText  label="URL" v-model="dataToSend.URL" />
                        </FormRow>
                        <FormRow>
                            <FormCheckbox v-model="dataToSend.isActive" label="isActive" :trueValue="1" :falseValue="0" >Is Active</FormCheckbox>
                        </FormRow>
                    </div>
                </div>
                
                <!--edit menus -->
                <div :class="$style.popPadding" v-if="currentAction.mode === 'editMenu'" >
                    
                    <FormRow>
                        <FormSelect  label="Select Menu" rules="required" :items="topMenu" item-name="Name" item-value="id" v-model="selectEditableMenu" />
                    </FormRow>
                    <div v-if="selectEditableMenu !== null">
                        <FormRow>
                            <InputText v-model="dataToSend.adminmenuName" rules="required" label="Admin Menu Name" />
                        </FormRow>
                        <FormRow>
                            <InputText v-model="dataToSend.process_id" type="number" rules="required" label="Process ID" />
                        </FormRow>
                        <FormRow>
                            <FormSelect  label="Departments" :items="departmentList" item-name="Name" item-value="id" v-model="dataToSend.department_id" />
                        </FormRow>
                        <FormRow>
                            <InputText  label="URL" v-model="dataToSend.URL" />
                        </FormRow>
                        <FormRow>
                            <FormCheckbox v-model="dataToSend.isActive" label="isActive" :trueValue="1" :falseValue="0" >Is Active</FormCheckbox>
                        </FormRow>
                    </div>
                </div>

                <!-- assign / unassign -->
                <div v-if="currentAction.mode === 'unassign'">
                    <DataTable :actions="true"
                        :data="roles"
                        :columns="rolesConfig"
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
                        :data="roles"
                        :columns="rolesConfig"
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

                <br />
                <ButtonGroup slot="footer">
                    <FormButton type="success" @click="passes(addMenuFunc)" v-if="currentAction.mode === 'addMenu' || currentAction.mode === 'addSubmenu'">Add</FormButton>
                    <!-- <FormButton type="success" @click="passes(changeMenu)" v-if="currentAction.mode === 'menus'">Change Menu</FormButton> -->
                    <FormButton type="success" @click="passes(addMenuFunc)" v-if="currentAction.mode === 'editMenu' || currentAction.mode === 'editSubmenu'">Edit</FormButton>
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
    import rolesConfig from './rolesTable';
    import { getDepartmentList, fetchAdminMenu, fetchTopAdminMenu, addUpdateAdminMenu, AssignMenusToRole, RemoveAdminMenuFromRole, FetchRolesForMenu, fetchRoles } from '../api';

    export default {
        name: 'AdminMenuMaster',
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
                rolesConfig,
                selectedRows: [],
                selectedRoles: [],
                roleMaster: [],
                currentAction:{
                    title: '',
                    visible: false,
                    mode: null,
                },
                isVisible: false,
                editName: '',
                newRoleName: '',
                departmentList: [],
                departmentId: null,
                menuList: [],
                topMenu: [],
                dataToSend: {
                    adminmenu_id: 0,
                    adminmenuName: '',
                    parent_id: 0,
                    process_id: 0,
                    department_id: 0,
                    isActive: null,
                    URL: '',
                },
                selectEditableMenu: null,
                roles: []
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        created() {
            this.getDepartment();
            this.getData();
        },
        watch: {
            selectEditableMenu(val){
                if(val !== null){
                    const row = this.topMenu.find( item => {
                        return val === item.id;
                    })
                    this.dataToSend= {
                        adminmenu_id: row.id,
                        adminmenuName: row.Name,
                        parent_id: row.processtype_id !== null ? row.processtype_id : 0,
                        process_id: row.process_id,
                        department_id: 0,
                        isActive: row.isActive,
                        URL: row.URL
                    }
                }
            }
        },
        methods: {
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            getDepartment() {
                this.showLoader();
                Promise.all([
                    getDepartmentList(),
                    fetchTopAdminMenu(),
                ]).then(this.handleDepartment)
            },
            handleDepartment(response) {
                this.departmentList = response[0].data;
                this.topMenu = response[1].data;
                this.hideLoader();
            },
            getData(){
                fetchAdminMenu({department_id: this.departmentId}).then(
                    res => {
                        this.menuList = res.data;
                    }
                )
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            selectMenuChange(data) {
                this.selectedRoles = data;

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
                if (this.selectedRoles.length === value) {
                    return true;
                }
                if (value === 1 && this.selectedRoles.length !== 1) {
                    this.warningModal.message = 'Select one row please.';
                    this.showWarningModal(true);
                    return false
                }
                if (this.selectedRoles.length === 0) {
                    this.warningModal.message = 'Select at least one row!';
                    this.showWarningModal(true);
                    return false
                }
                return true;
            },
            showActionModal(val){
                this.isVisible = val;
                if(val === false){
                    this.resetData();
                }
            },
            resetData(){
                
                this.dataToSend = {
                    adminmenu_id: 0,
                    adminmenuName: '',
                    parent_id: 0,
                    process_id: 0,
                    department_id: 0,
                    isActive: null,
                    URL: '',
                }
                this.selectEditableMenu = null;
            },
            openFunc(mode) {
                
                if( mode === 'addMenu' ){ 
                    const action = {
                        title: 'Add Menu',
                        mode: mode,
                        visible: true,
                    }
                    this.setCurrentAction(action)
                    this.showActionModal(true);
                }
                else if( mode === 'addSubmenu'){
                    const action = {
                        title: 'Add Submenu',
                        mode: mode,
                        visible: true,
                    }
                    this.setCurrentAction(action)
                    this.showActionModal(true);
                }
                else if( mode === 'editMenu' ){ 
                    const action = {
                        title: 'Edit Menu',
                        mode: mode,
                        visible: true,
                    }

                    this.setCurrentAction(action)
                    this.showActionModal(true);

                }
                
                else if( mode === 'editSubmenu' ){
                    if (this.validateSelectedLength(1)) {

                    let row = this.selectedRows[0]; 
                        const action = {
                            title: 'Edit Submenu',
                            mode: mode,
                            visible: true,
                        }
                        
                        this.dataToSend= {
                            adminmenu_id: row.id,
                            adminmenuName: row.Name,
                            parent_id: row.processtype_id !== null ? row.processtype_id : 0,
                            process_id: row.process_id,
                            department_id: 0,
                            isActive: null,
                            URL: '',
                        }
                        this.setCurrentAction(action)
                        this.showActionModal(true);
                    }
                }
                
                else if( mode === 'assign' ){
                    
                    if (this.validateSelectedLength(1)) {
                        const action = {
                            title: 'Assign',
                            mode: mode,
                            visible: true,
                        }
                        fetchRoles().then(
                            res => {
                                this.roles = res.data;
                                this.setCurrentAction(action)
                                this.showActionModal(true);
                        })
                    }
                }
                else if( mode === 'unassign' ){
                    if (this.validateSelectedLength(1)) {

                        let id = this.selectedRows[0].id; 
                        const action = {
                            title: 'UnAssign',
                            mode: mode,
                            visible: true,
                        }
                        FetchRolesForMenu({adminmenu_id: id}).then(
                            res => {
                                this.roles = res.data;
                                this.setCurrentAction(action)
                                this.showActionModal(true);
                            }
                        )
                    }
                }
                
            },
            setCurrentAction(action){
                this.currentAction = action;
            },
            addMenuFunc(){

                addUpdateAdminMenu(this.dataToSend).then(
                    res => {
                        this.showActionModal(false);
                        this.warningModal.message = res.message;
                        this.showWarningModal(true);
                        this.getData();
                    }
                )
            },
            changeMenu(type){
                
                if (this.validateSelectedMenuLength(1)) {
                    let id = this.selectedRoles[0].id; 
                    let menuId = this.selectedRows[0].id;

                    if(type === 'assign') {
                        AssignMenusToRole({role_id: id, adminmenu_idstring: menuId}).then(
                            res => {
                                this.showActionModal(false);
                                this.warningModal.message = res.message;
                                this.showWarningModal(true);
                                this.getData();
                            }
                        )
                    }
                    if(type === 'unassign') {
                        RemoveAdminMenuFromRole({role_id: id, adminmenu_idstring: menuId}).then(
                            res => {
                                this.showActionModal(false);
                                this.warningModal.message = res.message;
                                this.showWarningModal(true);
                                this.getData();
                            }
                        )
                    }
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
        padding: 10px 20px;
    }



</style>
