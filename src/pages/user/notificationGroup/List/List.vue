<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Notification Groups" slot="title" />
        <div>
            <DataTable :actions="true"
                :data="groups"
                :columns="tableColumn"
                :is-loading="isLoading"
                @on-selection-change="selectChange"
            >
                <template slot="actionsLeft">
                    <TableButton @click="() => addGroup()">
                        <img src="../../../../assets/images/plus.png" />
                        Add
                    </TableButton>
                    <TableButton @click="() => viewGroup()">
                        <img src="../../../../assets/images/eye.png" />
                        View Members
                    </TableButton>
                    <TableButton @click="() => editGroup()">
                        <img src="../../../../assets/images/edit.png" />
                        Edit
                    </TableButton>
                    <TableButton @click="() => showDeleteModal(true)">
                        <img src="../../../../assets/images/del.png" />
                        Delete
                    </TableButton>
                </template>
            </DataTable>
        </div>

<!-- Delete Modal Popup -->
        <Popup title="Delete Group" :value="deleteModal.visible" :mask-closable="false" :closable="true" @close="() => showDeleteModal(false)">
            {{deleteModal.message}}
            <div slot="footer">
                <FormButton left-icon="ios-send" type="success" @click="() => deleteGroup()">Delete</FormButton>
                <FormButton left-icon="ios-close" @click="() => showDeleteModal(false)">Close</FormButton>
            </div>
        </Popup>

<!-- Message popup -->
        <Popup title="Information" :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.cancel" @click="() => showWarningModal(false)">Cancel</FormButton>
                <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
            </div>
        </Popup>

        <Popup title="Success" type="success" :value="successModal.visible" @close="() => successModal.visible = false" >
            {{ successModal.message }}
            <FormButton left-icon="ios-close" slot="footer" @click="() => successModal.visible = false">Close</FormButton>
        </Popup>

    </FormWrapper>
</template>

<script>
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import tableColumn from './table';
    import loadingMixin from 'Mixins/loadingMixin';
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import { getNotificationGroupList,deleteNotificationGroupUsers } from '../api';
    
    export default {
        name: "NotificationGroup",
        mixins: [ loadingMixin, validateSelectedRows],
        components: {
            FormWrapper,
            PageTitle,
            DataTable,
        },
        data() {
            return {
                warningModal: {
                    visible: false,
                    buttons: {
                        ok: true,
                        confirm: false,
                        cancel: false
                    }
                },
                deleteModal: {
                    visible: false,
                    message: 'Are you sure you want to delete this group ?'
                },
                successModal: {
                    visible: false,
                    message: ''
                },
                groups: [],
                tableData: [],
                tableColumn,
                selectedRows: [],
            }
        },
        created() {
            this.getData();
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        methods: {
            addGroup() {
                this.$router.push('/notificationGroup/add');
            },
            editGroup() {
                if(this.validateSelectedLength(1)){
                    this.$router.push(`/notificationGroup/edit/${this.selectedRows[0].id}`);
                }
            },
            viewGroup() {
                if(this.validateSelectedLength(1)){
                    this.$router.push(`/notificationGroup/view/${this.selectedRows[0].id}`);
                }
            },
            deleteGroup() {
                if(this.validateSelectedLength(1)){
                    var row = this.selectedRows[0];
                    deleteNotificationGroupUsers({group_id: row.id}).then(
                        res => {
                            this.getData();
                            this.showDeleteModal(false);
                            this.successModal.message = res.message;
                            this.successModal.visible = true;
                        }
                    )
                }
            },
            showDeleteModal(val) {
                if(this.validateSelectedLength(1)){
                    this.deleteModal.visible = val;
                }
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            search(){
                this.getData()
            },
            getData() {
                this.showLoader();
                
                getNotificationGroupList()
                    .then(this.handleResponse)
            },
            handleResponse(response) {
                this.hideLoader();
                this.groups = response.data; 
            },
        }
    }
</script>

<style lang="scss" module>
</style>
