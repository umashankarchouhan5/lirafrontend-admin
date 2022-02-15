<template>
    <FormWrapper>
        <PageTitle title="Merge PDF" slot="title" />

        <ValidationObserver ref="validator">

            <FormRow >
                <div class="col-sm-12">
                    <MergeFile v-model="mergeJSON"  />
                </div>
            </FormRow>
            <div :class="$style.flex">
                <div :class="$style.firstBox">
                    Target Filename 
                </div>
                <div :class="$style.secondBox">
                    <InputText name="TargetFileName" v-model="targetFileName" :rules="{required: true,max:100}" :maxlength="100" />
                </div>
                <div :class="$style.thirdBox">
                    .pdf
                </div>
            </div>
        </ValidationObserver>
        

        <FormButton v-if="pdfToShow !== null" :prevent-default="false"  :href="pdfToShow" target="_blank" tag="a" left-icon="md-eye">View PDF</FormButton>
        <br v-if="pdfToShow !== null" />
        <ErrorMessage v-if="error.notEnoughFiles" >
            Need two or more files to merge
            
        </ErrorMessage>
        <br />

        <FormButton  @click="submitMerge()"> Submit </FormButton>
    </FormWrapper>
</template>

<script>
    
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import MergeFile from './components/MergeFile';
    import { uploadPdfToSplit } from '../api';
    import loadingMixin from 'Mixins/loadingMixin';
    import { ValidationObserver } from "vee-validate"; 
    import { mergeSplittedPdf } from '../api';

    export default {
        name: 'MergeUtility',
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle,
            MergeFile,
            ValidationObserver
        },
        data() {
            return {
                targetFileName: null,
                mergeJSON: [],
                uploaded: false,
                error: {
                    notEnoughFiles: false
                },
                pdfToShow: null 
            }
        },
        methods: {
            submitMerge() {
                this.$refs.validator.validate().then(result => {
                    if(result){
                        this.showLoader();
                        this.error.notEnoughFiles = false;
                        this.pdfToShow = null;
                        const { targetFileName, mergeJSON } = this;

                        if(mergeJSON.length > 1) {
                            const formdata = new FormData();
                            formdata.append( 'targetFileName', targetFileName)
                            mergeJSON.forEach((element,i) => {
                                formdata.append(`filesToMerge[]`, element.pdfFile)
                                
                            });
                            mergeSplittedPdf(formdata).then(
                                res => {
                                    this.pdfToShow = res.data;
                                    // window.open(this.pdfToShow,'_blank');
                                    this.hideLoader();
                                }
                            )
                        }
                        else {
                            this.error.notEnoughFiles = true;
                        }
                    }
                })
            },
        }
        
    }
</script>

<style lang="scss" module>

    .pageCountStyle {
        width: 100px;
        // border: 1px solid black;
        // padding: 10px;
    }
    .flex {
        display: flex;
        align-items: center;
        margin: 20px 0px;
        .firstBox {
            width: 130px;
            font-weight: 500;
        }
        .secondBox {
            width: calc( 40% - 200px );
            min-width: 200px;
            @media only screen and (max-width: 1200px){
                width: calc( 60% - 200px );
            }
            @media only screen and (max-width: 1000px){
                width: calc( 80% - 200px );
            }
        }
        .thirdBox {
            color: #acacac;
            font-style: italic;
        }
    }

</style>