import GeneralInfo from '../../components/csl/GeneralInfo'
import Management from '../../components/csl/Management'
import Business from '../../components/csl/Business'
import Review103 from '../../components/Review103'
import Documents from '../../components/Documents'
import PaidFees from  '../../components/PaidFees';

export default [
    {
        id: 1,
        title: 'General Info',
        component: GeneralInfo,
        isActive: true
    },
    {
        id: 2,
        title: 'Managerial Staff',
        component: Management,
        isActive: true
    },
    {
        id: 3,
        title: 'Business',
        component: Business,
        isActive: true
    },
    {
        id: 4,
        title: 'Documents',
        component: Documents,
        isActive: false
    },
    {
        id: 5,
        title: 'Paid Fees',
        component: PaidFees,
        isActive: false
    },
    {
        id: 6,
        title: 'Review',
        component: Review103,
        isActive: false
    }
]

