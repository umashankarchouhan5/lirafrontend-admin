<template>
    <div>
        <RecordItem readonly v-for="(item, i) in value" :key="i" :record-index="i" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow">
            <FormRow>
                <div class="col-sm-4">
                    <InputText readonly v-model="item.M_BankName" rules="required" label="Name of Bank" />
                </div>
                <div class="col-sm-4">
                    <AddressInput readonly label="Address" v-model="item.M_BankAddress_id" />
                </div>
                <div class="col-sm-4">
                    <InputTel disabled label="Phone Number" v-model="item.M_BankContactNo" />
                </div>
            </FormRow>
        </RecordItem>
    </div>
</template>

<script>

    import InputTel from 'Components/form/InputTel';
    import AddressInput from 'Components/form/addressInput/AddressInput';
    import recordMixin from 'Mixins/recordMixin';

    export default {
        name: "BankRecords",
        mixins: [recordMixin],
        components: {
            InputTel,
            AddressInput
        },
        methods: {
            pushEmptyValue() {
                this.value.push({
                    "PQRecord_id": null,
                    "pq_id": this.pqId,
                    "RecordType": "Bank",
                    "M_BankContactNo": "",
                    "M_BankName": "",
                    "M_BankAddress_id": null
                })
            }
        }
    }
</script>
