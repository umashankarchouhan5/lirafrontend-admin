<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Print Queue List" slot="title" />
        
        <ValidationObserver ref="validator" >
            <div :class="$style.filter">
                <div :class="$style.filterItem">
                    <InputText v-model="filtering.ticketReference" label="Ticket Reference" rules="alphaNumCustom" />
                </div>
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
                    <FormSelect  label="Stationery Type" :items="filtering.stationeryTypes"  v-model="filtering.stationeryTypeSelected" />
                </div>
                <div :class="$style.filterItemSmall">
                    <FormButton style="margin-top: 5px" type="primary" @click="search" :rounded="true">
                        <Icon type="ios-search" />
                    </FormButton>
                </div>
                
            </div>
        </ValidationObserver>
        <br />
        <DataTable :actions="true"
                   :data="printqueues"
                   :columns="config"
                   :is-loading="isLoading"
                   @on-selection-change="selectChange"
                   @on-page-change="pageChange"
                   :pagination="pagination"
                   @on-sort-change="sortChange">
            <template slot="actionsLeft">
                <TableButton @click="() => view()">
                    <img src="../../../../assets/images/eye.png" />
                    View
                </TableButton>
                <TableButton @click="() => render()">
                    <img src="../../../../assets/images/upload.png" />
                    Upload
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
        <Popup title="Success" type="success" :value="modalSuccess.visible" @close="() => showSuccessModal(false)">
            {{ modalSuccess.message }}
            <div slot="footer">
                <FormButton  @click="() => showSuccessModal(false)">Ok</FormButton>
            </div>
        </Popup>
<!-- print popup -->
        <!-- new print popup -->
        <Popup title="Print Queue Details" :value="printModal.visible" width="700" @close="() => showPrintModal(false)">
            <div :class="$style.popupRow">
                <InputText label="Ticket Reference" :readonly="true" v-model="queue.TicketReference" :maxlength="200" />
            </div>
            
            
            <div :class="$style.popupRow">
                <InputText label="ICSP" :readonly="true" v-model="queue.ICSP_Name" :maxlength="200" />
            </div>
            <div :class="$style.popupRow">
                <InputText label="Approver Name" :readonly="true" v-model="queue.ApproverName" :maxlength="200" />
            </div>
            <DataTable
                :actions="true"
                :data="docList"
                :columns="docConfig"
                :is-loading="isLoading"
            ></DataTable>
        </Popup>
                <!-- new print upload popup -->
        <Popup title="Print Queue Upload" :value="uploadModal.visible" width="900" @close="() => showUploadModal(false)">
            <div :class="$style.popupRow">
                <InputText label="Ticket Reference" :readonly="true" v-model="queue.TicketReference" :maxlength="200" />
            </div>
            
            
            <div :class="$style.popupRow">
                <InputText label="ICSP" :readonly="true" v-model="queue.ICSP_Name" :maxlength="200" />
            </div>
            <div :class="$style.popupRow">
                <InputText label="Approver Name" :readonly="true" v-model="queue.ApproverName" :maxlength="200" />
            </div>
            <ValidationObserver ref="validator">
                <DataTable
                    :class="$style.tablePadding"
                    :actions="true"
                    :data="upList"
                    :columns="upConfig()"
                    :is-loading="isLoading"
                ></DataTable>
            </ValidationObserver>
            <div slot="footer">
                <FormButton @click="returnPrint"> Return </FormButton>
            </div>
        </Popup>

    </FormWrapper>
</template>

