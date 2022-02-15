<template>
    <div>
        <RecordItem  v-for="(item, i) in value" readonly :key="i" :record-index="i" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow" >
            <FormRow>
                <div class="col-sm-6">
                    <InputText readonly v-model="item.F_CompanyName" label="Company Name" required />
                </div>
                <div class="col-sm-6">
                    <InputText readonly v-model="item.F_CompanyNumber" label="Company Number" required />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-4">
                    <FormSelect
                            disabled
                            v-model="item.F_CountryOfReg"
                            :items="countries"
                            item-name="Name"
                            item-value="id"
                            label="Country" />
                </div>
                <div class="col-sm-4">
                    <InputText readonly v-model="item.F_NatureOfBusiness" label="Nature of Business" required />
                </div>
                <div class="col-sm-4">
                    <InputText readonly v-model="item.F_Position" label="Position Held" required />
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
                    "RecordType": "Direc",
                    "F_CompanyName": "",
                    "F_CompanyNumber": "",
                    "F_NatureOfBusiness": "",
                    "F_CountryOfReg": null,
                    "F_Position": ""
                })
            }
        }
    }
</script>
