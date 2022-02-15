import DateUtil from 'Utils/dateUtil' ;
import PQCell from './PQCell';

export default [
    {
        title: 'Name',
        key: 'Fullname',
        minWidth: 100,
    },
    {
        title: 'Position',
        key: 'position',
        minWidth: 100,
    },
    
    {
        title: 'PQ ID',
        render:(h,params) =>{
            return h(PQCell,{
                props:{
                    row: params.row
                }
            })
        },
    },
    {
        title: 'Start Date',
        width: 120,
        render: (h, params) => {
            return h('span', params.row.startdate !== null ? DateUtil.formatDate(params.row.startdate) : '');
        },
    },
    {
        title: 'End Date',
        width: 120,
        render: (h, params) => {
            return h('span', params.row.enddate !== null ? DateUtil.formatDate(params.row.enddate) : '');
        },
    },
    
]