<script>
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import FormAutoComplete from 'Components/form/FormAutoComplete';
    import config from './table';
    import docConfig from './docTable';
    import uploadConfig from './uploadTable';
    import loadingMixin from 'Mixins/loadingMixin';
    import { ValidationObserver } from "vee-validate";
    import { getPrintQueueList, attachPrintDocument, printDocument, getDocumentToPrint, returnPrintDocument, getCompany } from '../api'
    
    export default {
        name: "Printqueue",
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
                    companyResults: [],
                    companyResultsFiltered: [],
                    companySelectedID: null,
                    companySelectedName: '',
                    ticketReference: '',
                    stationeryTypes: ['LetterHead'],
                    StationeryType: null,
                    stationeryTypeSelected: null,
                    CompanyRegNo: '',
                    Name: '',
                    company_id: null,
                },
                companies: [],
                isSelected: false,
                queue:{
                    TicketReference: null,
                    StationeryType: null,
                    documentToPrint: null,
                },
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
                modalSuccess: {
                    visible: false,
                    maessage: ''
                },
                uploadModal: {
                    visible: false,
                    buttons: {
                        ok: true,
                    }
                },
                printModal: {
                    visible: false,
                    buttons: {
                        ok: true,
                    }
                },
                printqueues: [],
                tableData: [],
                config,
                docConfig,
                upConfig: uploadConfig,
                docList: [],
                upList: [],
                selectedRows: null,
                bulkUploadFiles: {
                    files: [],
                },
                error:{
                    areAllUploaded: false
                }
            }
        },
        created() {
        //   this.getFilterValues();
          this.getDataByFilter();
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
            } },
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        methods: {
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
                this.modalSuccess.visible = val;
            },
            returnPrint(){
                this.$refs.validator.validate().then((result) => {
                    if(this.validateDocuments()){
                        this.showLoader();
                        returnPrintDocument({printqueue_id: this.queue.id}).then(
                            res =>{
                                if(res.status === true){
                                    this.showUploadModal(false);
                                    this.modalSuccess.message = res.message;
                                    this.showSuccessModal(true);
                                    this.getDataByFilter();
                                    this.hideLoader();
                                }else{
                                    this.warningModal.message = res.message;
                                    this.warningModal.visible = true;
                                    this.hideLoader();
                                }
                            }
                        )
                    }
                })
            },
            onChangeDocument(row) {
                if (this.validateDocument(row)) {
                    const current = this.upList[row._index];
                    current.isSaved = false;
                    current['isChange'] = true;
                }
            },
            onSaveDocument(row) {
                
                this.$refs.validator.validate().then((result) => {
                    
                    if (this.validateDocument(row)  ) {
                        let data = new FormData();
                        if (row.file) {
                            data.append("documentAttachment", row.file, row.file.name);
                        }
                        data.append("printdocument_id",row.printdocument_id);
                        data.append("printqueue_id",this.queue.id);
                        this.showLoader()
                        attachPrintDocument(data).then((res) => {
                            this.upList[row._index].ScannedFileURL = res.data.url;
                            getDocumentToPrint({printqueue_id: this.queue.id}).then(
                                res => {
                                    const current = this.upList[row._index];
                                    current.DocumentName = res.data[row._index].DocumentName;
                                    this.hideLoader();
                                    current.isChange = false;
                                }
                            )
                        })
                    }
                })
            },
            onFileChange(file, row) {
                this.upList[row._index].file = file;
                if(file !== null) this.onSaveDocument(row);
            },
            validateDocument(row) {
                const current = this.upList[row._index];
                current.errors = [];
                if (!current.file) {
                    current.errors.push('file')
                }
                return current.errors.length === 0
            },
            validateDocuments() {
                    const isAllDocumentsUploaded = this.upList.every(item => item.ScannedFileURL !== null);
                    if (!isAllDocumentsUploaded) {
                        this.error.areAllUploaded = true;
                        return false;
                    }
                    this.error = false;
                    return true;
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

                            // Ignore other filters if we have Ticket Reference
                            if (this.filtering.ticketReference) {
                                filters.TicketReference = this.filtering.ticketReference;
                            } else {
                                filters.company_id = this.filtering.company_id;
                                filters.StationeryType = this.filtering.stationeryTypeSelected;
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
                            getPrintQueueList(data)
                                .then(this.handleResponse)
                                .catch(this.handleError)
                        }
                    })
                },
                50
                )
            },
            handleResponse(response) {
                this.hideLoader();
                this.printqueues = response.data[0];
                this.pagination.total = response.NumberOfRecords;
            },
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            showPrintModal(value) {
                this.printModal.visible = value;
            },
            showUploadModal(value) {
                // this.$refs.entityValidator.reset();
                this.uploadModal.visible = value;
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
            render() {
                
                if (this.validateSelectedLength(1)) {
                    this.showLoader()
                    this.queue= this.selectedRows[0]; // allow only the first row
                    getDocumentToPrint({printqueue_id: this.queue.id}).then(
                        res => {
                            this.upList = res.data.map( item => {
                                item['isChange'] = false;
                                return item;
                            });
                            this.showUploadModal(true);
                            this.hideLoader(false)
                        },
                        err => {
                            this.hideLoader(false)
                        }
                    )
                }
            },
            uploadFile(file) {
                this.queue.attachment = file;
            },
            submitForm(data) {
                this.showLoader();
                // const data = new FormData();
                data.append("documentAttachment", this.queue.attachment);
                data.append("printqueue_id", this.queue.id);

                attachPrintDocument(data).then(this.handleSuccessResponse)
            },
            handleSuccessResponse(response){
                if(response.status == 1){
                    this.showUploadModal(false);
                }
                this.hideLoader();
            },
            view(){
                if (this.validateSelectedLength(1)) {
                    this.showLoader();
                    this.queue= this.selectedRows[0]; // allow only the first row
                    getDocumentToPrint({printqueue_id: this.queue.id}).then(
                        res => {
                            this.docList = res.data;
                            this.showPrintModal(true);
                            this.hideLoader();
                        }
                    )
                }
                this.hideLoader();
            },
            print(){
                this.showLoader();
                const data = {
                    printqueue_id : this.queue.id
                };
                printDocument(data).then(this.handleSuccessResponse);
                window.open(this.queue.documentToPrint, "_blank");
                this.hideLoader();
            },
            /* multiple image upload */
            bulkUploadHandler(e) {
                this.bulkUploadFiles.files = [
                    ...this.bulkUploadFiles.files,
                    ...e.target.files
                ]
            },
            removeBulkFile(index) {
                this.bulkUploadFiles.files.splice(index, 1)
            },
            bulkUpload() {
                const formData = new FormData();
                this.bulkUploadFiles.files.forEach((item, i) => {
                    formData.append('files[' + i + ']', item);
                });
                this.submitForm(formData)
            },
            /** end of multiple file upload */
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
        flex: 0 0 200px;
        margin-right: 20px;
    }
    .filterItemSmall {
        flex: 0 0 50px;
        margin-right: 20px;
    }

    .popupRow {
        padding: 5px 0 15px;
    }
    .upload {
        width: calc(100%/2 - 8px);
        height: 200px;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        &:hover {
            .uploadArea {
                background: darken(#f2f2f2, 5%);
                border: 2px dashed  darken(#e3e3e3, 5%);
            }
        }
        .uploadArea {
            position: absolute;
            pointer-events: none;
            background: #f2f2f2;
            border: 2px dashed #e3e3e3;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
            outline: none;
            display: flex;
            align-items: center;
            text-align: center;
            justify-content: center;
        }
        input {
            width: 100%;
            height: 100%;
        }
    }
    .tablePadding{
        .ivu-table .table-info-row td,.ivu-table td,.ivu-table-cell{
            padding: 10px 0px;
            background-color: #2db7f5;
            color: #fff;
        }
    }
</style>
