<template>
    <div>
        <FormRow>
            <div class="col-sm-12">
                <h6>Contingent and Prospective Liability Coverage. </h6>
                <InputTextArea
                    rows="3"
                    readonly
                    v-model="ticket.LiabilityCoverage"
                    label="(Please provide a brief description of how contingent and prospective liabilities will be covered)" />
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-12">
                <h6 :class="$style.flexClass"> Financial year ends on last day of 
                    <div :class="$style.monthWidth">
                        <InputMonth name="Financial Year End Month" readonly v-model="ticket.financialYearEndMonth" />
                    </div> 
                month<span class="text-danger">*</span></h6>
            </div>
        </FormRow>
        <h6>Financial Details</h6>
        <FormRow>
            <div class="col-sm-4">
                <InputAmount readonly label="Capital of Applicant" v-model="ticket.Capital"/>
            </div>
            <div class="col-sm-4">
                <div :class="$style.selectSource">
                    <FormCheckbox disabled :true-value="1" :false-value="0" v-model="ticket.ownerequityYN">Owner Equity</FormCheckbox>
                    <FormCheckbox disabled :true-value="1" :false-value="0" v-model="ticket.shareholderequityYN">Shareholder Equity</FormCheckbox>
                    <FormCheckbox disabled :true-value="1" :false-value="0" v-model="ticket.LoanYN">Loan</FormCheckbox>
                </div>
            </div>
        </FormRow>
        <div v-if="owner">
            <h6>Owner Equity</h6>
            <p >Applicant shall have and maintain a fully paid-up share capital of SR 150,000 if
                providing corporate services, and SR 250,000 if providing International Trustee Services.
            </p>
            <br />
        </div>
        <div v-if="share">
            <h6>Shareholder Equity</h6>
            <p>Applicant shall have and maintain a fully paid-up share capital of SR 150,000 if
                providing corporate services, and SR 250,000 if providing International Trustee Services.</p>
            <br />
        </div>
        <div v-if="loan">
            <h6>Loan</h6>
            <p class="mb-0">Applicant shall have and maintain a fully paid-up share capital of SR 150,000 if
                providing corporate services, and SR 250,000 if providing International Trustee Services.</p>
            <br />
        </div>
        <h6>Source of Capital
            <span v-if="ticket.EntityType.toLowerCase() == 'icsp'" :class="$style.notesStyle">(Applicant shall have and maintain a fully paid-up share capital of SCR 150,000 if providing corporate services, and SCR 250,000 if providing international trustee services.)</span>
            <span v-if="ticket.EntityType.toLowerCase() == 'itsp'" :class="$style.notesStyle">(Applicant shall have and maintain a fully paid-up share capital of SCR 250,000 and proof of the same shall be made readily available if and when requested by the Authority. Include overdraft or other bank facilities to accommodate unforeseen expenses or liabilities.)</span>
            <span v-if="ticket.EntityType.toLowerCase() == 'fsp'" :class="$style.notesStyle">(The applicant shall have and maintain a fully paid-up share capital of SCR 200,000 (or its equivalent in any other currency) and proof of the same shall be made readily available if and when requested by the Authority. Include overdraft or other bank facilities to accommodate unforeseen expenses or liabilities.)</span>
        </h6>
        <FormRow>
            <div class="col-sm-12">
                <Record  v-model="ticket.SOC.SOC" pqId="''" />
            </div>
        </FormRow>
        <h6>Proposed Employment Size</h6>
        <FormRow>
            <div class="col-sm-4">
                <InputText readonly label="Local" v-model="ticket.EsizeLocal"/>
            </div>
            <div class="col-sm-4">
                <InputText readonly label="Expatriates" v-model="ticket.ESizeEx"/>
            </div>
            <div class="col-sm-4">
                <!-- Calculated field -->
                <InputText readonly label="Total" v-model="ticket.ESizeTotal"/>
            </div>
        </FormRow>
        <h6>Forecasted Cash Flows</h6>
        <FormRow>
            <div class="col-sm-4">
                <InputAmount readonly label="Annual Revenue (US $)" v-model="ticket.ForecastAnnualRevenue"/>
            </div>
            <div class="col-sm-4">
                <InputAmount readonly label="Domestic Expenditure (US $)" v-model="ticket.ForecastDomesticUSD"/>
            </div>
            <div class="col-sm-4">
                <InputAmount readonly label="Domestic Expenditure (SCR)" v-model="ticket.ForecastDomesticSCR"/>
            </div>
        </FormRow>
        
        <FormRow>
            <div class="col-sm-12">
                <InputTextArea readonly v-model="ticket.ProposedIndemnityCover" label="Details of Proposed Professional Indemnity Cover" :maxlength="5000" rows="5" rules="required" />
            </div>
        </FormRow>
        
        <ButtonGroup>
            <FormButton type="primary" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
            <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
        </ButtonGroup>
    </div>
</template>

<script>
    import Record from './component/Record';
    export default {
        name: "FinancialInfo",
        data() {
            return {
                owner: false,
                share: false,
                loan: false
            }
        },
        components:{
            Record
        },
        props:{
            readonly: Boolean
        },
        computed:{
            ticket() {
                return this.$store.state.ticket.ticket;
            },
        },
        watch: {
            'ticket.ownerequityYN': function(newVal) {
                this.owner = this.ticket.ownerequityYN;
                return this.owner;
            },
            'ticket.shareholderequityYN': function(newVal) {
                this.share = this.ticket.shareholderequityYN;
            },
            'ticket.LoanYN': function(newVal) {
                this.loan = this.ticket.LoanYN;
            },
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
    .notesStyle {
        font-style: italic;
        font-size: 13.5px;
    }
    .selectSource {
        display: flex;
        justify-content: space-between;
    }
    .monthWidth{
        max-width: 120px;
        width: 120px;
        margin: 0px 10px;
        position: relative;
    }
    .flexClass {
        display: flex;
        align-items: center;
    }
</style>
