<template>
    <FormRow>
        <div class="col-sm-6">
            <div :class="$style.selectors" v-if="value.AnswerYN === true">
                <RadioGroup v-model="value.CheckedYN" disabled>
                    <Radio label="Y" disabled rules="required">
                        Yes
                    </Radio>
                    <Radio label="N" disabled>
                        No
                    </Radio>
                </RadioGroup>
            </div>
        </div>

        <div class="col-sm-12">
            <div  >
                <div v-if="value.answerTextBox === true && (value.TextBoxOnYN === value.CheckedYN || value.TextBoxOnYN === 'B') && value.AnswerYN === true">
                    <InputTextArea v-model="value.Notes" label="Notes" :rules="{required: disabled ? false: true}" maxlength="500" readonly rows="5" />
                </div>
                <div v-if="value.answerTextBox === true && value.AnswerYN=== false ">
                    <InputTextArea v-model="value.Notes" label="Notes" :rules="{required: disabled ? false: true}" maxlength="500" readonly rows="5" />
                </div>

                <br />
                
                <div v-if="value.DocumentWhenAnswerYN  === null || value.DocumentWhenAnswerYN === value.CheckedYN" >
                    <div :class="$style.file" v-if="value.AllowDocumentUpload === true && (value.AnswerYN === false|| (value.AnswerYN === true && value.CheckedYN !== null))">
                        <InputFile label="Select File (pdf)" readonly disabled v-if="this.value.DocumentPath === null"  :rules="{required:disabled ? false: true,docCheck:'pdf'}" />
                        
                        <InputText label="Selected File" readonly v-if="this.value.DocumentPath !== null" v-bind:value="value.DocumentPath.split('/').pop()" />
                        <a :class="$style.fileView" v-if="this.value.DocumentPath" :href="this.value.DocumentPath" target="_blank">
                            <Icon type="md-eye" />
                            View
                        </a>
                    </div>
                </div>
            </div>
        </div>
        
        <FormRow v-if="value.StatsJson !== null && value.isTable === true">
            <div  class="col-sm-12">
                <DataTable :class="$style.documents"  no-data-text="No Data Available" :columns="modifiedColumns" readonly :data="tableData" />
                
            </div>
        </FormRow>

        <div v-if="(value.StatsJson !== null && value.isTable === null && value.isTable !== true  && value.CheckedYN === 'Y') || (value.isFieldJsonRequired !== null && value.isFieldJsonRequired !== undefined)">
            
            <div  v-for="(items,i) in modifiedFields" :key="i">
                <div :class="$style.rowPadding" class="row">
                    <div :class="$style.inputsStyle" class="col-sm-7" v-if="value.FieldJson === null || checkCondition(items,'text')">
                        <InputText :label="items.value" v-model="tableData[0][items.key]"   :rules="{required: checkRequired(items)}" readonly />
                    </div>
                </div>

                <div :class="$style.rowPadding" class="row">
                    <div :class="$style.inputsStyle" class="col-sm-5" v-if="value.FieldJson === null || checkCondition(items,'date')" >
                        <InputDate type="date" :label="items.value" v-model="tableData[0][items.key]"  :rules="{required: checkRequired(items)}" readonly />
                    </div>
                </div>

                <div :class="$style.rowPadding" class="row">
                    <div :class="$style.inputsStyle" class="col-sm-4" v-if="value.FieldJson === null || checkCondition(items,'number')">
                        <InputText type="number" :label="items.value" v-model="tableData[0][items.key]"  :rules="{required: checkRequired(items)}" readonly />
                    </div>
                </div>

                <div :class="$style.rowPadding" class="row">
                    <div :class="$style.inputsStyle" class="col-sm-7" v-if="value.FieldJson === null || checkCondition(items,'select')">
                        <FormSelect :label="items.value" v-model="tableData[0][items.key]"  :rules="{required: checkRequired(items)}" disabled :items="getItems(items)" :clearable="false" />
                    </div>
                </div>

            </div>

        </div>

    </FormRow>
</template>

