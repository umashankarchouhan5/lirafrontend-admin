<template>
    <div>
        <h6>Entity List</h6>
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
        data() {
            return {
                // entityType: null,
            }
        },
        props:{
            readonly: Boolean,
            entityType: String,
        },
        watch:{
            value:{
                deep: true,

                handler(val){
                    if(this.value.length == 0){
                        // this.entityType = null;
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
        margin-left: 0px;
    }
</style>