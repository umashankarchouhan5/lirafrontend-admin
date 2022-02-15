import DateUtil from 'Utils/dateUtil' ;
import ReferenceCell from './referenceCell'

export default [
    {
        type: 'selection',
        width: 40,
        align: 'center'
    },
    {
        title: 'Enforcement Type',
        key: 'type',
        width: 150,
        sortable: true
    },
    {
        title: 'Is Intent',
        render: (h, params) => {
            return h('span', params.row.isIntent == 1 ? 'Yes' : 'No');
        },
        width: 80,
        sortable: true
    },
    {
        title: 'Licensee',
        key: 'Licensee',
        sortable: true,
        minWidth: 120,
    },
    {
        title: 'Is Draft',
        render: (h, params) => {
            return h('span', params.row.isDraft == 1 ? 'Yes' : 'No');
        },
        width: 80,
        sortable: true
    },
    {
        title: 'Status',
        key: 'status',
        sortable: true,
        width: 120,
        maxWidth: 150,
    },
    {
        title: 'Status Date',
        sortable: true,
        render: (h, params) => {
            return h('span', DateUtil.formatDate(params.row.statusDate));
        },
        width: 100
    },
    // {
    //     title: 'Deadline',
    //     width: 100,
    //     sortable: true,
    //     render: (h, params) => {
    //         return h('span', DateUtil.formatDate(params.row.deadline));
    //     },
    // },
    
    {
        title: 'Ticket Reference',
        key: 'TicketReference',
        sortable: true,
        render: (h, params) => {
            return h(ReferenceCell, {
                props: {
                    row: params.row
                }
            });
        },
        width: 140
    },
    {
        title: 'Officer',
        key: 'officer',
        sortable: true,
        width: 130
    },
]
