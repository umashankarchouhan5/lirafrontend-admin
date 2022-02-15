
export default [
    {
        type: 'selection',
        width: 40,
        align: 'center'
    },
    {
        title: 'Company Name',
        key: 'CompanyName',
        sortable: true
    },
    {
        title: "Reg No.",
        key: 'RegNo',
        width: 120,
        sortable: true
    },
    {
        title: 'Entity Type',
        key: 'EntityType',
        width: 120,
        sortable: true
    },
    
    {
        title: 'Compliant',
        key: 'isCompliant',
        render:(h,params) =>{
            return h('span', params.row.isCompliant !== null ? (params.row.isCompliant == 1 ? 'Yes' : 'No') : '' )
        },
        width: 100,
        sortable: true
    },
    {
        title: 'Status',
        key: 'status',
        sortable: true,
        maxWidth: 150,
    },
]
