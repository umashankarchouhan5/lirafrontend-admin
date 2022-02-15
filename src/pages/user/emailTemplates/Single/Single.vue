<template>
    <ValidationObserver ref="observer" v-slot="{ passes }">
        <FormWrapper :is-loading="isLoading" >
            <PageTitle :title="PageTitle" slot="title" />
            <CenterBlock :width="700">
                <FormRow v-if="!mode">
                    <div :class="(form.processTypeSelected)?'col-sm-6':'col-sm-12'">
                        <FormSelect  label="Process Type"  rules="required" :items="processTypes" item-name="Name" item-value="id" v-model="form.processTypeSelected"   />
                    </div>
                    <div class="col-sm-6" v-if="form.processTypeSelected" >
                        <FormSelect  label="Process Name" :is-loading="isLoading" rules="required" :items="processNames" item-name="Name" item-value="id" v-model="form.process_id"   />
                    </div>
                </FormRow>
                <FormRow v-else>
                    <div :class="(form.processTypeSelected)?'col-sm-6':'col-sm-12'">
                        <FormSelect  label="Process Type"  rules="required" :items="processTypes" item-name="Name" item-value="id" v-model="form.processTypeSelected"   />
                    </div>
                    <div class="col-sm-6" v-if="form.processTypeSelected" >
                        <FormSelect  label="Process Name" :is-loading="isLoading" rules="required" :items="processNames" item-name="Name" item-value="id" v-model="form.process_id"   />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-6">
                        <InputText v-model="form.Code"  rules="required" label="Code" maxlength="10" :readonly="(mode=='' || mode ==='view')" />
                    </div>
                    <div class="col-sm-6" >
                        <InputText v-model="form.Name"  label="Template Name" :readonly="(mode == 'view')" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12"  >
                        <InputText v-model="form.Purpose"  label="Template Purpose" :readonly="(mode == 'view')"  />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-6" >
                        <InputText v-model="form.FromEmail"  label="From Email" :readonly="(mode == 'view')"  />
                    </div>
                    <div class="col-sm-6" >
                        <InputText v-model="form.FromDisplayName"  label="From Name" :readonly="(mode == 'view')"  />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-6" >
                        <InputText v-model="form.Outcome"  label="Outcome" :readonly="(mode == 'view')"  />
                    </div>
                    <div class="col-sm-6" >
                        <InputText v-model="form.Subject"  label="Subject" :readonly="(mode == 'view')" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12" >
                        <EditorComponent v-model="form.Body" :readonly="(mode == 'view')" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12" v-if="(mode == 'edit')">
                        <FormButton left-icon="ios-send" type="success" @click="passes(updateForm)">Update</FormButton>
                    </div>
                    <div class="col-sm-12" v-else-if="(mode == 'view')">
                        <FormButton left-icon="ios-send" type="success" @click="handleSuccessResponse()">Back</FormButton>
                    </div>
                    <div class="col-sm-12" v-else-if="(mode == 'del')">
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
    import { getProcessTypes, getProcesses, fetchEmailTemplateByID, addEmailTemplate, editEmailTemplate, deleteEmailTemplateByID } from "../api.js";
    import { ValidationObserver } from "vee-validate";

    export default {
        name: "Single",
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle,
            ValidationObserver,
        },
        data() {
            return {
                id: null,
                mode: null,
                PageTitle: 'Add Email Template',
                onSubmitError: false,
                processTypes: [],
                processNames: [],
                form: {
                    processTypeSelected: null,
                    process_id: null,
                    Code: null,
                    Name: null,
                    Purpose: null,
                    FromEmail: null,
                    FromDisplayName: null,
                    Outcome: null,
                    Subject: null,
                    Body: null,
                },
            }
        },
        created() {
            if( this.$route.params.mode == 'edit' || this.$route.params.mode == 'view' || this.$route.params.mode == 'del' ){
                this.mode = this.$route.params.mode;
                this.id = this.$route.params.id;
                this.getEtemplateData(this.id);
            }else{
                // push to previous route
            }
            this.getDropdownValues();
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
        methods: {
            getDropdownValues() {
                this.showLoader();
                Promise.all([
                    getProcessTypes(),
                ]).then(this.handleDropdownValues)
            },
            handleDropdownValues(response) {
                this.processTypes = response[0].data;
                if(!this.mode)
                    this.hideLoader();
            },
            formSubmit() {
                this.showLoader();
                addEmailTemplate(this.form).then(this.handleSuccessResponse)
            },
            updateForm() {
                this.showLoader();
                editEmailTemplate(this.form).then(this.handleSuccessResponse)
            },
            deleteForm() {
                this.showLoader();
                deleteEmailTemplateByID(this.id).then(this.handleSuccessResponse)
            },
            handleSuccessResponse(response) {
                this.$router.push({ path: `/etemplates/` })
            },
            getEtemplateData(id){
                this.showLoader();
                fetchEmailTemplateByID(id).then(this.handleResponse)
            },
            handleResponse(response) {
                let data = response.data[0];
                this.form = response.data[0];
                this.form.processTypeSelected = response.data[0].process_type;
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
