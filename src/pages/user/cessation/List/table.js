import DateUtil from 'Utils/dateUtil' ;

export default [
    // {
    //     type: 'selection',
    //     width: 40,
    //     align: 'center'
    // },
    {
        title: 'Licensee',
        key: 'Licensee',
        sortable: true
    },
    {
        title: 'Company Name',
        key: 'COmpanyName',
        width: 150,
        sortable: true
    },
    {
        title: 'Effective Date',
        width: 100,
        sortable: true,
        render: (h, params) => {
            return h('span', params.row.effectiveDate !== null ? DateUtil.formatDate(params.row.effectiveDate) : '');
        },
    },
    
    {
        title: 'Officer',
        key: 'officer',
        sortable: true,
    },
    
    {
        title: 'Status',
        key: 'status',
        sortable: true,
    },
]
