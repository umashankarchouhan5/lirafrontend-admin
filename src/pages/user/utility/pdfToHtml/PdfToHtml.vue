<template>
    <FormWrapper>
        <PageTitle title="PDF to Html" slot="title" />

        <div >
            <InputFile :value="selectFile" name="PDFUpload" @onChange="changeFile" :rules="{required:true,  docCheck: 'pdf',checkFileRegex: true}"/>
        </div>

        <div  >
            <!-- <div v-html="pdfHtml" style="position:relative" id="pdfHtml" v-if="pdfHtml !== null"></div> -->
            <!-- <EditorComponent v-if="pdfHtml !== null" v-model="pdfHtml" /> -->

        </div>
        <div v-html="pdfHtml" style="position:relative" id="pdfHtml2"></div>
        <div :class="$style.floatButton">
            <ButtonGroup>
                <FormButton @click="generatePdf()">Submit</FormButton>
                <FormButton @click="openImage()">Select Image</FormButton>
            </ButtonGroup>
            <input id="selectImageInput" type="file" accept="image/x-png, image/gif, image/jpeg" style="visibility: hidden" @change="selectImage" />
        </div>
    </FormWrapper>


</template>

<script>
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import { pdfToHtml, htmlToPdf } from '../api';
    import html2PDF from 'jspdf-html2canvas';

    export default {
        name: 'pdfToHtmnl',
        components: {
            FormWrapper,
            PageTitle
        },
        data() {
            return {
                selectFile: null,
                pdfHtml: null
            }
        },
        methods: {
            openImage() {
                document.getElementById('selectImageInput').click();
            },
            generatePdf() {
                htmlToPdf({html: this.pdfHtml}).then(
                    res => {
                        console.log(res);
                    }
                )
                // html2PDF(document.getElementById('pdfHtml2'), {
                //     jsPDF: {
                //     format: 'a4',
                //     },
                //     imageType: 'image/png',
                //     output: './pdf/generate.pdf'
                // });
            },
            selectImage(e) {
                
                var mousePosition;
                var offset = [0,0];
                var img;
                var isDown = false;

                if(document.getElementById('inserted_image')) img = document.getElementById('inserted_image');
                else img = document.createElement("img");

                img.id = 'inserted_image';
                img.style.position = "absolute";
                img.style.left = "0px";
                img.style.top = "0px";
                img.style.width = "100px";
                img.style.height = "100px";
                img.style.color = "blue";
                img.onload = () => {
                    URL.revokeObjectURL(img.src);  // no longer needed, free memory
                }
                img.src = URL.createObjectURL(e.target.files[0]);
                
                img.addEventListener('mousedown', function(e) {
                    isDown = true;
                    offset = [
                        img.offsetLeft - e.clientX,
                        img.offsetTop - e.clientY
                    ];
                }, true);

                document.addEventListener('mouseup', function() {
                    isDown = false;
                }, true);

                document.addEventListener('mousemove', function(event) {
                    event.preventDefault();
                    if (isDown) {
                        mousePosition = {

                            x : event.clientX,
                            y : event.clientY

                        };
                        img.style.left = (mousePosition.x + offset[0]) + 'px';
                        img.style.top  = (mousePosition.y + offset[1]) + 'px';
                    }
                }, true);
                let ele = document.getElementById('pdfHtml2');
                let body = ele;
                console.log(body)
                // .appendChild(img);
            },
            createDiv() {


                document.getElementById('pdfHtml2').innerHTML = this.pdfHtml;

            },
            generateHtml() {
                let formdata = new FormData();
                formdata.append('pdf',this.selectFile);
                pdfToHtml(formdata).then(
                    res => {
                        console.log(res);
                        this.pdfHtml = res.data;
                        setTimeout(
                            this.createDiv(),500
                        )
                    }
                )
            },
            
            changeFile(file) {
                this.selectFile = file;
                if(file && file != null) this.generateHtml();
                if(file == null) this.resetData();
            },
            resetData() {
                this.selectFile = null;
            }
        }
        
    }
</script>
<style lang="scss" module>
    .floatButton {
        position: fixed;
        bottom: 50px;
        right: 30px;
        box-shadow: 0px 0px 30px rgba(0,0,0,0.1);
        background: #eeedf2;
        padding: 20px 0px 0px 30px;
        // display: flex;
        justify-content: center;
        align-items: center;
    }


</style>