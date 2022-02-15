<template>
    <FormWrapper :is-loading="isLoading">
       
        <PageTitle title="Form Editor" slot="title" />
         
        <InputText />


        <DataTable :actions="true"
            :data="formData"
            :columns="config"
            :is-loading="isLoading"
            @on-selection-change="selectChange">

            
            <template slot="actionsLeft">
                <TableButton @click="openField('add')">
                    <img src="../../../../assets/images/plus.png" alt="">
                    Add Form
                </TableButton>
                <TableButton @click="editForm()">
                    <img src="../../../../assets/images/plus.png" alt="">
                    Edit Form
                </TableButton>
            </template>
            
        </DataTable>

<!-- Add field -->
        <Popup title="Add Form"   :value="addFieldModal.visible" @close="() => showAddFieldModal(false)">
                <FormRow>
                    <div class="col-sm-2">
                        <InputText label="Process ID" v-model="formProcessId" />
                    </div>
                    <div class="col-sm-3">
                        <InputText label="Form Name" v-model="formName" />
                    </div>
                    
                    <div class="col-sm-3">
                        <InputText label="Table Name" v-model="tableName" />
                    </div>
                    <div class="col-sm-4">
                        <InputText label="Form title" v-model="formTitle" />
                    </div>
                </FormRow>
            <div slot="footer">
                <FormButton type="success" @click="() => addForm()">Add</FormButton>
                <FormButton  @click="() => showAddFieldModal(false)">Cancel</FormButton>
            </div>
        </Popup>

<!-- Add Block -->
        <Popup title="Edit Form"  width="1000" :value="editFieldModal.visible" @close="() => showAEditFieldModal(false)">
            <Field v-model="current" v-if="current !== null" /> 
            <div slot="footer">
                <FormButton type="success" @click="() => editField()">Edit</FormButton>
                <FormButton  @click="() => showEditFieldModal(false)">Cancel</FormButton>
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
    import { saveForm, fetchForms } from '../api';

    export default {
        name: "FormBuilder",
        mixins: [loadingMixin,validateSelectedRows],
        components: {
            FormWrapper,
            PageTitle,
            DataTable,
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
                
                current: null,
                formProcessId: '',
                formName: '',
                formTitle: '',
                tableName: '',
            }
        },
        created() {
            this.fetchData();
        },
        watch: {
            
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        methods: {
            fetchData(){
                fetchForms().then(
                    res => {
                        this.formData = res.data;
                    }
                )
            },
            openField(type){
                if(type === 'add'){
                    this.showAddFieldModal(true);
                    this.current = addFieldData;
                }else if(type === 'edit'){
                    if(this.validateSelectedLength(1)){
                        this.current = this.selectedRows[0];
                        this.showEditFieldModal(true);
                    }
                }
            },
            addForm(){
                const data = {
                    process_id: this.formProcessId,
                    FormName: this.formName,
                    FormTitle: this.formTitle,
                    TableName: this.tableName,
                };
                saveForm(data).then(
                    res =>{
                        this.showAddFieldModal(false);
                        this.current = null;
                        this.$router.push(`/formEditor/${res.data.process_id}`)
                    }
                )
            },
            editForm(){
                if(this.validateSelectedLength(1)){
                        this.$router.push(`/formEditor/${this.selectedRows[0].process_id}`);
                }
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


</style>
