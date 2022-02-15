<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Name Reservation" slot="title" />
         <div :class="$style.filter">
            <div :class="$style.filterItem">
                <FormSelect :width="200" label="Entity Type" :items="filtering.entityTypes" item-name="Name" item-value="Name" v-model="filtering.entityTypeSelected"  />
            </div>
            <div :class="$style.filterItem">
                <FormAutoComplete v-model="filtering.ICSPSelectedName"
                    :onSearch="searchICSP"
                    :onSelect="selectICSP"
                    :onClear="clearICSP"
                    label="Service Provider"
                    item-name="name"
                    item-value="name"
                    :clearable="true"
                    :items="filtering.ICSPResultsFiltered" />
            </div>
            <div :class="$style.filterItem">
                <FormButton style="margin-top: 5px" type="primary" @click="search" :rounded="true">
                    <Icon type="ios-search" />
                </FormButton>
            </div>
        </div>
        <DataTable :actions="true"
                   :data="nameList"
                   :columns="tableColumn"
                   :is-loading="isLoading"
                   @on-selection-change="selectChange"
                   @on-page-change="pageChange"
                   :pagination="pagination"
                   @on-sort-change="sortChange">
            <template slot="actionsLeft">
                <TableButton @click="() => processBatch()">
                    <img src="../../../../assets/images/edit.png" />
                    Process
                </TableButton>
                <!-- <TableButton @click="() => generateLetter()">
                    <img src="../../../../assets/images/mail.png" />
                    Generate Letter
                </TableButton> -->
                
                <TableButton @click="() => reassignOpen()">
                    <img src="../../../../assets/images/skip.png" />
                    ReAssign
                </TableButton>
            </template>
        </DataTable>
        
<!-- Email Popup -->
        <Popup title="Email to Send" width="1000" :value="emailModal.visible" :mask-closable="false" :closable="true" @close="() => showEmailModal(false)">

            <div :class="$style.popupRow">
                <InputText label="To " :readonly="true" v-model="emailData.ToEmail" :maxlength="200" />
            </div>
            <div :class="$style.popupRow">
                <InputText label="CC"  v-model="emailData.CC" :maxlength="200" />
            </div>
            <div :class="$style.popupRow">
                <InputText label="Subject" :readonly="true" v-model="emailData.EmailSubject" :maxlength="200" />
            </div>
            <FormRow>
                <Loader v-if="!emailData.EmailBody" />
                <div class="col-sm-12" v-else>
                    <EditorComponent v-model="emailData.EmailBody" />
                </div>
            </FormRow>
                <FormRow v-if="emailData.Attachmentjson && emailData.Attachmentjson !== null">
                    <div class="col-sm-12" v-for="(file,ind) in parseAttachment(emailData.Attachmentjson)" :key="ind" >
                        <a @click="openWindow(file.HTMLBody)">{{file.FileNamePrefix}}</a>
                    </div>
                </FormRow>
            <div slot="footer">
                <FormButton left-icon="ios-send" @click="() => sendEmail()">Send</FormButton>
                <FormButton  @click="() => showEmailModal(false)">Close</FormButton>
            </div>
        </Popup>
        <!-- Allocate Popup -->
        <Popup title="ReAssign" width="700" :value="allocatePopup" @close="allocatePopup = false">
            <ValidationObserver ref="allocationValidator" v-if="allocatePopup" >
                <FormRow >
                    <div class="col-sm-4">
                        <FormSelect v-model="userToForward" rules="required" :items="adminUsers" item-name="Name" item-value="id" name="Admin User" />
                    </div>
                    <div class="col-sm-4">
                        <FormButton @click="reassign" >ReAssign</FormButton>
                    </div>
                </FormRow>
            </ValidationObserver>
        </Popup>

<!-- Message popup -->
        <Popup title="Information" :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.cancel" @click="() => showWarningModal(false)">Cancel</FormButton>
                <FormButton v-if="warningModal.buttons.confirm" type="success" @click="confirmDelete">Confirm</FormButton>
                <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
            </div>
        </Popup>
        <Popup title="Success" type="success" :value="modalSuccess.visible" @close="() => showSuccessModal(false)">
            {{ modalSuccess.message }}
            <div slot="footer">
                <FormButton  @click="() => showSuccessModal(false)">Ok</FormButton>
            </div>
        </Popup>
        <Popup title="Success" type="success" :value="emailSend.popupVisible" @close="() => emailSend.popupVisible = false" >
            {{ emailSend.message }}
            <FormButton slot="footer" @click="() => emailSend.popupVisible = false">Close</FormButton>
        </Popup>

    </FormWrapper>
</template>

