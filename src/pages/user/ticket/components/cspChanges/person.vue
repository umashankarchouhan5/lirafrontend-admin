<template>
    <div >
        <div >
            <FormRow>
                <div class="col-sm-4">
                    <InputText label="Passport Number" :rules="validationRule" readonly  v-model="value.passportNumber" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-2">
                    <InputText :rules="validationRule" label="Title" disabled v-model="value.Salutation" />
                </div>
                <div class="col-sm-5">
                    <InputText label="First Name" :rules="validationRule" readonly v-model="value.Fname" />
                </div>
                <div class="col-sm-5">
                    <InputText label="Last Name" :rules="validationRule" readonly v-model="value.Lname" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <AddressInput label="Business Address" :rules="validationRule" readonly v-model="value.BusinessAddress_id" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <AddressInput label="Residential Address" :rules="validationRule" readonly v-model="value.ResAddress_id" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-4">
                    <InputTel label="Mobile" :rules="validationRule" readonly v-model="value.Mobile" />
                </div>
                <div class="col-sm-4">
                    <InputText label="Email ID" :rules="emailValidation" readonly v-model="value.Email" />
                </div>
                <div class="col-sm-4">
                    <InputTel label="Fax" readonly v-model="value.Fax" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-4">
                    <InputText label="Occupation" :rules="validationRule" readonly v-model="value.occupation" />
                </div>
                <div class="col-sm-4">
                    <InputText v-model="value.Nationality" :rules="validationRule" readonly label="Nationality" />
                </div>
            </FormRow>
        </div>


        <br />
    </div>
</template>

<script>

    import AddressInput from 'Components/form/addressInput/AddressInput';
    import InputTel from 'Components/form/InputTel';

    export default {
        name: "Person",
        components: {
            AddressInput,
            InputTel,
        },
        data() {
            return {
                isModalVisible: false,
                isLoading: false,
                addressToEdit: null,
                addressToEditId: null,
                persons: [],
                showAdd: false,
                addPersonData:{
                    BusinessAddress_id: null,
                    Email: '',
                    Fax: '',
                    Fname: '',
                    Lname: '',
                    Mobile: '',
                    Nationality: '',
                    ResAddress_id: null,
                    Salutation: '',
                    id: '',
                    occupation: '',
                    passportNumber: '',
                }
            }
        },
        props: {
            value: [Object,Array],
            readonly: Boolean,
            validationRule: String,
            selectPersonData: Array
        },
        computed: {
            emailValidation(){
                return this.validationRule ? this.validationRule + '|email' : ''
            },
            userData() {
                return this.$store.state.user.user
            },
            addData(){
                let icsprequest_id = this.userData.icsp_id;
                const valueToAdd = {
                        BusinessAddress_id: null,
                        Email: "",
                        Fax: "",
                        Fname: "",
                        Lname: "",
                        Mobile: "",
                        Nationality: "",
                        PlaceOfBirth: null,
                        ResAddress_id: null,
                        Salutation: null,
                        id: null,
                        Occupation: "",
                        passportNumber: "",
                        person_id: "",
                        persontype: "",
                        residenceCountry_id: "",
                    }
                return valueToAdd;
            }
        },
        watch:{
            value(val){
                if (this.value.id === undefined) {
                    this.value = Object.assign(this.value,this.addData)
                }
            },
        },
        methods: {
            addBox(val){
                this.showAdd = val;
            },
            
            async getDataToSend(){
                const {
                        BusinessAddress_id,
                        Email,
                        Fax,
                        Fname,
                        Lname,
                        Mobile,
                        Nationality,
                        ResAddress_id,
                        Salutation,
                        id,
                        Occupation,
                        passportNumber,
                    } = this.addPersonData;
                const data = {
                        businessaddress_id: BusinessAddress_id,
                        email: Email,
                        fax: Fax,
                        fname: Fname,
                        lname: Lname,
                        mobile: Mobile,
                        nationality: Nationality,
                        resaddress_id: ResAddress_id,
                        salutation: Salutation,
                        id: id,
                        occupation: Occupation,
                        passportnumber: passportNumber,
                    }
                return data;
            },
                        
        }
    }
</script>
