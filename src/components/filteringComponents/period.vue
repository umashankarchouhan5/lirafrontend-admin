<template>
    <div :class="$style.filter">
        <div :class="$style.filterItem1">
            <RadioGroup v-model="dateRadio">
                <Radio label="Month">
                    Month
                </Radio>
                <Radio label="Quarter">
                    Quarter
                </Radio>
                <Radio label="Year">
                    Year
                </Radio>
                <Radio label="Custom">
                    Custom
                </Radio>
            </RadioGroup>
        </div>
        <div :class="$style.filterItem" v-if="dateRadio === 'Custom'">
            <InputDate style="width: 200px" label="Select Date range" type="daterange" v-model="innerValue" />
        </div>
    </div>
</template>

<script>
    import valueMixin from 'Mixins/valueMixin';
    import { RadioGroup, Radio } from 'view-design';
    import InputDate from 'Components/form/InputDate';

    export default {
        name: "PeriodComponent", 
        mixins: [ valueMixin ],
        components: {
            InputDate,
            RadioGroup,
            Radio
        },
        data() {
            return {
                dateRadio: '',
            }
        },
        watch: {
            dateRadio(val) {
                if(val !== 'Custom'){
                    var toDate,fromDate,dd,mm,yy,getToDate,month,day,year;
                    dd = new Date().getDate();
                    mm = new Date().getMonth() + 1;
                    yy = new Date().getFullYear();
                    if(dd<10) 
                    {
                        dd='0'+dd;
                    } 

                    if(mm<10) 
                    {
                        mm='0'+mm;
                    } 
                    toDate = yy+'-'+mm+'-'+dd;
                    getToDate = new Date(yy,mm,dd)
                    if(val === 'Month'){
                        fromDate = new Date(getToDate.getTime() - 30 * 24 * 60 * 60 * 1000);
                        
                    }
                    if(val === 'Quarter'){
                        fromDate = new Date(getToDate.getTime() - 90 * 24 * 60 * 60 * 1000);
                    }
                    if(val === 'Year'){
                        fromDate = new Date(getToDate.getTime() - 365 * 24 * 60 * 60 * 1000);
                    }
                    month = '' + fromDate.getMonth();
                    day = '' + fromDate.getDate();
                    year = fromDate.getFullYear();

                    if (month.length < 2) 
                    {
                        month = '0' + month;
                    }
                    if (day.length < 2) 
                    {
                        day = '0' + day;
                    }
                    fromDate = [year, month, day].join('-');
                    this.innerValue = [fromDate, toDate];
                }
            }
        }
    }
</script>

<style lang="scss" module>  
    
    .filter {
        // margin: -10px 0 10px;
        display: flex;
        align-items: flex-end;
    }

    .filterItem {
        margin: 0 15px 0px 0;
        display: flex;
    }
    .filterItem1 {
        margin: 0 15px 10px 0;
        display: flex;
    }

</style>