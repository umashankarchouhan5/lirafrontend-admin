<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Suspension of License" slot="title" />
            
        <div :class="$style.filter">
            <div :class="$style.filterItem">
                <FormSelect :width="200" label="Status" :items="filtering.statuses" item-name="name" item-value="id" v-model="filtering.status_id"  />
            </div> 
            <div :class="$style.filterItem">
                <FormSelect :width="200" label="Officers" :items="filtering.officers" item-name="Name" item-value="id" v-model="filtering.officer_id"  />
            </div> 
        </div>
        <br />
        <div :class="$style.filter">
            <div :class="$style.filterItem">
                <FormAutoComplete v-model="filtering.ICSPSelectedName"
                    :onSearch="searchICSP"
                    :onSelect="selectICSP"
                    :onClear="clearICSP"
                    label="Service Provider"
                    item-name="name"
                    item-value="name"
                    :clearable="true"
                    :items="filtering.ICSPResultsFiltered" />
            </div>
            <div :class="$style.filterItem">
                <InputDate :width="200" label="Select Date Range" type="daterange" v-model="filtering.dates"  />
            </div> 
            <FormButton style="margin-top: 5px" type="primary" @click="search" :rounded="true">
                <Icon type="ios-search" />
            </FormButton>
         </div>
        <DataTable :actions="true"
            :data="directions"
            :columns="config"
            :is-loading="isLoading"
            @on-selection-change="selectChange"
            @on-page-change="pageChange"
            :pagination="pagination"
            @on-sort-change="sortChange">
            
            <template slot="actionsLeft">
                <TableButton @click="() => addNew()">
                    <img src="../../../../assets/images/plus.png" alt="">
                    Add
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
        <Popup title="Generate Notice" :value="noticeModal.visible" @close="() => showNoticeModal(false)">
            {{ noticeModal.message }}
            <div slot="footer">
                <FormButton @click="() => showNoticeModal(false)">Ok</FormButton>
                <FormButton @click="() => showNoticeModal(false)">Cancel
                </FormButton>
            </div>
        </Popup>
        
        <Popup :value="modals.success.isVisible" :closable="true" :mask-closable="true" type="success" title="Success"
                @close="() => modals.success.isVisible = false">
                {{modals.success.message}}
            <ButtonGroup slot="footer">
                <FormButton @click="modals.success.isVisible = false">Ok</FormButton>
            </ButtonGroup>
        </Popup>
    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import InputDate from 'Components/form/InputDate';
    import FormAutoComplete from 'Components/form/FormAutoComplete';
    import config from './table';
    import loadingMixin from 'Mixins/loadingMixin';
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import { getCompanyStatus, getCessationList, searchICSPTypes, getAdminUserList, getStrikeOffReason } from '../api'

    export default {
        name: "Suspension",
        mixins: [loadingMixin, validateSelectedRows],
        components: {
            FormWrapper,
            PageTitle,
            DataTable,
            InputDate,
            FormAutoComplete,
        },
        props: {
        },
        data() {
            return {
                filtering: {
                    status_id: null,
                    license_id: null,
                    ICSPSelectedID: null,
                    officer_id: null,
                    dates: '',
                    statuses: [],
                    icsps: [],
                    officers: [],
                    process_id: null,
                },
                sorting: {
                    key: 'id',
                    order: 'asc'
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
                modals: {
                    success: {
                        isVisible: false,
                        message: '',
                    }
                },
                
                noticeModal: {
                    visible: false,
                    message: 'Confirm to generate notice.'
                },
                directions: [],
                tableData: [],
                config,
                selectedRows: [],
                document_id: null,
                companies: [],
                isSelected: false,
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
            menu(){
                return this.$store.state.menu.menu;
            },
            processId() {
                return this.$store.state.common.currentProcessId
            },
        },
        created() {
            
            this.getFilterValues();
            this.getDataByFilter();
            if(this.menu !== undefined && this.menu !== null && this.menu.length !== 0){
                this.$store.commit('setProcessId', this.getProcessIdFormMenu());
            }
        },
        watch: {
        },
        methods: {
            getProcessIdFormMenu(){
                const selected = this.menu.find(ele => {
                    return ele.id == '5'
                });
                if(selected !== undefined){
                    const process_id = selected.submenu.find(item => {
                        return item.name.includes('Suspension');
                    }).process_id;
                    return process_id;
                }
                else{
                    return 421;
                }
            },
            addNew(){
                this.$router.push(`/suspension/${this.processId}`);
            },
            shoeNoticeModal(val){
                this.noticeModal.visible = val;
            },
            openNotice(){
                if(this.validateSelectedLength(1)){
                    this.shoeNoticeModal(true)
                }
            },
            showEmailModal(val){
                this.emailPopup = val
            },
            
            clearICSP(){
                this.filtering.ICSPSelectedID = null;
                this.filtering.ICSPResultsFiltered = null;
            },
            selectICSP(name) {
                this.filtering.ICSPSelectedID = this.filtering.ICSPResultsFiltered.find(item => item.name === name).id;
            },
            searchICSP(value) {
                if (value.length > 2) {
                    this.filtering.ICSPResultsFiltered = this.filtering.icsps.filter(item => {
                        return item.name.toLowerCase().includes(value.toLowerCase());
                    })
                } else {
                    this.filtering.ICSPResultsFiltered = []
                }
                if(value === ''){
                    this.filtering.ICSPSelectedID = null;
                }
            },
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            getFilterValues() {
                this.showLoader();
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;
                const data = {
                    user_id: this.userData.user_id,
                    filterjson: {
                        filter: [{Department_id: this.userData.department_id}],
                        sort: [{ key, order }],
                        paging: [
                            {
                                startindex: perPage * (page - 1) + 1,
                                pagesize: 30
                            }
                        ]
                    }
                };
                Promise.all([
                    getAdminUserList(data),
                    getCompanyStatus(),
                    searchICSPTypes({department_id: this.userData.department_id}),
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.filtering.officers = response[0].data[0];
                this.filtering.statuses = response[1].data;
                this.filtering.icsps = response[2].data;
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

                filters.department_id = this.userData.department_id;
                filters.status_id = this.filtering.status_id;
                filters.license_id = this.filtering.ICSPSelectedID;
                filters.officer_id = this.filtering.officer_id;
                filters.DateFrom = this.filtering.dates[0];
                filters.DateTo = this.filtering.dates[1];
                filters.process_id= this.processId;

                const data = {
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
                getCessationList(data)
                    .then(this.handleResponse)
                    .catch(this.hideLoader())
            },
            handleResponse(response) {
                this.hideLoader();
                this.directions = response.data[0];
                this.pagination.total = response.NumberOfRecords;
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

    .popupRow {
        padding: 5px 0 15px;
    }



</style>
