<template> 
        <FormWrapper :is-loading="isLoading">
            <PageTitle title="Suspension of License" slot="title"/>
            <ValidationObserver ref="validator">
                <FormRow>
                    <div class="col-sm-3" >
                        <FormSelect  label="Entity Type" :items="filtering.entityList" :disabled="filtering.entityList.length === 0 || readonly" item-name="longName" item-value="Name" rules="required"  v-model="form.licenseType" :onChange="resetCompany" />
                    </div> 
                <!-- </FormRow>
                <FormRow> -->
                    <div class="col-sm-3" >
                        <InputText rules="required"  label="Reg #" :readonly="form.licenseType === null || form.licenseType === undefined || readonly"  v-model="filtering.CompanyRegNo" @keyup.native="searchByRegNo" @focusout="searchByRegNoTab" />
                    </div>
                    <div class="col-sm-6" >
                        <FormAutoComplete
                            label="Licensee Name"
                            rules="required"
                            :disabled="form.licenseType === null || form.licenseType === undefined || readonly"
                            v-model="form.Licensee"
                            :onChange="onSearchName"
                            :items="companies"
                            item-value="Name"
                            item-name="Name"
                            :onSelect="onSelectCompanyByName" />
                    </div>
                </FormRow>
                    
                <FormRow >
                    <div class="col-sm-3">
                        <InputDate rules="required" label="Effective Date" :readoly="readonly"  v-model="form.effectiveDate"  />
                    </div>
                </FormRow>
                    
                <FormRow>
                    <div class="col-sm-4" >
                        <FormSelect  label="Select Reason" :items="filtering.reasons" :disabled="readonly" item-name="Name" item-value="id" rules="required"  v-model="form.cessationReason_id" :onChange="selectReason" />
                    </div> 
                </FormRow>
                    <FormRow >
                        <div class="col-sm-12">
                            <InputTextArea rules="required" label="Reason" rows="5" :readoly="readonly"  v-model="form.cessationReason"  />
                        </div>
                    </FormRow>
                
                <FormRow v-if="!readonly">
                    <div class="col-sm-12">
                        <ButtonGroup>
                            <FormButton
                                    left-icon="md-checkmark-circle-outline"
                                    type="success"
                                    @click="submitData()"
                                    >
                                Submit
                            </FormButton>
                        </ButtonGroup>
                    </div>
                </FormRow>
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

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DateUtil from 'Utils/dateUtil';
    import { ValidationObserver } from "vee-validate"; 
    import InputDate from 'Components/form/InputDate';
    import loadingMixin from 'Mixins/loadingMixin';
    import FormAutoComplete from 'Components/form/FormAutoComplete';
    import { fetchEntityTypeByDepartment, getCompany, cessationRequestAdmin, getStrikeOffReason, } from '../api';

    export default {
        name: "SuspensionLicense",
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
                    CompanyRegNo: '',
                    reasons: [],
                },
                companies: [],
                isSelected: false,
                form:{
                    licenseType: null,
                    company_id: null,
                    effectiveDate: '',
                    license_id: 0,
                    reference_id: 0,
                    process_id: null,
                    cessationReason: '',
                    cessationReason_id: null,
                },
                process_id:  null,
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
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
            menu(){
                return this.$store.state.menu.menu;
            },
            processId() {
                return this.$store.state.common.currentProcessId
            },
        },
        watch: {
            'form.licenseType': function (newValue) {
                if (newValue === '' || newValue === undefined || newValue === null) {
                    this.resetCompany();
                    this.resetCompanies();
                }
            },
            'filtering.CompanyRegNo': function (newValue) {
                if ( newValue == '') {
                    this.resetCompany();
                    this.resetCompanies();
                }
            },
            'form.Licensee': function (newValue) {
                if ( newValue == '' ) {
                    this.resetCompany();
                    this.resetCompanies();
                }
            }
        },
        created() {
            this.getFilterData();
            if(this.menu !== undefined && this.menu !== null && this.menu.length !== 0){
                this.$store.commit('setProcessId', this.getProcessIdFormMenu());
                this.form.process_id = this.getProcessIdFormMenu();
                this.process_id = this.getProcessIdFormMenu()
            }
            else{
                this.$store.commit('setProcessId', parseInt(this.$route.params.processId));
                this.form.process_id = parseInt(this.$route.params.processId);
                this.process_id = parseInt(this.$route.params.processId);
            }
        },
        methods: {
            getProcessIdFormMenu(){
                const selected = this.menu.find(ele => {
                    return ele.id == '5'
                });
                if(selected !== undefined){
                    const process_id = selected.submenu.find(item => {
                        return item.name.includes('Suspension');
                    }).process_id;
                    return process_id;
                }
                else{
                    return parseInt(this.$route.params.processId);
                }
            },
            selectReason(id){
                if(id !== undefined && id !== null ){
                    this.form.cessationReason = this.filtering.reasons.find( ele => ele.id === id).description 
                }else{
                    this.form.cessationReason = '';
                }
            },
            getFilterData(){
                this.showLoader();
                Promise.all([
                    fetchEntityTypeByDepartment({department_id: this.userData.department_id}),
                    getStrikeOffReason({ process_id: this.processId})
                ]).then(this.getDataHandler)
            },
            getDataHandler(res){
                this.filtering.entityList = res[0].data;
                this.filtering.reasons = res[1].data;
                this.hideLoader();
            },
            submitData(){
                this.$refs.validator.validate().then(result => {
                    if (result) {
                        this.showLoader();
                        const data = {
                            ...this.form
                        };
                        cessationRequestAdmin(data).then((res) => {
                            this.hideLoader();
                            this.modals.success.message = 'Your Cessation request is saved.';
                            this.modals.success.isVisible = true;
                        }).catch(() => {
                            this.hideLoader();
                        })
                           
                    }
                })
            },
            backToList() {
                this.modals.success.isVisible = false;
                this.$router.push('/suspension');
            },


            // licensee selection
            searchByRegNoTab() {
                
                if (!this.isSelected) {
                    const { CompanyRegNo } = this.filtering;
                    const { licenseType } = this.form;
                    if (CompanyRegNo ) {
                        getCompany({
                            EntityType: licenseType,
                            Name: '',
                            RegNo: CompanyRegNo,
                        }).then(res => {
                            if (res.data[0] && res.data[0].length > 0) {
                                var company = res.data[0][0];
                                this.form.company_id = company.id
                                this.form.licenseType = company.EntityType;
                                this.form.Licensee = company.Name;
                                this.filtering.CompanyRegNo = company.CompanyRegNo;
                                this.isSelected = false;
                            }
                        })
                        
                    }
                }
            },
            searchByRegNo(event) {
                if(event.keyCode === 13){
                    if (!this.isSelected) {
                        const { CompanyRegNo } = this.filtering;
                        const { licenseType } = this.form;
                        if (CompanyRegNo ) {
                            getCompany({
                                EntityType: licenseType,
                                Name: '',
                                RegNo: CompanyRegNo,
                            }).then(res => {
                                if (res.data[0] && res.data[0].length > 0) {
                                    var company = res.data[0][0];
                                    this.form.company_id = company.id
                                    this.form.licenseType = company.EntityType;
                                    this.form.Licensee = company.Name;
                                    this.filtering.CompanyRegNo = company.CompanyRegNo;
                                    this.isSelected = false;
                                }
                            })
                            
                        }
                    }
                }
            },
            onSelectCompanyByName(value) {
                var company = this.companies.find(item => item.Name === value);
                this.form.company_id = company.id;
                this.form.licenseType = company.EntityType;
                this.form.Licensee = company.Name;
                this.filtering.CompanyRegNo = company.CompanyRegNo;

                this.isSelected = true;
            },
            resetCompany() {
                if(!this.readonly){
                    // this.form.licenseType = null;
                    this.form.Licensee = '';
                    this.filtering.CompanyRegNo ='';
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
                const { licenseType } = this.form;
                getCompany({
                    EntityType: licenseType,
                    Name,
                    RegNo: '',
                }).then(res => {
                    this.companies = res.data[0];
                })
            },

        }
    }
</script>

<style lang="scss" module>

</style>
