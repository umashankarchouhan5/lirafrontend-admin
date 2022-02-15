<template>
    <FormRow>
        <div class="col-sm-9">
            <p :class="$style.label">
                <slot />
                <!--<span v-if="!value.CheckedYN" class="text-danger">This field is required to select</span>-->
            </p>
        </div>
        <div class="col-sm-3">
            <div :class="$style.selectors" v-if="value.CheckedYN">
                <RadioGroup v-model="value.CheckedYN" disabled>
                    <Radio label="Y" disabled rules="required">
                        Yes
                    </Radio>
                    <Radio label="N" disabled>
                        No
                    </Radio>
                </RadioGroup>
            </div>
        </div>
        <div class="col-sm-11" :class="$style.fieldBox">
            <!-- <div v-if="value.StatsJson === null &&" > -->
                <br />
                <div v-if="value.Notes">
                    <InputTextArea v-model="value.Notes" label="Notes" :rules="{required: disabled ? false: true}" maxlength="500" rows="5" readonly />
                    
                    <br />
                </div>

                
                <div v-if="value.DocumentPath" >
                    <div :class="$style.file" >
                        <InputFile label="Select File (pdf)" disabled v-if="this.value.DocumentPath === null" :rules="{required:disabled ? false: true,docCheck:'pdf'}" />
                        
                        <InputText label="Selected File" readonly v-if="this.value.DocumentPath !== null" v-bind:value="value.DocumentPath.split('/').pop()" />
                        <a :class="$style.fileView" v-if="this.value.DocumentPath" :href="this.value.DocumentPath" target="_blank">
                            <Icon type="md-eye" />
                            View
                        </a>
                    </div>
                    <br />
                </div>
            </div>

        <!-- </div> -->
        <FormRow v-if=" value.StatsJson && value.StatsJson !== null && value.StatsJson !== undefined && value.isTable === true">
            <div  class="col-sm-11">
                <DataTable :class="$style.documents"  no-data-text="No Data Available" :columns="modifiedColumns" readonly :data="tableData" />
                
            </div>
        </FormRow>

        <div v-if="value.StatsJson !== null && value.StatsJson !== undefined && ((value.isTable === undefined || (value.isTable && value.isTable !== true) && value.CheckedYN === 'Y') || value.isFieldJsonRequired === true)" :class="$style.fieldBox">
            <FormRow :class="$style.rowPadding"  v-for="(items,i) in modifiedFields" :key="i">
                <div class="col-sm-10">
                    <InputText :label="items.key" v-model="items.value" readonly />
                </div>
            </FormRow>
        </div>

    </FormRow>
</template>

<script>

    import { RadioGroup, Radio } from 'view-design'
    import DataTable from 'Components/DataTable';
    import InputCell from './inputCell';
    

    export default {
        name: "ListItem",
        data(){
            return {
                refinedData: [],
                tableData: []
            }
        },
        props: {
            value: {
                type: Object,
                default() {
                    return { }
                }
            },
            i:{
                type: [Number,String]
            },
            readonly: Boolean,
            disabled:{
                type: Boolean,
                default: false,
            }
        },
        components: {
            RadioGroup,
            Radio,
            DataTable,
        },
        watch:{
            tableData:{
                deep: true,
                handler(val){
                    this.value.Stats = val;
                }
            }
        },
        computed:{
            modifiedFields(){
                if(this.value.JsonFormat !== null){
                    var columns = this.value.JsonFormat.replace('/n','');
                    columns = JSON.parse(columns);
                    
                    var tableColumn = [];
                    for (var key in columns[0]) {
                        if (columns[0].hasOwnProperty(key)) {
                            const col = {
                                'key': key,
                                'value': columns[0][key]
                            }
                            tableColumn.push(col)
                        }
                    }
                    return tableColumn
                }
                return  [];
            },
            modifiedColumns(){
                if(this.value.JsonFormat !== null){
                    var columns = this.value.JsonFormat.replace('/n','');
                    columns = JSON.parse(columns);
                    var tableColumn = [];
                    for (var key in columns[0]) {
                        if (columns[0].hasOwnProperty(key)) {
                            
                            const col = {
                                'title': key,
                                'key': key,
                                render: (h, params) => {
                                    return h('div', [
                                        h(InputCell, {
                                            props: {
                                                row: params.row,
                                                onInputChange: this.onInputChange,
                                                keyVar: params.column.key,
                                                readonly: this.readonly || this.disabled
                                            }
                                        }),
                                    ]);
                                }
                            }
                            tableColumn.push(col)
                        }
                    }
                    return tableColumn;
                }
                else{
                    return [];
                }
            }
        },
        created(){
            if(this.value.StatsJson && this.value.StatsJson !== null && this.value.StatsJson !== undefined){
                this.tableData = this.statData();
            }
        },
        methods: {
            statData(){
                var columns = this.value.StatsJson.replace('/n','');
                columns = JSON.parse(columns);
                return columns;
            },
            onAddRow(){
                if(!this.readonly || this.disabled){
                    this.tableData.push(this.statData()[0]);
                }
            },
            onInputChange(val,row){
                this.refinedData[row._index] = row;
                 for (var key in this.tableData[row._index]) {
                    if (this.tableData[row._index].hasOwnProperty(key)) {
                        this.tableData[row._index][key] = row[key];
                    }
                }
            },
        }
    }
</script>

<style lang="scss" module>
    
    .rowPadding{
        padding: 0px 10px;
    }
    .fieldBox{
        margin-left: 40px;
    }
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
