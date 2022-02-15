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
        
        <h6>Requested Documents</h6>
        <div v-for="(doc,index) in getModifiedDocsList(ticket.requestedDoc)" :key="index">
            <p :class="$style.docBrief">{{doc.DOcumentBrief}}</p>  
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
        name: "CertifiedCopy",
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
            getModifiedDocsList(list){
                return JSON.parse(list);
            },
            nextStep() {
                this.$emit('nextStep')
            },

        }
    }
</script>
<style lang="scss" module>
    .docBrief {
        margin: 5px 10px;
        background: lighten(#ccc, 17%);
        padding: 5px 8px;
        border-bottom: 1px solid #e1e1e1;
    }

</style>
