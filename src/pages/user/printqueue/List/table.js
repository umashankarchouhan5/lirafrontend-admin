import DateUtil from 'Utils/dateUtil'
export default [
    {
        type: 'selection',
        width: 40,
        align: 'center'
    },
    {
        title: 'Ticket Reference',
        key: 'TicketReference',
        width: 150,
        sortable: true
    },
    {
        title: 'Company Name',
        key: 'CompanyName',
        maxWidth: 200,
        sortable: true
    },
    // {
    //     title: 'Letter Reference',
    //     key: 'LetterReference',
    //     width: 150,
    //     sortable: true
    // },
    {
        title: 'Licensee',
        key: 'ICSP_Name',
        sortable: true
    },
    {
        title: 'Approver Name',
        key: 'ApproverName',
        width: 150,
        sortable: true
    },
    {
        title: 'Queue Date',
        key: 'QueueDate',
        width: 110,
        sortable: true,
        render: (h, params) => {
            return h('span', DateUtil.formatDate(params.row.QueueDate));
        },
    },
]
