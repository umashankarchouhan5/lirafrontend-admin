<template>
    <div :class="$style.block">
        <FormRow>
            <div class="col-sm-2">
                <Salutation  label="Salutation" rules="required"  readonly  v-model="ticket.Salutation" />
            </div>
            <div class="col-sm-5">
                <InputText readonly label="First Name" rules="required" v-model="ticket.Fname" />
            </div>
            <div class="col-sm-5">
                <InputText readonly label="Last Name" rules="required" v-model="ticket.Lname" />
            </div>
        </FormRow>

        <FormRow>
            <div class="col-sm-12">
                <InputText readonly label="Other names that you are/ have been known by (including name at birth, previous married names, aliases). Indicate reason for change i.e. marriage, adoption by common usage, etc" v-model="ticket.OldNames" />
            </div>
        </FormRow>

        <FormRow>
            <div class="col-sm-3">
                <FormSelect
                        v-model="ticket.gender"
                        label="Gender"
                        :disabled="true"
                        item-value="id"
                        item-name="label"
                        :items="[{ id: 'M', label: 'Male'}, { id: 'F', label: 'Female'}]" />
            </div>
            <div class="col-sm-3">
                <InputDate readonly label="Date of Birth" rules="required" format="formatDateWithSlash" v-model="ticket.DOB" />
            </div>
            <div class="col-sm-3">
                <InputText readonly label="Place of Birth" rules="required" v-model="ticket.PlaceOfBirth" />
            </div>
            <div class="col-sm-3">
                <FormSelect
                        :items="countries"
                        item-name="Name"
                        item-value="id"
                        :disabled="true"
                        label="Country of Permanent Residence"
                        v-model="ticket.CountryofPR" />
            </div>
        </FormRow>

        <FormRow>
            <div class="col-sm-3">
                <InputText readonly label="Email ID (Primary)" rules="required" v-model="ticket.Email" />
            </div>
            <div class="col-sm-3">
                <InputText readonly label="Email ID (Secondary)" v-model="ticket.Email2" />
            </div>
            <div class="col-sm-6">
                <AddressInput readonly label="Address" v-model="ticket.Address_id" />
            </div>
        </FormRow>

        <FormRow>
            <div class="col-sm-4">
                <InputTel disabled label="Phone No. Primary" v-model="ticket.Mobile" />
            </div>
            <div class="col-sm-4">
                <InputTel disabled label="Phone No. Secondary" v-model="ticket.Mobile2" />
            </div>
            <div class="col-sm-4">
                <InputTel disabled label="Fax No." v-model="ticket.Fax" />
            </div>
        </FormRow>

        <NationalityRecords readonly v-model="records.Natnl" :pqId="ticket.pq_id" v-if="records && ticket" />

        <PassportRecords readonly v-model="records.Psprt" :pqId="ticket.pq_id" v-if="records && ticket" />

        <p>Beginning with your current residential address, list below all addresses during the last 5 years with relevant dates.</p>

        <AddressRecords readonly v-model="records.Addrs" :pqId="ticket.pq_id" v-if="records && ticket" />

        <FormRow>
            <div class="col-sm-12">
                <div :class="$style.exposed">
                    <div :class="$style.exposedLabel">Political Exposed Person</div>
                    <FormCheckbox disabled v-model="ticket.isPoliticallyExposed" :true-value="1" :false-value="0">Yes</FormCheckbox>
                    <FormCheckbox disabled v-model="ticket.isPoliticallyExposed" :true-value="0" :false-value="1">No</FormCheckbox>
                </div>
            </div>
        </FormRow>

        <ButtonGroup>
            <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
        </ButtonGroup>

    </div>
</template>

<script>

    import AddressRecords from './AddressRecords'
    import PassportRecords from './PassportRecords'
    import NationalityRecords from './NationalityRecords'
    import InputDate from 'Components/form/InputDate';
    import InputTel from 'Components/form/InputTel';
    import AddressInput from 'Components/form/addressInput/AddressInput';
    import Salutation from 'Components/layout/salutation.vue';

    export default {
        name: "PersonalDetail",
        props: ['value', 'stepId'],
        computed: {
            countries() {
                return this.$store.state.common.countries;
            },
            ticket() {
                return this.$store.state.ticket.ticket;
            },
            records() {
                return this.$store.state.ticket.records;
            },
        },
        components: {
            AddressInput,
            InputTel,
            InputDate,
            AddressRecords,
            PassportRecords,
            NationalityRecords,
            Salutation
        },
        methods: {
            saveRequest(activeStep) {
                this.$emit('onSave', activeStep)
            },
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

    .exposed {
        display: flex;
    }

    .exposedLabel {
        font-weight: 700;
        margin-right: 20px;
    }

</style>
