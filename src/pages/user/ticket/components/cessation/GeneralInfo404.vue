<template> 
    <div>
        <FormRow>
            <!-- <div class="col-sm-3" >
                <InputText  label="Entity Type" readonly rules="required"  v-model="ticket.EntityType" />
            </div> 
            <div class="col-sm-3" >
                <InputText rules="required"  label="Reg #" readonly  v-model="ticket.CompanyRegNo" />
            </div> -->
            <div class="col-sm-6" >
                <InputText
                    label="Company Name"
                    rules="required"
                    readonly
                    v-model="ticket.CompanyName" />
            </div>
            
            <div class="col-sm-3">
                <InputDate rules="required" readonly label="Dissolution Date"   v-model="ticket.EffectiveDate"  />
            </div>
        </FormRow>
            
        <FormRow >
            <div class="col-sm-3">
                <InputText readonly label="Liquidator Name"  v-model="ticket.Liquidator"  />
            </div>
            <div class="col-sm-7">
                <InputText readonly label="Liquidator Name"  v-model="ticket.liquidatorAddress"  />
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
        },
        methods: {
            nextStep() {
                this.$emit('nextStep')
            },
        }
    }
</script>

<style lang="scss" module>

</style>
