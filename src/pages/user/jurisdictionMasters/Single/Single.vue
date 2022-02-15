<template>
    <ValidationObserver ref="observer" v-slot="{ passes }">
        <FormWrapper :is-loading="isLoading" >
            <!-- <PageTitle :title="pageTitle" slot="title" :link="`/help/${processId}`"/> -->
            <PageTitle :title="PageTitle" slot="title" />
            <CenterBlock :width="700">
                <FormRow>
                    <div class="col-sm-6" >
                        <InputText v-model="form.Name"  rules="required" label="Name" maxlength="100" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-2" v-if="mode == 'edit'">
                        <FormButton left-icon="ios-send" type="success" @click="passes(formSubmit)">Save</FormButton>
                    </div>
                    <div class="col-sm-2" v-else>
                        <FormButton left-icon="ios-send" type="success" @click="passes(formSubmit)">Add</FormButton>
                    </div>
                    <div class="col-sm-2">
                        <FormButton type="info"  @click="() => backToList()">Cancel</FormButton>
                    </div>
                </FormRow>
                <Popup :value="successModal.visible" :title="successModal.title" type="success" :closable="false" :maskable="false" @close="() => successModal.visible = false">
                    <div>
                        {{ successModal.message }}
                    </div>
                    <div slot="footer">
                        <FormButton @click="() => backToList()">Back to List</FormButton>
                    </div>
                </Popup>
                <Popup :value="warningModal.visible" :title="warningModal.title" type="info" @close="() => warningModal.visible = false">
                    <div>
                        {{ warningModal.message }}
                    </div>
                    <div slot="footer">
                        <FormButton @click="() => warningModal.visible = false">Close</FormButton>
                    </div>
                </Popup>
            </CenterBlock>
        </FormWrapper>
    </ValidationObserver>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import loadingMixin from 'Mixins/loadingMixin';
    import { addJurisdiction, getJurisdictionDataById } from "../api.js";
    import { ValidationObserver } from "vee-validate";
    export default {
        name: "Single",
        mixins: [loadingMixin],
        data() {
            return {
                id: null,
                mode: null,
                PageTitle: 'Jurisdiction',
                onSubmitError: false,
                processTypes: [],
                processNames: [],
                documentCategories: [],
                entityTypes: [],
                form: {
                    Name: null,
                },
                warningModal: {
                    visible: false,
                    title: '',
                    message: ''
                },
                successModal: {
                    visible: false,
                    title: 'Success',
                    message: ''
                },
            }
        },
        created() {
                this.id = this.$route.params.id;
                if(typeof this.id!='undefined'){
                    this.mode = 'edit';
                    this.getJurisdictionDataById(this.id);
                }
        },
        computed: {
            
        },
        watch:{
        },
        components: {
            FormWrapper,
            PageTitle,
            ValidationObserver
        },
        methods: {
            backToList(){
                this.$router.push('/jurisdictionMasters');
            },
            formSubmit() {
                this.showLoader();
                if(typeof this.mode!="undefined" && this.mode!=null){
                    const data = {Name:this.form.Name, id:this.id}
                    addJurisdiction(data).then(this.handleSuccessResponse,this.handleErrorResponse)
                } else {
                    addJurisdiction(this.form).then(this.handleSuccessResponse,this.handleErrorResponse)   
                }
            },
            handleSuccessResponse(response) {
                this.hideLoader();
                let data = response;
                this.successModal.message = data.message;
                this.successModal.visible = true;
            },
            handleErrorResponse(err){
                this.hideLoader();
            },
            getJurisdictionDataById(id){
                this.showLoader();
                getJurisdictionDataById({id:id}).then(this.handleResponse)
            },
            handleResponse(response) {
                this.form = response.data;
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
