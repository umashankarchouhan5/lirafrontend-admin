<template> 
<div>
        <FormRow>
            <div class="col-sm-4" :class="$style.filterItem">
                <InputText :width="200" label="License Type"  readonly  rules="required"  v-model="ticket.EntityType"  />
            </div> 
        </FormRow>
        <FormRow>
            <div class="col-sm-4" :class="$style.filterItem">
                <InputText rules="required" :width="200" label="Reg #" readonly  v-model="ticket.CompanyRegNo" />
            </div>
            <div class="col-sm-6" :class="$style.filterItem">
                <FormAutoComplete
                    label="Licensee Name"
                    rules="required"
                    :width="300"
                    disabled
                    v-model="ticket.CompanyName"
                    :items="companies"
                    item-value="Name"
                    item-name="Name" />
            </div>
        </FormRow>
            
            

        <FormRow>
            <div class="col-sm-4">
                <InputText :width="200" label="Select Type" :items="types"  readonly item-name="name" item-value="val" rules="required" v-model="ticket.Type"  />
            </div> 
            <div class="col-sm-3">
                <InputDate  label="Deadline"  readonly rules="required" v-model="ticket.deadline"  />
            </div>   
        </FormRow>
        <FormRow>
            <div class="col-sm-12">
                <InputTextArea  label="Applicable Section" rules="required" readonly rows="1" maxlength="100" v-model="ticket.applicableSection"  />
            </div>   
        </FormRow>

        <FormRow>
            <div class="col-sm-12">
                <InputTextArea  label="Ground" rules="required" readonly rows="1" maxlength="100" v-model="ticket.ground"  />
            </div>   
        </FormRow>

        <FormRow>
            <div class="col-sm-12">
                <InputTextArea  label="Description" rules="required" readonly rows="3" v-model="ticket.description"  />
            </div>   
        </FormRow>
         <ButtonGroup>
            <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
        </ButtonGroup>
    </div>
</template>

<script>

    import DateUtil from 'Utils/dateUtil';
    import InputDate from 'Components/form/InputDate';
    import loadingMixin from 'Mixins/loadingMixin';
    import FormAutoComplete from 'Components/form/FormAutoComplete';

    export default {
        name: "DirectionAndDirectiveForm",
        mixins: [ loadingMixin ],
        components: {
            InputDate,
            FormAutoComplete
        },
        data() {
            return {
                companies: [],
                types: [],
                isSelected: false,
                ticketReference: null,

                documents: {
                    additional: []
                },
                print: null,
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
            ticket() {
                return this.$store.state.ticket.ticket;
            },
        },
        watch: {
        },
        created() {
        },
        methods: {
            
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

    .documents {

        :global {
            .ivu-table,
            .ivu-table-wrapper {
                overflow: visible;
            }
        }
    }
    
    .popupRow {
        padding: 5px 0 15px;
    }
</style>
