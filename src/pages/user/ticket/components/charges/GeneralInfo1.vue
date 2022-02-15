<template>
    <div>
        <FormRow>
            <div class="col-sm-4">
                <InputDate label="Discharge Date " readonly v-model="ticket.DischargeDate" rules="required" />
            </div>
        </FormRow>
        
            <FormRow>
            <div class="col-sm-4">
                <InputText label="Charge Title" v-model="ticket.ChargeTitle" rules="required" readonly />
            </div>
            <div class="col-sm-4">
                <InputDate label="Charge Registration Date"  v-model="ticket.ChargeDate" readonly rules="required" />
            </div>
            <div class="col-sm-4">
                <InputTime label="Charge Registration Time" v-model="ticket.ChargeTime" readonly rules="required" />
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-4">
                <InputText label="Chargee Name" v-model="ticket.ChargeeName" readonly rules="required" />
            </div>
            <div class="col-sm-4">
                <AddressInput label="Chargee Address" v-model="ticket.ChargeeAddress" readonly rules="required" />
            </div>
            <div class="col-sm-4">
                <InputText label="Charge Type"  v-model="ticket.chargetype" readonly rules="required"  />
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-4">
                <InputText label="Name of Instrument" v-model="ticket.InstrumentName" readonly rules="required" />
            </div>
            <div class="col-sm-4">
                <InputDate label="Date of Instrument"  v-model="ticket.InstrumentDate" readonly rules="required" />
            </div>
            <!-- <div class="col-sm-4">
                <InputText label="Liability Secured Amount " v-model="ticket.LiabilitySecured" readonly rules="required" />
            </div> -->
        </FormRow>
        <FormRow>
            <div class="col-sm-6">
                <InputTextArea label="Short description of Liability Secured" rows="3" :maxlength="5000" readonly v-model="ticket.LiabilitySecured" rules="required" />
            </div>
            <div class="col-sm-6">
                <InputTextArea label="Details of Prohibition/Restriction" rows="3" :maxlength="5000" readonly v-model="ticket.Prohibition" rules="required"  />
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-12">
                <InputTextArea label="Description of Property Charged" rows="5" :maxlength="10000" readonly v-model="ticket.PropertyCharged" rules="required"  />
            </div>
        </FormRow>
        
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
    import InputTime from 'Components/form/InputTime';
    import AddressInput from 'Components/form/addressInput/AddressInput';

    export default {
        name:'ChargeGeneralInfo1',
        components: {
            InputDate,
            InputTime,
            AddressInput,
        },
        computed: {
            ticket() {
                return this.$store.state.ticket.ticket;
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
