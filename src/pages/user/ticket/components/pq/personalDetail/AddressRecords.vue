<template>
    <div>
        <RecordItem v-for="(item, i) in value" :key="i" :record-index="i" :readonly="readonly" :length="value.length">
            <FormRow>
                <div class="col-sm-2">
                    <FormSelect label="Month From"
                                :disabled="readonly"
                                v-model="item.L_PastMonthFrom"
                                :items="months"
                                item-name="label"
                                item-value="id"/>
                </div>
                <div class="col-sm-1">
                    <YearSelect readonly label="Year" v-model="item.L_PastyearFrom" />
                </div>
                <div class="col-sm-2">
                    <FormSelect label="Month To"
                                v-model="item.L_PastMonthTo"
                                :disabled="readonly"
                                :items="months"
                                item-name="label"
                                item-value="id"/>
                </div>
                <div class="col-sm-1">
                    <YearSelect readonly label="Year" v-model="item.L_PastyearTo" />
                </div>
                <div class="col-sm-6">
                    <AddressInput :readonly="readonly" label="Address" v-model="item.L_PastAddress_id"  />
                </div>
            </FormRow>
        </RecordItem> 
    </div>
</template>

<script>

    import AddressInput from 'Components/form/addressInput/AddressInput';
    import recordMixin from 'Mixins/recordMixin';

    export default {
        name: "AddressRecords",
        mixins: [recordMixin],
        data() {
            return {
                months: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ].map((item, i) => {
                    return {
                        id: i + 1,
                        label: item
                    }
                })
            }
        },
        components: {
            AddressInput
        },
        methods: {
            pushEmptyValue() {
                this.value.push({
                    PQRecord_id: null,
                    pq_id: this.pqId,
                    L_PastMonthFrom: null,
                    L_PastMonthTo: null,
                    L_PastyearFrom: null,
                    L_PastyearTo: null,
                    L_PastAddress_id: null,
                    RecordType: "Addrs"
                })
            }
        }
    }
</script>
