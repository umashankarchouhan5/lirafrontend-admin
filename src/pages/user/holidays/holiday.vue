<template>
    <FormWrapper :is-loading="isLoading">
        <!-- <PageTitle title="Document Masters" slot="title" :link="`/help/${processId}`"/> -->
        <PageTitle title="Holidays" slot="title" />
         

        <div :class="$style.filter">
            
            <div :class="$style.filterItem">
                <FormSelect :width="200" label="Select Year" :items="yearSpans" item-name="value" item-value="value" v-model="filtering.year"  />
            </div>
            
            <FormButton style="margin-top: 5px" type="primary" @click="getDataByFilter" :rounded="true">
                <Icon type="ios-search" />
            </FormButton>
         </div>
        <DataTable :actions="true"
            :data="tableData"
            :columns="config"
            :is-loading="isLoading"
            @on-selection-change="selectChange">
            <template slot="actionsLeft">
                <TableButton @click="showAddModal(true)">
                    <img src="../../../assets/images/plus.png" alt="">
                    Add
                </TableButton>
                <TableButton @click="showEditModal(true)">
                    <img src="../../../assets/images/edit.png" alt="">
                    Edit
                </TableButton>
                <TableButton @click="showDeleteModal(true)">
                    <img src="../../../assets/images/delete.png" alt="">
                    Delete
                </TableButton>
            </template>
        </DataTable>
        <!-- Add holiday -->
        <Popup title="Add Holiday" :value="addModal.visible" @close="() => showAddModal(false)">
            <FormRow>
                <div class="col-sm-10">
                    <InputDate label="Select Holiday Date" v-model="selectedDate" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-10">
                    <InputTextArea label="Holdiay Description" v-model="holidayDescription" />
                </div>
            </FormRow>
            <div slot="footer">
                <FormButton  @click="() => showAddModal(false)">Cancel</FormButton>
                
                <FormButton  @click="addHol">Add</FormButton>
            </div>
        </Popup>
        <Popup title="Add Holiday" :value="editModal.visible" @close="() => showEditModal(false)">
            <FormRow>
                <div class="col-sm-10">
                    <InputDate label="Select Holiday Date" v-model="selectedDate" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-10">
                    <InputTextArea label="Holdiay Description" v-model="holidayDescription" />
                </div>
            </FormRow>
            <div slot="footer">
                <FormButton  @click="() => showeEditModal(false)">Cancel</FormButton>
                
                <FormButton @click="editHol">Edit</FormButton>
            </div>
        </Popup>
        <Popup title="Delete Holiday" :value="deleteModal.visible" @close="() => showDeleteModal(false)">
            {{ deleteModal.message }}
            <div slot="footer">
                <FormButton  @click="() => showDeleteModal(false)">Cancel
                </FormButton>
                <FormButton  type="success" @click="deleteHol">Confirm
                </FormButton>
            </div>
        </Popup>
