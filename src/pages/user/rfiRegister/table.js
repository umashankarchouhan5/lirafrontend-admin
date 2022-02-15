import DateUtil from 'Utils/dateUtil' ;
import briefCell from './components/briefCell';

export default [
    // {
    //     title: '# Reference',
    //     key: 'TicketReference',
    //     width: 140,
    // },
    {
        title: 'Govt. Entity Name',
        key: 'GovtEntityName',
        width: 180,
    },
    {
        title: 'Requested By',
        key: 'requestedBy',
        width: 100,
    },
    {
        title: 'RFI Brief',
        render: (h, params) => {
            return h(briefCell, {
                props: {
                    row: params.row
                }
            })
        },
        minWidth: 100,
    },
    {
        title: 'Request Date',
        width: 100,
        render: (h, params) => {
            return h('span', params.row.RequestDate !== null ? DateUtil.formatDate(params.row.RequestDate) : '');
        },
    },
    {
        title: 'Officer',
        key: 'officer',
        width: 100
    },
    {
        title: 'Deadline',
        width: 100,
        render: (h, params) => {
            return h('span', params.row.Deadline !== null ? DateUtil.formatDate(params.row.Deadline) : '');
        },
    },
    {
        title: 'Status',
        key: 'StatusName',
        width: 100
    },
    
]
