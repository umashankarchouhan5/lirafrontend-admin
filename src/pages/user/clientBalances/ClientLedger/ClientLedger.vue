<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Wallet Transaction History" slot="title" />

        <TicketHeader v-if="ticketValue && clientLedger.length !== 0" :ticketValue="ticketValue" />

        <div :class="$style.filter">
            
            <div :class="$style.filterItem">
                <InputDate label="Select Date Range" type="daterange" v-model="filtering.dates" />
            </div>
            <div :class="$style.filterItem">
                <FormButton style="margin-top: 5px" type="primary" @click="search" :rounded="true">
                    <Icon type="ios-search" />
                </FormButton>
            </div>
            
        </div>
        <DataTable :actions="true"
                :data="clientLedger[0]"
                :columns="config"
                :is-loading="isLoading">
        </DataTable>
<!-- Message popup -->
        <Popup title="Information" :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.cancel" @click="() => showWarningModal(false)">Cancel</FormButton>
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
    import { fetchClientLedger } from '../api'
    import InputDate from 'Components/form/InputDate';
    
    export default {
        name: "ClientLedger",
        mixins: [loadingMixin],
        data() {
            return {
                filtering: {
                    dates: '',
                },
                warningModal: {
                    visible: false,
                    buttons: {
                        ok: true,
                        confirm: false,
                        cancel: false
                    }
                },
                clientLedger: [],
                config,
                selectedRows: [],
            }
        },
        created() {
          this.getData();
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
            ticketValue() {
                if(this.clientLedger.length !== 0){
                    return {
                        First: this.$route.params.walletCode,
                        Second: this.clientLedger[1][0].clientName,
                        Third: ''
                    }
                }
                return false
            }
        },
        components: {
            FormWrapper,
            PageTitle,
            DataTable,
            InputDate
        },
        methods: {
            search(){
                this.getData()
            },
            getData() {
                this.showLoader();

                const data = {
                    walletCode: this.$route.params.walletCode,
                    DateFrom: this.filtering.dates[0],
                    DateTo: this.filtering.dates[1]
                };
                fetchClientLedger(data)
                    .then(this.handleResponse)
            },
            handleResponse(response) {
                this.hideLoader();
                if(response.data[0].length > 0){
                    // console.log(response.data);
                    var list = response.data[0].map( ele => {
                        if(ele.Deposit=='.00') {
                            ele.Deposit = '';
                        }
                        if(ele.withdrawal=='.00') {
                            ele.withdrawal = '';
                        }
                        return ele;
                    })
                }
                else{
                    var list = [];
                }
                this.clientLedger = response.data;
            },
            showWarningModal(value) {
                this.warningModal.visible = value;
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
