<template>
    <div :class="$style.block">
        <p>Beginning with your present occupation or employment, please list all occupations and employment during the last 10 years including the full name and addresses of the employers, the nature of the businesses, the positions held and the relevant dates. Kindly provide the latest employment reference from the list below (NB: The Authority may seek references from previous employers.)</p>
        <EmployerRecords v-model="records.Emplr" :pq-id="ticket.id" />
        <br>
        <p>Details of any body corporate of which you are a Director or Secretary.</p>
        <DirectorRecords v-model="records.Direc" :pq-id="ticket.id" />
        <br>
        <p>Details of any Trust on which you are the trustee, enforcer or protector in a personal capacity.</p>
        <TrusteeRecords v-model="records.Trust" :pq-id="ticket.id" />
        <br>
        <p>Details of any body corporate of which you are in partnership, have other business interests or affiliations</p>
        <PartnerRecords v-model="records.Partn" :pq-id="ticket.id" />
        <br>
        <p>Details of any previous approvals as a key person by a relevant financial services regulatory authority (or equivalent) in any jurisdiction (if applicable), including Seychelles.</p>
        <KeyPersonRecords v-model="records.KPer" :pq-id="ticket.id" />
        <br>
        <p>Details of any previous applications made by you, or any body corporate, partnership or unincorporated institution with which you are, or have been  associated as a director, controller, key person or company secretary, to carry on any financial services activity whether successful or not.</p>
        <PrevApplnRecords v-model="records.PrevA" :pq-id="ticket.id" />
        <br>
        <ButtonGroup>
            <FormButton type="primary" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
            <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
        </ButtonGroup>
    </div>
</template>

<script>
    import EmployerRecords from './EmployerRecords'
    import DirectorRecords from './DirectorRecords'
    import TrusteeRecords from './TrusteeRecords'
    import KeyPersonRecords from './KeyPersonRecords'
    import PartnerRecords from './PartnerRecords'
    import PrevApplnRecords from './PrevApplnRecords'

    export default {
        name: "CareerHistory",
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
        props: ['value'],
        data() {
            return {
                time: [
                    {
                        id: 'F',
                        name: 'Full Time'
                    },
                    {
                        id: 'P',
                        name: 'Part Time'
                    }
                ],
                agree: ['Yes', 'No'],
                period: ['None', '1 Month', '6 Months']
            }
        },
        methods: {
            nextStep() {
                this.$emit('nextStep')
            },
            prevStep() {
                this.$emit('prevStep')
            }
        },
        components: {
            TrusteeRecords,
            KeyPersonRecords,
            PartnerRecords,
            PrevApplnRecords,
            EmployerRecords,
            DirectorRecords
        }
    }
</script>

<style lang="scss" module>
    .block {
        h6 {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 20px;
        }
        p {
            text-align: justify;
            margin-bottom: 20px;
        }
        ol {
            padding-left: 40px;
            margin-bottom: 20px;
            li {
                margin-bottom: 10px;
            }
        }
    }
</style>
