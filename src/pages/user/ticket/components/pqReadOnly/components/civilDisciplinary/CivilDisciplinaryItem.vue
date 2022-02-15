<template>
    <FormRow>
        <div class="col-sm-9">
            <p :class="$style.label">
                <slot />
                <!--<span v-if="!value.CheckedYN" class="text-danger">This field is required to select</span>-->
            </p>
        </div>
        <div class="col-sm-3">
            <div :class="$style.selectors">
                <RadioGroup v-model="value.CheckedYN">
                    <Radio disabled label="Y">
                        Yes
                    </Radio>
                    <Radio disabled label="N">
                        No
                    </Radio>
                    <Radio disabled label="A" v-if="i == 11">
                        Not applicable
                    </Radio>
                </RadioGroup>
            </div>
            <div :class="$style.file" v-if="value.CheckedYN === 'Y'">
                <InputFile label="Select File" disabled @onChange="uploadFile" />
                <a :class="$style.fileView" v-if="this.value.DocumentPath" :href="this.value.DocumentPath" target="_blank">
                    <Icon type="md-eye" />
                    View
                </a>
            </div>
        </div>
    </FormRow>
</template>

<script>

    import { RadioGroup, Radio } from 'view-design'
    import { uploadDocumentPQ } from '../../../../config/api'

    export default {
        name: "CivilDisciplinaryItem",
        props: {
            value: {
                type: Object,
                default() {
                    return { }
                }
            },
            i:{
                type: [String,Number]
            }
        },
        components: {
            RadioGroup,
            Radio
        },
        methods: {
            uploadFile(file) {
                const data = new FormData();
                data.append("image", file);
                data.append("PQChecklistData_id", this.value.PQChecklistData_id);
                data.append("pq_id", this.value.pq_id);
                uploadDocumentPQ(data).then(res => {
                    this.value.DocumentPath = res.url
                })
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
        :global {
            .ivu-icon {
                font-size: 19px;
                margin-right: 5px;
            }
        }
    }

    .label {
        margin-bottom: 0;
        :global {
            .text-danger {
                display: block;
                font-size: 11px;
            }
        }
    }
    .selectors {
        :global {
            .text-danger {
                display: block;
                font-size: 11px;
            }
            .ivu-radio-group {
                display: flex;
                justify-content: center;
                .ivu-radio-wrapper {
                    margin: 0 10px;
                }
            }
        }
    }
</style>
