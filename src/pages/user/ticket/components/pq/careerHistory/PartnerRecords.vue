<template>
    <div class="recordLine">
        <RecordItem readonly v-for="(item, i) in value" :key="i" :record-index="i" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow" >
            <FormRow>
                <div class="col-sm-6">
                    <InputText readonly v-model="item.H_CompanyName" label="Company Name" required />
                </div>
                <div class="col-sm-6">
                    <InputText readonly v-model="item.H_CompanyNumber" label="Company Number" required />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-6">
                    <FormSelect
                            disabled
                            v-model="item.H_CountryOfReg"
                            :items="countries"
                            item-name="Name"
                            item-value="id"
                            label="Country of Registration" />
                </div>
                <div class="col-sm-6">
                    <InputText readonly v-model="item.H_NatureOfBusiness" label="Nature of Business" required />
                </div>
            </FormRow>
        </RecordItem>
    </div>
</template>

<script>

    import recordMixin from 'Mixins/recordMixin'

    export default {
        name: "DirectorRecords",
        mixins: [recordMixin],
        props: ['pqId'],
        computed: {
            countries() {
                return this.$store.state.common.countries;
            }
        },
        methods: {
            pushEmptyValue() {
                this.value.push({
                    "PQRecord_id": null,
                    "pq_id": this.pqId,
                    "RecordType": "Partn",
                    "H_CompanyName": "",
                    "H_CompanyNumber": "",
                    "H_CountryOfReg": null,
                    "H_NatureOfBusiness": ""
                })
            }
        }
    }
</script>
