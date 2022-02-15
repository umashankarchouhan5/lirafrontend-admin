<template>
    <!-- <PageSimple> -->
        <FormWrapper :is-loading="isLoading">
            <PageTitle title="Web Users List" slot="title" :pdf="generatePdf" v-if="showPdf"/>
            <PageTitle title="Web Users List" slot="title" v-else/>
            <div :class="$style.filter">
                <div :class="$style.filterItem">
                    <InputText v-model="filtering.email" label="Email" />
                </div>
                <!-- <div :class="$style.filterItem">
                    <InputText v-model="filtering.RegNo" label="Registration No." />
                </div>
                <div :class="$style.filterItem">
                    <FormSelect :width="200" label="Status" :items="filtering.status" item-name="name" item-value="id" v-model="filtering.statusSelected" />
                </div>
                <div :class="$style.filterItem">
                    <FormSelect :width="200" label="Entity Type" :items="filtering.entityTypes" item-name="Name" item-value="Name" v-model="filtering.entityTypeSelected"  />
                </div> -->
                <div :class="$style.filterItem">
                    <FormSelect :width="200" label="Licensee" :items="filtering.ICSP" item-name="name" item-value="id" v-model="filtering.icspSelected" />
                </div>
                <!-- <div :class="$style.filterItem">
                    <InputDate label="Select Dates" type="daterange" v-model="filtering.dates" />
                </div> -->
                <div :class="$style.filterItem">
                    <FormButton style="margin-top: 5px" type="primary" @click="search" :rounded="true">
                        <Icon type="ios-search" />
                    </FormButton>
                </div>
            </div>
            <DataTable :actions="true"
                    :data="users"
                    :columns="config"
                    :is-loading="isLoading"
                    @on-selection-change="selectChange"
                    @on-page-change="pageChange"
                    :pagination="pagination"
                    @on-sort-change="sortChange" v-if="users.length>0 || isSearched==true">
                <template slot="actionsLeft">
                    <TableButton @click="block">
                        Block
                    </TableButton>
                    <TableButton @click="restrict(1)">
                        Restrict
                    </TableButton>
                    <TableButton @click="restrict(0)" >
                        Unrestrict
                    </TableButton>
                </template>
                <!-- <template slot="actionsRight">
                    <TableButton @click="() => exportExcel()" v-if="showExcel">
                        <img src="../../../../assets/images/Excel_Icon.png" alt="">
                        Export Excel
                    </TableButton>
                </template> -->
            </DataTable>
    <!-- Message popup -->
            <Popup title="Information" :value="warningModal.visible" @close="() => showWarningModal(false)">
                {{ warningModal.message }}
                <div slot="footer">
                    <FormButton v-if="warningModal.buttons.cancel" @click="() => showWarningModal(false)">Cancel</FormButton>
                    <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
                </div>
            </Popup>
            <Popup title="Information" :value="warningModalRestrict.visible" @close="() => showWarningModalRestrict(false)">
                {{ warningModalRestrict.message }}
                <div slot="footer">
                    <FormButton v-if="warningModalRestrict.buttons.confirm" type="success" @click="() => sendRestrict()">Confirm</FormButton>
                    <FormButton v-if="warningModalRestrict.buttons.cancel" @click="() => showWarningModalRestrict(false)">Cancel</FormButton>
                </div>
            </Popup>
            <Popup title="Information" :value="warningModalMessage.visible" @close="() => showWarningModalMessage(false)">
                {{ warningModalMessage.message }}
                <div slot="footer">
                    <FormButton v-if="warningModalMessage.buttons.ok" type="success" @click="() => showWarningModalMessage(false)">Ok</FormButton>
                    <FormButton v-if="warningModalMessage.buttons.confirm" type="success" @click="() => sendRestrict()">Confirm</FormButton>
                    <FormButton v-if="warningModalMessage.buttons.cancel" @click="() => showWarningModalMessage(false)">Cancel</FormButton>
                </div>
            </Popup>
            <Popup title="Information" :value="warningModalBlock.visible" @close="() => showWarningModalBlock(false)">
                {{ warningModalBlock.message }}
                <div slot="footer">
                    <FormButton v-if="warningModalBlock.buttons.confirm" type="success" @click="() => sendBlock()">Confirm</FormButton>
                    <FormButton v-if="warningModalBlock.buttons.cancel" @click="() => showWarningModalBlock(false)">Cancel</FormButton>
                </div>
            </Popup>
            <Popup :value="successModal.visible" :title="successModal.title" type="success" :closable="false" :maskable="false" @close="() => successModal.visible = false">
                <div>
                    {{ successModal.message }}
                </div>
                <div slot="footer">
                    <FormButton @click="() => showSuccessModal(false)">Ok</FormButton>
                </div>
            </Popup>
        </FormWrapper>
    <!-- </PageSimple> -->
