<template>
    <div v-if="Array.isArray(value)">
        <div v-for="(item, i) in value" :key="i">
            <FormRow>
                <div class="col-sm-2">
                    <InputText readonly v-model="item.Salutation"  />
                </div>
                <div class="col-sm-4">
                    <InputText readonly label="First Name" v-model="item.Fname" />
                </div>
                <div class="col-sm-4">
                    <InputText readonly label="First Name" v-model="item.Lname" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <AddressInput label="Business Address" readonly v-model="item.BusinessAddress_id" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <AddressInput label="Residential Address" readonly v-model="item.ResAddress_id" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-4">
                    <InputTel disabled label="Mobile" v-model="item.Mobile" />
                </div>
                <div class="col-sm-4">
                    <InputText readonly label="Email ID" v-model="item.Email" />
                </div>
                <div class="col-sm-4">
                    <InputTel disabled label="Fax" v-model="item.Fax" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-4">
                    <InputText readonly label="Occupation" v-model="item.occupation" />
                </div>
                <div class="col-sm-4">
                    <InputText readonly v-model="item.Nationality" label="Nationality" />
                </div>
                <div class="col-sm-4">
                    <InputText readonly label="Passport Number" v-model="item.passportnumber" />
                </div>
            </FormRow>
        </div>
    </div>
    <div v-else>
        <FormRow>
            <div class="col-sm-2">
                <InputText readonly v-model="value.Salutation" />
            </div>
            <div class="col-sm-4">
                <InputText readonly label="First Name" v-model="value.Fname" />
            </div>
            <div class="col-sm-4">
                <InputText readonly label="Last Name" v-model="value.Lname" />
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-12">
                <AddressInput label="Business Address" readonly v-model="value.BusinessAddress_id" />
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-12">
                <AddressInput label="Residential Address" readonly v-model="value.ResAddress_id" />
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-4">
                <InputTel disabled label="Mobile" v-model="value.Mobile" />
            </div>
            <div class="col-sm-4">
                <InputText readonly label="Email ID" v-model="value.Email" />
            </div>
            <div class="col-sm-4">
                <InputTel disabled label="Fax" v-model="value.Fax" />
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-4">
                <InputText readonly label="Occupation" v-model="value.Occupation" />
            </div>
            <div class="col-sm-4">
                <InputText readonly v-model="value.Nationality" label="Nationality" />
            </div>
            <div class="col-sm-4">
                <InputText readonly label="Passport Number" v-model="value.passportNumber" />
            </div>
        </FormRow>
    </div>
</template>

<script>

    import AddressInput from 'Components/form/addressInput/AddressInput';
    import InputTel from 'Components/form/InputTel';

    export default {
        name: "Person",
        created() {
            if (this.value.length === 0) {
                this.addValue()
            }
        },
        data() {
            return {
                isModalVisible: false,
                isLoading: false,
                addressToEdit: null,
                addressToEditId: null
            }
        },
        props: ['value'],
        components: {
            AddressInput,
            InputTel
        },
        methods: {
            addValue() {
                this.value.push({
                    BusinessAddress1: "",
                    BusinessAddress2: "",
                    BusinessAddress_id: null,
                    BusinessCity: "",
                    BusinessCountry_id: "",
                    BusinessState: "",
                    BusinessZip: "",
                    Email: "",
                    Fax: null,
                    Fname: "",
                    Lname: "",
                    Mobile: "",
                    Nationality: "",
                    PlaceOfBirth: null,
                    ResAddress_id: null,
                    Salutation: null,
                    icsprequest_id: "1",
                    id: null,
                    occupation: "",
                    passportnumber: "",
                    person_id: "",
                    persontype: "",
                    persontype_id: "1",
                    residenceAddress1: "",
                    residenceAddress2: null,
                    residenceCity: "",
                    residenceCountry_id: "",
                    residenceState: "",
                    residenceZip: "",
                })
            }
        }
    }
</script>
