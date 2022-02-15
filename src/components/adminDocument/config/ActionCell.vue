<template>
    <div :class="$style.flex">
        <FormButton :prevent-default="false" size="small" type="text" :href="row.url" target="_blank" v-if="row.name" tag="a" left-icon="md-eye">View</FormButton>
        <div  v-if="!readOnly" >
            <div 
                type="success"
                @click="onChangeDocument"
                left-icon="md-edit-circle-outline" >

                <img src="../../../assets/images/changes.png" alt="FSA change" title="Change Document">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ActionCell",
        props: {
            row: {
                type: Object,
                required: true
            },
            changeDocument: Function,
        },
        computed:{
            readOnly(){
                return this.$store.state.ticket.readOnly;
            },
        },
        methods: {
            onChangeDocument(){
                this.changeDocument(this.row);
            }
        }
    }
</script>
<style lang="scss" module>
    .flex{
        display: flex;
    }
</style>