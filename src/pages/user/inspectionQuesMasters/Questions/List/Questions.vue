<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Inspection Item" slot="title" />
        <TicketHeader  :ticketValue="ticketValue" />
        <DataTable :actions="true"
                   :data="Questions"
                   :columns="config"
                   :is-loading="isLoading"
                   @on-selection-change="selectChange"
                   @on-page-change="pageChange"
                   :pagination="pagination"
                   @on-sort-change="sortChange">
            <template slot="actionsLeft">
                <TableButton @click="() => addNew()">
                    <img src="../../../../../assets/images/plus.png" alt="">
                    Add
                </TableButton>
                <TableButton @click="() => pushTo('edit')">
                    <img src="../../../../../assets/images/edit.png" />
                    Edit
                </TableButton>
                <!-- <TableButton @click="() => pushTo('view')">
                    <img src="../../../../assets/images/eye.png" />
                    Questions
                </TableButton> -->
            </template>
        </DataTable>
        <FormButton type="primary" @click="backToItems" left-icon="ios-arrow-back" >Back to list</FormButton>

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

    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import config from './table';
    import loadingMixin from 'Mixins/loadingMixin';
    import { getInspectionItemsQuestions, getInspectionById } from '../api';
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    export default {
        name: "QuestionMasters",
        mixins: [loadingMixin,validateSelectedRows],
        data() {
            return {
                filtering: {
                    entityTypes: [],
                    entityTypeSelected: null,
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
                warningModal: {
                    visible: false,
                    buttons: {
                        ok: true,
                        confirm: false,
                        cancel: false
                    }
                },
                Questions: [],
                config,
                selectedRows: [],
                inspection_id: null,
                inspectionitem_name: '',
            }
        },
        created() {
            this.inspection_id = this.$route.params.inspection_id;
            this.getInspectionData();
            this.getDataByFilter();
        },
        watch: {
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
            ticketValue() {
                return {
                    First: '',
                    Second: this.inspectionitem_name,
                    Third: ''
                }
            }
        },
        components: {
            FormWrapper,
            PageTitle,
            DataTable
        },
        methods: {
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            backToItems(){
                this.$router.push('/inspectionQuesMasters');
            },
            sortChange(data) {
                this.sorting.key = data.key;
                this.sorting.order = data.order;
                this.getDataByFilter()
            },
            pageChange(page) {
                this.pagination.page = page;
                this.getDataByFilter()
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            search(){
                this.pagination.page = 1;
                this.getDataByFilter()
            },
            getDataByFilter() {
                this.showLoader();
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;

                const filters = {};
                if(this.inspection_id!=null){
                    const data = {
                        user_id: this.userData.user_id,
                        inspection_id: this.inspection_id,
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
                    getInspectionItemsQuestions(data)
                        .then(this.handleResponse)
                        .catch(this.handleError)
                }
                
            },
            handleResponse(response) {
                this.hideLoader();
                if(response.data.length > 0){
                    var list = response.data.map( ele => {
                        if(ele.AnswerYN==1) {
                            ele.AnswerYN = 'Yes';
                        } else {
                            ele.AnswerYN = 'No';
                        }
                        if(ele.AnswerTextbox==1) {
                            ele.withdrawal = 'Yes';
                        } else{
                            ele.withdrawal = 'No';
                        } 
                        return ele;
                    })
                }
                else{
                    var list = [];
                }
                this.Questions = list;
                this.pagination.total = response.NumberOfRecords;
            },
            getInspectionData() {
                getInspectionById({id:this.inspection_id})
                        .then(this.handleInspectionResponse)
            },
            handleInspectionResponse(res) {
                this.inspectionitem_name = res.data[0].Name;
            },
            pushTo(mode) {
                if (this.validateSelectedLength(1)) {
                    let id = this.selectedRows[0].id; // allow only the first row
                    if( mode== 'edit' ){ // edit is clicked
                        this.$router.push({ path: `/inspectionQuesMasters/questions/edit/${this.inspection_id}/${id}` })
                    }else if( mode== 'del' ){
                        // this.$router.push({ path: `/DocumentMasters/del/${Documentcode}` })
                    }else if( mode== 'view' ){
                        this.$router.push({ path: `/inspectionQuesMasters/questions/${id}` })
                    }
                }
            },
            addNew() {
                this.$router.push({ path: `/inspectionQuesMasters/questions/add/${this.inspection_id}` })
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