<script>
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import FormAutoComplete from 'Components/form/FormAutoComplete';
    import tableColumn from './table';
    import loadingMixin from 'Mixins/loadingMixin';
    import { ValidationObserver } from "vee-validate";
    import { getEntityType, searchICSPTypes, getNameReservationBatchList, generateLetter, sendLetter, updateBatchAdminUser, getAdminUserList } from '../api';

    export default {
        name: "NameReservation",
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle,
            DataTable,
            FormAutoComplete,
            ValidationObserver,
        },
        data() {
            return {
                filtering: {
                    entityTypes: [],
                    entityTypeSelected: null,
                    ICSPResults: [],
                    ICSPResultsFiltered: [],
                    ICSPSelectedID: null,
                    ICSPSelectedName: '',
                    batch_id: null,
                },
                queue:{
                    TicketReference: null,
                    StationeryType: null,
                    documentToPrint: null,
                },
                sorting: {
                    key: 'id',
                    order: 'asc'
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
                modalSuccess: {
                    visible: false,
                    message: '',
                    TicketReference: null,
                },
                nameList: [],
                tableData: [],
                tableColumn,
                docList: [],
                upList: [],
                selectedRows: null,
                error:{
                    areAllUploaded: false
                } ,
                entities: [],
                icspFiltered: [],
                changedFileName: '',
                emailData: {},
                emailSend: {
                    popupVisible: false,
                    message: ''
                },
                emailModal: {
                    visible: false,
                },
                userToForward: null,
                allocatePopup: false,
                adminUsers: [],
            }
        },
        created() {
            this.getFilterValues();
            this.getDataByFilter();
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
        },
        methods: {
            reassignOpen() {
                this.allocatePopup = true;
            },
            reassign(){
                if(this.validateSelectedLength(1)){
                    this.$refs.allocationValidator.validate().then((result) => {
                        if(result){
                            const row = this.selectedRows[0];
                            const data = {
                                batch_id: row.batch_id,
                                admin_id: this.userToForward
                            }
                            updateBatchAdminUser(data).then(
                                res => {
                                    this.getDataByFilter();
                                    this.allocatePopup = false;
                                }
                            )
                        }
                    })
                }
            },
            openWindow(val){
                var myWindow=window.open('','','width=700,height=900');
                myWindow.document.write(val);
            },
            parseAttachment(val){
                return JSON.parse(val);
            },
            
            sendEmail(){
                const data ={
                    Subject: this.emailData.EmailSubject,
                    body: this.emailData.EmailBody,
                    Toemail: this.emailData.ToEmail,
                    CC: this.emailData.CC,
                    EmailTemplate_id: this.emailData.Emailtemplate_id,
                    BatchId: this.selectedRows[0].batch_id,
                    process_id: 101,
                    attachment: this.emailData.Attachmentjson
                }
                sendLetter(data).then(
                    res=> {
                        this.emailSend.message = res.message;
                        this.emailSend.popupVisible = true;
                        this.showEmailModal(false);
                        this.getDataByFilter();
                    }
                )
            },
            showEmailModal(val){
                this.emailModal.visible = val;
            },
            generateLetter(){
                if(this.validateSelectedLength(1)){
                    const row = this.selectedRows[0];
                    if(row.CountProcessed == row.CountSubmitted){
                        const data = {
                            BatchId: row.batch_id,
                        }
                        generateLetter(data).then(
                            res=> {
                                this.emailData = res.data;
                                this.showEmailModal(true);
                            }
                        )
                    }
                    else{
                        this.warningModal.message = 'Not all names from the request are in the list for reservation.';
                        this.showWarningModal(true);
                    }
                }

            },
            processBatch(){
                if(this.validateSelectedLength(1)){
                    const row = this.selectedRows[0];
                    this.$router.push(`/nameReservation/Batch/${row.batch_id}`);
                    
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
                        return item.name !== null ? item.name.toLowerCase().includes(value.toLowerCase()) : false;
                    })
                } else {
                    this.filtering.ICSPResultsFiltered = []
                }
            },
            showSuccessModal(val){
                this.modalSuccess.visible = val;
            },
            
            getFilterValues() {
                this.showLoader();
                const data = {
                    user_id: this.userData.user_id,
                    filterjson: {
                        filter: [{Department_id: this.userData.department_id}],
                        sort: [{ key: 'id', order: 'desc' }],
                        paging: [
                            {
                                startindex: 1,
                                pagesize: 30
                            }
                        ]
                    }
                };
                Promise.all([
                    getEntityType(),
                    searchICSPTypes({is_csp: true}),
                    getAdminUserList(data)
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.filtering.entityTypes = response[0].data;
                this.filtering.ICSPResults = response[1].data;
                this.adminUsers = response[2].data[0];
            },
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
                const { perPage, page } = this.pagination;

                const filters = {};
                
                filters.icsp_id = this.filtering.ICSPSelectedID;
                filters.EntityType = this.filtering.entityTypeSelected;

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
                getNameReservationBatchList(data)
                    .then(this.handleResponse)
                    .catch(this.handleError)
            },
            handleResponse(response) {
                this.hideLoader();
                if(response.can !== undefined && response.can === 0){
                    this.$router.push('/unauthorize')
                }
                else{
                    this.nameList = response.data;
                    this.pagination.total = response.NumberOfRecords;

                }
            },
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            validateSelectedLength(value) {
                if ( this.selectedRows == null || this.selectedRows.length === 0 ) {
                    this.warningModal.message = 'Select at least one row!';
                    this.showWarningModal(true);
                    return false
                }
                if (this.selectedRows.length === value) {
                    return true;
                }
                if (value === 1 && this.selectedRows.length !== 1) {
                    this.warningModal.message = 'Select one row please.';
                    this.showWarningModal(true);
                    return false
                }
                return true;
            },
            uploadFile(file) {
                this.queue.attachment = file;
            },
            
        }
    }
</script>

<style lang="scss" module>

    .currentEntityFile {
        display: inline-flex;
        align-items: center;
        .icon {
            margin-left: 20px;
            padding: 3px;
            cursor: pointer;
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
    .tablePadding{
        .ivu-table .table-info-row td,.ivu-table td,.ivu-table-cell{
            padding: 10px 0px;
            background-color: #2db7f5;
            color: #fff;
        }
    }
</style>
