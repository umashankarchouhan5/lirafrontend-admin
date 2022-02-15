import DateUtil from 'Utils/dateUtil'

export default [
    {
        type: 'selection',
        width: 40,
        align: 'center'
    },
    {
        title: 'Invoice Number',
        key: 'InvoiceNumber',
        width: 160,
        sortable: true
    },
    {
        title: 'Invoice Date',
        key: 'InvoiceDate',
        width: 120,
        sortable: true,
    },
    {
        title: 'Process Name',
        key: 'processName',
        sortable: true
    },
    {
        title: 'Company Name',
        key: 'companyname',
        sortable: true
    },
    {
        title: 'Amount',
        key: 'Amount',
        width: 100,
        sortable: true,
        align: 'right'
    },
    {
        title: 'Status',
        key: 'StatusDescription',
        width: 120,
        sortable: true
    }
]
