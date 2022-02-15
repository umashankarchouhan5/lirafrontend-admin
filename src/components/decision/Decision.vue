<template>
    <div>
        <h6 style="margin-bottom: 10px;">Determination</h6>
        <FormRow>
            <div class="col-sm-12">
                <ValidationProvider :rules="{required: requiredRule}" name="Decision" mode="passive" v-slot="{ errors }">
                    <RadioGroup v-model="outcome" @on-change="onChange('Decision_Change')"  >
                        <Radio v-for="(variant, i) in variantArray" :key="i" :label="variant.value" :disabled="readonly || (ticket.EnableDetermination !== undefined  && ticket.EnableDetermination == 0 && (variant.value == 'APP' || variant.value == 'REJ') ? true : false) ">
                            {{ variant.label }}
                        </Radio>
                    </RadioGroup>
                    <div :class="$style.error" v-if="errors[0]">
                        {{ errors[0] }}
                    </div>
                </ValidationProvider>
                <div v-if="outcome && outcome !== 'APP' && !readonly && rejectionReasons.length > 0" style="position:relative;">
                    <Loader v-if="isLoading" />
                    <h6>Select Reason</h6>
                    <FormRow>
                        <div class="col-sm-6">
                            <FormSelect :items="rejectionReasons"
                                multiple
                                name="Reason"
                                v-model="DispositionString"
                                item-name="ReasonDescription"
                                item-value="Rejectionreason_id"
                                :rules="{ required: outcome === 'REJ' && outcome === 'RFI'}" 
                            />
                        </div>
                    </FormRow>
                </div>
            </div>
        </FormRow>
    </div>
</template>

<script>

    import { RadioGroup, Radio } from 'view-design';
    import { ValidationProvider } from 'vee-validate';
    import { getRejectionReasons } from './decisionActions';
    import loadingMixin from 'Mixins/loadingMixin';

    export default {
        name: "Decision",
        mixins: [loadingMixin],
        props: {
            readonly: Boolean,
            variants: {
                type: Array,
                default() {
                    return ['APP', 'REJ', 'RFI', 'CAP'];
                }
            },
            error: String,
            requiredRule: Boolean,
            selectRFI: {
                type: Boolean,
                default: false
            }
        },
        data() {
          return {
              decisions: this.variants,
              outcome: null,
              DispositionString: [],
              rejectionReasons: []
          }
        },
        watch: {
            selectRFI(val) {
                if(val == true){
                    this.outcome = 'RFI';
                }
            },
            outcome(newValue) {
                if (newValue !== 'APP' && this.rejectionReasons.length === 0) {
                    this.getReasons()
                }
            },
            DispositionString() {
                this.onChange('Comment_Change')
            }
        },
        computed: {
            
            getDispositions(){
                return JSON.parse(this.ticket.ValidationResult);
            },
            pcAdmin(){
                return this.$store.state.ticket.pcAdmin;
            },
            mappedVariants() {
                const mapping = {
                    APP: this.pcAdmin.AppLabel !== null ? this.pcAdmin.AppLabel: 'Approved',
                    REJ: 'Rejected',
                    RFI: this.pcAdmin.RfiLabel !== null ? this.pcAdmin.RfiLabel : 'RFI' ,
                    CAP: 'Conditional Approval'
                };
                return this.variants.map(variant => ({
                    label: mapping[variant],
                    value: variant,
                    show: this.pcAdmin[variant]
                }))
            },
            variantArray(){
                return this.mappedVariants.filter(variant => (variant.show == 1  && variant.value != 'RFI') 
                    || (variant.show == 1 && variant.value == 'RFI' && this.pcAdmin.isRFIbutton == 0) 
                    || (variant.show == 1 && (this.userData.department_id == 1 || this.ticket.process_id == 804 || this.ticket.process_id == 803)))
            },
            processId() {
                return this.$store.state.common.currentProcessId
            },
            ticket(){
                return this.$store.state.ticket.ticket;
            },
            userData() {
                return this.$store.state.user.user
            },
        },
        created(){
            if(this.ticket.outcome != null){
                this.outcome = this.ticket.outcome === 'RFI' ? null : this.ticket.outcome;
            }
            if(this.ticket.outcome === null && this.ticket.ValidationResult && this.ticket.ValidationResult !== null && this.getDispositions.length > 0){
                
                this.getDispositions.forEach(element => {
                    if(element.isError === true){
                        this.outcome = 'REJ';
                    }
                    this.DispositionString.push(element.Disposition_id)
                });
            }
        },
        components: {
            RadioGroup,
            Radio,
            ValidationProvider
        },
        methods: {
            getReasons() {
                this.showLoader();
                getRejectionReasons({ process_id: this.processId }).then(response => {
                    this.hideLoader();
                    this.rejectionReasons = response.data
                }).catch(this.hideLoader)
            },
            onChange(type) {
                if(type == 'Decision_Change') this.DispositionString = [];
                this.$emit('onChange', {
                    outcome: this.outcome,
                    DispositionString: type == 'Comment_Change' ? this.DispositionString.join(',') : '',
                    DispositionDescriptions: type == 'Comment_Change' ? this.rejectionReasons
                        .filter(item => this.DispositionString.indexOf(item.Rejectionreason_id) !== -1)
                        .map(item => item.ReasonDescription).join(', ') : ''
                })
            }
        }
    }
</script>

<style lang="scss" module>

    .error {
        color: #ff3547;
        max-width: 100%;
        font-size: 11px;
        line-height: 13px;
        font-weight: 400;
        margin-top: 4px;
    }

</style>
