<template>
    <div>
        
        <RecordItem v-for="(item, i) in value" :key="i" :readonly="readonly" :record-index="i" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow">
            <div :class="$style.flex">
                <div :class="$style.firstBox">
                    File {{i + 1}}
                </div>
                <div :class="$style.secondBox">
                    <InputFile :value="item.pdfFile" name="PDFUpload" :vid="`pdf-${i}`" :rules="{required:true,  docCheck: 'pdf',checkFileRegex: true}" @onChange="changeFile($event,i)" />

                </div>
            </div>
        </RecordItem>

    </div>
</template>

<script>

    import recordMixin1 from 'Mixins/recordMixin1';
    import valueMixin from 'Mixins/valueMixin';

    export default {
        name: "MergeFile",
        mixins: [ recordMixin1, valueMixin ],
        props: {
            readonly: Boolean,
        },
        data() {
            return {
            }
        },
        watch:{
            value:{
                deep: true,

                handler(val){
                    if(this.value.length == 0){
                        this.pushEmptyValue();
                    }
                }
            },
        },
        methods: {
            changeFile(e, i) {
                this.innerValue[i].pdfFile = e;
            },
            pushEmptyValue() {
                if(this.value.length == 0){
                    this.value.push(
                        {
                            pdfFile: null,
                        },
                        {
                            pdfFile: null,
                        }
                    )
                }
                else{
                    this.value.push({
                        pdfFile: null,
                    })
                }
            },
        }
    }
</script>

<style lang="scss" module>
    .pageDecisionStyle {
        display: flex;
        align-items: center;
        .pageCountStyle {
            // width: 300px;
            border: 2px solid #c3c3c3;
            padding: 3px 15px 2px;
            margin: 0px;
        }
        >span {
            margin: 0px 10px;
        }
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
</style>