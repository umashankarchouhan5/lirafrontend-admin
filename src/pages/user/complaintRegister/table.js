import DateUtil from 'Utils/dateUtil' ;
import commentCell from './components/commentCell'

export default [
    {
        title: '# Reference',
        key: 'TicketReference',
        width: 140,
    },
    {
        title: 'Complainant',
        key: 'Complainant',
        width: 120,
    },
    {
        title: 'Complaint Against',
        key: 'ComplaintAgainstName',
        width: 100,
    },
    {
        title: 'Complaint Against Contact Detail',
        key: 'ComplaintAgainstContactDetail',
        width: 120,
    },
    {
        title: 'Complaint Summary',
        render: (h, params) => {
            return h(commentCell, {
                props: {
                    row: params.row
                }
            })
        },
        minWidth: 100,
    },
    {
        title: 'Department',
        key: 'Department',
        width: 100,
    },
    {
        title: 'Investigating Officer',
        key: 'InvestigatingOfficer',
        width: 100,
    },
    {
        title: 'Status',
        key: 'StatusName',
        width: 100
    },
    {
        title: 'Reporting Date',
        width: 100,
        render: (h, params) => {
            return h('span', params.row.ReportingDate !== null ? DateUtil.formatDate(params.row.ReportingDate) : '');
        },
    },
    
]
