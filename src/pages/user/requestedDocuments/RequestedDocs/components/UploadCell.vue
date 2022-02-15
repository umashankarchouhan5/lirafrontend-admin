<template>
    <div :class="$style.flex">
        <!-- <span :class="$style.inputStyle">{{ row.RegisteredDocument }}</span> -->
        <a target="_blank" :href="row.RegisteredDocument" v-if="row.RegisteredDocument !== null" :class="$style.view">
            <Icon type="md-eye" :class="$style.eye" />
            View
        </a>
    </div>
</template>

<script>

    export default {
        name: "UploadCell",
        computed: {
            isAccepted() {
                return !!(+this.row.isAccepted)
            },
        },
        data(){
            return{
                changeDoc: false
            }
        },
        watch:{
            'row.isChange': function(val){
                this.changeDoc = val;
            }
        },
        props: {
            row: Object,
            readonly: Boolean,
            onChange: Function
        },
        methods: {
            onUploadHandler(documentDetails) {
                this.onChange(documentDetails, this.row)
            }
        }
    }
</script>

<style lang="scss" module>
    .eye{
        font-size: 17px;
    }
    .inputStyle{
        word-break: break-all;
    }
    .accepted {
        color: #55a7a0;
        font-size: 13px;
        i {
            font-size: 17px;
            margin-right: 5px;
        }
    }

    .view {
        text-align: left;
        // margin-left: auto;
        margin-right: 5px;
        display: inline-block;
        vertical-align: middle;
    }

    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 11px;
        margin: -3px 0 2px;
        font-weight: 400;
    }
    .flex{
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        // min-height: 40px;
    }
</style>
