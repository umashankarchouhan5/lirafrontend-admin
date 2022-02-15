<template>
    <FormWrapper :is-loading="isLoading">
       
        <PageTitle title="Form Editor" slot="title" />
         
        <DataTable :actions="true"
            :data="formData"
            :columns="config"
            :is-loading="isLoading"
            @on-selection-change="selectChange">

            <template slot="actionsLeft">
                <TableButton @click="openField('add')">
                    <img src="../../../../assets/images/plus.png" alt="">
                    Add Field
                </TableButton>
                <TableButton @click="openField('edit')">
                    <img src="../../../../assets/images/plus.png" alt="">
                    Edit Field
                </TableButton>
            </template>
            <template slot="actionsRight">
                <TableButton @click="showPreviewModal(true)">
                    <img src="../../../../assets/images/eye.png" alt="">
                    Preview
                </TableButton>

            </template>
            
        </DataTable>

<!-- Add Field -->
        <Popup title="Add Field"  width="1000" :value="addFieldModal.visible" @close="() => showAddFieldModal(false)">
            <ValidationObserver ref="fieldValidator">
                <Field v-model="current" v-if="current !== null" /> 
            </ValidationObserver>
            <div slot="footer">
                <FormButton type="success" @click="() => addField()">Add</FormButton>
                <FormButton  @click="() => showAddFieldModal(false)">Cancel</FormButton>
            </div>
        </Popup>

<!-- Edit Field -->
        <Popup title="Edit Field"  width="1000" :value="editFieldModal.visible" @close="() => showEditFieldModal(false)">
            <Field v-model="current" v-if="current !== null" /> 
            <div slot="footer">
                <FormButton type="success" @click="() => editField()">Edit</FormButton>
                <FormButton  @click="() => showEditFieldModal(false)">Cancel</FormButton>
            </div>
        </Popup>

<!-- Preview -->
        <Popup title="Preview"  width="1000" :value="previewModal.visible" @close="() => showPreviewModal(false)">
            <div v-if="previewData !== null && previewData.length > 0">
                <div v-for="(item, i) in previewData"  :key="item.Field_id">

                    <div :class="$style.flexClass" v-if=" item.BlockJson !== null" >

                        <h4 :class="[item.isSubBlock === 1 ? $style.indent : '']" class="mr-3 pr-3">{{getBlockLabel(item)}} &nbsp;&nbsp;&nbsp;</h4>
                        <FormCheckbox :class="$style.pad" v-if="checkNa(item)" disabled name="NA Box" :trueValue="1"  :falseValue="0" v-model="item.isNA" ><span ><b> NA</b></span></FormCheckbox>

                    </div>

                    <br v-if=" item.BlockJson !== null" />

                    <div :class="indentStyle(item)" >
                        <ListItem  v-model="previewData[i]"  v-if=" item.SkipWhenField_id === null"  >
                            <div :class="$style.flexClass">
                                <p v-if="item.FieldType.toLowerCase() ==='yesno' || item.FieldType.toLowerCase() ==='checkbox'">{{item.Label}}</p> 
                            </div>
                        </ListItem>
                    </div>
                    <div v-if="item.SkipWhenField_id !== null" :class="indentStyle(item)">
                        <ListItem  v-model="previewData[i]"   >
                            <div :class="$style.flexClass">
                                <p v-if="item.FieldType.toLowerCase() ==='yesno' || item.FieldType.toLowerCase() ==='checkbox'"><b v-if="item.FieldNumber !== null && item.FieldNumber !== ''">{{item.FieldNumber}}. &nbsp;</b> {{item.Label}}</p>
                            </div>
                        </ListItem>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <FormButton  @click="() => showPreviewModal(false)">Close</FormButton>
            </div>
        </Popup>

