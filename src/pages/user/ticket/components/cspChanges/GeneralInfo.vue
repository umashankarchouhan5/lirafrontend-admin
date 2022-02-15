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
        <div v-if="ticket.process_id === 380">
            <h6>Primary Person Contact Details</h6>
            <Person :value="getPrimaryPerson()" :selectPersonData="selectPersonData" validationRule="required" />
            <h6> Other Contact Details</h6>
            <Person :value="getOtherPerson()" :selectPersonData="selectPersonData" />
        </div> 
        <div v-if="ticket.process_id === 381">
            <CompanyPerson v-model="ticket" :personData="JSON.parse(ticket.PeopleJson)" />
        </div>
        <div v-if="ticket.process_id === 383">
            <FormRow>
                <div class="col-sm-6">
                    <AddressInput v-model="ticket.OldPrincipalAddress_id" readonly label="Old Principal Address" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-6">
                    <AddressInput v-model="ticket.PrincipalAddress_id"  readonly rules="required" label="Principal Address" />
                </div>
            </FormRow>
        </div>
        <div v-if="ticket.process_id === 390">
            <FormRow>
                
                <div class="col-sm-6">
                    <InputText type="number" rules="required|max:10|min:10" readonly v-model="ticket.TIN"  label="TIN" />
                </div>
            </FormRow>
        </div>
         <ButtonGroup>
            <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
        </ButtonGroup>
    </div>
</template>

<script>

    import AddressInput from 'Components/form/addressInput/AddressInput';
    import Person from './person';
    import CompanyPerson from './CompanyPersons'

    export default {
        name: "GeneralInfo",
        components: {
            AddressInput,
            Person,
            CompanyPerson,
        },
        data() {
            return {
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                newAddressId: '',
                presentAddress_id: '',
                dateOptions: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                companies: [],
                company: {
                    EntityType: null,
                    Name: '',
                    CompanyRegNo: '',
                },
                isSelected: false,
                dataSelected: false,
                primaryPersonData: {},
                otherPersonData: {},
                personData: [],
                selectPersonData: [],
            }
        },
        created() {

        },
        computed: {
            ticket() {
                return this.$store.state.ticket.ticket;
            },
        },
        watch: {
            'ticket.reference_id':function(val){
                if(val !== 0 && this.mode === 'edit'){
                    this.company['Name'] = this.ticket.companyname;
                    this.company.EntityType = this.ticket.company[0].Entitytype;
                }
            },
            'ticket.process_id': function (newValue) {
                this.$store.commit('setProcessId', newValue);
                if(!this.readonly){
                    this.reset();
                }
                this.dataSelected = false;
                
            },
            'company.EntityType': function(val){
                this.$store.commit('setChangeEntityType',val);
                if( this.ticket.process_id === 307){
                    this.$emit('changeStep',val);
                }
                if(val !== null && val !== undefined){
                    this.entitySelected = true;
                }else{
                    this.entitySelected = false;
                    this.resetCompany();
                    this.resetCompanies();
                }
            },
            newAddressId(val){
                if(!this.readonly){
                    this.ticket.address_id = val;
                }
            },
        },
        props: {
            mode: String,
            readonly: Boolean,
            value: {
                type: Object,
                required: true,
            },
        },
        methods: {
            getPrimaryPerson(){
                var persons = JSON.parse(this.ticket.PeopleJson);
                return persons[0]
            },
            getOtherPerson(){
                if(this.ticket.OtherPerson_id !== null){
                    var persons = JSON.parse(this.ticket.PeopleJson);
                    return persons[1]
                }else{
                    return {}
                }
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

    .limitedBy {
        display: flex;
        height: 38px;
        align-items: center;
        margin-bottom: 20px;

        > * {
            margin-right: 40px;
        }
    }

    .limitedByValues {
        display: flex;
        margin-bottom: 20px;

        > * {
            width: 200px;
            margin-right: 20px;

            &:first-child {
                width: 80px;
            }
        }
    }

    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 13px;
        font-weight: 400;
    }

</style>
