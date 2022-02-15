<template>
    <ValidationObserver ref="observer" >

        <PageTitle title="Add Conversion" slot="title" />
        <FormRow>
            <!-- <SideLogo></SideLogo> -->
            <div class="col-sm-12">
                <div :class="$style.register">
                    <FormRow>
                        <div class="col-md-6">
                            <div class="col-sm-6">
                                <FormSelect label="Month"
                                    :disabled="readonly"
                                    v-model="form.month"
                                    :items="months"
                                    item-name="label"
                                    rules="required"
                                    item-value="id"/>
                            </div>
                            <div class="col-sm-6">
                                <YearSelect label="Year" :readonly="readonly" v-model="form.year" rules="required" />
                            </div>
                        </div>
                        <div class="col-md-6">
                            <InputText type="number"  label="USD To SCR Rate" v-model="form.rate" rules="required" />
                        </div>
                    </FormRow>

                    <div :class="$style.button">
                        <ButtonGroup>
                            <FormButton type="success"  @click="formSubmit">Save</FormButton>
                            <FormButton type="info"  @click="() => backToList()">Cancel</FormButton>
                        </ButtonGroup>
                    </div>
                    <div :class="$style.clearFix"></div>
                </div>

                
            </div>
        </FormRow>
        <Popup :value="successModal.visible" :title="successModal.title" type="success" :closable="false" :maskable="false" @close="() => successModal.visible = false">
            <div>
                {{ successModal.message }}
            </div>
            <div slot="footer">
                <FormButton @click="() => backToList()">Back to List</FormButton>
            </div>
        </Popup>
        <Popup :value="warningModal.visible" :title="warningModal.title" type="info" @close="() => warningModal.visible = false">
            <div>
                {{ warningModal.message }}
            </div>
            <div slot="footer">
                <FormButton @click="() => warningModal.visible = false">Close</FormButton>
            </div>
        </Popup>
    </ValidationObserver>
    
    
</template>

<script>

    import PageTitle from "Components/layout/PageTitle";
    import {saveMonthlyConversion, fetchMonthlyConversionByDate, saveMonthlyConversionByDate } from "../api";
    import { ValidationObserver } from "vee-validate";
    import InputText from "Components/form/InputText";

    export default {
        name: "Register",
        data() {
            return {
                companyLogo: '',
                onSubmitError: false,
                form: {
                    rate: '',
                    month: '',
                    year: '',
                },
                months: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ].filter((item, i) => {
                    var date = new Date();
                    var month = date.getMonth();
                    return i <=month
                }).map((item,i)=>{
                    return {
                        id: i + 1,
                        label: item
                    }
                }),
                warningModal: {
                    visible: false,
                    title: '',
                    message: ''
                },
                successModal: {
                    visible: false,
                    title: 'Success',
                    message: ''
                },
                date: null,
                mode: null,
                readonly:false,
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user; 
            },
        },
        created() {
            this.form.month = new Date().getMonth()+1;
            this.form.year = new Date().getFullYear();
            this.date = this.$route.params.date;
            if(typeof this.date!='undefined'){
                this.mode = 'edit';
                this.fetchMonthlyConversionByDate(this.date);
            }
        },
        watch:{
        },
        components: {
            PageTitle,
            ValidationObserver,
            InputText,
        },
        methods: {
            fetchMonthlyConversionByDate(){
                fetchMonthlyConversionByDate({date:this.date}).then(this.handleSuccessResponse)
            },
            handleSuccessResponse(res){
                this.form.rate = res.data[0].rate;
                this.form.month = new Date(res.data[0].Date).getMonth()+1;
                this.form.year = new Date(res.data[0].Date).getFullYear();
                this.readonly = true;
            },
            formSubmit() {
                this.$refs.observer.validate().then(result=>{
                    if(result){
                        if(this.form.rate>0)
                        {
                            if(this.mode=='edit'){
                                const editData = {
                                    'month': this.form.month,
                                    'year': this.form.year,
                                    'rate': this.form.rate,
                                    'isEdit': 1,
                                    'Date': this.date
                                };
                                saveMonthlyConversionByDate(editData).then(this.handleEditResponse)
                            } else {
                                saveMonthlyConversion(this.form).then(this.handleResponse)
                            }
                        } else{
                            return false;
                        }
                    }
                })
                
            },
            handleEditResponse(res){
                if(res.status) {
                    this.successModal.visible = true;
                    this.successModal.message = res.message;
                }
            },
            handleResponse(response) {
                if(response.status) {
                    this.successModal.visible = true;
                    this.successModal.message = response.message;
                }
            },
            backToList(){
                this.$router.push('/monthlyConversions');
            },
        }
    };
</script>

<style lang="scss" module>
    .registerSuccess {
        text-align: center;
        img {
            display: block;
            margin: 40px auto;
        }
        h1 {
            margin-bottom: 20px;
        }
        h4 {
            margin-bottom: 15px;
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
        }
    }

    .register {
        padding-top: 30px;
        width: 600px;
        margin: 0 auto 0 0;
        h4 {
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
            margin-bottom: 25px;
        }
    }

    .na {
        margin-top: 10px;
        display: block;
    }
    .account {
        padding-top: 12px;
    }
    .agreement {
        margin: -10px 0 30px;
    }
    .terms{
        h3{
            margin: 15px 0px;
        }
        p{
            text-align: justify;
        }
    }
    .showPurposeMessage{
        font-size: 11px;
        margin-top: 10px;
        color: #3c8dbc;
    }
    .clearFix{
        clear: both;
        padding: 30px;
    }
</style>
