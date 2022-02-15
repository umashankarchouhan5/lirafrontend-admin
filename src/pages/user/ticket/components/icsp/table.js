import DateUtil from 'Utils/dateUtil'

export default [
    {
        title: 'License Type',
        key: 'LicenseType',
        width: 100
    },
    {
        title: 'Licensee Name ',
        key: 'CompanyName',
    },
    {
        title: 'Status',
        key: 'Status',
        width: 140
    },
    {
        title: 'Status Date',
        width: 110,
        render: (h, params) => {
            return h('span', DateUtil.formatDate(params.row.statusdate));
        },
    },
]


