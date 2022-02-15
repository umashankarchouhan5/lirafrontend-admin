import DateUtil from 'Utils/dateUtil'

export default [
    {
        key: 'comments',
        title: 'Comment',
    },
    {
        title: 'Added On',
        width: '150',
        sortable: true,
        render: (h, params) => {
            return h('span', DateUtil.formatDateWithTime(params.row.StatusDateTime));
        },
    },
    {
        key: 'user',
        width: '180',
        title: 'Added By'
    },
]


