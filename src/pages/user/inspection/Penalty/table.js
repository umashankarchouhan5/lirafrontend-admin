import invoiceCell from './components/invoiceCell';
import totalCell from './components/totalCell';
import amountCell from './components/amountCell';


export default function() {

    const instance = this;
    return [
        {
            type: 'selection',
            width: 40,
            align: 'center'
        },
        {
            title: 'Reg #',
            key: 'regno',
            width: 60
        },
        {
            title: 'Company Name',
            key: 'companyName',
            minWidth: 100,
        },
        {
            title: 'ROD',
            render:(h,params) =>{
                return h(amountCell,{
                    props:{
                        row: params.row,
                        amount: params.row.item1
                    }
                })
            },
            width: 100
        },
        {
            title: 'Register of Members',
            render:(h,params) =>{
                return h(amountCell,{
                    props:{
                        row: params.row,
                        amount: params.row.item2
                    }
                })
            },
            width: 100
        },
        {
            title: 'Register of BO',
            render:(h,params) =>{
                return h(amountCell,{
                    props:{
                        row: params.row,
                        amount: params.row.item3
                    }
                })
            },
            width: 100
        },
        {
            title: 'Accounting Records',
            render:(h,params) =>{
                return h(amountCell,{
                    props:{
                        row: params.row,
                        amount: params.row.item4
                    }
                })
            },
            width: 100
        },
        {
            title: 'Annual Return',
            render:(h,params) =>{
                return h(amountCell,{
                    props:{
                        row: params.row,
                        amount: params.row.item5
                    }
                })
            },
            width: 100
        },
        {
            title: 'Grand Total',
            render:(h,params) =>{
                return h(totalCell,{
                    props:{
                        row: params.row
                    }
                })
            },
            width: 100
        },
        
        {
            title: 'Invoice',
            render:(h,params) =>{
                return h(invoiceCell,{
                    props:{
                        row: params.row
                    }
                })
            },
            width: 60
        },
        {
            title: 'Invoice',
            key: 'status',
            width: 110
        },
        
    ]
};



