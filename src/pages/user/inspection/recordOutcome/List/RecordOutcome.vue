<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Inspection Findings" slot="title" />
        <div v-if="recordOutcome[0]">   
            <TicketHeader v-if="ticketValue" :ticketValue="ticketValue" />
            <FormRow>
                <div class="col-sm-4">
                    <p><b>Team Lead:</b> {{inspectionInfo.teamLead}}</p>
                </div>
                <div class="col-sm-8">
                    <p><b>Office Address:</b> {{ recordOutcome[0].address }}</p>
                </div>
            </FormRow>
        </div>
        <div :class="$style.filter" v-if="$route.name == 'RecordOutcomeList'">
            <div :class="$style.filterItem">
                <FormSelect :width="200" label="Select Status" :items="filtering.statusses" item-name="name" item-value="id" v-model="filtering.status_id"  />
            </div> 
            
            <FormButton style="margin-top: 5px" type="primary" @click="search" :rounded="true">
                <Icon type="ios-search" />
            </FormButton>
        </div>
        <div :class="$style.flexRow">
            <div >
                <!-- <InputText v-model="searchKeyword" label="Search Reg No." /> -->
                <FormSelect :width="200" label="Search Reg No." :items="recordOutcome" item-name="RegNo" item-value="RegNo" v-model="searchKeyword"  />
            </div>
            <div  :class="$style.separateStyle">
                <FormCheckbox v-model="filtering.NCOnly"  name="NonCompliant" :trueValue="1" :falseValue="0" > Get only NonCompliant Entities </FormCheckbox>
            </div>
        </div>
        <DataTable 
            :actions="true"
            :data="searchedList"
            :columns="config"
            :is-loading="isLoading"
            @on-selection-change="selectChange"
            @on-page-change="pageChange"
            :pagination="pagination"
            @on-sort-change="sortChange"
            :rowClassName="rowClassName"
            :noStripe="true"
            :legends="legends"
        >
            
            <template slot="actionsLeft">
                <TableButton @click="openOutcome">
                    <img src="../../../../../assets/images/Update.png" alt="">
                    Update Findings
                </TableButton>
                <!-- <TableButton @click="openNotes">
                    <img src="../../../../../assets/images/edit.png" alt="">
                    Update Compliance Notes
                </TableButton> -->
                <TableButton @click="addToList" v-if="filtering.status_id == 402 && $route.name == 'RecordOutcomeList'">
                    <img src="../../../../../assets/images/plus.png" alt="">
                    Add to List
                </TableButton>
                <TableButton @click="() =>listModal.isVisible = true" v-if="selectedList.length > 0 && filtering.status_id == 402">
                    <img src="../../../../../assets/images/eye.png" alt="">
                    View List
                </TableButton>
            </template>
        </DataTable>
        <Toast v-model="toastVisible">Added to List</Toast>

        <br />
        <FormButton type="primary" @click="backToInspection" left-icon="ios-arrow-back" >Back to Inspection</FormButton>

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
         <Popup title="Compliance Notes" :value="compliantNoteModal.visible" @close="() => showCompliantNoteModal(false)">
             
            <ValidationObserver ref="validator" v-if="compliantNoteModal.visible">
                <FormRow >
                    <div class="col-sm-3" style="maxWidth:150px;width:150px;">
                        <p>Is Compliant</p>
                    </div>
                    <div class="col-sm-6">
                        <InputYesNo v-model="complianceStatus" :Yes="1" :No="0" name="Is Compliant" rules="required" /> 
                    </div>
                </FormRow>
                <InputTextArea v-model="compliantNote" label="Compliance Notes" />
            </ValidationObserver>
            <div slot="footer">
                <FormButton  type="success" @click="bulkUploadNote">Submit
                </FormButton>
                <FormButton  @click="() => showCompliantNoteModal(false)">Cancel
                </FormButton>
            </div>
        </Popup>
        
        <Popup title="Success" type="success" :value="successModal.isVisible" @close="() => successModal.isVisible = false"  :closable="true">
            {{ successModal.message }}
        </Popup>
        <Popup title="Selected List" type="info" width="700" :value="listModal.isVisible" @close="() => listModal.isVisible = false"  :closable="true">
            <DataTable :actions="true"
                :data="selectedList"
                :columns="selectedListTable"
                @on-selection-change="selectChangeNew"
            >
            
                <template slot="actionsLeft">
                    <TableButton @click="openOutcomeBulk">
                        <img src="../../../../../assets/images/edit.png" alt="">
                        Bulk Update Findings
                    </TableButton>
                    <TableButton @click="deleteFromList" >
                        <img src="../../../../../assets/images/del.png" alt="">
                        Delete
                    </TableButton>
                </template>
            </DataTable>
        </Popup>
    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import config from './table';
    import selectedListTable from './selectedListTable';
    import loadingMixin from 'Mixins/loadingMixin';
    import {  getInspectionOutcomeList, bulkUpdateInspectionNotes, getCompanyStatus } from '../../api'
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import { ValidationObserver } from "vee-validate"; 
    import DateUtil from 'Utils/dateUtil' ;

    export default {
        name: "RecordOutcome",
        mixins: [loadingMixin,validateSelectedRows],
        components: {
            FormWrapper,
            PageTitle,
            DataTable,
            ValidationObserver,
        },
        data() {
            return {
                filtering: {
                    inspection_id: '',
                    statusses: [],
                    status_id: null,
                    NCOnly: 0,
                },
                sorting: {
                    key: 'id',
                    order: 'asc'
                },
                pagination: {
                    perPage: 500,
                    page: 1,
                    total: 0
                },
                successModal: {
                    isVisible: false,
                    message: '',
                },
                warningModal: {
                    visible: false,
                    buttons: {
                        ok: true,
                        confirm: false,
                        cancel: false
                    }
                },
                compliantNoteModal: {
                    visible: false,
                },
                compliantNote: '',
                complianceStatus: null,
                tableData: [],
                recordOutcome: [],
                config,
                selectedListTable,
                selectedRows: [],
                idString: '',
                searchKeyword: '',
                ticketValue: null,
                selectedList: [],
                listModal: {
                    isVisible: false,
                },
                inspectionInfo: {},
                selectedRowsNew: [],
                toastVisible: false,
                legends: [
                    {color:'red', text: 'Non Compliant'}
                ]
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
            searchedList() {
                if( this.searchKeyword == undefined || this.searchKeyword.trim() == '' ) {
                    return this.recordOutcome;
                }
                else{
                    return this.recordOutcome.filter( item => {
                        return item.RegNo.match(this.searchKeyword);
                    })
                }
            }
        },
        created() {
            this.filtering.inspection_id = parseInt(this.$route.params.id);

            if(this.$route.name == 'ReinspectionList') this.filtering.NCOnly = 1;
            else this.getFilteredData();
        },
        watch: {
            'filtering.NCOnly': function() {
                this.getDataByFilter();
            }
        },
        methods: {
            rowClassName (row, index) {
                if (row.isCompliant === 0) {
                    return this.$style.classBackground;
                } 
                return '';
            },
            getFilteredData() {
                Promise.all([
                    getCompanyStatus()
                ]).then(this.handleFilterData);
            },
            handleFilterData(response) {
                this.filtering.statusses = response[0].data;
                this.filtering.status_id = 402;
                this.getDataByFilter();
            },
            validateSelectedLengthNew(value) {
                if (this.selectedRowsNew.length === value) {
                    return true;
                }
                if (value === 1 && this.selectedRowsNew.length !== 1) {
                    this.warningModal.message = 'Select one row please.';
                    this.showWarningModal(true);
                    return false
                }
                if (this.selectedRowsNew.length === 0) {
                    this.warningModal.message = 'Select at least one row!';
                    this.showWarningModal(true);
                    return false
                }
                return true;
            },
            deleteFromList() {
                if(this.validateSelectedLengthNew()){
                    var selectedOutcomes = this.selectedRowsNew.map(function(e) { return e.outcome_id; })
                    for(var i = 0 ; i < selectedOutcomes.length ; i++){
                        var index = this.selectedList.map(function(e) { return e.outcome_id; }).indexOf(selectedOutcomes[i]);
                        this.selectedList.splice(index,1)
                    }
                }
            },
            addToList() {
                if(this.validateSelectedLength()){
                    this.arrToPush().then(
                        res => {
                            this.selectedList.push(...res);
                            this.toastVisible = true;
                        }
                    )
                }
            },
            async arrToPush() {
                var arr = this.selectedRows.filter(item => {
                    const checkSimilar = this.selectedList.find(ele => {
                        return ele.company_id == item.company_id
                    })
                    return checkSimilar == undefined;
                })
                return arr
            },
            getDate(val){
                return DateUtil.formatDate(val);
            },
            bulkUploadNote(){
                this.$refs.validator.validate().then(result => {
                    if (result) {
                        const data = {
                            idString: this.idString,
                            notes: this.compliantNote,
                            complianceStatus: this.complianceStatus
                        }
                        bulkUpdateInspectionNotes(data).then(
                            res=> {
                                this.showCompliantNoteModal(false);
                                this.compliantNote = '';
                                this.complianceStatus = null;
                                this.successModal.message = 'Compliance Notes updated.';
                                this.successModal.isVisible = true;
                                this.getDataByFilter();
                            }
                        )
                    }
                })
            },
            openNotes(){
                if(this.validateSelectedLength()){
                    
                    this.idString = this.selectedRows.map(row => row.outcome_id).join(', ');
                    this.showCompliantNoteModal(true);
                }
            },
            showCompliantNoteModal(val){
                this.compliantNoteModal.visible = val;
                this.resetComplianceBox();
            },
            resetComplianceBox(){
                this.compliantNote = '';
                this.complianceStatus = null;
            },
            backToInspection(){
                this.$router.push('/inspection');
            },
            openOutcome(){
                if(this.validateSelectedLength(1)){
                    const row = this.selectedRows[0];
                    const nameString = this.selectedRows[0].CompanyName;
                    localStorage.setItem('finding_company_name_string',nameString);

                    if(this.$route.name == 'ReinspectionList')  this.$router.push(`/reinspectionOutcome/single/${row.inspection_id}/${row.company_id}`);
                    else this.$router.push(`/recordOutcome/single/${row.inspection_id}/${row.company_id}`);

                }
            },
            async openOutcomeBulk(){
                await this.closeBulk();
                const idString = this.selectedList.map(row => row.company_id).join(',');
                const nameString = this.selectedList.map(row => row.CompanyName).join(',');
                localStorage.setItem('finding_company_id_string',idString)
                localStorage.setItem('finding_company_name_string',nameString)
                this.$router.push(`/recordOutcome/multi/${this.selectedList[0].inspection_id}`)
                
            },
            closeBulk() {
                this.listModal.isVisible = false;
            },
            showWarningModal(value) {
                this.warningModal.visible = value;
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
            selectChangeNew(data) {
                this.selectedRowsNew = data;
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
                if(this.filtering.NCOnly == 1) {
                    filters.NCOnly = this.filtering.NCOnly;
                    filters.inspection_id = this.filtering.inspection_id;
                }
                else{
                    filters.inspection_id = this.filtering.inspection_id;
                    filters.status_id = this.filtering.status_id;
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
                getInspectionOutcomeList(data)
                    .then(this.handleResponse)
                    .catch(this.handleError)
            },
            handleResponse(response) {
                this.hideLoader();
                this.recordOutcome = response.data[0];
                this.inspectionInfo = response.inspection_info;
                this.pagination.total = response.NumberOfRecords;
                this.ticketValue = {
                    First: this.inspectionInfo.inspectionType,
                    Second: this.recordOutcome[0] && this.recordOutcome[0].CSPName ? this.recordOutcome[0].CSPName : '',
                    Third: this.recordOutcome[0] && this.recordOutcome[0].inspectionDate ? this.getDate(this.recordOutcome[0].inspectionDate) : ''
                }
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

    .popupRow {
        padding: 5px 0 15px;
    }
    .separateStyle {
        border-left: 2px solid grey;
    }
    .flexRow {
        display: flex;
        align-items: center;
        width: 100%;
        margin: 20px 0;
        div {
            margin-right: 10px;
            
            &:nth-child(2) {
                padding-left: 10px;
            }
        }
    }
    .classBackground {
        td{
            background-color: red;
            color: #000000;
            &:hover{
                transition: all 0.2s ease-out;
                td{
                    transition: all 0.2s ease-out;
                    color: #000000
                }
            }
        }
    }

</style>
