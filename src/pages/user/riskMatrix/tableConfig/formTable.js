
import ParamCell from './paramCell';

export default function() {

    const instance = this;
    return [
        {
            title: 'Parameter',
            key: 'ParameterDetail',
            render: (h, params) => {
                return h('div', [
                    h(ParamCell, {
                        props: {
                            row: params.row,
                            onPop : instance.onPop
                        }
                    }),
                ]);
            }
        },
        {
            title: 'Score',
            key: 'Score',
            align: 'center'
        },
    ]
};



