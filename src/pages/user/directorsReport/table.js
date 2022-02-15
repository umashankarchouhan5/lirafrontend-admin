import DateUtil from 'Utils/dateUtil'

export default [
    {
        type: 'selection',
        width: 40,
        align: 'center'
    },
    {
        title: 'Director ID',
        key: 'CompanyRODRequestData_id',
        width: 80,
    },
    {
        title: 'Director Name',
        key: 'DirectorName',
    },
    {
        title: 'ICSP Code',
        key: 'icsp_code',
        width: 80,
    },
    {
        title: 'Date Of Submission',
        width: 150,
        render: (h,params) => {
            return h('span',params.row.created_at && params.row.created_at !== null ? DateUtil.formatDateWithTime(params.row.created_at) : '')
        },
    },
    {
        title: 'Appointment Date',
        width: 130,
        render: (h,params) => {
            return h('span',params.row.StartDate && params.row.StartDate !== null ? DateUtil.formatDate(params.row.StartDate) : '')
        },
    },
    {
        title: 'Cessation Date',
        width: 120,
        render: (h,params) => {
            return h('span',params.row.EndDate && params.row.EndDate !== null ? DateUtil.formatDate(params.row.EndDate) : '')
        },
    },
    // {
    //     title: 'Date of Submission',
    //     width: 140,
    //     render: (h,params) => {
    //         return h('span',params.row.RODDate && params.row.RODDate !== null ? DateUtil.formatDate(params.row.RODDate) : '')
    //     },
    // },
    // {
    //     title: 'Date of Acknowledgement',
    //     width: 170,
    //     render: (h,params) => {
    //         return h('span',params.row.AckDate && params.row.AckDate !== null ? DateUtil.formatDate(params.row.AckDate) : '')
    //     },
    // },
    // {
    //     title: 'Date of Confirmation',
    //     width: 140,
    //     render: (h,params) => {
    //         return h('span',params.row.ConfirmDate && params.row.ConfirmDate !== null ? DateUtil.formatDate(params.row.ConfirmDate) : '')
    //     },
    // },
]
