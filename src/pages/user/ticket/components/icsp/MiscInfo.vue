<template>
    <div>
        <div >
            <div>
                <TrainingStaff readonly v-model="staffJson"></TrainingStaff>
            </div>
            <FormRow>
                <div class="col-sm-12">
                    <InputTextArea readonly label="Training Program Details" v-model="ticket.TrainingProgramDetail" rows="3" maxlength="250" />
                </div>
            </FormRow>
            <ButtonGroup>
                <FormButton type="primary" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
                <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
            </ButtonGroup>
        </div>
    </div>
</template>

<script>

    import TrainingStaff from './component/trainingStaff'

    export default {
        name: "MiscInfo",
        props:{
            readonly: Boolean
        },
        components: {
            TrainingStaff
        },
        data() {
          return {
              operationTypes: [],
              isModalVisible: false,
              openedPanel: 'applying_for_license'
          }
        },
        computed:{
            ticket() {
                return this.$store.state.ticket.ticket;
            },
            staffJson() {
                return this.ticket.staffJson !== null && this.ticket.staffJson !== '' ? JSON.parse(this.ticket.staffJson) : []
            },
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
    .checkboxes {
        display: flex;
        margin-bottom: 20px;
        > span {
            margin-right: 30px;
        }
    }
</style>
