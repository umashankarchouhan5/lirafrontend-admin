
import PrintCell from './printCell';

export default [
    
   
    {
        title: 'To Email',
        key: 'toemail',
        sortable: true
    },{
        title: 'Subject',
        key: 'subject',
        sortable: true
    },
    {
        title: 'File',
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
