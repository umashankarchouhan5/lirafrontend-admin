<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Wallet Transaction History" slot="title" />
        <div :class="$style.filter">
            <div :class="$style.filterItem">
                <InputText v-model="filtering.walletCode" label="Wallet Code" />
            </div>
            <div :class="$style.filterItem">
                <InputText v-model="filtering.CompanyName" label="Company Name" />
            </div>
            
            <div :class="$style.filterItem">
                <FormButton style="margin-top: 5px" type="primary" @click="search" :rounded="true">
                    <Icon type="ios-search" />
                </FormButton>
            </div>
        </div>
        <DataTable :actions="true"
                :data="clientList"
                :columns="config"
                :is-loading="isLoading"
                @on-selection-change="selectChange"
                @on-page-change="pageChange"
                :pagination="pagination"
                @on-sort-change="sortChange">
            <template slot="actionsLeft">
                <TableButton @click="() => openHistory()">
                    <img src="../../../../assets/images/eye.png" />
                    View Wallet Transaction History
                </TableButton>
                <TableButton @click="() => openUpdateBalance()" >
                    <img src="../../../../assets/images/plus.png" />
                    Add Balance
                </TableButton>
                <TableButton @click="checkBalance">
                    <img src="../../../../assets/images/CheckBalance.png" alt="">
                    Check Balance
                </TableButton>
            </template>
        </DataTable>
<!-- Message popup -->
        <Popup title="Information" :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.cancel" @click="() => showWarningModal(false)">Cancel</FormButton>
                <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
            </div>
        </Popup>
        <Popup title="Add Client Balance" :value="updateBalanceModal.visible" @close="() => showUpdateBalanceModal(false)">
            
            <ValidationObserver ref="balance"> 
                <InputAmount v-model="openingBalance" rules="required" label="Amount in USD" />
            </ValidationObserver>
            <div slot="footer">
                <FormButton type="success" @click="() => balanceUpdate()">Add Balance</FormButton>
                <FormButton @click="() => showUpdateBalanceModal(false)">Cancel</FormButton>
            </div>
        </Popup>
        
        <Popup :value="successModal.isVisible" type="success" title="Success" @close="() => successModal.isVisible = false">
            {{successModal.message}}
            <ButtonGroup slot="footer">
                <FormButton @click="() => successModal.isVisible = false">Close</FormButton>
            </ButtonGroup>
        </Popup>
    </FormWrapper>
</template>

<script>
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import config from './table';
    import loadingMixin from 'Mixins/loadingMixin';
    import { fetchCustomerCodeList,updateWalletCodeNOpeningBalance, checkWalletBalance } from '../api';
    import { ValidationObserver } from "vee-validate"; 
    
    export default {
        name: "ClientBalances",
        mixins: [loadingMixin],
        data() {
            return {
                filtering: {
                    CompanyName: '',
                    walletCode: null,
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
                successModal: {
                    isVisible: false,
                    message: '',
                },
                updateBalanceModal: {
                    visible: false,

                },
                clientList: [],
                tableData: [],
                config,
                selectedRows: [],
                openingBalance: '',
            }
        },
        created() {
          this.getDataByFilter();
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
            ValidationObserver
        },
        methods: {
            openHistory(){
                if (this.validateSelectedLength(1)) {
                    const row = this.selectedRows[0]; 
                    this.$router.push(`/clientLedger/${row.WalletCode}`)
                }
            },
            showUpdateBalanceModal(val){
                this.updateBalanceModal.visible = val;
            },
            openUpdateBalance(){
                if (this.validateSelectedLength(1)) {
                    this.showUpdateBalanceModal(true)
                }
            },
            checkBalance(){
                if (this.validateSelectedLength(1)) {
                    const row = this.selectedRows[0];
                    this.showLoader();
                    checkWalletBalance({wallet_code:row.WalletCode}).then(
                        res => {
                            const msg = 'USD '+parseFloat(res.data.balance).toFixed(2)+' is the balance of '+res.data.wallet_code+' - '+row.CompanyName;
                            this.successModal.message = msg;
                            this.showSuccessModal(true);
                            this.hideLoader();
                        }
                    )
                    }
            },
            showSuccessModal(val){
                this.successModal.isVisible = val;
            },
            balanceUpdate(){
                this.$refs.balance.validate().then(
                    result => {
                        if(result){
                            const row = this.selectedRows[0]; 
                            const data = {
                                openingBalance: this.openingBalance,
                                walletCode: row.WalletCode,
                                license_id: row.License_id
                            }
                            updateWalletCodeNOpeningBalance(data).then(
                                res => {
                                    this.getDataByFilter();
                                    this.showUpdateBalanceModal(false);
                                    this.openingBalance = '';
                                    this.successModal.message = 'Balance updated successfully.'
                                    this.successModal.isVisible = true;
                                }
                            )
                        }
                    }
                )

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
                // const { perPage, page } = this.pagination;
                const perPage = this.pagination.perPage;
                const page = this.pagination.page;
                const filters = {};

                filters.walletCode = this.filtering.walletCode;
                filters.CompanyName = this.filtering.CompanyName;

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
                fetchCustomerCodeList(data)
                    .then(this.handleResponse)
            },
            handleResponse(response) {
                this.hideLoader();
                this.clientList = response.data[0];
                this.pagination.total = response.NumberOfRecords;
            },
            showWarningModal(value) {
                this.warningModal.visible = value;
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
