<template>
    <div :is-loading="isLoading">
        <h6 v-if="actions.length > 0">Actions</h6>
        <DataTable :actions="true"
            v-if="actions.length > 0"
            :data="actions"
            :columns="tableConfig()"
            :is-loading="isLoading"
            @on-selection-change="selectChange"
            @on-sort-change="sortChange">
            
            <!-- @onOpenPop="openUpdatePopup" -->
            <template slot="actionsLeft" v-if="!readonly">
                <!-- <TableButton @click="addNewAction">
                    <img src="../../../../assets/images/plus.png" alt="" >
                    Add
                </TableButton> -->
                <TableButton @click="markAsComplete">
                    <img src="../../../../assets/images/check-o.png" alt="" >
                    Mark as Closed
                </TableButton>
                <TableButton @click="allocateOpen()">
                    <img src="../../../../assets/images/check-o.png" alt="" >
                    Allocate
                </TableButton>
            </template>
        </DataTable>

         <!-- add or edit popup -->

        <Popup :title="currentAction.title"
            width="620"
            :value="isVisible"
            @close="() => showActionModal(false)">
            
            <ValidationObserver ref="observer" v-if="isVisible" v-slot="{ passes }" >
                
                <Loader v-if="isLoading" />
                <div :class="$style.popupRow">
                    <FormSelect label="Action Type"
                        :disabled="currentAction.mode === 2"
                        :items="actionList"
                        item-value="id"
                        item-name="Name"
                        :clearable="false"
                        rules="required"
                        @change="selectAction"
                        v-model="currentAction.action.ActionType"/>
                </div>
                <div :class="$style.popupRow">
                    <InputTextArea label="ActionBrief" v-model="currentAction.action.ActionBrief" rules="required" rows="3" />
                </div>
                
                <ButtonGroup slot="footer">
                    <FormButton type="success" @click="passes(addAction)" :disabled="isLoading"><span v-if="currentAction.mode != 2">Add</span><span v-else>Edit</span>    </FormButton>
                    <FormButton @click="showActionModal(false)">Cancel</FormButton>
                </ButtonGroup> 
            </ValidationObserver>
        </Popup>


        <Popup :title="subTask !== null ? subTask.ActionBrief: 'Sub Task'" type="information" :value="updatePopup.visible" @close="showUpdateModal(false)" width="1000">
            
            <TicketHeader v-if="ticketValue && subTask!== null" typeOfHeader="popup" :ticketValue="ticketValue" />

            <SubTaskComponent v-if="updatePopup.visible" :TicketReference="updatePopup.ticket" :ReferenceId="updatePopup.reference" @closeActionPopup="showUpdateModal(false)" @invoiceGenerated="emitInvoiceGeneration" />
        
        </Popup>

        
        <Popup title="Success" type="success" :value="successModal.visible" @close="hideSuccessModal" >
            {{ successModal.message }}
            <div slot="footer">
                <FormButton @click="hideSuccessModal">Ok</FormButton>
            </div>
        </Popup>


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

        <Popup title="Allocate" width="700" :value="allocatePopup" @close="allocatePopup = false">
            <FormRow v-if="isTicketForwarded">
                    <Loader v-if="forwardingUsersIsLoading" />
                    <div class="col-sm-4">
                        <FormSelect v-model="userToForward" :items="allocatingUsers" item-name="EmployeeName" item-value="id"  />
                        <div :class="$style.error" v-if="errors.userToForward">
                            You should select user to proceed
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <FormButton @click="forwardTicketHandler" >Allocate</FormButton>
                    </div>
                </FormRow>
        </Popup>
    </div>
</template>

