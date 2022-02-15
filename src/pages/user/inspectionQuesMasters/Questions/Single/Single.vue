<template>
    <ValidationObserver ref="observer" v-slot="{ passes }">
        <FormWrapper :is-loading="isLoading" >
            <PageTitle :title="PageTitle" slot="title" />
            <TicketHeader  :ticketValue="ticketValue" />
            <CenterBlock :width="700">
                <FormRow >
                    <div class="col-sm-6">
                        <InputTextArea name="Question Text" label="Question Text" rows="4" rules="required" :maxlength="500" v-model="form.QText"/>
                    </div>
                    <div class="col-sm-6">
                        <InputText name="Question No" label="Question No" rules="required" maxlength="10" v-model="form.QNo"/>
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-6">
                        <FormSelect
                            v-model="form.AnswerYN"
                            label="Answer Y/N"
                            item-value="value"
                            item-name="label"
                            rules="required"
                            :items="[{ value: '1', label: 'Yes'}, { value: '0', label: 'No'}]" />
                    </div>
                    <div class="col-sm-6">
                        <FormSelect
                            v-model="form.AnswerTextbox"
                            label="Answer Text Box"
                            item-value="value"
                            item-name="label"
                            rules="required"
                            :items="[{ value: '1', label: 'Yes'}, { value: '0', label: 'No'}]" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-6">
                        <FormSelect
                            v-model="form.TextBoxOnYN"
                            label="Text Box on Y/N"
                            item-value="value"
                            item-name="label"
                            :disabled="isDisabled()"
                            :items="[{ value: 'y', label: 'Yes'}, { value: 'N', label: 'No'}, { value: 'B', label: 'Both'}]" />
                    </div>
                    <div class="col-sm-6">
                        <InputText name="Display Sequence" label="Display Sequence" maxlength="10" v-model="form.displaysequence"/>
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-6">
                        <FormSelect
                            v-model="form.DoesnotDecideCompliance"
                            label="Does Not Decide Compliance"
                            item-value="value"
                            item-name="label"
                            rules="required"
                            :items="[{ value: '1', label: 'Yes'}, { value: '0', label: 'No'}]" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12" v-if="mode == 'edit'">
                        <FormButton left-icon="ios-send" type="success" @click="passes(updateForm)">Update</FormButton>
                    </div>
                    <div class="col-sm-12" v-else>
                        <FormButton left-icon="ios-send" type="success" @click="passes(formSubmit)">Add</FormButton>
                    </div>
                </FormRow>
            </CenterBlock>
        </FormWrapper>
        <Popup :value="successModal.visible" :title="successModal.title" type="success" :closable="false" :maskable="false" @close="() => successModal.visible = false">
            <div>
                {{ successModal.message }}
            </div>
            <div slot="footer">
                <FormButton @click="() => backToList()">Back to List</FormButton>
            </div>
        </Popup>
        <Popup :value="warningModal.visible" title="Warning" type="info" @close="() => warningModal.visible = false">
            <div>
                {{ warningModal.message }}
            </div>
            <div slot="footer">
                <FormButton @click="() => warningModal.visible = false">Close</FormButton>
            </div>
        </Popup>
    </ValidationObserver>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import loadingMixin from 'Mixins/loadingMixin';
    import { getInspectionById, saveInspectionQuestion, getQuestionById} from "../api.js";
    import { ValidationObserver } from "vee-validate";
    export default {
        name: "Single",
        mixins: [loadingMixin],
        data() {
            return {
                id: null,
                mode: null,
                PageTitle: 'Save Inspection Question',
                onSubmitError: false,
                processTypes: [],
                processNames: [],
                documentCategories: [],
                entityTypes: [],
                form: {
                    displaysequence: null,
                    TextBoxOnYN: 'B',
                    AnswerTextbox: '1',
                    AnswerYN: '1',
                    QNo: null,
                    QText: null,
                    DoesnotDecideCompliance: '0'
                },
                inspection_id: null,
                question_id: null,
                inspectionitem_name: '',
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
            if( this.$route.params.inspection_id!=null ){
                this.inspection_id = this.$route.params.inspection_id;
                this.getInspectionById();
            }else{
                this.$router.push({ path: `/inspectionQuesMasters` })
            }
            if( this.$route.params.question_id!=null ) {
                this.question_id = this.$route.params.question_id;
                this.mode = "edit";
                this.getQuestionById();
            }
        },
        computed: {
            ticketValue() {
                return {
                    First: '',
                    Second: this.inspectionitem_name,
                    Third: ''
                }
            }
        },
        watch:{
        },
        components: {
            FormWrapper,
            PageTitle,
            ValidationObserver
        },
        methods: {
            isDisabled() {
                if(this.form.AnswerTextbox==1){
                    return false;
                } else {
                    this.form.TextBoxOnYN=null;
                    return true;
                }
            },
            getInspectionById() {
                getInspectionById({id:this.inspection_id})
                        .then(this.handleInspectionResponse)
            },
            handleInspectionResponse(res) {
                this.inspectionitem_name = res.data[0].Name;
            },
            getQuestionById() {
                getQuestionById({id:this.question_id})
                        .then(this.handleQuestionResponse)
            },
            handleQuestionResponse(res) {
                this.form = res.data;
                if(res.data.AnswerTextbox==1){
                    this.form.AnswerTextbox = '1';
                } else {
                    this.form.AnswerTextbox = '0';
                }
                if(res.data.AnswerYN==1){
                    this.form.AnswerYN = '1';
                } else {
                    this.form.AnswerYN = '0';
                }
                if(res.data.DoesnotDecideCompliance==1){
                    this.form.DoesnotDecideCompliance = '1';
                } else {
                    this.form.DoesnotDecideCompliance = '0';
                }
            },
            formSubmit() {
                if(isNaN(this.form.displaysequence)) {
                    this.warningModal.message = 'Display Sequence should be numeric only.';
                    this.warningModal.visible = true;
                    return;
                }
                
                const data = {
                    form: this.form,
                    inspectionitem_id: this.inspection_id
                };
                this.showLoader();
                saveInspectionQuestion(data).then(this.handleSuccessResponse)
            },
            updateForm() {
                const data = {
                    form: this.form,
                    inspectionitem_id: this.inspection_id,
                    id: this.question_id
                };
                this.showLoader();
                saveInspectionQuestion(data).then(this.handleSuccessResponse)
            },
            deleteForm() {
                this.showLoader();
                deleteDocument(this.id).then(this.handleSuccessResponse)
            },
            handleSuccessResponse(response) {
                if(response.status==true){
                    this.successModal.message = 'Inspection question is saved successfully.';
                    this.successModal.visible = true;
                } else {
                    this.warningModal.message = response.message;
                    this.warningModal.visible = true;
                }
                this.hideLoader();
            },
            backToList(){
                this.$router.push(`/inspectionQuesMasters/questions/${this.inspection_id}`);
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
