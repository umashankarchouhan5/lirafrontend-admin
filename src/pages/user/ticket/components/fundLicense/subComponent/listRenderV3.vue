<template>
    
    <FormRow :class="$style.widthStyle">
        <div class="col-sm-9" v-if="innerValue.FieldType.toLowerCase() === 'yesno'">
            <p :class="$style.label">
                <slot />
            </p>
        </div>
        <div class="col-sm-3" v-if="innerValue.AnswerYN === 1 || innerValue.FieldType.toLowerCase() === 'yesno'">
            <div :class="$style.selectors" >
                <FormYesNo v-model="innerValue.ValueTextArea" name="Yes/No" :disabled="readonly || disabled" :vid="`Yes/No-${innerValue.Field_id}`" :rules="{required: innerValue.isMandatory === 1 && disabled ? false: true}" ></FormYesNo>

            </div>
        </div>
        <div class="col-sm-12" v-if="innerValue.AnswerYN === 1 || innerValue.FieldType.toLowerCase() === 'checkbox'">
            <div  :class="$style.checkItem">
                <div :class="$style.checkbox">
                    <FormCheckbox :disabled="readonly || disabled"  name="CheckBox" :vid="`Checkbox-${innerValue.Field_id}`" trueValue="1"  falseValue="0" v-model="innerValue.ValueTextArea" ></FormCheckbox>
                </div>
                <div :class="$style.checkBrief">
                   <span >
                        <slot />
                    </span>
                </div>
            </div>
        </div>

        <div v-if="innerValue.AnswerTextbox === 1 && (innerValue.TextBoxonYN === innerValue.ValueTextArea || innerValue.TextBoxonYN === 'B') && innerValue.AnswerYN === 1" class="col-sm-12">
            <InputTextArea v-model="innerValue.Notes" :vid="`Notes-${innerValue.Field_id}`" label="Notes"  :rules="{required: disabled ? false: true}" maxlength="500" :readonly="readonly || disabled" rows="5" />
        </div>
        <div v-if="innerValue.AnswerTextbox === 1 && innerValue.AnswerYN=== 0 " class="col-sm-12">
            <InputTextArea v-model="innerValue.Notes" :vid="`Notes-${innerValue.Field_id}`" label="Notes" :rules="{required: disabled ? false: true}" maxlength="500" :readonly="readonly || disabled" rows="5" />
        </div>
        <div v-if="innerValue.TextBoxonYN !== null && innerValue.TextBoxonYN === innerValue.ValueTextArea " class="col-sm-12">
            <InputTextArea v-model="innerValue.Notes" :vid="`Notes-${innerValue.Field_id}`" label="Notes" :rules="{required: disabled ? false: true}" maxlength="500" :readonly="readonly || disabled" rows="5" />
        </div>
        

        

        <FormRow v-if=" innerValue.FieldType.toLowerCase() === 'table'" class="tableWidthClass">
            <div  class="col-sm-12">
                <p v-if="innerValue.Label !== null && innerValue.Label !== ''"><span v-if="innerValue.FieldNumber !== null">{{innerValue.FieldNumber}}. </span>{{innerValue.Label}}</p>
                <DataTable :class="$style.documents"  no-data-text="No Data Available" :columns="modifiedColumns" :readonly="readonly || disabled" :data="tableData" />
                
            </div>
        </FormRow>

        <div v-if=" innerValue.FieldType.toLowerCase() !== 'table' ">
            
            <div :class="$style.flexClass"  v-if="innerValue.FieldType.toLowerCase() !== 'textarea' && innerValue.FieldType.toLowerCase() !== 'yesno'  && innerValue.FieldType.toLowerCase() !== 'checkbox' " >

                <div :class="[getClassByWidth(),$style.inputsStyle]">
                    <div   >
                        <p><span v-if="innerValue.FieldNumber !== null">{{innerValue.FieldNumber}}. </span> {{innerValue.Label}} <span v-if="innerValue.isMandatory" :class="$style.required">*</span></p>
                    </div>
                </div>
                <!-- Inputs Start-->
                <div :class="$style.inputsStyle" class="col-sm-4" :style="{width: getTextBoxWidth()}" v-if="innerValue.FieldType.toLowerCase() === 'textbox'">
                    <div>
                        <InputText :name="innerValue.Label" :vid="`${innerValue.Label}-${innerValue.Field_id}`"  v-model="innerValue.ValueTextArea" :readonly="readonly  || disabled"   :rules="{required: innerValue.isMandatory === 1 && disabled === false ? true: false}" />
                    </div>
                </div>
                <div :class="[$style.inputsStyle,$style.dateClass]" class="col-sm-4"  v-if="innerValue.FieldType.toLowerCase() === 'date'" >
                    <InputDate type="date" :name="innerValue.Label" :vid="`${innerValue.Label}-${innerValue.Field_id}`" v-model="innerValue.ValueDate" :options="getOptions()" :readonly="readonly  || disabled"  :rules="{required: innerValue.isMandatory === 1 && disabled === false ? true: false}"  />
                </div>
                <div :class="[$style.inputsStyle,$style.numberClass]" class="col-sm-4" v-if="innerValue.FieldType.toLowerCase() === 'number'">
                    
                    <InputText type="number" :name="innerValue.Label" :vid="`${innerValue.Label}-${innerValue.Field_id}`" v-model="innerValue.ValueInt" :readonly="readonly  || disabled"  :rules="{required: innerValue.isMandatory === 1 && disabled === false ? true: false}"   />
                </div>
                <div :class="$style.inputsStyle" class="col-sm-4" v-if="innerValue.FieldType.toLowerCase() === 'dropdown'">
                    
                    <FormSelect :name="innerValue.Label" :vid="`${innerValue.Label}-${innerValue.Field_id}`" v-model="innerValue.ValueTextArea" 
                        :disabled="readonly || disabled" :items="getItems()" :clearable="false" :rules="{required: innerValue.isMandatory === 1 && disabled === false ? true: false}" />
                </div>
                <div :class="$style.inputsStyle" class="col-sm-4" v-if="innerValue.FieldType.toLowerCase() === 'address'">
                    
                    <AddressInput :name="innerValue.Label" :vid="`${innerValue.Label}-${innerValue.Field_id}`" v-model="innerValue.ValueInt" :readonly="readonly  || disabled"   :clearable="false" :rules="{required: innerValue.isMandatory === 1 && disabled === false ? true: false}" />
                </div>
                <div :class="[$style.inputsStyle,$style.countryClass]" class="col-sm-4" v-if="innerValue.FieldType.toLowerCase() === 'country'" >
                    
                    <FormSelect
                        :items="countries"
                        item-name="Name"
                        item-value="id"
                        :name="innerValue.Label"
                        :disabled="readonly || disabled"
                        v-model="innerValue.ValueInt"   
                        :clearable="false" 
                        :vid="`${innerValue.Label}-${innerValue.Field_id}`"
                        :rules="{required: innerValue.isMandatory === 1 && disabled === false ? true: false}"
                    />
                </div>
                <div :class="$style.inputsStyle" class="col-sm-4"  v-if="innerValue.FieldType.toLowerCase() === 'radiobutton'">
                    
                    <RadioGroup v-model="innerValue.ValueTextArea" :disabled="readonly || disabled">
                        <Radio v-for="(rad,ind) in getRadios" :key="ind" :label="rad" :disabled="readonly || disabled" rules="required">
                            {{rad}}
                        </Radio>
                    </RadioGroup>
                </div>
                <div :class="[$style.inputsStyle,$style.phoneClass]" class="col-sm-4" v-if="innerValue.FieldType.toLowerCase() === 'phone'" >
                    
                    <InputTel v-model="innerValue.ValueTextArea" :vid="`${innerValue.Label}-${innerValue.Field_id}`" :rules="{required: innerValue.isMandatory === 1 && disabled === false ? true: false}" :disabled="readonly || disabled" :name="innerValue.Label" />
                </div>
                <div :class="[$style.inputsStyle,$style.emailClass]" class="col-sm-4"  v-if="innerValue.FieldType.toLowerCase() === 'email'">
                    
                    <InputText v-model="innerValue.ValueTextArea" :vid="`${innerValue.Label}-${innerValue.Field_id}`" :rules="{required: innerValue.isMandatory === 1 && disabled === false ? true: false,email: true}" :readonly="readonly || disabled" :name="innerValue.Label + innerValue.Field_id" />
                </div>
            </div>
            
            <div  v-if="innerValue.FieldType.toLowerCase() === 'textarea'">
                <div :class="$style.inputsStyle" class="col-sm-12">
                    <div   >
                        <p><b v-if="innerValue.FieldNumber !== null">{{innerValue.FieldNumber}}. </b> {{innerValue.Label}} <span v-if="innerValue.isMandatory" :class="$style.required">*</span></p>
                    </div>
                </div>
                <div :class="$style.inputsStyle" class="col-sm-12" >
                    
                    <InputTextArea v-model="innerValue.ValueTextArea" rows="5" :vid="`${innerValue.Label}-${innerValue.Field_id}`" :rules="{required: innerValue.isMandatory === 1 && disabled === false ? true: false}" :readonly="readonly || disabled" :name="innerValue.Label" />
                </div>
            </div>

        </div> 

        <div v-if="innerValue.AllowDocumentUpload === 1 || innerValue.AllowDocumentUpload === true || innerValue.DocumentWhenAnswerYN !== null" class="col-sm-12">
            <div :class="$style.file" v-if="innerValue.AllowDocumentUpload === 1 || innerValue.AllowDocumentUpload === true || innerValue.DocumentWhenAnswerYN  === innerValue.ValueTextArea">
                <InputFile label="Select File (pdf)" :vid="`SelectFile-${innerValue.Field_id}`" :readonly="readonly || disabled" :disabled="readonly || disabled" v-if="innerValue.DocumentPath === null" :rules="{required:disabled ? false: true,docCheck:'pdf'}" :class="$style.fileStyle" />
                
                <InputText label="Selected File" readonly v-if="innerValue.DocumentPath !== null" v-bind:value="innerValue.DocumentPath.split('/').pop()" :class="$style.fileStyle" />
                <a :class="$style.fileView" v-if="innerValue.DocumentPath" :href="innerValue.DocumentPath" target="_blank">
                    <Icon type="md-eye" />
                    View
                </a>
                <img src="../../../../../../assets/images/changes.png" v-if="innerValue.DocumentPath" @click="() => {innerValue.DocumentPath = null}" alt="FSA change" title="Change Document">
            </div>
        </div>

    </FormRow>
