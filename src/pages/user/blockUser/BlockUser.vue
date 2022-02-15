<template>
    <FormWrapper>
        <PageTitle title="Block/Restrict User" slot="title" />
        <DataTable :actions="true"
            :data="icspList"
            :columns="tableColumn"
            :is-loading="isLoading"
            @on-selection-change="selectChange"
        >
            
            <template slot="actionsLeft">
                <TableButton @click="() => blockUser()">
                    <img src="../../../assets/images/edit.png" alt="">
                    Block
                </TableButton>
                <TableButton @click="() => restricUser(1)">
                    <img src="../../../assets/images/edit.png" alt="">
                    Restrict
                </TableButton>
                <TableButton @click="() => restricUser(0)">
                    <img src="../../../assets/images/edit.png" alt="">
                    UnRestrict
                </TableButton>
            </template>
        </DataTable>
        <Popup :value="modals.success.isVisible" title="Success" type="success">
            {{ modals.success.message }}
            <FormButton slot="footer" @click="modals.success.isVisible = false">Ok</FormButton>
        </Popup>
        <br>
    </FormWrapper>
</template>

<script>

    import { restrictLicensee, blockLicensee, searchICSPTypes } from './api';
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import tableColumn from './table';
    import loadingMixin from 'Mixins/loadingMixin';
    import validateSelectedRows from 'Mixins/validateSelectedRows';

    export default {
        name: "Block User",
        mixins: [loadingMixin, validateSelectedRows],
        data() {
            return {
                icspList: [],
                tableColumn,
                selectedRows: [],
                warningModal: {
                    visible: false,
                    buttons: {
                        ok: true,
                        confirm: false,
                        cancel: false
                    }
                },
                modals: {
                    success: {
                        isVisible: false,
                        message: '',
                    }
                },
            }
        },
        components: {
            FormWrapper,
            PageTitle,
            DataTable
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
        },
        created() {
            this.getList()
        },
        methods: {
            restricUser(val){
                if(this.validateSelectedLength(1)){
                    restrictLicensee({enforcement_id: this.selectedRows[0].license_id,restrict: val}).then(
                        res=> {
                            this.getList();
                            this.selectedRows = [];
                            this.modals.success.message = 'Successful .'
                            this.modals.success.isVisible = true;
                        }
                    );
                }
            },
            blockUser(){
                if(this.validateSelectedLength(1)){
                    blockLicensee({enforcement_id: this.selectedRows[0].license_id}).then(
                        res=> {
                            this.getList();
                            this.selectedRows = [];
                            this.modals.success.message = 'Successful .'
                            this.modals.success.isVisible = true;
                        }
                    );
                }
            },
            
            selectChange(data) {
                this.selectedRows = data;
            },
            getList(){
                searchICSPTypes({department_id: this.userData.department_id}).then(
                    res => {
                        this.icspList = res.data
                    }
                )
            }
        }
    }
</script>
<style lang="scss" module>
</style>