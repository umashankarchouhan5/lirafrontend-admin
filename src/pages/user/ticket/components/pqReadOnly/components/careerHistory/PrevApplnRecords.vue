<template>
    <div class="recordLine">
        <RecordItem readonly v-for="(item, i) in value" :key="i" :record-index="i" :length="value.length" @onDeleteRow="deleteRow" >
            <FormRow>
                <div class="col-sm-4">
                    <InputText readonly v-model="item.K_position" label="Position" rules="required" />
                </div>
                <div class="col-sm-4">
                    <InputText readonly v-model="item.K_jurisdiction" label="Jurisdiction" rules="required" />
                </div>
                <div class="col-sm-4">
                    <InputText readonly v-model="item.K_RAuthority" label="Regulatory Authority" rules="required" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-4">
                    <YearSelect readonly label="Year" v-model="item.K_Year" />
                </div>
                <div class="col-sm-4">
                    <InputText readonly v-model="item.K_NatureOfBusiness" label="Nature of Business" rules="required" />
                </div>
                <div class="col-sm-4">
                    <InputText readonly label="Outcome" v-model="item.K_outcome" />
                </div>
            </FormRow>
        </RecordItem>
    </div>
</template>

<script>

    import recordMixin from 'Mixins/recordMixin'

    export default {
        name: "PrevAppInnRecords",
        mixins: [recordMixin],
        props: ['pqId'],
        methods: {
            pushEmptyValue() {
                this.value.push({
                        "PQRecord_id": null,
                        "pq_id": this.pqId,
                        "RecordType": "PrevA",
                        "K_position": "",
                        "K_jurisdiction": "",
                        "K_RAuthority": "",
                        "K_Year": "",
                        "K_NatureOfBusiness": "",
                        "K_outcome": ""
                    })
            }
        }
    }
</script>