<!-- Message popup -->
        <Popup title="Information" :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.cancel" @click="() => showWarningModal(false)">Cancel
                </FormButton>
                <FormButton v-if="warningModal.buttons.confirm" type="success" @click="deleteHol">Confirm
                </FormButton>
                <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
            </div>
        </Popup>

    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import InputDate from 'Components/form/InputDate';
    import config from './table';
    import loadingMixin from 'Mixins/loadingMixin';
    import { fetchHoliday, deleteHoliday, editHoliday, addHoliday } from './api'
    import moment from 'moment';

    export default {
        name: "Holidays",
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle,
            DataTable,
            InputDate,
        },
        data() {
            return {
                filtering: {
                    year: moment().year(),
                },
                yearSpans:[],
                sorting: {
                    key: 'id',
                    order: 'asc'
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
                addModal: {
                    visible: false,
                },
                editModal:{
                    visible: false,
                },
                deleteModal:{
                    visible: false,
                    message: 'Are you sure you want to delete this holiday'
                },
                tableData: [],
                config,
                selectedRows: [],
                holidayDescription: '',
                selectedDate: '',
            }
        },
        created() {
            this.getYearsList();
            this.getDataByFilter();
        },
        watch: {
            
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        methods: {
            getYearsList(){
                var currentYear = moment().year();
                for(var i = -5; i <=2; i++){
                    const year = {
                        value: currentYear + i,
                    }
                    this.yearSpans.push(year)
                }
            },
            showAddModal(val){
                this.addModal.visible = val;
                if(val === false){
                    this.reset();
                }
            },
            showEditModal(val){
                if(val == true){
                    if(this.validateSelectedLength(1)){
                        this.selectedDate = this.selectedRows[0].Holiday;
                        this.holidayDescription = this.selectedRows[0].Description;
                        this.editModal.visible = true;

                    }

                }
                if(val === false){
                    this.editModal.visible = false;
                    this.reset();
                }
            },
            showDeleteModal(val){
                if(this.validateSelectedLength(1)){
                    this.deleteModal.visible = val;
                }
            },
            addHol(){
                this.showLoader()
                addHoliday({Holiday:this.selectedDate,Description: this.holidayDescription}).then(
                    res=>{
                        this.getDataByFilter();
                        this.hideLoader();
                        this.showAddModal(false);
                    }
                )
            },
            editHol(){
                this.showLoader()
                editHoliday({id:this.selectedRows[0].id,Holiday:this.selectedDate,Description: this.holidayDescription}).then(
                    res=>{
                        this.getDataByFilter();
                        this.hideLoader();
                        this.showEditModal(false);
                    }
                )
            },
            deleteHol(){
                this.showLoader()
                deleteHoliday(this.selectedRows[0].id).then(
                    res=>{
                        this.getDataByFilter();
                        this.hideLoader();
                        this.showDeleteModal(false);
                    }
                )
            },
            reset(){
                this.selectedDate = '';
                this.holidayDescription = '';
            },
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
           
            
            selectChange(data) {
                this.selectedRows = data;
            },
            
            getDataByFilter() {
                this.showLoader();
                const filters = {};

                
                filters.year = this.filtering.year;

                
                fetchHoliday(filters)
                    .then(this.handleResponse)
                    .catch(this.handleError)
            },
            handleResponse(response) {
                this.hideLoader();
                this.tableData = response.data[0];
                this.pagination.total = response.NumberOfRecords;
            },
            validateSelectedLength(value) {
                if (this.selectedRows.length === value) {
                    return true;
                }
                if (value === 1 && this.selectedRows.length !== 1) {
                    this.warningModal.message = 'Select one row please.';
                    this.showWarningModal(true);
                    return false
                }
                if (this.selectedRows.length === 0) {
                    this.warningModal.message = 'Select at least one row!';
                    this.showWarningModal(true);
                    return false
                }
                return true;
            },
            
        }
    }
</script>

<style lang="scss" module>

    .currentEntityFile {
        display: inline-flex;
        span {
            margin-left: 20px;
            padding: 3px;
            cursor: pointer;
        }
    }

    .bulkFilesError {
        position: absolute;
        z-index: 4;
        bottom: 5px;
        left: 11px;
        font-size: 11px;
        color: #ff3547
    }

    .exampleFile {
        display: inline-block;
        margin-top: 10px;
    }

    .uploadedFiles {
        background: rgb(241, 241, 241);
        height: 200px;
        width: calc(100%/2 - 8px);
        padding: 10px 15px;
        border-radius: 4px;
        overflow: auto;
    }

    .bulkFile {
        display: flex;
        border-bottom: 1px solid darken(rgb(241, 241, 241), 10%);
        align-items: center;
        &:last-child {
            border-bottom: none;
        }
    }

    .removeBulkFile {
        cursor: pointer;
        padding: 3px;
        margin-left: auto;
    }

    .excelFile {
        display: flex;
        padding: 5px 0;
    }

    .excelFileLabel {
        width: 120px;
        flex-shrink: 0;
        flex-grow: 0;
        align-items: center;
        display: flex;
    }

    .excelFileInput {
        flex-grow: 1;
    }

    .progress {
        margin: 0 20px;
        progress {
            width: 100%;
        }
    }

    .upload {
        width: calc(100%/2 - 8px);
        height: 200px;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        &:hover {
            .uploadArea {
                background: darken(#f2f2f2, 5%);
                border: 2px dashed  darken(#e3e3e3, 5%);
            }
        }
        .uploadArea {
            position: absolute;
            pointer-events: none;
            background: #f2f2f2;
            border: 2px dashed #e3e3e3;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
            outline: none;
            display: flex;
            align-items: center;
            text-align: center;
            justify-content: center;
        }
        input {
            width: 100%;
            height: 100%;
        }
    }

    .files {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
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



</style>
