<template>
    <div >
        <p>1. &nbsp; Type of licence being sought: </p>
        <FormRow>
            <div class="col-sm-6" >
                <div  :class="$style.checkItem">
                    <div :class="$style.checkbox">
                        <FormCheckbox disabled name="Securities Dealer’s Representative Licence"  vid="`CheckBox-SecurityDealer`"  v-model="sd" ></FormCheckbox>
                    </div>
                    <div :class="$style.checkBrief">
                        <span >
                            Securities Dealer’s Representative Licence
                        </span>
                    </div>
                </div>
            </div>
            <div class="col-sm-6" v-if="sd">
                <div class="row" v-if="sdCompany !== ''">
                    <InputText  label="Company Name" v-model="sdCompany" readonly :vid="`CompanyName-SecurityDealer`"  />
                </div>
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-6" >
                <div  :class="$style.checkItem">
                    <div :class="$style.checkbox">
                        <FormCheckbox disabled  name="Investment Advisor’s Representative Licence" vid="`CheckBox-SecurityDealer`" v-model="ia" ></FormCheckbox>
                    </div>
                    <div :class="$style.checkBrief">
                        <span >
                            Investment Advisor’s Representative Licence
                        </span>
                    </div>
                </div>
            </div>
            <div class="col-sm-6" v-if="ia">
                <div class="row" v-if="iaCompany !== ''">
                    <InputText  label="Company Name" v-model="iaCompany" readonly :vid="`CompanyName-Investment Advisor`"  />
                </div>
            </div>
        </FormRow>
    </div>
</template>

<script>
    import  { fetchAttachedLicenseToRep } from '../../../config/api';
    export default {
        name: 'RepCode',
        props: {
            readonly: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                sd: false,
                ia: false,
                sdCompany: '',
                iaCompany: '',
                repSDCode: '',
                repIACode: '',
            }
        },
        computed: {
            ticket() {
                return this.$store.state.ticket.ticket;
            },
        },
        watch: {
            ticket (val){
                console.log(val)
                if(val !== undefined && val !== null){
                    this.getData();
                }
            }
        },
        created() {
            if(this.ticket && this.ticket.reference_id){
                this.getData();
            }
        },
        methods: {
            getData() {
                fetchAttachedLicenseToRep({reference_id: parseInt(this.ticket.reference_id)}).then(
                    res => {
                        const data = res.data;
                        if(data.length > 0){
                            data.filter( item => {
                                if(item.license_type == 'SD'){
                                    this.sd = true;
                                    this.sdCompany = item.company_name;
                                }
                                if(item.license_type == 'IA'){
                                    this.ia = true;
                                    this.iaCompany = item.company_name;
                                }
                            })
                        }
                    }
                )
            },
        }
        
    }
</script>
<style lang="scss" module>
    .checkItem {
        padding: 5px 8px;
        display: flex;
        align-items: center;

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
        margin-left: 0px;
    }
</style>