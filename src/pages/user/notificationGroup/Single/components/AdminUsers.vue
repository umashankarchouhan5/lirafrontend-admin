<template>
    <div>

        <RecordItem v-for="(item, i) in value" :key="i" :readonly="readonly" :record-index="i" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow">
            <FormRow>
                <div class="col-sm-5">
                    <FormSelect label="Select User" rules="required" :vid="`AdminUser-${i}`" v-model="value[i].admin_id" :items="adminUsers" itemName="Name" itemValue="id"  />
                </div>
            </FormRow>
        </RecordItem>
    </div>
</template>

<script>

    import recordMixin1 from 'Mixins/recordMixin1';

    export default {
        name: "AdminUsers",
        mixins: [ recordMixin1 ],
        props:{
            readonly: Boolean,
            adminUsers: {
                type: Array,
                default: () => []
            },
        },
        data() {
            return {
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
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
                    admin_id: null
                })
            },
        }
    }
</script>
<style lang="scss" module>
    .indentClass{
        margin-left: 0px;
    }
    .required {
        color: #ff3547;
        margin-left: 2px;
    }

</style>