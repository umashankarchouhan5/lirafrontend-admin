<template>
    <div>
        <FormRow>
            <div class="col-sm-3" >
                <InputText
                    label="Select Entity Type"
                    rules="required"
                    v-model="ticket.EntityType" readonly 
                />
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-2">
                <InputText readonly label="Reg. #" :value="ticket.CompanyRegNo" />
            </div>
            <div class="col-sm-5">
                <InputText readonly label="Entity Name" :value="ticket.CompanyName" />
            </div>
        </FormRow>
        <!-- <Documents /> -->
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
    
    // import Documents from '../Documents'

    export default {
        name: "FilingOfDocument",
        components:{
            // Documents
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
    .eye{
        font-size: 17px;
    }
    .inputStyle{
        word-break: break-all;
    }
    .view {
        text-align: left;
        margin-left: auto;
        margin-right: 5px;
        display: inline-block;
        vertical-align: middle;
    }

</style>
