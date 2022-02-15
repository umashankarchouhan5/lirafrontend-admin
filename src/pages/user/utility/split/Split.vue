<template>
    <FormWrapper>
        <PageTitle title="Split PDF" slot="title" />

        <ValidationObserver ref="validator">

            <div :class="$style.flex">
                <div :class="$style.firstBox">
                    Source 
                </div>
                <div :class="$style.secondBox">
                    <InputFile :value="selectFile" name="PDFUpload" @onChange="changeFile" :rules="{required:true,  docCheck: 'pdf',checkFileRegex: true}"/>
                </div>
            </div>

            <div :class="$style.flex">
                <div :class="$style.firstBox">
                    Number of Pages
                </div>
                <div :class="$style.secondBox">
                    <div :class="$style.pageCountStyle">{{pageCount}}</div>
                </div>
            </div>

            <div v-if="pageCount <= 1 && uploaded == true && selectFile !== null">
                Not enough pages to split.
            </div>

            <FormRow v-if="pageCount > 1">
                <div class="col-sm-12">
                    <SplitFile v-model="splitJSON" :count="pageCount" />
                </div>
            </FormRow>

        </ValidationObserver>

        <ButtonGroup v-if="pdfs.length > 0">
            <FormButton v-for="(pdf,i) in pdfs" :key="i" :prevent-default="false"  :href="pdf" target="_blank" tag="a" left-icon="md-eye" :class="$style.marginBottom">PDF - {{i + 1}}</FormButton>
        </ButtonGroup>
        <br v-if="pdfs.length > 0" />

        <FormButton v-if="pageCount > 1" @click="submitSplit()"> Submit </FormButton>
    </FormWrapper>
</template>

<script>
    
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import SplitFile from './components/SplitFile';
    import { uploadPdfToSplit, getSplittedPdf } from '../api';
    import loadingMixin from 'Mixins/loadingMixin';
    import { ValidationObserver } from "vee-validate"; 

    export default {
        name: 'SplitUtility',
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle,
            SplitFile,
            ValidationObserver
        },
        data() {
            return {
                selectFile: null,
                pageCount: 0,
                splitJSON: [],
                uploaded: false,
                pdfs: [],
            }
        },
        methods: {
            submitSplit() {
                this.$refs.validator.validate().then(result => {
                    if(result){
                        const { selectFile, splitJSON } = this;
                        const formdata = new FormData();
                        formdata.append( 'pdfFile', selectFile)
                        formdata.append('splitJSON', JSON.stringify(splitJSON))
                        getSplittedPdf(formdata).then(
                            res => {
                                this.pdfs = res.data;
                            }
                        )
                    }
                })
            },
            changeFile(file) {
                this.selectFile = file;
                if(file && file != null) this.uploadPDF();
                if(file == null) this.resetData();
            },
            uploadPDF() {
                this.showLoader()
                this.uploaded = false;
                const formdata = new FormData(); 
                formdata.append('pdfFile', this.selectFile);
                uploadPdfToSplit(formdata).then(
                    res=> {
                        this.pageCount = res.data;
                        this.uploaded = true;
                        this.hideLoader();
                    },
                    () => {
                        this.pageCount = 0;
                        this.hideLoader();
                    }
                )

            },
            resetData() {
                this.pageCount = 0;
                this.splitJSON = [];
                this.pdfs = []
            }
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
            width: calc( 60% - 200px );
            @media only screen and (max-width: 1000px){
                width: calc( 100% - 200px );
            }
        }
    }
    .marginBottom {
        margin-bottom: 12px;
    }

</style>