import DateUtil from 'Utils/dateUtil'

export default [
    {
        type: 'selection',
        width: 40,
        align: 'center'
    },
    {
        title: 'From',
        key: 'FromUser',
        width: 180,
        sortable: true
    },
    {
        title: 'To',
        key: 'ToUser',
        width: 180,
        sortable: true
    },
    {
        title: 'Subject',
        key: 'Subject',
        sortable: true,
        minWidth: 100
    },
    {
        title: 'Mode',
        key: 'CorrespondenceMode',
        width: 100,
        sortable: true
    },
    {
        title: 'Date sent',
        key: 'correspondencedate',
        width: 110,
        sortable: true,
        render: (h, params) => {
            return h('span', DateUtil.formatDate(params.row.correspondencedate));
        },
    },
]
