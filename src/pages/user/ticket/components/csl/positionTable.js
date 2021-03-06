
import refCell from './refCell';

export default function(){
    const instance = this;
    return [
        
        
        {
            title: 'Name',
            key: 'Name',
            render: (h, params) => {
                return h('div', [
                    h(refCell, {
                        props: {
                            row: params.row,
                            openPop: instance.openPop
                        }
                    }),
                ]);
            }
        },
        {
            title: 'Position',
            key:'Position',
            
        },
        {
            title: 'Occupation',
            key:'occupation',
            
        },
        {
            title: 'Passport Number',
            key:'passportnumber',
            
        },
    
    ]
}