<script>
    
    
    import { ValidationObserver } from 'vee-validate';
    import SubTaskComponent from 'Pages/user/subTask/subTaskComponent';
    import DataTable from 'Components/DataTable';
    import tableConfig from './config/table';
    import loadingMixin from 'Mixins/loadingMixin';
    import { getActions, markCompleteAction,addActions,fetchActionList, assignTicket } from './config/api';
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import Loader from 'Components/layout/Loader';

    const newAction= {
        title: 'Add Action',
        reviewAction_id: 0,
        mode: 1,
        action:{
            ActionType:'',
            ActionBrief:'',
            isAdmin: 0,
            isDone: 0,
            Deadline:''
        },
        actiondata:{
            Narration50: '',
            Narration:'',
            FeeUSD: "",
            Taxpct: "",
            Penality: "",
        }
    };

    export default {
        name: 'Actions',
        mixins: [loadingMixin,validateSelectedRows],
        props: {
            readonly: Boolean,
        },
        data(){
            return{
                updatePopup:{
                    visible: false,
                    ticket:null,
                    reference: null,
                },
                selectedRows: [],
                successModal: {
                    visible: false,
                    message: ''
                },
                isVisible: false,
                currentAction: JSON.parse(JSON.stringify(newAction)),
                tableConfig,
                pagination: {
                    perPage: 10,
                    page: 1,
                    total: 0
                },
                actions: [],
                sorting: {
                    key: 'Deadline',
                    order: 'asc'
                },
                actionList: [
                    {
                        id: 2,
                        Name: 'Pay Fees',
                    }
                ],
                actionType:{},
                selectedAction: '',

                allocatePopup: false,
                allocate:{},
                isTicketForwarded: false,
                userToForward: null,
                errors: {
                    userToForward: false
                },
                forwardUserPopup: false,
                showMessage:{
                    isVisible: false,
                    message: ''
                },
            }
        },
        components:{
            DataTable,
            SubTaskComponent,
            ValidationObserver,
            Loader
        },
        computed:{
            processId() {
                return this.$store.state.common.currentProcessId
            },
            userData() {
                return this.$store.state.user.user
            },
            ticket() {
                return this.$store.state.ticket.ticket;
            },
            allocatingUsers() {
                return this.$store.state.ticket.allocatingUsers;
            },
            forwardingUsersIsLoading() {
                return this.$store.state.ticket.forwardingUsersIsLoading;
            },
            subTask(){
                return this.$store.state.common.subTaskData;
            },
            ticketValue() {
                if(this.subTask !== null){
                    return {
                        First: this.subTask.TicketReference,
                        Second: this.subTask.CompanyName,
                        Third: ''
                    }
                }
                return false
            }
        },
        created(){
            this.getActionsData();
            this.fetchList();
            this.$store.dispatch('fetchAllocatingUsers');
        },
        methods:{
            emitInvoiceGeneration() {
                const data = {
                    reference_id: this.ticket.reference_id,
                    process_id: this.ticket.process_id
                }
                this.$store.dispatch('getPayments',data)
            },
            forwardTicketHandler() {
                this.errors.userToForward = this.isTicketForwarded && !this.userToForward;
                if (!this.errors.userToForward) {
                    // this.$emit('onForwardTicket', this.userToForward)
                    this.$store.commit('setForwardingUsersLoader', true);;
                    assignTicket({
                        AssignTo: this.userToForward,
                        TicketReference: this.selectedRows[0].FSATicketReference
                    })
                    .then(() => {
                        this.$store.commit('setForwardingUsersLoader', false);
                        this.getActionsData();
                        this.allocatePopup = false;
                        this.forwardUserPopup = true;
                    }).catch(() => {
                        this.$store.commit('setForwardingUsersLoader', false);
                    })
                }
            },
            allocateOpen(){
                this.isTicketForwarded = true;
                if (this.validateSelectedLength(1)) {
                    
                    var rows = this.selectedRows[0];
                    const data = {
                        process_id: rows.Process_id,
                        reference_id: rows.Reference_id
                    }
                    this.allocate = data;
                    this.$store.dispatch('fetchAllocatingUsers', data);
                    this.allocatePopup = true;
                }
            },
            showUpdateModal(val){
                this.updatePopup.visible = val;
                if( val == false ){
                    this.getActionsData();
                }
            },
            onOpenPop(data){
                this.updatePopup.ticket = data.FSATicketReference;
                this.updatePopup.reference = data.ReviewAction_id;
                this.showUpdateModal(true);
            },
            selectAction(val){
                this.selectedAction = val;
            },
            fetchList(){
                fetchActionList().then(
                    (res) => {
                        this.actionList = res.data;
                    });
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            showSuccessModal() {
                this.successModal.visible = true;
            },
            hideSuccessModal() {
                this.successModal.visible = false;
                this.successModal.message = '';
            },
            markAsComplete(){
                if (this.validateSelectedLength(1)) {
                    this.showLoader();
                    const data ={
                        TicketReference: this.ticket.TicketReference,
                        ReviewAction_id: this.selectedRows[0].ReviewAction_id
                    }
                    markCompleteAction(data).then(
                        (res) => {
                            this.hideLoader();
                            this.successModal.message = res.message;
                            this.showSuccessModal();
                            this.getActionsData();
                        }
                    )
                }
            },
            showActionModal(value){
                this.isVisible = value;
            },
            editAction(){
                if (this.validateSelectedLength(1)) {
                    var rows = this.selectedRows[0];
                    var actionType = this.actionList.filter((action) => {
                                return action.Name == rows.ActionType ? action.id : ''
                            });
                    const editAction = {
                        mode : 2,
                        title: 'Edit Action',
                        reviewAction_id: rows.ReviewAction_id,
                        action:{
                            ActionType: actionType[0].id,
                            ActionBrief:rows.ActionBrief,
                            isAdmin: rows.isAdmin,
                            isDone: rows.isDone,
                            Deadline: rows.Deadline
                        },
                        actiondata:{
                            Narration50: rows.Narration50,
                            Narration: rows.Narration,
                            FeeUSD: rows.FeeUSD,
                            Taxpct: rows.Taxpct,
                            Penality: rows.Penality,
                        }
                    };
                    this.setCurrentAction(editAction);
                    this.showActionModal(true);
                }
            },
            addNewAction(){
                this.setCurrentAction(JSON.parse(JSON.stringify(newAction)))
                this.showActionModal(true);
            },
            setCurrentAction(action){
                this.currentAction = action;
            },
            addAction(){
                this.showLoader();
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;

                const data = {
                    TicketReference: this.ticket.TicketReference,
                    ActionBrief: this.currentAction.action.ActionBrief,
                    ActionType: this.currentAction.action.ActionType
                }
                addActions(data).then(
                    res => {
                        this.showActionModal(false);
                        this.hideLoader();
                        this.successModal.message = res.message;
                        this.showSuccessModal();
                        this.getActionsData();
                    },
                    err => {
                        this.hideLoader();
                    }
                )
            },
            pageChange(page) {
                this.pagination.page = page;
                this.getActionsData()
            },
            sortChange(data) {
                this.sorting.key = data.key;
                this.sorting.order = data.order;
                this.getActionsData()
            },
            getActionsData(){
                this.showLoader();
                getActions({TicketReference:this.ticket.TicketReference}).then(
                    (res) => {
                        this.actions = res.data;
                        this.$emit('actionList',res.data);
                        this.hideLoader();
                    }
                )
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
    .popupRow {
        padding: 5px 0 15px;
    }


</style>