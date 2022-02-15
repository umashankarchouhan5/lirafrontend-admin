<template>
    <div>
        <RecordItem v-for="(item, i) in value" :key="i" :readonly="readonly" :record-index="i" :length="value.length">
            <FormRow>
                <div class="col-sm-3">
                    <FormSelect
                            :items="countries"
                            :disabled="readonly"
                            item-name="Name"
                            item-value="id"
                            label="Nationality"
                            v-model="item.P_NationalityCountry_id" />
                </div>
                <div class="col-sm-3">
                    <InputText readonly label="Passport Number" rules="required" v-model="item.P_PassportNo" />
                </div>
                <div class="col-sm-3">
                    <InputDate readonly label="Passport Expiry Date" rules="required" v-model="item.P_PassportExpiryDate" />
                </div>
                <div class="col-sm-3">
                    <div :class="$style.file">
                        <a :class="$style.fileView" v-if="item.DocumentPath && item.DocumentPath !== null" :href="item.DocumentPath" target="_blank">
                            <Icon type="md-eye" />
                            View
                        </a>
                        <InputFile disabled label="Upload File" v-else @onChange="(file) => uploadFile(file, item)" />
                    </div>
                </div>
            </FormRow>
        </RecordItem>
    </div>
</template>

<script>

    import recordMixin from 'Mixins/recordMixin';
    import InputDate from 'Components/form/InputDate';
    import { uploadDocumentPQ } from '../../../config/api'


    export default {
        name: "PassportRecords",
        mixins: [recordMixin],
        components: {
            InputDate
        },
        computed: {
            countries() {
                return this.$store.state.common.countries;
            },
            identificationTypes() {
                return this.$store.state.common.identificationTypes;
            }
        },
        methods: {
            pushEmptyValue() {
                this.value.push({
                    PQRecord_id: null,
                    pq_id: this.pqId,
                    P_NationalityCountry_id: null,
                    P_PassportNo: null,
                    P_PassportExpiryDate: null,
                    RecordType: "Psprt"
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
