<template>
    <div >
        <div :class="$style.additional">
            <h4> Upload documents in support of your inspection findings for {{itemName}}. </h4>
            <DataTable :class="$style.documents" no-data-text="No Documents Attached" :columns="columns()" :data="innerValue" />
            
            <div :class="$style.additionalAdd">
                <AddRemoveButton :is-last="true" v-if="innerValue.length === 0 &&  !readonly" @add="onAddDocument" @remove="onRemoveDocument" :length="innerValue.length" size="small" />
            </div>
        </div>
    </div>
</template>

<script>
    import DataTable from 'Components/DataTable';
    import tableAdditional from './table';
    import valueMixin from 'Mixins/valueMixin';
    import loadingMixin from 'Mixins/loadingMixin';
    import { uploadDocument } from '../../../api';
    import AddRemoveButton from 'Components/AddRemoveButton'

    export default {
        name: "Documents",
        mixins: [ loadingMixin, valueMixin ],
        props: {
            readonly: Boolean,
            process_id: [String, Number],
            itemName: String,
        },
        components: {
            DataTable,
            AddRemoveButton
        },
        data() {
            return {
                columns: tableAdditional,

            }
        },
        computed: {
        },
        created() {
            this.getDocumentData();
        },
        methods: {
            getDocumentData(){
                if( this.innerValue == null){
                    this.innerValue = [];
                    this.onAddDocument();
                }
            },
            onAddDocument() {
                const template = {
                    DocumentDate: '',
                    UploadDate: '',
                    DocumentBrief: '',
                    type: 'additional',
                    errors: [],
                    file: null,
                    DocumentName: '',
                    path: '',
                    url: '',
                    isMandatory: true,
                    isSaved: false,
                    isChange: false
                };
                this.innerValue.push(template)
            },
            onRemoveDocument(index) {
                this.innerValue.splice(index, 1)
            },

            onFileChange(file, row) {
                this.innerValue[row._index].file = file;
                if(file !== null) this.onSaveDocument(row);
            },

            onDateChange(data, row) {
                this.innerValue[row._index].DocumentDate = data;
            },

            onBriefChange(data, row) {
                this.innerValue[row._index].DocumentBrief = data;
            },

            onSaveDocument(row) {
                if (this.validateDocument(row)) {
                    const current = this.innerValue[row._index];
                    let data = new FormData();

                    if (current.DocumentBrief) {
                        data.append("DocumentBrief", current.DocumentBrief);
                    }
                    if (current.file) {
                        data.append("image", current.file, current.file.name);
                    }
                    if (current.isDateRequired) {
                        data.append("DocumentDate", current.DocumentDate);
                    }
                    if(this.$route.name !== 'RecordOutcomeFormMultiple'){
                        data.append("company_id", parseInt(this.$route.params.company_id));
                    }
                    data.append("reference_id", parseInt(this.$route.params.id));
                    data.append("process_id", this.process_id);

                    uploadDocument(data).then((res) => {
                        current.url = res.data.url;
                        current.DocumentName = current.file.name;
                        current.isSaved = true;
                        current.isChange = false;
                    })
                }
            },
            onChangeDocument(row) {
                const current = this.innerValue[row._index];
                if(current.isSaved == false){
                    current.isSaved = true
                    current['isChange'] = false;
                }
                else{
                    current.isSaved = false;
                    current['isChange'] = true;
                }
            },

            validateDocument(row) {
                const current = this.innerValue[row._index];
                current.errors = [];
                if (!current.DocumentName && !current.file) {
                    current.errors.push('file')
                }
                if (!current.DocumentBrief) {
                    current.errors.push('brief')
                }
                return current.errors.length === 0
            },
            validateAdditionalDocument() {
                const isAdditionalDocumentsUploaded = this.innerValue.every( item => {
                    if(item.file !== null){
                        return item.DocumentName && item.DocumentName !== '' ? true : false;
                    }
                    else if(item.DocumentBrief && item.DocumentBrief.trim() !== ''){
                        return item.DocumentName && item.DocumentName !== '' ? true : false;
                    }
                    return true;
                })
                if (!isAdditionalDocumentsUploaded) {
                    this.$store.commit('checkAdditionalUploaded',true)
                    return false;
                }
                return true;
            },
        },
        beforeDestroy(){
            this.$store.commit('checkAdditionalUploaded',false);
        }
    }
</script>

<style lang="scss" module>
    
    .additional {
        position: relative;
        h4 {
            margin-left: 10px;
        }
    }

    .additionalAdd {
        position: absolute;
        right: -25px;
        top: 36px;

    }
    .documents {

        :global {
            .ivu-table,
            .ivu-table-wrapper {
                overflow: visible;
            }
        }
    }
</style>
