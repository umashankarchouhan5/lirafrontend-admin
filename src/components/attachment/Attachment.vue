<template>
    <div>
        <h6>Attachments</h6>
        <RecordItem v-for="(item, i) in value" :key="i" :readonly="readonly" :record-index="i" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow">
            <div v-if="item.name !== '' || readonly">
                <div class="col-sm-10 pb-5">
                    <a :href="item.url" target="_blank"> {{item.name}} </a> 
                </div>
                <br />
            </div>
            <FormRow v-else>
                <div class="col-sm-6">
                    <InputFile 
                        @onChange="onUpload($event, i)"
                        label="Select File" 
                        v-model="item.fileUpload"
                        :rules="{ checkFileRegex: true }"
                    />
                </div>
                <div class="col-sm-4">
                    <FormButton left-icon="ios-send" type="success" @click="uploadAdminFile(i)" >Save File</FormButton>

                </div>
            </FormRow>
        </RecordItem>
        <div :class="$style.error" v-if="notAllSaved">Save / discard unsaved file before proceeding.</div>
    </div>
</template>

<script>

    import { uploadFile } from './api';
    import recordMixin1 from 'Mixins/recordMixin1';

    export default {
        name: "AttachmentRecords",
        mixins: [recordMixin1,],
        data() {
            return {
                fileUpload: null,
                notAllSaved: false,
            }
        },
        props:{
            readonly: Boolean,
            notAllAttachmentSaved: { type: [Boolean], default: false},
        },
        watch:{
            value:{
                deep: true,

                handler(val){
                    if(val !== undefined && val !== null && val.length == 0) this.pushEmptyValue();
                }
            },
            notAllAttachmentSaved(val) {
                this.notAllSaved = val;
            }
        },
        methods: {
            onUpload(e,i){
                setTimeout(() => {
                    this.uploadAdminFile(i);
                },300)
                
            },
            uploadAdminFile(i){
                if(this.value[i].fileUpload){
                    let data = new FormData();
                    data.append('image',this.value[i].fileUpload, this.value[i].fileUpload.name)
                    uploadFile(data).then(
                        res=> {
                            this.value[i].path = res.data.path;
                            this.value[i].name = res.data.name;
                            this.value[i].url = res.data.url;
                            this.value[i].fileUpload = null;
                            this.notAllSaved = false;
                            this.$emit('notAllSavedFalse', this.notAllSaved);
                        }
                    )
                }
            },
           
            pushEmptyValue() {
                this.value.push({
                    name: '',
                    path: ''
                })
            },
        }
    }
</script>
<style lang="scss" module>

    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 13px;
        font-weight: 400;
        margin-bottom: 20px;
        margin-top: -15px;
    }
</style>
