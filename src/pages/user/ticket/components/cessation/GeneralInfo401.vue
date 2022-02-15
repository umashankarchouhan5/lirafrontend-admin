<template> 
    <div>
        <FormRow>
            <div class="col-sm-2" >
                <InputText  label="Entity Type" readonly rules="required"  v-model="ticket.EntityType" />
            </div> 
            <div class="col-sm-2" >
                <InputText rules="required"  label="Reg #" readonly  v-model="ticket.CompanyRegNo" />
            </div>
            <div class="col-sm-6" >
                <InputText
                    label="Company Name"
                    rules="required"
                    readonly
                    v-model="ticket.CompanyName" />
            </div>
        </FormRow>
        <template v-if="ticket.process_id == 401">
            
            <FormRow>
                <div class="col-sm-6">
                    <RadioGroup v-model="ticket.Solvent_insolvent" disabled>
                        <Radio label="S" disabled rules="required">
                            Solvent
                        </Radio>
                        <Radio label="I" disabled>
                            Insolvent
                        </Radio>
                    </RadioGroup> 
                </div>
            </FormRow>
            <FormRow  >
                <div class="col-sm-3">
                    <InputDate rules="required" label="Resolution Date" readonly  v-model="ticket.EffectiveDate"  />
                </div>
            </FormRow>
        </template>   
        <template v-else>
            <FormRow >
                <div class="col-sm-3">
                    <InputDate rules="required" label="Effective Date" readonly  v-model="ticket.EffectiveDate"  />
                </div>
            </FormRow>

        </template>
         
        <FormRow >
            <div class="col-sm-3">
                <InputText rules="required" readonly label="Liquidator Name"  v-model="ticket.Liquidator"  />
            </div>
            <div class="col-sm-7">
                <InputText rules="required" readonly label="Liquidator Name"  v-model="ticket.liquidatorAddress"  />
            </div>
        </FormRow>
            
        <!-- <FormRow>
            <div class="col-sm-4" >
                <FormSelect label="Select Reason" disabled rules="required" :items="reasons" item-name="Name" item-value="id"  v-model="ticket.cessationReason_id"  />
            </div> 
        </FormRow> -->
        <!-- <FormRow >
            <div class="col-sm-12">
                <InputTextArea  label="Reason" rows="5" readonly  v-model="ticket.cessationReason"  />
            </div>
        </FormRow> -->
        
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
    import { RadioGroup, Radio } from 'view-design'

    export default {
        name: "CessationRequest",
        components: {
            InputDate,
            RadioGroup,
            Radio,
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