</template>

<script>

    import { RadioGroup, Radio } from 'view-design'
    import FormYesNo from 'Components/form/FormYesNo'
    import DataTable from 'Components/DataTable';
    import InputCell from './inputCell3';
    import ActionCell from './actionCell';
    import InputDate from 'Components/form/InputDate'
    import AddressInput from 'Components/form/addressInput/AddressInput';
    import InputTel from 'Components/form/InputTel';
    import valueMixin from 'Mixins/valueMixin'

    export default {
        name: "ListItem",
        mixins: [valueMixin],
        data(){
            return {
                refinedData: [],
                tableData: [],
                itemBox:[],
                rowStructure: {},
                
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
            },
            process_id: [Number,String],
            companyName: [String,Object],
            width: Number,
        },
        components: {
            RadioGroup,
            Radio,
            FormYesNo,
            DataTable,
            InputTel,
            InputDate,
            AddressInput
        },
        watch:{
            tableData:{
                deep: true,
                handler(val){
                    this.innerValue.Stats = val;
                }
            }
        },
        computed:{
            
            countries() {
                return this.$store.state.common.countries;
            },
            modifiedFields(){
                if(this.innerValue.TableJsonFormat !== null){
                    var columns = this.innerValue.TableJsonFormat.replace('/n','');
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
                if(this.innerValue.TableJsonFormat !== null){
                    var columns = this.innerValue.TableJsonFormat.replace('/n','');
                    columns = JSON.parse(columns);
                    var headings = JSON.parse(this.innerValue.TableJsonWithHeading);
                    var tableColumn = [];

                    for (var key in columns[0]) {
                        if (columns[0].hasOwnProperty(key)) {
                            
                            const col = {
                                'title': columns[0][key] !== '' && columns[0][key] !== ' ' && columns[0][key] !== 0 ? columns[0][key] : headings[0][key],
                                'key': key,
                                
                                'width': this.checkColumnWidth(key),
                                render: (h, params) => {
                                    return h('div', [
                                        h(InputCell, {
                                            props: {
                                                row: params.row,
                                                onInputChange: this.onInputChange,
                                                keyVar: params.column.key,
                                                fieldsData: JSON.parse(this.innerValue.FieldJson),
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

                    const col = {
                        'title': 'Action',
                        width: '60',
                        render: (h, params) => {
                            return h('div', [
                                h(ActionCell, {
                                    props: {
                                        row: params.row,
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


                    return tableColumn;
                }
                else{
                    return [];
                }
            }
        },
        created(){
            // this.readonly = true;
            if(this.innerValue.TableJson !== null){
                this.tableData = this.statData();
            }
            
        },
        methods: {
            checkColumnWidth(key){
                var fields = this.innerValue.FieldJson !== null ? JSON.parse(this.innerValue.FieldJson) : null;
                if(fields !== null){
                    var field = fields.find( val => {
                        return val.field === key;
                    })
                    if(field.width && field.width !== undefined && field.width !== null){
                        return this.calculateWidth(field.width)
                    }
                    else{
                        return '';
                    }
                        
                }
            },
            calculateWidth(pct){
                var tableWidth = this.width - 150;
                var width = (tableWidth * pct )/100;
                return width;
            },
            
            // async calculateWidth(total,pct){
                
            //     var tableClass = await document.getElementsByClassName('widthAnchor');
            //     var tableWidth = await tableClass !== undefined && tableClass[0] !== undefined ? tableClass[0].offsetWidth : 1218;
            //     tableWidth = tableWidth - 60;
            //     var width = (total * pct )/100
            //     return width;
            // },
            getLength(){
                if(this.innerValue.FieldJson !== null && this.innerValue.FieldJson !== '' ){
                    var field = JSON.parse(this.innerValue.FieldJson);
                    if(field[0].length){
                        return field[0].length;
                    }
                }
                else {
                    return false;
                }
            },
            getTextBoxWidth(){
                if(this.innerValue.FieldJson !== null && this.innerValue.FieldJson !== '' ){
                    var length = this.getLength();
                    if(length !== false){
                        return 2*length + 'px';
                    }
                    else{
                        return 'initial';
                    }
                }
                else{
                    return 'initial'
                }
            },
            getClassByWidth(){
                var widthClass;
                if(this.innerValue.Label.length  < 20) {
                    widthClass = 'col-sm-2'
                }   
                else if(this.innerValue.Label.length  > 20  && this.innerValue.Label.length  < 30) {
                    widthClass = 'col-sm-3'
                }                 
                else if( this.innerValue.Label.length  > 30 && this.innerValue.Label.length  < 50){
                    widthClass = 'col-sm-4'
                }
                else if(this.innerValue.Label.length  > 50 && this.innerValue.Label.length  < 80){
                    widthClass = 'col-sm-5'
                }
                else{
                    widthClass = 'col-sm-6'
                }
                return widthClass
            },
            getOptions(){
                if(this.innerValue.FieldJson !== null){
                    var field = JSON.parse(this.innerValue.FieldJson)
                    if(field[0].isPast === 1){
                        return this.options;
                    }
                    else if( field[0].isPast === 0 ){
                        return this.options1;
                    }
                    else{
                        return {};
                    }
                }
            },
            getRadios(){
                const arr = JSON.parse(this.innerValue.FieldJson);
                const radioFields = arr.split(',');
                return radioFields;
            },
            checkRequired(item){
                var fields = this.innerValue.FieldJson !== null ? JSON.parse(this.innerValue.FieldJson) : null;
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
                var fields = this.innerValue.FieldJson !== null ? JSON.parse(this.innerValue.FieldJson) : null;
                if(fields !== null){
                    var field = fields[0].select;
                    if(field){
                        var fieldArray = field.split(',').map(function(item) {
                            return item.trim();
                        });
                        
                        return fieldArray;
                    }else{
                        return []
                    }
                }
            },
            checkCondition(item,type){
                var fields = this.innerValue.FieldJson !== null ? JSON.parse(this.innerValue.FieldJson) : null;
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
                var columns = this.innerValue.TableJson.replace('/n','');
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
    .widthStyle {
        width: 100%;
    }
    .phoneClass{
        max-width: 250px;
    }
    .emailClass{
        max-width: 250px;
    }
    .dateClass {
        max-width: 150px;
    }
    .numberClass {
        max-width: 150px;
    }
    .countryClass {
        max-width: 200px;
    }
    .listRow {
        display: flex;
        align-items: center;
    }
    .required {
        color: #ff3547;
        margin-left: 2px;
    }
    .numbering{
        position: absolute;
        left: -10px;
        top: 15px;
    }
    .rowPadding{
        padding: 0px 15px;
    }
    .flexClass{
        display: flex;
        align-items: center;
        // padding: 0px 15px;
    }
    .inputsStyle{
        position: relative;
        // width: 100%;
        // margin-bottom: 20px;
        // margin-left: 10px;
        p {
            margin-bottom: 0px !important;
        }
    }
    .file {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        margin-top: 10px;
        
    }
    .fileStyle {
        min-width: 200px;
        width: 30vw;

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
    .checkItem {
        padding: 5px 8px;
        display: flex;
        align-items: center;

        &:last-child {
            border-bottom: none;
        }
    }

    .checkbox {
        flex-shrink: 0;
        flex-grow: 0;
        width: 25px;
        text-align: center;
        align-self: flex-start;
    }

    .checkBrief {
        flex-grow: 1;
        margin-left: 0px;
    }
</style>
