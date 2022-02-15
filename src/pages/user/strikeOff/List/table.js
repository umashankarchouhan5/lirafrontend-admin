import DateUtil from 'Utils/dateUtil' ;
import NoticeDate1 from './components/noticeDate1'
import NoticeDate2 from './components/noticeDate2'
import NoticeDate3 from './components/noticeDate3'

export default function() {
const instance = this;
    return [
        {
            type: 'selection',
            width: 40,
            align: 'center'
        },
        {
            title: 'Company Name',
            key: 'companyname',
            sortable: true,
            minWidth: 100,
        },
        {
            title: 'Entity Type',
            key: 'entityType',
            sortable: true,
            width: 100,
        },
        {
            title: 'Reason',
            key: 'reason',
            sortable: true,
            width: 100,
        },
        {
            title: 'Status',
            key: 'statusname',
            sortable: true,
            width: 150
        },
        
        {
            title: 'Status Date',
            sortable: true,
            key: 'statusDate',
            render: (h, params) => {
                return h('span', params.row.statusDate !== null ? DateUtil.formatDate(params.row.statusDate) : '');
            },
            width: 100
        },
        
        {
            title: 'Notice Date 1',
            sortable: true,
            key: 'notice1Date',
            render: (h, params) => {
                return h(NoticeDate1, {
                    props:{
                        row: params.row,
                        openMailBox: instance.openMailBox 
                    } 
                });
            },
            width: 90
        },
        {
            title: 'Notice Date 2',
            sortable: true,
            key: 'notice2Date_AG',
            render: (h, params) => {
                return h(NoticeDate2, {
                    props:{
                        row: params.row,
                        openMailBox: instance.openMailBox 
                    } 
                });
            },
            width: 90
        },
        {
            title: 'Publication Date 1',
            sortable: true,
            key: 'publicationDate1',
            render: (h, params) => {
                return h('span', params.row.publicationDate1 !== null ? DateUtil.formatDate(params.row.publicationDate1) : '');
            },
            width: 90
        },
        {
            title: 'Notice Date 3',
            sortable: true,
            key: 'notice3Date_AG',
            render: (h, params) => {
                return h(NoticeDate3, {
                    props:{
                        row: params.row,
                        openMailBox: instance.openMailBox 
                    } 
                });
            },
            width: 90
        },
        {
            title: 'Publication Date 2',
            sortable: true,
            key: 'publicationDate2',
            render: (h, params) => {
                return h('span', params.row.publicationDate2 !== null ? DateUtil.formatDate(params.row.publicationDate2) : '');
            },
            width: 90
        },
    ]
}
