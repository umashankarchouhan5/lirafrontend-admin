<template>
    <div>
        <p  :class="$style.messageError" v-if="row.Status !== 'Active'">
            <Icon type="md-close-circle"  />
        </p>
        <p  :class="$style.messageSuccess" v-else>
            <Icon type="md-checkmark-circle"   />
        </p>
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
        methods:{
            link() {
                window.open(this.row.path, 'blank') ;
            },

        }
    }
</script>
<style lang="scss" module>
.messageError {
    :global {
        .ivu-icon {
            font-size: 21px;
            margin-right: 3px;
            margin-top: -4px;
            vertical-align: middle;
            color: #ff3547;
        }
    }
}
.messageSuccess {
    :global {
        .ivu-icon {
            font-size: 21px;
            margin-right: 3px;
            margin-top: -4px;
            vertical-align: middle;
            color: #00ff00;
        }
    }
}
    
</style>
