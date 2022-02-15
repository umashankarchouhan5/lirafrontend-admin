<template>
    <div>
        <FormRow :class="$style.tableRow">
            <div class="col-sm-1">
                <strong>Quantity <span :class="$style.required">*</span></strong>
            </div>
            <div class="col-sm-3">
                <strong>Narration <span :class="$style.required">*</span></strong>
            </div>
            <div class="col-sm-2">
                <strong>Amount <span :class="$style.required">*</span></strong>
            </div>
            <div class="col-sm-1">
                <strong>Penalty</strong>
            </div>
            <div class="col-sm-1">
                <strong>Tax %</strong>
            </div>
            <div class="col-sm-2">
                <strong>Tax</strong>
            </div>
            <!-- <div class="col-sm-1">
                <strong>Discount</strong>
            </div> -->
            <div class="col-sm-2">
                <strong>Line Total</strong>
            </div>
        </FormRow>
        <RecordItem v-for="(item, i) in value" :key="i" :readonly="readonly" :record-index="i" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow">
            <PaymentRow :class="$style.indentClass" v-model="value[i]"  :i="i" :readonly="readonly" />
        </RecordItem>
    </div>
</template>

<script>

    import recordMixin1 from 'Mixins/recordMixin1';
    import PaymentRow from './PaymentRow';

    export default {
        name: "PaymentGrid",
        mixins: [ recordMixin1 ],
        components: {
            PaymentRow
        },
        props:{
            readonly: Boolean,
        },
        data() {
            return {
            }
        },
        created() {
        },
        watch:{
            value:{
                deep: true,
                handler(val){
                    if(this.value.length == 0){
                        this.pushEmptyValue();
                    }
                }
            },
        },
        methods: {
            pushEmptyValue() {
                this.value.push({
                    qty: 1,
                    narration: '',
                    amount: '',
                    penalty: 0,
                    taxpct: 0,
                    tax: 0,
                    lineTotal: 0,
                    discount: 0
                })
            },
        }
    }
</script>
<style lang="scss" module>
    .indentClass{
        margin-left: 0px;
    }
    .tableRow {
        margin: 0px 0px 25px;
        padding: 0px 45px 0px 0px;
    }
    .required {
        color: #ff3547;
        margin-left: 2px;
    }

</style>