<template>
    <div>
    <span :class="$style.inputStyle">{{ row.name }}</span>
        <a target="_blank" :href="row.url" v-if="row.ScannedFileURL" :class="$style.view">
            <Icon type="md-eye" :class="$style.eye" />
        </a>
    </div>
</template>

<script>
    export default {
        name: "ReferenceCell",
        props: {
            row: {
                type: Object,
                required: true
            }
        },
    }
</script>


<style lang="scss" module>
    .eye{
        font-size: 17px;
        // transform: scale(1.5)!important;
        // &::before{
        //     transform: scale(1.5)!important;
        // }
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
        margin-left: auto;
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
