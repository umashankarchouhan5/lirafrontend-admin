<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="PQ Change Log" slot="title" />
        <TicketHeader  :ticketValue="ticketValue" />
        <FormRow>
            <DataTable :actions="true"
                :data="pqLog"
                :columns="config">
                
            </DataTable>
        </FormRow>
    </FormWrapper>
</template>

<script>
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import { getPQChangeLog } from './api';
    import loadingMixin from 'Mixins/loadingMixin';
    import DataTable from 'Components/DataTable';
    import config from './table';
    
    
    export default {
        name: "PQChangeLog",
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle,
            DataTable
        },
        data() {
            return {
                pqLog: [],
                config,
                pqHeader: {
                    pq_id: '',
                    fullName: '',
                }
            }
        },
        created() {
            this.getChangeLog();
          
        },
        
        computed: {
            userData() {
                return this.$store.state.user.user
            },
            ticketValue() {
                return {
                    First: this.pqHeader.pq_id,
                    Second: this.pqHeader.fullName,
                    Third: ''
                }
            }
        },
        methods: {
            getChangeLog(){
                getPQChangeLog(parseInt(this.$route.params.pq_id)).then(
                    res => {
                        this.pqLog = res.data[0];
                        this.pqHeader.pq_id = res.data[2][0].PQID;
                        this.pqHeader.fullName = res.data[2][0].FullName;
                    }
                )
            }
        }
    }
</script>


<style lang="scss" module>

</style>
