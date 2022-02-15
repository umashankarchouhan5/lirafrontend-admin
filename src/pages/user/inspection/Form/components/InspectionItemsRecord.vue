<template>
    <div>
        <RecordItem v-for="(item, i) in value" :key="i" :readonly="readonly" :record-index="i" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow">
            <InspectionItem :class="$style.indentClass" v-model="value[i]" :inspectionItems="inspectionItems" :selectedItems="value" :i="i" :readonly="readonly" />
        </RecordItem>
    </div>
</template>

<script>

    import recordMixin1 from 'Mixins/recordMixin1';
    import InspectionItem from './InspectionItem';

    export default {
        name: "InspectionItemsRecord",
        mixins: [ recordMixin1 ],
        components: {
            InspectionItem
        },
        props:{
            readonly: Boolean,
            entityTypes: Array,
            inspectionItems: Array,
            entityType: { type:[String, Array, Object], default: null }
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
                    else{
                        this.value.forEach(item => {item.EntityType = this.entityType});
                    }
                }
            },
        },
        methods: {
            pushEmptyValue() {
                this.value.push({
                    inspectionItem_id: null,
                    EntityType: this.entityType,
                })
            },
        }
    }
</script>
<style lang="scss" module>
    .indentClass{
        margin-left: 0px;
    }
</style>