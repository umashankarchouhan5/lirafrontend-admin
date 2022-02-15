<template>
    <div>
        <div v-if="row.ScannedFileURL !== null && !row.isChange" :class="$style.flex">
            <span :class="$style.inputStyle">{{ row.DocumentName }}</span>
            <a target="_blank" :href="row.ScannedFileURL" v-if="row.ScannedFileURL" :class="$style.view">
                <Icon type="md-eye" :class="$style.eye" />
            </a>
        </div>
        <div v-if="row.ScannedFileURL === null || row.isChange" :class="$style.inputStyle">
           <div>
                <InputFile 
                    @onChange="onUploadHandler " 
                    :url="row.url" 
                    label="Select File"
                    name="Select File"
                    :rules="{required: true, checkFileRegex: true}"
                    :vid="`SelectFile-${row._index}`"
                    :changeUploaded="changeDoc" 
                    :disabled="readonly" 
                    :value="row.file"  
                    :referenceId="row.reference_id" 
                    :fileDetails="row" 
                />
            </div>
            <!-- <div :class="$style.error" v-if="row.errors && row.errors.indexOf('file') !== -1">
                {{  row.errorMessage || 'Select Document' }}
            </div> -->
        </div>
    </div>
</template>

<script>
    // import { ValidationProvider } from 'vee-validate';
    // import * as rules from 'vee-validate/dist/rules'

    export default {
        name: "UploadFile",
        data(){
            return{
                changeDoc: false
            }
        },
        watch:{
            'row.isChange': function(val){
                this.changeDoc = val;
            }
        },
        props: {
            row: Object,
            readonly: Boolean,
            onChange: Function
        },
        methods: {
            onUploadHandler(documentDetails) {
                this.row['file'] = documentDetails;
                this.onChange(documentDetails, this.row)
            }
        }
    }
</script>

<style lang="scss" module>
    .eye{
        font-size: 17px;
    }
    .inputStyle{
        word-break: break-all;
        margin-bottom: 10px;
    }
    .accepted {
        color: #55a7a0;
        font-size: 13px;
        i {
            font-size: 17px;
            margin-right: 5px;
        }
    }

    .view {
        text-align: left;
        margin-left: auto;
        margin-right: 5px;
        display: inline-block;
        vertical-align: middle;
    }

    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 11px;
        margin: 10px 0 2px;
        font-weight: 400;
    }
    .flex{
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
    }
</style>
