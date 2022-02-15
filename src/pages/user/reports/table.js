import ReferenceCell from './components/referenceCell';

export default [
    
    {
        title: 'Code',
        width: 80,
        render: (h, params) => {
            return h(ReferenceCell, {
                props: {
                    row: params.row
                }
            });
        },
    },
    {
        title: 'Name',
        key: 'Name',
        width: 200,
    },
    {
        title: 'Purpose',
        key: 'Purpose',
    },
]
