<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Compliance Notes" slot="title" />
        <TicketHeader v-if="ticketValue" :ticketValue="ticketValue" />
        <ValidationObserver ref="observer" v-slot="{ passes }">
            <FormRow>
                <!-- <SideLogo></SideLogo> -->
                <!-- <div class="col-sm-3"></div> -->
                <div class="col-sm-9">
                    <div :class="$style.register">

                        <FormRow>
                            <div class="col-sm-12">
                                <InputTextArea rows="8" rules="required"  v-model="form.notes" label="Note"/>
                            </div>
                        </FormRow>
                        <FormRow>
                            <div class="col-sm-4">
                                <FormCheckbox v-model="form.restrict" :trueValue="1" :falseValue="0">
                                    Restrict
                                </FormCheckbox>
                            </div>
                        </FormRow>

                        <div :class="$style.button">
                            <ButtonGroup>
                                <FormButton type="success" v-if="$route.params.company_id" @click="passes(formSubmit)">Save</FormButton>
                                <FormButton type="info"  @click="() => backToList()">Cancel</FormButton>
                            </ButtonGroup>
                        </div>
                        <div :class="$style.clearFix"></div>
                    </div>

                    
                </div>
            </FormRow>
        </ValidationObserver>
            <Popup :value="successModal.visible" :title="successModal.title" type="success" :closable="false" :maskable="false" @close="() => successModal.visible = false">
                <div>
                    {{ successModal.message }}
                </div>
                <div slot="footer">
                    <FormButton @click="() => backToList()">Back to List</FormButton>
                </div>
            </Popup>
        </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import {saveCompanyCompliance, getCompanyComplianceById, getCompanyById } from "../api";
    import { ValidationObserver } from "vee-validate";
    import PageTitle from 'Components/layout/PageTitle';
    import loadingMixin from 'Mixins/loadingMixin';

    export default {
        name: "CompanyCompliance",
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle,
            ValidationObserver,
        },
        data() {
            return {
                companyLogo: '',
                onSubmitError: false,
                form: {
                    notes: '',
                    restrict: '',
                    company_id: '',
                    id: '',
                },
                warningModal: {
                    visible: false,
                    title: '',
                    message: ''
                },
                successModal: {
                    visible: false,
                    title: 'Success',
                    message: ''
                },
                modals: {
                    success: {
                        isVisible: false,
                        step: 1,
                        message: ''
                    },
                    failure: {
                        isVisible: false,
                        step: 1,
                        message: ''
                    }
                },
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                entityCreated: false,
                is_readonly : false,
                emailSent: false,
                otp: {
                    isModalVisible: false,
                },
                terms: {
                    success: {
                        isVisible: false,
                        message: ''
                    }
                },
                CompanyName: '',
                CompanyRegNo: '',
                Entitytype: '',
                ticketValue: null,
            }
        },
        computed: {
            
            userData() {
                return this.$store.state.user.user
            }
        },
        created() {
            this.company_id = this.$route.params.company_id;
            this.id = this.$route.params.id;
            if(typeof this.id !== 'undefined'){
                this.getDataById();
            }
            this.getCompanyDataById();
        },
        methods: {
            getCompanyDataById() {
                getCompanyById({id: this.company_id}).then(res => {
                    this.CompanyName = res.data.Name;    
                    this.CompanyRegNo = res.data.CompanyRegNo;
                    this.Entitytype = res.data.Entitytype;
                    this.ticketValue = {
                        First: this.CompanyRegNo,
                        Second: this.Entitytype,
                        Third: this.CompanyName
                    }
                })
            },
            getDataById(){
                getCompanyComplianceById({id: this.id}).then(res => {
                            this.form.notes = res.data.notes;
                            this.form.restrict = parseInt(res.data.ComplianceStatus);
                        })
            },
            formSubmit() {
                this.form.company_id = this.company_id;
                if(typeof this.id !== 'undefined'){
                    this.form.id = this.id;
                    saveCompanyCompliance(this.form).then(this.handleResponse)
                } else {
                    saveCompanyCompliance(this.form).then(this.handleResponse)
                }
            },
            handleResponse(response) {
                this.successModal.message = 'Company compliance is saved successfully';
                this.showSuccessModal(true);
            },
            showSuccessModal(val){
                this.successModal.visible = val;
            },
            backToList(){
                this.$router.push(`/company/compliance/${this.company_id}`);
            }
        }
    };
</script>

<style lang="scss" module>
    .registerSuccess {
        text-align: center;
        img {
            display: block;
            margin: 40px auto;
        }
        h1 {
            margin-bottom: 20px;
        }
        h4 {
            margin-bottom: 15px;
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
        }
    }

    .register {
        padding-top: 30px;
        // width: 600px;
        margin: 0 auto 0 0;
        h4 {
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
            margin-bottom: 25px;
        }
    }

    .na {
        margin-top: 10px;
        display: block;
    }
    .account {
        padding-top: 12px;
    }
    .agreement {
        margin: -10px 0 30px;
    }
    .terms{
        h3{
            margin: 15px 0px;
        }
        p{
            text-align: justify;
        }
    }
    .showPurposeMessage{
        font-size: 11px;
        margin-top: 10px;
        color: #3c8dbc;
    }
    .clearFix{
        clear: both;
        padding: 30px;
    }
    .info {
        background: #d7d6da;
        box-shadow: 0 2px 2px #00000059;
        padding: 0 15px;
        display: flex;
        font-size: 13px;
        margin: -39px -30px 30px;
        line-height: 35px;
        justify-content: center;
        z-index: 4;
        position: sticky;
        top: 34.5px;
        & .infoBlock:nth-child(1){
            text-align: left;
            margin: 0px auto 0xp 0px;
            width: 33.33%
        }
        & .infoBlock:nth-child(2){
            text-align: center;
            margin: 0px auto;
            width: 33.33%
        }
        & .infoBlock:nth-child(3){
            text-align: right;
            margin: 0px 0px 0px auto;
            width: 33.33%
        }
    }
</style>
