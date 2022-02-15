import DateUtil from 'Utils/dateUtil';
import MessageCell from './messageCell';

export default function(){

    const instance = this;
    return [
        // {
        //     key: 'notes',
        //     title: 'Note'
        // },
        {
            title: 'Note',
            key: 'notes',
            render: (h, params) => {
                return h(MessageCell, {
                    props: {
                        row: params.row,
                        getMessage: instance.getMessage
                    }
                });
            },
        },
        {
            key: 'Createdby',
            title: 'Added By',
            sortable: true,
            width: 140
        },
        {
            key: 'created_at',
            title: 'Added on',
            sortable: true,
            width: 140,
            render: (h, params) => {
                return h('span', DateUtil.formatDateWithTime(params.row.created_at));
            },
        },
    ]
}

