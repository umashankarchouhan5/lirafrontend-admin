<template>
    <div>
        <FormRow>
            <div class="col-sm-6">
                <InputText rules="required"
                    readonly
                    label="Change Type"
                    v-model="ticket.ProcessName" />
            </div>
        </FormRow>
        <div v-if="ticket.process_id === 357">
            <CompanyPerson v-model="ticket" :personData="JSON.parse(ticket.PeopleJson)" />
        </div>
        
         <ButtonGroup>
            <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
        </ButtonGroup>
    </div>
</template>

<script>

    import CompanyPerson from './components/CompanyPersons';

    export default {
        name: "GeneralInfo",
        components: {
            CompanyPerson,
        },
        computed: {
            ticket() {
                return this.$store.state.ticket.ticket;
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

