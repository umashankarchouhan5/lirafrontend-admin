<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Correspondence List" slot="title" />
        
        <ValidationObserver ref="validator" >
            <div :class="$style.filter">
                <div :class="$style.filterItem">
                    <FormSelect :width="200" label="Communication Mode" :items="filtering.communicationModes" item-name="name" item-value="id" v-model="filtering.communicationModeSelected" />
                </div>
                <div :class="$style.filterItem">
                    <InputText v-model="filtering.ticketReference" label="Ticket Reference" rules="alphaNumCustom" />
                </div>
                <div :class="$style.filterItem">
                    <InputText label="Reg #"  v-model="filtering.CompanyRegNo" @keyup.native="searchByRegNo" @focusout="searchByRegNoTab" />
                </div>
                <div :class="$style.filterItem">

                    <FormAutoComplete
                        label="Company Name"
                        v-model="filtering.Name"
                        :onChange="onSearchName"
                        :items="companies"
                        item-value="Name"
                        item-name="Name"
                        :onSelect="onSelectCompanyByName" />
            
                </div>
                <div :class="$style.filterItem">
                    <FormAutoComplete v-model="filtering.ICSPSelectedName"
                        :onSearch="searchICSP"
                        :onSelect="selectICSP"
                        label="Licensee"
                        item-name="name"
                        item-value="name"
                        :onClear="clearICSP"
                        :items="filtering.icspResultsFiltered" />
                </div>
                <div :class="$style.filterItem">
                    <InputDate label="Select dates" type="daterange" v-model="filtering.dates" />
                </div>
                <div :class="$style.filterItem">
                    <FormButton style="margin-top: 5px" type="primary" @click="search" :rounded="true">
                        <Icon type="ios-search" />
                    </FormButton>
                </div>
            </div>
        </ValidationObserver>
        <br />
        <DataTable :actions="true"
                   :data="correspondences"
                   :columns="config"
                   :is-loading="isLoading"
                   @on-selection-change="selectChange"
                   @on-page-change="pageChange"
                   :pagination="pagination"
                   @on-sort-change="sortChange">
            <template slot="actionsLeft">
                <TableButton @click="() => render()">
                    <img src="../../../../assets/images/eye.png" />
                    View
                </TableButton>
                <TableButton @click="() => reSendMail()">
                    <img src="../../../../assets/images/mail.png" />
                    Resend
                </TableButton>
            </template>
        </DataTable>
        
<!-- Message popup -->
        <Popup title="Information" :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.cancel" @click="() => showWarningModal(false)">Cancel</FormButton>
                <FormButton v-if="warningModal.buttons.confirm" type="success" @click="confirmDelete">Confirm</FormButton>
                <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
            </div>
        </Popup>
      
<!-- Email Preview popup -->
        <Popup title="Preview" :value="previewModal.visible" width="700" @close="() => showPreviewModal(false)">
            <div v-html="previewModal.message"> </div>
            <div v-if="selectedRows[0] && selectedRows !== null && selectedRows[0].attachmentArray" :class="$style.indentClass">
                <br />
                <p  v-for="(obj,index) in getAttachment(selectedRows[0].attachmentArray)" :key="index" ><a :href="obj.url" target="blank">{{ obj.filename }}</a></p>
            </div>
            <div slot="footer">
                <FormButton v-if="previewModal.buttons.close" @click="() => showPreviewModal(false)">Close</FormButton>
                <FormButton left-icon="ios-send" v-if="previewModal.buttons.resend" @click="() => reSendMail()">Resend Email</FormButton>
            </div>
        </Popup>
