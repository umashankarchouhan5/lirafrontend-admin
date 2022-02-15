<template>
    <div>
        <FormRow :class="$style.indentClass">
            <div class="col-sm-1">
                <InputText type="number" v-model="innerValue.qty" rules="required" />
            </div>
            <div class="col-sm-3">
                <InputText v-model="innerValue.narration" rules="required" />
            </div>
            <div class="col-sm-2">
                <InputAmount v-model="innerValue.amount" rules="required" rightAlignText />
            </div>
            <div class="col-sm-1">
                <InputAmount v-model="innerValue.penalty" rightAlignText />
            </div>
            <div class="col-sm-1">
                <InputText type="number" v-model="innerValue.taxpct" rightAlignText />
            </div>
            <div class="col-sm-2">
                <InputAmount v-model="calculateTax" rightAlignText readonly />
            </div>
            <!-- <div class="col-sm-1">
                <InputAmount v-model="innerValue.discount" />
            </div> -->
            <div class="col-sm-2">
                <InputAmount v-model="calculateLineTotal" rightAlignText readonly />
            </div>
        </FormRow>
    </div>
</template>

<script>

    import valueMixin from 'Mixins/valueMixin';

    export default {
        name: "PaymentRow",
        mixins: [ valueMixin ],
        props:{
            readonly: Boolean,
            i: Number,
        },
        data() {
            return {
            }
        },
        computed: {
            calculateTax: {
                get() {
                    return Number(this.innerValue.qty) * Number(this.innerValue.amount) * (Number(this.innerValue.taxpct) / 100);

                },
                set(val) {
                    this.innerValue.tax = val;
                }
            },
            calculateLineTotal: {
                get() {
                    return Number(this.innerValue.qty) * Number(this.innerValue.amount) + Number(this.innerValue.tax) + Number(this.innerValue.penalty) - Number(this.innerValue.discount);
                },
                set(val) {
                    this.innerValue.lineTotal =  val;
                }
            }
        },
        watch:{
            value:{
                deep: true,
                handler(val){
                    
                }
            },
            // 'innerValue.taxpct': function (val) {
            //     this.innerValue.tax = this.calculateTax;
            // }
        },
        methods: {
            
            
        }
    }
</script>
<style lang="scss" module>
    .indentClass{
        margin-left: 0px;
    }
</style>