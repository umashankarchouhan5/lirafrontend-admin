<template>
    <div :class="$style.block">
        <p>Details of any higher academic qualifications and the year in which they were obtained. (E.g. BA, LLB,
            MBA, etc.). Please provide certified true copies of certificates in relation to the qualifications
            obtained. In the event that the applicant is unable to provide proof of a stated qualification, the
            Authority would not consider the stated qualification in its assessment.</p>
        <AcadQualificationsRecords readonly :pq-id="ticket.id" v-model="records.AQual" v-if="records" />
        <br>
        <p>Details of any professional qualifications and the year in which they were obtained (E.g. ACA, ACCA, ACIB
            etc.). Please provide certified true copies of certificates in relation to the qualifications obtained.
            Part Qualifications may also be included provided that they are indicated accordingly. In the event that
            the applicant is unable to provide proof of a stated qualification, the Authority would not consider the
            stated qualification in its assessment.</p>
        <ProfQualificationsRecords
                readonly
                :pq-id="ticket.id"
                v-model="records.PQual"
                v-if="records" />
        <br>
        <p>Details of current membership of any relevant professional bodies, their contact details and year of
            admission (e.g. Institute of Directors, Institute of Management, etc.).</p>
        <CurrentMembershipRecords :pq-id="ticket.id"
                                  v-model="records.CMemb"
                                  v-if="records" />
        <br>
        <p>Details of any relevant training undertaken (e.g. AML/ CFT Training, Compliance Training, etc.)</p>
        <TrainingRecords :pq-id="ticket.id"
                         v-model="records.Train"
                         v-if="records" />
        <br>
        <ButtonGroup>
            <FormButton type="primary" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
            <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
        </ButtonGroup>
    </div>
</template>

<script>

    import AcadQualificationsRecords from './AcadQualificationsRecords'
    import ProfQualificationsRecords from './ProfQualificationsRecords'
    import CurrentMembershipRecords from './CurrentMembershipRecords'
    import TrainingRecords from './TrainingRecords'

    export default {
        name: "Qualifications",
        components: {
            AcadQualificationsRecords,
            ProfQualificationsRecords,
            CurrentMembershipRecords,
            TrainingRecords,
        },
        props: ['value', 'qualificationTypes', 'stepId'],
        computed: {
            countries() {
                return this.$store.state.common.countries;
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
            }
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
