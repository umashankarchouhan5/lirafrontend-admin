<template>
    <div>
        <FormRow v-if="ticket.CompanyRegNo">
            <div class="col-sm-6">
                <InputText readonly label="Approved Name" :value="ticket.CompanyName" />
            </div>
            <div class="col-sm-2">
                <InputText readonly label="Entity Type" :value="ticket.EntityType" />
            </div>
            <div class="col-sm-4">
                <InputText readonly label="Company ID" :value="ticket.CompanyRegNo" />
            </div>
        </FormRow>
        <FormRow v-else>
            <div class="col-sm-6">
                <InputText readonly label="Proposed Name" :value="ticket.CompanyName" />
            </div>
            <div class="col-sm-2">
                <InputText readonly label="Entity Type" :value="ticket.EntityType" />
            </div>
            <div class="col-sm-4">
                <InputText readonly label="Original Name" :value="ticket.OriginalName" />
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-6">
                <AddressInput readonly label="Registered Office Address" :value="ticket.Address_id"  />
            </div>
            <template v-if="isLimitedByShares || isLimitedByGuarantee">
                <div class="col-sm-3" v-if="isLimitedByShares">
                    <InputAmount :label="authorizedShareLabel"
                               readonly
                               :value="ticket.AuthorizedShareCapital"/>
                </div>
                <div class="col-sm-3" v-if="isLimitedByGuarantee">
                    <InputAmount :label="guaranteeLabel"
                               readonly
                               :value="ticket.GuaranteeAmount"/>
                </div>
            </template>
        </FormRow>
        <FormRow>
            <div class="col-sm-6">
                <InputDate readonly format="formatDate" label="Original Registration Date" :value="ticket.OriginalIncorporationDate" />
            </div>
            <div class="col-sm-6">
                <InputText readonly label="Jurisdiction" :value="ticket.Jurisdiction" />
            </div>
        </FormRow>
            
        <FormRow v-if="ticket.EntityType === 'IBC'">
            <div class="col-sm-6"></div>
            <div class="col-offset-sm-6 col-sm-6">
                <FormCheckbox disabled v-model="ticket.ShareNoPar"  :trueValue="1" :falseValue="0" >
                    The company will issue shares with no par value
                </FormCheckbox>
            </div>
        </FormRow>
        <h6>Registered Agent (<span v-if="ticket.EntityType.toLowerCase() == 'ibc' || ticket.EntityType.toLowerCase() == 'lp' ">ICSP</span><span v-if="ticket.EntityType.toLowerCase() == 'foundation'">FSP</span><span v-if="ticket.EntityType.toLowerCase() == 'trust'">ITSP</span>)</h6>
        <FormRow>
            <div class="col-sm-6">
                <InputText readonly label="Name" :value="ticket.ICSPname" />
            </div>
            <div class="col-sm-6">
                <AddressInput readonly label="Address" :value="ticket.ICSPAddress_id"  />
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-12" v-if="ticket.EntityType !== 'LP'">
                <Declaration :value="declaration" readonly />
            </div>
        </FormRow>
        <div v-if="ticket.NatureOfBusiness && ticket.NatureOfBusiness !== null && ticket.EntityType === 'LP'">
            <FormRow >
            <div class="col-sm-12">
                <InputTextArea readonly rows="10" rules="required"  v-model="ticket.NatureOfBusiness" label="General Nature of Business"/>
            </div>
        </FormRow>
        </div>
        <div v-if="ticket.CompanyPeople !== null && ticket.EntityType === 'LP'">
            <h6>Designated General Partner(s)</h6>
            <div v-for="(item,index) in JSON.parse(ticket.CompanyPeople)" :key="index">
                <FormRow>
                    <div class="col-sm-6">
                        <InputText label="Name" rules="required" readonly v-model="item.Name" />
                    </div>
                    <div class="col-sm-6">
                        <InputText label="Address" rules="required" max="200" readonly v-model="item.ResidenceAddress" />
                    </div>
                </FormRow>
            </div>
        </div>
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

    import AddressInput from 'Components/form/addressInput/AddressInput';
    import InputDate from 'Components/form/InputDate';
    import Declaration from 'Components/Declaration';

    export default {
        name: "GeneralInfo105Init",
        computed: {
            guaranteeLabel() {
                const currency = this.ticket.currency ? `in (${this.ticket.currency})` : ''
                return `Guarantee Amount ${currency}`
            },
            authorizedShareLabel() {
                const currency = this.ticket.currency ? `in (${this.ticket.currency})` : ''
                return `Authorized Share Capital ${currency}`
            },
            isLimitedByShares() {
                return !!(+this.ticket.LimitedByShares);
            },
            isLimitedByGuarantee() {
                return !!(+this.ticket.LimitedByGuarantee);
            },
            ticket() {
                return this.$store.state.ticket.ticket;
            },
            declaration() {
                const { DeclarationMessage, DeclarationDate, DeclarationName, DeclarationPlace } = this.ticket;
                return {
                    DeclarationMessage,
                    DeclarationDate,
                    DeclarationName,
                    DeclarationPlace,
                    isChecked: true
                }
            }
        },
        components: {
            AddressInput,
            Declaration,
            InputDate
        },
        methods: {
            nextStep() {
                this.$emit('nextStep')
            },
        }
    }
</script>
