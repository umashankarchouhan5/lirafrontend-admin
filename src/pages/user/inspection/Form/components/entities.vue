<template>
    <div>
        <h6>Entities</h6>
        <FormRow :class="$style.indentClass1">
            <div class="col-sm-3">
                <FormSelect label="Entity Type" :items="entityTypes" item-name="name" item-value="name" v-model="entityType" disabled  />
            </div>
        </FormRow>
        <RecordItem v-for="(item, i) in value" :key="i" :readonly="readonly" :record-index="i" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow">
            <EntityCompany :class="$style.indentClass"  :i="i" v-model="value[i]" />
        </RecordItem>
    </div>
</template>

<script>

    import recordMixin1 from 'Mixins/recordMixin1';
    import EntityCompany from './entityCompany';

    export default {
        name: "Entities",
        mixins: [ recordMixin1 ],
        components: {
            EntityCompany
        },
        props:{
            readonly: Boolean,
            entityTypes: Array,
            selectedEntityType: [ String,Object ],
            entityType: String
        },
        data() {
            return {
                // entityType: null,
            }
        },
        watch:{
            value:{
                deep: true,

                handler(val){
                    if(this.value.length == 0){
                        this.entityType = null;
                        this.pushEmptyValue();
                    }
                }
            },
            entityType(val) {
                this.value.map(item => {
                    item.entityType = this.entityType
                })
            }
        },
        methods: {
           
            pushEmptyValue() {
                this.value.push({
                    CompanyName:'',
                    CompanyRegNo: '',
                    company_id: null,
                    entityType: this.entityType,
                })
            },
        }
    }
</script>

<style lang="scss" module>
    .indentClass{
        margin-left: 15px;
    }
    .indentClass1{
        margin-left: 0px;
    }
</style>