<template>
    <ValidationProvider :vid="vid" :rules="rules" :name="name || label" mode="passive" v-slot="{ errors }">
        <div :class="$style.select">
            <Select 
                :clearable="clearable" 
                v-model="innerValue" 
                :disabled="disabled" 
                :multiple="multiple" 
                :style="{width: `${width}px` || '100%'}" 
                :placeholder="placeholder"
                filterable 
                :autoComplete="false"
                @on-change="onChange">
                <Option v-for="(item, i) in items" :value="getItemValue(item)" :key="i">{{ getItemName(item) }}</Option>
            </Select>
            <label v-if="label" :class="$style.label">
                {{ label }}<span v-if="isRequired" :class="$style.required">*</span>
            </label>
            <div :class="$style.error" v-if="errors[0]">
                {{ errors[0] }}
            </div>
        </div>
    </ValidationProvider>
</template>

<script>

    import validationMixin from 'Mixins/validationMixin';
    import { locale, Select, Option } from 'view-design'
    import lang from 'view-design/dist/locale/en-US';

    locale(lang);

    export default {
        name: "FormSelect",
        mixins: [validationMixin],
        components: {
            Select,
            Option
        },
        props: {
            value: [String, Number, Array],
            clearable: {
                type: Boolean,
                default: true,
            },
            items: Array,
            itemValue: String,
            itemName: String,
            label: String,
            disabled: Boolean,
            labelInValue: Boolean,
            multiple: Boolean,
            onChange: {
                type: Function,
                default: () => {}
            },
            name: String,
            width: Number,
            placeholder: {
                type: String,
                default: 'Select'
            }
        },
        computed: {
            cssClass() {
                return [
                    this.$style.block,
                    this.isFocused ? this.$style.blockFocused : "",
                    this.value ? this.$style.blockWithValue : "",
                    this.error ? this.$style.blockInvalid : ""
                ].join(" ");
            }
        },
        methods: {
            getItemValue(item) {
                return item[this.itemValue] || item
            },
            getItemName(item) {
                return item[this.itemName] || item
            }
        }
    }
</script>

<style lang="scss" module>
    .select {
        position: relative;
        :global {
            .ivu-select {
                color: #555;
                font-size: 13px;
            }
            .ivu-select-single {
                .ivu-select-selection {
                    box-shadow: none;
                    border: none;
                    line-height: 38px;
                    height: 38px;
                    border-radius: 0;
                    border-bottom: 1px solid #c7c7c7;
                    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                    .ivu-select-placeholder,
                    .ivu-select-selected-value {
                        line-height: 38px;
                        height: 38px;
                        font-size: 13px;
                        padding-left: 0;
                    }
                    &.ivu-select-selection-focused {
                        border-color: #4285f4;
                        box-shadow: 0 1px 0 0 #4285f4;
                    }
                    .ivu-select-input[disabled] {
                        color: #aaaaaa;
                        -webkit-text-fill-color: #aaaaaa;
                    }
                }
            }
        }
    }

    .label {
        color: #555;
        transform-origin: 0 100%;
        position: absolute;
        pointer-events: none;
        top: 0;
        left: 0;
        font-size: 13px;
        line-height: 19px;
        font-weight: 400;
        transform: translateY(-11px) scale(0.8);
    }

    :global(.ivu-select-visible) {
        + .label {
            color: #4285f4;
        }
    }

    .required {
        color: #ff3547;
        margin-left: 2px;
    }
    .error {
        color: #ff3547;
        position: absolute;
        max-width: 100%;
        left: 0;
        font-size: 11px;
        line-height: 13px;
        top: calc(100% + 2px);
        font-weight: 400;
    }

</style>
