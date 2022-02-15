<template>
    <div :class="$style.save">
        <div v-if="(!row.isChange && row.ScannedFileURL === null) || changedFile"
            type="success"
            @click="saveDocument"
            
            left-icon="md-checkmark-circle-outline">
                <img src="../../../../assets/images/save.png" alt="FSA Save" title="Save Document">
        </div>
            <div v-else
                type="success"
                @click="changeDocument"
                left-icon="md-edit-circle-outline">

                <img src="../../../../assets/images/changes.png" alt="FSA change" title="Change Document">
            </div>
        <!-- <FormButton @click="saveDocument" v-if="(!row.isChange && row.ScannedFileURL === null) || changedFile  ">Upload</FormButton> -->
        <!-- <FormButton @click="changeDocument" v-else >Change</FormButton> -->
    </div>
</template>

<script>
    export default {
        name: "ReferenceCell",
        data(){
            return{
                changedFile: false,
            }
        },
        props: {
            row: {
                type: Object,
                required: true
            },
            onSaveDocument: Function,
            onChangeDocument: Function,
        },
        watch:{
            'row.isChange': function(val){
                this.changedFile = val;
            }
        },
        methods:{
            changeDocument(){
                this.row['isChange'] = true;
                this.onChangeDocument(this.row);
            },
            saveDocument() {
                this.row['isSaved'];
                this.onSaveDocument(this.row)
            },
        }
    }
</script>

<style lang="scss" module>
.save {
    position: relative;
    margin-top: 20px;
    min-height: 44px;
    // margin-bottom: 10px;
}

</style>