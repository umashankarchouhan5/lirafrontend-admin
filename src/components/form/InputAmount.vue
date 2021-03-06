<template>
    <ValidationProvider :vid="vid" :rules="rules"  :name="name || label" mode="passive" v-slot="{ errors }">
        <div :class="cssClass">
            <input
                v-model="formattedToAmount"
                @focusin="handleFocusIn"
                @focusout="handleFocusOut"
                @click="handleClick"
                type="text"
                ref="input"
                :maxlength="maxlength || 18"
                @focus="handleFocus"
                @keyup="handleKeyUp"
                :disabled="disabled"
                :readonly="readonly"
                :placeholder="placeholder"
                :class="$style.input"
                min="0"
                :style="getStyle"
            />
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

    import validationMixin from 'Mixins/validationMixin'

    export default {
        name: "InputText",
        mixins: [validationMixin],
        props: {
            icon: {
                type: String
            },
            disabled: {
                type: Boolean
            },
            label: {
                type: String,
                default: ""
            },
            name: String,
            type: {
                type: String,
                default: "text"
            },
            value: {
                type: [String, Number],
                default: ""
            },
            placeholder: {
                type: String,
                default: ""
            },
            vid: {
                type: String,
                default: ""
            },
            focused: {
                type: Boolean,
                default: false
            },
            readonly: {
                type: Boolean,
                default: false
            },
            maxlength: [String, Number],
            rightAlignText: {
                type: Boolean,
                default: false,
            }
        },
        data() {
            return {
                decimalString: ''
            }
        },
        watch:{

        },
        computed: {
            getStyle() {
                return this.rightAlignText ? 'text-align:right': '';
            },
            cssClass() {
                return [
                    this.$style.block,
                    this.innerValue || this.innerValue === 0 ? this.$style.blockWithValue : "",
                ].join(" ");
            },
            formattedToAmount: {
                get() {
                    return this.innerValue === '' || this.innerValue === null ? '' : this.formatNumberWithComma(this.innerValue);
                },
                set (value) {
                    var arr = value.split('.');
                    if(arr.length > 1){
                        this.decimalString = value;
                    }
                    else{
                        this.decimalString = '';
                    }
                    value = value !== '' && value !== null  ? parseFloat(value.replace(/,/g, '')) : '';
                    this.innerValue = value !== '' && value !== null && !isNaN(parseFloat(value)) ? parseFloat(value) : '';
                }
            },
            formattedToNumber(){
                return parseFloat(this.innerValue.replace(/,/g, ''));
            }
        },
        mounted() {
            if (this.focused) {
                this.$refs.input.focus();
            }
        },
        methods: {
            formatNumberWithComma(val){
                if(val == 0){
                    return 0;
                }
                else{
                    var num =  new Intl.NumberFormat('en-US').format(parseFloat(val));
                    var arr = this.decimalString.split('.');
                    if(this.decimalString !== '' && arr.length > 1 && arr[1] == '' ){
                        num = num + '.';
                    }
                    return num;
                }
            },
            handleFocus() {
                this.$emit("focus");
            },
            handleFocusIn() {
                this.isFocused = true;
                this.$emit("focusin");
            },
            handleFocusOut() {
                this.isFocused = false;
                this.$emit("focusout", this.innerValue);
            },
            handleClick() {
                this.$emit("click");
            },
            handleKeyUp(){
                this.$emit("keyup");
            }
        }
    };
</script>

<style lang="scss" module>
    .block {
        position: relative;
    }

    .required {
        color: #ff3547;
        margin-left: 2px;
    }

    .requiredWithoutLabel {
        color: #ff3547;
        position: absolute;
        top: 1px;
        right: 0;
    }

    .calendar {
        position: absolute;
        right: 0;
        top: 50%;
        pointer-events: none;
        transform: translate(0, -40%);
    }

    .input {
        color: #555;
        background-color: transparent;
        font-size: 13px;
        border: none;
        width: 100%;
        border-bottom: 1px solid #c7c7c7;
        height: 26px;
        padding: 7px 0 4px;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        outline: 0;
        box-sizing: content-box;
        &:focus {
            &:not([disabled]) {
                border-color: #4285f4;
                box-shadow: 0 1px 0 0 #4285f4;
                + label {
                    transform: translateY(-11px) scale(0.8);
                    color: #4285f4;
                }
            }
        }

        &:disabled {
            color: lighten(#555, 30%);
            + .label {
                color: lighten(#555, 30%);
            }
        }
        &:read-only {
            color: #aaaaaa;
            cursor: not-allowed;
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        input[type=number] {
            -moz-appearance: textfield;
        }
    }
    .input::-webkit-outer-spin-button,
    .input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .input[type=number] {
        -moz-appearance: textfield;
    }

    .label {
        transform: translateY(12px);
        color: #555;
        transform-origin: 0 100%;
        position: absolute;
        pointer-events: none;
        white-space: nowrap;
        top: 0;
        left: 0;
        font-size: 13px;
        line-height: 19px;
        font-weight: 400;
        transition: transform 0.2s ease-out, color 0.2s ease-out;

        .blockWithValue & {
            transform: translateY(-11px) scale(0.8);
        }
    }

    .error {
        color: #ff3547;
        position: absolute;
        left: 0;
        font-size: 11px;
        line-height: 13px;
        top: calc(100% + 2px);
        font-weight: 400;
    }
</style>
 