<template> 
    <div>
        <FormRow >
            <div class="col-sm-4">
                <InputDate rules="required" label="Tentative Effective Date of Surrender of Licence" readonly  v-model="ticket.EffectiveDate"  />
            </div>
        </FormRow>
            
        <FormRow>
            <div class="col-sm-4" >
                <FormSelect label="Select Reason" disabled rules="required" :items="reasons" item-name="Name" item-value="id"  v-model="ticket.cessationReason_id"  />
            </div> 
        </FormRow>
        <FormRow >
            <div class="col-sm-12">
                <InputTextArea rules="required" label="Please provide the full disclosure of the reasons for the surrender of licence" rows="5" readonly  v-model="ticket.cessationReason"  />
            </div>
        </FormRow>
        <FormRow >
            <div class="col-sm-12">
                <InputTextArea rules="required" label="Please state below the measures being undertaken to discharge your liabilities and the transfer of business of your clients" rows="5" readonly  v-model="ticket.handoverMeasure"  />
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
    import { getStrikeOffReason } from '../../config/api'
    import { CESSATION  } from 'Config/processIds';

    export default {
        name: "CessationRequest",
        components: {
            InputDate,
        },
        data() {
            return {
                reasons: []
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
            ticket() {
                return this.$store.state.ticket.ticket;
            },
        },
        watch: {
        },
        created() {
            this.getReasons();
        },
        methods: {
            getReasons(){
                getStrikeOffReason({process_id: CESSATION}).then(
                    res => {
                        this.reasons = res.data;
                    }
                )
            },
            nextStep() {
                this.$emit('nextStep')
            },
        }
    }
</script>

<style lang="scss" module>

</style>
