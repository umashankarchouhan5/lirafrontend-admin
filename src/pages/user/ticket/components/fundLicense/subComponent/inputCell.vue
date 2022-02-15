<template> 
    <div >
        <!-- <br /> -->
        <InputText v-if="fieldsData === null" @focusout="onInputChangeHandler" v-model="row[keyVar]" :readonly="readonly" />
        <div v-else>
            
            <FormRow class="col-sm-10" >
                
                <InputText  @focusout="onInputChangeHandler"  v-model="row[keyVar]" v-if=" checkCondition(keyVar,'serial')"  :rules="{required: checkRequired(keyVar)}"  readonly />

                <InputText  @focusout="onInputChangeHandler"  v-model="row[keyVar]" v-if=" checkCondition(keyVar,'textbox')"  :rules="{required: checkRequired(keyVar)}"  readonly />

                <InputDate   @onChange="onInputChangeHandler" type="date"  v-model="row[keyVar]" v-if=" checkCondition(keyVar,'date')" :rules="{required: checkRequired(keyVar)}"  readonly />

                <InputText  @focusout="onInputChangeHandler" type="number"  v-model="row[keyVar]" v-if=" checkCondition(keyVar,'number')" :rules="{required: checkRequired(keyVar)}"  readonly />
                
                <FormSelect   @focusout="onInputChangeHandler"  v-if=" checkCondition(keyVar,'select')"  v-model="row[keyVar]" :rules="{required: checkRequired(keyVar)}"  disabled :items="getItems(keyVar)" :clearable="false" />
                
            </FormRow>
        </div>
        
    </div>
</template>

<script>
    

    import InputDate from 'Components/form/InputDate'

    export default {
        name: "InputCell",
        components: {
            InputDate
        },
        data() {
            return {
                
            }
        },
        computed: {
            showAddButton() {
                return this.isLast
            },
            isLast() {
                return this.row._index === this.statsData.length - 1;
            },
        },
        props: {
            row: Object,
            readonly: Boolean,
            required: [Boolean, Number],
            onInputChange: Function,
            keyVar: String,
            fieldsData: [Object,Array],
            statsData: [Array],
            onAddRow: Function,
            onRemoveRow: Function,
        },
        methods: {
            
            checkRequired(item){
                var fields = this.fieldsData;
                if(fields !== null){
                    var field = fields.find( val => {
                        return val.field === item;
                    })
                        
                        return field.required;
                }
                else{
                    return false;
                }
            },
            getItems(item){
                var fields = this.fieldsData ;
                if(fields !== null){
                    var field = fields.find( val => {
                        return val.field === item;
                    })
                    if(field.data){
                        
                        return field.data.split(',');
                    }else{
                        return []
                    }
                }
            },
            checkCondition(item,type){
                var fields = this.fieldsData ;
                if(fields !== null){
                    var field = fields.find( val => {
                        return val.field === item;
                    })
                    if(field.type === type){
                        if(field.type === "serial"){
                            this.row[this.keyVar] = this.row._index + 1;
                        }
                        return true
                    }else{
                        return false
                    }
                }else {
                    return false;
                }
                return true;
            },
            onInputChangeHandler(value) {
                this.onInputChange(value, this.row)
            }
        }
    }
</script>



<style lang="scss" module>
    // .selectBox{
    //     :global {
    //         .ivu-select .ivu-select-dropdown {
    //             // position: static !important;
    //         }
    //     }
    // }

</style>