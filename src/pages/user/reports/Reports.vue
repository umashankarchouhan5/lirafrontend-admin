<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Reports" slot="title" />

        <DataTable :actions="true"
            :data="tableData"
            :columns="tableColumn"
            :is-loading="isLoading"
            @on-selection-change="selectChange"
        >
            
            <!-- <template slot="actionsLeft">
                <TableButton >
                    <img src="../../../../assets/images/view.png" alt="">
                    View
                </TableButton>
            </template> -->
        </DataTable>

<!-- Message popup -->
        <Popup title="Information" :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.cancel" @click="() => showWarningModal(false)">Cancel
                </FormButton>
                <FormButton v-if="warningModal.buttons.confirm" type="success" @click="confirmDelete">Confirm
                </FormButton>
                <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
            </div>
        </Popup>
        <Popup title="Success" type="success" :value="successModal.isVisible" @close="() => successModal.isVisible = false"  :closable="true">
            {{ successModal.message }}
        </Popup>
        
    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    // import InputDate from 'Components/form/InputDate';
    import tableColumn from './table';
    import loadingMixin from 'Mixins/loadingMixin';
    import { getReportsByDepartmentId } from './api';

    export default {
        name: "Reports",
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle,
            DataTable,
            // InputDate,
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
                successModal: {
                    isVisible: false,
                    message: '',
                },
                tableData: [],
                tableColumn,
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        created() {
          this.getData();
        },
        methods: {
            
            getData() {
                this.showLoader();
                getReportsByDepartmentId().then(this.handleResponse)
            },
            handleResponse(response){
                this.tableData = response.data;
                this.hideLoader();
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            validateSelectedLength(value) {
                if (this.selectedRows.length === value) {
                    return true;
                }
                if (value === 1 && this.selectedRows.length !== 1) {
                    this.warningModal.message = 'Select one row please.';
                    this.showWarningModal(true);
                    return false
                }
                if (this.selectedRows.length === 0) {
                    this.warningModal.message = 'Select at least one row!';
                    this.showWarningModal(true);
                    return false
                }
                return true;
            },

        }
    }
</script>

<style lang="scss" module>

    .filter {
        margin: -10px 0 25px;
        display: flex;
        align-items: flex-end;
    }

    .filterItem {
        flex: 0 0 180px;
        margin-right: 20px;
    }
    .filterItemMedium {
        flex: 0 0 100px;
        margin-right: 20px;
    }
    .filterItemSmall {
        flex: 0 0 50px;
        margin-right: 20px;
    }

    .popupRow {
        padding: 5px 0 15px;
    }
    
    .checkbox {
        margin-bottom: 10px;
    }
    
    .checkboxText{
        text-align: justify;
        font-size: 14px;
        color: #555;
    }



</style>
