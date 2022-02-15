import GeneralInfo from '../../components/fundLicense/GeneralInfo';
import CompanyInfo from '../../components/fundLicense/companyInfo/CompanyPersons';

import Review103 from '../../components/Review103'
import Documents from '../../components/Documents'
import PaidFees from  '../../components/PaidFees';

const steps = [
    {
        id: 1,
        title: 'General Info',
        isActive: true,
        component: GeneralInfo,
    },
    {
        id: 2,
        title: 'Operations',
        isActive: false,
        component: GeneralInfo,
        
    },
    {
        id: 3,
        title: 'Umbrella Fund',
        isActive: false,
        component: GeneralInfo,
        
    },
    
    {
        id: 4,
        title: 'Managerial Staff',
        isActive: false,
        component: CompanyInfo,
    },
    {
        id: 5,
        title: 'Documents',
        isActive: false,
        component: Documents,
        
    },
    
    {
        id: 6,
        title: 'Paid Fees',
        component: PaidFees,
        isActive: false,
        
    },
    {
        id: 7,
        title: 'Review',
        component: Review103,
        isActive: false,
    }
];

export default steps;