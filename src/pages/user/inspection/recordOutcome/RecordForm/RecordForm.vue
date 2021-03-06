<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Inspection Findings" slot="title" />

        <TicketHeader v-if="ibcNames.length == 1" :ticketValue="ticketValue" />

        <ValidationObserver ref="validator" v-if="form !== null">
            
            <FormRow v-if="form.licenseType !== null" >
                <div class="col-sm-8">

                    <FormRow v-if="form.licenseType !== null" >
                        
                        <div class="col-sm-3">
                            <InputDate  label="Inspection Date" v-model="form.inspectionDate" readonly />
                        </div>
                        <div class="col-sm-2">
                            <InputTime  label="Inspection Time" v-model="form.inspectionTime" readonly />
                        </div>
                        <div class="col-sm-7">
                            <h4>Inspection Team</h4>
                            <p>
                                <span v-for="(officer,i) in form.inspectionTeamJson" :key="i">
                                    <span :class="$style.teamLead">{{officer.isTeamLead == 1 ? '*': ''}}</span>
                                    <span :class="officer.isTeamLead == 1 ? $style.teamLead : ''" :title="officer.isTeamLead == 1 ? 'Team Lead' : ''">{{getOfficer(officer)}}</span>
                                    {{(i + 1) != form.inspectionTeamJson.length ? ',' : ''}} 
                                </span>
                            </p>
                        </div>
                    </FormRow>
                    <FormRow v-if="form.licenseType !== null" >
                        <div class="col-sm-8" :class="$style.mb0" >
                            <AddressInput v-model="form.address_id" label="Office Address" readonly/>
                        </div>
                    </FormRow>

                </div>

                <div class="col-sm-4"  >
                    <h6 v-if="ibcNames.length > 1"> {{ibcNames.length}} entities being updated. To see <a @click="() => { viewIbc = true }">click here</a> </h6>
                    <div :class="$style.showNameStyle" v-if="viewIbc">
                        <a  @click="() => { viewIbc = false }" :class="$style.close" />
                        <p v-for="(name,index) in ibcNames" :key="index"> {{ name }} </p>
                    </div>
                </div>
            </FormRow>

            <FormRow v-if="$route.name == 'ReinspectionOutcomeForm'" >
                <div class="col-sm-3" >
                    <InputDate  label="Reinspection Date" v-model="reinspectionDate" rules="required" :options="options" />
                </div>
                <div class="col-sm-3" >
                    <InputDate  label="Compliance Date" v-model="ComplianceDate" rules="required" :options="options" />
                </div>
            </FormRow>

        <!-- Questions -->
            <Questions v-model="form.inspectionItemResponseJson" :readonly="readonly" :process_id="form.process_id" v-if="form.inspectionItemResponseJson" @selectionChange="checkCompliance" @notCompliant="checkCompliant" @yesCompliant="compliantYes" /> 

            <FormRow >
                <div class="col-sm-3" style="maxWidth:150px;width:150px;">
                    <p>Is Compliant</p>
                </div>
                <div class="col-sm-4">
                    <InputYesNo v-model="form.isCompliant" :disabled="readonly &&  $route.name !== 'ReinspectionOutcomeForm'" :Yes="1" :No="0" name="Is Compliant" rules="required" /> 
                </div>
            </FormRow>
            
            <div :class="$style.flexBox" v-if="nonCompliantSectionCheck.length > 0">
                <div  :class="$style.autogeneratedTextBox">
                    <p>{{nonCompliantAuto}}</p>
                </div>
                <div  :class="$style.autogeneratedButton" @click="insertIntoComplianceNotes">
                    Insert into Compliance Notes
                </div>
            </div>

            <FormRow>
                <div class="col-sm-12">
                    <InputTextArea v-model="form.ComplianceNotes" :readonly="readonly && $route.name !== 'ReinspectionOutcomeForm'" label="Compliance Notes" maxlength="2000" rows="5" />
                </div>
            </FormRow>
            
        
        </ValidationObserver>

        <ButtonGroup>
            <FormButton type="primary" @click="backToList" left-icon="ios-arrow-back" >Back</FormButton>
            <FormButton v-if="!readonly || $route.name == 'ReinspectionOutcomeForm'" left-icon="ios-send" type="success" @click="submitOutcome" >Submit</FormButton>
        </ButtonGroup>

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
        
        <Popup title="Success" type="success" :value="successModal.isVisible" @close="() => successModal.isVisible = false"  :closable="false" :mask-closable="false" >
            {{ successModal.message }}
            <div slot="footer">
                <FormButton  @click="() => backToList()">Back To List</FormButton>
            </div>
        </Popup>

    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import InputDate from 'Components/form/InputDate';
    import InputTime from 'Components/form/InputTime';
    import loadingMixin from 'Mixins/loadingMixin';
    import AddressInput from 'Components/form/addressInput/AddressInput';
    import Questions from './Questions'
    import { fetchInspectionOutcomeResponse, fetchInspectionDetailById, updateInspectionOutcome, getInspectionTypebyDepartment,getAdminUserList, getLicenseeList, getCompanyById } from '../../api'
    import { ValidationObserver } from "vee-validate"; 
    import DateUtil from 'Utils/dateUtil' ;

    export default {
        name: "RecordOutComeForm",
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle,
            InputDate,
            InputTime,
            AddressInput,
            Questions, 
            ValidationObserver,
        },
        data() {
            return {
                form: null,
                inspectionTypes: [],
                outcomeResponse: [],
                entityTypes: {
                    ICSP: [{name:'IBC'},{name:'LP'}],
                    ITSP: [{name:'Trust'}],
                    FSP: [{name:'Foundation'}]
                },
                adminUsers: [],
                decisionArr: [
                    {
                        name: 'Comply',
                        val: 1
                    },
                    {
                        name: 'Restrict',
                        val: 0
                    }
                ],
                sorting: {
                    key: 'id',
                    order: 'desc'
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
                tableData: [],
                selectedRows: null,
                document_id: null,
                companies: [],
                isSelected: false,
                uploadData:{
                    documentBrief: '',
                    documentDate: '',
                    fileUpload: null
                },
                
                successModal: {
                    isVisible: false,
                    message: '',
                },
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                headerData: null,
                readonly: false,
                ibcNames: [],
                viewIbc: false,
                reinspectionDate: '',
                ComplianceDate: DateUtil.formatInNumbersOnly(new Date())
                // ticketValue: null,
            }
        },
        watch: {
            'form.isCompliant': function(val) {
                if(val === 1) {
                    this.form.isFollowup = 0;
                }
            },
            'form.inspectionItemResponseJson': function(val) {
                // const check = val.filter( item => {
                //     return item.find()
                // })
                // console.log(val)
            },
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
            nonCompliantAuto() {
                let nonCompliantSections = this.form.inspectionItemResponseJson.filter( item => {
                    return item.isCompliantYN == 'N';
                })
                let nonCompliantSectionsName = nonCompliantSections.map( item => item.itemName).join(', ')
                let text = `Non-Compliant with ${nonCompliantSectionsName} of the Act. Starting date  of non-compliance: ${DateUtil.formatDate(new Date())}`
                return nonCompliantSections.length > 0 ? text : '';
            },
            nonCompliantSectionCheck() {
                let nonCompliantSections = this.form.inspectionItemResponseJson.filter( item => {
                    return item.isCompliantYN == 'N';
                })
                return nonCompliantSections;
            },
            ticketValue(){
                return {
                    First: '',
                    Second: this.ibcNames[0],
                    Third: ''
                }
            }
        },
        created() {
            this.getFilterValues();
            this.ibcNames = (localStorage.getItem('finding_company_name_string')).split(',')
        },
        methods: {
            insertIntoComplianceNotes() {
                this.form.ComplianceNotes = this.form.ComplianceNotes == null ? this.nonCompliantAuto : this.form.ComplianceNotes.concat(this.nonCompliantAuto);
            },
            getCompanyById(company_id) {
                getCompanyById({id:company_id}).then(
                    res => {
                        this.headerData = res.data;
                    }
                )
            },
            compliantYes(val) {
                this.form.isCompliant = 1;
            },
            checkCompliant(val) {
                this.form.isCompliant = 0;
            },
            checkCompliance(val){
                if(val == 'N'){
                    this.form.isCompliant = 0;
                }
            },
            getDate(val){
                return DateUtil.formatDate(val)
            },
            getOfficer(officer){
                return this.adminUsers.find( ele => {
                    return officer.adminuser_id === ele.id;
                }).Name
            },
            submitOutcome(){
                this.$refs.validator.validate().then(result => {
                    if (result) {
                        const {  ComplianceNotes, isCompliant, isFollowup, deadline, inspectionItemResponseJson } = this.form;
                        
                        const data= {
                            inspection_id: parseInt(this.$route.params.id),
                            ComplianceNotes,
                            isCompliant,
                            isFollowup,
                            deadline,
                            ...( this.$route.name !== 'RecordOutcomeFormMultiple' && {idString: parseInt(this.$route.params.company_id)}),
                            ...( this.$route.name === 'RecordOutcomeFormMultiple' && {idString: localStorage.getItem('finding_company_id_string')}),
                            inspectionItemResponseJson: JSON.stringify(inspectionItemResponseJson),
                            ...( this.$route.name == 'ReinspectionOutcomeForm' && {reinspectionDate: this.reinspectionDate}),
                            ...( this.$route.name == 'ReinspectionOutcomeForm' && {ComplianceDate: this.ComplianceDate}),
                        }
                        
                        updateInspectionOutcome(data).then(
                            res => {
                                this.successModal.message = 'Outcome has been submitted';
                                this.successModal.isVisible = true;
                            }
                        )
                    }
                })
            },
            generateSample(){
                const data = {entityType: this.form.sampleEntity, sampleSize: this.form.sampleSize, license_id: this.form.license_id};
                
            },
            getInspectionItem(){
                
            },
            backToList(){
                this.successModal.isVisible = false;
                setTimeout(() => { 
                    if(this.$route.name == "ReinspectionOutcomeForm") {
                        this.$router.push(`/reinspectionList/${this.$route.params.id}`);
                    }
                    else {
                        this.$router.push(`/recordOutcome/${this.$route.params.id}`);
                    }
                },300);
            },
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            getFilterValues() {
                this.showLoader();
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;
                const data = {
                    user_id: this.userData.user_id,
                    filterjson: {
                        filter: [{Department_id: this.userData.department_id}],
                        sort: [{ key, order }],
                        paging: [
                            {
                                startindex: perPage * (page - 1) + 1,
                                pagesize: 30
                            }
                        ]
                    }
                };
                if(this.$route.name !== 'RecordOutcomeFormMultiple'){
                    const { id, company_id } = this.$route.params;
                    Promise.all([
                        getInspectionTypebyDepartment({department_id: this.userData.department_id}),
                        fetchInspectionDetailById({reference_id: parseInt(id), company_id: parseInt(company_id)}),
                        getAdminUserList(data)
                    ]).then(this.handleFilterValues)
                }
                else{
                    const { id } = this.$route.params;
                    const company_id = localStorage.getItem('finding_company_id_string')
                    Promise.all([
                        getInspectionTypebyDepartment({department_id: this.userData.department_id}),
                        fetchInspectionDetailById({reference_id: parseInt(id), company_id: parseInt(company_id)}),
                        getAdminUserList(data)
                    ]).then(this.handleFilterValues)
                }
            },
            handleFilterValues(response) {
                this.inspectionTypes = response[0].data[0];
                this.form = response[1].data[0];
                this.form.inspectionTeamJson = JSON.parse(this.form.inspectionTeamJson)
                this.form.inspectionItemResponseJson = JSON.parse(this.form.inspectionItemResponseJson)
                this.form.licenseRegNo = this.form.CompanyRegNo;
                this.form.LicenseeName = this.form.LicenseeName;
                this.form.address_id = null;
                this.getLicenseeByRegNo();
                this.adminUsers = response[2].data[0];
                if(this.form.status_id == 405){
                    this.readonly = true
                }
                this.hideLoader();
            },
            getData() {
                this.showLoader();
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;

                const filters = {};
                filters.Name = this.form.LicenseeName
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
                
                if (!this.isSelected) {
                    this.getLicenseeByRegNo();
                }
            },
            searchByRegNo(event) {
                if(event.keyCode === 13){
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
                                this.form.LicenseeName = licensee.CompanyName;
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
            },
            resetCompany() {
                if(!this.readonly){
                    this.filtering.EntityType = null;
                    this.filtering.Name = '';
                    this.filtering.CompanyRegNo ='';
                    this.filtering.company_id = null;
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
                    this.getData();
                    this.form.filteredLicensees = this.form.licensees.filter(item => {
                        return item.CompanyName.toLowerCase().includes(val.toLowerCase());
                    })
                }
                else{
                    this.form.filteredLicensees = []
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
        },
        // beforeDestroy() {
        //     if(localStorage.finding_company_id_string){
        //         localStorage.removeItem('finding_company_id_string');
        //     }
        // }
    }
</script>

<style lang="scss" module>

    .mb0 {
        margin-bottom: 0px;
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
    .info {
        background: #d7d6da;
        box-shadow: 0 2px 2px #00000059;
        padding: 0 15px;
        display: flex;
        font-size: 13px;
        margin: -39px -30px 30px;
        line-height: 35px;
        justify-content: center;
        z-index: 4;
        position: sticky;
        top: 34.5px;
        & .infoBlock:nth-child(1){
            text-align: left;
            margin: 0px auto 0xp 0px;
            width: 33.33%
        }
        & .infoBlock:nth-child(2){
            text-align: center;
            margin: 0px auto;
            width: 33.33%
        }
        & .infoBlock:nth-child(3){
            text-align: right;
            margin: 0px 0px 0px auto;
            width: 33.33%
        }
    }
    .teamLead {
        color: #3dc18a;
    }
    .ibcBoxStyle {
        padding: 10px 20px;
        width: 100%;
        // animation: openBox .3s ease-out forwards;
        margin-bottom: 20px;
        // border-radius: 8px;
        box-sizing: border-box;
        border: 2px solid grey;
        border-radius: 8px;
        span { 
            margin-right: 10px;
            line-height: 20px;
            font-weight: 600;
        }
        
    }
    @keyframes openBox {
        0%  {   
                border: 0px solid white;
                border-radius: 0px;
                color: transparent;
            }
        // 70% {border: 1px solid white;}
        100% {
                border: 2px solid grey;
                border-radius: 8px;
                color: initial;
            }
    }
    @keyframes displayText {
        from {color: transparent}
        to {color: inherit}
    }
    .showNameStyle {
        border-left: 1px solid grey;
        overflow-y: auto;
        height: 120px;
        padding: 10px 20px;
        p {
            letter-spacing: 1.5px;
            line-height: 25px;
            border-bottom: 2px solid lightgray;
        }
    }
    .close {
        position: absolute;
        right: 32px;
        top: 35px;
        width: 32px;
        height: 32px;
        opacity: 0.3;
    
        &:hover {
            opacity: 1;
            transform: scale(1.1,1.1);
            transition: transform 0.3s ease-out;
        }
        &:before, &:after {
            position: absolute;
            left: 15px;
            content: ' ';
            height: 17px;
            width: 2px;
            background-color: #333;
        }
        &:before {
            transform: rotate(45deg);
        }
        &:after {
            transform: rotate(-45deg);
        }
    }
    .flexBox{
        display: flex;
        justify-content: flex-start;
        align-items: stretch;
        // box-shadow: 3px 3px 16px rgba(0,0,0,0.08);
        margin-bottom: 20px;
    }
    .autogeneratedTextBox {
        border-top: 1px solid lightgray;
        border-bottom: 1px solid lightgray;
        border-left: 1px solid lightgray;
        line-height: 20px;
        letter-spacing: 1.2px;
        font-weight: 500;
        display: flex;
        width: calc( 100% - 250px );
        // justify-content: center;
        align-items: center;
        padding: 20px 20px;
        background: lightgray;
    }
    .autogeneratedButton {
        cursor: pointer;
        background: #6da2f9;
        display: flex;
        width: 250px;
        justify-content: center;
        align-items: center;
        // color: white;
        font-weight: 600;
        font-size: 14px;
        padding: 20px 20px;
        letter-spacing: 1.1px;
        // text-shadow: 1px 1px rgba(0,0,0,0.2);
        text-align: center;
        box-shadow: -8px 0px 20px rgba(0,0,0,0.15);
        &:hover {
            // font-size: 15px;
            box-shadow: 3px 5px 20px rgba(0,0,0,0.1);
        }
    }

</style>
