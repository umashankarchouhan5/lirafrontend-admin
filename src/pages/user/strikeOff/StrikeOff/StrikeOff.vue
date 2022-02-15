<template>
    <FormWrapper >
        <PageTitle title="Strike Off" slot="title" />
        <ValidationObserver ref="validator">
            <FormRow>
                <div class="col-sm-3" v-if="$route.params.id" >
                    <InputText readonly
                        v-model="company.EntityType"
                        label="Entity Type"
                        rules="required" />
                </div>
                <div class="col-sm-3" v-else>
                    <FormSelect :disabled="readonly"
                        v-model="company.EntityType"
                        :items="entityTypes"
                        label="Entity Type"
                        item-name="Name"
                        item-value="Name"
                        rules="required" />
                </div>
                <div class="col-sm-3">
                    <InputText rules="required" label="Reg #" :disabled="readonly || !entitySelected || ($route.params.id? true: false)" v-model="company.CompanyRegNo" @keyup.native="searchByRegNo" @focusout="searchByRegNoTab" />
                </div>
                <div class="col-sm-6">
                    <FormAutoComplete
                        :disabled="readonly || !entitySelected || ($route.params.id? true: false)"
                        label="Entity Name"
                        rules="required"
                        v-model="company.Name"
                        :onChange="onSearchName"
                        :items="companies"
                        item-value="Name"
                        item-name="Name"
                        :onSelect="onSelectCompanyByName" />
                </div>
            </FormRow>
            
            <FormRow>
                <div class="col-sm-4" >
                    <FormSelect  label="Select Status" :items="statuses" :disabled="readonly" item-name="name" item-value="id"  v-model="form.status_id"  />
                </div> 
            </FormRow>
            <FormRow>
                <div class="col-sm-4" >
                    <FormSelect  label="Select Reason" :items="reasons" :disabled="readonly" item-name="Name" item-value="id"  v-model="form.reason_id"  />
                </div> 
            </FormRow>
            <!-- <FormRow >
                <div class="col-sm-12">
                    <InputTextArea :readonly="readonly" label="Reason" rows="5"  v-model="form.cessationReason"  />
                </div>
            </FormRow> -->
            <FormRow >
                <div class="col-sm-12">
                    <InputTextArea :readonly="readonly" label="Comments" rows="3" :maxlength="500" v-model="form.comments"  />
                </div>
            </FormRow>
            <FormButton @click="submitData()">Strike Off</FormButton>
        </ValidationObserver>
        <Popup :value="modals.success.isVisible" :closable="true" :mask-closable="false" type="success" title="Submitted Successfully"
                @close="() => modals.success.isVisible = false">
                {{modals.success.message}}
            <!-- <p>Your complaint has been submitted. Your reference # is <strong>{{ ticketReference }}</strong></p> -->
            <ButtonGroup slot="footer">
                <FormButton @click="backToList">Back</FormButton>
            </ButtonGroup>
        </Popup>
    </FormWrapper>
</template>

