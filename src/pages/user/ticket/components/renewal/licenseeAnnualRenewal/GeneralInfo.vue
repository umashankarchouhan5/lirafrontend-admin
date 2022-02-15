<template>
    <div>
        <FormRow>
            <div class="col-sm-4" >
                <p><b>Last Renewal Date :</b> {{formatDate(ticket.LastrenewalDate)}}</p>
            </div>
            
            <div class="col-sm-4" >
                <p><b>Next Renewal Due Date :</b> {{formatDate(ticket.RenewalDueDate)}}</p>
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-2" >
                <InputText label="Next Renewal Due Year" readonly v-model="ticket.DueYear" />
                <!-- <p><b>Next Renewal Due Year :</b> {{value.DueYear}}</p> -->
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
    import DateUtil from 'Utils/dateUtil';
    export default {
        name: 'GeneralInfo',
        components: {
        },
        data(){
            return{

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
        computed: {
            ticket() {
                return this.$store.state.ticket.ticket;
            },
            
        },
        methods: {
            
            formatDate(value) {
                if (value !== null) {
                   return DateUtil.formatDate(value);
                }
                else  {
                    return value
                }
            },
            nextStep() {
                this.$emit('nextStep')
            },
        }
        
    }
</script>
