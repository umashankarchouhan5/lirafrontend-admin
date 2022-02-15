<template>
    <div :class="$style.login">
        <div :class="$style.wrapper">
            <div :class="$style.logo">
                <img v-if="companyLogo" :src="companyLogo" alt="Company Logo"/>
            </div>

            <form :class="$style.form">
                <Loader v-if="isLoading" />
                <ValidationObserver v-slot="{ passes }">
                    <FormRow>
                        <InputText
                                v-model="email"
                                label="User ID"
                                focused
                                rules="required"
                        />
                    </FormRow>
                    <FormRow>
                        <InputText
                                v-model="password"
                                label="Password"
                                rules="required"
                                type="password"
                        />
                    </FormRow>
                    <FormRow>
                        <div :class="$style.button">
                            <FormButton type="info" size="big" :fullWidth="true" @click="passes(login)">Sign In</FormButton>
                        </div>
                    </FormRow>
                </ValidationObserver>
            </form>
            <div :class="$style.logoBottom">
                <img src="../../../assets/images/lira-logo.png" alt="Lira Logo"/>
            </div>
        </div>
        <Footer/>
        <Popup title="Information" :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.confirm" type="success" @click="confirmForceLogin">Confirm
                </FormButton>
                <FormButton v-if="warningModal.buttons.cancel" @click="() => showWarningModal(false)">Cancel
                </FormButton>
            </div>
        </Popup>
    </div>
</template>

<script>
    import { loginRequest, getLogo, logoutRequest } from "./loginActions";
    import Auth from 'Utils/auth'
    import Ajax from 'Utils/ajax'
    import {mapMutations} from 'vuex';
    import Footer from "Components/layout/Footer";
    import Loader from "Components/layout/Loader";
    import loadingMixin from "Mixins/loadingMixin";
    import { ValidationObserver } from 'vee-validate'

    export default {
        name: "Login",
        data() {
            return {
                email: "",
                password: "",
                companyLogo: '',
                warningModal: {
                    visible: false,
                    message: '',
                    buttons: {
                        ok: true,
                        confirm: false,
                        cancel: false
                    }
                },
                force_login: false,
            };
        },
        mixins: [loadingMixin],
        components: {
            Footer,
            ValidationObserver,
            Loader
        },
        created() {
            getLogo().then(res => {
                this.companyLogo = res.data;
            });
            // Auth.logoutUser();
            // Ajax.removeToken();
            // Ajax.removeToken();
            this.logout();
        },
        methods: {
            ...mapMutations([
                'setUser',
            ]),
            login() {
                this.showLoader();
                const {email, password, force_login} = this;
                loginRequest({
                    email,
                    password,
                    force_login
                })
                    .then(this.handleSuccess,this.hideLoader());
            },
            handleSuccess(response) {
                this.hideLoader();
                if (typeof response.force_flag !== 'undefined' && response.force_flag==1) {
                    this.warningModal.message = response.message;
                    this.warningModal.buttons.confirm = true;
                    this.warningModal.buttons.cancel = true;
                    this.showWarningModal(true);
                } else {
                    Auth.logUser(response);
                    Ajax.setToken(Auth.getUserToken());
                    
                    this.$router.push({'path': '/tasks'})
                }
            },
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            confirmForceLogin(){
                this.force_login = true;
                this.login();
                this.showWarningModal(false);
            },
            logout(){
                if(localStorage.userData){
                    logoutRequest().then(
                        res => {
                            Auth.logoutUser();
                            Ajax.removeToken();
                            if(localStorage.timeOfNewRefresh){
                                localStorage.removeItem('timeOfNewRefresh');
                            }

                        },
                        err => {
                            if(localStorage.timeOfNewRefresh){
                                localStorage.removeItem('timeOfNewRefresh');
                            }
                            Auth.logoutUser();
                            Ajax.removeToken();
                        }
                    )
                }
                if(!localStorage.userData && this.userData !== null){
                    Auth.logoutUser();
                    Ajax.removeToken();
                }
            },
        }
    };
</script>

<style module lang="scss">
    .form {
        padding: 5px 15px;
        position: relative;
    }
    .new {
        color: #37a0cf;
        font-size: 14px;
    }
    .button {
        padding-top: 5px;
    }
    .login {
        background: #9ac2d2 url("../../../assets/images/login-bg-v1.jpg") 0 14% no-repeat;
        background-size: cover;
        height: auto;
        min-height: 100vh;
    }

    .formInput {
        margin-bottom: 20px;
    }

    .wrapper {
        width: 330px;
        background: rgba(245, 246, 249, 0.87);
        margin-left: 30px;
        padding: 20px;
        position: absolute;
        bottom: 0;
        top: 0;
        box-shadow: 0 5px 4px rgba(0, 0, 0, 0.24);
    }

    .logo {
        margin: 50px 0 30px;

        > img {
            display: block;
            margin: 0 auto;
        }
    }

    .logoBottom {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 55px;

        img {
            max-width: 90px;
            display: block;
            margin: 0 auto;
        }
    }
</style>
