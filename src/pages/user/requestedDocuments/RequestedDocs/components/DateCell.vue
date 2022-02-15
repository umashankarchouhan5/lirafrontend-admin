<template>
    <div :class="$style.dateCell">
        <div>
            {{ dateFormatted }}
        </div>
    </div>
</template>

<script>

    import DateUtil from 'Utils/dateUtil'

    export default {
        name: "DateCell",
        data() {
            return {
                dateRequired: false,
                options : {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                
            }
        },
        computed: {
            dateFormatted() {
                return this.row.registrationDate && this.row.registrationDate != null ? DateUtil.formatDate(this.row.registrationDate) : ''
            }
        },
        props: {
            row: Object,
            readonly: Boolean,
            onDateChange: Function
        },
        methods: {
            onDateChangeHandler(value) {
                this.onDateChange(value, this.row)
            }
        }
    }
</script>

<style lang="scss" module>
    .dateCell{
        max-width: 140px;
    }
    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 13px;
        margin-top: 3px;
        font-weight: 400;
    }
</style>
