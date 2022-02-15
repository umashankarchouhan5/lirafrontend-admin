<template>
    <ValidationObserver ref="observer" v-slot="{ passes }">
        <FormWrapper :is-loading="isLoading" >
            <!-- <PageTitle :title="pageTitle" slot="title" :link="`/help/${processId}`"/> -->
            <PageTitle :title="PageTitle" slot="title" />
            <CenterBlock :width="700">
                <FormRow >
                    <div class="col-sm-12">
                        <FormSelect  label="Process"  rules="required" :items="processTypes" item-name="Name" item-value="id" v-model="form.processTypeSelected" />
                    </div>
                </FormRow>
                <FormRow v-if="form.processTypeSelected">
                    <div class="col-sm-12">
                        <FormSelect  label="SubProcess" :is-loading="isLoading" rules="required" :items="processNames" item-name="Name" item-value="id" v-model="form.process_id" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12">
                        <FormSelect  label="Entity Type"  rules="required" :items="entityTypes" item-name="Name" item-value="Name" v-model="form.EntityType" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-6" v-if="!mode">
                        <InputText v-model="form.Documentcode"  rules="required" label="Document Code" maxlength="10" />
                    </div>
                    <div class="col-sm-6" v-else >
                        <InputText v-model="form.Documentcode"  label="Document Code" maxlength="10" readonly />
                    </div>
                    <div class="col-sm-6">
                        <FormSelect  label="Document Category"  rules="required" :items="documentCategories" item-name="Name" item-value="id" v-model="form.DocumentCategory_id" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-6">
                        <InputTextArea name="Document Brief" label="Document Brief" rows="4" rules="required" :maxlength="250" v-model="form.DocumentBrief"/>
                    </div>
                    <div class="col-sm-6">
                        <InputTextArea name="Document Detail" label="Document Detail" rows="4" :maxlength="250" v-model="form.DocumentDetail"/>
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-6">
                        <InputText v-model="form.AllowedFileType" rules="required"  label="Allowed File Types"  />
                    </div>
                    <div class="col-sm-6">
                        <InputText v-model="form.AllowedMaxSizeMB" rules="required"  label="Maximum Size Allowed (in Mb)" />
                    </div>
                </FormRow>
                <FormRow>
                    <FormCheckbox class="col-sm-4" name="isMandatory" v-model="form.isMandatory" >
                        <span>Is Mandatory</span>
                    </FormCheckbox>
                    <FormCheckbox class="col-sm-4" name="AllowNA" v-model="form.AllowNA">
                        <span>Allow Not Applicable</span>
                    </FormCheckbox>
                    <FormCheckbox class="col-sm-4" name="isDateRequired" v-model="form.isDateRequired">
                        <span>Date Needed</span>
                    </FormCheckbox>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12" v-if="mode == 'edit'">
                        <FormButton left-icon="ios-send" type="success" @click="passes(updateForm)">Update</FormButton>
                    </div>
                    <div class="col-sm-12" v-else-if="mode == 'view'">
                        <FormButton left-icon="ios-send" type="success" @click="passes(handleSuccessResponse)">Back</FormButton>
                    </div>
                    <div class="col-sm-12" v-else-if="mode == 'del'">
                        <FormButton left-icon="ios-send" type="danger" @click="passes(deleteForm)">Delete</FormButton>
                    </div>
                    <div class="col-sm-12" v-else>
                        <FormButton left-icon="ios-send" type="success" @click="passes(formSubmit)">Add</FormButton>
                    </div>
                </FormRow>
            </CenterBlock>
        </FormWrapper>
    </ValidationObserver>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import loadingMixin from 'Mixins/loadingMixin';
    import { getProcessTypes, getProcesses, getDocumentCategories, addDocument, getEntityType, editDocument, deleteDocument, fetchDocumentTypeById } from "../api.js";
    import { ValidationObserver } from "vee-validate";
    export default {
        name: "Single",
        mixins: [loadingMixin],
        data() {
            return {
                id: null,
                mode: null,
                PageTitle: 'Add Document Master',
                onSubmitError: false,
                processTypes: [],
                processNames: [],
                documentCategories: [],
                entityTypes: [],
                form: {
                    processTypeSelected: null,
                    process_id: null,
                    EntityType: null,
                    DocumentBrief: null,
                    DocumentDetail: null,
                    Documentcode: null,
                    DocumentCategory_id: null,
                    AllowedFileType: 'pdf',
                    AllowedMaxSizeMB: 10
                }
            }
        },
        created() {
            if( this.$route.params.mode == 'edit' || this.$route.params.mode == 'view' || this.$route.params.mode == 'del' ){
                this.mode = this.$route.params.mode;
                this.id = this.$route.params.id;
                this.getDocumentData(this.id);
            }else{
                // push to previous route
            }
            this.getDropdownValues();
        },
        computed: {
            
        },
        watch:{
            'form.processTypeSelected': function (newValue) {
                if (newValue) {
                    this.showLoader();
                    getProcesses(newValue).then(res => {
                        this.processNames = res.data;
                        this.hideLoader();
                    }).catch(this.hideLoader)
                }
            }
        },
        components: {
            FormWrapper,
            PageTitle,
            ValidationObserver
        },
        methods: {
            getDropdownValues() {
                this.showLoader();
                Promise.all([
                    getProcessTypes(),
                    getDocumentCategories(),
                    getEntityType(),
                ]).then(this.handleDropdownValues)
            },
            handleDropdownValues(response) {
                this.processTypes = response[0].data;
                this.documentCategories = response[1].data;
                this.entityTypes = response[2].data;
                if(!this.mode)
                    this.hideLoader();
            },
            formSubmit() {
                this.showLoader();
                addDocument(this.form).then(this.handleSuccessResponse)
            },
            updateForm() {
                this.showLoader();
                editDocument(this.form).then(this.handleSuccessResponse)
            },
            deleteForm() {
                this.showLoader();
                deleteDocument(this.id).then(this.handleSuccessResponse)
            },
            handleSuccessResponse(response) {
                this.$router.push({ path: `/DocumentMasters/` })
            },
            getDocumentData(id){
                this.showLoader();
                fetchDocumentTypeById(id).then(this.handleResponse)
            },
            handleResponse(response) {
                let data = response.data;
                this.form = response.data;
                this.form.processTypeSelected = response.data.Processytype;
                this.hideLoader();
            },
        }
    }
