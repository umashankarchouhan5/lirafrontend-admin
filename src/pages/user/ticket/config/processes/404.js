import GeneralInfo from '../../components/cessation/GeneralInfo404'
import Review103 from '../../components/Review103'
import Documents from '../../components/Documents'
import PaidFees from  '../../components/PaidFees';

export default [
    { 
        id: 1,
        title: 'Rescission',
        component: GeneralInfo,
        isActive: true
    },
    {
        id: 2,
        title: 'Documents',
        component: Documents,
        isActive: false
    },
    {
        id: 3,
        title: 'Paid Fees',
        component: PaidFees,
        isActive: false
    },
    {
        id: 4,
        title: 'Review',
        component: Review103,
        isActive: false
    }
]
