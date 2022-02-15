<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Name Transfer" slot="title" />
        <!-- <Loader v-if="transfer.isLoading" /> -->

        <ValidationObserver ref="transferValidator">
            <FormRow>
                <div class="col-sm-5">
                    <FormAutoComplete v-model="transfer.fromIcspName"
                        :onSearch="searchICSP"
                        :onSelect="selectICSP"
                        label="From Service Provider"
                        item-name="name"
                        item-value="name"
                        :clearable="true"
                        rules="required"
                        :items="transfer.fromIcspFiltered" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-3">
                    <FormSelect label="Select Name"
                        v-model="transfer.Name_id"
                        item-value="id"
                        item-name="CompanyName"
                        :items="transfer.names"
                        :maxlength="200"
                        rules="required"/>
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-5">
                    <FormAutoComplete v-model="transfer.toIcspName"
                        :onSearch="searchICSP1"
                        :onSelect="selectICSP1"
                        label="To Service Provider"
                        item-name="name"
                        item-value="name"
                        :clearable="true"
                        rules="required"
                        :items="transfer.toIcspFiltered" />
                </div>
            </FormRow>
            <ButtonGroup >
                <FormButton type="success" @click="transferHandler">Transfer</FormButton>
                <!-- <FormButton @click="() => showTransferModal(false)">Cancel</FormButton> -->
            </ButtonGroup>
        </ValidationObserver>

        <!-- Message Popup -->
        
        <Popup title="Success" type="success" :value="modalSuccess.visible" @close="() => showSuccessModal(false)">
            {{ modalSuccess.message }}
            <div slot="footer">
                <FormButton  @click="() => showSuccessModal(false)">Ok</FormButton>
            </div>
        </Popup>

    </FormWrapper>
</template>

<script>
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import { ValidationObserver } from "vee-validate";
    import loadingMixin from 'Mixins/loadingMixin';
    import {  searchICSPTypes, TransferName, getApprovedNames } from '../api';
    import FormAutoComplete from 'Components/form/FormAutoComplete';
    
    export default {
        mixins: [ loadingMixin ],
        components: {
            FormWrapper,
            PageTitle,
            ValidationObserver,
            FormAutoComplete
        },
        data () {
            return {
                filtering: {
                    ICSPResults: [],
                },
                transfer: {
                    title: 'Transfer',
                    mode: 'transfer',
                    Name_id: '',
                    FromIcsp_id: '',
                    ToIcsp_id: '',
                    fromIcspName: '',
                    toIcspName: '',
                    fromIcspFiltered: [],
                    toIcspFiltered: [],
                    entityName: '',
                    names: [],
                },
                transferModal: {
                    isLoading: false,
                    visible: false,
                },
                modalSuccess: {
                    visible: false,
                    message: '',
                    TicketReference: null,
                },
            }
        },
        created(){
            this.getFilterValues();
        },
        methods: {
            
            showSuccessModal(val){
                this.modalSuccess.visible = val;
            },
            transferHandler(){
                this.$refs.transferValidator.validate().then((result) => {
                    if(result){
                        const { Name_id, FromIcsp_id, ToIcsp_id } = this.transfer;
                        const data ={
                            Name_id, 
                            FromIcsp_id, 
                            ToIcsp_id
                        }
                        
                        this.transferModal.isLoading = true;
                        TransferName(data).then(
                            response => {
                                this.transferModal.isLoading = false;
                                // this.showTransferModal(false);
                                this.modalSuccess.message = response.message;
                                this.showSuccessModal(true);
                                this.transfer = {
                                    title: 'Transfer',
                                    mode: 'transfer',
                                    Name_id: '',
                                    FromIcsp_id: '',
                                    ToIcsp_id: '',
                                    fromIcspName: '',
                                    toIcspName: '',
                                    fromIcspFiltered: [],
                                    toIcspFiltered: [],
                                    entityName: '',
                                    names: [],
                                }
                            }
                        )
                    }
                })
            },
            selectICSP(name) {
                this.transfer.FromIcsp_id = this.transfer.fromIcspFiltered.find(item => item.name === name).id;
                getApprovedNames({icsp_id: this.transfer.FromIcsp_id, EntityType: 'IBC'}).then(
                    res => {
                        this.transfer.names = res.data;
                    }
                )
            },
            searchICSP(value) {
                if (value.length > 2) {
                    this.transfer.fromIcspFiltered = this.filtering.ICSPResults.filter(item => {
                        return item.name !== null ? item.name.toLowerCase().includes(value.toLowerCase()) : false;
                    })
                } else {
                    this.icspFiltered = []
                }
            },
            selectICSP1(name) {
                this.transfer.ToIcsp_id = this.transfer.toIcspFiltered.find(item => item.name === name).id;
            },
            searchICSP1(value) {
                if (value.length > 2) {
                    this.transfer.toIcspFiltered = this.filtering.ICSPResults.filter(item => {
                        return item.name !== null ? item.name.toLowerCase().includes(value.toLowerCase()) : false;
                    })
                } else {
                    this.icspFiltered = []
                }
            },
            getFilterValues() {
                this.showLoader();
                Promise.all([
                    searchICSPTypes({is_csp: true})
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.filtering.ICSPResults = response[0].data;
                this.hideLoader();
            },
            
        }
        
    }
</script>