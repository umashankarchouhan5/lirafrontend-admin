<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="RFI Register" slot="title"  :pdf="generatePdf" v-if="showPdf"/>
        <PageTitle title="RFI Register" slot="title" v-else/>
            
        <div :class="$style.filter">
            <div :class="$style.filterItem">
                <FormSelect label="Status" :width="200" :items="filtering.statusses" item-name="name" item-value="id" v-model="filtering.status_id" />
            </div>
            <!-- <div :class="$style.filterItem" >
                <FormSelect :width="200" label="Department" :items="filtering.departmentList" item-name="Name" item-value="id" v-model="filtering.department_id" />
            </div> -->
            <div :class="$style.filterItem">
                <InputDate style="width: 200px" label="Select Date range" :options="options" type="daterange" v-model="filtering.dates" />
            </div>

            <FormButton  type="primary" @click="getData" :rounded="true">
                <Icon type="ios-search" />
            </FormButton>
         </div>
        <DataTable :actions="true"
            :data="complaints"
            :columns="config"
            :is-loading="isLoading"
            @on-selection-change="selectChange"
        >
            
            <template slot="actionsRight">
                <TableButton @click="() => exportExcel()" v-if="showExcel">
                    <img src="../../../assets/images/Excel_Icon.png" alt="">
                    Export Excel
                </TableButton>
            </template>
        </DataTable>

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
        <!-- complaint popup -->
        <Popup title="RFI Summary" :value="briefSummaryModal.visible" @close="() => briefSummaryModal.visible = false">
            {{ briefSummaryModal.message }}
            <div slot="footer">
                <FormButton  @click="() => briefSummaryModal.visible = false">Ok
                </FormButton>
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
    import { generateComplaintRfi, getRFIRegister, getDepartmentList, exportComplaintRfi, getCompanyStatusList } from './api'
    import InputDate from 'Components/form/InputDate';
    import Event from 'Utils/event';

    export default {
        name: "RFIRegister",
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle,
            DataTable,
            InputDate,
        },
        data() {
            return {
                filtering:{
                    department_id: '',
                    dates: '',
                    departmentList: [],
                    statusses: [],
                    status_id: null,
                },
                complaints: [],
                config,
                selectedRows: [],
                warningModal: {
                    visible: false,
                    buttons: {
                        ok: true,
                        confirm: false,
                        cancel: false
                    }
                },
                showPdf: false,
                showExcel: false,
                
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                briefSummaryModal: {
                    message: '',
                    visible: false,
                }
            }
        },
        watch: {
            
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        created() {
            this.fetchData();
            Event.subscribe('showBriefPopup', this.showBriefPopup);
        },
        methods: {
            showBriefPopup (brief) {
                this.briefSummaryModal.message = brief;
                this.briefSummaryModal.visible = true;
            },
            generatePdf(){
                const data = {
                    isPdf: true,
                    department_id: this.userData.department_id,
                    DateFrom: this.filtering.dates[0],
                    DateTo: this.filtering.dates[1],
                    isRfi: 1,
                    status_id: this.filtering.status_id
                }
                exportComplaintRfi(data).then(
                    res => {
                        window.open(res.data,'_blank');
                    }
                )
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            fetchData(){
                Promise.all([
                    // getDepartmentList(),
                    getCompanyStatusList()
                ]).then(this.handleData);
            },
            handleData(response){
                // this.filtering.departmentList = response[0].data;
                this.filtering.statusses = response[0].data;
                // if(this.userData.department_id && this.userData.department_id !== null ){
                //     this.filtering.department_id = this.userData.department_id
                // }
                this.getData();
            },
            exportExcel() {
                const data = {
                    department_id: this.userData.department_id,
                    DateFrom: this.filtering.dates[0],
                    DateTo: this.filtering.dates[1],
                    isRfi: 1,
                    status_id: this.filtering.status_id,
                    isExcel: 1,
                }
                exportComplaintRfi(data).then(
                    res => {
                        window.open(res.data,'_blank');
                    }
                )
            },
            getData(){
                const data = {
                    // department_id: this.filtering.department_id,
                    DateFrom: this.filtering.dates[0],
                    DateTo: this.filtering.dates[1],
                    status_id: this.filtering.status_id
                }
                getRFIRegister(data).then(
                    res => {
                        this.complaints = res.data[0];
                        if (res.pdf_visibility==1) {
                            this.showPdf = true;    
                        }
                        if (res.excel_visibility==1) {
                            this.showExcel = true;
                        }
                        
                    }
                )
                
            }
        }
    }
</script>

<style lang="scss" module>

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



</style>
