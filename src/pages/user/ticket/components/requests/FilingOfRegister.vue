<template>
    <div>
        
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
        <div :class="$style.checkItem">
            <div :class="$style.checkbox" >
                <FormCheckbox v-model="ticket.isROC" :true-value="1" :false-value="0" disabled/>
            </div>
            <div :class="$style.checkBrief">
                Register of Charges
            </div>
        </div>    
        <div :class="$style.checkItem">
            <div :class="$style.checkbox" >
                <FormCheckbox v-model="ticket.isROM" :true-value="1" :false-value="0" disabled/>
            </div>
            <div :class="$style.checkBrief">
                Register of Members
            </div>
        </div>    
        <div :class="$style.checkItem">
            <div :class="$style.checkbox" >
                <FormCheckbox v-model="ticket.isROBO" :true-value="1" :false-value="0" disabled/>
            </div>
            <div :class="$style.checkBrief">
                Register of Beneficial owner
            </div>
        </div>
        <br />

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

    export default {
        name: "FilingOfRegister",
        components:{
        },
        computed: {
            ticket() {
                return this.$store.state.ticket.ticket;
            },
        },
        created(){
        },
        methods:{ 
            nextStep() {
                this.$emit('nextStep')
            },

        }
    }
</script>
<style lang="scss" module>
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
