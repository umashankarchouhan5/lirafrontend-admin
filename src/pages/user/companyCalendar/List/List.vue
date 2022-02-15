<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Company Calendar" slot="title" />
        <div :class="$style.filter">
            
            <div :class="$style.filterItem">
                <InputText rules="required" label="Reg #"  v-model="filtering.CompanyRegNo" @keyup.native="searchByRegNo" @focusout="searchByRegNoTab" />
            </div>
            <div :class="$style.filterItem">
                <FormAutoComplete
                    label="Company Name"
                    rules="required"
                    v-model="filtering.Name"
                    :onChange="onSearchName"
                    :items="companies"
                    item-value="Name"
                    item-name="Name"
                    :onSelect="onSelectCompanyByName" />
            </div>
            <div :class="$style.filterItem">
                <FormSelect :width="200" label="Status" :items="filtering.statusses" item-name="name" item-value="id" v-model="filtering.statusSelected" />
            </div>
            <div :class="$style.filterItem">
                <InputDate label="Select Dates" type="daterange" v-model="filtering.dates" />
            </div>
            <br />
            <div :class="$style.filterItem">
                <FormAutoComplete v-model="filtering.ICSPSelectedName"
                    :onSearch="searchICSP"
                    :onSelect="selectICSP"
                    :onClear="clearICSP"
                    label="Licensee"
                    item-name="name"
                    item-value="name"
                    :items="filtering.icspResultsFiltered" />
            </div>
            <div :class="$style.filterItem">
                <FormButton style="margin-top: 5px" type="primary" @click="search" :rounded="true">
                    <Icon type="ios-search" />
                </FormButton>
            </div>
        </div>
        <template v-if="calendarView == 'table'">
            <DataTable :actions="true"
                    :data="companyCalendar"
                    :columns="config"
                    :is-loading="isLoading"
                    @on-selection-change="selectChange"
                    @on-page-change="pageChange"
                    :pagination="pagination"
                    @on-sort-change="sortChange" v-if="companies.length >0 || isSearched==true">
                <template slot="actionsLeft">
                    <TableButton @click="openAddCalendar">
                        <img src="../../../../assets/images/plus.png" />
                        Add
                    </TableButton>
                    <TableButton @click="openUpdateCalendar">
                        <img src="../../../../assets/images/upload.png" />
                        Update
                    </TableButton>
                    <TableButton @click="openCalendarHistory">
                        <img src="../../../../assets/images/ViewHistory.png" />
                        View History
                    </TableButton>
                </template>
                <!-- <template slot="actionsRight">
                    <TableButton @click="changeCalendarView('calendar')">
                        <img src="../../../../assets/images/CompanyCalendar.png" />
                    </TableButton>
                </template> -->
            </DataTable>
        </template>
        <template v-if="calendarView == 'calendar'">
            <FormButton  @click="() => changeCalendarView('table')">Table View</FormButton>
            <br />
            <CalendarView :companyCalendar="companyCalendar" minHeight="700" />
        </template>



