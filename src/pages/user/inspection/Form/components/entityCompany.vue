<template>
    <FormRow >
        <div class="col-sm-3">
            <InputText rules="required" label="Reg #" :vid="`reg-${i}`" v-model="innerValue.CompanyRegNo" @keyup.native="searchByRegNo" @focusout="searchByRegNoTab" :readonly="readonly" />
        </div>
        <div class="col-sm-6">
            <FormAutoComplete
                label="Entity Name"
                rules="required"
                :vid="`EntityName-${i}`"
                v-model="innerValue.CompanyName"
                :onChange="onSearchName"
                :items="companies"
                item-value="Name"
                item-name="Name"
                :onSelect="onSelectCompanyByName" 
                :disabled="readonly"
            />
        </div>
    </FormRow>
</template>

<script>

    import { getCompany } from '../../api';
    import valueMixin from 'Mixins/valueMixin';
    import FormAutoComplete from 'Components/form/FormAutoComplete';

    export default {
        name: "EntitiesComponent",
        mixins: [ valueMixin ],
        components: {
            FormAutoComplete
        },
        data() {
            return {
                companies: [],
            }
        },
        props:{
            readonly: Boolean,
            i: Number
        },
        watch:{
            value:{
                deep: true,

                handler(val){
                }
            },
            'innerValue.entityType': function(val){
                // if(val === undefined || val === null){
                    this.resetCompany();
                // }
            },
            'innerValue.CompanyName': function(val){
                if(val === undefined || val === null || val === ''){
                    this.resetCompany();
                }
            },
            'innerValue.CompanyRegNo': function(val){
                if(val === undefined || val === null || val === ''){
                    this.resetCompany();
                }
            }
        },
        methods: {
            searchByRegNoTab() {
                
                if (!this.isSelected) {
                    const { CompanyRegNo } = this.innerValue;
                    const { entityType } = this.innerValue;
                    if (CompanyRegNo ) {
                        getCompany({
                            EntityType: entityType,
                            Name: '',
                            RegNo: CompanyRegNo,
                        }).then(res => {
                            if (res.data[0] && res.data[0].length > 0) {
                                const val = res.data[0]
                                this.innerValue.company_id = val.id
                                this.innerValue.entityType = val.EntityType;
                                this.innerValue.CompanyName = val.Name;
                                this.innerValue.CompanyRegNo = val.CompanyRegNo;
                                // this.isSelected = false;
                            }
                        })
                        
                    }
                }
            },
            searchByRegNo(event) {
                if(event.keyCode === 13){
                    if (!this.isSelected) {
                        const { CompanyRegNo } = this.innerValue;
                        const { entityType } = this.innerValue;
                        if (CompanyRegNo ) {
                            getCompany({
                                EntityType: entityType,
                                Name: '',
                                RegNo: CompanyRegNo,
                            }).then(res => {
                                if (res.data[0] && res.data[0].length > 0) {
                                    const val = res.data[0][0];
                                    // this.companies = val;
                                    this.innerValue.company_id = val.id
                                    this.innerValue.entityType = val.EntityType;
                                    this.innerValue.CompanyName = val.Name;
                                    this.innerValue.CompanyRegNo = val.CompanyRegNo;
                                    // this.isSelected = false;
                                }
                            })
                            
                        }
                    }
                }
            },
            onSelectCompanyByName(value) {
                var company = this.companies.find(item => item.Name === value);

                this.innerValue.company_id = company.id;
                this.innerValue.entityType = company.EntityType;
                this.innerValue.CompanyName = company.Name;
                this.innerValue.CompanyRegNo = company.CompanyRegNo;

                // this.isSelected = true;
            },
            resetCompany() {
                if(!this.readonly){
                    this.innerValue.CompanyName = '';
                    this.innerValue.CompanyRegNo ='';
                    this.innerValue.company_id = null;
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
                // this.isSelected = false;
            },
            searchForCompany(Name) {
                const { entityType } = this.innerValue;
                getCompany({
                    EntityType: entityType,
                    Name,
                    RegNo: '',
                }).then(res => {
                    this.companies = res.data[0];
                })
            },
        }
    }
</script>
