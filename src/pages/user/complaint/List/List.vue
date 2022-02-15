<template>
<FormWrapper :is-loading="isLoading">
    <PageTitle title="Complaints" slot="title" />
    
    <ValidationObserver ref="validator" >
        <div :class="$style.filter">
            <div :class="$style.filterItem">
                <FormSelect label="Status" :width="200" :items="filtering.statuses" item-name="name" item-value="id" v-model="filtering.status_id" />
            </div>
            <div :class="$style.filterItem">
                <FormSelect label="Complaint Mode" :items="filtering.complaintModes" item-name="Name" item-value="id" v-model="filtering.ComplaintMode" />
            </div>
            <div :class="$style.filterItem">
                <FormSelect label="Department" :width="200" :items="filtering.departments" item-name="Name" item-value="id" v-model="filtering.Department_id" />
            </div>
            <div :class="$style.filterItem">
                <InputText v-model="filtering.TicketReference" label="# Reference"  rules="alphaNumCustom" />
            </div>
        </div>
        <div :class="$style.filter">

            
            <div :class="$style.filterItemExpanded">
                <InputText v-model="filtering.Email" label="Email" />
            </div>
            <div :class="$style.filterItemShort">
                <FormCheckbox v-model="filtering.isResolved" :trueValue="1" :falseValue="0">
                    Is Resolved
                </FormCheckbox>
            </div>

            <FormButton style="margin-top: 5px" type="primary" @click="search" :rounded="true">
                <Icon type="ios-search" />
            </FormButton>
        </div>
    </ValidationObserver>
    <br />
    <DataTable :actions="true" :data="complaints" :columns="config" :is-loading="isLoading" @on-selection-change="selectChange" @on-page-change="pageChange" :pagination="pagination" @on-sort-change="sortChange">
        <template slot="actionsLeft">
            <TableButton @click="addComplaint()">
                <img src="../../../../assets/images/plus.png" />
                Add
            </TableButton>
            <!-- <TableButton @click="editComplaint()">
                <img src="../../../../assets/images/edit.png" />
                Edit
            </TableButton> -->
            <TableButton @click="viewComplaint()">
                <img src="../../../../assets/images/eye.png" />
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
</template>

<script>
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import config from './table';
    import loadingMixin from 'Mixins/loadingMixin';
    import {
        fetchComplaintList,
        getComplaintMode,
        getDepartmentList,
        getCompanyStatusList
    } from '../api'
    import { ValidationObserver } from 'vee-validate'

    const editableIds = [40, 43, 45, 260];

export default {
    name: "ComplaintsGrid",
    mixins: [loadingMixin],
    components: {
        FormWrapper,
        PageTitle,
        DataTable,
        ValidationObserver
    },
    data() {
        return {
            filtering: {
                statuses: [],
                status_id: null,
                departments: [],
                Department_id: null,
                complaintModes: [],
                ComplaintMode: null,
                TicketReference: null,
                TempRef: null,
                isResolved: '',
                Mobile: '',
                Email: ''
            },
            sorting: {
                key: 'updated_at',
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
            complaints: [],
            tableData: [],
            config,
            selectedRows: null,
            document_id: null,
        }
    },
    created() {
        this.getFilterValues();
        this.getDataByFilter();
    },
    watch: {

    },
    computed: {
        userData() {
            return this.$store.state.user.user
        }
    },
    methods: {
        viewComplaint() {
            if (this.validateSelectedLength(1)) {
                this.$router.push(`/complaintView/${this.selectedRows[0].Complaint_id}`);
            }

        },
        editComplaint() {
            if (this.validateSelectedLength(1)) {
                const row = this.selectedRows[0];
                if (row.ComplaintMode !== 147 && editableIds.includes(row.status_id)) {
                    this.$router.push(`/complaintForm/${row.Complaint_id}`);
                } else {
                    this.warningModal.message = "This complaint is not editable";
                    this.showWarningModal(true);

                }

            }
        },
        addComplaint() {
            this.$router.push('/complaintForm');
        },
        showWarningModal(value) {
            this.warningModal.visible = value;
        },
        getFilterValues() {
            this.showLoader();
            Promise.all([
                getCompanyStatusList(),
                getComplaintMode(),
                getDepartmentList(),
            ]).then(this.handleFilterValues)
        },
        handleFilterValues(response) {
            this.filtering.statuses = response[0].data;
            this.filtering.complaintModes = response[1].data;
            this.filtering.departments = response[2].data;
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
        search() {
            this.pagination.page = 1;
            this.getDataByFilter()
        },
        getDataByFilter() {
            
            setTimeout(() => {
                this.$refs.validator.validate().then((result) => {
                    if (result ) {
                        this.showLoader();
                        const {
                            key,
                            order
                        } = this.sorting;
                        const {
                            perPage,
                            page
                        } = this.pagination;

                        const filters = {};

                        // Ignore other filters if we have Document Brief
                        const {
                            TicketReference,
                            status_id,
                            Department_id,
                            ComplaintMode,
                            isResolved,
                            Email
                        } = this.filtering;

                        if (TicketReference) {
                            filters.TicketReference = TicketReference
                        } else {
                            filters.status_id = status_id;
                            filters.Department_id = Department_id;
                            filters.ComplaintMode = ComplaintMode;
                            filters.isResolved = isResolved;
                            filters.Email = Email;
                        }

                        const data = {
                            user_id: this.userData.user_id,
                            filterjson: {
                                filter: [filters],
                                sort: [{
                                    key,
                                    order
                                }],
                                paging: [{
                                    startindex: perPage * (page - 1) + 1,
                                    pagesize: perPage
                                }]
                            }
                        };
                        fetchComplaintList(data)
                            .then(this.handleResponse)
                            .catch(this.handleError)
                    }
                })
            },
            50
            )
        },
        handleResponse(response) {
            this.hideLoader();
            this.complaints = response.data[0];
            this.pagination.total = response.NumberOfRecords;
        },
        validateSelectedLength(value) {

            if (value === 1 && this.selectedRows.length !== 1) {
                this.warningModal.message = 'Select one row please.';
                this.showWarningModal(true);
                return false
            }
            if (this.selectedRows.length === value) {
                return true;
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
    .filterItemShort {
        flex: 0 0 140px;
        margin-right: 20px;
    }
    .filterItemExpanded {
        flex: 0 0 240px;
        margin-right: 20px;
    }

    .popupRow {
        padding: 5px 0 15px;
    }
</style>