<!-- Message popup -->
        <Popup title="Information" :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.cancel" @click="() => showWarningModal(false)">Cancel
                </FormButton>
                <FormButton v-if="warningModal.buttons.confirm" type="success" @click="deleteHol">Confirm
                </FormButton>
                <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
            </div>
        </Popup>

    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import loadingMixin from 'Mixins/loadingMixin';
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import config from './table';
    import Field from './components/Field';
    import { saveFormFields, fetchFormFields } from '../api';
    import ListItem from 'Components/dynamicPreviewForm/listRender';
    import { ValidationObserver } from "vee-validate";

    const addFieldData = {
        FormBlock_id: null,
        BlockJson: null,
        Fieldname: '',
        Label: '',
        Page: '',
        FieldNumber: null,
        FieldType: '',
        isMandatory: false,
        AllowDocumentUpload: false,
        DocumentUploadOn: null,
        isPast: null,
        Notes: false,
        TextBoxonYN: null,
        FieldJson: null,
        isSubBlock: null,
        DocumentWhenAnswerYN: null,
        SkipwhenField_id: null,
        SkipCondition: null,
        isTable: null,
        TableJsonWithHeading: null,
        TableJson: null,
        TableJsonFormat: null,
        isNA: null,
        Field_id: null,
        DocumentPath: null,
        ValueInt: null,
        ValueTextArea: null,
        ValueDate: null,
        TextBoxOnYN: null,
    }


    export default {
        name: "FormEditor",
        mixins: [loadingMixin,validateSelectedRows],
        components: {
            FormWrapper,
            PageTitle,
            DataTable,
            Field,
            ListItem,
            ValidationObserver,
        },
        data() {
            return {
                config,
                formData: [],
                selectedRows: [],
                addFieldModal: {
                    visible: false,
                },
                editFieldModal: {
                    visible: false,
                },
                
                addBlockModal: {
                    visible: false,
                },
                current: null,
                previewModal:{
                    visible: false 
                },
                previewData: null,
            }
        },
        created() {
            this.getFormField()
        },
        watch: {
            
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        methods: {
            indentStyle(item){
                if(item.FormBlock_id !== null && item.isSubBlock !== 1){
                    return this.$style.indent
                }
                else if(item.FormBlock_id !== null && item.isSubBlock === 1){
                    return this.$style.indent1;
                }
                else{
                    return '';
                }
            },
            checkNa(item){
                try{
                    var block = JSON.parse(item.BlockJson);
                    return block[0].allowNA
                }catch(err){
                    return false
                }
            },
            getBlockLabel(item){
                try{
                    JSON.parse(item.BlockJson)
                    var block = JSON.parse(item.BlockJson);
                    return block[0].name;

                }catch(err){
                    return ''

                }
            },
            showPreviewModal(val){
                this.previewModal.visible = val;
            },
            getFormField(){
                this.showLoader();
                const data ={
                    process_id: this.$route.params.process_id,
                }
                fetchFormFields(data).then(
                    res => {
                        this.formData = res.data;
                        this.previewData = res.data;
                        this.hideLoader();
                    }
                )
            },
            openField(type){
                if(type === 'add'){
                    this.showAddFieldModal(true);
                    var dataField = {
                        FormBlock_id: null,
                        BlockJson: null,
                        Fieldname: '',
                        Label: '',
                        Page: '',
                        FieldNumber: null,
                        FieldType: '',
                        isMandatory: false,
                        AllowDocumentUpload: false,
                        DocumentUploadOn: null,
                        isPast: null,
                        Notes: false,
                        TextBoxonYN: null,
                        FieldJson: null,
                        isSubBlock: null,
                        DocumentWhenAnswerYN: null,
                        SkipwhenField_id: null,
                        SkipCondition: null,
                        isTable: null,
                        TableJsonWithHeading: null,
                        TableJson: null,
                        TableJsonFormat: null,
                        isNA: null,
                        Field_id: null,
                        DocumentPath: null,
                        ValueInt: null,
                        ValueTextArea: null,
                        ValueDate: null,
                        TextBoxOnYN: null,
                    }

                    this.current = dataField;
                }else if(type === 'edit'){
                    if(this.validateSelectedLength(1)){
                        this.current = this.selectedRows[0];
                        if(this.current.BlockJson !== null){
                            try{
                                this.current.BlockJson = JSON.parse(this.current.BlockJson)[0]
                            }
                            catch(err){

                            }
                        }
                        if(this.current.FieldJson !== null){
                            try{
                                this.current.FieldJson = JSON.parse(this.current.FieldJson)

                            }
                            catch(err){

                            }
                        }
                        this.showEditFieldModal(true);
                    }
                }
            },
            async modifyData(){
                var formJsonData = {};
                for(var key in this.current){
                    if(this.current.hasOwnProperty(key)){
                        if(key === 'FieldJson' && this.current.FieldJson !== null){
                            formJsonData.FieldJson = JSON.stringify(this.current.FieldJson);
                            if(this.current.isTable === 1){
                                var fieldData = this.current.FieldJson;
                                formJsonData.TableJsonWithHeading = [{}]
                                formJsonData.TableJson = [{}]
                                for(var k = 0; k< fieldData.length; k++){
                                    formJsonData.TableJsonWithHeading[0][fieldData[k].field] = fieldData[k].name;
                                    formJsonData.TableJson[0][fieldData[k].field] = ''
                                }
                                formJsonData.TableJsonWithHeading = JSON.stringify(formJsonData.TableJsonWithHeading);
                                formJsonData.TableJson = JSON.stringify(formJsonData.TableJson);
                                formJsonData.TableJsonFormat = formJsonData.TableJson;
                            }
                            else{
                                formJsonData.TableJsonWithHeading = null;
                                formJsonData.TableJson = null;
                                formJsonData.TableJsonFormat = null;
                            }
                        }
                        if(key === 'FieldJson' && this.current.FieldJson === null){
                            formJsonData[key] = this.current[key];
                            formJsonData.TableJsonWithHeading = null;
                            formJsonData.TableJson = null;
                            formJsonData.TableJsonFormat = null;
                        }

                        if( key === 'BlockJson' && this.current.BlockJson !== null){
                            formJsonData.BlockJson = JSON.stringify([this.current.BlockJson]);
                        }
                        if(key === 'BlockJson' && this.current.BlockJson === null){
                            formJsonData[key] = this.current[key];
                        }

                        if(key !== 'BlockJson' && key !== 'FieldJson' && key !== 'TableJsonFormat' && key !== 'TableJson' && key !== 'TableJsonWithHeading' ){
                            formJsonData[key] = this.current[key];
                        }
                    }
                }
                return formJsonData;
            },
            addField(){
                this.$refs.fieldValidator.validate().then(
                    result => {
                        if(result){
                            this.modifyData().then(
                                res => {
                                    const data ={
                                        process_id: parseInt(this.$route.params.process_id),
                                        FormDataJson: [res]
                                    }
                                    
                                    saveFormFields(data).then(
                                        res => {
                                            this.getFormField();
                                            this.showAddFieldModal(false);
                                            this.current = null;

                                        }
                                    )
                            })
                        }
                    }
                )
                
            },
            
            editField(){
                this.modifyData().then(
                    res => {
                        const data ={
                            form_id: this.selectedRows[0].id,
                            process_id: parseInt(this.$route.params.process_id),
                            FormDataJson: [res]
                        }
                        
                            // form_id: this.$route.params.form_id,
                        saveFormFields(data).then(
                            res => {
                                this.getFormField();
                                this.showEditFieldModal(false);
                                this.current = null;

                            }
                        )
                    }
                )
                
            },
            showAddFieldModal(val){
                this.addFieldModal.visible = val;
                if(val === false){
                    this.current = null;
                }
            },
            showEditFieldModal(val){
                this.editFieldModal.visible = val;
                if(val === false){
                    this.current = null;
                }
            },
            selectChange(data) {
                this.selectedRows = data;
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
    .pad {
        padding-left: 30px;
    }
    .indent {
        margin-left: 20px;
    }
    .indent1{
        margin-left: 40px;
    }
    .flexClass {
        display: flex;
        justify-content: flex-start;
        .firstItem{
            min-width: 40px;
        }
    }
    .checkboxes {
        display: flex;
        margin-bottom: 20px;
        > span {
            margin-right: 30px;
        }
    }
    .selectSource {
        display: flex;
        justify-content: space-between;
        min-width: 200px;
    }
</style>
