<template>
    <div>
        <div :width="700">
            <RepCode v-if="ticket && ticket !== null && ticket.process_id == 2002 && stepId == 1" />
            <div v-for="(item, i) in modifiedTicket"  :key="item.Qid">

                <div :class="$style.flexClass" v-if="item.Page === stepId && item.BlockJson !== null" >

                    <h4 :class="[item.isSubBlock === 1 ? $style.indent : '']" class="mr-3 pr-3">{{getBlockLabel(item)}} &nbsp;&nbsp;&nbsp;</h4>
                    <FormCheckbox :class="$style.pad" v-if="checkNa(item)" disabled name="NA Box"   v-model="item.isNA" ><span ><b> NA</b></span></FormCheckbox>

                </div>

                <br v-if="item.Page === stepId && item.BlockJson !== null" />

                <div :class="indentStyle(item)" >
                    <ListItem  v-model="modifiedTicket[i]" readonly  v-if="item.Page === stepId && item.SkipWhenField_id === null && item.FieldType !== null && item.FieldType !== ''" disabled  >
                        <div :class="$style.flexClass">
                            <p v-if="item.FieldType.toLowerCase() ==='yesno' || item.FieldType.toLowerCase() ==='checkbox'">{{item.Label}}</p> 
                        </div>
                    </ListItem>
                </div>
                <div v-if="item.Page === stepId && item.SkipWhenQid !== null && item.FieldType !== null && item.FieldType !== ''" :class="indentStyle(item)">
                    <ListItem  v-model="modifiedTicket[i]" readonly  disabled  >
                        <div :class="$style.flexClass">
                            <p v-if="item.FieldType.toLowerCase() ==='yesno' || item.FieldType.toLowerCase() ==='checkbox'"><b v-if="item.FieldNumber !== null && item.FieldNumber !== ''">{{item.FieldNumber}}. &nbsp;</b> {{item.Label}}</p> 
                            <!-- <p :class="$style.firstItem"><b>{{item.Label}} &nbsp; : </b></p> -->
                            <!-- <span v-html="item.QText"></span>  -->
                        </div>
                    </ListItem>
                </div>
            </div>

            <ButtonGroup>
                <FormButton type="primary" v-if="stepId !== 1" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
                <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
            </ButtonGroup>
        </div>
    </div>
</template>

<script>

    import ListItem from './subComponent/listRenderV3';
    import RepCode from './subComponent/RepCode';
    import countriesMixin from 'Mixins/countriesMixin';

    export default {
        name: "GeneralInfo", 
        mixins: [ countriesMixin],
        components: {
            ListItem,
            RepCode
        },
        data() {
            return {
                isModalVisible: false,
                isAddressSame: false,
                indentClass: this.$style.indent,
                disabledIds: [],
                ids:'',
                modifiedTicket:[]
            }
        },
        props: {
            readonly: Boolean,
            stepId: Number,
        },
        watch:{
            ticket:{
                deep: true,
                handler(val){
                    if(val !== {}){
                        val.forEach(element => {
                            if(element.isNA !== undefined){
                                if(element.isNA === 1){
                                    this.disableData(element,true);
                                }
                            }
                        });
                    }
                }
            },
            'ticket.Stats':{
                deep: true,
                handler(val){
                }
            },
            ids(val){
                var check = Boolean(this.disabledIds.find( item => {
                    return val === item
                }))
                if(check === false){
                    this.disabledIds.push(val);
                }
            }
        },
        computed:{
            ticket() {
                return this.$store.state.ticket.ticket;
            },
            
            
        },
        created( ){
            this.getModifiedData();
        },
        methods: {
            getModifiedData(){
                this.modifiedTicket = JSON.parse(this.ticket.DynamicJson);
            },
            indentStyle(item){
                if(item.FormBlock_id !== null && item.isSubBlock !== 1){
                    return this.$style.indent
                }
                else if(item.FormBlock_id !== null && item.isSubBlock === 1){
                    return this.$style.indent1;
                }
                else{
                    return '';
                }
            },
            pushDisabled(val){
                // if(val !== this.ids){
                    // this.ids = val;
                // }
                
            },
            getBlockId(box){
                var block1 = JSON.parse(box.BlockJson);
                var disabledValue = block1[0].id;
                return disabledValue
            },
            disableData(box,val){
                if(val === true){
                    var id = this.getBlockId(box);
                    // this.pushDisabled(id)
                    this.disabledIds.push(id);
                }
                if(val === false){
                    var id = this.getBlockId(box);
                    var index = this.disabledIds.indexOf(id);
                    this.disabledIds.splice(index,1);

                }
            },
            getDisabled(item){
                if(item.FormBlock_id !== null){
                    var check = this.disabledIds.some( val => {
                        return val === item.FormBlock_id
                    })
                    return check;
                }else{
                    return false;
                }
            },
            checkNa(item){
                var block = JSON.parse(item.BlockJson);
                return block[0].allowNA
            },
            getBlockLabel(item){
                try{
                    JSON.parse(item.BlockJson)

                }catch(err){

                }
                var block = JSON.parse(item.BlockJson);
                return block[0].name;
            },
            saveRequest(activeStep) {
                this.$emit('onSave', activeStep)
            },
            nextStep() {
                this.$emit('nextStep')
            },
            
            prevStep() {
                this.$emit('prevStep')
            }
        }
    }
</script>

<style lang="scss" module>
    .pad {
        padding-left: 30px;
    }
    .indent {
        margin-left: 20px;
    }
    .indent1{
        margin-left: 40px;
    }
    .flexClass {
        display: flex;
        justify-content: flex-start;
        .firstItem{
            min-width: 40px;
        }
    }
    .checkboxes {
        display: flex;
        margin-bottom: 20px;
        > span {
            margin-right: 30px;
        }
    }
    .selectSource {
        display: flex;
        justify-content: space-between;
        min-width: 200px;
    }
</style>