<script>

    import FormAutoComplete from 'Components/form/FormAutoComplete';
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import { CESSATION  } from 'Config/processIds';
    import { getStrikeOffReason, getCompany, getCompanyStatus, strikeOffByAdminUser, getStrikeOffList, fetchEntityTypeByDepartment } from '../api';
    import { ValidationObserver } from "vee-validate";

    export default {
        name: "StrikeOff",
        components: {
            FormAutoComplete,
            FormWrapper,
            PageTitle,
            ValidationObserver
        },
        data() {
            return {
                entitySelected: false,
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                entityTypes: [{Name: 'IBC'},{Name: 'Foundation'}],
                statuses: [],
                companies: [],
                company: {
                    EntityType: null,
                    Name: '',
                    CompanyRegNo: '',
                },
                isSelected: false,
                reasons: [],
                form: {
                    reason_id: null,
                    reference_id: 0,
                    comments: '',
                    status_id: null
                },
                readonly: false,
                
                sorting: {
                    key: 'id',
                    order: 'asc'
                },
                pagination: {
                    perPage: 10,
                    page: 1,
                    total: 0
                },
                modals: {
                    success: {
                        isVisible: false, 
                        message: '',
                    }
                },
            }
        },
        computed: {
            processId() {
                return this.$store.state.common.currentProcessId;
            },
            userData() {
                return this.$store.state.user.user;
            },
        },
        watch: {
            'company.EntityType': function(val){
                if(val !== null && val !== undefined){
                    this.entitySelected = true;
                }else{
                    this.entitySelected = false;
                    this.resetCompany();
                    this.resetCompanies();
                }
            },
            'company.CompanyRegNo': function (val) {
                if(val === ''){
                    this.isSelected = false;
                }
            },
            'company.Name': function (val) {
                if(val === '' || val === null || val === undefined){
                    this.isSelected = false;
                }
            },
        },
        created() {
            this.getData();
            if(this.$route.params.id){
                this.getDataByFilter();
            }

        },
        methods: {
            
            backToList() {
                this.modals.success.isVisible = false;
                this.$router.push('/strikeOff');
            },
            getDataByFilter() {
                // this.showLoader();
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;

                const filters = {};

                filters.company_id = parseInt(this.$route.params.id);
                filters.EntityType = '';
                filters.icsp_id = null;
                filters.reason_id = null;
                filters.status_id = null;

                const data = {
                    // user_id: this.userData.user_id,
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
                getStrikeOffList(data)
                    .then(this.handleDataResponse)
                    .catch(this.handleError)
            },
            handleDataResponse(response) {
                // this.hideLoader();
                this.form = response.data[0][0];
                this.company.company_id = this.form.company_id;
                this.company.EntityType = this.form.entityType;
                this.company.CompanyRegNo = this.form.companyRegNo;
                this.company.Name = this.form.companyname;
            },
            submitData(){
                const data = {
                    company_id: this.company.company_id,
                    ...this.form
                }
                strikeOffByAdminUser(data).then(
                    res => {
                        this.modals.success.message = 'Your request is saved.';
                        this.modals.success.isVisible = true;
                    }
                )
            },
            getData(){
                Promise.all([
                    getStrikeOffReason({process_id: CESSATION}),
                    this.getEntityListHandler(),
                    getCompanyStatus()
                ]).then(this.handleResponse)
            },
            handleResponse(response) {
                this.reasons = response[0].data;
                this.entityTypes = response[1].data;
                this.statuses = response[2].data;
            },
            selectReason(id){
                if(id !== undefined && id !== null ){
                    this.form.cessationReason = this.reasons.find( ele => ele.id === id).description 
                }else{
                    this.form.cessationReason = '';
                }
            },
            getEntityListHandler() {
                return fetchEntityTypeByDepartment({
                        department_id: this.userData.department_id,
                        subEntity: 1
                    })
            },
            searchByRegNoTab() {
                
                if (!this.isSelected && this.company.CompanyRegNo != '') {
                    const { CompanyRegNo } = this.company;
                    const { EntityType } = this.company;
                    getCompany({
                        EntityType: EntityType,
                        Name: '',
                        RegNo: CompanyRegNo,
                        process_id: this.processId,
                        ICSP_id: this.userData.icsp_id
                    }).then(res => {
                        if (res.data[0] && res.data[0].length > 0) {
                            this.company = res.data[0][0];
                            this.form.company_id = this.company.id
                            this.form.Address_id = this.company.Address_id;
                            this.isSelected = true;
                        }
                    })
                }
            },
            searchByRegNo(event) {
                if(event.keyCode === 13){
                    if (!this.isSelected) {
                        const { CompanyRegNo } = this.company;
                        const { EntityType } = this.company;
                        getCompany({
                            EntityType: EntityType,
                            Name: '',
                            RegNo: CompanyRegNo,
                            process_id: this.processId,
                            ICSP_id: this.userData.icsp_id
                        }).then(res => {
                            if (res.data[0] && res.data[0].length > 0) {
                                this.company = res.data[0][0];
                                this.form.company_id = this.company.id
                                this.isSelected = true;
                            }
                        })
                    }
                }
            },
            onSelectCompanyByName(value) {
                this.company = this.companies.find(item => item.Name === value);
                this.form.company_id = this.company.id;
                this.isSelected = true;
            },
            reset() {
                if(!this.readonly){
                    this.resetCompany();
                    this.entityTypes = [];
                    this.companies = [];
                    this.isSelected = false;
                    this.form.address_id = null;
                }
            },
            resetCompany() {
                if(!this.readonly){
                    this.company = {
                        EntityType: null,
                        Name: '',
                        CompanyRegNo: '',
                    };
                }
            },
            validateQuery(value) {
                return value.length >= 3
            },
            resetCompanies() {
                this.companies = [];
            },
            onSearchName(val) {
                if (this.validateQuery(val) && !this.isSelected && !this.readonly) {
                    this.resetCompanies();
                    this.searchForCompany(val);
                }
            },
            searchForCompany(Name) {
                const { EntityType } = this.company;
                getCompany({
                    EntityType,
                    Name,
                    RegNo: '',
                    process_id: this.processId,
                    ICSP_id: this.userData.icsp_id
                }).then(res => {
                    this.companies = res.data[0];
                })
            },
        }
    }
</script>

<style lang="scss" module>


    .error {
        color: #ff3547;
        position: absolute;
        max-width: 100%;
        left: 0;
        font-size: 11px;
        line-height: 13px;
        bottom: -15px;
        font-weight: 400;
    }

</style>
