<template>
    <div>
        <div v-if="ticket.process_id === 115 || ticket.process_id === 346">
            <FormRow>
                <div class="col-sm-4">
                    <InputText v-model="ticket.CompanyName" label="Company Name" :maxlength="200" readonly />
                </div>
                <div class="col-sm-2">
                    <InputText v-model="ticket.CompanyRegNo" :maxlength="20" label="Company Reg No" readonly />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-6">
                    <AddressInput v-model="ticket.Address_id"  label="Company Address" readonly />
                </div>
                
            </FormRow>
            <FormRow>
                <div class="col-sm-4">
                    <InputText v-model="ticket.AuditorName" readonly label="Auditor Name" :maxlength="200" />
                </div>
                <div class="col-sm-2">
                    <InputText v-model="ticket.AuditorRegNo" readonly :maxlength="20" label="Auditor Reg No" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-6">
                    <InputText v-model="ticket.AuditorAddress"  label="Auditor Address" :maxlength="200" readonly />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-2">
                    <p>Current Year Revenue</p>
                </div>
                <div class="col-sm-2">
                    <InputAmount label="in SCR"  readonly  v-model="ticket.RevenueSCR" />
                </div>
                <div class="col-sm-2">
                    <InputAmount label="in USD" type="number" readonly v-model="ticket.RevenueUSD" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-2">
                    <p>Current Assets</p>
                </div>
                <div class="col-sm-2">
                    <InputAmount label="in SCR" type="number" readonly v-model="ticket.CurrentAsset" />
                </div>
                <div class="col-sm-2">
                    <p>Current Liability</p>
                </div>
                <div class="col-sm-2">
                    <InputAmount label="in SCR" type="number" readonly v-model="ticket.CurrentLiability" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-2">
                    <p>Total Asset</p>
                </div>
                <div class="col-sm-2">
                    <InputAmount label="in SCR" type="number"  readonly v-model="ticket.TotalAsset" />
                </div>
                <div class="col-sm-2">
                    <p>Total Liability</p>
                </div>
                <div class="col-sm-2">
                    <InputAmount label="in SCR" type="number"  readonly v-model="ticket.TotalLiability" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-2">
                    <InputAmount label="Liquid Asset" type="number" readonly v-model="ticket.LiquidAsset" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-2">
                    <InputAmount label="Total Equity" type="number" readonly v-model="ticket.TotalEquity" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-2">
                    <p>Current Year Profit Loss</p>
                </div>
                <div class="col-sm-2">
                    <InputAmount label="in SCR" type="number" readonly v-model="ticket.ProfitLossSCR" />
                </div>
                <div class="col-sm-2">
                    <InputAmount label="in USD" type="number" readonly v-model="ticket.ProfitLossUSD" />
                </div>
            </FormRow>
        </div>

        <div v-if="ticket.process_id === 116 || ticket.process_id === 347">
            <FormRow>
                <div class="col-sm-3" >
                    <InputDate label="Due Date" v-model="ticket.DueDate" readonly />
                </div>
                <div class="col-sm-3" >
                    <InputDate label="Requested Due Date" readonly v-model="ticket.RequestedDueDate"  />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-6" >
                    <InputTextArea :row="5" label="Reason For Extension" readonly v-model="ticket.ReasonForExtension"  />
                </div>
            </FormRow>
        </div> 
        <FormRow>
            <div class="col-sm-4">
                <ButtonGroup>
                    <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
                </ButtonGroup>
            </div>
        </FormRow>

    </div>
</template>

<script>

    import AddressInput from 'Components/form/addressInput/AddressInput';
    import InputDate from 'Components/form/InputDate';

    export default {
        name: "GeneralInfo",
        components: {
            AddressInput,
            InputDate,
        },
        created() {

        },
        computed: {
            ticket() {
                return this.$store.state.ticket.ticket;
            },
            
        },
        data() {
            return {
                entitySelected: false,
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                dateOptions: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                dataSelected: false,
            }
        },
        props: {
            mode: String,
            steps: Array,
            readonly: Boolean,
            customErrors: Array,
            value: {
                type: Object,
                required: true,
            },
        },
        methods: {
            nextStep() {
                this.$emit('nextStep')
            },
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
