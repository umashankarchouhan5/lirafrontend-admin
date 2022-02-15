<template>
    <div>
        <DataTable :actions="true"
            :data="personData"
            :columns="tableColumns"
        >
        </DataTable>
        <br />
        
    </div>
</template>

<script>
    
    import DataTable from 'Components/DataTable'
    // import AddressInput from 'Components/form/addressInput/AddressInput'
    import loadingMixin from 'Mixins/loadingMixin'
    import DateUtil from 'Utils/dateUtil';
    import PQCell from './component/PQAction'

    export default {
        name: "CompanyPersons",
        mixins: [loadingMixin,],
        components:{
            DataTable
        },
        props: {
            value: Object,
            personData: Array,
            readonly: Boolean,
        },
        data() {
            return {
                tableColumns: [
                    {
                        title: 'PQ ID',
                        key:'UniqueRef',
                        render:(h,params) =>{
                            return h(PQCell,{
                                props: {
                                    row: params.row
                                }
                            });
                        },
                        width: 50,
                    },
                    {
                        title: 'Name',
                        key: 'Name',
                        width: 120
                    },
                    {
                        title: 'Position',
                        key: 'Position',
                        // width: 120,
                    },
                    {
                        title: 'Change Type',
                        key: 'ChangeAction',
                        width: 100,
                    },
                    {
                        title: 'Resignation Reason',
                        key: 'ResignationReason',
                    },
                    {
                        title: 'Effective Date',
                        render: (h, params) => {
                            return h('span', DateUtil.formatDate(params.row.EffectiveDate));
                        },
                        align: 'left',
                        width: 100
                    }
                ],
            }
        },
        computed: {
            ticket() {
                return this.$store.state.ticket.ticket;
            },
        },
    }
</script>
