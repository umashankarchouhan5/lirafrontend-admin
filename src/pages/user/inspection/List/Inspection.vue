<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Inspection" slot="title" />
      
        <div :class="$style.filter">
            <div :class="$style.filterItem">
                <FormSelect :width="200" label="Select Status" :items="filtering.statusses" item-name="name" item-value="id" v-model="filtering.status_id"  />
            </div> 
            <div :class="$style.filterItem">
                <FormSelect :width="200" label="Inspection Type" :items="filtering.inspectionTypes" item-name="Name" item-value="id" v-model="filtering.inspectionType_id"  />
            </div> 
            <div :class="$style.filterItem">
                <InputDate style="width: 200px" label="Select Date Range" type="daterange" v-model="filtering.dates" />
            </div>
            
            <FormButton style="margin-top: 5px" type="primary" @click="search" :rounded="true">
                <Icon type="ios-search" />
            </FormButton>
        </div>
        <DataTable :actions="true"
            :data="inspectionList"
            :columns="config"
            :is-loading="isLoading"
            @on-selection-change="selectChange"
            @on-page-change="pageChange"
            :pagination="pagination"
            @on-sort-change="sortChange">
            
            <template slot="actionsLeft">
                <TableButton @click="addInspection">
                    <img src="../../../../assets/images/plus.png" alt="">
                    Add
                </TableButton>
                <TableButton @click="editInspection">
                    <img src="../../../../assets/images/edit.png" alt="">
                    Edit
                </TableButton>
                <TableButton @click="viewInspection">
                    <img src="../../../../assets/images/eye.png" alt="">
                    View
                </TableButton>
                <TableButton @click="recordOutcome">
                    <img src="../../../../assets/images/Inspection.png" alt="">
                    Inspection Findings
                </TableButton>
                
                <TableButton @click="lock">
                    <img src="../../../../assets/images/InspectionLock.png" alt="">
                    Lock
                </TableButton>
                <TableButton @click="reinspection">
                    Re-inspection Findings
                </TableButton>
                <TableButton @click="generateLetter">
                    <img src="../../../../assets/images/Notice.png" alt="">
                    Generate First Notice
                </TableButton>
                <TableButton @click="createAnnouncement">
                    Generate Announcement
                </TableButton>
                <TableButton @click="penalty">
                    Penalty
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
        
        <Popup title="Information" :value="lockModal.visible" @close="() => showLockModal(false)">
            Do you want to lock this inspection plan? Once locked it cannot be edited.
            <div slot="footer">
                <FormButton  @click="() => showLockModal(false)">Cancel
                </FormButton>
                <FormButton type="success" @click="lockOutcome">Confirm
                </FormButton>
            </div>
        </Popup>

    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import InputDate from 'Components/form/InputDate';
    import config from './table';
    import loadingMixin from 'Mixins/loadingMixin';
    import {  generateInspectionLetter, reInspection, getInspectionPlanList, getInspectionTypebyDepartment, getInspectionStatusList, lockInspectionPlanbyAdminuser } from '../api'

    export default {
        name: "Inspection",
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
                    inspectionType_id: null,
                    inspectionTypes: [],
                    officer_id: '',
                    complianceStatus: null,
                    dates: '',
                    department_id: null,
                    license_id: null,
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
                inspectionList: [],
                config,
                selectedRows: [],
                companies: [],
                isSelected: false,
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
            penalty() {
                var row = this.selectedRows[0];
                if(this.validateSelectedLength(1)) {
                    this.$router.push(`/penalty/${row.id}`);
                }
            },
            createAnnouncement() {
                var row = this.selectedRows[0];
                if(this.validateSelectedLength(1)) {
                    this.$router.push(`/announcement/${row.id}`);
                }
            },
            generateLetter() {
                var row = this.selectedRows[0];
                if(this.validateSelectedLength(1)) {
                    if(row.status_id!==405) {
                        this.warningModal.message = "Findings should be updated for generating letter.";
                        this.showWarningModal(true);
                    } else {
                        generateInspectionLetter({inspection_id: row.id}).then(
                            res => {
                                if(res.status==true) {
                                    this.hideLoader();
                                    window.open(res.data,'_blank');
                                } else {
                                    this.warningModal.message = res.message;
                                    this.showWarningModal(true);
                                }
                            }
                        )
                    }
                }
            },
            reinspection() {
                var row = this.selectedRows[0];
                if(this.validateSelectedLength(1)) {
                    if(row.status_id!==405) {
                        this.warningModal.message = "Findings should be updated for Re-inspection.";
                        this.showWarningModal(true);
                    } else {
                        this.$router.push(`/reinspectionList/${row.id}`)
                        // reInspection({inspection_id: row.id}).then(
                        //     res => {
                        //         if(res.status==true) {
                        //             this.successModal.message = res.message;
                        //             this.successModal.isVisible = true;
                        //         } else {
                        //             this.warningModal.message = res.message;
                        //             this.showWarningModal(true);
                        //         }
                        //     }
                        // )
                    }
                }
            },
            showLockModal(val){
                this.lockModal.visible = val;
            },
            lockOutcome(){
                var row = this.selectedRows[0];
                    lockInspectionPlanbyAdminuser({reference_id: row.id}).then(
                        res => {
                            this.showLockModal(false);
                            this.successModal.message = 'Inspection plan has been locked.';
                            this.successModal.isVisible = true;
                            this.getDataByFilter();
                        }
                    )
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
            addInspection(){
                this.$router.push('/inspectionForm');
            },
            editInspection(){
                if(this.validateSelectedLength(1)){
                    var row = this.selectedRows[0];
                    if(row.isLocked !== 1){
                        this.$router.push(`/inspectionForm/${row.id}`)
                    }
                    else{
                        this.warningModal.message = 'Locked inspection plans cannot be edited.';
                        this.showWarningModal(true);
                    }
                }
            },
            viewInspection(){
                if(this.validateSelectedLength(1)){
                    var row = this.selectedRows[0];
                    this.$router.push(`/viewInspectionForm/${row.id}`);
                }
            },
            recordOutcome(){
                if(this.validateSelectedLength(1)){
                    var row = this.selectedRows[0];
                    if(row.isLocked === 1){
                        this.$router.push(`/recordOutcome/${row.id}`)
                    }
                    else{
                        this.warningModal.message = 'You must lock inspection plan before recording outcome.';
                        this.showWarningModal(true);
                    }
                }
            },
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            getFilterValues() {
                this.showLoader();
                Promise.all([
                    getInspectionTypebyDepartment({department_id: this.userData.department_id}),
                    getInspectionStatusList({department_id: this.userData.department_id})
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.filtering.inspectionTypes = response[0].data[0];
                this.filtering.statusses = response[1].data[0];
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
                filters.inspectionType_id = this.filtering.inspectionType_id;
                filters.license_id = this.filtering.license_id;
                filters.complianceStatus = this.filtering.complianceStatus;
                filters.officer_id = this.filtering.officer_id;
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
                getInspectionPlanList(data)
                    .then(this.handleResponse)
                    .catch(this.handleError)
            },
            handleResponse(response) {
                this.hideLoader();
                this.inspectionList = response.data[0];
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

    .popupRow {
        padding: 5px 0 15px;
    }



</style>
