<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Name Reservation" slot="title" />
        <TicketHeader  :ticketValue="ticketValue" v-if="nameList[0]" />

         <div :class="$style.filter">
            <div :class="$style.filterItem">
                <InputText style="width: 200px" label="Company Name" noApostrophe v-model="filtering.CompanyName" />
            </div>
            <div :class="$style.filterItem">
                <FormButton style="margin-top: 5px" type="primary" @click="search" :rounded="true">
                    <Icon type="ios-search" />
                </FormButton>
            </div>
        </div>
        <DataTable :actions="true"
            :data="nameList"
            :columns="config"
            :is-loading="isLoading"
            @on-selection-change="selectChange"
            @on-page-change="pageChange"
            :pagination="pagination"
            @on-sort-change="sortChange"
        >
            <template slot="actionsLeft">
                <TableButton @click="() => editEntity('edit')">
                    <img src="../../../../assets/images/edit.png" />
                    Edit
                </TableButton>
                <TableButton @click="() => generateLetterFunc()" >
                    <img src="../../../../assets/images/mail.png" />
                    Generate Letter
                </TableButton>
            </template>
            <!-- <template slot="actionsRight">
                <TableButton @click="() => {$router.push('/nameReservation')}">
                    <img :class="$style.reverseImage" src="../../../../assets/images/next.png" />
                    Go Back
                </TableButton>
                <TableButton @click="() => search()">
                    <img src="../../../../assets/images/renewal.png" />
                    Refresh
                </TableButton>
            </template> -->
        </DataTable>
        
