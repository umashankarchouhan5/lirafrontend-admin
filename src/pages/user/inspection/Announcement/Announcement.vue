<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Announcement" slot="title"  />

        <EmailTemplating :email="email" backTo="/inspection" :TicketReference="email.TicketReference" :additional-attachment="false" />

        
    </FormWrapper>
</template>

<script>
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import loadingMixin from 'Mixins/loadingMixin';
    import { createInspectionAncmntLetr } from '../api';
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
                inspection_id: null,
            }
        },
        created() {
            this.inspection_id = this.$route.params.inspection_id;
            this.genFinalResponse();
        },
        methods: {
            
            genFinalResponse() {
                this.showLoader();
                createInspectionAncmntLetr({inspection_id: this.inspection_id}).then( this.processData) 
            },
            
            processData(response) {
                this.email = response.data[0][0];
                this.hideLoader();
            },
        }
        
    }
</script>