<template>
    <FormWrapper :is-loading="isLoading">
        <!-- <PageTitle title="Document Masters" slot="title" :link="`/help/${processId}`"/> -->
        <PageTitle title="Strike Off" slot="title" />
         <div :class="$style.filter">
             <div :class="$style.filterItem">
                <FormSelect :width="200" label="Status" :items="filtering.statuses" item-name="name" item-value="id" v-model="filtering.status_id"  />
            </div> 
            <!-- <div :class="$style.filterItem">
                <FormSelect :width="200" label="Entity Type" :items="filtering.entityTypes" item-name="Name" item-value="Name" v-model="filtering.EntityType"  />
            </div> -->
            <div :class="$style.filterItem">
                <FormSelect :width="200" label="Reason" :items="filtering.reasons" item-name="Name" item-value="id" v-model="filtering.reason_id"  />
            </div>
            <div :class="$style.filterItem">
                <FormSelect :width="200" label="ICSP" :items="filtering.icsps" item-name="name" item-value="id" v-model="filtering.icsp_id"  />
            </div>
         </div>
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

            <FormButton style="margin-top: 5px" type="primary" @click="search" :rounded="true">
                <Icon type="ios-search" />
            </FormButton>
        </div>
        <DataTable :actions="true"
            :data="StrikeOffList"
            :columns="tableColumn()"
            :is-loading="isLoading"
            @on-selection-change="selectChange"
            @on-page-change="pageChange"
            :pagination="pagination"
            v-if="isSearched"
            @on-sort-change="sortChange">
            <template slot="actionsLeft">
                <TableButton @click="() => addStrikeOff()">
                    <img src="../../../../assets/images/plus.png" />
                    Add
                </TableButton>
                <TableButton @click="() => editStrikeOff()">
                    <img src="../../../../assets/images/edit.png" />
                    Edit
                </TableButton>
                <TableButton @click="() => openDelete()" >
                    <img src="../../../../assets/images/del.png" />
                    Delete
                </TableButton>
                <TableButton @click="() => openPublication(1)">
                    <img src="../../../../assets/images/Update.png" />
                    Update First Publication Details
                </TableButton>
                <TableButton @click="() => openPublication(2)" >
                    <img src="../../../../assets/images/Update.png" />
                    Update Second Publication Details
                </TableButton>
                <!-- <TableButton @click="() => generate()">
                    <img src="../../../../assets/images/plus.png" />
                    Generate Letter
                </TableButton> -->
            </template>
        </DataTable>

        <!--Publication popup -->
        <Popup title="Publication" :value="publicationModal.visible" @close="() => showPublicationModal(false)">
            <b>{{ publicationModal.title }}</b>
            <ValidationObserver ref="publicationValidator">
                <FormRow>
                    <div class="col-sm-10">
                        <InputText label="Gazette" rules="required" v-model="publicationModal.gazette" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-10">
                        <InputDate type="date" rules="required" label="Publication Date" :options="options" v-model="publicationModal.date" />
                    </div>
                </FormRow>
            </ValidationObserver>
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

        <Popup title="View Mail" :value="viewPopup" width="700" @close="() => viewPopup = false">
            <div :class="$style.popupRow">
                <InputText label="To " :readonly="true" v-model="viewAttachData.ToEmail" :maxlength="200" />
            </div>
            <div :class="$style.popupRow">
                <InputText label="Subject" :readonly="true" v-model="viewAttachData.Subject" :maxlength="200" />
            </div>
            <div :class="$style.popupRow">
                <InputText label="CC" :readonly="true" v-model="viewAttachData.CC" :maxlength="200" />
            </div>
            <FormRow>
                <Loader v-if="!viewAttachData.Body" />
                <div class="col-sm-12" v-else>
                    <EditorComponent v-model="viewAttachData.Body" readonly/>
                </div>
            </FormRow>
            <div :class="$style.popupRow" v-if="viewAttachData.ScannedJson">
                <div v-for="(file,index) in scannedData({val:viewAttachData.ScannedJson})" :key="index">
                    <a :href="file.ScannedfileURL" target="blank"> {{file.Filenameprefix}} </a>
                </div>
            </div>
        </Popup>
        <Popup title="Delete"  :value="deleteModal.visible" @close="() => showDelete(false)">
            Are you sure you want to selete this record ?
            <div slot="footer">
                <FormButton type="success" @click="() => deleteStrikeOff()">Confirm</FormButton>
                <FormButton @click="() => showDelete(false)">Cancel</FormButton>
            </div>
        </Popup>
        <Popup title="Success" type="success" :value="successModal.visible" @close="() => successModal.visible =false">
            {{ successModal.message }}
            <div slot="footer">
                <FormButton @click="() => successModal.visible = false">Ok</FormButton>
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
    import tableColumn from './table';
    import loadingMixin from 'Mixins/loadingMixin';
    import { CESSATION  } from 'Config/processIds';
    import { getStrikeOffList, getCompany, getICSP, updateStrikeOffGazette, getCompanyStatus, getEntityType, getStrikeOffReason, fetchMailoutById, deleteStrikeOffByAdminUser } from '../api';
    import { ValidationObserver } from 'vee-validate';

    export default {
        name: "StrileOff",
        mixins: [loadingMixin],
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
                    processNames: [],
                    dates: '',
                    processNameSelected: null,
                    icsps: [],
                    reason_id: null,
                    reasons: [],
                    icsp_id: null,
                    EntityType: 'IBC',
                    entityTypes: [],
                    CompanyRegNo: '',
                    Name: '',
                    company_id: null,
                    status_id: null,
                    statuses: [],
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
                successModal: {
                    visible: false,
                    message: ''
                },
                StrikeOffList: [],
                tableData: [],
                tableColumn,
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
                },
                viewPopup: false,
                viewAttachData: [],
                isSearched: false,
                deleteModal: {
                    visible: false
                }
            }
        },
        created() {
          this.getFilterValues();
        //   this.getDataByFilter();
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
            openDelete(){
                if (this.validateSelectedLength(1)) {
                    this.showDelete(true);
                }
            },
            showDelete(val){
                this.deleteModal.visible = val;
            },
            deleteStrikeOff() {
                if (this.validateSelectedLength(1)) {
                    deleteStrikeOffByAdminUser({company_id: this.selectedRows[0].company_id}).then(
                        () => {
                            this.showDelete(false);
                            this.selectedRows = [];
                            this.getDataByFilter();
                            this.successModal.message = 'This record have been deleted';
                            this.successModal.visible = true;
                        }
                    )
                }
            },
            scannedData({val}){
                return JSON.parse(val);
            },
            openMailBox(val){
                fetchMailoutById({mailout_id: val}).then(
                    res => {
                        this.viewAttachData = res.data[0]
                        this.viewPopup = true;
                    }
                )
            },
            addStrikeOff(){
                this.$router.push('/strikeOffForm');
            },
            editStrikeOff() {
                if (this.validateSelectedLength(1)) {
                    this.$router.push(`strikeOff/${this.selectedRows[0].company_id}`)
                }
            },
            generate(val){
                const data ={
                    NoticeNumber: val,
                    mode: 1
                }
                // generateRRANotice(data).then(
                //     res =>{
                //         var myWindow=window.open('','','width=900,height=900');
                //         myWindow.document.write(res.data);
                //     }
                // )
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
                this.$refs.publicationValidator.validate().then(result =>{
                    if(result){
                        const pub = this.publicationModal;
                        
                        const ids = this.selectedRows.map(row => row.id).join(', ');
                        const data = {
                            PublicationNumber: pub.publicationNumber,
                            PublicationDate: pub.date,
                            Gazette: pub.gazette,
                            idString: ids
                        }
                        updateStrikeOffGazette(data).then(
                            res => {
                                this.getDataByFilter();
                                this.showPublicationModal(false);
                                this.selectedRows = [];
                                this.publicationModal.date = null;
                                this.publicationModal.gazette = '';
                            }
                        )

                    }
                })
            },
            resetPublication(){
                this.publicationModal.gazette = '';
                this.publicationModal.date= null;
                this.publicationModal.title= '';
                this.publicationModal.publicationNumber= 0;
            },
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            getFilterValues() {
                this.showLoader();
                Promise.all([
                    getICSP({is_csp: true}),
                    getCompanyStatus(),
                    // getEntityType(),
                    getStrikeOffReason({process_id: CESSATION}),
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.filtering.icsps = response[0].data;
                this.filtering.statuses = response[1].data;
                // this.filtering.entityTypes = response[2].data;
                this.filtering.reasons = response[2].data;
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

                filters.company_id = this.filtering.company_id;
                filters.EntityType = this.filtering.EntityType;
                filters.icsp_id = this.filtering.icsp_id;
                filters.reason_id = this.filtering.reason_id;
                filters.status_id = this.filtering.status_id;

                const data = {
                    // user_id: this.userData.user_id,
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
                getStrikeOffList(data)
                    .then(this.handleResponse)
                    .catch(this.handleError)
            },
            handleResponse(response) {
                this.hideLoader();
                this.isSearched = true;
                this.StrikeOffList = response.data[0];
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
    
    .popupRow {
        padding: 5px 0 15px;
    }

</style>
