<template>
    <div>
        <FormWrapper :is-loading="isLoading">
        <PageTitle title="Users Activities" slot="title" />
        <div :class="$style.filter">
            <div :class="$style.filterItem">
                <InputDate style="width: 200px" label="Select Date Range" type="daterange" v-model="filtering.dates"/>
            </div>
            <div :class="$style.filterItem" >
                <FormSelect :width="200" label="Users" :items="filtering.users" item-name="fullname" item-value="id" v-model="filtering.userSelected" :clearable="false" />
            </div>
            <div :class="$style.filterItem">
                <FormButton type="primary" @click="getDataByFilter" :rounded="true">
                    <Icon type="ios-search" />
                </FormButton>
            </div>
        </div>
        <div>

            <DataTable :actions="true"
                :data="activities"
                :columns="config"
                :is-loading="isLoading"
                @on-selection-change="selectChange"
                @on-page-change="pageChange"
                :pagination="pagination"
                @on-sort-change="sortChange">
            </DataTable>

        </div>

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

        
        <Popup title="Success" type="success" :value="successModal.visible" @close="() => showSuccessModal(false)">
            {{successModal.message}}
            <div slot="footer">
                <FormButton  @click="() => showSuccessModal(false)">Close</FormButton>
            </div>
        </Popup>

    </FormWrapper>
    </div>
</template>

<script>

    //import { ValidationObserver } from 'vee-validate'
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import loadingMixin from 'Mixins/loadingMixin';
    import InputDate from "Components/form/InputDate";
    import config from './table';
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import { getUsersActivity, getWebUsers } from '../api';

    export default {
        name: 'UserActivity',
        mixins: [loadingMixin, validateSelectedRows],
        components: {
            FormWrapper,
            PageTitle,
            DataTable,
            InputDate,
        },
        data(){
            return{
                form: {
                    daterange: '',
                },
                warningModal: {
                    visible: false,
                    buttons: {
                        ok: true,
                        confirm: false,
                        cancel: false
                    }
                },
                activities: [],
                config,
                isVisible: false,
                successModal: {
                    visible: false,
                    message: '',
                },
                filtering: {
                    id: null,
                    dates: [],
                    userSelected: null,
                    users: [], 
                },
                pagination: {
                    perPage: 10,
                    page: 1,
                    total: 0
                },
                sorting: {
                    key: 'created_at',
                    order: 'desc'
                },
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        created() {
            this.getDataByFilter();
        },
        watch: {
            
        },
        methods: {
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            getDataByFilter() {
                this.showLoader();
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;
                const filters = {};
                
                filters.DateFrom = this.filtering.dates[0];
                filters.DateTo = this.filtering.dates[1];
                filters.user_id = this.filtering.userSelected;
            
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
                if(this.userData.is_Department_head) {
                     Promise.all([
                        getWebUsers(),
                        getUsersActivity(data),
                    ]).then(this.handleResponse)
                } else {
                    this.activities = [];
                    this.isLoading=false;
                }
                
            },
            handleResponse(response) {
                this.filtering.users = response[0].data;
                this.activities = response[1].data;
                this.isLoading=false;
                this.pagination.total = response[1].NumberOfRecords;
            },
            pageChange(page) {
                this.pagination.page = page;
                this.getDataByFilter()
            },
            sortChange(data) {
                this.sorting.key = data.key;
                this.sorting.order = data.order;
                this.getDataByFilter()
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            selectMenuChange(data) {
                this.selectedUsers = data;

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
            validateSelectedMenuLength(value) {
                if (this.selectedUsers.length === value) {
                    return true;
                }
                if (value === 1 && this.selectedRoles.length !== 1) {
                    this.warningModal.message = 'Select one row please.';
                    this.showWarningModal(true);
                    return false
                }
                if (this.selectedRoles.length === 0) {
                    this.warningModal.message = 'Select at least one row!';
                    this.showWarningModal(true);
                    return false
                }
                return true;
            },
            showActionModal(val){
                this.isVisible = val;
            },
            showSuccessModal(val){
                this.successModal.visible = val;
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
    .popPadding{
        padding: 10px 20px;
    }



</style>
