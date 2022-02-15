import GeneralInfo from '../../components/nameReservationExtension/GeneralInfo'
import Review103 from '../../components/Review';
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
        title: 'Paid Fees',
        component: PaidFees,
        isActive: false
    },
    {
        id: 3,
        title: 'Review',
        component: Review103,
        isActive: false
    }
]

