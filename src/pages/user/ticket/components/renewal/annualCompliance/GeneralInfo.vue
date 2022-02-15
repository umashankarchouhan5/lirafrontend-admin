<template>
    <div>
        <div :width="700">
            
            <div v-for="(item, i) in ticket"  :key="item.Qid">
                <ListItem  v-model="ticket[i]"  v-if="item.Page === stepId "  >
                    <div :class="$style.flexClass">
                        <p :class="$style.firstItem"><b>{{item.QNo}} &nbsp; : </b></p><span v-html="item.QText"></span> 
                    </div>
                </ListItem>
            </div>

            <ButtonGroup>
                <FormButton type="primary" v-if="stepId !== 1" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
                <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
            </ButtonGroup>
        </div>
    </div>
</template>

<script>

    import ListItem from './listRender'

    export default {
        name: "GeneralInfo", 
        data() {
          return {
                isModalVisible: false,
                isAddressSame: false,
                ticket: [],
          }
        },
        props: {
            readonly: Boolean,
            stepId: Number,
        },
        created(){
            this.getComplianceData();
        },
        watch:{
            ticket:{
                deep: true,
                handler(val){
                }
            },
        },
        components: {
            ListItem,
        },
        computed: {
            ticketData() {
                return this.$store.state.ticket.ticket;
            },
        },
        methods: {
            getComplianceData(){
                this.ticket = JSON.parse(this.ticketData.ComplianceJson);
            },
            checkDisabled(item){
                const commandingQuestion = this.ticket.find((val) => {
                    return item.SkipWhenQid === val.Qid
                })
                if(commandingQuestion.CheckedYN === item.ResponseYN ){
                    return true;
                }
                else{
                    return false;
                }
            },
            saveRequest(activeStep) {
                this.$emit('onSave', activeStep)
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
    .flexClass {
        display: flex;
        justify-content: flex-start;
        .firstItem{
            min-width: 40px;
        }
    }
    .checkboxes {
        display: flex;
        margin-bottom: 20px;
        > span {
            margin-right: 30px;
        }
    }
    .selectSource {
        display: flex;
        justify-content: space-between;
        min-width: 200px;
    }
</style>
