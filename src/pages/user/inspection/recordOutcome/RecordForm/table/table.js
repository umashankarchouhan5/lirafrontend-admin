import UploadCell from './UploadCell';
import SaveButtonCell from 'Components/molecules/tableCells/SaveButtonCell';
import DocumentBriefCell from './DocumentBriefCell';

export default function() {

    const instance = this;
    return [
        {
            title: 'S.No.',
            type: 'index',
            width: 50,
            align: 'center'
        },
        {
            title: 'Supporting Document Details',
            key: 'DocumentBrief',
            render: (h, params) => {
                return h('div', [
                    h(DocumentBriefCell, {
                        props: {
                            row: params.row,
                            readonly: instance.readonly,
                            onChange: instance.onBriefChange
                        }
                    }),
                ]);
            }
        },
        {
            title: 'Document',
            width: 300,
            render: (h, params) => {
                return h('div', [
                    h(UploadCell, {
                        props: {
                            row: params.row,
                            readonly: instance.readonly,
                            onChange: instance.onFileChange
                        }
                    }),
                ]);
            }
        },
        {
            width: 80,
            title: 'Action',
            align: 'center',
            render: (h, params) => {
                return h(SaveButtonCell, {
                    props: {
                        row: params.row,
                        index: params.index,
                        readonly: instance.readonly,
                        onSaveDocument: instance.onSaveDocument,
                        onAddDocument: instance.onAddDocument,
                        onRemoveDocument: instance.onRemoveDocument,
                        documents: instance.innerValue,
                        onChangeDocument: instance.onChangeDocument
                    }
                }, 'Save');
            }
        }
    ]
};



