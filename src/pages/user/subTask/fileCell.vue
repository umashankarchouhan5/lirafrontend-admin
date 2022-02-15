<template>
    <div>
        <h6>Attachments</h6>
        <RecordItem v-for="(item, i) in value" :key="i" :readonly="readonly" :record-index="i" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow">
            <FormRow v-if="item.name !== '' || readonly">
                <div class="col-sm-6">
                    <InputText label="File Name" rules="required" :readonly="readonly" v-model="item.name" />
                </div>
                <div class="col-sm-6">
                    <!-- <InputText label="Url" rules="required" max="200" :readonly="readonly" v-model="item.path" /> -->
                    
                <FormButton :prevent-default="false" size="small" type="text" :href="item.url" target="_blank"  tag="a" left-icon="md-eye">View</FormButton>
                </div>
            </FormRow>
            <FormRow v-else>
                <div class="col-sm-6">
                    <InputFile 
                        label="Select File" 
                        v-model="fileUpload"
                        :rules="{ checkFileRegex: true }"
                    />
                </div>
                <div class="col-sm-4">
                    <FormButton left-icon="ios-send" type="success" @click="uploadAdminFile(i)" >Save File</FormButton>

                </div>
            </FormRow>
        </RecordItem>
    </div>
</template>

<script>

    import { uploadFile } from './api';
    import recordMixin1 from 'Mixins/recordMixin1';
    // import valueMixin from 'Mixins/valueMixin';

    export default {
        name: "AttachmentRecords",
        mixins: [recordMixin1,],
        data() {
            return {
                fileUpload: null,
            }
        },
        props:{
            readonly: Boolean,
            // value: Array
        },
        watch:{
            value:{
                deep: true,

                handler(val){
                    
                }
            },
        },
        methods: {
            uploadAdminFile(i){
                
                let data = new FormData();
                data.append('image',this.fileUpload, this.fileUpload.name)
                uploadFile(data).then(
                    res=> {
                        this.value[i].path = res.data.path;
                        this.value[i].name = res.data.name;
                        this.value[i].url = res.data.url;
                        this.fileUpload = null;

                    }
                )
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
