import GeneralInfo from '../../components/renewal/licenseeAnnualRenewal/GeneralInfo';

import Review103 from '../../components/Review103'
import Documents from '../../components/Documents'
import PaidFees from  '../../components/PaidFees';

const steps = [
    {
        id: 1,
        title: 'General Info',
        isActive: false,
        component: GeneralInfo,
    },
    {
        id: 2,
        title: 'Documents',
        isActive: false,
        component: Documents,
    },
    {
        id: 3,
        title: 'Paid Fees',
        component: PaidFees,
        isActive: false,
        
    },
    {
        id: 4,
        title: 'Review',
        component: Review103,
        isActive: false,
    }
];

export default steps;