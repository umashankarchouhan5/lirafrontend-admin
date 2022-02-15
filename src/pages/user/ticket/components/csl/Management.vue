<template>
    <div>
        <DataTable :actions="true"
            :data="tableData"
            :columns="tableColumns()"
            @on-selection-change="selectChange"
        >
        </DataTable>
        <br />
        <FormRow>
            <ButtonGroup>
                <FormButton type="primary" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
                <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
            </ButtonGroup>
        </FormRow>
            <Popup :value="popVisible" @close="showPopup2(false)" title="Person Info" width="900">
                    
                    <FormRow>
                        <div class="col-sm-4">
                            <InputText label="Position"
                                v-model="personData.Position" readonly />
                        </div>
                        <div class="col-sm-8">
                            <InputText label="Passport Number" v-model="personData.passportnumber" readonly />
                        </div>
                    </FormRow>
                    
                    <FormRow>
                        <div class="col-sm-2">
                            <InputText  v-model="personData.Salutation" readonly />
                        </div>
                        <div class="col-sm-5">
                            <InputText label="First Name" v-model="personData.Fname" readonly />
                        </div>
                        <div class="col-sm-5">
                            <InputText label="Last Name" v-model="personData.Lname" readonly />
                        </div>
                    </FormRow>

                    <FormRow>
                        <div class="col-sm-12">
                            <AddressInput label="Residential Address"   v-model="personData.ResAddress_id" readonly />
                        </div>
                    </FormRow>
                    
                    <FormRow>
                        <div class="col-sm-12">
                            <AddressInput label="Business Address"   v-model="personData.BusinessAddress_id" readonly />
                        </div>
                    </FormRow>

                    <FormRow>
                        <div class="col-sm-4">
                            <InputTel label="Mobile" v-model="personData.Mobile" disabled  />
                        </div>
                        
                        <div class="col-sm-4">
                            <InputText label="Email" v-model="personData.Email" readonly />
                        </div>
                        
                        <div class="col-sm-4">
                            <InputTel label="Fax"   v-model="personData.Fax" disabled />
                        </div>
                    </FormRow>

                     <FormRow>
                        <div class="col-sm-6">
                            <InputText label="Occupation" v-model="personData.occupation" readonly />
                        </div>
                        
                        <div class="col-sm-6">
                            <InputText label="Nationality" v-model="personData.Nationality" readonly />
                        </div>
                        
                    </FormRow>
                    <FormRow v-if="personData.BeneficialOwner_id">
                        <div class="col-sm-6">
                            <FormCheckbox disabled  name="IsNominee" v-model="personData.isNominee"><span >IsNominee </span></FormCheckbox>
                        </div>
                        
                        <div class="col-sm-6">
                            <InputText label="Beneficiary"
                                v-model="personData.Beneficiary" readonly />
                        </div>
                    </FormRow>
            </Popup>

    </div>
</template>

