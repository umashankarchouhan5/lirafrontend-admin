export default [
    {
        type: 'selection',
        width: 40,
        align: 'center'
    },
    {
        title: 'Field No',
        key: 'FieldNumber',
        sortable: true
    },
    {
        title: 'Field Label',
        key: 'Label',
    },
    {
        title: 'Field Type',
        key: 'FieldType',
    },
    
    {
        title: 'Page',
        key: 'Page',
    },
    {
        title: 'Block ID',
        key: 'FormBlock_id',
        render: (h,params) => {
            return h('span', params.row.FormBlock_id === null ? '': params.row.FormBlock_id)
        }
    },
    {
        title: 'Is Block',
        render: (h,params) => {
            return h('span', params.row.BlockJson === null ? '': 'Yes')
        }
    },
    {
        title: 'Is SubBlock',
        key: 'isSubBlock',
        render: (h,params) => {
            return h('span', params.row.isSubBlock === null || params.row.isSubBlock === 0 ? '': 'Yes')
        }
    },
    {
        title: 'BlockLabel',
        render: (h,params) => {
            return h('span', params.row.BlockJson === null ? '': JSON.parse(params.row.BlockJson)[0].name)
        }
    },
]