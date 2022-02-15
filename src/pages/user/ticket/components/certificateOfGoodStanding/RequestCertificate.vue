<template>
    <div>
        <FormRow>
            <div class="col-sm-3" v-if="ticket.process_id">
                <InputText readonly
                    v-model="ticket.EntityType"
                    label="Entity Type"
                    rules="required" />
            </div>
        </FormRow>
        <FormRow v-if="ticket.process_id && ticket.Company_id !== null">
            <div class="col-sm-6">
                <div class="row">
                    <div class="col-sm-6">
                        <InputText rules="required" label="Reg #" disabled v-model="ticket.CompanyRegNo" />
                    </div>
                    <div class="col-sm-6">
                        <InputText
                            readonly
                            label="Name"
                            rules="required"
                            v-model="ticket.CompanyName" />
                    </div>
                </div>
            </div>
        </FormRow>
        <FormRow v-if="ticket.process_id && ticket.Company_id === null">
            <div class="col-sm-6">
                <div class="row">
                    <div class="col-sm-2">
                        <InputText readonly label="Reg. #" :value="ticket.typeCompanyReg" />
                    </div>
                    <div class="col-sm-8">
                        <InputText readonly label="Entity Name" :value="ticket.typeCompanyName" />
                    </div>
                </div>
            </div>
        </FormRow>
        <!-- <FormRow >
            <div class="col-sm-7">
                <AddressInput readonly label="Company Address" :value="ticket.CompanyAddress_id" />
            </div>
        </FormRow> -->
        <FormRow>
            <div class="col-sm-12">
                <div :class="$style.checkbox">
                    <FormCheckbox  disabled name="Declaration_confirm" :value="toBeMailed">
                        <span :class="$style.checkboxText">Please mail me the certificate</span>
                    </FormCheckbox>
                </div>
            </div>
        </FormRow>
        <FormRow v-if="ticket.MailingAddress_id && ticket.MailingAddress_id !== null">
            <div class="col-sm-7">
                <AddressInput readonly label="Mailing Address" rules="required"  v-model="ticket.MailingAddress_id"/>
            </div>
        </FormRow>
        <ButtonGroup>
            <!-- <FormButton type="primary" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton> -->
            <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
        </ButtonGroup>
    </div>
</template>
<script>
    import AddressInput from 'Components/form/addressInput/AddressInput';
    import debounce from 'Utils/debounce';

    export default {
        name: 'RequestCertificate',
        components:{
            AddressInput,
        },
        data(){
            return{
                entityTypes: [],
                companies: [],
                company: {
                    EntityType: null,
                    Name: '',
                    CompanyRegNo: '',
                },
                isSelected: false
            }
        },
        props: {
            mode: String,
            steps: Array,
            readonly: Boolean,
            customErrors: Array,
            value: {
                type: Object,
                required: true,
            },
        },
        computed: {
            toBeMailed() {
                return this.ticket.MailingAddress_id !== '' && this.ticket.MailingAddress_id !== ' ' && this.ticket.MailingAddress_id !== null;
            },
            ticket() {
                return this.$store.state.ticket.ticket;
            },
            selectedCompany(){
                return this.$store.state.user.selectedCompany;
            },
            processId() {
                return this.$store.state.common.currentProcessId;
            },
            userData() {
                return this.$store.state.user.user;
            },
        },
        methods:{
            saveRequest(activeStep) {
                this.$emit('onSave', activeStep)
            },
            nextStep() {
                this.$emit('nextStep')
            },
        }
        
    }
</script>

<style lang="scss" module>
    
    .checkbox {
        margin-bottom: 10px;
    }
    
    .checkboxText{
        text-align: justify;
        font-size: 14px;
        color: #555;
    }
</style>