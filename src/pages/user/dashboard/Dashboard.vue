<template>
    <FormWrapper title="Dashboard" :is-loading="isLoading">
        <PageTitle title="Dashboard" slot="title" />
        <FormRow>
            <div class="col-lg-4">
                <Card title="My Tasks">
                    <Tasks :items="tasks" @onClick="setStatusId"/>
                </Card>
            </div>
            <div class="col-lg-4">
                <Card title="Reminders">
                    <Reminds :items="reminders" />
                </Card>
            </div>
            <div class="col-lg-4">
                <Card title="Annual Renewals" class="no-padding">
                    <Renewals :data="renewals" height="175px" />
                </Card>
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-4">
                <Card title="My Tasks">
                    <Requests :items="requests" @onClick="setStatusId"/>
                </Card>
            </div>
            <div class="col-lg-4 ">
                <Card title="My Entities" class="no-padding">
                    <Entities :data="entities" height="175px" />
                </Card>
            </div>
            <div class="col-lg-4">
                <Card title="Notices">
                    <Notices :items="notices" />
                </Card>
            </div>
        </FormRow>
    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper'
    import PageTitle from 'Components/layout/PageTitle'
    import loadingMixin from 'Mixins/loadingMixin'
    import { Card, Tasks, Reminds, Requests, Renewals, Entities, Notices } from './components'
    import { getDashboard } from './config/requests'

    export default {
        name: 'dashboard',
        components:{
            FormWrapper,
            PageTitle,
            Card,
            Tasks,
            Reminds,
            Requests,
            Renewals,
            Entities,
            Notices,
        },
        mixins: [loadingMixin],
        async mounted() {
            this.showLoader();
            const { data } = await getDashboard();
            [ this.notices = [], this.reminders = [], this.tasks = [], this.renewals = [], this.entities = [], this.requests = [] ] = data;
            this.hideLoader();
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        data() {
            return {
                notices: [],
                reminders: [],
                tasks: [],
                renewals: [],
                entities: [],
                requests: []
            };
        },
        methods: {
            setStatusId() {
                this.$router.push({ path: '/tasks' });
            }
        },
    }
</script>

<style lang="scss" module>
</style>
