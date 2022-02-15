import DateUtil from 'Utils/dateUtil';

export default [
    {
        type: 'selection',
        width: 40,
        align: 'center'
    },
    {
        title: 'Reg No.',
        key: 'companyRegNo',
        width: 80,
        sortable: true
    },
    {
        title: 'Licensee',
        key: 'ICSP',
        // width: 180,
        sortable: true,
        minWidth: 100,
        maxWidth: 200,
    },
    {
        title: 'Company Name',
        key: 'companyname',
        // width: 180,
        sortable: true,
        width: 150
    },
    {
        title: 'Activity Type',
        key: 'activityType',
        // width: 180,
        sortable: true,
        width: 120
    },
    {
        title: 'Action',
        key: 'action',
        // width: 180,
        sortable: true,
        minWidth: 100,
    },
    {
        title: 'Officer',
        key: 'Officer',
        sortable: true,
        width: 90,
    },
    {
        title: 'Due Date',
        sortable: true,
        render: (h, params) => {
                return h('span', params.row.dueDate == '' || params.row.dueDate == null || params.row.dueDate == '1900-01-01' ? '' : DateUtil.formatDate(params.row.dueDate));
        },
        width: 100,
    },
    {
        title: 'Status Date',
        sortable: true,
        render: (h, params) => {
                return h('span', params.row.statusDate == '' || params.row.statusDate == null || params.row.statusDate == '1900-01-01' ? '' : DateUtil.formatDate(params.row.statusDate));
        },
        width: 100,
    },
    {
        title: 'Status',
        key: 'statusname',
        width: 100,
        sortable: true
    },
]