<!-- Message popup -->
        <Popup title="Information" :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.cancel" @click="() => showWarningModal(false)">Cancel</FormButton>
                <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
            </div>
        </Popup>
        <!-- Add Calendar -->
        <Popup title="Add Calendar" width="700" :value="calendarModal.add.visible" @close="() => showAddCalendar(false)">
             
            <ValidationObserver ref="validator" v-if="calendarModal.add.visible">
                <FormRow >
                    <div class="col-sm-6">
                        <FormSelect v-model="form.license_id" :items="filtering.icspResults" itemName="name" itemValue="license_id" label="Select Licensee" rules="required" />
                    </div>
                </FormRow>
                <SearchCompanyNew 
                    v-model="form.company"  
                />
                <FormRow>
                    <div class="col-sm-3">
                        <InputDate label="Deadline" rules="required" v-model="form.deadline" />
                    </div>
                    <div class="col-sm-4">
                        <FormSelect  label="Status" :items="filtering.statusses" item-name="name" item-value="id" v-model="form.status_id" rules="required" />
                    </div>
                    <div class="col-sm-5">
                        <FormSelect  label="Calendar Type" :items="filtering.dateTypes" item-name="DisplayName" item-value="id" v-model="form.dateType_id" rules="required" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12">
                        <InputTextArea v-model="form.comments" label="Comments" />
                    </div>
                </FormRow>
            </ValidationObserver>
            <div slot="footer">
                <FormButton  type="success" @click="addCalendar">Add
                </FormButton>
                <FormButton  @click="() => showAddCalendar(false)">Cancel
                </FormButton>
            </div>
        </Popup>
        <!-- Update Calendar -->
        <Popup title="Calendar Update" :value="calendarModal.update.visible" @close="() => showCalendarUpdate(false)">
             
            <ValidationObserver ref="validator" v-if="calendarModal.update.visible">
                <FormRow>
                    <div class="col-sm-4">
                        <InputDate label="Deadline" rules="required" v-model="selectedRows[0].dueDate" />
                    </div>
                    <div class="col-sm-4">
                        <FormSelect label="Status" :items="filtering.statusses" item-name="name" item-value="id" v-model="form.status_id" rules="required" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12">
                        <InputTextArea v-model="form.comments" label="Comments" />
                    </div>
                </FormRow>
            </ValidationObserver>
            <div slot="footer">
                <FormButton  type="success" @click="updateCalendar">Submit
                </FormButton>
                <FormButton  @click="() => showCalendarUpdate(false)">Cancel
                </FormButton>
            </div>
        </Popup>

        <Popup title="Calendar History" :value="calendarHistoryModal.visible" width="700" @close="() => showCalendarHistory(false)">
             
            <DataTable
                :data="calendarHistoryModal.data"
                :columns="historyColumns"
                :is-loading="isLoading" />
            
            <div slot="footer">
                <FormButton  @click="() => showCalendarHistory(false)">Cancel
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
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import FormAutoComplete from 'Components/form/FormAutoComplete';
    import { ValidationObserver } from "vee-validate"; 
    import {  getCompanyStatus, getCompanyCalendarList, getCompany, searchICSPTypes, assignTask, getCalendarHistory, getDateType, } from '../api'
    import DateUtil from 'Utils/dateUtil';
    
    export default {
        name: "CompanyCalendar",
        mixins: [loadingMixin,validateSelectedRows],
        components: {
            FormWrapper,
            PageTitle,
            DataTable,
            InputDate,
            FormAutoComplete,
            ValidationObserver
        },
        data() {
            return {
                filtering: {
                    statusses: [],
                    statusSelected: null,
                    ICSP: [],
                    icspSelected: null,
                    RegNo: null,
                    dates: '',
                    CompanyRegNo: '',
                    Name: '',
                    company_id: null,
                    icspResults: [],
                    icspResultsFiltered: [],
                    ICSPSelectedID: null,
                    ICSPSelectedName: '',
                    companyResults: [],
                    companyResultsFiltered: [],
                    dateTypes: [],
                },
                isSelected: false,
                isSearched: false,
                sorting: {
                    key: 'id',
                    order: 'desc'
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
                companies: [],
                companyCalendar: [],
                tableData: [],
                config,
                selectedRows: [],
                calendarModal: {
                    update: {
                        visible: false
                    },
                    add: {
                        visible: false
                    }
                },
                calendarHistoryModal: {
                    visible: false,
                    data: []
                },
                form:{
                    comments: '',
                    status_id: null,
                    dateType_id: null,
                    deadline: null,
                    company: {
                        EntityType: null,
                        Name: '',
                        CompanyRegNo: '',
                        id: null,
                    },
                    license_id: null,
                },
                historyColumns: [
                    {title: 'Comments', key: 'comments', minWidth: 150},
                    {title: 'Status', key: 'Status', width: 120},
                    {title: 'Officer', key: 'officer', width: 150},
                    {title: 'Status Date',render: (h,params) => { return h('span',  params.row.statusDate !== undefined && params.row.statusDate !== null ? DateUtil.formatDate(params.row.statusDate) : '' )}, width: 100 }
                ],
                calendarView: 'table'
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        watch: {
            
            'filtering.CompanyRegNo': function (newValue) {
                if ( newValue == '') {
                    this.resetCompany();
                    this.resetCompanies();
                }
            },
            'filtering.Name': function (newValue) {
                if ( newValue == '') {
                    this.resetCompany();
                    this.resetCompanies();
                }
            }
        },
        created() {
            this.getFilterValues();
        //   this.getDataByFilter();
            if(this.$route.params.company_id){
                this.filtering.company_id = parseInt(this.$route.params.company_id);
                this.getDataByFilter();
            }
        },
        methods: {
            changeCalendarView(layout) {
                this.calendarView = layout;
                this.getDataByFilter();
            },
            openCalendarHistory(){
                if(this.validateSelectedLength(1)) {
                    getCalendarHistory({calendar_id: this.selectedRows[0].calendar_id}).then(
                        res => {
                            this.calendarHistoryModal.data = res.data;
                            this.showCalendarHistory(true);
                        }
                    )
                }
            },
            showCalendarHistory(val) {
                this.calendarHistoryModal.visible = val;
            },
            showCalendarUpdate(val){
                if(this.validateSelectedLength(1)) {
                    this.calendarModal.update.visible = val;
                    if(val == false){
                        this.resetUpdateCalendar();
                    }
                }
            },
            showAddCalendar(val){
                this.calendarModal.add.visible = val;
                if(val == false){
                    this.resetAddCalendar();
                }
            },
            resetUpdateCalendar() {
                this.form.comments = '';
                this.form.status_id = '';
            },
            resetAddCalendar() {
                this.form.comments = '';
                this.form.status_id = '';
                this.form.dateType_id = null;
                this.form.deadline = null;
                this.form.license_id = null;
                this.form.company_id = null;
            },
            openAddCalendar(){
                this.showAddCalendar(true);
            },
            openUpdateCalendar() {
                this.showCalendarUpdate(true);
            },
            addCalendar() {
                
                this.$refs.validator.validate().then(result => {
                    if (result) {
                        const { status_id, deadline, dateType_id, comments, company, license_id} = this.form
                        const data = {
                            calendar_id: 0,
                            status_id,
                            comments,
                            dueDate: deadline,
                            dateType_id,
                            company_id: company.id,
                            license_id,
                        }
                        assignTask(data).then(
                            res => {
                                this.getDataByFilter();
                                this.showAddCalendar(false);
                            }
                        )
                    }
                })
            },
            updateCalendar() {
                var row = this.selectedRows[0];
                
                this.$refs.validator.validate().then(result => {
                    if (result) {
                        const data = {
                            calendar_id: row.calendar_id,
                            status_id: this.form.status_id,
                            comments: this.form.comments,
                            dueDate: row.dueDate,
                            dateType_id: 209
                        }
                        assignTask(data).then(
                            res => {
                                this.getDataByFilter();
                                this.showCalendarUpdate(false);
                            }
                        )
                    }
                })
            },
            searchByRegNoTab() {
                this.searchByRegNoDefault();
            },
            searchByRegNoDefault() {
                
                if (!this.isSelected) {
                    const { CompanyRegNo } = this.filtering;
                    if (CompanyRegNo ) {
                        getCompany({
                            Name: '',
                            RegNo: CompanyRegNo,
                        }).then(res => {
                            if (res.data[0] && res.data[0].length > 0) {
                                var company = res.data[0][0];
                                this.filtering.company_id = company.id
                                this.filtering.Name = company.Name;
                                this.filtering.CompanyRegNo = company.CompanyRegNo;
                                this.isSelected = false;
                            }
                        })
                        
                    }
                }
            },
            searchByRegNo(event) {
                if(event.keyCode === 13){
                    this.searchByRegNoDefault();
                }
            },
            onSelectCompanyByName(value) {
                var company = this.companies.find(item => item.Name === value);

                this.filtering.company_id = company.id;
                this.filtering.Name = company.Name;
                this.filtering.CompanyRegNo = company.CompanyRegNo;

                this.isSelected = true;
            },
            resetCompany() {
                if(!this.readonly){
                    this.filtering.Name = '';
                    this.filtering.CompanyRegNo ='';
                    this.filtering.company_id = null;
                }
            },
            validateQuery(value) {
                return value.length >= 3
            },
            resetCompanies() {
                this.companies = [];
            },
            onSearchName(val) {
                if (this.validateQuery(val) && !this.isSelected) {
                    this.resetCompanies();
                    this.searchForCompany(val);
                }
                this.isSelected = false;
            },
            searchForCompany(Name) {
                getCompany({
                    Name,
                    RegNo: '',
                }).then(res => {
                    this.companies = res.data[0];
                })
            },

            //company search ended
            
            clearICSP(){
                this.filtering.ICSPSelectedID = null;
                this.filtering.icspResultsFiltered = null;
            },
            selectICSP(name) {
                this.filtering.ICSPSelectedID = this.filtering.icspResultsFiltered.find(item => item.name === name).license_id;
            },
            searchICSP(value) {
                if (value.length > 2) {
                    this.filtering.icspResultsFiltered = this.filtering.icspResults.filter(item => {
                        return item.name !== null ? item.name.toLowerCase().includes(value.toLowerCase()) : false;
                    })
                } else {
                    this.filtering.icspResultsFiltered = []
                }
            },

            getFilterValues() {
                this.showLoader();
                Promise.all([
                    getCompanyStatus({statusType_id: 1}),
                    searchICSPTypes({department_id: this.userData.department_id}),
                    getDateType(),
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.filtering.statusses = response[0].data[0];
                this.filtering.icspResults = response[1].data;
                this.filtering.dateTypes = response[2].data;
                this.hideLoader();
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

                // Ignore other filters if we have RegNo
                if (this.filtering.RegNo) {
                    filters.RegNo = this.filtering.RegNo
                } else {
                    filters.company_id = this.filtering.company_id;
                    filters.status_id = this.filtering.statusSelected;
                    filters.DateFrom = this.filtering.dates[0];
                    filters.DateTo = this.filtering.dates[1];
                    filters.license_id = this.filtering.ICSPSelectedID;
                }

                const data = {
                    user_id: this.userData.user_id,
                    filterjson: {
                        filter: [filters],
                        sort: [{ key, order }],
                        paging: [
                            {
                                startindex: perPage * (page - 1) + 1,
                                pagesize: this.calendarView == 'table'?  perPage : 5000
                            }
                        ]
                    }
                };
                getCompanyCalendarList(data)
                    .then(this.handleResponse)
            },
            handleResponse(response) {
                this.hideLoader();
                this.isSearched = true;
                if(typeof response.viewLog !=="undefined" && response.viewLog==1) {
                    this.viewLog = 1;
                }
                this.companyCalendar = response.data[0];
                this.pagination.total = response.NumberOfRecords;
                if (response.pdf_visibility==1) {
                    this.showPdf = true;    
                }
                if (response.excel_visibility==1) {
                    this.showExcel = true;
                }
            },
            showWarningModal(value) {
                this.warningModal.visible = value;
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
</style>
