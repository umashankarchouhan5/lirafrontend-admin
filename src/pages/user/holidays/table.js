import DateUtil from 'Utils/dateUtil' ;

export default [
    {
        type: 'selection',
        width: 40,
        align: 'center'
    },
    {
        title: 'Holiday Date',
        key: 'Holiday',
        width: 140,
        sortable: true,
        render: (h, params) => {
            return h('span', DateUtil.formatDate(params.row.Holiday));
        },
    },
    {
        title: 'Holiday Description',
        key: 'Description',
        sortable: true
    },
    
    
]
