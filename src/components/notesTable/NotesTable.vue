<template>
    <div v-if="showTable">
        <div  v-if="showMessage !== ''">
            <!-- <InputTextArea v-model="showMessage" readonly :autosize="true" /> -->
            <!-- <p>{{showMessage}} </p> -->
        </div>
        <br />
        <h4>Previous Notes</h4>
        <DataTable :data="notes" :columns="columns()" />
        <Popup :value="messageModal.visible" :closable="true" :mask-closable="true" type="information" title="Note"
                @close="() => showPop(false)">
                <span v-html="showMessage"></span>
            <ButtonGroup slot="footer">
                <FormButton @click="showPop(false)">Close</FormButton>
            </ButtonGroup>
        </Popup>
    </div>
</template>

<script>

    import DataTable from 'Components/DataTable'
    import columns from './columns'

    export default {
        name: "NotesTable",
        data() {
            return {
                columns,
                showMessage: '',
                messageModal:{
                    visible: false
                }
            }
        },
        computed: {
            notes() {
                return this.$store.state.notesTable.notes
            },
            showTable() {
                return Array.isArray(this.notes) && this.notes.length > 0
            }
        },
        props: {
            referenceId: Number
        },
        components: {
            DataTable
        },
        methods: {
            showPop(val){
                this.messageModal.visible = val;
            },
            getMessage(val){
                this.showMessage = val;
                this.showPop(true);
            },
        }
    }
</script>