<!-- Success Popup -->
        <Popup title="Success" :value="successModal.visible" @close="() => showSuccessModal(false)">
            {{ successModal.message }}
            <div slot="footer">
                <FormButton v-if="successModal.buttons.ok" @click="() => showSuccessModal(false)">Ok</FormButton>
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
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import { searchICSPTypes, getCompanyStatus, getICSP, getCompanies,getCorrespondenceList, reSendEmailByAdmin, getCompany, getCompanyRegName } from '../api';
    import { ValidationObserver } from 'vee-validate'
    
    export default {
        name: "Correspondence",
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
                    communicationModes: ['email'],
                    communicationModeSelected: 'email',
                    icspResults: [],
                    icspResultsFiltered: [],
                    ICSPSelectedID: null,
                    ICSPSelectedName: '',
                    companyResults: [],
                    companyResultsFiltered: [],
                    companySelectedID: null,
                    companySelectedName: '',
                    ticketReference: '',
                    RegNo: null,
                    dates: '',
                    CompanyRegNo: '',
                    Name: '',
                    company_id: null,
                },
                companies: [],
                isSelected: false,
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
                previewModal: {
                    visible: false,
                    buttons: {
                        close: true,
                        resend: true,
                    }
                },
                successModal: {
                    visible: false,
                    message: '',
                    buttons: {
                        ok: true,
                        confirm: false,
                        cancel: false,
                    }
                },
                correspondences: [],
                tableData: [],
                config,
                selectedRows: [],
            }
        },
        created() {
          
            if(this.$route.params.entityReg && this.$route.params.company_id){
                this.filtering.company_id = this.$route.params.company_id;
                this.getCompanyReg();
                this.getFilterValues();
                this.getDataByFilter();
            }
            else{
                this.getFilterValues();
                this.getDataByFilter();

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
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        methods: {
            getCompanyReg() {
                getCompanyRegName({company_id: this.filtering.company_id}).then(
                    res => {
                        this.filtering.CompanyRegNo = res.data[0].CompanyRegNo;
                        this.filtering.Name = res.data[0].Name;
                    }
                )
            },
            searchByRegNoTab() {
                
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
            showSuccessModal(val){
                this.successModal.visible = val;
            },
            reSendMail(){
                if (this.validateSelectedLength(1)) {
                    reSendEmailByAdmin({correspondence_id: this.selectedRows[0].id}).then(
                        res => {
                            this.successModal.message = 'Mail is resent to user';
                            this.showSuccessModal(true);
                        }
                    )
                }
            },
            getFilterValues() {
                // this.showLoader();
                Promise.all([
                    searchICSPTypes({department_id: this.userData.department_id}), // icsplist
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.filtering.icspResults = response[0].data;
            },
            clearICSP(){
                this.filtering.ICSPSelectedID = null;
                this.filtering.icspResultsFiltered = null;
            },
            selectICSP(name) {
                this.filtering.ICSPSelectedID = this.filtering.icspResultsFiltered.find(item => item.name === name).id;
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
                
                setTimeout(() => {
                    this.$refs.validator.validate().then((result) => {
                        if (result ) {
                            this.showLoader();
                            const { key, order } = this.sorting;
                            const { perPage, page } = this.pagination;

                            const filters = {};

                            if (this.filtering.ticketReference) {
                                filters.TicketReference = this.filtering.ticketReference;
                            } else {
                                filters.communicationMode = this.filtering.communicationModeSelected;
                                filters.company_id = this.filtering.company_id;
                                filters.ICSP_id = this.filtering.ICSPSelectedID;
                                filters.DateFrom = this.filtering.dates[0];
                                filters.DateTo = this.filtering.dates[1];
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
                            getCorrespondenceList(data)
                                .then(this.handleResponse)
                                .catch(this.handleError)
                        }
                        else{
                            this.hideLoader();
                        }
                    })
                },
                50
                )
            },
            handleResponse(response) {
                this.hideLoader();
                this.correspondences = response.data[0];
                this.pagination.total = response.NumberOfRecords;
            },
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            showPreviewModal(value) {
                this.previewModal.visible = value;
            },
            render() {
                if (this.validateSelectedLength(1)) {
                    var row  = this.selectedRows[0];
                    if(typeof row.attachmentjson!="undefined" && row.attachmentjson && row.attachmentjson !== null && row.attachmentjson !== '' ){
                        row.attachmentArray = row.attachmentjson;
                    }
                    
                    this.previewModal.message = row.template; // allow only the first row
                    this.showPreviewModal(true);
                }
            },
            getAttachment(items) {
                return JSON.parse(items);
            },
        }
    }
</script>

<style lang="scss" module>
    .indentClass{
        margin-left: 35px;
    }
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
