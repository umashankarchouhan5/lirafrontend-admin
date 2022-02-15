import DateUtil from 'Utils/dateUtil';
import amountCell from './amountCell';

export default [
    {
        title: 'Transaction Date',
        // width: 120,
        render: (h, params) => {
            return h('span', params.row.TransDate !== null ? DateUtil.formatDate(params.row.TransDate) : '');
        },
    },
    {
        title: 'Details',
        key: 'narration',
        // width: 120,
    },
    {
        title: 'Withdrawal (USD)',
        key: 'withdrawal',
        // width: 120,
        // render:(h,params) =>{
        //     console.log(params.row);
        //     return h(amountCell,{
        //         props:{
        //             row: params.row,
        //             amount: params.row.withdrawal
        //         }
        //     })
        // },
        align: 'right'
    },
    {
        title: 'Deposit (USD)',
        key: 'Deposit',
        // width: 120,
        // render:(h,params) =>{
        //     return h(amountCell,{
        //         props:{
        //             row: params.row,
        //             amount: params.row.Deposit
        //         }
        //     })
        // },
        align: 'right'
    },
    // {
    //     title: 'Balance (USD)',
    //     key: 'balance',
    //     width: 120,
    //     render:(h,params) =>{
    //         return h(amountCell,{
    //             props:{
    //                 row: params.row,
    //                 amount: params.row.balance
    //             }
    //         })
    //     },
    //     align: 'right'
    // },
]
