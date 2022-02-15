<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="My Tasks" slot="title" link="/help/53" />
        
        <ValidationObserver ref="validator" >
            <div :class="$style.filter">
                <div :class="$style.filterItem">
                    <FormSelect label="Select Status" :width="200" :items="filtering.statuses" item-name="name" item-value="id" v-model="filtering.statusSelected" />
                </div>
                <div :class="$style.filterItem">
                    <FormSelect :width="100" label="Entity Type" :items="filtering.entityTypes" item-name="longName" item-value="Name" v-model="filtering.entityTypeSelected"  />
                </div>
                <div :class="$style.filterItem">
                    <FormAutoComplete v-model="filtering.ICSPSelectedName"
                        :onSearch="searchICSP"
                        :onSelect="selectICSP"
                        :onClear="clearICSP"
                        label="Licensee"
                        item-name="name"
                        item-value="name"
                        :clearable="true"
                        :items="filtering.ICSPResultsFiltered" />
                </div>
                <div :class="$style.filterItem">
                    <FormSelect :width="200" label="Process" :items="filtering.processTypes" item-name="Name" item-value="id" v-model="filtering.processTypeSelected" />
                </div>
                <div :class="$style.filterItem" v-if="filtering.processTypeSelected">
                    <FormSelect :width="200" label="SubProcess" :items="filtering.processNames" item-name="Name" item-value="id" v-model="filtering.processNameSelected" />
                </div>
                <br>
                <div :class="$style.filterItem">
                    <InputText v-model="filtering.ticketReference" style="width: 200px" label="Reference #" rules="alphaNumCustom" />
                </div>
                <div :class="$style.filterItem" >
                    <FormSelect :width="200" label="Allocated To" :items="allocatingUsers" item-name="EmployeeName" item-value="id" v-model="filtering.AllocatedTo_id" />
                </div>
                <div :class="$style.filterItem">
                    <InputDate style="width: 200px" label="Select Date Range" type="daterange" v-model="filtering.dates" />
                </div>
                <FormButton style="margin-top: 5px" type="primary" @click="search" :rounded="true">
                    <Icon type="ios-search" />
                </FormButton>
            </div>
        </ValidationObserver>
        <br />
        <DataTable :actions="true"
            :data="tasksList"
            :columns="tableConfig"
            :is-loading="isLoading"
            @on-selection-change="selectChange"
            @on-page-change="pageChange"
            :pagination="pagination"
            @on-sort-change="sortChange">
            <template slot="actionsLeft">
                <!-- <TableButton @click="selfAssign"  >
                    <img src="../../../assets/images/assignment-icon-small.png" alt="">
                    Process
                </TableButton> -->
                <TableButton v-if="userData !== null && userData.is_manager === true "  @click="allocateOpen()">
                    <img src="../../../assets/images/allocate-icon-small.png" alt="">
                    Allocate
                </TableButton>
                <TableButton @click="openDispatch" >
                    <img src="../../../assets/images/Dispatch.png" alt="">
                    Dispatch
                </TableButton>
                <TableButton @click="openSignee" v-if="userData !== null && (userData.is_manager || userData.is_Department_head || userData.is_Director)">
                    <img src="../../../assets/images/Dispatch.png" alt="">
                    Final Response
                </TableButton>
            </template>
            <!-- <template slot="actionsRight">
                    
                <TableButton @click="exportEx()" >
                    <img src="../../../assets/images/Excel_Icon.png" alt="">
                    Export Excel
                </TableButton>
            </template> -->
        </DataTable>
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
        <Popup title="View Attachment" :value="dispatchPopup" width="700" @close="() => dispatchPopup = false">
            <div :class="$style.popupRow">
                <InputText label="From Email" :readonly="true" v-model="viewAttachData.FromEmail" :maxlength="200" />
            </div>
            <div :class="$style.popupRow">
                <InputText label="To " :readonly="true" v-model="viewAttachData.toemail" :maxlength="200" />
            </div>
            <div :class="$style.popupRow">
                <InputText label="Subject" :readonly="true" v-model="viewAttachData.subject" :maxlength="200" />
            </div>
            <FormRow>
                <Loader v-if="!viewAttachData.Body" />
                <div class="col-sm-12" v-else>
                    <EditorComponent v-model="viewAttachData.Body" />
                </div>
            </FormRow>
            <div :class="$style.popupRow" v-if="viewAttachData.ScannedJson">
                <div v-for="(file,index) in scannedData({val:viewAttachData.ScannedJson})" :key="index">
                    <a :href="file.ScannedfileURL" target="blank"> {{file.Filenameprefix}} </a>
                </div>
            </div>
            <FormButton @click="sendPrint()">Send</FormButton>
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
        <Popup title="Success" type="success" :value="forwardUserPopup" :mask-closable="false" :closable="true">
            Selected ticket was successfully forwarded!
        </Popup>
        <Popup title="Success" type="success" :value="showMessage.isVisible" @close="() => showMessage.isVisible = false"  :closable="true">
            {{ showMessage.message }}
        </Popup>

        <Popup title="Select Signee" type="info" :value="signeeModal.visible" @close="() => signeeModal.visible = false"  :closable="true">
            <FormSelect  label="Select Signee" :items="signeeList"  item-name="Fname" item-value="id" v-model="signee_id"   />
            <div slot="footer">
                <FormButton  type="success" @click="genFinalResponse">Confirm</FormButton>
                <FormButton  @click="() => signeeModal.visible = false">Cancel</FormButton>
            </div>
        </Popup>
    </FormWrapper>
