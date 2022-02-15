<template>
    <div >
        <FormRow>
            <div class="col-sm-3">
                <InputText v-model="ticket.govtEntityName" readonly label="Organization" />
            </div>
            <div class="col-sm-3">
                <InputDate v-model="ticket.requestDate" readonly label="Requested Date" />
            </div> 
        </FormRow>
        <FormRow>
            <div class="col-sm-3">
                <InputText v-model="ticket.requestLetterReference" readonly label="Request Reference" maxlength="100" />
            </div>
            <div class="col-sm-3">
                <FormSelect label="RFI Type" disabled :items="rfiTypes" item-name="Name" item-value="id" v-model="ticket.RFIType" />
            </div>
            <div class="col-sm-3">
                <FormSelect label="RFI Nature" disabled :items="rfiNatures" item-name="Name" item-value="id" v-model="ticket.RFINature" />
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-4">
                <InputText v-model="ticket.RFIForName" readonly label="Name of Entity/ Individual" maxlength="100" />
            </div>
            <div class="col-sm-4">
                <InputText v-model="ticket.requestPurpose" readonly label="Purpose of Request" maxlength="100" />
            </div>
            <div class="col-sm-4">
                <InputDate v-model="ticket.Deadline" readonly label="Deadline" />
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-12">
                <InputTextArea v-model="ticket.RFIBrief" readonly label="Requested Information" rows="5" maxlength="1000" />
            </div>
        </FormRow>
        
        <ButtonGroup>
            <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
        </ButtonGroup>
    </div>
</template>

<script>
    import InputDate from 'Components/form/InputDate';
    import DateUtil from 'Utils/dateUtil';
    import { getRFIType, getRFINature } from '../../config/api'

    export default {
        name: "RFI",
        components: {
            InputDate,
        },
        data() {
            return {
                rfiNatures: [],
                rfiTypes: [],
            }
        },
        computed: {
            ticket() {
                return this.$store.state.ticket.ticket
            },
        },
        created() {
            this.getData();
        },
        watch: {
            
        },
        methods: {
            getData(){
                Promise.all([
                    getRFINature(),
                    getRFIType()
                ]).then(this.handleResponse);
            },
            handleResponse(response){
                this.rfiNatures = response[0].data;
                this.rfiTypes = response[1].data;
            },
            nextStep() {
                this.$emit('nextStep')
            },
        }
    }
</script>

<style lang="scss" module>


 

</style>
