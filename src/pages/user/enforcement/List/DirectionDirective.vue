<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Enforcement Action" slot="title" />
            
        <div :class="$style.filter">
            <div :class="$style.filterItem">
                <FormSelect :width="200" label="Enforcement Status " :items="filtering.statuses" item-name="name" item-value="id" v-model="filtering.status_id"  />
            </div> 
            <!-- <div :class="$style.filterItem">
                <FormSelect :width="200" label="Officers" :items="filtering.officers" item-name="Name" item-value="id" v-model="filtering.officer_id"  />
            </div>  -->
            <div :class="$style.filterItem">
                <FormSelect :width="200" label="Select Type of Enforcement Action" :items="filtering.enforcementTypes" item-name="Name" item-value="id" v-model="filtering.enforcementType_id"  />
            </div> 
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
                <InputDate type="daterange" :width="200" label="Select Date Range" v-model="filtering.dates"  />
            </div> 
            <FormButton style="margin-top: 5px" type="primary" @click="search" :rounded="true">
                <Icon type="ios-search" />
            </FormButton>
         </div>
        <DataTable :actions="true"
            :data="directions"
            :columns="tableColumn"
            :is-loading="isLoading"
            @on-selection-change="selectChange"
            @on-page-change="pageChange"
            :pagination="pagination"
            @on-sort-change="sortChange"
            :rowClassName="rowClassName"
            :noStripe="true"
            :legends="legends"
        >
            
            <template slot="actionsLeft">
                <TableButton @click="() => addNew()">
                    <img src="../../../../assets/images/plus.png" alt="">
                    Add
                </TableButton>
                <TableButton @click="() => edit()">
                    <img src="../../../../assets/images/edit.png" alt="">
                    Edit
                </TableButton>
                <TableButton @click="() => followUp()">
                    <img src="../../../../assets/images/edit.png" alt="">
                    Follow Up
                </TableButton>
                <TableButton @click="() => deleteEnfo()">
                    <img src="../../../../assets/images/del.png" alt="">
                    Delete
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
    import tableColumn from './table';
    import loadingMixin from 'Mixins/loadingMixin';
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import { getCompanyStatus, getDirectiveList, searchICSPTypes, getAdminUserList, getEnforcementType, deleteEnforcement } from '../api';

    export default {
        name: "DirectiveAndDirection",
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
                    officer_id: null,
                    ICSPSelectedID: null,
                    type: null,
                    dates: '',
                    statuses: [],
                    icsps: [],
                    officers: [],
                    enforcementType_id: null,
                    enforcementTypes: [],
                    types: [
                        {
                            name: 'Direction',
                            val: 'Direction'
                        },
                        {
                            name: 'Directive',
                            val: 'Directive'
                        },
                    ]
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
                directions: [],
                tableData: [],
                tableColumn,
                selectedRows: [],
                document_id: null,
                companies: [],
                isSelected: false,
                print: null,
                attachment: [],
                legends: [
                    {color:'turquoise', text: 'Intended Enforcement Action'}
                ]
            }
        },
        created() {
            
            this.getFilterValues();
            this.getDataByFilter();
            // this.getProcessIdFormMenu();
        },
        watch: {
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
            menu(){
                return this.$store.state.menu.menu;
            }
        },
        methods: {
            rowClassName (row, index) {
                if (row.isIntent === 1) {
                    return this.$style.classBackground;
                } 
                return '';
            },
            getProcessIdFormMenu(){
                const selected = this.menu.find(ele => {
                    return ele.id == '2018'
                });
                if(selected !== undefined){
                    const process_id = selected.submenu.find(item => {
                        return item.URL == '/directive'
                    }).process_id;
                    return process_id;
                }
                else{
                    return 1501;
                }
            },
            addNew(){
                this.$store.commit('setProcessId', this.getProcessIdFormMenu());
                this.$router.push(`/directiveForm/${this.getProcessIdFormMenu()}`);
            },
            edit(){
                if(this.validateSelectedLength(1)){
                    if(this.selectedRows[0].isDraft === 1){
                        this.$store.commit('setProcessId', this.getProcessIdFormMenu());
                        this.$router.push(`/directiveForm/${this.getProcessIdFormMenu()}/${this.selectedRows[0].reference_id}`)
                    }
                    else{
                        this.warningModal.message = 'This enforcement action cannot be edited.';
                        this.showWarningModal(true);
                    }
                }
            },
            followUp() {
                if(this.validateSelectedLength(1)){
                    this.$store.commit('setProcessId', this.getProcessIdFormMenu());
                    this.$router.push(`/directiveFormFollowup/${this.getProcessIdFormMenu()}/${this.selectedRows[0].reference_id}`);
                }
            },
            deleteEnfo(){
                if(this.validateSelectedLength(1)){
                    deleteEnforcement({enforcement_id: this.selectedRows[0].reference_id}).then(
                        res=> {
                            this.getDataByFilter();
                            this.selectedRows = [];
                            this.modals.success.message = 'The selected record has been deleted.'
                            this.modals.success.isVisible = true;
                        }
                    );
                }
            },
            clearICSP(){
                this.filtering.ICSPSelectedID = null;
                this.filtering.ICSPResultsFiltered = null;
            },
            selectICSP(name) {
                this.filtering.ICSPSelectedID = this.filtering.ICSPResultsFiltered.find(item => item.name === name).license_id;
            },
            searchICSP(value) {
                if (value.length > 2) {
                    this.filtering.ICSPResultsFiltered = this.filtering.icsps.filter(item => {
                        return item.name !== null ? item.name.toLowerCase().includes(value.toLowerCase()) : false;
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
                    getEnforcementType(),
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.filtering.officers = response[0].data[0];
                this.filtering.statuses = response[1].data;
                this.filtering.icsps = response[2].data;
                this.filtering.enforcementTypes = response[3].data[0];
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
                filters.type = this.filtering.type;
                filters.license_id = this.filtering.ICSPSelectedID;
                filters.complianceStatus = null;
                filters.officer_id = this.filtering.officer_id;
                filters.DateFrom = this.filtering.dates[0];
                filters.DateTo = this.filtering.dates[1];
                filters.enforcementType_id = this.filtering.enforcementType_id;

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
                getDirectiveList(data)
                    .then(this.handleResponse)
                    .catch(this.handleError)
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
    .classBackground {
        td{
            background-color: turquoise;
            color: #000000;
            &:hover{
                transition: all 0.2s ease-out;
                td{
                    transition: all 0.2s ease-out;
                    color: #000000
                }
            }
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
