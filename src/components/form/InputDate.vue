<template>
    <DatePicker
            :clearable="true"
            :confirm="true"
            :readonly="readonly"
            :class="$style.date"
            :open="open"
            :value="innerValue"
            :type="type"
            :options="options"
            transfer
            @on-clickoutside="closeHandler"
            @on-change="handleChange"
            @on-clear="handleClear">
        <InputText icon="date" :readonly="readonly" :vid="vid" :rules="rules" :value="inputValue" :label="label" @click="handleClick" @focus="handleClick"  />
    </DatePicker>
</template>

<script>

    import { locale, DatePicker } from 'view-design';
    import lang from 'view-design/dist/locale/en-US';
    import validationMixin from 'Mixins/validationMixin'
    import DateUtil from 'Utils/dateUtil';
    import moment from 'moment';

    locale(lang);

    export default {
        name: "InputDate",
        mixins: [validationMixin],
        data() {
            return {
                open: false,
                inputValue: ''
            }
        },
        created() {
            this.formatInputValue(this.value);
        },
        watch: {
            value(newValue) {
                this.formatInputValue(newValue);
            }
        },
        components: {
            DatePicker
        },
        props: {
            readonly: Boolean,
            format: {
                type: String,
                default: 'formatDate'
            },
            type: {
                type: String,
                default: 'date'
            },
            clearable: {
                type: Boolean,
                default: true
            },
            label: {
                type: String,
                default: ''
            },
            value: [String, Array, Date],
            rules: [String, Object],
            vid: String,
            options: Object
        },
        methods: {
            formatInputValue(value) {
                if (this.format && value) {
                    if(Array.isArray(value) && this.type == 'daterange'){
                        this.inputValue = this.reduceOneDayExtraDateRange(value).map(item => DateUtil[this.format](item)).join(' - ')
                    }
                    else if (Array.isArray(value)) {
                        this.inputValue = value.map(item => DateUtil[this.format](item)).join(' - ')
                    } else {
                        this.inputValue = DateUtil[this.format](value)
                    }
                }
                else{
                    if(value == null){
                        this.inputValue = ''
                    }
                }
            },
            closeHandler() {
                this.open = false;
            },
            handleClick() {
                !this.readonly && (this.open = true);
            },
            handleChange(date) {
                if(Array.isArray(date) && date[0] == '' && date[1] == '' ){
                    date = ''
                }
                this.open = false;
                this.formatInputValue(date);
                if (this.type === "daterange" && date != '') {
                    this.inputValue = date.join(' - ');
                    this.innerValue = this.increaseOneDayExtraDateRange(date);
                    this.$emit('onChange', this.increaseOneDayExtraDateRange(date));
                }
                else{
                    this.inputValue = date;
                    this.innerValue = date;
                    this.formatInputValue(date);
                    this.$emit('onChange', date);
                }
            },
            increaseOneDayExtraDateRange(value) {
                if(value !== ''){
                const formatedDateArray = value.map((item,index) => {
                        if(index !== 1){
                            return item
                        }
                        else{
                            var newDate = moment(item).add(1, 'd').format("YYYY-MM-DD");
                            return newDate;
                        }
                    });
                    return formatedDateArray;
                }
                else{
                    return ''
                }
            },
            reduceOneDayExtraDateRange(value) {
                if(value !== ''){
                const formatedDateArray = value.map((item,index) => {
                        if(index !== 1){
                            return item
                        }
                        else{
                            var newDate = moment(item).subtract(1, 'd').format("YYYY-MM-DD");
                            return newDate;
                        }
                    });
                    return formatedDateArray;
                }
                else{
                    return ''
                }
            },
            handleClear () {
                this.open = false;
            },
        }
    }
</script>

<style lang="scss" module>
    .date {
        width: 100%;
    }
</style>
