<template>
    <FormWrapper :is-loading="isLoading">
        <!-- <PageTitle title="Document Masters" slot="title" :link="`/help/${processId}`"/> -->
        <PageTitle title="Resignation as RA report" slot="title" />
         <div :class="$style.filter">
            <!-- <div :class="$style.filterItem">
                <FormSelect :width="200" label="Process Type" :items="filtering.processTypes" item-name="Name" item-value="id" v-model="filtering.processTypeSelected" />
            </div>
            <div :class="$style.filterItem" v-if="filtering.processTypeSelected">
                <FormSelect :width="200" label="Process Name" :items="filtering.processNames" item-name="Name" item-value="id" v-model="filtering.processNameSelected" />
            </div> -->
            <div :class="$style.filterItem">
                <InputDate style="width: 200px" label="Select Date Range" type="daterange" v-model="filtering.dates" />
            </div>
            <!-- <div :class="$style.filterItem">
                <InputText v-model="filtering.DocumentBrief" label="Document Brief" />
            </div>
            <br /> -->
            <div :class="$style.filterItem">
                <FormSelect :width="200" label="ICSP" :items="filtering.icsps" item-name="name" item-value="id" v-model="filtering.icsp_id"  />
            </div>
            <div :class="$style.filterItem">
                <InputText rules="required" label="Reg #"  v-model="filtering.CompanyRegNo" @keyup.native="searchByRegNo" @focusout="searchByRegNoTab" />
            </div>
            <div :class="$style.filterItem">
                <FormAutoComplete
                    label="IBC Name"
                    rules="required"
                    v-model="filtering.Name"
                    :onChange="onSearchName"
                    :items="companies"
                    item-value="Name"
                    item-name="Name"
                    :onSelect="onSelectCompanyByName" />
            </div>

            <FormButton style="margin-top: 5px" type="primary" @click="search" :rounded="true">
                <Icon type="ios-search" />
            </FormButton>
        </div>
        <DataTable :actions="true"
                   :data="Documents"
                   :columns="config"
                   :is-loading="isLoading"
                   @on-selection-change="selectChange"
                   @on-page-change="pageChange"
                   :pagination="pagination"
                   @on-sort-change="sortChange">
                   <!-- <template slot="actionsLeft">
                    <TableButton @click="() => generate(2)">
                        <img src="../../../../assets/images/plus.png" />
                        Generate Second Notice
                    </TableButton>
                    <TableButton @click="() => generate(3)" >
                        <img src="../../../../assets/images/plus.png" />
                        Generate Third Notice
                    </TableButton>
                    <TableButton @click="() => openPublication(1)">
                        <img src="../../../../assets/images/plus.png" />
                        Update First Publication Details
                    </TableButton>
                    <TableButton @click="() => openPublication(2)" >
                        <img src="../../../../assets/images/plus.png" />
                        Update Second Publication Details
                    </TableButton>
                </template> -->
        </DataTable>

        <!--Publication popup -->
        <Popup title="Publication" :value="publicationModal.visible" @close="() => showPublicationModal(false)">
            <b>{{ publicationModal.title }}</b>
            <FormRow>
                <div class="col-sm-10">
                    <InputText label="Gazette" v-model="publicationModal.gazette" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-10">
                    <InputDate type="date" label="Publication Date" v-model="publicationModal.date" :options="options" />
                </div>
            </FormRow>
            <div slot="footer">
                <FormButton  @click="publication">Ok</FormButton>
                <FormButton  @click="() => showPublicationModal(false)">Cancel</FormButton>
            </div>
        </Popup>


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

    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import InputDate from 'Components/form/InputDate';
    import FormAutoComplete from 'Components/form/FormAutoComplete';
    import config from './table';
    import loadingMixin from 'Mixins/loadingMixin';
    import { getProcessTypes, getProcesses, getReports, getCompany, getICSP, updateRRAGazette, generateRRANotice } from '../api'

    export default {
        name: "RRAReports",
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle,
            DataTable,
            InputDate,
            FormAutoComplete
        },
        data() {
            return {
                filtering: {
                    processTypes: [],
                    processTypeSelected: null,
                    processNames: [],
                    dates: '',
                    processNameSelected: null,
                    icsps: [],
                    icsp_id: null,
                    EntityType: "IBC",
                    CompanyRegNo: '',
                    Name: '',
                    company_id: null,
                },
                sorting: {
                    key: 'company_id',
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
                Documents: [],
                tableData: [],
                config,
                selectedRows: [],
                document_id: null,
                companies: [],
                isSelected: false,
                publicationModal:{
                    visible: false,
                    gazette: '',
                    date: '',
                    title: '',
                    publicationNumber: 0,
                },
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                }
            }
        },
        created() {
          this.getFilterValues();
          this.getDataByFilter();
        },
        watch: {
            'filtering.processTypeSelected': function (newValue) {
                if (newValue) {
                    this.showLoader();
                    getProcesses(newValue).then(res => {
                        this.hideLoader();
                        this.filtering.processNames = res.data
                    }).catch(this.hideLoader)
                }
            },
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
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        methods: {
            generate(val){
                const data ={
                    NoticeNumber: val,
                    mode: 1
                }
                generateRRANotice(data).then(
                    res =>{
                        var myWindow=window.open('','','width=900,height=900');
                        myWindow.document.write(res.data);
                    }
                )
            },
            openPublication(val){
                
                if (this.validateSelectedLength()) {
                    const pub = this.publicationModal;
                    pub.publicationNumber = val;
                    if(val === 1){
                        pub.title = "First Publication";
                        this.showPublicationModal(true);
                    }else{
                        pub.title = "Second Publication";
                        this.showPublicationModal(true);
                    }
                }

            },
            showPublicationModal(val){
                this.publicationModal.visible  = val;
                if(val === false){
                    this.resetPublication();
                }
            },
            publication(){
                const pub = this.publicationModal;
                
                const ids = this.selectedRows.map(row => row.RRA_id).join(', ');
                const data = {
                    PublicationNumber: pub.publicationNumber,
                    PublicationDate: pub.date,
                    Gazette: pub.gazette,
                    idString: ids
                }
                updateRRAGazette(data).then(
                    res => {
                        this.getDataByFilter();
                        this.showPublicationModal(false);
                        this.selectedRows = [];
                    }
                )
            },
            resetPublication(){
                this.publicationModal.gazette = '';
                this.publicationModal.date= '';
                this.publicationModal.title= '';
                this.publicationModal.publicationNumber= 0;
            },
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            getFilterValues() {
                this.showLoader();
                Promise.all([
                    getProcessTypes(),
                    getICSP({ is_csp: true }),
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.filtering.processTypes = response[0].data;
                this.filtering.icsps = response[1].data;
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

                filters.company_id = this.filtering.company_id;
                // filters.process_id = this.filtering.processNameSelected;
                filters.EntityType = this.filtering.EntityType;
                filters.icsp_id = this.filtering.icsp_id;
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
                getReports(data)
                    .then(this.handleResponse)
                    .catch(this.handleError)
            },
            handleResponse(response) {
                this.hideLoader();
                this.Documents = response.data[0];
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

            
            searchByRegNoTab() {
                
                if (!this.isSelected) {
                    const { CompanyRegNo } = this.filtering;
                    const { EntityType } = this.filtering;
                    if (CompanyRegNo ) {
                        getCompany({
                            EntityType: EntityType,
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
                    if (!this.isSelected) {
                        const { CompanyRegNo } = this.filtering;
                        const { EntityType } = this.filtering;
                        if (CompanyRegNo ) {
                            getCompany({
                                EntityType: EntityType,
                                Name: '',
                                RegNo: CompanyRegNo,
                            }).then(res => {
                                if (res.data[0] && res.data[0].length > 0) {
                                    var company = res.data[0][0];
                                    this.filtering.company_id = company.id;
                                    this.filtering.Name = company.Name;
                                    this.filtering.CompanyRegNo = company.CompanyRegNo;
                                    this.isSelected = false;
                                }
                            })
                            
                        }
                    }
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
                    this.filtering.EntityType = 'IBC';
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
                if (this.validateQuery(val) && !this.isSelected ) {
                    this.resetCompanies();
                    this.searchForCompany(val);
                }
                this.isSelected = false;
            },
            searchForCompany(Name) {
                const { EntityType } = this.filtering;
                getCompany({
                    EntityType,
                    Name,
                    RegNo: '',
                }).then(res => {
                    this.companies = res.data[0];
                })
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

</style>