<script>

    import DataTable from 'Components/DataTable'
    import DateUtil from 'Utils/dateUtil'
    import AddressInput from 'Components/form/addressInput/AddressInput';
    import InputTel from 'Components/form/InputTel';
    import tableColumn from './positionTable';

    export default {
        name:"CSLManagement",
        components: {
            DataTable,
            AddressInput,
            InputTel,
        },
        data(){
            return{
                people: [],
                tableData: [],
                tableColumns: tableColumn,
                selectedRows:[],
                position:'',
                positions: [],
                person:{
                    salutation: '',
                    fname: '',
                    lname: '',
                    resaddress_id: null,
                    businessaddress_id: null,
                    mobile: '',
                    email: '',
                    occupation: '',
                    nationality: '',
                    passportnumber: '',
                    fax: ''
                },
                personId: null,
                isVisible: false,
                benefactors: [],
                benefactor: null,
                disabledButton: false,
                personData: {},
                popVisible: false,
            }
        },
        computed:{
            
            ticket() {
                return this.$store.state.ticket.ticket;
            },
        },
        created(){
            this.tableData = JSON.parse(this.ticket.PeopleJson);
        },
        watch:{
            position(val){
                if(val === 13){
                    this.getBenefactor();
                }
            }
   
        },
        props: {
            steps: Array,
            readonly: Boolean,
            customErrors: Array,
            value: {
                type: Object,
                required: true,
            },
        },
        methods:{
            openPop(data){
                this.personData = this.tableData.find((item) => {
                    return item.id === data;
                });
                this.showPopup2(true);
            },
            showPopup2(val){
                this.popVisible = val;
            },
            getBenefactor(){
                BeneficialOwner({CSLPCCrequest_id: parseInt(this.$route.query.task),persontype_id: 14}).then(
                    res=>{
                        this.benefactors = res.data;
                    }
                )
            },
            addNewPerson(){
                if(this.personId === null){
                    addUpdatePerson(this.person).then(
                        res=>{
                            this.personId = res.data[0].person_id;
                            this.assign();
                        }
                    )
                }else{
                    this.assign();
                }
            },
            assign(){
                if(this.position !== 13){
                    const data = { CSLPCCrequest_id: parseInt(this.$route.query.task),persontype_id:this.position,person_id:this.personId }
                    this.assignPosition(data);
                    
                }else{
                    const data = { isNominee: this.innerValue.isNominee, CSLPCCrequest_id: parseInt(this.$route.query.task),persontype_id:this.position,person_id:this.personId, BeneficialOwner_id: this.benefactor }
                    this.assignPosition(data);
                }
            },
            assignPosition(data){
                assignCSLPCCPosition(data).then(
                    res=>{
                        this.getPeople();
                        this.showPopup(false);
                    }
                )
            },
            removePerson(){
                if (this.validateSelectedLength(1)){
                    var row = this.selectedRows[0];
                    removeCSLPCCPosition({id: row.id}).then(
                        res => {
                            this.getPeople();
                        }
                    )
                }

            },
            showPopup(val){
                this.isVisible = val;
                if(val === false){
                    this.personId= null;
                    this.resetPerson();
                }
            },
            resetPerson(){
                this.person.salutation = '';
                this.person.fname = '';
                this.person.lname ='';
                this.person.businessaddress_id = null;
                this.person. resaddress_id = null;
                this.person.mobile = '';
                this.person.fax = '';
                this.person.email = '';
                this.person.passportnumber = '';
                this.person.nationality = '';
                this.person.occupation = '';
                this.personId = null;
            },
            addPerson(){
                this.showPopup(true);
            },
            getPassportByEnter(event){
                if(event.keyCode === 13 || event.keyCode === 9){
                    this.getPassport(this.person.passportnumber);
                }
            },
            getPassportByTab(){
                this.getPassport(this.person.passportnumber)
            },
            getPassport(data){
                fetchPerson({
                    passportnumber: data
                }).then(
                    res => {
                        if(res.data[0]){
                            var data = res.data[0]
                            this.person.salutation = data.Salutation;
                            this.person.fname = data.Fname;
                            this.person.lname = data.Lname;
                            this.person.businessaddress_id = data.BusinessAddress_id;
                            this.person. resaddress_id = data.ResAddress_id;
                            this.person.mobile = data.Mobile;
                            this.person.fax = data.Fax;
                            this.person.email = data.Email;
                            this.person.passportnumber = data.passportNumber;
                            this.person.nationality = data.Nationality;
                            this.person.occupation = data.Occupation;
                            this.personId = data.id;
                        }
                    }
                )
            },
            getPeople(){
                    getCSLPCCRequestpeople({
                        CSLPCCrequest_id: parseInt(this.$route.query.task)
                    }).then(
                        res=>{
                            if(res.data !== ''){
                                this.tableData = res.data;
                            }else{
                                this.tableData = [];
                            }
                            this.getPositions();
                        }
                    )
            },
            getPositions(){
                const data = { isCSL : 1 }
                fetchPQPosition(data).then(
                    res => {
                        this.positions = res.data;

                    }
                );
            },
            saveRequest(activeStep) {
                this.$emit('onSave', activeStep)
            },
            nextStep() {
                this.$emit('nextStep')
            },
            prevStep() {
                this.$emit('prevStep')
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            
        },


    }
</script>


