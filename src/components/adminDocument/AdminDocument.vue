<template>
    <div :class="$style.mgTop">
        <h6 v-if="readonly && tableData.length > 0">Uploaded Document</h6>
        <FormRow v-if="(tableData.length > 0 && readonly) && change == false">
            <div class="col-sm-12">
                <!-- <a :href="form.url" target="_blank"> {{form.name}} </a>  -->
                <DataTable :actions="true"
                    :data="tableData"
                    :columns="tableConfig()">
                </DataTable>
            </div>
            
        </FormRow>
        <FormRow v-if="( !readonly) || change == true">
            
            <div class="col-sm-4">
                <InputText
                    label="Document Brief" 
                    v-model="form.DocumentBrief"
                />
            </div>
            <div class="col-sm-5">
                <InputFile 
                    label="Select File" 
                    v-model="fileUpload"
                    :rules="{ checkFileRegex: true }"
                />
            </div>
            <div class="col-sm-3">
                <div :class="$style.flexBox">
                    <FormButton left-icon="ios-send" type="success" @click="uploadAdminFile()" >Save File</FormButton>
                
                    <div v-if="change">
                        <p  :class="$style.messageError"  title="Cancel Change" @click="() => {change = false}">
                            <Icon type="md-close-circle"  />
                        </p>
                    </div>
                </div>
            </div>
        </FormRow>
    </div>
</template>

<script>

    import { uploadFile, fetchAdminDocuments } from './api';
    import valueMixin from 'Mixins/valueMixin';
    import DataTable from 'Components/DataTable';
    import tableConfig from './config/table';

    export default {
        name: "AdminDocument",
        mixins: [valueMixin],
        components: {
            DataTable
        },
        props:{
            readonly: {
                type: Boolean,
                default: false,
            }
        },
        data() {
            return {
                fileUpload: null,
                form: {
                    name: '',
                    url: '',
                    path: '',
                    documentdata_id: 0,
                    DocumentBrief: '',
                },
                change: false,
                tableConfig,
                tableData: [],
            }
        },
        computed: {
            ticket() {
                return this.$store.state.ticket.ticket;
            },
        },
        watch:{
        },
        created() {
            this.getData();
        },
        methods: {
            changeDocument(val){
                this.change = true;
                this.form.documentdata_id = val.documentdata_id;
            },
            getData(){
                const data = {
                    process_id: this.ticket.process_id,
                    reference_id: this.ticket.reference_id
                }
                fetchAdminDocuments(data).then(
                    res => {
                        if(res.data[0]){
                            // this.form = res.data[0]
                            this.tableData = res.data
                        }
                    }
                )
            },
            uploadAdminFile(){
                
                let data = new FormData();
                if(this.ticket.company_id !== undefined && this.ticket.company_id !== null) {
                    data.append('company_id',this.ticket.company_id);
                }
                data.append('image',this.fileUpload, this.fileUpload.name);
                data.append('process_id',this.ticket.process_id);
                data.append('TicketReference',this.ticket.TicketReference);
                data.append('DocumentBrief',this.form.DocumentBrief);    
                data.append('documentdata_id',this.form.documentdata_id);
                uploadFile(data).then(
                    res=> {
                        this.form.path = res.data.path;
                        this.form.name = res.data.name;
                        this.form.url = res.data.url;
                        this.fileUpload = null;
                        this.change = false;
                        this.form.DocumentBrief = '';
                        this.getData();
                        this.$emit('docRefresh');
                    }
                )
            },
        }
    }
</script>

<style lang="scss" module>
    .mgTop {
        margin-top: 20px;
    }
    .flexBox {
        display: flex;
        align-items: center;
    }
    .messageError {
        display: flex;
        margin-left: 15px;
        color: #000000;
        align-items: center;
        :global {
            .ivu-icon {
                font-size: 21px;
                margin-right: 3px;
                margin-top: -4px;
                vertical-align: middle;
                color: #ff3547;
            }
        }
    }
</style>
