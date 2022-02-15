<template>
    <div>
        <!-- <FormRow>
            <div class="col-sm-6">
                <InputText name="Licensee" label="Licensee" readonly :clearable="true" v-model="ticket.CompanyName" />
            </div>
        </FormRow> -->
        <FormRow>
            <div class="col-sm-4">
                <FormSelect label="Quarter"  v-model="ticket.Qtr" disabled :items="quaters" itemName="name" itemValue="val" :clearable="false" rules="required"/>
            </div>
            <div class="col-sm-2">
                <InputText label="Year"  v-model="ticket.Year" readonly :clearable="false" rules="required"/>
            </div>
            <!-- <div class="col-sm-4">
                <InputMonth name="Month" label="Month" readonly :clearable="true" v-model="ticket.month" rules="required"/>
            </div> -->
        </FormRow>

        <FormRow>
            <div class="col-sm-6">
                <a :href="ticket.url" target="_blank" :class="$style.view">View File <Icon type="md-eye" :class="$style.eye" /></a>
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
        name: "QuaterReturn",
        components:{
        },
        data(){
            return{
                quaters: [
                    {
                        name: 'First Quarter',
                        val: 1
                    },
                    {
                        name: 'Second Quarter',
                        val: 2
                    },
                    {
                        name: 'Third Quarter',
                        val: 3
                    },
                    {
                        name: 'Fourth Quarter',
                        val: 4
                    },
                ],

            }
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
