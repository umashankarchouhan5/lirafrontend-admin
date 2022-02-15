<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Generate Invoice" slot="title" />

        <ValidationObserver ref="validator">
            
            <FormRow >
                <div class="col-sm-6">
                    <FormSelect v-model="form.license_id" :items="licenses" itemName="name" itemValue="id" label="Select Licensee" rules="required" />
                </div>
                <div class="col-sm-6" v-if="licenseSelected.email">
                    <InputText label="Licensee Email" v-model="licenseSelected.email" readonly />
                </div>
            </FormRow>
            <FormRow v-if="licenseSelected.mailinglabel && licenseSelected.mailinglabel !== null">
                <div class="col-sm-12">
                    <div v-html="licenseSelected.mailinglabel" />
                </div>
            </FormRow>
            <FormRow >
                <div class="col-sm-2">
                    <FormSelect rules="required"
                        label="Currency"
                        v-model="form.currency"
                        name="GI_currency"
                        :items="currencies"
                        item-value="code" item-name="code"/>
                </div>
            </FormRow>
            <SearchCompanyNew 
                v-if="form.license_id != null"
                v-model="form.company"
                :icsp_id="licenseSelected.icsp_id"
                icspIdRequired 
            />

            <!-- payment grid component -->
            <PaymentGrid v-model="form.feesArray"></PaymentGrid>

            <!-- <div :class="$style.total">
                <p><strong>Total : </strong>{{calculateTotal}}</p>
            </div> -->
            <FormRow :class="$style.tableRow">
                <div class="col-sm-3 col-sm-offset-9" :class="$style.baseFlex">
                    <p><strong>Total : </strong></p>
                    <p>{{calculateTotal}} </p>
                </div>
            </FormRow>
            
            
            <FormRow :class="$style.tableRow">
                
                <div class="col-sm-3 col-sm-offset-9" :class="$style.baseFlex">
                    <p><strong>Less Discount : </strong></p>
                    <InputAmount  v-model="form.discount" rightAlignText />
                </div>
            </FormRow>
            <FormRow :class="$style.tableRow">
                <div class="col-sm-3 col-sm-offset-9" :class="$style.baseFlex">
                    <p><strong>Net Total : </strong></p>
                    <p>{{calculateNetTotal}}</p>
                </div>
            </FormRow>
            <!-- Attachment component -->
            <Attachment v-model="form.attachmentArray" :notAllAttachmentSaved="errors.notAllAttachmentSaved" @notAllSavedFalse="changeNotAllSavedStatus" />
            
            <FormRow>
                <div class="col-sm-12">
                    <InputTextArea label="Comment" v-model="form.comment" />
                </div>
            </FormRow>
        </ValidationObserver>
        
        <ButtonGroup>
            <FormButton type="primary" @click="invoiceAction(0)" left-icon="ios-eye" >Preview</FormButton>
            <FormButton  left-icon="ios-send" type="success" @click="invoiceAction(1)" >Generate Invoice</FormButton>
        </ButtonGroup>

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
        <Popup title="Success" type="success" :value="successModal.visible"  @close="() => successModal.visible = false">
            {{ successModal.message }}
            <div slot="footer">
                <FormButton @click="() => successModal.visible = false">Ok</FormButton>
            </div>
        </Popup>

        <Popup  title="Send Email" width="1000" :value="emailModal.visible" :mask-closable="false" :closable="false" @close="() => openEmail(false)">
            <ValidationObserver ref="emailValidator">  
                <FormRow>
                    <div class="col-sm-12">
                        <InputText v-model="emailData.toEmail" readonly label="To Email:" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12">
                        <InputText v-model="emailData.subject" rules="required" label="Subject:" />
                    </div>
                </FormRow>
                <!-- <FormRow>
                    <div class="col-sm-12" v-if="email.CC && email.CC !== null">
                        <InputText v-model="email.CC" label="CC:" />
                    </div>
                </FormRow> -->
                <FormRow>
                    <div class="col-sm-12">
                        <EditorComponent v-model="emailData.EmailBody" /> 
                        
                    </div>
                </FormRow>
                <FormRow v-if=" emailData.attachments && emailData.attachments !== null ">
                    <div class="col-sm-12" v-for="(file,ind) in emailData.attachments" :key="ind" >
                        <a @click="openWindow(file.url)">{{file.name}}</a>
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12">
                        <ButtonGroup>
                            <FormButton left-icon="ios-send" type="success" @click="() => sendEmail(1)">Send</FormButton>
                        <FormButton left-icon="ios-close" type="primary" @click="() => openEmail(false)">Close</FormButton>
                        </ButtonGroup>
                    </div>
                </FormRow>
            </ValidationObserver>
        </Popup>

    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import loadingMixin from 'Mixins/loadingMixin';
    import { getICSPLicenses, generateReviewInvoiceAdmin, sendInvoiceAdminEmail } from './api'
    import PaymentGrid from './components/PaymentGrid';
    // import currenciesMixin from 'Mixins/currenciesMixin';
    import Attachment from 'Components/attachment';
    import { ValidationObserver } from 'vee-validate';

    export default {
        name: "GenerateInvoices",
        mixins: [ loadingMixin ],
        components: {
            FormWrapper,
            PageTitle,
            PaymentGrid,
            Attachment,
            ValidationObserver,
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
                successModal: {
                    visible: false,
                    message: ''
                },
                form: {
                    feesArray: [],
                    total: 0,
                    license_id: null,
                    currency: null,
                    attachmentArray: [],
                    comment: '',
                    isSubmit: 0,
                    discount: 0,
                    company: {
                        EntityType: null,
                        Name: '',
                        CompanyRegNo: '',
                        id: null,
                    },
                },
                licenses: [],
                licenseSelected: {},
                emailData: {},
                emailModal:{
                    visible: false
                },
                errors: {
                    notAllAttachmentSaved: false
                },
                currencies: [
                    { code: 'USD' },
                    { code: 'SCR' }
                ]
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
            calculateTotal() {
                let price =  (this.form.feesArray.length > 0 ? this.form.feesArray.reduce((a,b) => {return a + b.lineTotal}, 0) : 0);
                price =  new Intl.NumberFormat('en-US').format(price);
                return price;
            },
            calculateNetTotal() {
                let price =  (this.form.feesArray.length > 0 ? this.form.feesArray.reduce((a,b) => {return a + b.lineTotal}, 0) - this.form.discount : 0);
                // price = price - this.form.discount;
                price =  new Intl.NumberFormat('en-US').format(price);
                return price;
            }
        },
        watch: {
            'form.license_id': function(val) {
                if(val !== undefined && val !== null){
                    const selectedLicense = this.licenses.filter( item => item.id == val);
                    this.licenseSelected = selectedLicense[0];
                }
                else{
                    this.licenseSelected = {};
                }
            }
        },
        created() {
          this.getFilterValues();
        },
        methods: {
            changeNotAllSavedStatus(val) {
                this.errors.notAllAttachmentSaved = val;
            },
            openWindow(link){
                window.open(link, '_blank');
            },
            sendEmail(){
                this.$refs.emailValidator.validate().then(result => {
                    if(result){
                        this.showLoader()
                        sendInvoiceAdminEmail(this.emailData).then(
                            res => {
                                this.emailData = {};
                                this.form = {
                                    feesArray: [],
                                    total: 0,
                                    license_id: null,
                                    currency: null,
                                    attachmentArray: [],
                                    comment: '',
                                    isSubmit: 0,
                                    discount: 0,
                                    company: {
                                        EntityType: null,
                                        Name: '',
                                        CompanyRegNo: '',
                                        id: null,
                                    },
                                },
                                this.openEmail(false);
                                this.successModal.message = 'Email sent successfully.'
                                this.successModal.visible = true;
                                this.hideLoader();
                            }
                        )
                    }
                })
            },
            openEmail(val){
                this.emailModal.visible = val;
                if(val == false) {
                    this.emailData = {}
                }
            },
            invoiceAction(type) {
                this.$refs.validator.validate().then( result => {
                    if(result){
                        const checkAllAttachments = this.form.attachmentArray.every( item => item.fileUpload == null || item.fileUpload == undefined );
                        if(checkAllAttachments == true){
                            this.errors.notAllAttachmentSaved = false;
                            this.showLoader()
                            const { license_id, currency, feesArray, total, comment, attachmentArray, discount, company } = this.form;
                            const newAttachmentArray = attachmentArray.filter( item => item.url !== undefined);
                            const totalPrice = (feesArray.length > 0 ? feesArray.reduce((a,b) => {return a + b.lineTotal}, 0) - discount : 0);
                            const data = {
                                license_id,
                                currency,
                                feesArray,
                                total: totalPrice,
                                comment,
                                attachmentArray: newAttachmentArray.length > 0 && newAttachmentArray[0].name !== undefined && newAttachmentArray[0].name !== '' ? newAttachmentArray : [],
                                isSubmit: type,
                                discount,
                                mailinglabel: this.licenseSelected.mailinglabel,
                                company_id: company.id
                            }
                            generateReviewInvoiceAdmin(data).then(
                                res => {
                                    if(type == 0) window.open(res.data, '_blank');
                                    else if(type == 1) {
                                        this.form = {
                                            feesArray: [],
                                            total: 0,
                                            license_id: null,
                                            currency: null,
                                            attachmentArray: [],
                                            comment: '',
                                            isSubmit: 0,
                                            discount: 0,
                                            company: {
                                                EntityType: null,
                                                Name: '',
                                                CompanyRegNo: '',
                                                id: null,
                                            },
                                        },
                                        this.emailData = res.data;
                                        setTimeout(() => {
                                            this.openEmail(true);
                                        },300)
                                        
                                    }
                                    this.hideLoader();
                                },
                                err => {
                                    this.hideLoader();
                                }
                            )
                        }
                        else{
                            this.errors.notAllAttachmentSaved = true   
                        }
                    }
                })
            },
            sum(items, prop){
                return items.reduce( function(a, b){
                    return a + b[prop];
                }, 0);
            },
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            getFilterValues() {
                this.showLoader();
                Promise.all([
                    getICSPLicenses(),
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.licenses = response[0].data;
                this.hideLoader();
            },
            
            
        }
    }
</script>

<style lang="scss" module>
    .total {
        display: flex;
        justify-content: flex-end;
        width: 100%;
        // margin-right: 50px;
        padding-right: 50px;
        // margin-left: 50px;
    }
    .tableRow {
        margin: 0px 0px 25px;
        padding: 0px 45px 0px 0px;
        div > p > strong{
            min-width: 90px;
        }
    }
    .baseFlex{
        align-items: baseline;
        display: flex;
        // width: 100%;
        p:first-child {
            margin-right: 10px;
            min-width: 90px;
        }
        >:nth-child(2) {
            text-align: right;
            flex: 2 1 auto;
        }

    }

</style>
