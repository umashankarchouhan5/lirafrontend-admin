<template>
    <FormWrapper :isLoading="isLoading">
        <PageTitle title="Help" slot="title" />
        <div v-html="text"></div>
    </FormWrapper>
</template>

<script>

    import { getHelpText } from './api'
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import loadingMixin from 'Mixins/loadingMixin'

    export default {
        name: "HelpPage",
        data() {
            return {
                text: ''
            }
        },
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle
        },
        created() {
            this.showLoader();
            getHelpText({
                process_id: this.$route.params.id,
            }).then(response => {
                this.text = response.data.helptextAdmin;
                this.hideLoader();
            }).catch(this.hideLoader)
        }
    }
</script>
