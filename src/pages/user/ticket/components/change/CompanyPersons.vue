<template>
    <div>
        <DataTable :actions="true"
                   :data="persons"
                   :columns="tableColumns()">
        </DataTable>
        <Popup :value="popVisible" @close="showPopup2(false)" title="Person Info" width="700">
                    
            <FormRow>
                <div class="col-sm-6">
                    <InputText label="Name" v-model="personData.PersonName" readonly />
                </div>
                <div class="col-sm-6">
                    <InputText label="Change Type" v-model="personData.ChangeAction" readonly />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <InputText label="Address" v-model="personData.ResidenceAddress" readonly />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-6">
                    <InputDate  label="Date of Appointment" v-model="personData.EffectiveDate" readonly />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-6" v-if="personData.ChangeAction === 'Cessation'">
                    <InputText  label="Resignation Reason" v-model="personData.ResignationReason" readonly />
                </div>
            </FormRow>


        </Popup>

    </div>
    
</template>

<script>

    import DataTable from 'Components/DataTable'
    import DateUtil from 'Utils/dateUtil';
    import tableColumn from './table';
    import InputDate from 'Components/form/InputDate';

    export default {
        name: "CompanyPersons",
        data() {
            return {
                personData: [],
                tableColumns: tableColumn,
                popVisible: false,
            }
        },
        components: {
            DataTable,
            InputDate
        },
        props: {
            persons: Array
        },
        methods:{
            openPop(data){
                this.personData = this.persons.find((item) => {
                    return item.id === data;
                });
                this.showPopup2(true);
            },
            showPopup2(val){
                this.popVisible = val;
            },
        }
    }
</script>
