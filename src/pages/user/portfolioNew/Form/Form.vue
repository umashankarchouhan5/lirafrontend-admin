<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Create Rule" slot="title" />

        <ValidationObserver ref="validator">
            <FormRow >
                <div class="col-sm-3">
                    <FormSelect label="Department" v-model="userData.department_id" :items="departmentList" itemName="Name" itemValue="id" disabled />
                </div>
            </FormRow>
            <!-- Rules Grid component -->
            <RulesGrid v-model="form.rulesArray" :processTypes="processTypes" :licensees="licensees" :officers="officers" :notificationGroups="notificationGroups" :mode="mode" />

        </ValidationObserver>
        
        <ButtonGroup>
            <FormButton type="success" @click="sendRules()" left-icon="ios-send" ><span v-if="mode == 'add'">Create</span><span v-else>Edit </span> Rule</FormButton>
            <FormButton type="primary" @click="backToList()" >Back</FormButton>
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
        <Popup title="Success" type="success" :value="successModal.visible" :mask-closable="false" :closable="false" @close="() => backToList">
            {{ successModal.message }}
            <div slot="footer">
                <FormButton @click="() => backToList()">Back To List</FormButton>
            </div>
        </Popup>


    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import loadingMixin from 'Mixins/loadingMixin';
    import { getICSPLicenses, getDepartmentList, getProcessTypes, getAdminUserList, addPortfolioRule, editPortfolioRule, fetchPortfolioRuleById, getNotificationGroupList } from '../api'
    import RulesGrid from './components/RulesGrid';
    import { ValidationObserver } from 'vee-validate';

    export default {
        name: "PortfolioCreatRule",
        mixins: [ loadingMixin ],
        components: {
            FormWrapper,
            PageTitle,
            RulesGrid,
            ValidationObserver,
        },
        data() {
            return {
                warningModal: {
                    visible: false,
                    buttons: {
                        ok: true,
                        confirm: false,
                        cancel: false
                    }
                },
                successModal: {
                    visible: false,
                    message: ''
                },
                form: {
                    rulesArray: [],
                    reference_id: null,
                },
                departmentList: [],
                licensees: [],
                processTypes: [],
                officers: [],
                notificationGroups: [],
                errors: {},
                sorting: {
                    key: 'id',
                    order: 'asc'
                },
                pagination: {
                    perPage: 10,
                    page: 1,
                    total: 0
                },
                mode:'add'
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
        },
        watch: {

        },
        created() {
            this.getFilterValues();
            if(this.$route.name == 'PortfolioEditRule'){
                this.mode = 'edit';
                this.getDataById();
            }
        },
        methods: {
            backToList() {
                this.successModal.visible = false
                setTimeout(() => {
                    this.$router.push('/portfolioRules')
                },200)
            },
            getDataById(){
                fetchPortfolioRuleById({ id : +this.$route.params.ID }).then(
                    res => {
                        const { id, department_id, adminuser_id, processType_id, process_id, license_id, group_id } = res.data;
                        this.form.reference_id = id;
                        this.form.department_id = department_id;
                        this.form.rulesArray[0].department_id = department_id;
                        this.form.rulesArray[0].license_id = license_id;
                        this.form.rulesArray[0].officer_id = adminuser_id;
                        this.form.rulesArray[0].processType_id = processType_id;
                        this.form.rulesArray[0].process_id = process_id;
                        this.form.rulesArray[0].group_id = group_id;
                    }
                )
            },
            sendRules() {
                this.$refs.validator.validate().then(result=> {
                    if(result){
                        const data = {
                            reference_id: this.form.reference_id,
                            department_id: this.form.department_id || this.userData.department_id,
                            rulesArray: this.form.rulesArray
                        }
                        const modes = {
                            add: addPortfolioRule,
                            edit: editPortfolioRule,
                        }
                        const action = modes[this.mode];
                        action(data).then(
                            res => {
                                
                                this.form= {
                                    rulesArray: [],
                                    reference_id: 0,
                                };
                                this.successModal.message = res.message;
                                this.successModal.visible = true;
                            }
                        )
                    }
                })
            },
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            officersData() {
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
                return data;
            },
            getFilterValues() {
                this.showLoader();
                Promise.all([
                    getICSPLicenses(),
                    getProcessTypes(),
                    getDepartmentList(),
                    getAdminUserList(this.officersData()),
                    getNotificationGroupList()
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.licensees = response[0].data;
                this.processTypes = response[1].data;
                this.departmentList = response[2].data;
                this.officers = response[3].data[0];
                this.notificationGroups = response[4].data;
                this.hideLoader();
            },
            
            
        }
    }
</script>

<style lang="scss" module>
    

</style>
