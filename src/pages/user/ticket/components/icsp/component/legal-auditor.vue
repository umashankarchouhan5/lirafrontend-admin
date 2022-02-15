<template>
    <div>
        <RecordItem v-for="(item, i) in valueUp" :key="i" :record-index="i" :length="value.length" readonly @onAddRow="addRow" @onDeleteRow="deleteRow" >
            <FormRow>
                <div class="col-sm-4">
                    <InputText label="Name" readonly v-model="item.name" rules="required" />
                </div>
                <div class="col-sm-4">
                    <InputText type="email" readonly label="Email" rules="required|email" v-model="item.email" />
                </div>
                <div class="col-sm-4">
                    <InputTel label="Phone" disabled rules="required" v-model="item.phone" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-6">
                    <InputText label="Address" readonly rules="required" v-model="item.address" />
                </div>
            </FormRow>
        </RecordItem> 
    </div>
</template>

<script>

    import recordMixin from 'Mixins/recordMixin1';
    import InputTel from "Components/form/InputTel";

    export default {
        name: "Record",
        mixins: [recordMixin],
        components: {
            InputTel
        },
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
                    name: '',phone: '',email: '',address: ''
                })
                return this.value;
            }, 
        }
    }
</script>
