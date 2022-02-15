import CheckboxCell from './checkboxCell'
export default [
    {
        type: 'selection',
        width: 40,
        align: 'center'
    },
    {
        title: 'CompanyName',
        key: 'CompanyName',
        sortable: true,
        minWidth: 100,
    },
    {
        title: 'Currency',
        key: 'currency',
        width: 90,
        sortable: true
    },
    {
        title: 'Limited By Shares',
        width: 140,
        render: (h,params) => {
            return h(CheckboxCell,{
                props:{
                    row: params.row,
                    keyVal: 'LimitedByShares'
                }
            })
        },
        sortable: true,
    },
    {
        title: 'Share Capital',
        key: 'ShareCapital',
        render: (h,params) => {
            return h('span',new Intl.NumberFormat('en-IN').format(parseFloat(params.row.ShareCapital)))
        },
        width: 150,
        sortable: true
    },
    {
        title: 'Limited By Guarantee',
        width: 160,
        render: (h,params) => {
            return h(CheckboxCell,{
                props:{
                    row: params.row,
                    keyVal: 'LimitedByGuarantee'
                }
            })
        },
        sortable: true
    },
    
    {
        title: 'Guarantee Amount',
        key: 'GuaranteeAmount',
        width: 150,
        render: (h,params) => {
            return h('span',new Intl.NumberFormat('en-IN').format(parseFloat(params.row.GuaranteeAmount)))
        },
        sortable: true
    },
]
