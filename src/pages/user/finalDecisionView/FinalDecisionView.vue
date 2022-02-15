<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Final Decision" slot="title"  />

        <EmailTemplating :email="email" backTo="/tasks" :TicketReference="TicketReference" />

        
    </FormWrapper>
</template>

<script>
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import loadingMixin from 'Mixins/loadingMixin';
    import { generateFinalResponse } from './api';
    import EmailTemplating from 'Components/emailTemplating'

    export default {
        name: "FinalDecisionView",
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle,
            EmailTemplating
        },
        data() {
            return {
                email: {},
                signee_id: null,
                TicketReference: null,
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
        },
        created() {
            this.TicketReference = this.$route.params.ticketReference;
            this.signee_id = this.$route.params.signee_id;

            if(this.userData !== null && (this.userData.is_manager || this.userData.is_Department_head || this.userData.is_Director)) this.genFinalResponse();
            else this.$router.push("/unauthorize");
        },
        methods: {
            
            genFinalResponse() {
                this.showLoader();
                generateFinalResponse({TicketReference: this.TicketReference, signee_id: this.signee_id}).then( this.processData) 
            },
            
            processData(response) {
                this.email = response.data[0][0];

                this.hideLoader();
            },
        }
        
    }
</script>