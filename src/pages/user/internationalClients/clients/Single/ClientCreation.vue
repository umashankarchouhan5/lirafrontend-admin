<template>
    <ValidationObserver ref="observer" v-slot="{ passes }">

        <PageTitle :title="$route.params.id ? 'Edit International Client' : 'Create International Client'" slot="title" />
        <FormRow>
            <!-- <SideLogo></SideLogo> -->
            <div class="col-sm-3"></div>
            <div class="col-sm-9">
                <div :class="$style.register">
                    <FormRow>
                        <div class="col-sm-4">
                            <InputText label="Name"
                                v-model="form.Name"
                                vid="Name"
                                rules="required" />
                        </div>
                        <div class="col-sm-6">
                            <AddressInput   label="Address" rules="required"  v-model="form.Address_id" />

                        </div>
                    </FormRow>
                    <FormRow>
                        <div class="col-sm-4">
                             <InputText label="Communication Code"
                                v-model="form.CommCode"
                                vid="CommCode"
                                :maxlength="max"
                                rules="required" />
                        </div>
                        <div class="col-sm-4">
                             <InputText label="Account Head"
                                v-model="form.AccountHead"
                                vid="AccountHead"
                                rules="required" />
                        </div>
                    </FormRow>
                    <div :class="$style.button">
                        <ButtonGroup>
                            <FormButton type="success" v-if="!$route.params.id" @click="passes(formSubmit)">Create Client</FormButton>
                            <FormButton type="success" v-if="$route.params.id" @click="passes(formSubmit)">Save</FormButton>
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
    import {createIntlClients, getClientsList } from "../api";
    import { ValidationObserver } from "vee-validate";
    import { RadioGroup, Radio } from 'view-design'
    import AddressInput from 'Components/form/addressInput/AddressInput';

    export default {
        name: "Register",
        data() {
            return {
                max: 3,
                companyLogo: '',
                onSubmitError: false,
                form: {
                    id: '',
                    AccountHead: '',
                    CommCode: '',
                    Name: '',
                    Address_id: '',
                },
                international: [
                    {
                        name: 'International',
                        value: 1,
                    },
                    {
                        name: 'Local',
                        value: 0,
                    },
                ],
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
                entityCreated: false,
                emailSent: false,
                otp: {
                    isModalVisible: false,
                },
                terms: {
                    success: {
                        isVisible: false,
                        message: ''
                    }
                },
            }
        },
        computed: {
            
            userData() {
                return this.$store.state.user.user; 
            },
        },
        created() {
            if(this.$route.params.id){
                this.getClientData();
            }
            
        },
        watch:{
        },
        components: {
            PageTitle,
            ValidationObserver,
            AddressInput,
        },
        methods: {
            getClientData() {
                getClientsList({client_id: parseInt(this.$route.params.id)}).then(
                    res => {
                        this.form = res.data[0];
                    }
                )
            },
            formSubmit() {
                
                if(this.$route.params.id){
                    this.form.client_id = parseInt(this.$route.params.id);
                }
                if(this.$route.params.entity_id){
                    this.form.entity_id = parseInt(this.$route.params.id);
                }
                createIntlClients(this.form).then(this.handleResponse)
            },
            handleResponse(response) {
                let data = response;
                this.msgContent = data.message;
                this.successModal.message = data.message;
                this.successModal.visible = true;
            },
            backToList(){
                this.$router.push('/intlClients');
            }
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
