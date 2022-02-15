<template>
    <div>
        <h6>Documents Requested</h6>
        <RecordItem v-for="(item, i) in value" :key="i" :readonly="readonly" :record-index="i" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow">
            <FormRow :class="$style.indentClass">
                <div class="col-sm-6">
                    <InputText label="Document Brief"  :vid="`Doc-${i}`" v-model="item.brief" :readonly="readonly" />
                </div>
            </FormRow>
        </RecordItem>
    </div>
</template>

<script>

    import recordMixin1 from 'Mixins/recordMixin1';

    export default {
        name: "RequiredDocuments",
        mixins: [ recordMixin1 ],
        data() {
            return {
                
            }
        },
        props:{
            readonly: Boolean,
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
                    brief: '',
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