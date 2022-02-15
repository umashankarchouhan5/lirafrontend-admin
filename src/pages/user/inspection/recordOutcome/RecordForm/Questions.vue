<template>
    <div>
        <div v-for="(item,i) in innerValue" :key="i">
            <div :class="$style.flex">

                <h4 :class="$style.heading">{{item.itemName}}</h4>

                <div :class="$style.flex" >
                    <div :class="$style.compliantStyle"> Compliant  &nbsp;</div>
                    <div> 
                        <FormYesNo v-model="item.isCompliantYN" :disabled="checkReadonly(item)" name="YesNo" :vid="`isCompliant-${i}`" @onChangeEvent="changeCompliant($event,item)" rules="required" /> 
                    </div>
                </div>

                <div>
                    <p  :class="$style.messageError" v-if="item.isCompliantYN == 'N'">
                        <Icon type="md-close-circle"  />
                    </p>
                    <p  :class="$style.messageSuccess" v-if="item.isCompliantYN == 'Y'">
                        <Icon type="md-checkmark-circle"   />
                    </p>
                </div>
            </div>
            <div :class="$style.questionBox">
                <br />
                <div v-for="(question,ind) in item.inspectionQuestionJson" :key="ind" >
                    <FormRow :class="$style.indentClass">
                        <div class="col-sm-9">
                            <p>{{question.QNo}}. {{question.QText}}</p>
                        </div>
                        <div class="col-sm-3" v-if="question.AnswerYN == true">
                            
                            <FormYesNo v-model="question.checkedYN" :disabled="checkReadonly(item)" :rules="{required:question.ignore !== true ? true: false}" name="YesNo" :vid="`checkedYN-${i}-${ind}`" @onChangeEvent="onChange($event,item)" />
                        </div>
                    </FormRow>
                    <FormRow :class="$style.indentClass">
                        <div class="col-sm-12" v-if="question.TextBoxOnYN === 'B' || ( question.TextBoxOnYN !== null && question.checkedYN !== null && question.TextBoxOnYN.toLowerCase() === question.checkedYN.toLowerCase())">

                            <InputTextArea v-model="question.notes" :readonly="checkReadonly(item)" rows="1" :vid="`notes-${i}-${ind}`" label="Notes" />
                            
                        </div>
                    </FormRow>
                </div>
                <FormRow :class="$style.indentClass">
                    <div class="col-sm-12">
                        <InputTextArea v-model="item.comment" :readonly="checkReadonly(item)" rows="5" maxlength="2000" :vid="`notes-${i}`" :label="`Comments for ${item.itemName}`" />
                    </div>
                </FormRow>
                <br />
                <Documents :readonly="checkReadonly(item)" v-model="item.documentJson" :itemName="item.itemName" :process_id="process_id" />
                <br />
            </div>
            <br />
            <hr />
            <br />
        </div>

    </div>
</template>

<script>

    import loadingMixin from 'Mixins/loadingMixin';
    import valueMixin from 'Mixins/valueMixin';
    import Documents from './table/Documents';
 
    export default {
        name: "Questions",
        mixins: [ loadingMixin, valueMixin ],
        props: {
            readonly: Boolean,
            process_id: [String, Number]
        },
        components: {
            Documents
        },
        data() {
            return {
                showedID: [],
                questionsId: [],
                manuallySelected: [],
                notManuallySelected: [],
            }
        },
        watch: {
            innerValue:{
                deep: true,
                handler(val){
                    if(val !== undefined && val !== null){
                        this.getHeading();
                        val.forEach(element => {
                            const checkNoEvery = element.inspectionQuestionJson.every(item => {
                                return item.checkedYN == 'N' || item.ignore == true;
                            })
                            if(checkNoEvery == true){
                                this.$emit('notCompliant',true);
                            }
                            const checkIfNotAllIgnore = element.inspectionQuestionJson.filter(item => {
                                return item.ignore == false;
                            })
                            const checkYes = element.inspectionQuestionJson.every(item => {
                                return item.checkedYN == 'Y' || item.ignore == true;
                            })
                            const checkNo = element.inspectionQuestionJson.filter(item => {
                                return item.checkedYN == 'N' && item.ignore !== true ;
                            })
                            // if(checkYes == true && checkIfNotAllIgnore.length > 0 && (!element.manualComplianceSelection)){
                            //     element.isCompliantYN = 'Y'
                            // }
                            if(checkYes == true && checkIfNotAllIgnore.length > 0 && (this.manuallySelected.indexOf(element.inspectionItem_id) == -1)){
                                element.isCompliantYN = 'Y'
                            }
                            else if(checkNo.length > 0 && checkIfNotAllIgnore.length > 0){
                                element.isCompliantYN = 'N'
                            }
                        });
                        const checkEachCompliant = val.every(item => {
                            return item.isCompliantYN == 'Y';
                        })
                        if(checkEachCompliant == true) {
                            this.$emit('yesCompliant')
                        }
                        else{
                            this.$emit('notCompliant',true);
                        }
                    }
                }
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
        },
        methods: {
            checkReadonly(item) {
                if( ( this.readonly && this.$route.name !== 'ReinspectionOutcomeForm' ) || ( this.$route.name == 'ReinspectionOutcomeForm' && (item.isCompliantYN == 'Y' && ( this.manuallySelected.indexOf(item.inspectionItem_id) == -1 && this.notManuallySelected.indexOf(item.inspectionItem_id) == -1 ) )) ) {
                    return true
                }
                else return false
            },
            getDocumentJson(documentJson) {
                if(documentJson !== null){
                    return documentJson
                }
                else{
                    return []
                }
            },
            changeCompliant(e,val){
                this.innerValue.forEach(ele => {
                    if(val.inspectionItem_id == ele.inspectionItem_id){
                        // ele.manualComplianceSelection = true;
                        this.manuallySelected.push(val.inspectionItem_id);
                        if(e.toLowerCase() == 'y'){
                            ele.inspectionQuestionJson.forEach( item => {
                                item.checkedYN = 'Y'
                            } )
                        }
                    }
                })
            },
            onChange(e,item){
                this.notManuallySelected.push(item.inspectionItem_id);
                this.$emit('selectionChange',e);
            },
            getHeading() {
                for(var k = 0 ; k <this.innerValue.length ; k++){
                    
                    if(this.showedID.indexOf(this.innerValue[k].inspectionItem_id) === -1){
                        this.questionsId.push(this.innerValue[k].QNo)
                        this.showedID.push(this.innerValue[k].inspectionItem_id);
                    }
                }
            },
            
        },
    }
</script>

<style lang="scss" module>
    .compliantStyle{
        margin-right: 10px;
    }
    .indentClass{
        margin-left: 0px;
        margin-right: 0px;
    }
    .heading {
        margin-bottom: 15px;
        margin-right: 10px;
    }
    .questionBox {
        background: #eee;
    }
    .flex{
        display: flex;
    }
    .messageError {
        :global {
            .ivu-icon {
                font-size: 21px;
                margin-right: 3px;
                margin-top: -4px;
                vertical-align: middle;
                color: #ff3547;
            }
        }
    }
    .messageSuccess {
        :global {
            .ivu-icon {
                font-size: 21px;
                margin-right: 3px;
                margin-top: -4px;
                vertical-align: middle;
                color: #00ff00;
            }
        }
    }
</style>
