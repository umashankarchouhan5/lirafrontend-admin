<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Notices" slot="title" />
      
        <div :class="$style.filter">
            <div :class="$style.filterItem">
                <FormSelect :width="200" label="Select Status" :items="filtering.statusses" item-name="name" item-value="id" v-model="filtering.status_id"  />
            </div> 
            <div :class="$style.filterItem">
                <FormSelect :width="200" label="Notice Type" :items="filtering.notices" item-name="Name" item-value="id" v-model="filtering.notice_id"  />
            </div> 
            <div :class="$style.filterItem">
                <InputDate style="width: 200px" label="Select Date Range" type="daterange" v-model="filtering.dates" />
            </div>
            <div :class="$style.filterItemMedium">
                <div :class="$style.checkbox">
                    <FormCheckbox name="IS_Ag" v-model="filtering.isAG">
                        <span :class="$style.checkboxText">IS AG</span>
                    </FormCheckbox>
                </div>
            </div>
        <!-- </div>
        <div :class="$style.filter"> -->
            <div :class="$style.filterItemSmall">
                <FormButton style="margin-top: 5px" type="primary" @click="search" :rounded="true">
                    <Icon type="ios-search" />
                </FormButton>
            </div>
        </div>
        <DataTable :actions="true"
            :data="noticeList"
            :columns="tableColumn"
            :is-loading="isLoading"
            @on-selection-change="selectChange"
            @on-page-change="pageChange"
            :pagination="pagination"
            @on-sort-change="sortChange">
            
            <template slot="actionsLeft">
                <TableButton @click="addNotice">
                    <img src="../../../../assets/images/plus.png" alt="">
                    Add
                </TableButton>
                <TableButton @click="viewNotice">
                    <img src="../../../../assets/images/eye.png" alt="">
                    View
                </TableButton>
                <TableButton @click="openDispatch">
                    <img src="../../../../assets/images/Dispatch.png" alt="">
                    Dispatch
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
        <Popup title="Success" type="success" :value="successModal.isVisible" @close="() => successModal.isVisible = false"  :closable="true">
            {{ successModal.message }}
        </Popup>
        <Popup title="View Attachment" :value="viewPopup" width="700" @close="() => viewPopup = false">
            <!-- <div :class="$style.popupRow">
                <InputText label="From Email" :readonly="true" v-model="viewAttachData.FromEmail" :maxlength="200" />
            </div> -->
            <div :class="$style.popupRow">
                <InputText label="To " :readonly="true" v-model="viewAttachData.toEmail" :maxlength="200" />
            </div>
            <div :class="$style.popupRow">
                <InputText label="Subject" :readonly="true" v-model="viewAttachData.Subject" :maxlength="200" />
            </div>
            <FormRow>
                <Loader v-if="!viewAttachData.body" />
                <div class="col-sm-12" v-else>
                    <EditorComponent  readonly v-model="viewAttachData.body" />
                </div>
            </FormRow>
            <div :class="$style.popupRow" v-if="viewAttachData.ScannedJson">
                <div v-for="(file,index) in scannedData({val:viewAttachData.ScannedJson})" :key="index">
                    <a :href="file.ScannedfileURL" target="blank"> {{file.Filenameprefix}} </a>
                </div>
            </div>
            <!-- <FormButton @click="sendPrint()">Send</FormButton> -->
        </Popup>
        <Popup title="Dispatch Attachment" :value="dispatchPopup" width="700" @close="() => dispatchPopup = false">
            <div :class="$style.popupRow">
                <InputText label="To " :readonly="true" v-model="viewAttachData.toEmail" :maxlength="200" />
            </div>
            <div :class="$style.popupRow">
                <InputText label="Subject" :readonly="true" v-model="viewAttachData.Subject" :maxlength="200" />
            </div>
            <FormRow>
                <Loader v-if="!viewAttachData.body" />
                <div class="col-sm-12" v-else>
                    <EditorComponent v-model="viewAttachData.body" />
                </div>
            </FormRow>
            <div :class="$style.popupRow" v-if="viewAttachData.ScannedJson">
                <div v-for="(file,index) in scannedData({val:viewAttachData.ScannedJson})" :key="index">
                    <a :href="file.ScannedfileURL" target="blank"> {{file.Filenameprefix}} </a>
                </div>
            </div>
            
            <FormButton @click="sendPrint()">Send</FormButton>
        </Popup>

    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import InputDate from 'Components/form/InputDate';
    import tableColumn from './table';
    import loadingMixin from 'Mixins/loadingMixin';
    import {  getNoticeList, getNoticeTypebyDepartment, getCompanyStatusList, sendNotice, fetchNoticeById } from '../api';

    export default {
        name: "NoticeList",
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle,
            DataTable,
            InputDate,
        },
        data() {
            return {
                filtering: {
                    notice_id: null,
                    notices: [],
                    isAG: null,
                    dates: '',
                    department_id: null,
                    reason_id: null,
                    reasons: [],
                    statusses: [],
                    status_id: null,

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
                lockModal: {
                    visible: false,
                },
                successModal: {
                    isVisible: false,
                    message: '',
                },
                tableData: [],
                noticeList: [],
                tableColumn,
                selectedRows: [],
                companies: [],
                isSelected: false,
                dispatchPopup: false,
                viewPopup: false,
                viewAttachData: [],
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        created() {
          this.getFilterValues();
          this.getDataByFilter();
        },
        watch: {
        },
        methods: {
            scannedData({val}){
                return JSON.parse(val);
            },
            sendPrint() {
                var row = this.selectedRows[0];
                const { companyJson, body, Subject, toEmail, emailtemplate_id, toWebuser_id, attachment, fsaref } = this.viewAttachData;
                const data = {
                    notice_id: row.noticeReference_id,
                    companyJson,
                    body,
                    subject: Subject,
                    toEmail,
                    toWebuser_id,
                    emailTemplate_id: emailtemplate_id, 
                    fsaref,
                    attachment
                }
                sendNotice(data).then(
                    res => {
                        this.dispatchPopup = false;
                        this.successModal.message = res.message;
                        this.successModal.isVisible = true;
                    }
                )
            },
            openDispatch(){
                if(this.validateSelectedLength(1)){
                    var row = this.selectedRows[0];
                    if(row.Status_id == 92){
                        fetchNoticeById({notice_id: row.noticeReference_id}).then(
                            res => {
                                this.viewAttachData = res.data[0];
                                this.dispatchPopup = true;
                            }
                        )
                    }
                    else{
                        this.warningModal.message = "Selected notice has not been returned from print queue yet.";
                        this.warningModal.visible = true;
                    }
                }
            },
            viewNotice(){
                if(this.validateSelectedLength(1)){
                    var row = this.selectedRows[0];
                    fetchNoticeById({notice_id: row.noticeReference_id}).then(
                        res => {
                            this.viewAttachData = res.data[0];
                            this.viewPopup = true;
                        }
                    )
                }
            },
            showLockModal(val){
                this.lockModal.visible = val;
            },
            lock() {
                if(this.validateSelectedLength(1)){
                    var row = this.selectedRows[0];
                    if(row.isLocked !== 1){
                        this.showLockModal(true);
                    }
                    else{
                        this.warningModal.message = 'You cannot change a locked plan.';
                        this.showWarningModal(true);
                    }
                }
            },  
            addNotice(){
                this.$router.push('/noticeForm');
            },
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            getFilterValues() {
                this.showLoader();
                Promise.all([
                    getNoticeTypebyDepartment({department_id: this.userData.department_id}),
                    getCompanyStatusList()
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.filtering.notices = response[0].data[0];
                this.filtering.statusses = response[1].data;
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

                filters.department_id = this.userData.department_id;
                filters.status_id = this.filtering.status_id;
                filters.notice_id = this.filtering.notice_id;
                filters.reason_id = this.filtering.reason_id;
                filters.isAG = this.filtering.isAG;
                filters.DateFrom = this.filtering.dates[0];
                filters.DateTo = this.filtering.dates[1];

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
                getNoticeList(data)
                    .then(this.handleResponse)
                    .catch(this.handleError)
            },
            handleResponse(response) {
                this.hideLoader();
                this.noticeList = response.data[0];
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
                    let Documentcode = this.selectedRows[0].id; // allow only the first row
                    if( mode== 'edit' ){ // edit is clicked
                        this.$router.push({ path: `/DocumentMasters/edit/${Documentcode}` })
                    }else if( mode== 'del' ){
                        this.$router.push({ path: `/DocumentMasters/del/${Documentcode}` })
                    }else if( mode== 'view' ){
                        this.$router.push({ path: `/DocumentMasters/view/${Documentcode}` })
                    }
                }
            },
            addNew() {
                this.$router.push({ path: `/DocumentMasters/add` })
            },

        }
    }
</script>

<style lang="scss" module>

    .filter {
        margin: -10px 0 25px;
        display: flex;
        align-items: flex-end;
    }

    .filterItem {
        flex: 0 0 180px;
        margin-right: 20px;
    }
    .filterItemMedium {
        flex: 0 0 100px;
        margin-right: 20px;
    }
    .filterItemSmall {
        flex: 0 0 50px;
        margin-right: 20px;
    }

    .popupRow {
        padding: 5px 0 15px;
    }
    
    .checkbox {
        margin-bottom: 10px;
    }
    
    .checkboxText{
        text-align: justify;
        font-size: 14px;
        color: #555;
    }



</style>
