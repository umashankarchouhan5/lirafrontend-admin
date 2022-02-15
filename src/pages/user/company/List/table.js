import DateUtil from 'Utils/dateUtil';
import CompanyCell from './CompanyCell';
import refCell from './refCell';

export default [
    {
        type: 'selection',
        width: 40,
        align: 'center'
    },
    {
        title: 'Active',
        render:(h,params) =>{
            return h(refCell,{
                props:{
                    row: params.row
                }
            })
        },
        width: 50,
    },
    {
        title: 'Registration No.',
        key: 'CompanyRegNo',
        width: 130,
        sortable: true
    },
    {
        title: 'Entity Name',
        key: 'Name',
        render:(h,params) =>{
            return h(CompanyCell,{
                props:{
                    row: params.row
                }
            })
        },
        sortable: true,
        width: 180,
    },
    {
        title: 'CSP',
        key: 'ICSPname',
        // width: 180,
        sortable: true,
        minWidth: 100,
    },
    {
        title: 'Restrict',
        key: 'complianceStatus',
        sortable: true,
        width: 90,
    },
    {
        title: 'Registration Date',
        key: 'DateOfIncorporation',
        sortable: true,
        render: (h, params) => {
            if( params.row.DateOfIncorporation == '' || params.row.DateOfIncorporation == null || params.row.DateOfIncorporation == '1900-01-01'){
                return '';
            }else{
                return h('span', DateUtil.formatDate(params.row.DateOfIncorporation));
            }
        },
        width: 140,
    },
    {
        title: 'Annual Renewal Due',
        key: 'AnnualFeeDueDate',
        sortable: true,
        render: (h, params) => {
            if( params.row.AnnualFeeDueDate == '' || params.row.AnnualFeeDueDate == null || params.row.AnnualFeeDueDate == '1900-01-01'){
                return '';
            }else{
                return h('span', DateUtil.formatDate(params.row.AnnualFeeDueDate));
            }
        },
        width: 120,
    },
    {
        title: 'Status',
        key: 'Status',
        width: 140,
        sortable: true
    },
]
