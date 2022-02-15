<template>
    <div>
        <RecordItem v-for="(item, i) in value" readonly :key="i" :record-index="i" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow" >
            <FormRow>
                <div class="col-sm-4">
                    <InputText readonly v-model="item.E_Employername" label="Name" rules="required" />
                </div>
                <div class="col-sm-4">
                    <AddressInput readonly v-model="item.E_employerAddress_id" label="Address" rules="required" />
                </div>
                <div class="col-sm-4">
                    <InputText readonly v-model="item.E_EmployerContact" label="Contact Detail of Employer" rules="required" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-4">
                    <InputText readonly v-model="item.E_NatureOfBusiness" label="Nature of Business" rules="required" />
                </div>
                <div class="col-sm-4">
                    <InputText readonly v-model="item.E_Position" label="Position Held" rules="required" />
                </div>
                <div class="col-sm-2">
                    <InputDate readonly v-model="item.E_EmploymentStartDate" label="Start Date" rules="required" />
                </div>
                <div class="col-sm-2">
                    <InputDate readonly v-model="item.E_EmploymentEndDate" label="End Date" />
                </div>
            </FormRow>
        </RecordItem>
    </div>
</template>

<script>

    import recordMixin from 'Mixins/recordMixin'
    import InputDate from 'Components/form/InputDate';
    import AddressInput from 'Components/form/addressInput/AddressInput';

    export default {
        name: "EmployerRecords",
        components: { AddressInput, InputDate },
        mixins: [recordMixin],
        props: ['pqId'],
        created() {
            if (this.value.length === 0) {
                this.pushEmptyValue()
            }
        },
        methods: {
            addRow() {
                this.pushEmptyValue()
            },
            pushEmptyValue() {
                this.value.push({
                    "PQRecord_id": null,
                    "pq_id":  this.pqId,
                    "RecordType": "Emplr",
                    "E_Employername": "",
                    "E_employerAddress_id": null,
                    "E_EmployerContact": "",
                    "E_NatureOfBusiness": "",
                    "E_Position": "",
                    "E_EmploymentStartDate": '',
                    "E_EmploymentEndDate": ''
            })
            }
        }
    }
</script>
