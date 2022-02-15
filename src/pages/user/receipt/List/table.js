import DateUtil from 'Utils/dateUtil'

export default [
    {
        type: 'selection',
        width: 40,
        align: 'center'
    },
    {
        title: 'Ledger Reference',
        key: 'FSATransReference',
        width: 160,
        sortable: true
    },
    {
        title: 'Receipt Number',
        key: 'ReceiptNumber',
        width: 120,
        sortable: true,
    },
    {
        title: 'Date',
        key: 'ReceiptDate',
        sortable: true
    },
    {
        title: 'Narration',
        key: 'narration',
        sortable: true
    },
    {
        title: 'Amount',
        key: 'Amount',
        width: 100,
        sortable: true
    }
]
