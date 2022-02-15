<template> 
    <div >
        <!-- <br /> -->
        <InputText  @focusout="onInputChangeHandler" readonly v-model="row[keyVar]"  />
        <!-- <div v-else>
            
            <FormRow class="col-sm-10" >
                <InputText  @focusout="onInputChangeHandler"  v-model="row[keyVar]" v-if=" checkCondition(keyVar,'text')" :placeholder="keyVar" :rules="{required: checkRequired(keyVar)}"  :readonly="readonly " />

                <InputDate  @focusout="onInputChangeHandler" type="date"  v-model="row[keyVar]" v-if=" checkCondition(keyVar,'date')" :rules="{required: checkRequired(keyVar)}"  :readonly="readonly " />

                <InputText  @focusout="onInputChangeHandler" type="number"  v-model="row[keyVar]" v-if=" checkCondition(keyVar,'number')" :rules="{required: checkRequired(keyVar)}"  :readonly="readonly " />
                
                <FormSelect  @focusout="onInputChangeHandler"  v-model="row[keyVar]" v-if=" checkCondition(keyVar,'select')" :rules="{required: checkRequired(keyVar)}"  :disabled="readonly " :items="getItems(keyVar)" :clearable="false" />
            </FormRow>
        </div> -->
        
    </div>
</template>

<script>


    export default {
        name: "InputCell",
        data() {
            return {
                
            }
        },
        computed: {
            getKey(){
                return 'row.'+this.keyVar
            }
        },
        props: {
            row: Object,
            readonly: Boolean,
            required: [Boolean, Number],
            onInputChange: Function,
            keyVar: String,
            fieldsData: [Object,Array],
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

