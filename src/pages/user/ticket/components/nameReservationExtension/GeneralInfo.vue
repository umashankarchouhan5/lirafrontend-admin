<template>
    <div>
        <FormRow>
            <div class="col-sm-4">
                <InputText label="Approved Name" readonly v-model="ticket.ApprovedName"/>
            </div>
            <div class="col-sm-4">
                <InputDate 
                    readonly
                    v-model="ticket.ApprovedOn"
                    label="Approved On" />
            </div>
        </FormRow>
        
        
        <!-- <FormRow>
            <div class="col-sm-4">
                <InputText
                    readonly
                    type="number"
                    v-model="ticket.NumberOfExtension"
                    label="Number of Extension" />
            </div>
        </FormRow> -->
        <FormRow v-if="ticket.process_id != 99">
            <div class="col-sm-4">
                <InputDate 
                    readonly
                    v-model="ticket.ExpiryDate"
                    label="Expiry Date" />
            </div>
        </FormRow>
        
        <ButtonGroup>
            <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
        </ButtonGroup>
    </div>
</template>

<script>

    import InputDate from 'Components/form/InputDate'

    export default {
        name: "GeneralInfo",
        components: {
            InputDate,
        },
        data() {
            return {
                
            }
        },
        computed: {
            processId() {
                return this.$store.state.common.currentProcessId;
            },
            ticket() {
                return this.$store.state.ticket.ticket;
            },
        },
        watch: {
            
            
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

