<template>
    <div>
        
        <RecordItem v-for="(item, i) in value" :key="i" :readonly="readonly" :record-index="i" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow">
            <div :class="$style.flex">
                <div :class="$style.firstBox">
                    Split File {{i + 1}} Pages
                </div>
                <div :class="$style.secondBox">
                    <div :class="$style.pageDecisionStyle">
                        <div :class="$style.pageCountStyle">
                            <InputText type="number" placeholder="MIN" name="Min" v-model="item.min" :vid="`min -${i}`" :rules="{min_value: 1,max_value: count}" />
                        </div>

                        <span> to </span>

                        <div :class="$style.pageCountStyle">
                            <InputText type="number" placeholder="MAX" name="Max" v-model="item.max" :vid="`max -${i}`" 
                            :rules="{between:[item.min,count]}" />
                        </div>
                    </div>

                </div>
            </div>
        </RecordItem>

    </div>
</template>

<script>

    import recordMixin1 from 'Mixins/recordMixin1';

    export default {
        name: "SplitFile",
        mixins: [ recordMixin1 ],
        props: {
            count: {
                type: Number,
                default: 0
            },  
            readonly: Boolean,
        },
        data() {
            return {
            }
        },
        watch:{
            value:{
                deep: true,

                handler(val){
                    if(this.value.length == 0){
                        this.pushEmptyValue();
                    }
                }
            },
        },
        methods: {
           
            pushEmptyValue() {
                this.value.push({
                    min: 0,
                    max: 0
                })
            },
        }
    }
</script>

<style lang="scss" module>
    .pageDecisionStyle {
        display: flex;
        align-items: center;
        .pageCountStyle {
            // width: 300px;
            border: 2px solid #c3c3c3;
            padding: 3px 15px 2px;
            margin: 0px;
        }
        >span {
            margin: 0px 10px;
        }
    }
    .flex {
        display: flex;
        align-items: center;
        margin: 20px 0px;
        .firstBox {
            width: 130px;
            font-weight: 500;
        }
        .secondBox {
            width: calc( 100% - 200px );
            @media only screen and (max-width: 1000px){
                width: calc( 100% - 200px );
            }
        }
    }
</style>