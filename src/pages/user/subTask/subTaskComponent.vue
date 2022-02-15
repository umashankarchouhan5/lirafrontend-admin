<template>
    <div>
        <Loader v-if="isLoading" />

        <template v-if="ticket.ActionType === 1">
            <ValidationObserver ref="subTaskValidator">   
                <FormRow>
                    <div class="col-sm-8">
                        <InputText label="Document Brief"  v-model="reviewJson[0].documentBrief"  :readonly="reviewJson[0].documentdata_id !== 0 || readonly"  />
                    </div>
                </FormRow>
                <FormRow v-if="reviewJson[0].documentdata_id === 0 && !readonly">
                    <div class="col-sm-6">
                        <InputFile 
                            label="Select File" 
                            v-model="fileUpload"
                            :rules="{checkFileRegex: true}"
                        />
                    </div>
                    <div class="col-sm-4">
                        <FormButton left-icon="ios-send" type="success" @click="uploadAdminFile" >Save File</FormButton>

                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-6">
                        <InputText label="Document Name"  v-model="reviewJson[0].name" readonly />
                    </div>
                    <div class="col-sm-6">
                        <!-- <InputText label="Document Path"  v-model="reviewJson[0].path" readonly /> -->
                    <FormButton :prevent-default="false" v-if="reviewJson[0].name !== ''" size="small" type="text" :href="reviewJson[0].url" target="_blank"  tag="a" left-icon="md-eye">View</FormButton>
                    </div>
                </FormRow>
            </ValidationObserver>
            <ButtonGroup>
                <FormButton left-icon="ios-send" type="success" @click="submitAction" v-if="reviewJson[0].documentdata_id === 0 && !readonly">Submit</FormButton>
                <FormButton v-if="$route.name === 'SubTask'"  @click="backToTicketList" >Back to List</FormButton>
            </ButtonGroup>
        </template>

        <template v-if="ticket.ActionType === 2">
            <div v-if="reviewJson[0].invoice_id === 0 && !readonly">
                <ValidationObserver ref="subTaskValidator">   
                    <p v-if="reviewJson[0].invoice_id !== 0"><b>{{reviewJson[0].PaymentStatus}}</b> of <b>{{reviewJson[0].InvoiceNumber}}</b></p>
                    <DataTable :actions="true"
                        :data="feeList"
                        :columns="tableColumn"
                        @on-selection-change="selectChange">
                        <template slot="actionsLeft" v-if="reviewJson[0].invoice_id === 0 && !readonly && reviewJson[0].additionalCharge != 0">
                            <TableButton @click="() => addChargeOpen()">
                                <img src="../../../assets/images/plus.png" />
                                Add Charges
                            </TableButton>
                            <TableButton @click="() => deleteCharge()">
                                <img src="../../../assets/images/delete.png" />
                                Delete Charges
                            </TableButton>
                        </template>
                    </DataTable>
                    <div :class="$style.flexBox"><p><b>Total :</b> {{ getTotalNew }}</p></div>
                </ValidationObserver>
                <ButtonGroup>
                    <FormButton left-icon="ios-send" type="success" @click="submitAction" v-if="reviewJson[0].invoice_id === 0 && !readonly" >Generate Invoice</FormButton>
                    <FormButton left-icon="ios-close" type="primary" @click="closePopup" v-if="reviewJson[0].invoice_id === 0 && !readonly" >Cancel</FormButton>
                    <FormButton v-if="$route.name === 'SubTask'"  @click="backToTicketList" >Back to List</FormButton>
                </ButtonGroup>
            </div>
            
            <div v-else>
                <p v-if="reviewJson[0].invoice_id !== 0"><b>Invoice Number : </b> {{reviewJson[0].InvoiceNumber}}</p>
                <br  v-if="reviewJson[0].invoice_id !== 0" />
                <p v-if="reviewJson[0].invoice_id !== 0"><b>Invoice Status : </b> {{reviewJson[0].PaymentStatus}}</p>
                <br  v-if="reviewJson[0].invoice_id !== 0" />
                <p>{{reviewJson[0].Narration50}}</p>
                <div :class="$style.totalRow" v-if="reviewJson[0].FeeUSD">
                
                    <div>
                        Fees (in USD)<span>:</span>
                    </div>
                    <div>
                        <p> {{ reviewJson[0].FeeUSD.toFixed(2) }}</p>
                    </div>
                </div>
                <div :class="$style.totalRow" v-if="reviewJson[0].Tax">
                    <div>
                        Tax ({{ reviewJson[0].Taxpct }}%) <span>:</span>
                    </div>
                    <div>
                        <p> {{ reviewJson[0].Tax.toFixed(2) }}</p>
                    </div>
                </div>
                <div :class="$style.totalRow" v-if="reviewJson[0].Penalty">
                    <div>
                        Penalty <span>:</span>
                    </div>
                    <div>
                        <p> {{ reviewJson[0].Penalty.toFixed(2) }}</p>
                    </div>
                </div>
                <div >
                    <div v-for="(chargeItem,index) in AdditionalChargeArr" :key="index">
                        <div :class="$style.totalRow" >
                            <div>
                                {{chargeItem.chargeDesc}} <span>:</span>
                            </div>
                            <div>
                                <p> {{ chargeItem.chargeAmount.toFixed(2) }}</p>
                            </div>
                        </div>
                    </div>

                </div>

                <div :class="$style.totalRow" v-if="reviewJson[0].total">
                    <div>
                        Total Amount<span>:</span>
                    </div>
                    <div>
                        <p> {{ reviewJson[0].total.toFixed(2) }}</p>
                    </div>
                </div>
            </div>
        </template>

        <!-- RA Resignation Sub Task -->
        <template v-if="ticket.ActionType === 4">
            <ValidationObserver ref="subTaskValidator">   
                <FormRow>
                    <div class="col-sm-6">
                        <InputText label="To Email"  v-model="reviewJson[0].ToEmail" readonly />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-6">
                        <InputText label="CC" :readonly="reviewJson[0].mailout_id !== 0 || readonly" v-model="reviewJson[0].CC" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-6">
                        <InputText label="Subject" :readonly="reviewJson[0].mailout_id !== 0 || readonly" v-model="reviewJson[0].Subject" />
                    </div>
                </FormRow>

                <!-- <Attachment v-model="reviewJson[0].Attachment" :readonly="reviewJson[0].mailout_id !== 0 ? true: readonly"></Attachment> -->

                <FormRow>
                    <div class="col-sm-12" >
                        <EditorComponent :readonly="reviewJson[0].mailout_id !== 0 || readonly" :disabled="reviewJson[0].mailout_id !== 0 || readonly" v-model="reviewJson[0].body" />
                    </div>
                </FormRow>
            </ValidationObserver>
            <ButtonGroup>
                <FormButton left-icon="ios-send" type="success" @click="submitAction" v-if="reviewJson[0].mailout_id === 0 && !readonly" >Send</FormButton>
            
                <FormButton v-if="$route.name === 'SubTask'"  @click="backToTicketList" >Back to List</FormButton>
            </ButtonGroup>
        </template>


        <template v-if="ticket.ActionType === 5">
            <ValidationObserver ref="subTaskValidator">   
                <FormRow>
                    <div class="col-sm-6">
                        <InputText label="To Email"  v-model="reviewJson[0].ToEmail" :readonly="emailFlag === false" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-6">
                        <InputText label="CC" :readonly="reviewJson[0].mailout_id !== 0 || readonly" v-model="reviewJson[0].CC" />
                    </div>
                    <!-- <div class="col-sm-4">
                        <InputText label="Email Template Id" v-model="reviewJson[0].EmailTemplate_id" />
                    </div> -->
                </FormRow>
                <FormRow>
                    <div class="col-sm-6">
                        <InputText label="Subject" :readonly="reviewJson[0].mailout_id !== 0 || readonly" v-model="reviewJson[0].Subject" />
                    </div>
                </FormRow>

                <Attachment v-model="reviewJson[0].Attachment" :readonly="reviewJson[0].mailout_id !== 0 ? true: readonly"></Attachment>

                <FormRow>
                    <div class="col-sm-12" >
                        <EditorComponent :readonly="reviewJson[0].mailout_id !== 0 || readonly" :disabled="reviewJson[0].mailout_id !== 0 || readonly" v-model="reviewJson[0].body" />
                    </div>
                </FormRow>
            </ValidationObserver>
            <ButtonGroup>
                <FormButton left-icon="ios-send" type="success" @click="submitAction" v-if="reviewJson[0].mailout_id === 0 && !readonly" >Send</FormButton>
                
                <FormButton v-if="$route.name === 'SubTask'"  @click="backToTicketList" >Back to List</FormButton>
            </ButtonGroup>
        </template>

        <template v-if="ticket.ActionType === 3">
            <ValidationObserver ref="subTaskValidator">            
                <FormRow>
                    <div class="col-sm-4">
                        <InputText label="License Type"  v-model="reviewJson[0].LicenseProcessType" readonly />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-4">
                        <InputText label="Wallet Code" rules="required"  v-model="reviewJson[0].accountHead" :readonly="readonly "  />
                    </div>
                </FormRow>
            </ValidationObserver>

            <ButtonGroup>
                <FormButton left-icon="ios-send" type="success" @click="submitAction" v-if="!readonly" >Submit</FormButton>
                <FormButton v-if="$route.name === 'SubTask'"  @click="backToTicketList" >Back to List</FormButton>
            </ButtonGroup>
        </template>


        <Popup title="Success" type="success" :value="successModal.popupVisible" @close="() => successModal.popupVisible = false" :mask-closable="false" :closable="false">
            {{ successModal.message }}
            <FormButton slot="footer" @click="backToTicketList" v-if="$route.name === 'SubTask'" >Task List</FormButton>
            <FormButton slot="footer" @click="closeSuccessModal" v-if="$route.name === 'task'" >Close</FormButton>
        </Popup>
        <Popup title="Add Charge" type="info" :value="addChargeModal.visible" @close="() => addChargeModal.visible = false" :mask-closable="false" :closable="true">
            <FormRow v-if="addChargeModal.visible">
                <div class="col-sm-8">
                    <InputText label="Charge Description"  v-model="additionalChargeObj.chargeDesc" :readonly="readonly"  />
                </div>
                <div class="col-sm-4">
                    <InputAmount label="Charge Amount (In USD)"  v-model="additionalChargeObj.chargeAmount" :readonly="readonly"  />
                </div>
            </FormRow>
            <FormButton slot="footer" @click="addCharge" v-if="!readonly" >Add Charge</FormButton>
            <FormButton slot="footer" @click="addChargeModal.visible = false" v-if="!readonly" >Close</FormButton>
        </Popup>

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
    </div>
    
