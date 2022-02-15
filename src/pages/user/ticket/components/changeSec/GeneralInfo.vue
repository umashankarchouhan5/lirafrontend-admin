<template>
    <div>
        
        <FormRow>
            <div class="col-sm-3">
                <InputText rules="required"
                    readonly
                    label="License"
                    v-model="ticket.licenseeName" />
            </div>
            <div class="col-sm-6">
                <!-- <FormSelect rules="required"
                    disabled
                    label="Change Type"
                    :items="process_ids"
                    item-name="Name"
                    item-value="id"
                    v-model="ticket.process_id" /> -->
                    <InputText label="Change Type" v-model="ticket.pageTitle" />
            </div>
            
            <div class="col-sm-3">
                <InputDate label="Effective Date" rules="required" readonly v-model="ticket.EffectiveDate" />
            </div>
        </FormRow>
        <template v-if="ticket.process_id === 2048">
            <!-- <FormRow>
                <div class="col-sm-3">
                    <InputMonth name="Financial Year End Month" label="Old Financial Year End Month" readonly :clearable="true" v-model="ticket.FinancialYearEndMM" rules="required"/>
                </div>
            </FormRow> -->
            <FormRow>
                <div class="col-sm-3">
                    <InputMonth name="New Financial Year End Month" label="New Financial Year End Month" readonly :clearable="true" v-model="ticket.FinancialYearEndMM" rules="required" />
                </div>
            </FormRow>
        </template>
        <template v-if="ticket.process_id === 2046">
            <!-- <FormRow>
                <div class="col-sm-5">
                    <InputText name="Old Trade Name" label="Old Trade Name" readonly :clearable="true" v-model="ticket.TradeName" />
                </div>
            </FormRow> -->
            <FormRow>
                <div class="col-sm-5">
                    <InputText name="New Trade Name" label="New Trade Name" readonly :clearable="true" v-model="ticket.TradeName" rules="required"/>
                </div>
            </FormRow>
        </template>
        <template v-if="ticket.process_id === 2045">
            <!-- <FormRow>
                <div class="col-sm-8">
                    <AddressInput name="Old Principal Address" label="Old Principal Address" readonly :clearable="true" v-model="ticket.PrincipalAddress_id" />
                </div>
            </FormRow> -->
            <FormRow>
                <div class="col-sm-8">
                    <AddressInput name="New Principal Address" label="New Principal Address" readonly :clearable="true" v-model="ticket.PrincipalAddress_id" rules="required"/>
                </div>
            </FormRow>
        </template>
        <template v-if="ticket.process_id === 2044">
            <!-- <FormRow>
                <div class="col-sm-8">
                    <AddressInput name="Old Registered Address" label="Old Registered Address" readonly :clearable="true" v-model="ticket.PrincipalAddress_id" />
                </div>
            </FormRow> -->
            <FormRow>
                <div class="col-sm-8">
                    <AddressInput name="New Registered Address" label="New Registered Address" readonly :clearable="true" v-model="ticket.Address_id" rules="required"/>
                </div>
            </FormRow>
        </template>
        
        <template v-if="ticket.process_id === 2041">
            <!-- <h4>Old Auditor Data</h4> -->
            <br />
            <!-- <FormRow v-if="licenseData.AuditorJson !== undefined">
                <div class="col-sm-12">
                    <Records v-model="licenseData.AuditorJson" readonly />
                </div>
            </FormRow> -->
            <h4>New Auditor Data</h4>
            <br />
            <FormRow>
                <div class="col-sm-12">
                    <Records v-model="parsedAuditor" readonly />
                </div>
            </FormRow>
        </template>
        <template v-if="ticket.process_id === 2042">
            <!-- <h4>Old Legal Data</h4> -->
            <br />
            <!-- <FormRow v-if="licenseData.LegalJson !== undefined">
                <div class="col-sm-12">
                    <Records v-model="licenseData.LegalJson" readonly />
                </div>
            </FormRow>
            <h4>New Legal Data</h4> -->
            <br />
            <FormRow>
                <div class="col-sm-12">
                    <Records v-model="parsedLegal" readonly />
                </div>
            </FormRow>
        </template>
        <template v-if="ticket.process_id === 2043">
            <!-- <h4>Old Banker Data</h4> -->
            <br />
            <!-- <FormRow v-if="licenseData.LegalJson !== undefined">
                <div class="col-sm-12">
                    <BankerRecords v-model="licenseData.LegalJson" readonly />
                </div>
            </FormRow>
            <h4>New Banker Data</h4> -->
            <br />
            <FormRow>
                <div class="col-sm-12">
                    <BankerRecords v-model="parsedBanker" readonly />
                </div>
            </FormRow>
        </template>
        <FormRow>
            <div class="col-sm-12">
                <ButtonGroup>
                    <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
                </ButtonGroup>
            </div>
        </FormRow>

    </div>
</template>

<script>

    import InputDate from 'Components/form/InputDate';
    import AddressInput from 'Components/form/addressInput/AddressInput';
    import Records from './records';
    import BankerRecords from './bankerRecords';

    export default {
        name: "GeneralInfo",
        components: {
            InputDate,
            AddressInput,
            Records,
            BankerRecords
        },
        props: {
            mode: String,
            process_ids: Array,
        },
        data() {
            return {
                licenseData: [],
            }
        },
        computed: {
            ticket() {
                return this.$store.state.ticket.ticket;
            },
            parsedAuditor() {
                if(this.ticket.Auditor !== null && this.ticket.Auditor.length > 0){
                    return JSON.parse(this.ticket.Auditor)
                }else{
                    return []
                }
            },
            parsedLegal() {
                if(this.ticket.Legal !== null && this.ticket.Legal.length > 0){
                    return JSON.parse(this.ticket.Legal)
                }else{
                    return []
                }
            },
            parsedBanker() {
                if(this.ticket.Banker !== null && this.ticket.Banker.length > 0){
                    return JSON.parse(this.ticket.Banker)
                }else{
                    return []
                }
            },
        },
        watch: {

        },
        created() {
        },
        methods: {
            nextStep() {
                this.$emit('nextStep')
            },

        }
    }
</script>

<style lang="scss" module>

    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 13px;
        font-weight: 400;
    }

</style>
