<template>
    <FormWrapper>
        <PageTitle title="Risk Matrix By ID" slot="title" link="/help/117" />

        <TicketHeader  :ticketValue="ticketValue" v-if="heading" />
        <FormRow>
            <div class="col-sm-12">
                
                <DataTable :actions="true"
                    :data="complianceList"
                    :columns="tableConfig()"
                ></DataTable>
            </div>
        </FormRow>

        <Popup :title="questionModal.title"   :value="questionModal.visible" width="900" @close="() => showQuestionModal(false)">
            
            <Questions v-model="selectedParam" v-if="selectedParam !== null"></Questions>

            <div slot="footer">
                <FormButton  @click="() => showQuestionModal(false)">Close</FormButton>
            </div>
        </Popup>
        
    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import {  fetchRiskMatrixByID } from './api';
    import PageTitle from 'Components/layout/PageTitle';
    import loadingMixin from 'Mixins/loadingMixin'
    import moment from 'moment';
    import Questions from './components/question';
    import DataTable from 'Components/DataTable'
    import tableConfig from './tableConfig/formTable'

    export default {
        name:'RiskMatrixGrid',
        mixins: [loadingMixin],
        components:{
            PageTitle,
            FormWrapper,
            Questions,
            DataTable
        },
        data(){
            return{
                tableConfig,
                instructionData:[],
                popupSuccess: {
                    isVisible: false,
                },
                testTitle: 'Hii this is test',
                nextPage: true,
                cspType:[],
                selectedStatus: null,
                yearSelected: null,
                statuses: [],
                complianceList: [],
                selectedParam: null,
                questionModal:{
                    visible: false,
                    title: '',
                },
                heading: null,
            }
        },
        computed:{
            userData() {
                return this.$store.state.user.user
            },
            currentProcessId() {
                return this.$store.state.common.currentProcessId
            },
            ticketValue() {
                return {
                    First: this.heading,
                    Second: '',
                    Third: ''
                }
            }
        },
        created(){
            this.fetchData();
        },
        methods:{
            onPop(index){
                var item = this.complianceList[index]
                this.setData(item).then(
                    res => {
                        // setTimeout(() => {
                            // this.showQuestionModal(true);
                        // },1000)

                    }
                )
                
            },
            async setData (item){
                Promise.all([this.questionModal.title =await item.ParameterDetail,
                this.selectedParam = await JSON.parse(item.QuestionJson),
                ]).then(this.showQuestionModal(true))
                return true;
            },

            showQuestionModal(val){
                this.questionModal.visible = val;
                if(val === false){
                    this.selectedParam = null;
                }
            },
            getById(){
                if (this.validateSelectedLength(1)) {
                    var row = this.selectedRows[0];
                    this.$router.push(`riskMatrixByID/${row.Compliance_id}`)
                }
            },
            
            backToInstruction(){
                this.$router.push('/tasks');
            },
            fetchData(){
                fetchRiskMatrixByID({Compliance_id:this.$route.params.id}).then(
                    res=> {
                        this.complianceList = res.data;
                        this.heading = this.complianceList[0].ICSPName;
                    }
                )
            },
            
        }
    }
</script>


<style lang="scss" module>

    .filter {
        margin: -10px 0 10px;
    }

    .filterItem {
        display: inline-block;
        margin: 0 15px 15px 0;
    }

    .filterItemCheckbox {
        flex-basis: auto;
        align-self: flex-start;
        margin-top: 13px;
    }

</style>