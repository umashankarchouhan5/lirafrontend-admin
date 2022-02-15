<template>
    <div>
        <div >
            <FormRow>
                <div class="col-sm-6">
                    <a @click="showSummaryModal(true)">Summary</a>
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-6">
                    <InputText label="Select Company Name" readonly v-model="ticket.Companyname" title="If your company is not yet incorporated, you can still submit."  />
                </div>
                <div class="col-sm-3" v-if="ticket.incorporationdate !== '1900-01-01'">
                    <InputDate readonly label="Date of Incorporation" type="date" v-model="ticket.incorporationdate" />
                </div>
                <div class="col-sm-3" v-if="ticket.incorporationdate === '1900-01-01'">
                    <InputDate readonly label="Date of Incorporation" type="date" value="" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <AddressInput readonly label="Registered Address"  v-model="ticket.address_id" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <AddressInput readonly label="Principal Place of Business"  v-model="ticket.PrincipalAddress_id" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <InputTextArea readonly label="Former trading or corporate names by proposed company used in the past ten years, if any." v-model="ticket.OldNames" />
                </div>
            </FormRow>

            <h6>Principle Contact Person</h6>
            <FormRow >
                <div class="col-sm-12">
                    <Person readonly v-model="ticket.PrimaryPersonData" />
                </div>
            </FormRow>

            <h6>Other Contact Person</h6> 
            <FormRow >
                <div class="col-sm-12">
                    <Person readonly v-model="ticket.OtherPersonData" />
                </div>
            </FormRow>
        <ButtonGroup>
            <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
        </ButtonGroup>
        </div>
        
        <Popup title="Information" width="700" :value="summaryVisible" @close="() => showSummaryModal(false)">
            <DataTable :actions="true"
                :data="summary"
                :columns="tableConfig">
            </DataTable>
            <div slot="footer">
                <FormButton  @click="() => showSummaryModal(false)">Ok</FormButton>
            </div>
        </Popup>
    </div>
</template>

<script>

    import InputDate from 'Components/form/InputDate';
    import AddressInput from 'Components/form/addressInput/AddressInput';
    import Person from 'Components/Person';
    import tableConfigs from './table';
    import DataTable from 'Components/DataTable';
   

    export default {
        name: "GeneralInfo",
        data() {
          return {
                isModalVisible: false,
                openedPanel: 'applying_for_license',
                summaryVisible: false,
                tableConfig: tableConfigs,
          }
        },
        props:{
            readonly: Boolean,
            value: {
                type: Object,
                required: true,
            },
        },
        computed:{
            ticket() {
                return this.$store.state.ticket.ticket;
            },
            summary(){
                return JSON.parse(this.ticket.CSPSummary)
            }
        },
        components: {
            InputDate,
            AddressInput,
            Person,
            DataTable,
        },
        created(){
            
        },
        methods: {
            showSummaryModal(data){
                if(this.ticket !== '' && this.ticket !== ' ' && this.ticket !== null){
                    this.summaryVisible = data;
                }
            },
            saveRequest(activeStep) {
                this.$emit('onSave', activeStep)
            },
            nextStep() {
                this.$emit('nextStep')
            },
            
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
    .selectSource {
        display: flex;
        justify-content: space-between;
        min-width: 200px;
    }
</style>
