
<template>
    <div class="recordLine">
        <RecordItem readonly v-for="(item, i) in value" :key="i" :record-index="i" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow" >
            <FormRow>
                <div class="col-sm-6">
                    <InputText readonly v-model="item.J_position" label="Position" />
                </div>
                <div class="col-sm-6">
                    <InputText readonly v-model="item.J_jurisdiction" label="Jurisdiction" required />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-4">
                    <YearSelect readonly label="Year" v-model="item.J_Year" />
                </div>
                <div class="col-sm-4">
                    <InputText readonly v-model="item.J_NatureOfBusiness" label="Nature of Business" required />
                </div>
                <div class="col-sm-4">
                    <InputText readonly label="Regulatory Authority" v-model="item.J_RAuthority" />
                </div>
            </FormRow>
        </RecordItem>
    </div>
</template>

<script>

    import recordMixin from 'Mixins/recordMixin'

    export default {
        name: "KeyPersonRecords",
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
                    "pq_id": this.pqId,
                    "RecordType": "KPer",
                    "J_position": "",
                    "J_jurisdiction": "",
                    "J_Year": "",
                    "J_NatureOfBusiness": "",
                    "J_RAuthority": ""
                })
            }
        }
    }
</script>
