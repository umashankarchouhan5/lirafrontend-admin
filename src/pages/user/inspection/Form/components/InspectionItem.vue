<template>
    <div>
        <FormRow :class="$style.indentClass">
            <div class="col-sm-7">
                <FormSelect label="Select Inspection Item" :items="notSelectedInspectionItem" :disabled="inspectionItems.length === 0 || readonly" rules="required" item-name="Name" item-value="id" v-model="innerValue.inspectionItem_id" :vid="`item-${i}`"  />
            </div>
        </FormRow>
    </div>
</template>

<script>

    import valueMixin from 'Mixins/valueMixin';

    export default {
        name: "InspectionItem",
        mixins: [ valueMixin ],
        props:{
            readonly: Boolean,
            i: Number,
            inspectionItems: Array,
            selectedItems: Array
        },
        data() {
            return {
            }
        },
        
        computed: {
            notSelectedInspectionItem() {
                return this.inspectionItems.filter( item => {
                    return (this.selectedItems.find(val => val.inspectionItem_id === item.id) == undefined) || (item.id == this.innerValue.inspectionItem_id) ;
                })
            },
        },
        watch:{
            value:{
                deep: true,
                handler(val){
                    
                }
            },
            'innerValue.EntityType': function(val){
                this.innerValue.inspectionItem_id = null
            },
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