<script>

    import { RadioGroup, Radio } from 'view-design'
    import DataTable from 'Components/DataTable';
    import InputCell from './inputCell';
    import InputDate from 'Components/form/InputDate'

    export default {
        name: "ListItem",
        data(){
            return {
                refinedData: [],
                tableData: [],
                itemBox:[],
                rowStructure: {},
            }
        },
        props: {
            value: {
                type: Object,
                default() {
                    return { }
                }
            },
            i:{
                type: [Number,String]
            },
            readonly: Boolean,
            disabled:{
                type: Boolean,
                default: false,
            }
        },
        components: {
            RadioGroup,
            Radio,
            DataTable,
            InputDate
        },
        watch:{
            tableData:{
                deep: true,
                handler(val){
                    this.value.Stats = val;
                }
            }
        },
        computed:{
            modifiedFields(){
                if(this.value.JsonFormat !== null){
                    var columns = this.value.JsonFormat.replace('/n','');
                    columns = JSON.parse(columns);
                    var tableColumn = [];
                    for (var key in columns[0]) {
                        if (columns[0].hasOwnProperty(key)) {
                            const col = {
                                'key': key,
                                'value': columns[0][key]
                            }
                            tableColumn.push(col)
                        }
                    }
                    
                }
                return  tableColumn;
            },
            modifiedColumns(){
                if(this.value.JsonFormat !== null){
                    var columns = this.value.JsonFormat.replace('/n','');
                    columns = JSON.parse(columns);
                    var tableColumn = [];
                    for (var key in columns[0]) {
                        if (columns[0].hasOwnProperty(key)) {
                            
                            const col = {
                                    'title': columns[0][key] !== '' && columns[0][key] !== ' ' && columns[0][key] !== 0 ? columns[0][key] : key,
                                    'key': key,
                                    render: (h, params) => {
                                        return h('div', [
                                            h(InputCell, {
                                                props: {
                                                    row: params.row,
                                                    onInputChange: this.onInputChange,
                                                    keyVar: params.column.key,
                                                    fieldsData: JSON.parse(this.value.FieldJson),
                                                    readonly: this.readonly || this.disabled,
                                                    statsData: this.tableData,
                                                    onAddRow: this.onAddRow,
                                                    onRemoveRow: this.onRemoveRow,
                                                }
                                            }),
                                        ]);
                                    }
                                }
                            tableColumn.push(col)
                        }
                    }

                    

                    return tableColumn;
                }
                else{
                    return [];
                }
            }
        },
        created(){
            if(this.value.StatsJson !== null){
                
                this.tableData = this.statData();
            }
        },
        methods: {
            checkRequired(item){
                var fields = this.value.FieldJson !== null ? JSON.parse(this.value.FieldJson) : null;
                if(fields !== null){
                    var field = fields.find( val => {
                        return val.field === item.key;
                    })
                        
                        return field.required;
                }
                else{
                    return false;
                }
            },
            getItems(item){
                var fields = this.value.FieldJson !== null ? JSON.parse(this.value.FieldJson) : null;
                if(fields !== null){
                    var field = fields.find( val => {
                        return val.field === item.key;
                    })
                    if(field.data){
                        
                        return field.data.split(',');
                    }else{
                        return []
                    }
                }
            },
            checkCondition(item,type){
                var fields = this.value.FieldJson !== null ? JSON.parse(this.value.FieldJson) : null;
                if(fields !== null){
                    var field = fields.find( val => {
                        return val.field === item.key;
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
            statData(){
                var columns = this.value.StatsJson.replace('/n','');
                columns = JSON.parse(columns);
                return columns;
            },
            newRowStructure(){
                var cols = this.statData()[0];
                var row = {};
                for (var key in cols){
                    if(cols.hasOwnProperty(key)){
                        row[key] = ''
                    }
                }
                return row;
            },
            onAddRow(){
                var row = this.newRowStructure();
                if(!this.readonly || this.disabled){
                    this.tableData.push(row);
                }
            },
            
            onRemoveRow(index){
                this.tableData.splice(index,1);

            },

            onInputChange(val,row){
                this.refinedData[row._index] = row;
                 for (var key in this.tableData[row._index]) {
                    if (this.tableData[row._index].hasOwnProperty(key)) {
                        this.tableData[row._index][key] = row[key];
                    }
                }
            },
        }
    }
</script>

<style lang="scss" module>
    .rowPadding{
        padding: 0px 10px;
    }
    .inputsStyle{
        margin-bottom: 20px;
    }
    .file {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }

    .fileView {
        padding: 0 5px;
        margin-left: 5px;
        :global {
            .ivu-icon {
                font-size: 19px;
                margin-right: 5px;
            }
        }
    }

    .label {
        margin-bottom: 0;
        :global {
            .text-danger {
                display: block;
                font-size: 11px;
            }
        }
    }
    .selectors {
        :global {
            .text-danger {
                display: block;
                font-size: 11px;
            }
            .ivu-radio-group {
                display: flex;
                justify-content: center;
                .ivu-radio-wrapper {
                    margin: 0 10px;
                }
            }
        }
    }
</style>
