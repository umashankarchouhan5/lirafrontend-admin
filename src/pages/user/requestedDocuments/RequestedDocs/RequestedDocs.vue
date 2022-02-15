<template>
    <FormWrapper>
        <PageTitle slot="title" title="Requested Documents" />
        <DataTable :actions="true"
            :data="documents"
            :columns="tableConfig()"
            :is-loading="isLoading">

        </DataTable>
    </FormWrapper>
</template>


<script>
    import { getRegisteredDocumentForTicketReferenceByAdmin , acceptRegisteredDocument } from '../api';
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import loadingMixin from 'Mixins/loadingMixin';
    import tableConfig from './table';

    export default {
        name: 'RequestedDocuments',
        mixins: [ loadingMixin ],
        components: {
            FormWrapper,
            PageTitle,
            DataTable,
        },
        data() {
            return {
                documents: [],
                TicketReference: null,
                tableConfig
            }
        },
        created() {
            this.TicketReference = this.$route.params.ticketReference;
            this.getList()
        },
        methods: {
            getList() {
                getRegisteredDocumentForTicketReferenceByAdmin ({TicketReference: this.TicketReference}).then(
                    res => {
                        this.documents = res.data[0];
                    }
                )
            },
            

            onAcceptDocument(row) {
                const current = this.documents[row._index];
                const data = {
                    registeredDocumentData_id: current.registeredDocumentData_id,
                    registeredDocument_id:  current.registeredDocument_id,
                }

                acceptRegisteredDocument(data).then((res) => {
                    
                    current.isAccepted = 1;
                })
            },
            

        }
    }
</script>