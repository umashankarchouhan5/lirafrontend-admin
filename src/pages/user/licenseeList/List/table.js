import DateUtil from 'Utils/dateUtil' ;
import refCell from './refCell';
import LicenseeCell from './LicenseeCell';

export default [
    {
        title: 'License Valid',
        render:(h,params) =>{
            return h(refCell,{
                props:{
                    row: params.row
                }
            })
        },
        width: 110,
        align: 'center'
    },
    {
        title: 'Licensee',
        key: 'CompanyName',
        render:(h,params) =>{
            return h(LicenseeCell,{
                props:{
                    row: params.row
                }
            })
        },
        sortable: true
    },
    {
        title: 'Code',
        key: 'License',
        sortable: true,
        width: 100,
    },
    
    {
        title: 'Contact Name',
        key: 'Contact',
        sortable: true
    },
    
    {
        title: 'Email',
        key: 'Email',
        sortable: true,
        maxWidth: 180,
    },
    {
        title: 'Expiry Date',
        key: 'ExpiryDate',
        width: 110,
        sortable: true,
        render: (h, params) => {
            return h('span', params.row.ExpiryDate !== null ? DateUtil.formatDate(params.row.ExpiryDate) : '');
        },
    },
    
]
