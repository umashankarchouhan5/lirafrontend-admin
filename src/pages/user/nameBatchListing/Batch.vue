<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Name Reservation Batch Response" slot="title" />
        <div>
            <DataTable :actions="true"
                    :data="batches"
                    :columns="tableColumn"
                    :is-loading="isLoading"
                    @on-selection-change="selectChange">
                <template slot="actionsLeft">
                    <TableButton @click="() => generateLetter()">
                        <img src="../../../assets/images/eye.png" />
                        Generate Letter
                    </TableButton>
                </template>
            </DataTable>
        </div>

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
                <FormButton left-icon="ios-close" @click="() => showEmailModal(false)">Close</FormButton>
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
            <FormButton left-icon="ios-close" slot="footer" @click="() => emailSend.popupVisible = false">Close</FormButton>
        </Popup>

    </FormWrapper>
</template>

<script>
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import tableColumn from './table';
    import loadingMixin from 'Mixins/loadingMixin';
    import { fetchBatchResponse, generateLetter, sendLetter } from './api';
    
    export default {
        name: "NameReservationBatch",
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle,
            DataTable,
        },
        data() {
            return {
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
                batches: [],
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
            this.getData();
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            }
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
                    BatchId: this.selectedRows[0].BatchId,
                    process_id: 101,
                    attachment: this.emailData.Attachmentjson
                }
                sendLetter(data).then(
                    res=> {
                        this.emailSend.message = res.message;
                        this.emailSend.popupVisible = true;
                        this.showEmailModal(false);
                        this.getData();
                    }
                )
            },
            showEmailModal(val){
                this.emailModal.visible = val;
            },
            generateLetter(){
                if(this.validateSelectedLength(1)){
                    var row = this.selectedRows[0];
                    if(row.CountProcessed == row.CountSubmitted){
                        const data = {
                            BatchId: row.BatchId,
                        }
                        generateLetter(data).then(
                            res=> {
                                this.emailData = res.data;
                                this.showEmailModal(true);
                            }
                        )
                    }
                    else{
                        this.warningModal.message = 'All tickets have not been processed yet.';
                        this.showWarningModal(true);
                    }
                }
            },
            showAllotModal(val){
                this.allotModal.visible = val;
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            search(){
                this.pagination.page = 1;
                this.getData()
            },
            getData() {
                this.showLoader();
                
                fetchBatchResponse()
                    .then(this.handleResponse)
            },
            handleResponse(response) {
                this.hideLoader();
                this.batches = response.data;
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