</template>

<script>

    import { getFSATicket, fsaaction, uploadFile } from './api';
    import Attachment from 'Components/attachment';
    import loadingMixin from 'Mixins/loadingMixin';
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import Loader from 'Components/layout/Loader';
    import DataTable from 'Components/DataTable'
    import tableColumn from './table';
    import { ValidationObserver } from 'vee-validate';
        
    export default {
        name: "SubTaskComponent",
        mixins: [ loadingMixin, validateSelectedRows ],
        props:{
            TicketReference:{
                type:[String]
            },
            ReferenceId:{
                type:[String,Number]
            }
        },
        components:{
            Attachment,
            Loader,
            DataTable,
            ValidationObserver
        },
        data(){
            return{
                ticket: [],
                reviewJson:[],
                successModal: {
                    popupVisible: false,
                    message: ''
                },
                fileUpload: null,
                readonly: false,
                emailFlag: false,
                selectedRows: [],
                tableColumn,
                addChargeModal: {
                    visible: false,
                },
                additionalChargeObj: {
                    chargeAmount: 0,
                    chargeDesc: '',
                },
                AdditionalChargeArr: []
            }
        },
        created(){
            this.getTicketData();
        },
        computed:{
            getTotalNew() {
                let price =  (this.reviewJson[0].lineTotal) + (this.AdditionalChargeArr.length > 0 ? this.AdditionalChargeArr.reduce((a,b) => {return a + b.chargeAmount}, 0)  : 0);
                price =  new Intl.NumberFormat('en-US').format(price);
                const priceArr = price.split('.')
                if(priceArr.length == 2){
                    if(priceArr[1].length == 1){
                        price = price + '0'
                    }
                }
                else{
                    price = price + '.00'
                }
                return price
            },
            getTotal(){
                const jsonData = this.reviewJson[0];
                return parseFloat(jsonData.FeeUSD) + parseFloat(jsonData.FeeUSD*(parseFloat(jsonData.Taxpct)/100)) + parseFloat(jsonData.Penalty);
            },
            userData() {
                return this.$store.state.user.user
            },
            feeList() {
                if(this.reviewJson.length > 0){
                    const arrToReturn = [];
                    arrToReturn.push(this.reviewJson[0]);
                    if(this.AdditionalChargeArr.length > 0){
                        this.AdditionalChargeArr.forEach((item,index) => {
                            const obj = {
                                Narration: item.chargeDesc,
                                lineTotal: item.chargeAmount !== 0 ? item.chargeAmount.toFixed(2) : '',
                                FeeUSD: '',
                                Taxpct: '',
                                Penalty: '',
                                Tax: '',
                                index: index
                            }
                            arrToReturn.push(obj);
                        })
                    }
                    return arrToReturn; 
                }else{
                    return [];
                }
            },
            status(){
                if(this.ticket.TaskStatus && this.ticket.TaskStatus !== 'Closed'){
                    return true;
                }
                else{
                    return false
                }
            }
        },
        watch:{
            reviewJson: {
                deep: true,
                handler(val){
                    if(val[0].ToEmail === undefined){
                        this.emailFlag = true;
                    }
                }
            },
            AdditionalChargeArr(val){
                this.reviewJson[0].additionalCharge = JSON.stringify(this.AdditionalChargeArr);
            }
        },
        methods:{
            addChargeOpen(){
                this.addChargeModal.visible = true
            },
            addCharge() {
                this.AdditionalChargeArr.push({
                    chargeDesc: this.additionalChargeObj.chargeDesc,
                    chargeAmount: this.additionalChargeObj.chargeAmount,
                });
                this.additionalChargeObj= {
                    chargeAmount: 0,
                    chargeDesc: '',
                }
                this.addChargeModal.visible = false;
            },
            deleteCharge() {
                const row = this.selectedRows[0]
                if(this.validateSelectedLength(1)){
                    if(row.index !== undefined){
                        this.AdditionalChargeArr.splice(row.index, 1);
                    }else{
                        this.warningModal.message = 'Original fee cannot be deleted.';
                        this.showWarningModal(true);
                    }
                }
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            closeSuccessModal(){
                this.successModal.popupVisible = false;
                this.$emit('closeActionPopup',true);    

            },
            closePopup() {
                this.$emit('closeActionPopup',true); 
            },
            uploadAdminFile(){
                this.showLoader();
                let data = new FormData();
                data.append('image',this.fileUpload, this.fileUpload.name)
                uploadFile(data).then(
                    res=> {
                        this.reviewJson[0].path = res.data.path;
                        this.reviewJson[0].url = res.data.url;
                        this.reviewJson[0].name = res.data.name;
                        this.fileUpload = null;
                        this.hideLoader();
                    },
                    err => {
                        this.hideLoader();
                    }
                )
            },
            getTicketData(){
                this.showLoader();
                getFSATicket({ticket_reference: this.TicketReference}).then(
                    res=>{
                        this.ticket = res.data[0];
                        this.hideLoader();
                        this.reviewJson = JSON.parse(this.ticket.reviewJson);
                        this.$store.commit('setSubTaskData',this.ticket);
                        if(this.reviewJson.length > 0 && this.reviewJson[0].additionalCharge !== undefined){
                            try {
                                const chargeJson = JSON.parse(this.reviewJson[0].additionalCharge);
                                if(chargeJson.length == 1 && chargeJson[0].chargeDesc == ''){

                                }
                                else{
                                    this.AdditionalChargeArr = chargeJson;
                                }
                            }
                            catch {

                            }
                        }
                        if(this.ticket.ActionType == 5 && this.ticket.TaskStatus !== "Closed" && this.ticket.TaskStatus !== "Completed"){
                            this.reviewJson[0].Attachment = []
                        }
                        else{
                            if(this.reviewJson[0].Attachment && this.reviewJson[0].Attachment === '') {
                                this.reviewJson[0].Attachment = []
                            }
                            else if(this.reviewJson[0].Attachment && this.reviewJson[0].Attachment !== '' && this.reviewJson[0].Attachment !== null){
                                var arr =  this.reviewJson[0].Attachment.split(',');
                                this.reviewJson[0].Attachment =  arr.map( (ele,i) => {
                                    const newArr = []
                                    newArr['name'] = 'Attachment ' + ( i + 1 );
                                    newArr['url'] = ele;
                                    return newArr;
                                })
                            }
                        }
                        if(this.ticket.adminuser_id === this.userData.user_id){
                            this.readonly = false;
                        }else{
                            this.readonly = true;
                        }
                    }
                )
            },
            submitAction(){
                this.$refs.subTaskValidator.validate().then(
                    result => {
                        if(result){
                            this.showLoader();
                            const form = {};
                            form.TicketReference = this.TicketReference;
                            form.reference_id = this.ReferenceId;
                            var review = this.reviewJson;
                            form.reviewjson = {
                                actiondata: review
                            }
                            fsaaction(form).then(
                                res => {
                                    this.getTicketData();
                                    if(this.ticket.ActionType && this.ticket.ActionType == 2){
                                        this.$emit('invoiceGenerated')
                                    }
                                    this.successModal.message = res.message;
                                    this.successModal.popupVisible = true;
                                    this.hideLoader();
                                },
                                err => {
                                    this.hideLoader();
                                }
                            )
                        }
                    }
                )
                
            },
            backToTicketList(){
                this.successModal.popupVisible = false;
                setTimeout(() => {
                    this.$router.push('/tasks')

                },100);
            }
        },
    }
</script>

<style lang="scss" module>
    .total {
        margin-bottom: 20px;
    }
    .totalRow,
    .totalRowSummary {
        display: flex;
        > div {
            padding: 10px 0px;
            display: flex;
            font-weight: 500;
            &:nth-child(1) {
                width: 30%;
                max-width: 200px;
                min-width: 150px;
                span {
                    margin-left: auto;
                }
            }
            &:nth-child(2) {
                width: 25%;
                max-width: 150px;
                min-width: 150px;
                padding-left: 40px;
                font-size: 14px;
                text-align: right;
                p{
                    margin-left: auto;
                    margin-bottom: 0px;
                }
            }
        }
    }

    .totalRowSummary {
        > div {
            &:first-child {
                font-size: 15px;
                font-weight: 500;
            }
            &:last-child {
                font-size: 17px;
                font-weight: 700;
            }
        }
    }
    .flexBox {
        margin-top: 15px;
        margin-right: 15px;
        display: flex;
        justify-content: flex-end;
    }

</style>