</template>

<script>
    // import PageSimple from 'Components/layout/user/PageSimple';
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    // import InputDate from 'Components/form/InputDate';
    import config from './table';
    import loadingMixin from 'Mixins/loadingMixin';
    import { getWebuserForAdmin, restrictWebusers, getICSP, blockWebusers, getCompanies, fetchEntityTypeByDepartment } from '../api'
    
    export default {
        name: "Company",
        mixins: [loadingMixin],
        data() {
            return {
                filtering: {
                    ICSP: [],
                    icspSelected: null,
                    email: null,
                },
                viewLog: 0,
                isSearched: false,
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
                warningModalRestrict: {
                    visible: false,
                    buttons: {
                        ok: false,
                        confirm: true,
                        cancel: true
                    }
                },
                warningModalBlock: {
                    visible: false,
                    buttons: {
                        ok: false,
                        confirm: true,
                        cancel: true
                    }
                },
                warningModalMessage: {
                    visible: false,
                    buttons: {
                        ok: true,
                        confirm: false,
                        cancel: false
                    }
                },
                successModal: {
                    visible: false,
                    title: 'Success',
                    message: ''
                },
                users: [],
                tableData: [],
                config,
                selectedRows: [],
                showExcel: false,
                showPdf: false,
                selected: [],
                restrictRows: false,
            }
        },
        created() {
          this.getFilterValues();
        //   this.getDataByFilter();
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        components: {
            FormWrapper,
            PageTitle,
            DataTable,
            // InputDate,
            // PageSimple,
        },
        methods: {
            sendBlock() {
                this.warningModalBlock.visible = false;
                const restrict = this.restrictRows;
                const data = {users:this.selected, restrict:restrict};
                blockWebusers(data)
                    .then(this.handleResponseBlock)
            },
            handleResponseBlock(response) {
                this.selected = [];
                this.successModal.message = response.message;
                this.successModal.visible = true;
                this.getDataByFilter();
            },
            sendRestrict() {
                this.warningModalRestrict.visible = false;
                const restrict = this.restrictRows;
                const data = {users:this.selected, restrict:restrict};
                restrictWebusers(data)
                    .then(this.handleResponseRestricted)
            },
            handleResponseRestricted(response) {
                this.selected = [];
                this.successModal.message = response.message;
                this.successModal.visible = true;
                this.getDataByFilter();
            },
            getFilterValues() {
                this.showLoader();
                Promise.all([
                    getICSP({department_id: this.userData.department_id}),
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.filtering.ICSP = response[0].data.filter(item => {
                        return item.name !== null;
                    })
                this.hideLoader();
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
                // this.showLoader();
                const { key, order } = this.sorting;
                // const { perPage, page } = this.pagination;
                const perPage = this.pagination.perPage;
                const page = this.pagination.page;
                const filters = {};

                filters.email = this.filtering.email;
                filters.ICSP_id = this.filtering.icspSelected;
                
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
                getWebuserForAdmin(data)
                    .then(this.handleResponse)
            },
            handleResponse(response) {
                this.hideLoader();
                this.isSearched = true;
                this.users = response.data;
                if(this.users.length > 0){
                    var list = this.users.map( ele => {
                        ele.Name = ele.Fname + ' ' + ele.Lname;
                        if(ele.isRestricted==1) {
                            ele.isRestricted = 'Yes';
                        } else {
                            ele.isRestricted = 'No';
                        }
                        return ele;
                    })
                }
                else{
                    var list = [];
                }
                this.users = list;
                this.pagination.total = response.NumberOfRecords;
                if (response.pdf_visibility==1) {
                    this.showPdf = true;    
                }
                if (response.excel_visibility==1) {
                    this.showExcel = true;
                }
            },
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            showSuccessModal(value) {
                this.successModal.visible = false;
            },
            showWarningModalRestrict(value) {
                this.warningModalRestrict.visible = value;
            },
            showWarningModalMessage(value) {
                this.warningModalMessage.visible = value;
            },
            showWarningModalBlock(value) {
                this.warningModalBlock.visible = value;
            },
            validateSelectedLength(value) {
                if (this.selectedRows.length === value) {
                    return true;
                }
                if (this.selectedRows.length === 0) {
                    this.warningModal.message = 'Select at least one row!';
                    this.showWarningModal(true);
                    return false
                }
                if (value === 1 && this.selectedRows.length !== 1) {
                    this.warningModal.message = 'Select one row please.';
                    this.showWarningModal(true);
                    return false
                }
                return true;
            },
            render(mode){
                if (this.validateSelectedLength(1)) {
                    let id = this.selectedRows[0].id; // allow only the first row
                    this.$router.push({ path: `/company/${mode}/${id}` })
                }
            },
            log(){
                if (this.validateSelectedLength(1)) {
                    const row = this.selectedRows[0];
                    this.$router.push(`/company/companyLog/${row.id}`);
                }
            },
            restrict(value){
                if (this.selectedRows.length>0) {
                    const rows = this.selectedRows;
                    for (let item of rows) {
                        this.selected.push({'id':item['id']});
                    }
                    if (value==1) {
                        if(this.selectedRows[0].isRestricted=="No") {
                            this.warningModalRestrict.visible = true;
                            this.warningModalRestrict.message = 'Are you sure you want to restrict selected user(s).';
                            this.restrictRows = true;
                        } else {
                            this.warningModalMessage.message = 'User is restricted.';
                            this.showWarningModalMessage(true);
                        }   
                    } else {
                        if(this.selectedRows[0].isRestricted=="Yes") {
                            this.warningModalRestrict.visible = true;
                            this.warningModalRestrict.message = 'Are you sure you want to unrestrict selected user(s).';
                        } else {
                            this.warningModalMessage.message = 'User is not restricted.';
                            this.showWarningModalMessage(true);
                        }
                        this.restrictRows = false;
                        
                    }
                    
                } else {
                    this.warningModal.visible = true;
                    this.warningModal.buttons.ok = true;
                    this.warningModal.message = 'Please select alteast one row!'
                } 
            },
            block(){
                if (this.selectedRows.length>0) {
                    const rows = this.selectedRows;
                    for (let item of rows) {
                        this.selected.push({'id':item['id']});
                    }
                    this.warningModalBlock.visible = true;
                    this.warningModalBlock.message = 'Are you sure you want to block selected user(s).';    
                } else {
                    this.warningModal.visible = true;
                    this.warningModal.buttons.ok = true;
                    this.warningModal.message = 'Please select alteast one row!'
                } 
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
        max-width: 1000px;
        flex-wrap: wrap;
        align-items: flex-end;
    }
    .filterItem {
         flex: 0 0 200px;
        margin: 0 20px 20px 0;
    }
    .popupRow {
        padding: 5px 0 15px;
    }
</style>
