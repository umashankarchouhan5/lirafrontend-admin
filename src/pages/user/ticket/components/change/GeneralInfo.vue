<template>
    <div>
        <FormRow>
            <div class="col-sm-7">
                <div class="row">
                    <div class="col-sm-8">
                        <InputText readonly label="Change Type" :value="ticket.ProcessName" />
                    </div>
                    
                    <div class="col-sm-2">
                        <InputText readonly v-if="ticket.process_id !== 302" label="Entity Type" :value="ticket.EntityType" />
                    </div>
                </div>
            </div>
        </FormRow>
        <FormRow v-if="ticket.process_id !== 300 && ticket.process_id !== 311 && ticket.process_id !== 302 && ticket.process_id !== 602 && ticket.process_id !== 603">
            <div class="col-sm-6">
                <div class="row">
                    <div class="col-sm-2">
                        <InputText readonly label="Reg. #" :value="ticket.CompanyRegNo" />
                    </div>
                    <div class="col-sm-8">
                        <InputText readonly label="Entity Name" :value="ticket.CompanyName" />
                    </div>
                </div>
            </div>
        </FormRow>
        <FormRow v-if="(ticket.process_id === 300 || ticket.process_id === 311) && ticket.Company_id !== null">
            <div class="col-sm-6">
                <div class="row">
                    <div class="col-sm-2">
                        <InputText readonly label="Reg. #" :value="ticket.CompanyRegNo" />
                    </div>
                    <div class="col-sm-8">
                        <InputText readonly label="Entity Name" :value="ticket.CompanyName" />
                    </div>
                </div>
            </div>
        </FormRow>
        <FormRow v-if="(ticket.process_id === 300 || ticket.process_id === 311) && ticket.Company_id === null">
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
        <template v-if="ticket.process_id === 300 || ticket.process_id === 311">
            <p><b>Incoming Agent Details:</b></p>
            <br />
            <FormRow>
                <div class="col-sm-6">
                    <div class="row">
                        <div class="col-sm-3">
                            <InputText  label="Agent Code" :value="ticket.IncomingICSPCode" readonly />
                        </div>
                        <div class="col-sm-7">
                            <InputText label="Incoming Agent Name" readonly :value="ticket.IncomingICSPName" />
                        </div>
                    </div>
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-7"  >
                    <!-- <AddressInput label="Incoming Agent Address" readonly :value="incomingICSP.Address_id" /> -->
                    <InputText label="Address" readonly :value="ticket.incomingICSPAddress" />
                </div>
            </FormRow>
        </template>
        <template v-if="ticket.process_id === 301">
            <p><b>Incoming Agent Details:</b></p>
            <br />
            <FormRow>
                <div class="col-sm-6">
                    <div class="row">
                        <div class="col-sm-3">
                            <InputText  label="Agent Code" :value="ticket.IncomingICSPCode" readonly />
                        </div>
                        <div class="col-sm-7"  >
                            <InputText label="Incoming Agent Name" readonly :value="ticket.IncomingICSPName" />
                        </div>
                    </div>
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-7"  >
                    <!-- <AddressInput readonly label="Address" :value="incomingICSP.Address_id" /> -->
                    <InputText label="Address" readonly :value="ticket.incomingICSPAddress" />
                </div>
            </FormRow>
            
            <p><b>Outgoing Agent Details:</b></p>
            <br />
            <FormRow>
                <div class="col-sm-6">
                    <div class="row">
                        <div class="col-sm-3">
                            <InputText  label="Agent Code" :value="ticket.OutgoingICSPCode"  readonly />
                        </div>
                        <div class="col-sm-7" >
                            <InputText label="Outgoing Agent Name" readonly :value="ticket.OutgoingICSPname" />
                        </div>
                    </div>
                </div>
            </FormRow>
            
            <FormRow>
                <div class="col-sm-7" >
                    <!-- <AddressInput readonly label="Outgoing Agent Address" :value="outgoingICSP.Address_id" /> -->
                    <InputText label="Address" readonly :value="ticket.outgoingICSPAddress" />
                </div>
            </FormRow>
        </template>
        <template v-if="ticket.process_id === 109">
            <FormRow>
                <div class="col-sm-7">
                    <AddressInput label="Address" readonly :value="ticket.entityAddressId" />
                </div>
            </FormRow>
        </template>
        <template v-if="ticket.process_id === 302">
            <FormRow>
                <div class="col-sm-7">
                    <AddressInput readonly label="Old Address" v-model="ticket.ICSPAddress_id" />
                </div>
                
            </FormRow>
            <FormRow>
                <div class="col-sm-7">
                    <AddressInput readonly label="New Address" v-model="ticket.Address_id" />
                </div>
            </FormRow>
        </template>
        <template v-if="ticket.process_id === 303">
            <FormRow>
                <div class="col-sm-7">
                    <AddressInput readonly label="Company Address" v-model="ticket.entityAddressId" />
                </div>
            </FormRow>
            <div :class="$style.checkItem">
                <div :class="$style.checkbox"  >
                    <FormCheckbox v-model="ticket.isMOU" :true-value="1" :false-value="0" disabled />
                </div>
                <div :class="$style.checkBrief">
                    Amendment to Memorandum
                </div>
            </div>    
            <div :class="$style.checkItem">
                <div :class="$style.checkbox"  >
                    <FormCheckbox v-model="ticket.isAOA" :true-value="1" :false-value="0" disabled />
                </div>
                <div :class="$style.checkBrief">
                    Amendment to Articles
                </div>
            </div>    
            <div :class="$style.checkItem">
                <div :class="$style.checkbox"  >
                    <FormCheckbox v-model="ticket.isRestatedMOU" :true-value="1" :false-value="0" disabled />
                </div>
                <div :class="$style.checkBrief">
                    Restated Memorandum
                </div>
            </div>    
            <div :class="$style.checkItem">
                <div :class="$style.checkbox"  >
                    <FormCheckbox v-model="ticket.isRestatedAOA" :true-value="1" :false-value="0" disabled />
                </div>
                <div :class="$style.checkBrief">
                    Restated Articles
                </div>
            </div>
            <br />
        </template>
        <template v-if="ticket.process_id === 304">
            <FormRow>
                <div class="col-sm-7">
                    <AddressInput readonly label="Company Address" v-model="ticket.entityAddressId" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-5">
                    <InputText readonly :value="ticket.approvedName" label="Approved Name" />
                </div>
            </FormRow>
            <div :class="$style.checkItem">
                <div :class="$style.checkbox"  >
                    <FormCheckbox v-model="ticket.isMOU" :true-value="1" :false-value="0" disabled />
                </div>
                <div :class="$style.checkBrief">
                    Amendment to Memorandum
                </div>
            </div>    
            <div :class="$style.checkItem">
                <div :class="$style.checkbox"  >
                    <FormCheckbox v-model="ticket.isAOA" :true-value="1" :false-value="0" disabled />
                </div>
                <div :class="$style.checkBrief">
                    Amendment to Articles
                </div>
            </div>    
            <div :class="$style.checkItem">
                <div :class="$style.checkbox"  >
                    <FormCheckbox v-model="ticket.isRestatedMOU" :true-value="1" :false-value="0" disabled />
                </div>
                <div :class="$style.checkBrief">
                    Restated Memorandum
                </div>
            </div>    
            <div :class="$style.checkItem">
                <div :class="$style.checkbox"  >
                    <FormCheckbox v-model="ticket.isRestatedAOA" :true-value="1" :false-value="0" disabled />
                </div>
                <div :class="$style.checkBrief">
                    Restated Articles
                </div>
            </div>
            <br />
        </template>
        <template v-if="ticket.process_id === 305">
            <FormRow>
                <div class="col-sm-2">
                    <InputDate readonly label="Notice Date" v-model="ticket.NoticeDate" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-5">
                    <InputTextArea readonly label="Reason for Resigning" v-model="ticket.ResigReason" />
                </div>
            </FormRow>
        </template>
        <template v-if="ticket.process_id === 306">
            Template for the process 306
        </template>
        <template v-if="ticket.process_id === 307 && ticket.Company_id">
            <FormRow>
                <div class="col-sm-12">
                    <CompanyPersons :persons="persons(ticket.person)" />
                </div>
            </FormRow>
        </template>
        <template v-if="ticket.process_id === 309">
            <FormRow>
                <div class="col-sm-2">
                <InputText rules="required" label="Currency" v-model="ticket.currency" readonly/>
                </div>
                <div class="col-sm-4">
                    <InputAmount label="Share Capital" readonly rules="required" v-model="ticket.shareCapital" />
                </div>
            </FormRow>
            <div :class="$style.checkItem">
                <div :class="$style.checkbox"  >
                    <FormCheckbox v-model="ticket.isMOU" :true-value="1" :false-value="0" disabled/>
                </div>
                <div :class="$style.checkBrief">
                    Amendment to Memorandum
                </div>
            </div>    
            <div :class="$style.checkItem">
                <div :class="$style.checkbox"  >
                    <FormCheckbox v-model="ticket.isAOA" :true-value="1" :false-value="0" disabled/>
                </div>
                <div :class="$style.checkBrief">
                    Amendment to Articles
                </div>
            </div>    
            <div :class="$style.checkItem">
                <div :class="$style.checkbox"  >
                    <FormCheckbox v-model="ticket.isRestatedMOU" :true-value="1" :false-value="0" disabled/>
                </div>
                <div :class="$style.checkBrief">
                    Restated Memorandum
                </div>
            </div>    
            <div :class="$style.checkItem">
                <div :class="$style.checkbox"  >
                    <FormCheckbox v-model="ticket.isRestatedAOA" :true-value="1" :false-value="0" disabled/>
                </div>
                <div :class="$style.checkBrief">
                    Restated Articles
                </div>
            </div>
            <br /> 
        </template>
        <template v-if="ticket.process_id === 310">
            <div :class="$style.checkItem">
                <div :class="$style.checkbox"  >
                    <FormCheckbox v-model="ticket.isMOU" :true-value="1" :false-value="0" disabled/>
                </div>
                <div :class="$style.checkBrief">
                    Amendment to Memorandum
                </div>
            </div>    
            <div :class="$style.checkItem">
                <div :class="$style.checkbox"  >
                    <FormCheckbox v-model="ticket.isAOA" :true-value="1" :false-value="0" disabled/>
                </div>
                <div :class="$style.checkBrief">
                    Amendment to Articles
                </div>
            </div>    
            <div :class="$style.checkItem">
                <div :class="$style.checkbox"  >
                    <FormCheckbox v-model="ticket.isRestatedMOU" :true-value="1" :false-value="0" disabled/>
                </div>
                <div :class="$style.checkBrief">
                    Restated Memorandum
                </div>
            </div>    
            <div :class="$style.checkItem">
                <div :class="$style.checkbox"  >
                    <FormCheckbox v-model="ticket.isRestatedAOA" :true-value="1" :false-value="0" disabled/>
                </div>
                <div :class="$style.checkBrief">
                    Restated Articles
                </div>
            </div>
            <br />
            <FormRow>
                <div class="col-sm-12">
                    <InputTextArea label="Description of change being requested" rows="4" maxlength="500" readonly v-model="ticket.comment" />    
                </div>    
            </FormRow> 
        </template>
        <template v-if="ticket.process_id === 602">
            <FormRow>
                <div class="col-sm-2">
                    <InputDate readonly :vid="`EffectiveDate-1`" rules="required" label="Effective Date" v-model="ticket.ResolutionDate" />
                </div>
            </FormRow>
            <h6>Entities to merge</h6>
            <MergeComponent v-if="getMergeJson.length > 0" v-model="getMergeJson" readonly />
            
            <FormRow >
                <div class="col-sm-6">
                    <InputText :rules="{required:true}" :vid="`SelectSurvivingCompany`" readonly label="Select Surviving Company Name"  v-model="ticket.CompanyName" />
                </div>
            </FormRow>
            <br />
        </template>
        <template v-if="ticket.process_id === 603">
            <FormRow>
                <div class="col-sm-2">
                    <InputDate readonly :vid="`EffectiveDate-2`" rules="required" label="Effective Date" v-model="ticket.ResolutionDate" />
                </div>
            </FormRow>
            <h6>Entities to consolidate</h6>
            <MergeComponent v-if="getMergeJson.length > 0" v-model="getMergeJson" readonly />
            <FormRow>
                <div class="col-sm-5">
                    <InputText readonly :value="ticket.approvedName" label="Approved Name" />
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

    import InputDate from 'Components/form/InputDate';
    import CompanyPersons from './CompanyPersons';
    import AddressInput from 'Components/form/addressInput/AddressInput'
    import { searchICSPTypes } from '../../config/api'
    import MergeComponent from './MergeComponent';

    export default {
        name: "GeneralInfo",
        data() {
            return {
                icsp_ids: []
            }
        },
        components: {
            CompanyPersons,
            InputDate,
            AddressInput,
            MergeComponent
        },
        created() {
            this.$store.commit('setLoading', true);
            searchICSPTypes().then(res => {
                this.icsp_ids = res.data;
                this.$store.commit('setLoading', false);
            })
        },
        computed: {
            ticket() {
                return this.$store.state.ticket.ticket;
            },
            outgoingICSP() {
                return this.icsp_ids.find(item => item.id === this.ticket.OutgoingICSP_id)
            },
            incomingICSP() {
                return this.icsp_ids && this.icsp_ids.find(item => item.id === this.ticket.IncomingICSP_id)
            },
            getMergeJson() {
                if(this.ticket && this.ticket !== null && this.ticket.mergeJson && this.ticket.mergeJson !== null){
                    return JSON.parse(this.ticket.mergeJson)
                }
                else{
                    return []
                }
            }
        },
        props: {
            process_ids: Array,
            steps: Array,
            readonly: Boolean,
            customErrors: Array,
            value: {
                type: Object,
                required: true,
            },
        },
        methods: {
            persons(data){
                return JSON.parse(data);
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
    .checkList {
        position: relative;
        min-height: 30px;
        margin-bottom: 20px;
        border-radius: 3px;
        overflow: hidden;
        border: 1px solid #e1e1e1;
    }

    .checkItem {
        padding: 5px 8px;
        border-bottom: 1px solid #e1e1e1;
        display: flex;
        align-items: center;
        background: lighten(#ccc, 17%);

        &:last-child {
            border-bottom: none;
        }
    }

    .checkbox {
        flex-shrink: 0;
        flex-grow: 0;
        width: 25px;
        text-align: center;
        align-self: flex-start;
    }

    .checkBrief {
        flex-grow: 1;
    }
</style>
