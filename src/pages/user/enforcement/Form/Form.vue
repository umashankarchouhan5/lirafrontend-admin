<template> 
        <FormWrapper :is-loading="isLoading">
            <PageTitle title="Enforcement Action" slot="title"/>
            <ValidationObserver ref="validator">
                <FormRow>
                    <div class="col-sm-4" >
                        <FormSelect label="License Type" id="licensee_type" :items="filtering.entityList" :disabled="filtering.entityList.length === 0 || readonly" item-name="longName" item-value="Name" rules="required"  v-model="form.licenseType" :onChange="resetCompany" />
                    </div> 
                </FormRow>
                <FormRow>
                    <div class="col-sm-2" >
                        <InputText rules="required" label="Reg #" :readonly="form.licenseType === null || form.licenseType === undefined || readonly"  v-model="filtering.RegNo" @keyup.native="searchByRegNo" @focusout="searchByRegNoTab" />
                    </div>
                    <div class="col-sm-6" >
                        <FormAutoComplete
                            label="Licensee Name"
                            rules="required"
                            :width="300"
                            :disabled="form.licenseType === null || form.licenseType === undefined || readonly"
                            v-model="form.CompanyName"
                            :onChange="onSearchName"
                            :items="companies"
                            item-value="CompanyName"
                            item-name="CompanyName"
                            :onSelect="onSelectCompanyByName" />
                    </div>
                </FormRow>
                    
                <FormRow>
                    <div class="col-sm-3">
                        <FormSelect label="Select Type of Enforcement Action" :items="filtering.enforcementTypes" item-name="Name" item-value="id" v-model="form.enforcementType_id" :disabled="readonly" :rules="{required: this.isDraftSave == true ? false: true }" />
                    </div> 
                    <div class="col-sm-9">
                        <FormRow>
                            <div class="col-sm-3" style="maxWidth:150px;width:150px;">
                                <p>Is Intent</p>
                            </div>
                            <div class="col-sm-6">
                                <InputYesNo v-model="form.isIntent" :Yes="1" :No="0" name="Is Intent" :rules="{required: this.isDraftSave == true ? false: true }" />
                            </div>
                        </FormRow>
                    </div>   
                </FormRow>
                <FormRow>
                    <div class="col-sm-12">
                        <InputTextArea label="Applicable Section" rows="1" :readonly="readonly" maxlength="100" v-model="form.applicableSection" :rules="{required: this.isDraftSave == true ? false: true }"  />
                    </div>   
                </FormRow>

                <FormRow>
                    <div class="col-sm-12">
                        <InputTextArea label="Ground(s) for enforcement" rows="1" :readonly="readonly" maxlength="100" v-model="form.ground" :rules="{required: this.isDraftSave == true ? false: true }"  />
                    </div>   
                </FormRow>

                <FormRow>
                    <div class="col-sm-12">
                        <InputTextArea label="Other Notes" :readonly="readonly" rows="3" v-model="form.description" :rules="{required: this.isDraftSave == true ? false: true }"  />
                    </div>   
                </FormRow>
                <FormRow>
                    <div class="col-sm-3">
                        <InputDate label="Deadline to Comply" :options="options" v-model="form.deadline" :readonly="readonly" :rules="{required: this.isDraftSave == true ? false: true }" />
                    </div>
                </FormRow>
                <FormRow v-if="!readonly">
                    <div class="col-sm-12">
                        <ButtonGroup>
                            <FormButton
                                    left-icon="md-checkmark-circle-outline"
                                    type="success"
                                    @click="submitData(0)"
                                    >
                                Submit
                            </FormButton>
                            <FormButton
                                    left-icon="md-checkmark-circle-outline"
                                    type="success"
                                    @click="submitData(1)"
                                    >
                                Save as Draft
                            </FormButton>
                            <FormButton
                                    left-icon="md-close"
                                    type="primary"
                                    @click="$router.push('/directive')"
                                    >
                                Cancel
                            </FormButton>
                        </ButtonGroup>
                    </div>
                </FormRow>
            </ValidationObserver>


            <Popup :value="modals.success.isVisible" :closable="true" :mask-closable="false" type="success" title="Submitted Successfully"
                   @close="() => modals.success.isVisible = false">
                   {{modals.success.message}}
                <ButtonGroup slot="footer">
                    <FormButton @click="backToList">Back</FormButton>
                </ButtonGroup>
            </Popup>
        </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DateUtil from 'Utils/dateUtil';
    import { ValidationObserver } from "vee-validate"; 
    import InputDate from 'Components/form/InputDate';
    import loadingMixin from 'Mixins/loadingMixin';
    import FormAutoComplete from 'Components/form/FormAutoComplete';
    import { fetchEntityTypeByDepartment, getCompany, directiveByAdminUser, fetchEnforcementbyId, getEnforcementType, getLicenseeList, generateProcessTicket } from '../api';

    export default {
        name: "DirectionAndDirectiveForm",
        mixins: [ loadingMixin ],
        components: {
            FormWrapper,
            PageTitle,
            ValidationObserver,
            InputDate,
            FormAutoComplete
        },
        data() {
            return {
                filtering: {
                    entityList: [],
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
                    ],
                    RegNo: '',
                },
                companies: [],
                isSelected: false,
                form:{
                    CompanyName: '',
                    licenseType: null,
                    ground: '',
                    deadline: '',
                    company_id: null,
                    license_id: null,
                    applicableSection: '',
                    description: '',
                    reference_id: 0,
                    process_id: 1501,
                    isIntent: 0,
                    enforcementType_id: null,
                },
                ticketReference: null,

                modals: {
                    success: {
                        isVisible: false, 
                        message: '',
                    }
                },
                
                documents: {
                    additional: []
                },
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() < Date.now();
                    }
                },
                print: null,
                readonly: false,
                sorting: {
                    key: 'id',
                    order: 'desc'
                },
                pagination: {
                    perPage: 10,
                    page: 1,
                    total: 0
                },
                isDraftSave: false,
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        watch: {
            'form.licenseType': function (newValue) {
                if (newValue === '' || newValue === undefined || newValue === null) {
                    this.resetCompany();
                    this.resetCompanies();
                }
            },
            'filtering.RegNo': function (newValue) {
                if ( newValue == '') {
                    this.resetCompany();
                    this.resetCompanies();
                }
            },
            'form.CompanyName': function (newValue) {
                if ( newValue == '' ) {
                    this.resetCompany();
                    this.resetCompanies();
                }
            },
            'form.enforcementType_id': function (val) {
                if(val !== null && val !== undefined) {
                    if(this.filtering.enforcementTypes.length > 0){
                        this.form.applicableSection = this.filtering.enforcementTypes.filter( item => {
                            return val == item.id;
                        })[0].ApplicableSection;
                    }
                }
            }
        },
        created() {
            this.getFilterData();
            this.form.process_id = parseInt(this.$route.params.processId);
            this.$store.commit('setProcessId', this.form.process_id);
            if(this.form.process_id == 1501 || this.form.process_id == 1502 || this.form.process_id == 1503 || this.form.process_id == 1504 || this.form.process_id == 1505){
                
            }else{
                this.$router.push('/directive')
            }
        },
        methods: {
            getDirectiveDataById(){
                fetchEnforcementbyId({enforcement_id: parseInt(this.$route.params.id)}).then(
                    res => {
                        this.form = res.data[0];
                        this.filtering.RegNo = res.data[0].companyRegNo;
                        this.form.CompanyName = res.data[0].Licensee;
                        this.form.process_id = parseInt(this.$route.params.processId);
                        this.form.reference_id = parseInt(this.$route.params.id);
                        if(this.form.status_id === 402){
                            this.readonly = true;
                        }
                        if(this.$route.params.id && this.$route.name == 'DirectiveFormFollowUpByID'){
                            this.form.parent_id = parseInt(this.$route.params.id);
                            this.form.reference_id = 0;
                        }
                        this.hideLoader();
                    }
                ).catch(this.hideLoader);
            },
            getFilterData(){
                this.showLoader();
                Promise.all([
                    fetchEntityTypeByDepartment({department_id: this.userData.department_id,csl: 0 }),
                    getEnforcementType(),
                ]).then(this.getDataHandler)
            },
            getDataHandler(res){
                this.filtering.entityList = res[0].data;
                this.filtering.enforcementTypes = res[1].data[0];
                // if(this.$route.params.id && this.$route.name !== 'DirectiveFormFollowUpByID'){
                //     this.getDirectiveDataById();
                // }
                // else if(this.$route.params.id && this.$route.name == 'DirectiveFormFollowUpByID'){
                //     this.form.parent_id = parseInt(this.$route.params.id);
                //     this.hideLoader();
                // }
                if(this.$route.params.id ){
                    this.getDirectiveDataById();
                }
                else{
                    this.hideLoader();
                }
            },
            submitData(val){
                if(val == 1){
                    this.isDraftSave = true;
                }
                if(val == 0){
                    this.isDraftSave = false;
                }
                setTimeout(() => {
                    this.$refs.validator.validate().then(result => {
                    if (result) {
                        this.showLoader();
                        const data = {
                            ...this.form,
                            isDraft: val,
                            license_id: this.form.license_id,
                            CompanyName: this.form.CompanyName
                        };
                        directiveByAdminUser(data).then((res) => {
                            this.hideLoader();
                            this.form = {
                                CompanyName: '',
                                licenseType: null,
                                ground: '',
                                deadline: '',
                                company_id: null,
                                license_id: null,
                                applicableSection: '',
                                description: '',
                                reference_id: 0,
                                process_id: parseInt(this.$route.params.processId),
                                isIntent: 0,
                                enforcementType_id: null,
                            }
                            // this.isDraftSave = false;
                            if(val == 1){
                                this.modals.success.message = 'Enforcement action has been saved.';
                                this.modals.success.isVisible = true;
                            }
                            else if(val == 0){
                                generateProcessTicket({reference_id: res.data[0].reference_id, process_id: this.form.process_id}).then(
                                    response => {
                                        this.modals.success.message = `Your ticket with reference ${response.data[0].TicketReference} is generated.`;
                                        this.modals.success.isVisible = true;
                                    })
                                }
                            }).catch(() => {
                                this.hideLoader();
                            })   
                        }
                    })
                }, 300)
                
            },
            backToList() {
                this.modals.success.isVisible = false;
                setTimeout(() => {
                    this.$router.push('/directive');
                },100);
            },

            // licensee selection
            searchByRegNoTab() {
                if (!this.isSelected) {
                    const { RegNo } = this.filtering;
                    const { licenseType } = this.form;
                    const { key, order } = this.sorting;
                    const { perPage, page } = this.pagination;

                    const filters = {};
                    filters.licenseType = licenseType;
                    filters.RegNo = RegNo;

                    const data = {
                        user_id: this.userData.user_id,
                        type: "licensee",
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
                    }
                    if (RegNo ) {
                        getLicenseeList(data).then(res => {
                            if (res.data[0] && res.data[0].length > 0) {
                                var company = res.data[0][0];
                                this.form.license_id = company.License_id;
                                this.form.company_id = company.Company_id
                                // this.form.licenseType = company.LicenseType;
                                this.form.CompanyName = company.CompanyName;
                                this.filtering.RegNo = company.RegNo;
                                this.isSelected = false;
                            }
                        })
                        
                    }
                }
            },
            searchByRegNo(event) {
                if(event.keyCode === 13){
                    if (!this.isSelected) {
                        const { RegNo } = this.filtering;
                        const { licenseType } = this.form;
                        const { key, order } = this.sorting;
                        const { perPage, page } = this.pagination;

                        const filters = {};
                        filters.licenseType = licenseType;
                        filters.RegNo = RegNo;

                        const data = {
                            user_id: this.userData.user_id,
                            type: "licensee",
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
                        }
                        if (RegNo ) {
                            getLicenseeList(data).then(res => {
                                if (res.data[0] && res.data[0].length > 0) {
                                    var company = res.data[0][0];
                                    this.form.license_id = company.License_id;
                                    this.form.company_id = company.Company_id
                                    // this.form.licenseType = company.LicenseType;
                                    this.form.CompanyName = company.CompanyName;
                                    this.filtering.RegNo = company.RegNo;
                                    this.isSelected = false;
                                }
                            })
                            
                        }
                    }
                }
            },
            onSelectCompanyByName(value) {
                var company = this.companies.find(item => item.CompanyName === value);
                this.form.company_id = company.Company_id;
                this.form.license_id = company.License_id;
                this.form.CompanyName = company.CompanyName;
                this.filtering.RegNo = company.RegNo;

                this.isSelected = true;
            },
            resetCompany() {
                if(!this.readonly){
                    // this.form.licenseType = null;
                    this.form.CompanyName = '';
                    this.filtering.RegNo ='';
                    this.form.company_id = null;
                    this.form.license_id = 0;
                }
            },
            validateQuery(value) {
                return value.length >= 3
            },
            resetCompanies() {
                this.companies = [];
            },
            onSearchName(val) {
                if (this.validateQuery(val) && !this.isSelected) {
                    this.resetCompanies();
                    this.searchForCompany(val);
                }
                this.isSelected = false;
            },
            searchForCompany(Name) {
                // const { licenseType } = this.form;
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;

                const filters = {};
                filters.licenseType = this.form.licenseType;
                filters.Name = Name;

                const data = {
                    user_id: this.userData.user_id,
                    type: "licensee",
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
                }
                getLicenseeList(data).then(res => {
                    this.companies = res.data[0];
                })
            },

        }
    }
</script>

<style lang="scss" module>

</style>
