<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Allot IBC Registration Number" slot="title" />
        <ValidationObserver ref="validator" >
            <div :class="$style.filter" v-if="!isIcspSelected">
                <div :class="$style.filterItem">
                    <FormSelect :width="350" label="Select ICSP" :items="filtering.ICSP" item-name="name" item-value="id" :clearable="false" v-model="filtering.icspSelected" />
                </div>
                <div :class="$style.filterItem">
                    <FormButton style="margin-top: 5px" type="primary" @click="search" :rounded="true">
                        <Icon type="ios-search" />
                    </FormButton>
                </div>
            </div>
            <div v-else>
                <div :class="$style.filter" >
                    <div :class="$style.filterItem">
                        <InputText v-model="filtering.CompanyName" label="Company Name" />
                    </div>
                    <div :class="$style.filterItem">
                        <InputText v-model="filtering.TicketReference" label="# Reference"  rules="alphaNumCustom" />
                    </div>
                    <div :class="$style.filterItem">
                        <FormSelect :width="300" label="CSP" :items="filtering.ICSP" item-name="name" item-value="id" :clearable="false" v-model="filtering.icspSelected" />
                    </div>
                    <div :class="$style.filterItem">
                        <FormButton style="margin-top: 5px" type="primary" @click="search" :rounded="true">
                            <Icon type="ios-search" />
                        </FormButton>
                    </div>
                </div>
                <br />
                <DataTable :actions="true"
                        :data="companies"
                        :columns="tableColumn"
                        :is-loading="isLoading"
                        @on-selection-change="selectChange"
                        @on-page-change="pageChange"
                        :pagination="pagination"
                        @on-sort-change="sortChange">
                    <template slot="actionsLeft">
                        <TableButton @click="() => allotOpen()">
                            <img src="../../../../assets/images/eye.png" />
                            Allot
                        </TableButton>
                    </template>
                </DataTable>
            </div>
        </ValidationObserver>

<!-- Email Popup -->
        <Popup title="Email to Send" width="700" :value="emailModal.visible" :mask-closable="false" :closable="false" @close="() => showEmailModal(false)">

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
            <div slot="footer">
                <FormButton  @click="() => sendEmail()">Send</FormButton>
                <FormButton  @click="() => showEmailModal(false)">Close</FormButton>
            </div>
        </Popup>

<!-- Message popup -->
        <Popup title="Information" :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.cancel" @click="() => showWarningModal(false)">Cancel</FormButton>
                <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
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
    import tableColumn from './table';
    import loadingMixin from 'Mixins/loadingMixin';
    import { getICSP, getEntityType, getInclistAdmin, AllotUniqueNumberAdmin, SendEmailByAdmin } from '../api';
    import { ValidationObserver } from 'vee-validate'
    
    export default {
        name: "AllotUnique",
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle,
            DataTable,
            ValidationObserver
        },
        data() {
            return {
                filtering: {
                    status: [],
                    statusSelected: null,
                    ICSP: [],
                    icspSelected: null,
                    entityTypes: [],
                    entityTypeSelected: null,
                    CompanyName: null,
                    TicketReference: null,
                },
                sorting: {
                    key: 'icsp_id',
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
                allotModal: {
                    visible: false,
                    message: 'Are you sure you want Allot these IBC Registration Number ?'
                },
                emailModal: {
                    visible: false,
                },
                companies: [],
                tableData: [],
                tableColumn,
                selectedRows: [],
                isIcspSelected: false,
                emailData: {},
                emailSend: {
                    popupVisible: false,
                    message: ''
                },
            }
        },
        created() {
          this.getFilterValues();
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        methods: {
            sendEmail(){
                const data ={
                    Subject: this.emailData.EmailSubject,
                    Body: this.emailData.EmailBody,
                    Toemail: this.emailData.ToEmail,
                    CC: this.emailData.CC,
                    EmailTemplate_id: this.emailData.Emailtemplate_id
                }
                SendEmailByAdmin(data).then(
                    res=> {
                        this.emailSend.message = res.message;
                        this.emailSend.popupVisible = true;
                        this.selectedRows = [];
                        this.showEmailModal(false);
                        this.getDataByFilter();
                    }
                )
            },
            showEmailModal(val){
                this.emailModal.visible = val;
            },
            allotOpen(){
                if(this.validateSelectedLength()){
                    
                    var ids = [];
                    this.selectedRows.forEach(element => {
                        ids.push(element.reference_id);
                    });
                    const data = {
                        icsp_id: this.filtering.icspSelected,
                        idstring: ids.toString()
                    }
                    AllotUniqueNumberAdmin(data).then(
                        res=> {
                            this.emailData = res.data[0][0];
                            this.showEmailModal(true);
                        }
                )
                }
            },
            allot(){
                var ids = [];
                this.selectedRows.forEach(element => {
                    ids.push(element.reference_id);
                });
                const data = {
                    icsp_id: this.filtering.icspSelected,
                    idstring: ids
                }
                AllotUniqueNumberAdmin(data).then(
                    res=> {
                        this.emailData = res.data[0][0];
                        this.showEmailModal(true);
                    }
                )
            },
            showAllotModal(val){
                this.allotModal.visible = val;
            },
            getFilterValues() {
                this.showLoader();
                Promise.all([
                    getEntityType(),
                    getICSP({entityType: 'IBC'}),
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.filtering.entityTypes = response[0].data;
                this.filtering.ICSP = response[1].data;
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
                
                setTimeout(() => {
                    this.$refs.validator.validate().then((result) => {
                        if (result ) {
                            this.showLoader();
                            const { key, order } = this.sorting;
                            const { perPage, page } = this.pagination;
                            const filters = {};

                            // Ignore other filters if we have RegNo
                            if (this.filtering.TicketReference) {
                                filters.TicketReference = this.filtering.TicketReference;
                                filters.icsp_id = this.filtering.icspSelected;
                            } else {
                                filters.CompanyName = this.filtering.CompanyName;
                                filters.status_id = 201;
                                filters.icsp_id = this.filtering.icspSelected;
                                filters.EntityType = this.filtering.entityTypeSelected;
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
                            getInclistAdmin(data)
                                .then(this.handleResponse)
                        }
                    })
                },
                50
                )
            },
            handleResponse(response) {
                this.hideLoader();
                this.isIcspSelected = true;
                this.companies = response.data[0];
                this.pagination.total = response.data[1][0].NumberOfRecords;
            },
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            validateSelectedLength(value) {
                if (this.selectedRows.length === value) {
                    return true;
                }
                if (this.selectedRows.length === 0) {
                    this.warningModal.message = 'Select at least one row!';
                    this.showWarningModal(true);
                    return false
                }
                if (value === 1 && this.selectedRows.length !== 1) {
                    this.warningModal.message = 'Select one row please.';
                    this.showWarningModal(true);
                    return false
                }
                return true;
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
         flex: 0 0 150px;
        margin: 0 20px 20px 0;
    }
    .popupRow {
        padding: 5px 0 15px;
    }
</style>
