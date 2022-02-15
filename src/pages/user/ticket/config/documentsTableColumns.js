import DateUtil from 'Utils/dateUtil'
import ActionsCell from '../components/ActionsCell'
import DocumentFileCell from '../components/DocumentFileCell'

export default (documentTypeTitle) => [
    {
        key: '',
        title: 'S.No.',
        type: 'index',
        width: 60
    },
    {
        title: documentTypeTitle,
        key: 'documentBrief',
        minWidth: 100,
    },
    {
        title: 'Document Date',
        render: (h, params) => {
            return h('span', params.row.DocumentDate && DateUtil.formatDate(params.row.DocumentDate));
        },
        sortable: true,
        width: 160
    },
    {
        title: 'Uploaded Date',
        render: (h, params) => {
            return h('span', params.row.UploadDate && DateUtil.formatDate(params.row.UploadDate));
        },
        sortable: true,
        width: 160
    },
    {
        key: 'name',
        title: 'File Name',
        width: 200,
        render: (h, params) => {
            return h('div', [
                h(DocumentFileCell, {
                    props: {
                        row: params.row,
                    }
                }),
            ]);
        }
    },
    {
        title: 'Actions',
        width: 282,
        align: 'center',
        render: (h, params) => {
            return h('div', [
                h(ActionsCell, {
                    props: {
                        row: params.row,
                        isAdditional: documentTypeTitle === 'Additional Documents', // Refactor
                        isOptional: documentTypeTitle === 'Optional Documents' // Refactor
                    }
                }),
            ]);
        }
    },
];




