<template>
    <div class="recordLine">
        <RecordItem readonly v-for="(item, i) in value" :key="i" :record-index="i" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow" >
            <FormRow>
                <div class="col-sm-6">
                    <InputText readonly v-model="item.G_TrustName" label="Name of Trust" required />
                </div>
                <div class="col-sm-6">
                    <InputText readonly v-model="item.G_TrustNumber" label="Registration Number" required />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-6">
                    <FormSelect
                            disabled
                            v-model="item.G_CountryOfReg"
                            :items="countries"
                            item-name="Name"
                            item-value="id"
                            label="Country of Registration" />
                </div>
                <div class="col-sm-6">
                    <InputText readonly v-model="item.G_Position" label="Position Held" />
                </div>
            </FormRow>
        </RecordItem>
    </div>
</template>

<script>

    import recordMixin from 'Mixins/recordMixin'

    export default {
        name: "TrusteeRecords",
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
                    "RecordType": "Trust",
                    "G_TrustName": "",
                    "G_TrustNumber": "",
                    "G_CountryOfReg": null,
                    "G_Position": ""
                })
            }
        }
    }
</script>
