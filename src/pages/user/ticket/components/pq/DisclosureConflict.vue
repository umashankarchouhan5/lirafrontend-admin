<template>
    <div :class="$style.block">
        <p><strong>Please be advised that the information provided below will not affect your
            application.
            It is requested so that the  Authority can identify and manage potential conflicts of interest, both in the handling of this application
            and in any  future dealings with your organization.</strong></p>
        <p>Do you have any close connection with a member or  employee
            of the  Authority  (for  example,  friends,  close  business  relationship  or  immediate  family
            which includes spouse, partner, children and their  spouses or partners, parents or siblings)<span class="text-danger">*</span>
        </p>
        <FormRow>
            <div class="col-sm-8">
                <InputTextArea disabled rows="3"  v-model="ticket.Conflict" />
            </div>
        </FormRow>
        <p>Please disclose any other facts that you believe are material to the Authority in considering your application.</p>
        <FormRow>
            <div class="col-sm-8">
                <InputTextArea disabled rows="5" v-model="ticket.OtherFact" />
            </div>
        </FormRow>
        <ButtonGroup>
            <FormButton type="primary" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
            <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
        </ButtonGroup>
    </div>
</template>

<script>
    export default {
        name: "DisclosureConflict",
        props: ['value'],
        computed: {
            ticket() {
                return this.$store.state.ticket.ticket;
            },
            records() {
                return this.$store.state.ticket.records;
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

<style lang="scss" module>
    .block {
        p {
            text-align: justify;
            margin-bottom: 20px;
        }
    }
</style>
