import GeneralInfo from '../../components/icsp/GeneralInfo'
import Review103 from '../../components/Review103'
import Documents from '../../components/Documents'
import FinancialInfo from '../../components/icsp/FinancialInfo'
import CompanyPersons from '../../components/icsp/CompanyPersons'
import MiscInfo from '../../components/icsp/MiscInfo'
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
        title: 'Financial Info',
        component: FinancialInfo,
        isActive: false
    },
    {
        id: 3,
        title: 'Staffing',
        component: CompanyPersons,
        isActive: false
    },
    {
        id: 4,
        title: 'Training Details',
        component: MiscInfo,
        isActive: false
    },
    {
        id: 5,
        title: 'Documents',
        component: Documents,
        isActive: false
    },
    {
        id: 6,
        title: 'Paid Fees',
        component: PaidFees,
        isActive: false
    },
    {
        id: 7,
        title: 'Review',
        component: Review103,
        isActive: false
    }
]

