<template>
    <div>

        <RecordItem v-for="(item, i) in value" :key="i" :readonly="readonly || mode == 'edit'" :record-index="i" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow">
            <RulesElement :processTypes="processTypes" :licensees="licensees" :officers="officers" v-model="value[i]"  :i="i" :notificationGroups="notificationGroups" :readonly="readonly" />
        </RecordItem>
    </div>
</template>

<script>

    import recordMixin1 from 'Mixins/recordMixin1';
    import RulesElement from './RulesElement';

    export default {
        name: "RulesGrid",
        mixins: [ recordMixin1 ],
        components: {
            RulesElement
        },
        props:{
            readonly: Boolean,
            processTypes: {
                type: Array,
                default: () => []
            },
            licensees: {
                type: Array,
                default: () => []
            },
            officers: {
                type: Array,
                default: () => []
            },
            notificationGroups: {
                type: Array,
                default: () => []
            },
            mode: String,
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
                    department_id: this.userData.department_id,
                    processType_id: null,
                    process_id: null,
                    license_id: null,
                    officer_id: null
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