import DateUtil from 'Utils/dateUtil' ;
import PriceCell from './tableComponent/priceCell';

export default [
    {
        type: 'selection',
        width: 40,
        align: 'center'
    },
    {
        title: 'Description',
        key: 'Narration',
    },
    {
        title: 'Fee (in USD)',
        key: 'FeeUSD',
        render: (h, params) => {
            return h('div', [
                h(PriceCell, {
                    props: {
                        row: params.row,
                        price : params.row.FeeUSD
                    }
                }),
            ]);
        },
        width: 100,
    },
    {
        title: `Tax %`,
        key: 'Taxpct',
        render: (h, params) => {
            return h('div', [
                h(PriceCell, {
                    props: {
                        row: params.row,
                        price : params.row.Taxpct
                    }
                }),
            ]);
        },
        width: 60,
    },
    {
        title: `Tax`,
        key: 'Tax',
        render: (h, params) => {
            return h('div', [
                h(PriceCell, {
                    props: {
                        row: params.row,
                        price : params.row.Tax
                    }
                }),
            ]);
        },
        width: 80,
    },
    {
        title: 'Penalty',
        key: 'Penalty',
        render: (h, params) => {
            return h('div', [
                h(PriceCell, {
                    props: {
                        row: params.row,
                        price : params.row.Penalty
                    }
                }),
            ]);
        },
        width: 80
    },
    {
        title: 'Total',
        key: 'lineTotal',
        render: (h, params) => {
            return h('div', [
                h(PriceCell, {
                    props: {
                        row: params.row,
                        price : params.row.lineTotal
                    }
                }),
            ]);
        },
        width: 120,
        align: 'right'
    },
   
]