<!-- Add New PopUp -->
        <ValidationObserver v-slot="{ passes }" ref="entityValidator">
            <Popup :title="currentEntity.title"
                width="500"
                :closable="false"
                :maskClosable="false"
                :value="entityModal.visible"
                @close="() => showEntityModal(false)"
            >
                <Loader v-if="entityModal.isLoading" />
                
                <div :class="$style.filterItem">
                    <FormAutoComplete v-model="currentEntity.icspName"
                        :onSearch="searchICSP1"
                        :onSelect="selectICSP1"
                        label="Service Provider"
                        item-name="name"
                        item-value="name"
                        :clearable="true"
                        rules="required"
                        :disabled="currentEntity.mode === 'edit'"
                        :items="icspFiltered" />
                </div>

                <FormRow>
                    <div class="col-sm-5">
                        <FormSelect label="Entity Type"
                            rules="required"
                            :items="filtering.entityTypes"
                            item-value="Name"
                            item-name="Name"
                            v-model="currentEntity.EntityType"/>
                    </div>
                </FormRow>
                <div :class="$style.popupRow">
                    <InputText label="Proposed name"
                               v-model="currentEntity.ProposedName"
                               :maxlength="200"
                               :rules="validationConfig[currentEntity.EntityType]"/>
                </div>
                <div :class="$style.popupRow">
                    <InputText label="Foreign Name"
                               :maxlength="200"
                               :rules="currentEntity.attachmentfile || currentEntity.document_file ? 'required' : null"
                               v-model="currentEntity.ForeignName"/>
                </div>

                <div :class="$style.popupRow">
                    <div :class="$style.currentEntityFile" v-if="currentEntity.Translationfile && currentEntity.Translationfile !== null && currentEntity.Translationfile !== ''">
                        <a :href="currentEntity.Translationfile" target="_blank">
                            <Icon type="md-eye" />
                            {{ currentEntity.Translationfile }}
                        </a>
                        <span @click="removeCurrentEntityFile" :class="$style.icon">
                            <img src="../../../../assets/images/changes.png" height="15px" alt="">
                        </span>
                    </div>
                    <div :class="$style.currentEntityFile" v-else>
                        <InputFile  @onChange="uploadFileHandler" :value="currentEntity.attachmentfile" :rules="{required:currentEntity.ForeignName ? true : false, docCheck:'pdf,jpg,jpeg,png', checkFileRegex: true}" />
                        
                        <span @click="changeToOriginal" :class="$style.icon">
                            <img src="../../../../assets/images/changes.png" height="15px" alt="">
                        </span>
                    </div>
                </div>
                <div :class="$style.popupRow" v-if="currentEntity.mode === 'respond'">
                    <InputTextArea label="Comment:" rules="required" v-model="currentEntity.comment" rows="3" />
                </div>
                <template slot="footer">
                    <FormButton type="success" @click="passes(addEntityHandler)">Save</FormButton>
                    <FormButton @click="() => showEntityModal(false)">Cancel</FormButton>
                </template>
            </Popup>
        </ValidationObserver>

        <ValidationObserver v-slot="{ passes }" ref="reReserveValidator">
            <Popup title="ReReserve"
                   width="500"
                   :closable="false"
                   :maskClosable="false"
                   :value="reserveModal.visible"
                   @close="() => showReReserveModal(false)">
                <Loader v-if="reserveModal.isLoading" />
                
                <FormRow>
                    <div class="col-sm-5">
                        <InputText label="Enter Name Id"
                            type="number"
                            v-model="reReserve.Name_id"
                            :maxlength="200"
                            @keyup.native="searchReReserveByEnter" 
                            @focusout="searchReReserveByTab"
                            rules="required"/>
                    </div>
                    
                    <div class="col-sm-7">
                        <InputText label="Entity Name"
                            v-model="reReserve.entityName"
                            disabled/>
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12">
                        <FormAutoComplete v-model="reReserve.icspName"
                            :onSearch="searchICSP2"
                            :onSelect="selectICSP2"
                            label="Service Provider"
                            item-name="name"
                            item-value="name"
                            :clearable="true"
                            rules="required"
                            disabled
                            :items="reReserve.icspFiltered" />
                    </div>
                </FormRow>
                
                <template slot="footer">
                    <FormButton type="success" @click="passes(reserveHandler)">ReReserve</FormButton>
                    <FormButton @click="() => showReReserveModal(false)">Cancel</FormButton>
                </template>
            </Popup>
        </ValidationObserver>
        
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
    import config from './table';
    import loadingMixin from 'Mixins/loadingMixin';
    import { ValidationObserver } from "vee-validate";
    import { getEntityType, getNameList, createByAdmin, updatedetailsByAdmin, ReReserve, fetchNameforNameId, getApprovedNames, generateLetter, sendLetter } from '../api'
    
    const DEFAULT_STATUS = 43;
    const NEW_ENTITY = {
        title: 'Add Entity',
        mode: 'add',
        EntityType: null,
        ProposedName: '',
        ForeignName: '',
        comment: '',
        attachmentfile: null,
        icsp_id: '',
        icspName: '',
    };
    const RERESERVE = {
        title: 'ReReserve',
        mode: 'reReserve',
        Name_id: '',
        icsp_id: '',
        icspName: '',
        icspFiltered: [],
        entityName: '',
    };


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
                    statuses: [],
                    statusSelected: null,
                    entityTypes: [],
                    entityTypeSelected: null,
                    dates: '',
                    ICSPResults: [],
                    ICSPResultsFiltered: [],
                    ICSPSelectedID: null,
                    CompanyName: '',
                    ICSPSelectedName: '',
                    processes: [],
                    processID: null,
                    batch_id: null,
                },
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
                    message: '',
                    TicketReference: null,
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
                nameList: [],
                tableData: [],
                config,
                docList: [],
                upList: [],
                selectedRows: null,
                bulkUploadFiles: {
                    files: [],
                },
                error:{
                    areAllUploaded: false
                } ,
                currentEntity: JSON.parse(JSON.stringify(NEW_ENTITY)),
                entityModal: {
                    isLoading: false,
                    visible: false,
                },
                reReserve: JSON.parse(JSON.stringify(RERESERVE)),
                reserveModal: {
                    isLoading: false,
                    visible: false,
                },
                validationConfig: {
                    LP: 'required|nameReservation_LP',
                    IBC: 'required|nameReservation_IBC',
                    Foundation: 'required|nameReservation_Foundation',
                    Trust: 'required|nameReservation_Trust'
                },
                entities: [],
                icspFiltered: [],
                changedFileName: '',
                refresh: false,
                emailData: {},
                emailSend: {
                    popupVisible: false,
                    message: ''
                },
                emailModal: {
                    visible: false,
                },
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
            ticketValue() {
                if(this.nameList[0]){
                    return {
                        First: this.nameList[0].EntityType,
                        Second: this.nameList[0].ICSPName,
                        Third: this.nameList[0].batch_id
                    }
                }
                return false
            }
        },
        created() {
            this.filtering.batch_id = this.$route.params.batchId ? this.$route.params.batchId : null;
            this.getFilterValues();
            this.getDataByFilter();
            window.addEventListener("storage", this.localStorageRefreshEvent);
        },
        beforeDestroy(){
            window.removeEventListener("storage", this.localStorageRefreshEvent);
            if(localStorage.refreshNameReservation){
                localStorage.removeItem('refreshNameReservation')
            }
        },
        watch: {
        },
        methods: {
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
                    BatchId: this.filtering.batch_id,
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
            generateLetterFunc(){
                //30 - Approved Status || 31 - Rejected Status
                const checkAllNames = this.nameList.every( item => item.Status_id == 30 || item.Status_id == 31 )
                if(checkAllNames){
                    const data = {
                        BatchId: this.filtering.batch_id,
                    }
                    generateLetter(data).then(
                        res=> {
                            this.emailData = res.data;
                            this.showEmailModal(true);
                        }
                    )
                }
                else{
                    this.warningModal.message = 'Please process all names requests before generating letter.';
                    this.showWarningModal(true);
                }

            },
            localStorageRefreshEvent(event){
                if(localStorage.refreshNameReservation){
                    var refreshValue = JSON.parse(localStorage.getItem('refreshNameReservation'))
                    if(refreshValue === true){
                        this.search();
                        localStorage.removeItem('refreshNameReservation')
                    }
                }
            },
            searchReReserveByEnter(event){
                if(event.keyCode === 13){
                    this.searchNameId('reReserve');
                }
            },
            searchReReserveByTab(){
                this.searchNameId('reReserve');
            },
            searchTransferByEnter(event){
                if(event.keyCode === 13){
                    this.searchNameId('transfer');
                }
            },
            searchTransferByTab(){
                this.searchNameId('transfer');
            },
            searchNameId(type){
                const data = {
                    Name_id: type=== 'transfer' ? this.transfer.Name_id : this.reReserve.Name_id
                }
                fetchNameforNameId(data).then(
                    res => {
                        if(type === 'transfer'){
                            this.transfer.FromIcsp_id = res.data[0][0].icsp_id;
                            this.transfer.fromIcspName = res.data[0][0].ICSP;
                            this.transfer.entityName = res.data[0][0].Name;
                        }
                        else if(type === 'reReserve'){
                            this.reReserve.icsp_id = res.data[0][0].icsp_id;
                            this.reReserve.icspName = res.data[0][0].ICSP;
                            this.reReserve.entityName = res.data[0][0].Name;
                        }
                    }
                )
            },
            // reReserve
            reserveHandler(){
                const { Name_id, icsp_id } = this.reReserve;
                const data ={
                    Name_id,
                    icsp_id,
                }
                
                this.reserveModal.isLoading = true;
                ReReserve(data).then(
                    response => {
                        this.reserveModal.isLoading = false;
                        this.showReReserveModal(false);
                        this.modalSuccess.message = response.message;
                        this.showSuccessModal(true);
                        this.getDataByFilter();
                    }
                )
            },
            
            showReReserveModal(value) {
                this.$refs.reReserveValidator.reset();
                this.reserveModal.visible = value;
            },
            reReserveOpen(){
                
                this.setReReserve(JSON.parse(JSON.stringify(RERESERVE)));
                this.showReReserveModal(true);
            },
            setReReserve(data) {
                this.reReserve = data;
            },


            // Add Entity Methods START
            addNewEntity() {
                this.setCurrentEntity(JSON.parse(JSON.stringify(NEW_ENTITY)));
                this.showEntityModal(true);
            },
            addEntityHandler() {
                this.currentEntity.ProposedName = this.currentEntity.ProposedName.trim();
                const formData = new FormData();
                for (let key in this.currentEntity) {
                    if (this.currentEntity.hasOwnProperty(key)) {
                        formData.append(key, this.currentEntity[key]);
                    }
                }
                const modes = {
                    add: createByAdmin,
                    edit: updatedetailsByAdmin,
                }
                const action = modes[this.currentEntity.mode];
                this.entityModal.isLoading = true;
                action(formData)
                    .then(this.addEntitySuccessHandler)
                    .catch(() => {
                        this.entityModal.isLoading = false;
                    });
            },
            addEntitySuccessHandler(response) {
                this.entityModal.isLoading = false;
                this.showEntityModal(false);
                this.getDataByFilter();
                if(response.data[0].TicketReference){
                    this.modalSuccess.TicketReference = response.data[0].TicketReference;
                }
                this.modalSuccess.message = response.message;
                this.showSuccessModal(true);
            },

            // Edit Entity Methods START
            editEntity(mode) {
                if (this.validateSelectedLength(1)) {
                    const row = this.selectedRows[0];
                    if(row.Status_id == 30 || row.Status_id == 31){
                        this.warningModal.message = "The name has been processed already and can not be edited.";
                        this.warningModal.visible = true;
                    }
                    else{
                        const { EntityType, ProposedName, ForeignName, id, Translationfile, document_file, icsp_id, ICSPName } = this.selectedRows[0];
                        const currentEntity = {
                            title: 'Edit Entity',
                            EntityType,
                            ProposedName,
                            ForeignName: ForeignName || '',
                            mode,
                            id,
                            comment: '',
                            attachmentfile: null,
                            document_file,
                            Translationfile,
                            icsp_id,
                            icspName:ICSPName,
                            Name_id: id,
                        };
                        this.setCurrentEntity(currentEntity);
                        this.showEntityModal(true);
                    }
                    
                }

            },
            // Edit Entity Methods END

            setCurrentEntity(entity) {
                this.currentEntity = entity;
            },
            showEntityModal(value) {
                this.$refs.entityValidator.reset();
                this.entityModal.visible = value;
            },
            removeCurrentEntityFile() {
                this.changedFileName = this.currentEntity.Translationfile;
                this.currentEntity.Translationfile = null;
            },
            changeToOriginal() {
                this.currentEntity.Translationfile = this.changedFileName;
                this.changedFileName = '';
            },
            uploadFileHandler(file) {
                this.currentEntity.attachmentfile = file;
            },
            
            selectICSP4(name) {
                this.transfer.ToIcsp_id = this.transfer.toIcspFiltered.find(item => item.name === name).id;
            },
            searchICSP4(value) {
                if (value.length > 2) {
                    this.transfer.toIcspFiltered = this.filtering.ICSPResults.filter(item => {
                        return item.name !== null ? item.name.toLowerCase().includes(value.toLowerCase()) : false;
                    })
                } else {
                    this.icspFiltered = []
                }
            },
            selectICSP3(name) {
                this.transfer.FromIcsp_id = this.transfer.fromIcspFiltered.find(item => item.name === name).id;
                getApprovedNames({icsp_id: this.transfer.FromIcsp_id, EntityType: 'IBC'}).then(
                    res => {
                        this.transfer.names = res.data;
                    }
                )
            },
            searchICSP3(value) {
                if (value.length > 2) {
                    this.transfer.fromIcspFiltered = this.filtering.ICSPResults.filter(item => {
                        return item.name !== null ? item.name.toLowerCase().includes(value.toLowerCase()) : false;
                    })
                } else {
                    this.icspFiltered = []
                }
            },
            selectICSP2(name) {
                this.reReserve.icsp_id = this.reReserve.icspFiltered.find(item => item.name === name).id;
            },
            searchICSP2(value) {
                if (value.length > 2) {
                    this.reReserve.icspFiltered = this.filtering.ICSPResults.filter(item => {
                        return item.name !== null ? item.name.toLowerCase().includes(value.toLowerCase()) : false;
                    })
                } else {
                    this.icspFiltered = []
                }
            },
            selectICSP1(name) {
                this.currentEntity.icsp_id = this.icspFiltered.find(item => item.name === name).id;
            },
            searchICSP1(value) {
                if (value.length > 2) {
                    this.icspFiltered = this.filtering.ICSPResults.filter(item => {
                        return item.name !== null ? item.name.toLowerCase().includes(value.toLowerCase()) : false;
                    })
                } else {
                    this.icspFiltered = []
                }
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

            getFilterValues() {
                this.showLoader();
                Promise.all([
                    getEntityType(),
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.filtering.entityTypes = response[0].data;
            },
            selectCompany(name) {
                this.filtering.companySelectedID = this.filtering.companyResultsFiltered.find(item => item.Name === name).id;
            },
            searchCompany(value) {
                if (value.length > 2) {
                    this.filtering.companyResultsFiltered = this.filtering.companyResults.filter(item => {
                        return item.name !== null ? item.name.toLowerCase().includes(value.toLowerCase()) : false;
                    })
                } else {
                    this.filtering.companyResultsFiltered = []
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
                this.showLoader();
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;

                const filters = {};

                filters.CompanyName = this.filtering.CompanyName;
                filters.batch_id = this.filtering.batch_id;

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
                getNameList(data)
                    .then(this.handleResponse)
                    .catch(this.handleError)
            },
            handleResponse(response) {
                this.hideLoader();
                if(response.can !== undefined && response.can === 0){
                    this.$router.push('/unauthorize')
                }
                else{
                    this.nameList = response.data[0];
                    this.pagination.total = response.data[1][0].NumberOfRecords;

                }
            },
            handleError(err) {
                this.hideLoader();
            },
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            showPrintModal(value) {
                this.printModal.visible = value;
            },
            showUploadModal(value) {
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
    .reverseImage {
        transform: rotateY(180deg);
    }

</style>
