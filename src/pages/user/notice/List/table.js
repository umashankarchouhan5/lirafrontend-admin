import DateUtil from 'Utils/dateUtil' ;

export default [
    {
        type: 'selection',
        width: 40,
        align: 'center'
    },
    {
        title: 'Notice Name',
        key: 'NoticeType',
        sortable: true,
    },
    {
        title: 'Is AG',
        sortable: true,
        key: 'isAG',
        render: (h, params) => {
            return h('span', params.row.isAG === 1 ? 'Yes' : 'No');
        },
        width: 80
    },
    {
        title: 'Notice Date',
        width: 100,
        sortable: true,
        key: 'noticeDate',
        render: (h, params) => {
            return h('span', params.row.noticeDate !== null ? DateUtil.formatDate(params.row.noticeDate) : '');
        },
    },
    {
        title: 'Status',
        key: 'StatusName',
        // width: 100,
        sortable: true,
        maxWidth: 200
    },
]
