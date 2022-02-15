// import statuses from './statuses'

// const { pending, submitted, approved, rejected, request_for_info } = statuses;
import ReferenceCell from '../components/referenceCell'
import DateUtil from 'Utils/dateUtil';

export default [
    {
        type: 'selection',
        width: 38,
        align: 'center'
    },

    {
        title: 'Reference',
        key: 'TicketReference',
        width: 120,
        render: (h, params) => {
            return h(ReferenceCell, {
                props: {
                    row: params.row
                }
            });
        },
		sortable: true,
    },
	{
        title: 'Service Provider',
        key: 'ICSPname',
        sortable: true,
        minWidth: 80,
    },
	{
        title: 'Entity Name',
        key: 'Name',
		sortable: true,
        minWidth: 60,
    },
    {
        title: 'Process',
        key: 'processname',
        width: 200,
		sortable: true,
    },
    
    {
        title: 'Status',
        key: 'statusname',
        width: 140,
		sortable: true,
    },{
        title: 'Officer',
        key: 'StaffName',
        width: 150,
		sortable: true,
    },
    {
        title: 'Deadline',
        width: 90,
		sortable: true,
        render: (h, params) => {
            return h('span', params.row.Deadline ? DateUtil.formatDate(params.row.Deadline) : '');
        },
    },
]
