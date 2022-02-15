import DateUtil from 'Utils/dateUtil' ;

export default [
    {
        type: 'selection',
        width: 40,
        align: 'center'
    },
    {
        title: 'PQ ID',
        key: 'uniqueref',
        width: 100,
    },
    {
        title: 'Name',
        key: 'Fullname',
    },
    {
        title: 'Position',
        key: 'position',
    },
    {
        title: 'CSP Name',
        key: 'CompanyName',
        sortable: true
    },
    
    
    {
        title: 'Start Date',
        width: 120,
        render: (h, params) => {
            return h('span', params.row.startdate !== null ? DateUtil.formatDate(params.row.startdate) : '');
        },
    },
    
    {
        title: 'End Date',
        width: 120,
        render: (h, params) => {
            return h('span', params.row.enddate !== null ? DateUtil.formatDate(params.row.enddate) : '');
        },
    },
    
]
