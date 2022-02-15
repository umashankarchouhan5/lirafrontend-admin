<template>
    <div >
        <h4>Field Info </h4>
        <FormRow>
            <div class="col-sm-12">
                <InputTextArea row="2" label="Enter Field Label" rules="required" v-model="innerValue.Label" />
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-2">
                <InputText label="Field Name"  v-model="innerValue.Fieldname" />
            </div>
            <div class="col-sm-2">
                <InputText label="Page" rules="required" type="number" v-model="innerValue.Page" />
            </div>
            <div class="col-sm-3">
                
                <InputText label="Field Number"  v-model="innerValue.FieldNumber" />
            </div>
            <div class="col-sm-3">
                <FormSelect label="Field Type"  :items="types" item-name="name" item-value="value" v-model="innerValue.FieldType" />
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-2" >
                <FormCheckbox v-model="innerValue.isMandatory" name="Is Mandatory" :trueValue="1"  :falseValue="0" > Is Mandatory </FormCheckbox>
            </div>
            
            <div class="col-sm-3" >
                <FormCheckbox v-model="innerValue.AllowDocumentUpload" name="Allow Document Upload" :trueValue="1"  :falseValue="0"> Allow Document Upload </FormCheckbox>
            </div>
        </FormRow>
        <FormRow v-if="innerValue.FieldType === 'person_association'">
            <div class="col-sm-4">
                <InputText label="PersonType Number" type="number" rules="required" v-model="innerValue.personType" />
            </div>
        </FormRow>
        <FormRow v-if="innerValue.FieldType === 'textbox' || innerValue.FieldType === 'textarea' || innerValue.FieldType === 'number'">
            <div class="col-sm-4">
                <InputText label="Field Length" type="number" rules="required" v-model="innerValue.fieldLength" />
            </div>
        </FormRow>
        <FormRow v-if="innerValue.FieldType === 'date'">
            <div class="col-sm-4">
                <FormSelect label="Date Type" rules="required" :items="dateTypes" item-name="name" item-value="value" v-model="innerValue.isPast" />
            </div>
        </FormRow>
        <FormRow v-if="innerValue.FieldType === 'dropdown'">
            <div class="col-sm-12">
                <InputText label="DropDown Values" rules="required"  v-model="innerValue.selectionValues" />
            </div>
        </FormRow>
        <FormRow v-if="innerValue.FieldType === 'yesno'">
            <div class="col-sm-4">
                <FormSelect label="Select TextBox on" :items="textBoxSelect" item-name="name" item-value="value" v-model="innerValue.TextBoxonYN" />
            </div>
            <div class="col-sm-4">
                <FormSelect label="Select Document On" :items="conditions" item-name="name" item-value="value" v-model="innerValue.DocumentWhenAnswerYN" />
            </div>
        </FormRow>
        <div v-if="innerValue.FieldType === 'table' && innerValue.FieldJson !== null">
            <div v-for="(col,index) in innerValue.FieldJson" :key="index" :class="$style.tableColumns">
                <FormRow >
                    <div class="col-sm-4">
                        <InputText label="Column Heading" rules="required"  v-model="col.name" />
                    </div>
                    <div class="col-sm-4">
                        <InputText label="Column Key" rules="required" v-model="col.field" />
                    </div>
                    <div class="col-sm-3">
                        <FormSelect label="Column Type" rules="required" :items="tableTypes" item-name="name" item-value="value"  v-model="col.type" />
                    </div>
                    <div class="col-sm-1">
                        <AddRemoveButton :isLast="index + 1 == innerValue.FieldJson.length"  @remove="deleteTableColumn(index)" @add="addTableColumn" :length="innerValue.FieldJson.length" :i="index" />
                    </div>
                </FormRow>
                <FormRow v-if="col.type === 'serial' || col.type === 'email' || col.type === 'phone' || col.type === 'address'">
                    <div class="col-sm-3">
                        <InputText label="Width" type="number" v-model="col.width" />
                    </div> 
                </FormRow>
                
                <FormRow v-if="col.type === 'person_association'">
                    <div class="col-sm-3">
                        <InputText label="Person Type Id" type="number" v-model="col.personType_id" />
                    </div> 
                </FormRow>
                <FormRow v-if="col.type === 'textbox' || col.type === 'number'">
                    <div class="col-sm-4">
                        <InputText label="Field Length" rules="required" type="number" v-model="col.length" />
                    </div>
                    <div class="col-sm-3">
                        <InputText label="Width" type="number" v-model="col.width" />
                    </div> 
                    <div class="col-sm-4">
                        <!-- <FormSelect label="Is Required" :items="requiredArr" item-name="name" item-value="value"  v-model="col.required" /> -->
                        <FormCheckbox v-model="col.required" name="Is Block" :trueValue="true" :falseValue="false"> Is Required </FormCheckbox>
                    </div> 
                </FormRow>
                <FormRow v-if="col.type === 'date'">
                    <div class="col-sm-4">
                        <FormSelect label="Date Type" :items="dateTypes" item-name="name" item-value="value" v-model="col.isPast" />
                    </div>
                    <div class="col-sm-3">
                        <InputText label="Width" type="number" v-model="col.width" />
                    </div> 
                </FormRow>
                <FormRow v-if="col.type === 'select'">
                    <div class="col-sm-6">
                        <InputText label="DropDown Values" rules="required" v-model="col.data" />
                    </div>
                    <div class="col-sm-3">
                        <InputText label="Width" type="number" v-model="col.width" />
                    </div> 
                </FormRow>
            </div>
        </div>
        <hr />
        <br />
        <h4>Block Info</h4>
        <br />
        <FormRow>
            <div class="col-sm-2">
                <InputText label="Block ID" type="number" v-model="innerValue.FormBlock_id" />
            </div>
            <div class="col-sm-2" v-if="innerValue.FormBlock_id !== null" >
                <FormCheckbox v-model="innerValue.isSubBlock" name="Is Block"> Is SubBlock  </FormCheckbox>
            </div>
            <div class="col-sm-3">
                <FormCheckbox v-model="innerValue.isBlock" name="Is Block"> Is Block <small>(for adding block label)</small> </FormCheckbox>
            </div>
        </FormRow>
        <h5 v-if="innerValue.isBlock">If first field of block then fill this form</h5>
        <FormRow v-if="innerValue.isBlock">
            <div class="col-sm-2">
                <InputText label="Block ID" rules="required" type="number" v-model="innerValue.BlockJson.id" />
            </div>
            <div class="col-sm-5">
                <InputText label="Block Name" rules="required" v-model="innerValue.BlockJson.name" />
            </div>
            
            <div class="col-sm-1">
                <InputText label="Page" rules="required" type="number" v-model="innerValue.BlockJson.page" />
            </div>
            
            <div class="col-sm-2">
                <!-- <FormSelect label="Allow NA" :items="requiredArr" item-name="name" item-value="value" v-model="innerValue.BlockJson.allowNA" /> -->
                
                <FormCheckbox v-model="innerValue.BlockJson.allowNA" name="Is Block" :trueValue="true" :falseValue="false"> Allow NA </FormCheckbox>
            </div>
        </FormRow>
    </div>
