<template>
    <div>
        <a @click="onPopClick"  v-if="row.Score !== 0">{{ row.ParameterDetail }} </a>
        <p v-else>{{ row.ParameterDetail }}</p>
    </div>
</template> 

<script>


    export default {
        name: "ParamCell",
        components: {
        },
        computed: {
        },
        props: {
            row: Object,
            onPop: Function,
        },
        methods: {
            onPopClick(){
                this.onPop(this.row._index)
            }
        }
    }
</script>

<style lang="scss" module>
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
