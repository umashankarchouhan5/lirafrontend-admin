// import statuses from './statuses'

// const { pending, submitted, approved, rejected, request_for_info } = statuses;
import DateUtil from 'Utils/dateUtil';

export default [
    {
        type: 'selection',
        width: 38,
        align: 'center'
    },
	{
        title: 'Action Type',
        key: 'ActionType',
        width: 140
    },
    {
        title: 'Action Brief',
        key: 'ActionBrief',
        width: 180,
        
    },
	{
        title: 'Who',
        key: 'isAdmin',
        width: 140
    },
    {
        title: 'Deadline',
        width: 150,
		sortable: true,
        render: (h, params) => {
            return h('span', params.row.Deadline ? DateUtil.formatDateWithTime(params.row.Deadline) : '');
        },
    },
    
    {
        title: 'Status',
        key: 'Status',
        width: 140
    },
    
]
