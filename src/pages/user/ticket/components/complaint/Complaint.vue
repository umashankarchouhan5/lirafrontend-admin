<template> 
    <div>
                
        <h4>1. Details of Complainant </h4>
        <br />
        <FormRow>
            <div class="col-sm-2">
                <InputText readonly label="Title"  v-model="ticket.Salutation" />
            </div>
            <div class="col-sm-3">
                <InputText readonly label="First Name" v-model="ticket.Fname" />
            </div>
            <div class="col-sm-3">
                <InputText readonly label="Last Name" v-model="ticket.Lname" />
            </div>
            <div class="col-sm-4">
                <InputText readonly label="Email" v-model="ticket.Email" />
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-6">
                <AddressInput readonly  label="Business Address" v-model="ticket.Address_id" />
            </div>
            <div class="col-sm-6">
                <AddressInput readonly label="Residence Address" v-model="ticket.ResAddress_id" />
            </div>
        </FormRow>
            
        <FormRow>
            <div class="col-sm-4">
                <InputText readonly label="Company" v-model="ticket.CompanyName" />
            </div>
            <div class="col-sm-4">
                <InputTel readonly label="Mobile" rules="required" v-model="ticket.Mobile" />
            </div>
            <div class="col-sm-4">
                <InputTel  readonly label="Alternate Phone Number" v-model="ticket.AlternatePhone" />
            </div>   
        </FormRow>

        <FormRow>
            <div class="col-sm-12">
                <InputText readonly label="Subject : Brief summary about complaint" v-model="ticket.Subject" rules="required"  />
            </div>   
        </FormRow>

        <h6>2. Details of the incident(s)</h6>

        <p>Full name, address and contact details of licensed entity/person (s) that you wish to lodge a complaint against: </p>
        <br/>
        <FormRow>
            <div class="col-sm-12">
                <InputTextArea  readonly label="Name" rules="required" rows="2" maxlength="250" v-model="ticket.ComplaintAgainstName"  />
            </div>   
        </FormRow>

        <FormRow>
            <div class="col-sm-12">
                <InputTextArea readonly  label="Address" rules="required" rows="2" maxlength="250" v-model="ticket.ComplaintAgainstAddress"  />
            </div>   
        </FormRow>

        <FormRow>
            <div class="col-sm-12">
                <InputTextArea readonly  label="Contact Details" rules="required" rows="2" maxlength="250" v-model="ticket.ComplaintAgainstContactDetail"  />
            </div>   
        </FormRow>

        <FormRow>
            <div class="col-sm-4">
                <InputDate readonly  label="Date of Incident" rules="required" v-model="ticket.IncidentDate"  />
            </div>
            <div class="col-sm-4">
                <InputText readonly  label="Time Of Incident (24 hours format)" rules="required" :value="computedTime"  />
            </div>   
        </FormRow>
        
        <FormRow>
            <div class="col-sm-12">
                <InputTextArea readonly label="Please describe precisely the details of your complaint. Please write clearly and legibly." rows="14" v-model="ticket.ComplaintSummary" rules="required" :maxlength="2000" />
            </div>   
        </FormRow>
        <div v-if="ticket.ComplaintMode === 145">
            <FormRow>
                <div class="col-sm-4" >
                    <InputDate v-model="ticket.ReportingDate" label="Reporting Date" rules="required" readonly />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12" >
                <InputTextArea v-model="ticket.ComplainantEmailContent" label="Email Content" rules="required" rows="7" readonly :maxlength="5000" />
                </div>
            </FormRow>
        </div>

        <template v-if="ticket.ComplaintMode === 146">
            <FormRow>
                <div class="col-sm-4" >
                    <InputDate v-model="ticket.ReportingDate" label="Reporting Date"  rules="required" readonly />
                </div>
                
                <div class="col-sm-8" >
                    <InputText v-model="ticket.ComplainantLetterReference" label="Letter Reference" rules="required" :maxlength="100"  readonly />
                </div>
            </FormRow>
        </template>
        <template v-if="ticket.EnteredByadminuser_id !== null">
            <FormRow>
                <div class="col-sm-4">
                    <p><b>Consent : </b>
                        <RadioGroup v-model="ticket.ConsentYN" disabled>
                            <Radio  label="Y" disabled>
                                Yes
                            </Radio>
                            <Radio  label="N" disabled>
                                No
                            </Radio>
                        </RadioGroup>
                    </p>
                </div>
            </FormRow>

        </template>
            
        <FormRow>
            <div class="col-sm-12">
                <ButtonGroup>
                    <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
                </ButtonGroup>
            </div>
        </FormRow>
    </div>
</template>

<script>

    import DateUtil from 'Utils/dateUtil';
    import AddressInput from 'Components/form/addressInput/AddressInput';
    import InputTel from 'Components/form/InputTel';
    import InputDate from 'Components/form/InputDate';
    import { RadioGroup, Radio } from 'view-design';

    export default {
        name: "Complaint",
        components: {
            AddressInput,
            InputTel,
            InputDate,
            RadioGroup, 
            Radio
        },
        data() {
            return {
                form:{
                    ResAddress_id: '',
                    AlternatePhone: '',
                    Subject: '',
                    ComplaintAgainstContactName: '',
                    ComplaintAgainstContactAddress: '',
                    ComplaintAgainstContactDetail: '',
                    IncidentDate: null,
                    IncidentTime: '',
                    ComplaintSummary:'',
                    reference_id: 0,
                },

                declaration: {
                    DeclarationDate: DateUtil.formatDate(Date.now()),
                    Name: '',
                    Place: '',
                    isChecked: false,
                    DisplayText: '',
                },
            }
        },
        computed: {
            ticket() {
                return this.$store.state.ticket.ticket;
            },
            computedTime(){
                var timeFormat = this.ticket.IncidentTime;
                if(timeFormat.includes('.')){
                    timeFormat = timeFormat.split('.')[0];
                }
                return timeFormat;
            }
        },
        created() {
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

    .info {
        background: #d7d6da;
        box-shadow: 0px 2px 2px #00000059;
        width: 83%;
        font-size: 13px;
        margin: -20px auto 30px;
        hr {
            margin: 5px 15px 0;
            border: none;
            border-bottom: 1px solid #6666;
            clear: both;
        }
        &:after {
            content: '';
            display: block;
            clear: both;
        }
    }
    .infoBlock {
        line-height: 40px;
    }

    .additional {
        position: relative;
    }

    .additionalAdd {
        position: absolute;
        right: -25px;
        top: 36px;

    }

    .verify,
    .note {
        line-height: 21px;
        font-size: 15px;
        padding: 8px 0;
        font-weight: 500;
    }

    .verify {
        margin: 15px 0 -15px;
    }

    .summary {
        font-weight: 700;
        padding: 7px 4px;
    }
    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 13px;
        font-weight: 400;
    }
</style>
