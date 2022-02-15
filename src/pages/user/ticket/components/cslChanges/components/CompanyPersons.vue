<template>
    <div>
        <DataTable :actions="true"
            :data="personData"
            :columns="tableColumns"
        >
        </DataTable>
        <br />

        <Popup :value="popVisible" @close="showPopup2(false)" title="Person Info" width="900">
            
            <FormRow>
                <div class="col-sm-6">
                    <InputText label="Position for which applying" v-model="position" readonly />
                </div>
                <div class="col-sm-6">
                    <InputText label="Passport Number" v-model="showPersonalData.passportNumber" readonly />
                </div>
            </FormRow>
            
            <FormRow>
                <div class="col-sm-2">
                    <Salutation  v-model="showPersonalData.Salutation" readonly />
                </div>
                <div class="col-sm-5">
                    <InputText label="First Name" v-model="showPersonalData.Fname" readonly />
                </div>
                <div class="col-sm-5">
                    <InputText label="Last Name" v-model="showPersonalData.Lname" readonly />
                </div>
            </FormRow>

            <FormRow>
                <div class="col-sm-12">
                    <AddressInput label="Residential Address" v-model="showPersonalData.ResAddress_id" readonly />
                </div>
            </FormRow>
            
            <FormRow>
                <div class="col-sm-12">
                    <AddressInput label="Business Address" v-model="showPersonalData.BusinessAddress_id" readonly />
                </div>
            </FormRow>

            <FormRow>
                <div class="col-sm-4">
                    <InputTel label="Mobile" v-model="showPersonalData.Mobile" readonly />
                </div>
                
                <div class="col-sm-4">
                    <InputText label="Email" v-model="showPersonalData.Email" readonly />
                </div>
                
                <div class="col-sm-4">
                    <InputTel label="Fax" v-model="showPersonalData.Fax" readonly />
                </div>
            </FormRow>

                <FormRow>
                <div class="col-sm-6">
                    <InputText label="Occupation" v-model="showPersonalData.Occupation" readonly />
                </div>
                
                <div class="col-sm-6">
                    <InputText label="Nationality" v-model="showPersonalData.Nationality" readonly />
                </div>
                
            </FormRow>
            <FormRow v-if="showPersonalData.persontype === 13">
                <div class="col-sm-6">
                    <FormCheckbox readonly  name="IsNominee" v-model="showPersonalData.isNominee"><span >IsNominee </span></FormCheckbox>
                </div>
                
                <div class="col-sm-6">
                    <InputText label="Benefactor" v-model="showPersonalData.BeneficialOwner_id" />
                </div>
            </FormRow>
        </Popup>

        
    </div>
</template>

<script>
    
    import DataTable from 'Components/DataTable';
    import loadingMixin from 'Mixins/loadingMixin';
    import DateUtil from 'Utils/dateUtil';
    import NameCell from './NameCell';
    import { fetchPerson } from '../../../config/api';
    import Salutation from "Components/layout/salutation";
    import InputTel from 'Components/form/InputTel';
    import AddressInput from 'Components/form/addressInput/AddressInput';

    export default {
        name: "CompanyPersons",
        mixins: [loadingMixin,],
        components:{
            DataTable,
            Salutation,
            InputTel,
            AddressInput
        },
        props: {
            value: Object,
            personData: Array,
            readonly: Boolean,
        },
        data() {
            return {
                data: {
                    person_id: '',
                    ChangeType: null,
                    EffectiveDate: '',
                    ResignationReason: '',
                    Name:'',
                    ResidenceAddress:'',
                    pq_id: '',
                    persontype_id: '',
                },
                tableColumns: [
                    {
                        title: 'Name',
                        key: 'Name',
                        render:(h,params) =>{
                            return h(NameCell,{
                                props: {
                                    row: params.row,
                                    openPop: this.openPop
                                }
                            });
                        },
                        width: 120
                    },
                    {
                        title: 'Position',
                        key: 'Position',
                        // width: 120,
                    },
                    {
                        title: 'Change Type',
                        key: 'ChangeAction',
                        width: 100,
                    },
                    {
                        title: 'Resignation Reason',
                        key: 'ResignationReason',
                    },
                    {
                        title: 'Effective Date',
                        render: (h, params) => {
                            return h('span', DateUtil.formatDate(params.row.EffectiveDate));
                        },
                        align: 'left',
                        width: 100
                    }
                ],
                popVisible: false,
                showPersonalData:{},
                position: ''
            }
        },
        computed: {
            ticket() {
                return this.$store.state.ticket.ticket;
            },
        },
        methods: {
            openPop(row){
                fetchPerson({passportnumber: row.passportNumber}).then(
                    res => {
                        this.position = row.Position
                        this.showPersonalData = res.data[0];
                        this.showPopup2(true);
                    }
                )
            },
            showPopup2(val){
                this.popVisible = val;
            },
        }
    }
</script>