</script>

<style lang="scss" module>
    
    .currentEntityFile {
        display: inline-flex;
        span {
            margin-left: 20px;
            padding: 3px;
            cursor: pointer;
        }
    }

    .bulkFilesError {
        position: absolute;
        z-index: 4;
        bottom: 5px;
        left: 11px;
        font-size: 11px;
        color: #ff3547
    }

    .exampleFile {
        display: inline-block;
        margin-top: 10px;
    }

    .uploadedFiles {
        background: rgb(241, 241, 241);
        height: 200px;
        width: calc(100%/2 - 8px);
        padding: 10px 15px;
        border-radius: 4px;
        overflow: auto;
    }

    .bulkFile {
        display: flex;
        border-bottom: 1px solid darken(rgb(241, 241, 241), 10%);
        align-items: center;
        &:last-child {
            border-bottom: none;
        }
    }

    .removeBulkFile {
        cursor: pointer;
        padding: 3px;
        margin-left: auto;
    }

    .excelFile {
        display: flex;
        padding: 5px 0;
    }

    .excelFileLabel {
        width: 120px;
        flex-shrink: 0;
        flex-grow: 0;
        align-items: center;
        display: flex;
    }

    .excelFileInput {
        flex-grow: 1;
    }

    .progress {
        margin: 0 20px;
        progress {
            width: 100%;
        }
    }

    .upload {
        width: calc(100%/2 - 8px);
        height: 200px;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        &:hover {
            .uploadArea {
                background: darken(#f2f2f2, 5%);
                border: 2px dashed  darken(#e3e3e3, 5%);
            }
        }
        .uploadArea {
            position: absolute;
            pointer-events: none;
            background: #f2f2f2;
            border: 2px dashed #e3e3e3;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
            outline: none;
            display: flex;
            align-items: center;
            text-align: center;
            justify-content: center;
        }
        input {
            width: 100%;
            height: 100%;
        }
    }

    .files {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    }

    .filter {
        margin: -10px 0 25px;
        display: flex;
        align-items: flex-end;
    }

    .filterItem {
        flex: 0 0 180px;
        margin-right: 20px;
    }

    .popupRow {
        padding: 5px 0 15px;
    }


</style>
