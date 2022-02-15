
import PrintCell from './printCell';

export default [
    
    // {
    //     title: 'ID',
    //     key: 'printdocument_id',
    //     sortable: true,
    //     width: 80,
    // },
    {
        title: 'File Name Prefix',
        key: 'FileNamePrefix',
        sortable: true,
    },
    {
        title: 'Layout',
        key: 'Layout',
        width: 110,
        sortable: true,
    },
    {
        title: 'Action',
        width: 140,
        sortable: false,
        render: (h, params) => {
            return h(PrintCell,{
                    props: {
                        row: params.row
                    }
                }
                );
        },
    },
]
