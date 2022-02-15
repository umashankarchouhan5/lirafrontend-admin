<template>
    <div :class="$style.block">
        <p>
            <strong>
                If any of the answers to questions below are "Yes", please upload full details relating to the question. Please note that no time restrictions apply to the matters you are asked to disclose. Any convictions and other facts must be stated. The questions refer to all jurisdictions and countries, and your answers should not be restricted to any one jurisdiction in isolation. Declaring a conviction etc. should not be seen as an automatic bar to licensing, as all matters are judged individually on their merits.
            </strong>
        </p>

        <CivilDisciplinaryItem v-for="(item, i) in checklist" v-model="checklist[i]" :key="i" :i="i" >
            {{ item.QText }}
        </CivilDisciplinaryItem>
        <br>
        <p>Provide details of all banks (or other financial institutions) which you have conducted your financial affairs over the previous five years.</p>

        <BankRecords v-model="records.Bank" :pq-id="ticket.id" />
        <br>
        <ButtonGroup>
            <FormButton type="primary" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
            <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
        </ButtonGroup>
    </div>
</template>

<script>

    import CivilDisciplinaryItem from './CivilDisciplinaryItem'
    import BankRecords from './BankRecords'

    export default {
        name: "CivilDisciplinary",
        props: ['value'],
        components: {
            CivilDisciplinaryItem,
            BankRecords
        },
        computed: {
            checklist() {
                return this.$store.state.ticket.checklist;
            },
            ticket() {
                return this.$store.state.ticket.pqRead;
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
            },
        }
    }
</script>

<style lang="scss" module>
    .block {
        p {
            margin-bottom: 20px;
        }
    }
</style>
