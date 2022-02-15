<template>
    <div>
        <FormWrapper :is-loading="isLoading">
        <PageTitle title="Certificates" slot="title" />
         <div :class="$style.filter">
            <div :class="$style.filterItem">
                <FormSelect :width="200" label="Process Type" :items="filtering.processTypes" item-name="Name" item-value="id" v-model="filtering.processTypeSelected" />
            </div>
            <div :class="$style.filterItem" v-if="filtering.processTypeSelected">
                <FormSelect :width="200" label="Process Name" :items="filtering.processNames" item-name="Name" item-value="id" v-model="filtering.processNameSelected" />
            </div>
            <div :class="$style.filterItem" >
                <FormSelect :width="200" label="Entity Type" :items="filtering.entityTypes" item-name="Name" item-value="Name" v-model="filtering.entitySelected" />
            </div>
            <div :class="$style.filterItem" >
                <InputText :width="200" label="ID" v-model="filtering.ID" />
            </div>
            <FormButton style="margin-top: 5px" type="primary" @click="search" :rounded="true">
                <Icon type="ios-search" />
            </FormButton>
        </div>
        <DataTable :actions="true"
                   :data="certificates"
                   :columns="config"
                   :is-loading="isLoading"
                   @on-selection-change="selectChange"
                   @on-page-change="pageChange"
                   :pagination="pagination"
                   @on-sort-change="sortChange">
            <template slot="actionsLeft">
                <TableButton @click="() => addNew()">
                    <img src="../../../../../assets/images/plus.png" alt="">
                    Add
                </TableButton>
                <TableButton @click="() => pushTo('edit')">
                    <img src="../../../../../assets/images/edit.png" />
                    Edit
                </TableButton>
                <TableButton @click="() => pushTo('del')">
                    <img src="../../../../../assets/images/del.png" />
                    Delete
                </TableButton>
                <TableButton @click="() => pushTo('view')">
                    <img src="../../../../../assets/images/eye.png" />
                    View
                </TableButton>
            </template>
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

    </FormWrapper>
    </div>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import loadingMixin from 'Mixins/loadingMixin';
    import config from './table';
    import { getCertificateList, editCertificateByID, getEntityType, getProcessTypes, getProcesses, addCertificate, fetchCertificateByID, deleteCertificateByID } from '../api';

    export default {
        name: 'Certificates',
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle,
            DataTable
        },
        data(){
            return{
                filtering: {
                    processTypes: [],
                    processTypeSelected: null,
                    processNames: [],
                    processNameSelected: null,
                    entitySelected: null,
                    entityTypes: [],
                    ID: '',
                },
                sorting: {
                    key: 'id',
                    order: 'desc'
                },
                pagination: {
                    perPage: 10,
                    page: 1,
                    total: 0
                },
                warningModal: {
                    visible: false,
                    buttons: {
                        ok: true,
                        confirm: false,
                        cancel: false
                    }
                },
                tableData: [],
                config,
                selectedRows: null,
                certificates: [],
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        created() {
            this.getFilterValues();
            this.getDataByFilter();
        },
        watch: {
            'filtering.processTypeSelected': function (newValue) {
                if (newValue) {
                    this.showLoader();
                    getProcesses(newValue).then(res => {
                        this.hideLoader();
                        this.filtering.processNames = res.data
                    }).catch(this.hideLoader)
                }
            }
        },
        methods: {
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            getFilterValues() {
                this.showLoader();
                Promise.all([
                    getProcessTypes(),
                    getEntityType()
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.filtering.processTypes = response[0].data;
                this.filtering.entityTypes = response[1].data;
            },
            sortChange(data) {
                this.sorting.key = data.key;
                this.sorting.order = data.order;
                this.getDataByFilter()
            },
            pageChange(page) {
                this.pagination.page = page;
                this.getDataByFilter()
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            search(){
                this.pagination.page = 1;
                this.getDataByFilter()
            },
            getDataByFilter() {
                this.showLoader();
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;

                const filters = {};
                if(this.filtering.ID === ''){
                    filters.process_id = this.filtering.processNameSelected;

                }else{
                    filters.id = this.filtering.ID;
                }
                filters.EntityType = this.filtering.entitySelected;
                
                const data = {
                    user_id: this.userData.user_id,
                    filterjson: {
                        filter: [filters],
                        sort: [{ key, order }],
                        paging: [
                            {
                                startindex: perPage * (page - 1) + 1,
                                pagesize: perPage
                            }
                        ]
                    }
                };
                getCertificateList(data)
                    .then(this.handleResponse)
                    .catch(this.handleError)
            },
            handleResponse(response) {
                this.hideLoader();
                this.certificates = response.data[0];
                this.pagination.total = response.NumberOfRecords;
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
            pushTo(mode) {
                if (this.validateSelectedLength(1)) {
                    let id = this.selectedRows[0].ID; // allow only the first row
                    if( mode== 'edit' ){ // edit is clicked
                        this.$router.push({ path: `/certificates/edit/${id}` })
                    }else if( mode== 'del' ){
                        this.$router.push({ path: `/certificates/del/${id}` })
                    }else if( mode== 'view' ){
                        this.$router.push({ path: `/certificates/view/${id}` })
                    }
                }
            },
            addNew() {
                this.$router.push({ path: `/certificates/add` })
            },
        }
    }
</script>

<style lang="scss" module>

    .progress {
        margin: 0 20px;
        progress {
            width: 100%;
        }
    }

    .filter {
        margin: -10px 0 25px;
        display: flex;
        align-items: flex-end;
    }

    .filterItem {
        flex: 0 0 180px;
        margin-right: 20px;
    }

    .popupRow {
        padding: 5px 0 15px;
    }



</style>
