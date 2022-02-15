import DateUtil from 'Utils/dateUtil' ;

export default [
    {
        title: 'Username',
        key: 'Username',
    },
    {
        title: 'Activity Description',
        key: 'ActivityDesc',
        sortable: true,
    },
    {
        title: 'Activity Date',
        key: 'created_at',
        sortable: true,
        render: (h, params) => {
            return h('span', DateUtil.formatDateWithTime(params.row.created_at));
        },
    },
    {
        title: 'Ip Address',
        key: 'IP',
    },
]
