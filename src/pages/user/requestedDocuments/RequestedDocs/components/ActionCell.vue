<template>
    <div >
        <div :class="$style.flex" v-if="row.RegisteredDocument !== null && row.isAccepted !== 1">
            <FormButton type="success" @click="acceptDocument">Accept</FormButton>
        </div>
        <div v-if="row.isAccepted" :class="$style.accepted">
            <Icon type="md-checkmark-circle-outline" />
            Accepted
        </div>
    </div>
</template> 

<script>

    export default {
        name: "ActionCell",
        components: {
        },
        computed: {
            isAccepted() {
                return !!(+this.row.isAccepted)
            },
            checkAllUploaded(){
                return this.$store.state.common.allUploaded;
            },
        },
        props: {
            row: Object,
            readonly: Boolean,
            onAcceptDocument: Function,
            documents: Array,
        },
        methods: {
            acceptDocument() {
                this.onAcceptDocument(this.row)
            },
        }
    }
</script>

<style lang="scss" module>
    .accepted {
        color: #55a7a0;
        font-size: 13px;
        i {
            font-size: 17px;
            margin-right: 5px;
        }
    }
    .flex {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 3px;

    }
</style>
