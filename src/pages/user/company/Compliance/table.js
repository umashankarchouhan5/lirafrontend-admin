import DateUtil from 'Utils/dateUtil' ;
export default [
    {
        type: 'selection',
        width: 40,
        align: 'center'
    },
    {
        title: 'Notes',
        key: 'notes',
        sortable: true
    },
    {
        title: 'By Officer',
        key: 'adminuser_name',
        maxWidth: 220
    },
    {
        title: 'Status',
        key: 'ComplianceStatus',
        sortable: true,
        width: 160
    },
    {
        title: 'Compliance Date',
        key: 'created_at',
        sortable: true,
        render: (h, params) => {
            return h('span', DateUtil.formatDate(params.row.created_at));
        },
        maxWidth: 140
    },
]
