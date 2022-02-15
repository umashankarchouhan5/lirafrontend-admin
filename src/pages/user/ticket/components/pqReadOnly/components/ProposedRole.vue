<template>
    <div :class="$style.wrapper">
        <FormRow>
            <div class="col-sm-9">
                <p>Is your role with the licence holder or licence applicant full time or part‐time?
                    <!--<span class="text-danger" v-if="!value.data.FullOrParttime">This field is required to select</span>-->
                </p>
            </div>
            <div class="col-sm-3">
                <FormSelect label="Select One"
                            v-model="ticket.FullOrParttime"
                            :items="time"
                            disabled
                            item-name="name"
                            item-value="id" />
            </div>
        </FormRow>

        <FormRow v-if="ticket.FullOrParttime === 'P'">
            <div class="col-sm-9">
                <p>How much time do you give, or (if a new appointment) do you anticipate giving, to the work of the licence holder?</p>
                <!--<span class="text-danger" v-if="!value.data.LenOfTimeInSey">This field is required to select</span>-->
            </div>
            <div class="col-sm-3">
                <InputText v-model="ticket.LenOfTimeInSey" />
            </div>
        </FormRow>

        <FormRow>
            <div class="col-sm-9">
                <p>Would you be fulfilling the dual control requirement as specified under paragraph 4 of the Code of
                    Licencees of the ICSP ACT? (For entities licenced under the International Corporate Service Providers Act, 2003 only)
                    <!--<span class="text-danger">This field is required to select</span>-->
                </p>
            </div>
            <div class="col-sm-3">
                <FormSelect  label="Select One"
                             :items="isDualControl"
                             disabled
                             v-model="ticket.DualYN"
                             item-value="value"
                             item-name="label" />
            </div>
        </FormRow>

        <FormRow>
            <div class="col-sm-9">
                <p>
                    Would you be based in Seychelles?
                    <!--<span class="text-danger">This field is required to select</span>-->
                </p>
            </div>
            <div class="col-sm-3">
                <!-- <FormSelect disabled v-model="ticket.IsSeyResident" label="Select One"
                            itemValue="value"
                            itemName="label"
                            :items="isSeyResidentItems" /> -->
                            <FormSelect disabled :value="getSeyRes" label="Select One"
                    :items="isSeyResidentItems"
                    item-value="value1"
                    item-name="label1" />
            </div>
        </FormRow>

        <template v-if="ticket.IsSeyResident === 0">
            <FormRow class="row">
                <div class="col-sm-9">
                    <p>
                        Indicate the length of time to be spent in the Seychelles per year.
                    </p>

                </div>
                <div class="col-sm-3">
                    <FormSelect disabled label="Select One"
                                 v-model="ticket.TimeExpectedToSpend"
                                 :items="period" />
                </div>
            </FormRow>
        </template>
        <template v-if="ticket.IsSeyResident === 0">
            <FormRow>
                <div class="col-sm-9">
                    <p>Indicate the country and business address where you will be based.
                        <!--<span class="text-danger">This field is required to select</span>-->
                    </p>
                </div>
                <div class="col-sm-3">
                    <FormSelect
                            disabled
                            :items="countries"
                            itemName="Name"
                            itemValue="id"
                            v-model="ticket.CountryWhereExpected"
                            label="Country" />
                </div>
            </FormRow>
        </template>

        <h6 v-if="ticket.IsSeyResident === 0" >Business Address</h6>

        <FormRow>
            <div class="col-sm-12">
                <AddressInput readonly v-if="ticket.IsSeyResident === 0" label="Address" v-model="ticket.AddressWhereExpected_id" />
                <!-- <AddressInput readonly v-if="ticket.IsSeyResident === 1" label="Address" v-model="ticket.SeyAddress_id" /> -->
            </div>
        </FormRow>


        <ButtonGroup>
            <FormButton type="primary" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
            <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
        </ButtonGroup>
    </div>
</template>

<script>

    import AddressInput from 'Components/form/addressInput/AddressInput'

    export default {
        name: "ProposedRole",
        props: ['value'],
        data() {
            return {
                isDualControl: [
                    {
                        label: 'Yes',
                        value: 'Y'
                    },
                    {
                        label: 'No',
                        value: 'N'
                    },
                    {
                        label: 'Not Applicable',
                        value: 'A'
                    }
                ],
                isSeyResidentItems: [
                    {
                        label1: 'Yes',
                        valueBoolean: true,
                        value: 1,
                        value1: 'Y'
                    },
                    {
                        label1: 'No',
                        valueBoolean: false,
                        value: 0,
                        value1: 'N'
                    }
                ],
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
                period: ['None', '1 month or less', '6 months or less'],
            }
        },
        components: {
            AddressInput
        },
        computed: {
            // getSeyRes(){
            //     return '"'+ this.ticket.IsSeyResident +'"';
            // },
            countries() {
                return this.$store.state.common.countries;
            },
            ticket() {
                return this.$store.state.ticket.pqRead;
            },
            records() {
                return this.$store.state.ticket.records;
            },
            getSeyRes(){
                if(this.ticket.IsSeyResident === 1){
                    return "Y"
                }
                else if(this.ticket.IsSeyResident === 0){
                    return "N"
                }
                else{
                    return "Null"
                }
            },
        },
        watch: {
            'ticket.IsSeyResident': function(val){
                if(val === 1){
                    this.IsSeyResident = "Yes"
                }
                else if( val === 0){
                    this.IsSeyResident = "No"
                }
            }
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
    .wrapper {
        :global {
            .text-danger {
                display: block;
            }
        }
    }
</style>