</template>

<script>

    import valueMixin from 'Mixins/valueMixin';
    import AddRemoveButton from 'Components/AddRemoveButton';

    export default {
        mixins: [valueMixin],
        components: {
            AddRemoveButton,
        },
        data(){
            return {
                
                types: [{name:'Text Box',value:'textbox'},{name:'Date',value:'date'},{name:'DropDown', value:'dropdown'},
                    {name:'TextArea', value:'textarea'},{name:'Table', value:'table'},{name:'Yes/No',value:'yesno'},{name:'Email', value:'email'}, {name:'Phone', value:'phone'},{name:'Address', value:'address'},{name:'Country', value:'country'},{name:'Number', value:'number'},{name:'Radio',value:'radiobutton'},{name:'CheckBox',value:'checkbox'},{name:'Person Association',value:'person_association'},],
                conditions: [{name:'Yes',value:'Y'},{name:'No',value:'N'},{name:'NA', value: null}],
                dateTypes: [{name:'Past',value: 1},{name:'Future',value: 0},{name:'NA', value: null}],
                tableTypes: [{name:'Text Box',value:'textbox'},{name:'Date',value:'date'},{name:'DropDown', value:'select'},
                    {name:'Number',value:'number'},{name:'Serial',value:'serial'},{name:'Phone',value: 'phone'},{name:'Email',value: 'email'},{name: 'Address',value: 'Address'},{name:'Person Association',value:'person_association'},],
                requiredArr: [{name:'Yes',value: true},{name:'No',value: false}],
                textBoxSelect: [{name:'Yes',value:'Y'},{name:'No',value:'N'},{name:'Both', value:'B'},{name:'None',value: null}],
            }
        },
        watch:{
            innerValue(val){
                if(val.BlockJson !== null){
                    this.innerValue.isBlock = true;
                }
            },
            'innerValue.isBlock': function(val){
                if(val === true || val === 1){
                    this.innerValue.BlockJson = this.innerValue.BlockJson === null ? {} : this.innerValue.BlockJson;
                }
                else{
                    this.innerValue.BlockJson = null;
                }
            },
            'innerValue.FieldType': function(val){
                if(val === 'table'){
                    this.innerValue.FieldJson = [{
                        field: '',
                        name: '',
                        type: '',
                        length: '',
                        width: '',
                        isRequired: null,
                    }]
                    this.innerValue.isTable = 1
                }else{
                    this.innerValue.isTable = null
                }
            },
            'innerValue.isPast': function(val){
                if(val !== null){
                    this.innerValue.FieldJson = [{
                        isPast: val
                    }]
                }

            },
            'innerValue.fieldLength': function(val){
                this.innerValue.FieldJson = [{
                    length: val
                }]
            },
            'innerValue.selectionValues': function(val){
                this.innerValue.FieldJson = [{
                    'select': val
                }]
            },
            'innerValue.personType': function(val){
                this.innerValue.FieldJson = [{
                    'personType_id': val
                }]
            }
        },
        methods:{
            
            addTableColumn(){
                this.innerValue.FieldJson.push({
                    field: '',
                    name: '',
                    type: '',
                    length: '',
                    width: '',
                    isRequired: null,
                    personType: null,
                })
            },
            deleteTableColumn(index){
                this.innerValue.FieldJson.splice(index, 1);
            },
        }
        
    }
</script>
<style lang="scss" module>

    .tableColumns{
        padding: 20px 20px;
        margin: 10px 0px;
        box-shadow: 0px 5px 14px rgba(0,0,0,0.1);
        transition: all 0.2s ease-out;
        &:hover {
            
            box-shadow: 0px 3px 10px rgba(0,0,0,0.05);
        }
    }

</style>