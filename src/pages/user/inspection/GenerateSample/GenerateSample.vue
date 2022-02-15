<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Generate Sample" slot="title" />
        <FormRow>
            <div class="col-sm-4">
                <FormSelect label="License Type" rules="required" :items="form.licenseTypes" item-name="longName" item-value="Name" v-model="form.licenseType" :clearable="false" />
            </div>
        </FormRow>
        <FormRow v-if="form.licenseType !== null" >
            <div class="col-sm-2">
                <InputText rules="required" label="Licensee Reg #"  v-model="form.licenseRegNo" @keyup.native="searchByRegNo"  @focusout="searchByRegNoTab" />
            </div>
            <div class="col-sm-5">
                <FormAutoComplete
                    label="Licensee Name"
                    rules="required"
                    v-model="form.licenseeName"
                    :onChange="onSearchName"
                    :items="form.licensees"
                    item-value="CompanyName"
                    item-name="CompanyName"
                    :onSelect="onSelectLicenseeByName" />
            </div>
        </FormRow>      
        <div v-if="form.license_id !== null ">
            <h4 >Generate Sample</h4>
            <br/>
            <FormRow >
                <div class="col-sm-3">
                    <FormSelect label="EntityType"  :items="entityTypes[form.licenseType]" item-name="name" item-value="name" v-model="form.sampleEntity" />
                </div>
                <div class="col-sm-2">
                    <InputText label="No. of Sample" type="text" v-model="form.sampleSize" />
                </div>
                <div class="col-sm-3">
                    <FormSelect 
                        :width="200" 
                        label="Status" 
                        :items="entityStatusses" 
                        item-name="name" 
                        item-value="id" 
                        v-model="form.goodstanding" 
                    />
                </div>

                <div class="col-sm-3" :title="form.sampleEntity === null || form.sampleEntity === undefined || !(form.sampleSize > 0)  ? 'Select Entity Type & Number should be greater than 0': ''">
                    
                    <FormButton type="success" @click="generateSample()" :disabled="form.sampleEntity === null || form.sampleEntity === undefined || !(form.sampleSize > 0) " >Generate Sample</FormButton>
                </div>
            </FormRow>
            <div v-if="customErrors.noEntity.status" :class="$style.error">{{customErrors.noEntity.message}}</div>
            <FormRow v-if="form.excelDataURL">
                <div class="col-sm-4">
                    <FormButton :prevent-default="false" size="small" :href="form.excelDataURL" target="_blank" tag="a" left-icon="md-download">Download Entities Excel</FormButton>
                </div>
            </FormRow>
            
        </div>

        <!-- <Popup title="Success" type="success" :value="successModal.isVisible" @close="() => successModal.isVisible = false"  :closable="true">
            {{ successModal.message }}
        </Popup> -->
        

    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import loadingMixin from 'Mixins/loadingMixin';
    import { fetchEntityTypeByDepartment, getLicenseeList, fetchRandomInspectionSample, getCompanyStatusByID } from '../api';
    import FormAutoComplete from 'Components/form/FormAutoComplete';

    export default {
        name: "GenerateSample",
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle,
            FormAutoComplete,
        },
        data() {
            return {
               form: {
                    process_id: 1205,
                    reference_id: 0,
                    licenseTypes: [],
                    licenseType: null,
                    licensees: [],
                    licenseeName: null,
                    licenseRegNo: '',
                    license_id: null,
                    address_id: null,
                    entityJson: [],
                    company_id: null,
                    sampleSize: 0,
                    sampleEntity: null,
                    excelDataURL: '',
                    goodstanding: '',
                },
                entityTypes: {
                    ICSP: [{name:'IBC', value: 121},{name:'LP',value: 124}],
                    ITSP: [{name:'Trust', value: 123}],
                    FSP: [{name:'Foundation', value: 122}]
                },
                entityStatusses: [],
                customErrors: {
                    noEntity: {
                        status: false,
                        message: ''
                    }
                },
                sorting: {
                    key: 'id',
                    order: 'desc'
                },
                pagination: {
                    perPage: 10,
                    page: 1,
                    total: 0
                },
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        created() {
            this.getFilterValues();
        },
        watch: {
            'form.license_id': function() {
                this.customErrors.noEntity.status = false;
                this.customErrors.noEntity.message = '';
                this.form.sampleSize = 0;
                this.form.sampleEntity = null;
                this.form.excelDataURL = '';
                this.form.entityJson = [];
            },
            'form.licenseeName': function(val) {
                if(val === null || val === undefined || val == ''){
                    this.resetCompany();
                    this.resetCompanies()
                    this.isSelected = false;
                }
            },
            'form.licenseRegNo': function(val) {
                if(val === null || val === undefined || val == ''){
                    this.resetCompany();
                    this.resetCompanies();
                    this.isSelected = false;
                }
            },
            'form.licenseType': function() {
                this.resetCompany();
                this.resetCompanies();
                this.isSelected = false;
            },
            'form.sampleEntity': function(val) {
                if(val !== null && val !== undefined) {
                    let entityId = this.entityTypes[this.form.licenseType].filter( item => {
                        if(val == item.name) return item;
                    })[0].value;
                    getCompanyStatusByID(entityId).then(
                        res=> {
                            this.entityStatusses = res.data;
                        }
                    );
                }
            }
        },
        methods: {
            generateSample(){
                const data = {entityType: this.form.sampleEntity, sampleSize: this.form.sampleSize, license_id: this.form.license_id, goodstanding: this.form.goodstanding};
                fetchRandomInspectionSample(data).then(
                    res => {
                        if(res.data.data.length > 0){
                            this.customErrors.noEntity.status = false;
                            this.form.entityJson = res.data.data;
                            this.form.excelDataURL = res.data.url;
                        }
                        else{
                            this.customErrors.noEntity.message = `No ${this.form.sampleEntity} found for ${this.form.licenseeName}.`;
                            this.customErrors.noEntity.status = true;
                            this.form.excelDataURL = '';
                        }
                    }
                )
            },
            getFilterValues() {
                this.showLoader();
                Promise.all([
                    fetchEntityTypeByDepartment({department_id: this.userData.department_id, csl: 0}),
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.form.licenseTypes = response[0].data;
                this.hideLoader();
                    
            },
            getData(val) {
                this.showLoader();
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;

                const filters = {};
                filters.Name = val;
                filters.licenseType = this.form.licenseType;

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
                getLicenseeList(data)
                    .then(this.handleResponse)
                    .catch(this.handleError)
            },
            handleResponse(response) {
                this.hideLoader();
                this.form.licensees = response.data[0];
                
                this.pagination.total = response.NumberOfRecords;
            },
            searchByRegNoTab() {
                if (!this.isSelected && this.form.licenseRegNo !== '') {
                    this.getLicenseeByRegNo();
                }
            },
            searchByRegNo(event) {
                if(event.keyCode === 13  && this.form.licenseRegNo !== ''){
                    if (!this.isSelected) {
                        this.getLicenseeByRegNo();
                            
                    }
                }
            },
            getLicenseeByRegNo() {
                this.showLoader();
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;

                const filters = {};
                filters.licenseType = this.form.licenseType;
                filters.RegNo = this.form.licenseRegNo;

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
                getLicenseeList(data)
                    .then(
                        res => {
                            if(res.data && res.data[0] && res.data[0][0]){
                                const licensee = res.data[0][0];
                                this.form.license_id = licensee.License_id;
                                this.form.company_id = licensee.Company_id;
                                this.form.address_id = licensee.Address_id; 
                                this.form.licenseeName = licensee.CompanyName;
                            }
                            this.hideLoader();
                        }
                    )
                    .catch(this.handleError)
            },
            onSelectLicenseeByName(value) {
                const licensee = this.form.licensees.find(item => item.CompanyName === value);
                this.form.license_id = licensee.License_id;
                this.form.company_id = licensee.Company_id;
                this.form.address_id = licensee.Address_id;
                this.form.licenseRegNo = licensee.License
                // this.isSelected = true;
            },
            resetCompany() {
                if(!this.readonly){
                    this.form.license_id = null;
                    this.form.address_id = null;
                    this.form.licenseeName = '';
                    this.form.licenseRegNo ='';
                    this.form.company_id = null;
                }
            },
            validateQuery(value) {
                return value.length >= 3
            },
            resetCompanies() {
                this.form.licensees = [];
            },
            onSearchName(val) {
                if (this.validateQuery(val) && !this.isSelected) {
                    this.getData(val);
                }
            },
            searchForCompany(Name) {
                const { EntityType } = this.filtering;
                getCompany({
                    EntityType,
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

    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 11px;
        margin: 10px 0;
        font-weight: 400;
    }


</style>
