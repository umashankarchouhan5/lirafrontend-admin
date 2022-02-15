<template>
    <div>
        <div v-if="row.isSaved " :class="$style.flex">
            <span :class="$style.inputStyle">{{ row.DocumentName }}</span>
            <a target="_blank" :href="row.url" v-if="row.url" :class="$style.view">
                <Icon type="md-eye" :class="$style.eye" />
            </a>
        </div>
        <div v-if="( !row.isSaved )|| row.isChange" 
                    :class="$style.inputStyle">
           
                <InputFile 
                    @onChange="onUploadHandler " 
                    :url="row.url" 
                    label="Select File"
                    :rules="{required:row.isMandatory === 1 ? true : false , docCheck:row.AllowedFileType ? row.AllowedFileType : false,checkFileRegex: true}"
                    :changeUploaded="changeDoc" 
                    :disabled="readonly" :value="row.file"  
                    :referenceId="row.reference_id" 
                    :fileDetails="row" 
                />
                
            <div :class="$style.error" v-if="row.errors.indexOf('file') !== -1">
                {{  row.errorMessage || 'Select Document' }}
            </div>
        </div>
        <br />
    </div>
</template>

<script>

    export default {
        name: "UploadCell",
        computed: {
            isAccepted() {
                return !!(+this.row.isAccepted)
            },
        },
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
        margin: -3px 0 2px;
        font-weight: 400;
    }
    .flex{
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        // min-height: 40px;
    }
</style>
