
import UploadCell from './uploadCell';
import UploadFile from './UploadFile';


export default function()  {
    const instance = this;
    return[
    
        // {
        //     title: 'ID',
        //     key: 'printdocument_id',
        //     sortable: true,
        //     width: 80,
        // },
        {
            title: 'File Name Prefix',
            key: 'FileNamePrefix',
        },
        {
            title: 'Layout',
            key: 'Layout',
            width: 110,
        },
    {
        title: 'Document',
        width: 300,
        height: 100,
        render: (h, params) => {
            return h('div', [
                h(UploadFile, {
                    props: {
                        row: params.row,
                        onChange: instance.onFileChange
                    }
                }),
            ]);
        }
    },
    {
        title: 'Action',
        width: 140,
        sortable: false,
        align: 'center',
        render: (h, params) => {
            return h(UploadCell,{
                    props: {
                        row: params.row,
                        index: params.index,
                        onSaveDocument: instance.onSaveDocument,
                        onChangeDocument: instance.onChangeDocument
                    }
                }
                );
        },
    },
]
}