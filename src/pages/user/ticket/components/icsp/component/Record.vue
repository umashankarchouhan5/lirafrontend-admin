<template>
    <div>
        <RecordItem v-for="(item, i) in valueUp" :key="i" :record-index="i" :length="value.length" readonly>
            <FormRow>
                <div class="col-sm-8">
                    <InputText label="Details" readonly v-model="item.B_SourceOfCapital" />
                </div>
                <div class="col-sm-4">
                    <InputAmount label="Amount (SCR)" readonly  v-model="item.B_Amount" />
                </div>
            </FormRow>
        </RecordItem> 
    </div>
</template>

<script>

    import recordMixin from 'Mixins/recordMixin';

    export default {
        name: "Record",
        mixins: [recordMixin],
        data(){
            return{
                valueUp: this.value
            }
        },
        computed:{
            userData() {
                return this.$store.state.user.user
            }, 
        },
        methods: {
            pushEmptyValue() {
                this.value.push({
                    "ICSPRequestrecord_id": null,
                    "A_NameUsed": '',
                    "B_Amount": 0,
                    "B_SourceOfCapital": '',
                    "RecordType": this.recordType,
                    "icsprequest_id": this.userData.icsp_id
                })
                return this.value;
            }, 
        }
    }
</script>
