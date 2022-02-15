<template>
    <div >
        <a @click="openMail" v-if="row.notice3Mailout_id && row.notice3Mailout_id !== null">{{formatDate(row.notice3Date_AG)}} </a>
        <p v-else>{{formatDate(row.notice3Date_AG)}} </p>
    </div>
</template> 

<script>
    import DateUtil from 'Utils/dateUtil' ;
    export default {
        name: "NoticeDate3",
        components: {
        },
        computed: {
        },
        props: {
            row: Object,
            readonly: Boolean,
            openMailBox: Function
        },
        methods: {
            formatDate(val){
                return val !== null ?  DateUtil.formatDate(val) : ''
            },
            openMail() {
                this.openMailBox(this.row.notice3Mailout_id)
            },
        }
    }
</script>

<style lang="scss" module>
    .save {
        position: relative;
        margin-top: 10px;
        min-height: 44px;
    }
    .add {
        position: absolute;
        right: -32px;
        top: 50%;
        > * {
            transform: translate(0, -50%);
        }
    }
    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 11px;
        margin: -3px 0 2px;
        font-weight: 400;
    }
</style>
