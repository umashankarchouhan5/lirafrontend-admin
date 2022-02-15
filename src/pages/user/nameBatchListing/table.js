import DateUtil from 'Utils/dateUtil';

export default [
    {
        type: 'selection',
        width: 40,
        align: 'center'
    }, 
    
    {
        title: 'Batch ID',
        key: 'BatchId',
        width: 80,
        // sortable: true
    },
    {
        title: 'CSP Name',
        key: 'CompanyName',
        // sortable: true
    },
    
    {
        title: 'Entity Type',
        key: 'EntityType',
        width: 100,
    },
    {
        title: 'Count Submitted',
        key: 'CountSubmitted',
        width: 100,
    },
    
    {
        title: 'Count Processed',
        key: 'CountProcessed',
        width: 80,
    },
    {
        title: 'Submission Date',
        key: 'SubmittedOn',
        width: 120,
        render: (h, params) => {
            return h('span', DateUtil.formatDate(params.row.SubmittedOn));
        },
    },
]
