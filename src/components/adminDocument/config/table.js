import DateUtil from 'Utils/dateUtil';
import ActionCell from './ActionCell'

export default function(){
    const instance = this;
    return [    
        {
            title: 'Document Brief',
            key: 'documentBrief',
        },
        // {
        //     title: 'Document Date',
        //     width: 150,
        //     sortable: true,
        //     render: (h, params) => {
        //         return h('span', params.row.DocumentDate ? DateUtil.formatDate(params.row.DocumentDate) : '');
        //     },
        // },
        {
            title: 'Upload Date',
            width: 150,
            sortable: true,
            render: (h, params) => {
                return h('span', params.row.UploadDate ? DateUtil.formatDate(params.row.UploadDate) : '');
            },
        },
        
        {
            title: 'Document Name',
            width: 200,
            key: 'name',
        },
        {
            title: 'Action',
            width: 140,
            render: (h,params) =>{
                return h('div', [
                    h(ActionCell,{
                        props: {
                            row: params.row,
                            changeDocument: instance.changeDocument,
                        }
                    })
                ])
            }
        },
        
    ]

}