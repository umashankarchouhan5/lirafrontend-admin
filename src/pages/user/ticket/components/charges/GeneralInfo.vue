<template>
    <div>
        <FormRow>
            <div class="col-sm-4">
                <InputText label="Charge Title" readonly v-model="ticket.ChargeTitle" rules="required" />
            </div>
            <div class="col-sm-4">
                <InputDate label="Charge Registration Date" readonly v-model="ticket.ChargeDate" rules="required" />
            </div>
            <div class="col-sm-4">
                <InputText label="Charge Registration Time" readonly :value="computedTime" rules="required" />
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-4">
                <InputText label="Chargee Name" readonly v-model="ticket.ChargeeName" rules="required" />
            </div>
            <div class="col-sm-4">
                <AddressInput label="Chargee Address" readonly v-model="ticket.ChargeeAddress" rules="required" />
            </div>
            <div class="col-sm-4">
                <InputText label="Charge Type" readonly v-model="ticket.chargetype" rules="required"  />
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-4">
                <InputText label="Name of Instrument" readonly v-model="ticket.InstrumentName" rules="required" />
            </div>
            <div class="col-sm-4">
                <InputDate label="Date of Instrument" readonly v-model="ticket.InstrumentDate" rules="required" />
            </div>
            <!-- <div class="col-sm-4">
                <InputText label="Liability Secured Amount" readonly v-model="ticket.LiabilitySecured" rules="required" />
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
    
    import AddressInput from 'Components/form/addressInput/AddressInput';
    import InputDate from 'Components/form/InputDate';
    // import InputTime from 'Components/form/InputTime';

    export default {
        name:'ChargeGeneralInfo',
        components: {
            InputDate,
            // InputTime,
            AddressInput,
        },
        computed: {
            ticket() {
                return this.$store.state.ticket.ticket;
            },
            computedTime(){
                var timeFormat = this.ticket.ChargeTime;
                if(timeFormat.includes('.')){
                    timeFormat = timeFormat.split('.')[0];
                }
                return timeFormat;
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
            },
        }
    }
</script>
