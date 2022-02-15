import DateUtil from 'Utils/dateUtil';
import refCell from './refCell'

export default function(){
    
    const instance = this;
    return [    
        {
            type: 'selection',
            width: 38,
            align: 'center'
        },
        {
            title: 'FSA TicketReference',
            width: 140,
            render: (h,params) =>{
                return h('div', [
                    h(refCell,{
                        props: {
                            row: params.row,
                            onOpenPop: instance.onOpenPop,

                        }
                    })
                ])
            }
        },
        {
            title: 'Action Type',
            key: 'ActionType',
            width: 140
        },
        {
            title: 'Action Brief',
            key: 'ActionBrief',
            
        },
        {
            title: 'Who',
            key: 'Officer',
            width: 140
        },
        {
            title: 'Deadline',
            width: 150,
            sortable: true,
            render: (h, params) => {
                return h('span', params.row.Deadline ? DateUtil.formatDate(params.row.Deadline) : '');
            },
        },
        
        {
            title: 'Status',
            key: 'Status',
            width: 140
        },
        
    ]

}
