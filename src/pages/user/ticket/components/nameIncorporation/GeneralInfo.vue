<template>
    <div>
        <div class="row">
            <div class="col-sm-6">
                <FormRow>
                    <div class="col-sm-12">
                        <InputText label="Proposed Name" readonly v-model="ticket.ProposedName"/>
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12">
                        <AddressInput name="Registered Office Address"
                            readonly
                            v-model="ticket.Address_id"
                            label="Registered Office Address"
                            rules="required" />
                        <br>
                    </div>
                </FormRow>
            </div>
            <div class="col-sm-6">
                <FormRow v-if="ticket.CompanyRegNo">
                    <div class="col-sm-12">
                        <InputText label="Company Reg #" readonly v-model="ticket.CompanyRegNo"/>
                    </div>
                </FormRow>
                <FormRow >
                    <div class="col-sm-12">
                        <div :class="$style.limitedBy">
                            <div :class="$style.limitedByLabel">
                                Company Limited By
                                <span :class="$style.error" >*</span>
                            </div>
                            <FormCheckbox :true-value="1"
                                :false-value="0"
                                :showAsterisk="false"
                                v-model="ticket.LimitedByShares"
                                disabled
                                name="LimitedByShares">
                                Shares
                            </FormCheckbox>
                            <FormCheckbox :true-value="1"
                                :false-value="0"
                                readonly
                                disabled
                                v-model="ticket.LimitedByGuarantee"
                                name="LimitedByGuarantee">
                                Guarantee
                            </FormCheckbox>
                        </div>
                        <div :class="$style.limitedByValues">
                            <div v-show="!!ticket.LimitedByShares || !!ticket.LimitedByGuarantee">
                                <InputText :rules="{ required: !!ticket.LimitedByShares || !!ticket.LimitedByGuarantee }"
                                    label="Currency"
                                    v-model="ticket.currency"
                                    readonly />
                            </div>
                            <div v-show="!!ticket.LimitedByShares">
                                <InputAmount :label="authorizedShareLabel"
                                    readonly
                                    v-model="ticket.AuthorizedShareCapital"
                                    :rules="{ required: !!ticket.LimitedByShares }"/>
                            </div>
                            <div v-show="!!ticket.LimitedByGuarantee">
                                <InputAmount :label="guaranteeLabel"
                                    readonly
                                    v-model="ticket.GuaranteeAmount"
                                    :rules="{ required: !!ticket.LimitedByGuarantee }"/>
                            </div>
                        </div>
                    </div> 
                    <br>
                    <div class="col-sm-12">
                        <FormCheckbox :true-value="1"
                                :false-value="0" v-model="ticket.ShareNoPar" disabled>
                            The company will issue shares with no par value
                        </FormCheckbox>
                    </div>
                </FormRow>
            </div>
        </div>
        
        <h6>Registered Agent (CSP)</h6>
        <FormRow>
            <div class="col-sm-6">
                <InputText label="Name" readonly :value="ticket.ICSPname"/>
            </div>
            <div class="col-sm-6">
                <AddressInput :value="ticket.Address_id"
                              readonly
                              label="Registered Office Address"/>
            </div>
        </FormRow>

        
        
        <ButtonGroup>
            <FormButton type="primary" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
            <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
        </ButtonGroup>
    </div>
</template>

<script>

    import AddressInput from 'Components/form/addressInput/AddressInput'

    export default {
        name: "GeneralInfo",
        components: {
            AddressInput,
        },
        data() {
            return {
                currency: '',
                sameAsICSPAddress: false,
                // registeredOfficeAddress: JSON.parse(JSON.stringify(this.ticket.regaddress_id)),
                limitedByOptions: ['Shares', 'Guarantee', 'Both'],
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                recordJson: [
                    {
                        Name: '',
                        ResidenceAddress: ''
                    }
                ]
            }
        },
        computed: {
            processId() {
                return this.$store.state.common.currentProcessId;
            },
            guaranteeLabel() {
                const currency = this.ticket.currency ? `in (${this.ticket.currency})` : ''
                return `Guarantee Amount ${currency}`
            },
            authorizedShareLabel() {
                const currency = this.ticket.currency ? `in (${this.ticket.currency})` : ''
                return `Authorized Share Capital ${currency}`
            },
            ticket() {
                return this.$store.state.ticket.ticket;
            },
        },
        watch: {
            
            'ticket.regaddress_id': function (newValue) {
                if (newValue !== this.ticket.Address_id) {
                    // this.registeredOfficeAddress = JSON.parse(JSON.stringify(newValue));
                }
            },
            recordJson:{
                // 
                deep: true,
                handler(val){
                    this.ticket.recordJSON = this.recordJson;

                }
            }
        },
        props: {
            steps: Array,
            readonly: Boolean,
            customErrors: Array,
            value: {
                type: Object,
                required: true,
            },
        },
        created(){
            if(this.ticket.invoice_id !== null){
                if( this.ticket.CompanyPeople !== null && this.ticket.CompanyPeople !== ''){
                    this.recordJson = this.ticket.recordJSON;
                }
            }
        },
        methods: {
            
            nextStep() {
                this.$emit('nextStep')
            },
            prevStep() {
                this.$emit('prevStep')
            }
        }
    }
</script>

<style lang="scss" module>

    .limitedBy {
        display: flex;
        height: 38px;
        align-items: center;
        margin-bottom: 20px;

        > * {
            margin-right: 40px;
        }
    }

    .limitedByValues {
        display: flex;
        margin-bottom: 20px;

        > * {
            width: 200px;
            margin-right: 20px;

            &:first-child {
                width: 80px;
            }
        }
    }

    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 13px;
        font-weight: 400;
    }

</style>
