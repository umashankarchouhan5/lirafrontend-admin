<template>
    <div>
        
        <FormRow>
            <div class="col-sm-2" v-if="ticket.process_id">
                <InputText readonly
                    v-model="ticket.EntityType"
                    label="Entity Type"
                    rules="required" />
            </div>
        </FormRow>
        <FormRow v-if="ticket.process_id && ticket.Company_id !== null">\
            <div class="col-sm-2">
                <InputText rules="required" label="Reg #" disabled v-model="ticket.CompanyRegNo" />
            </div>
            <div class="col-sm-7">
                <InputText
                    readonly
                    label="Name"
                    rules="required"
                    v-model="ticket.CompanyName" 
                />
            </div>
        </FormRow>

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
        name: "RestorationByCourtOrder",
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
