import DateUtil from 'Utils/dateUtil' ;
// import refCell from './refCell';

export default [
    {
        type: 'selection',
        width: 40,
        align: 'center'
    },
    {
        title: 'Reg No.',
        key: 'CompanyRegNo',
        sortable: true,
        width: 90
    },
    {
        title: 'Company Name',
        key: 'companyName',
        sortable: true
    },
    {
        title: 'ICSP Name',
        key: 'ICSPName',
        sortable: true,
    },
    // {
    //     title: 'Is Date Required',
    //     key: 'isDateRequired',
    //     width: 140,
    //     sortable: true
    // },
    
    {
        title: 'RA to IBC Date',
        key: 'DateRAToIBC',
        sortable: true,
        render: (h, params) => {
            return h('span', params.row.DateRAToIBC !== null ? DateUtil.formatDate(params.row.DateRAToIBC) : '');
        },
        width: 85
    },
    {
        title: 'RA to FSA Date',
        key: 'DateRAtoFSA',
        sortable: true,
        render: (h, params) => {
            return h('span', params.row.DateRAtoFSA !== null ? DateUtil.formatDate(params.row.DateRAtoFSA) : '');
        },
        width: 85
    },
    
    {
        title: 'Resign Registration Date',
        key: 'DateResigRegistration',
        sortable: true,
        render: (h, params) => {
            return h('span', params.row.DateResigRegistration !== null ? DateUtil.formatDate(params.row.DateResigRegistration) : '');
        },
        width: 90
    },
    {
        title: 'Notice Date 1',
        key: 'DateNotice1',
        sortable: true,
        render: (h, params) => {
            return h('span', params.row.DateNotice1 !== null ? DateUtil.formatDate(params.row.DateNotice1) : '');
        },
        width: 85
    },
    {
        title: 'Notice Date 2',
        key: 'DateNotice2',
        sortable: true,
        render: (h, params) => {
            return h('span', params.row.DateNotice2 !== null ? DateUtil.formatDate(params.row.DateNotice2) : '');
        },
        width: 85
    },
    {
        title: 'Publication Date 1',
        key: 'DatePublication1',
        sortable: true,
        render: (h, params) => {
            return h('span', params.row.DatePublication1 !== null ? DateUtil.formatDate(params.row.DatePublication1) : '');
        },
        width: 90
    },
    {
        title: 'Notice Date 3',
        key: 'DateNotice3',
        sortable: true,
        render: (h, params) => {
            return h('span', params.row.DateNotice3 !== null ? DateUtil.formatDate(params.row.DateNotice3) : '');
        },
        width: 85
    },
    {
        title: 'Publication Date 2',
        key: 'DatePublication2',
        sortable: true,
        render: (h, params) => {
            return h('span', params.row.DatePublication2 !== null ? DateUtil.formatDate(params.row.DatePublication2) : '');
        },
        width: 90
    },
]
