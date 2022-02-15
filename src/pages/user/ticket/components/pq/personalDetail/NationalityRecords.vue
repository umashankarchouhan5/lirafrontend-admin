<template>
    <div>
        <RecordItem v-for="(item, i) in value" :key="i" :record-index="i" :readonly="readonly" :length="value.length">
            <FormRow>
                <div class="col-sm-4">
                    <FormSelect
                            :disabled="readonly"
                            :items="identificationTypes"
                            item-name="DisplayName"
                            v-model="item.N_IDType_id"
                            item-value="id"
                            label="Identification Type" />
                </div>
                <div class="col-sm-4">
                    <InputText :readonly="readonly" label="Identification Number" v-model="item.N_IDNo" />
                </div>
                <div class="col-sm-4">
                    <InputDate :readonly="readonly" label="Expiry Date" v-model="item.N_IdExpiryDate" />
                </div>
            </FormRow>
        </RecordItem>
    </div>
</template>

<script>

    import InputDate from 'Components/form/InputDate';
    import recordMixin from 'Mixins/recordMixin';

    export default {
        name: "NationalityRecords",
        mixins: [recordMixin],
        computed: {
            identificationTypes() {
                return this.$store.state.common.identificationTypes;
            }
        },
        components: {
            InputDate
        },
        methods: {
            pushEmptyValue() {
                this.value.push({
                    PQRecord_id: null,
                    pq_id: this.pqId,
                    N_IDType_id: null,
                    N_IDNo: null,
                    N_IdExpiryDate: null,
                    RecordType: "Natnl",
                })
            }
        }
    }
</script>
