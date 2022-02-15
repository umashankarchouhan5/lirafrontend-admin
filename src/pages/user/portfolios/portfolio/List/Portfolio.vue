<template>
    <div>
        <FormWrapper :is-loading="isLoading">
        <PageTitle title="Portfolio" slot="title" />

        <div>

            <DataTable :actions="true"
                :data="menuList"
                :columns="config"
                :is-loading="isLoading"
                @on-selection-change="selectChange">
                <template slot="actionsLeft">
                    <TableButton @click="() => openFunc('assign')" v-if="userData.is_Department_head === true">
                        <img src="../../../../../assets/images/plus.png" />
                        Assign 
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
            
            <ValidationObserver ref="observer" v-if="isVisible"  >
               
                <!-- assign / unassign -->
                <div v-if="currentAction.mode === 'assign'">
                    <DataTable :actions="true"
                        :data="users"
                        :columns="usersConfig"
                        @on-selection-change="selectMenuChange"
                        :is-loading="isLoading" >
                        <template slot="actionsLeft">
                            <TableButton @click="() => changeMenu('assign')" >
                                <img src="../../../../../assets/images/plus.png" alt="">
                                Assign
                            </TableButton>
                        </template>
                    </DataTable>
                </div>

                <br />
                <ButtonGroup slot="footer">
                   
                    <FormButton @click="showActionModal(false)">Cancel</FormButton>
                </ButtonGroup> 

            </ValidationObserver>
        </Popup>

        
        <Popup title="Success" type="success" :value="successModal.visible" @close="() => showSuccessModal(false)">
            {{successModal.message}}
            <div slot="footer">
                <FormButton  @click="() => showSuccessModal(false)">Close</FormButton>
            </div>
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
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import { fetchPortfolio, getAdminUserList, assignPortfolioToUser } from '../api';

    export default {
        name: 'Portfolios',
        mixins: [loadingMixin, validateSelectedRows],
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
                selectedRows: [],
                selectedRoles: [],
                selectedUsers: [],
                roleMaster: [],
                currentAction:{
                    title: '',
                    visible: false,
                    mode: null,
                },
                isVisible: false,
                departmentList: [],
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
                roles: [],
                successModal: {
                    visible: false,
                    message: '',
                },
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        created() {
            this.getData();
        },
        watch: {
            
        },
        methods: {
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            getData(){
                var self = this;
                fetchPortfolio().then(
                    res => {
                        this.menuList = res.data;
                    }
                    
                )
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            selectMenuChange(data) {
                this.selectedUsers = data;

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
                if (this.selectedUsers.length === value) {
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
            },
            showSuccessModal(val){
                this.successModal.visible = val;
            },
            openFunc(mode) {
                
                if( mode === 'assign' ){
                    
                    if (this.validateSelectedLength(1)) {
                        const action = {
                            title: 'Assign',
                            mode: mode,
                            visible: true,
                        }
                        const data = {
                            filterjson: {
                                filter: [
                                    {
                                        Department_id: this.userData.department_id
                                    }
                                ],
                                paging: [{startindex: 1, pagesize: 100}],
                                sort: [{key: "id", order: "desc"}]
                            }
                        }
                        getAdminUserList(data).then(
                            res => {
                                this.users = res.data[0];
                                this.setCurrentAction(action)
                                this.showActionModal(true);
                        })
                    }
                }
                
            },
            setCurrentAction(action){
                this.currentAction = action;
            },
            changeMenu(type){
                
                if (this.validateSelectedMenuLength(1)) {
                    let user_id = this.selectedUsers[0].id; 
                    let icsp_id = this.selectedRows[0].icsp_id;
                    if(type === 'assign') {
                        assignPortfolioToUser({icsp_id: icsp_id, officer_id: user_id}).then(
                            res => {
                                this.showActionModal(false);
                                this.successModal.message = res.message;
                                this.showSuccessModal(true);
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
