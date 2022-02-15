import DateUtil from 'Utils/dateUtil' ;
import refCell from './refCell';

export default [
    {
        title: 'Process',
        key: 'processname',
        sortable: true
    },
    {
        title: 'Document Brief',
        key: 'DocumentBrief',
        sortable: true
    },
    {
        title: 'Document Name',
        key: 'Name',
        sortable: true,
        render:(h,params) =>{
            return h(refCell,{
                props:{
                    row: params.row
                }
            })
        }
    },
    {
        title: 'Document Date',
        key: 'DocumentDate',
        width: 140,
        sortable: true,
        render: (h, params) => {
            return h('span', params.row.DocumentDate !== null ? DateUtil.formatDate(params.row.DocumentDate) : '');
        },
    },
    {
        title: 'Upload Date',
        key: 'created_at',
        width: 140,
        sortable: true,
        render: (h, params) => {
            return h('span', DateUtil.formatDate(params.row.created_at));
        },
    },
    
    {
        title: 'Uploaded By',
        width: 140,
        sortable: true,
        render: (h, params) => {
            return h('span', params.row.isadmin === 1 ? 'FSA' : '');
        },
    },
]
