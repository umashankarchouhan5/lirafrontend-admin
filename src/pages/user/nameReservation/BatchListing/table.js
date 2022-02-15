import DateUtil from 'Utils/dateUtil';
import RefCell from './refCell';

export default [
    {
        type: 'selection',
        width: 40,
        align: 'center'
    }, 
    
    {
        title: 'Assigned',
        key: 'Officer',
        width: 150,
        sortable: true
    },
    {
        title: 'CSP Name',
        key: 'CSP',
        sortable: true,
        minWidth: 150
    },
    {
        title: 'ID',
        key: 'batch_id',
        sortable: true,
        width: 60
    },
    {
        title: 'Status',
        width: 90,
        key: 'Status_id',
        render: ( h, params ) => {
            return h(RefCell, {
                props: {
                    row: params.row
                }

            })
        },
        sortable: true
    },
    
    {
        title: 'Submitted',
        key: 'CountSubmitted',
        width: 100,
        sortable: true,
        align: 'center'
    },
    {
        title: 'Processed',
        key: 'CountProcessed',
        width: 100,
        sortable: true,
        align: 'center'
    },
    {
        title: 'Submitted On',
        width: 120,
        key: 'submiitedOn',
        sortable: true,
        render: (h, params) => {
            return h('span', DateUtil.formatDate(params.row.submiitedOn));
        },
    },
]
