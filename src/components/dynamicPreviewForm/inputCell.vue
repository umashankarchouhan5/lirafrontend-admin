<template> 
    <div >
        <!-- <br /> -->
        <InputText v-if="fieldsData === null" @focusout="onInputChangeHandler" v-model="row[keyVar]" :readonly="readonly" />
        <div v-else>
            
            <div :class="$style.inputStyle" >
                
                <InputText  @focusout="onInputChangeHandler" :name="keyVar" v-model="row[keyVar]" v-if=" checkCondition(keyVar,'serial')"  :rules="{required: checkRequired(keyVar) && !readonly}"  readonly />

                <InputText  @focusout="onInputChangeHandler" :name="keyVar" v-model="row[keyVar]" v-if=" checkCondition(keyVar,'textbox')"  :rules="{required: checkRequired(keyVar) && !readonly}"  :readonly="readonly" />

                <InputDate   @onChange="onInputChangeHandler" :name="keyVar" type="date" :options="getOptions()"  v-model="row[keyVar]" v-if=" checkCondition(keyVar,'date')" :rules="{required: checkRequired(keyVar) && !readonly}"  :readonly="readonly" />

                <InputText  @focusout="onInputChangeHandler" :name="keyVar" type="number"  v-model="row[keyVar]" v-if=" checkCondition(keyVar,'number')" :rules="{required: checkRequired(keyVar) && !readonly}"  :readonly="readonly" />

                <InputTel  @focusout="onInputChangeHandler" :name="keyVar"   v-model="row[keyVar]" v-if=" checkCondition(keyVar,'phone')" :rules="{required: checkRequired(keyVar) && !readonly}"  :readonly="readonly" />
                
                <AddressInput  @focusout="onInputChangeHandler" :name="keyVar"   v-model="row[keyVar]" v-if=" checkCondition(keyVar,'address')" :rules="{required: checkRequired(keyVar) && !readonly}"  :readonly="readonly" />

                
                <InputText  @focusout="onInputChangeHandler" :name="keyVar" v-model="row[keyVar]" v-if=" checkCondition(keyVar,'email')"  :rules="{required: checkRequired(keyVar) && !readonly,email: true}"  :readonly="readonly" />

                <div :class="$style.selectBox">
                    <FormSelect   @focusout="onInputChangeHandler" :name="keyVar"  v-if=" checkCondition(keyVar,'select')"  v-model="row[keyVar]" :rules="{required: checkRequired(keyVar) && !readonly}"  :disabled="readonly" :items="getItems(keyVar)" :clearable="false" />
                </div>
                
            </div>
        </div>
        
    </div>
</template>

<script>
    

    import InputDate from 'Components/form/InputDateNew';
    import InputTel from 'Components/form/InputTel'
    import AddressInput from 'Components/form/addressInput/AddressInput';

    export default {
        name: "InputCell",
        components: {
            InputDate,
            InputTel,
            AddressInput,
        },
        data() {
            return {
                
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                options1: {
                    disabledDate(date) {
                        return date && date.valueOf() < Date.now();
                    }
                },
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
            getOptions(){
                if(this.fieldsData !== null){
                    if(this.fieldsData[this.row._index].isPast === 1){
                        return this.options;
                    }
                    else if( this.fieldsData[this.row._index].isPast === 0 ){
                        return this.options1;
                    }
                    else{
                        return {};
                    }
                }
                
            },
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
    .inputStyle{
        margin-bottom: 30px;
    }
    .selectBox{
        :global {
            .ivu-select .ivu-select-dropdown {
                position: static !important;
            }
        }
    }

</style>