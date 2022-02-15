import GeneralInfo from '../../components/renewal/annualCompliance/GeneralInfo';

import Review103 from '../../components/Review103'
import Documents from '../../components/Documents'
import PaidFees from  '../../components/PaidFees';

const steps = [
    {
        id: 1,
        title: 'General Information',
        isActive: true,
        component: GeneralInfo,
    },
    {
        id: 2,
        title: 'Licensable Activities',
        isActive: false,
        component: GeneralInfo,
        
    },
    {
        id: 3,
        title: 'Compliance Function',
        isActive: false,
        component: GeneralInfo,
        
    },
    {
        id: 4,
        title: 'Notices to Authority',
        isActive: false,
        component: GeneralInfo,
        
    },
    {
        id: 5,
        title: 'Business Contingency & Resumption',
        isActive: false,
        component: GeneralInfo,
        
    },
    {
        id: 6,
        title: 'Statistical Information',
        isActive: false,
        component: GeneralInfo,
        
    },
    {
        id: 7,
        title: 'Employee and Ownership Information',
        isActive: false,
        component: GeneralInfo,
        
    },
    {
        id: 8,
        title: 'Supporting Documents',
        isActive: false,
        component: Documents,
        
    },
    
    {
        id: 9,
        title: 'Paid Fees',
        component: PaidFees,
        isActive: false,
        
    },
    {
        id: 10,
        title: 'Review',
        component: Review103,
        isActive: false,
    }
];

export default steps;