</template>

<script>

    const DEFAULT_STATUS = 42;
    import FormWrapper from 'Components/form/FormWrapper';
    import FormAutoComplete from 'Components/form/FormAutoComplete';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable'
    import loadingMixin from 'Mixins/loadingMixin'
    import { getTasks, getStatuses, getProcessTypes, getEntityType, getProcesses, searchICSPTypes, viewSignedAttachment, assignTicket, SelfAssignTicket, closeticket, exportexcel, assignMultipleTicket, getSigneeList, generateFinalResponse  } from './config/api'
    import tableConfig from './config/table'
    import viewAttach from './config/viewAttach'
    import InputDate from 'Components/form/InputDate';
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import { ValidationObserver } from 'vee-validate'

    export default {
        name: "TicketsList",
        mixins: [loadingMixin,validateSelectedRows],
        components: {
            FormAutoComplete,
            InputDate,
            FormWrapper,
            DataTable,
            PageTitle,
            ValidationObserver
        },
        data() {
            return {
                isModalVisible: false,
                filtering: {
                    statuses: [],
                    statusSelected: '',
                    entityTypes: [],
                    entityTypeSelected: null,
                    ticketReference: '',
                    processTypes: [],
                    processTypeSelected: null,
                    processNames: [],
                    processNameSelected: null,
                    dates: '',
                    isRFI: false,
                    ICSPResults: [],
                    ICSPResultsFiltered: [],
                    ICSPSelectedID: null,
                    ICSPSelectedName: '',
                    AllocatedTo_id: '',
                },
                sorting: {
                    key: 'Deadline',
                    order: 'asc'
                },
                pagination: {
                    perPage: 10,
                    page: 1,
                    total: 0
                },
                tableConfig,
                tableData: [],
                tasksList: [],
                dispatchPopup: false,
                selectedRows:[],
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
                buttonToShow: '',
                viewAttach,
                viewAttachData: [],
                signeeList: [],
                signeeModal: {
                    visible: false
                },
                signee_id: null,
                showEmailPage: false,
                emailData: []
            }
        },
        computed: {
          userData() {
              return this.$store.state.user.user
            },
            allocatingUsers() {
                return this.$store.state.ticket.allocatingUsers;
            },
            forwardingUsersIsLoading() {
                return this.$store.state.ticket.forwardingUsersIsLoading;
            },
            
        },
        watch: {
            '$route': function (newValue) {
                this.parseUrlForValues();
                this.checkIncorporationParams();
                this.getDataByFilter();
            },
            'filtering.processTypeSelected': function (newValue) {
                if (newValue) {
                    this.showLoader();
                    getProcesses({ProcessType_id: newValue}).then(res => {
                        this.hideLoader();
                        this.filtering.processNames = res.data
                    }).catch(this.hideLoader)
                }
                if(newValue == undefined){
                    this.filtering.processNameSelected = null;
                }
            },
            'filtering.ICSPSelectedName': function (val) {
                if (val === ''){
                    this.filtering.ICSPSelectedID = null;
                    this.filtering.ICSPResultsFiltered = null;
                }
            }
            
        },
        
        beforeRouteLeave (to, from, next) {
            
            if(to.name === 'task' && from.name === "tasks"){
                localStorage.setItem('tasks',JSON.stringify(this.filtering));
            }
            next();
        },
        beforeRouteEnter (to, from, next) {
            var self = this;
            if(from.name !== 'task' && to.name === "tasks" && localStorage.tasks){
                localStorage.removeItem('tasks');
            }
            next();
        },
        created() {
            this.getFilterValues();
            this.parseUrlForValues();
            this.checkIncorporationParams();
            if( this.$route.name === "tasks" && localStorage.tasks){
                var localName = localStorage.getItem('tasks');
                this.filtering = JSON.parse(localName);
                this.getDataByFilter();
            }
            else{
                this.getDataByFilter();

            }
            this.$store.dispatch('fetchAllocatingUsers');
        },
        methods: {
            genFinalResponse() {
                this.signeeModal.visible = false;
                setTimeout(() => {
                    this.$router.push(`/tasks/${this.selectedRows[0].TicketReference}/finalDecision/${this.signee_id}`)
                },300);
            },
            openSignee() {
                if (this.validateSelectedLength(1)) {
                    if(this.selectedRows[0].TaskStatus_id == 115){
                     
                        this.getSignee();
                        this.signeeModal.visible = true;
                           
                    }
                    else{
                        this.warningModal.message = "Decision must be taken before final resposne.";
                        this.warningModal.visible = true;
                    }
                }
            },
            getSignee() {
                this.showLoader();
                getSigneeList().then(
                    res => {
                        this.signeeList = res.data;
                        this.hideLoader();
                    }
                )
            },
            exportEx(){
                exportexcel({task_data: this.tasksList}).then(
                    res => {
                        window.open(res.data.url, '_blank');
                    }
                )
            },
            scannedData({val}){
                return JSON.parse(val);
            },
            sendPrint(){
                this.showLoader();
                closeticket({TicketReference: this.selectedRows[0].TicketReference}).then(
                    res => {
                        if(res.status === true){
                            this.dispatchPopup = false;
                            this.showMessage.message = res.message;
                            this.showMessage.isVisible = true;
                            this.getDataByFilter();
                            this.hideLoader();
                        }else{
                            this.warningModal.message = res.message;
                            this.warningModal.visible = true;
                            this.hideLoader();
                        }
                    }
                );
            },
            attachmentsData(val){
                var arr = val.split(',');
                var attach='';
                for(var i = 0; i < arr.length; i++){
                    attach = attach + "<a href='" + arr[i] + "' target='blank'> View Attachment " + (i +1) + " </a><br />";
                }
                return attach;
            },
            selfAssign(){
                if (this.validateSelectedLength(1)) {
                    const taskId = this.selectedRows[0].TaskStatus_id;
                    if(taskId === 42 || taskId === 40 || taskId === 114 || taskId === 112 ){
                        this.showLoader();
                        SelfAssignTicket({TicketReference: this.selectedRows[0].TicketReference}).then(
                            res => {
                                if(res.status === true){
                                    this.showMessage.message = res.message;
                                    this.showMessage.isVisible = true;
                                    this.getDataByFilter();
                                    this.hideLoader();
                                }else{
                                    this.warningModal.message = res.message;
                                    this.warningModal.visible = true;
                                    this.hideLoader();
                                }
                            },
                            err =>{
                                this.hideLoader();
                            }
                        )
                    }else{
                        this.showWarningModal(true);
                        this.warningModal.message = "Following action cannot be performed on this ticket";

                    }
                }
                
            },
            forwardTicketHandler() {
                this.errors.userToForward = this.isTicketForwarded && !this.userToForward;
                if (!this.errors.userToForward) {
                    this.$store.commit('setForwardingUsersLoader', true);
                    const idString = this.selectedRows.map(row => row.AdminTask_id).join(',');
                    const data = {
                        idString ,
                        AssignTo: this.userToForward,
                    }
                    assignMultipleTicket(data)
                    .then(res => {
                        this.$store.commit('setForwardingUsersLoader', false);
                        this.getDataByFilter();
                        this.allocatePopup = false;
                        this.forwardUserPopup = true;
                    },
                    err=>{
                        this.$store.commit('setForwardingUsersLoader', false);
                        this.allocatePopup = false;

                    }).catch(() => {
                        this.$store.commit('setForwardingUsersLoader', false);
                    })
                }
            },
            allocateOpen(){
                this.isTicketForwarded = true;
                if (this.validateSelectedLength()) {
                    var rows = this.selectedRows[0];
                    const data = {
                        process_id: rows.Process_id,
                        reference_id: rows.Reference_id
                    }
                    this.allocate = data;
                    this.$store.dispatch('fetchAllocatingUsers', data);
                    this.allocatePopup = true;
                }
                // if (this.validateSelectedLength(1)) {
                    
                //     const taskId = this.selectedRows[0].TaskStatus_id;
                //     if(taskId === 42 || taskId === 40 || taskId === 114 || taskId === 112 ){
                //         var rows = this.selectedRows[0];
                //         const data = {
                //             process_id: rows.Process_id,
                //             reference_id: rows.Reference_id
                //         }
                //         this.allocate = data;
                //         this.$store.dispatch('fetchAllocatingUsers', data);
                //         this.allocatePopup = true;
                        
                //     }else{
                //         this.showWarningModal(true);
                //         this.warningModal.message = "Following action cannot be performed on this ticket";

                //     }
                // }
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            openDispatch() {
                if (this.validateSelectedLength(1)) {

                    const taskId = this.selectedRows[0].TaskStatus_id;
                    if(taskId === 92 ){

                        this.showLoader();
                        viewSignedAttachment({
                            TicketReference: this.selectedRows[0].TicketReference
                        }).then(
                            (res) => {
                                this.viewAttachData = res.data[0];
                                this.dispatchPopup = true;
                                this.hideLoader();
                            }
                        )
                       
                    }else{
                        this.showWarningModal(true);
                        this.warningModal.message = "Following action cannot be performed on this ticket";

                    }

                }
            },
            parseUrlForValues() {
                const mapping = {
                    process_type: 'processTypeSelected',
                    process_id: 'processNameSelected'
                };
                const { query } = this.$route;
                Object.keys(query).forEach(item => {
                    if (query[item] && mapping[item]) {
                        this.filtering[mapping[item]] = +query[item]
                    }
                })
            },
            checkIncorporationParams(){
                if(this.$route.params.process && this.$route.params.subProcess){
                    this.filtering.processTypeSelected = +this.$route.params.process;
                    this.filtering.processNameSelected = +this.$route.params.subProcess;
                }
            },
            clearICSP(){
                this.filtering.ICSPSelectedID = null;
                this.filtering.ICSPResultsFiltered = null;
            },
            selectICSP(name) {
                this.filtering.ICSPSelectedID = this.filtering.ICSPResultsFiltered.find(item => item.name === name).id;
            },
            searchICSP(value) {
                if (value.length > 2) {
                    this.filtering.ICSPResultsFiltered = this.filtering.ICSPResults.filter(item => {
                        return item.name !== null ? item.name.toLowerCase().includes(value.toLowerCase()) : null;
                    })
                } else {
                    this.filtering.ICSPResultsFiltered = []
                }
                if(value === ''){
                    this.filtering.ICSPSelectedID = null;
                }
            },
            getFilterValues() {
                this.showLoader();
                Promise.all([
                    getStatuses(),
                    getEntityType(),
                    getProcessTypes(),
                    searchICSPTypes({department_id: this.userData.department_id})
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.filtering.statuses = response[0].data[0];
                this.filtering.entityTypes = response[1].data;
                this.filtering.processTypes = response[2].data;
                this.filtering.ICSPResults = response[3].data;
            },
            sortChange(data) {
                this.sorting.key = data.key;
                this.sorting.order = data.order;
                this.getDataByFilter()
            },
            search(){
                this.pagination.page = 1;
                this.getDataByFilter()
            },
            getDataByFilter() {
                setTimeout(() => {
                    this.$refs.validator.validate().then((result) => {
                        if (result ) {
                            this.showLoader();
                            const { key, order } = this.sorting;
                            const { perPage, page } = this.pagination;

                            const filters = {};

                            // Ignore other filters if we have ticket reference
                            if (this.filtering.ticketReference) {
                                filters.TicketReference = this.filtering.ticketReference
                            } else {
                                filters.status_id = this.filtering.statusSelected;
                                filters.DateFrom = this.filtering.dates[0];
                                filters.DateTo = this.filtering.dates[1];
                                filters.isRFI = this.filtering.isRFI;
                                filters.process_type = this.filtering.processTypeSelected;
                                filters.process_id = this.filtering.processNameSelected;
                                filters.Icsp_id = this.filtering.ICSPSelectedID;
                                filters.entityType = this.filtering.entityTypeSelected;
                                filters.AllocatedTo_id = this.filtering.AllocatedTo_id;
                                filters.processtype_id = this.filtering.processTypeSelected;
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
                            getTasks(data)
                                .then(this.handleResponse)
                                .catch(this.handleError)
                        }
                    })
                },
                50
                )
            },
            pageChange(page) {
                this.pagination.page = page;
                this.getDataByFilter()
            },
            handleResponse(response) {
                this.hideLoader();
                this.tasksList = response.data[0];
                this.pagination.total = response.NumberOfRecords;
                this.buttonToShow = this.filtering.statusSelected;
            },
        }
    }
</script>

<style lang="scss" module>

    .popupRow {
        padding: 5px 0 15px;
    }
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
