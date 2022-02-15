<template>
    <div class="recordLine">
        <RecordItem v-for="(item, i) in value" :key="i" readonly :record-index="i" :length="value.length">
        <FormRow>
                <div class="col-sm-4">
                    <InputText readonly v-model="item.D_Training" label="Training" />
                </div>
                <div class="col-sm-4">
                    <InputText readonly v-model="item.D_trainingProvider" label="Training Provider" />
                </div>
                <div class="col-sm-2">
                    <InputText readonly v-model="item.D_Duration" label="Duration  (Ex: 2 Years)" />
                </div>
                <div class="col-sm-2">
                    <YearSelect readonly v-model="item.D_TrainingYear"
                                 label="Year" />
                </div>
            </FormRow>
        </RecordItem>
    </div>
</template>

<script>

    import recordMixin from 'Mixins/recordMixin'

    export default {
        name: "TrainingRecords",
        mixins: [recordMixin],
        props: ['pqId'],
        methods: {
            pushEmptyValue() {
                this.value.push({
                    "PQRecord_id": null,
                    "pq_id": this.pqId,
                    "RecordType": "Train",
                    "D_Training": "",
                    "D_trainingProvider": "",
                    "D_Duration": "",
                    "D_TrainingYear": ""
                })
            }
        }
    }
</script>

<style>
    .recordLine > .row {
        position: relative;
    }
</style>
