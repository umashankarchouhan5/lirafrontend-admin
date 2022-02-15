import DateUtil from 'Utils/dateUtil';
import RefCell from './refCell';

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
        render: ( h, params ) => {
            return h(RefCell, {
                props: {
                    row: params.row
                }

            })
        },
        sortable: true
    },
    {
        title: 'Proposed Name',
        key: 'ProposedName',
        sortable: true,
        minWidth: 100,
    },
    
    {
        title: 'Request Type',
        key: 'processname',
        width: 120,
        sortable: true
    },
    {
        title: 'Officer',
        key: 'adminusername',
        width: 130,
        sortable: true
    },
    {
        title: 'Status',
        key: 'StatusDescription',
        width: 130,
        sortable: true
    },
    {
        title: 'Status Date',
        key: 'StatusDate',
        width: 120,
        sortable: true,
        render: (h, params) => {
            return h('span', DateUtil.formatDate(params.row.StatusDate));
        },
    },
]
