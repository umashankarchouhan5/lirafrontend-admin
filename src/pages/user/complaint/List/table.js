import DateUtil from 'Utils/dateUtil'

export default [
    {
        type: 'selection',
        width: 40,
        align: 'center'
    },
    {
        title: 'TicketReference',
        key: 'TicketReference',
        sortable: true,
        width: 140
    },
    // {
    //     title: 'Temporary Reference',
    //     key: 'TempRef',
    //     sortable: true,
    //     width: 120
    // },
    {
        title: 'Name ',
        key: 'Name',
        width: 120,
        sortable: true
    },
    {
        title: 'Subject',
        key: 'Subject',
        sortable: true,
        minWidth: 150,
    },
    {
        title: 'Status',
        key: 'StatusName',
        width: 140,
        sortable: true
    },
    {
        title: 'Incident Date',
        key: 'IncidentDate',
        width: 120,
        render: (h,params) => {
            return h('span',DateUtil.formatDate(params.row.IncidentDate))
        },
        sortable: true
    },
    {
        title: 'Reporting Date',
        key: 'ReportingDate',
        width: 120,
        render: (h,params) => {
            return h('span',DateUtil.formatDate(params.row.ReportingDate))
        },
        sortable: true
    },
]
