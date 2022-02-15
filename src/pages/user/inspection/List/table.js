import DateUtil from 'Utils/dateUtil' ;

export default [
    {
        type: 'selection',
        width: 40,
        align: 'center'
    },
    {
        title: 'License',
        key: 'License',
        sortable: true,
        width: 100
    },
    {
        title: 'Licensee',
        key: 'Licensee',
        sortable: true,
        minWidth: 100
    },
    {
        title: 'Inspection Date ',
        key: 'inspectionDate',
        width: 130,
        sortable: true,
        render: (h, params) => {
            return h('span', params.row.inspectionDate !== null ? DateUtil.formatDate(params.row.inspectionDate) : '');
        },
    },
    {
        title: 'Officer',
        key: 'officer',
        width: 140,
        sortable: true,
    },
    {
        title: 'Inspection Type',
        key: 'inspectionType',
        width: 140,
        sortable: true,
    },
    {
        title: 'Locked',
        key: 'isLocked',
        width: 80,
        sortable: true,
        render: (h, params) => {
            return h('span', params.row.isLocked === 1 ? 'Yes' : 'No');
        },
    },
    {
        title: 'Status',
        key: 'status',
        width: 140,
        sortable: true,
    },
]
