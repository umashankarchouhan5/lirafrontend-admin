<template>
    <FormWrapper>
        <PageTitle v-if="subTask !== null" :title="subTask.ActionBrief" slot="title" />
        <TicketHeader v-if="ticketValue && subTask!== null" :ticketValue="ticketValue" />
        <SubTaskComponent :TicketReference="$route.params.ticket" :ReferenceId="$route.params.reference" />
        <br />
    </FormWrapper>
</template>

<script>
    import SubTaskComponent from './subTaskComponent'
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';

    export default {
        name: 'SubTask',
        components:{
            FormWrapper,
            PageTitle,
            SubTaskComponent
        },
        computed:{
            subTask(){
                return this.$store.state.common.subTaskData;
            },
            ticketValue() {
                if(this.subTask !== null){
                    return {
                        First: this.subTask.TicketReference,
                        Second: this.subTask.CompanyName,
                        Third: ''
                    }
                }
                return false
            }
        },
        methods:{
            
        }
        
        
    }
</script>

<style lang="scss" module>

</style>