<template>
    <div class="recordLine">
        <RecordItem readonly v-for="(item, i) in value" :key="i" :record-index="i" :length="value.length">
            <FormRow>
                <div class="col-sm-3">
                    <InputText readonly v-model="item.A_Qual" required label="Qualification" />
                </div>
                <div class="col-sm-4">
                    <InputText readonly v-model="item.A_Institute" required label="Institution/Awarding Body" />
                </div>
                <div class="col-sm-2">
                    <YearSelect readonly label="Year Obtained" v-model="item.A_qualyear" />
                </div>
                <div class="col-sm-3">
                    <div :class="$style.file">
                        <!-- <InputFile disabled label="Upload File" @onChange="(file) => uploadFile(file, item)" /> -->
                        <a :class="$style.fileView" v-if="item.DocumentPath" :href="item.DocumentPath" target="_blank">
                            <Icon type="md-eye" />
                            View
                        </a>
                    </div>
                </div>
            </FormRow>
        </RecordItem>
    </div>
</template>

<script>

    import recordMixin from 'Mixins/recordMixin'
    import { uploadDocumentPQ } from '../../../config/api'

    export default {
        name: "AcadQualificationsRecords",
        mixins: [recordMixin],
        props: {
            pqId: Number
        },
        methods: {
            pushEmptyValue() {
                this.value.push({
                    PQRecord_id: null,
                    pq_id: this.pqId,
                    RecordType: "AQual",
                    A_Qual: "",
                    A_Institute: "",
                    A_qualyear: "",
                    DocumentPath: ''
                })
            },
            uploadFile(file, item) {
                if (file) {
                    const data = new FormData();
                    data.append("image", file);
                    data.append("pq_id", this.pqId);
                    uploadDocumentPQ(data).then(res => {
                        item.DocumentPath = res.url;
                        item.PQRecord_id = res.PQRecord_id
                    })
                }
            },
        }
    }
</script>

<style lang="scss" module>
    .file {
        display: flex;
        align-items: center;
    }

    .fileView {
        padding: 0 5px;
        margin-left: 5px;
        white-space: nowrap;
        flex-grow: 1;
        :global {
            .ivu-icon {
                font-size: 19px;
                margin-right: 5px;
            }
        }
    }
</style>
