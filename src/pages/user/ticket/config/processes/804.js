import Complaint from '../../components/complaint/Complaint'
import Review103 from '../../components/Review103'
import Documents from '../../components/Documents'
// import PaidFees from  '../../components/PaidFees';

export default [
    {
        id: 1,
        title: 'Complaint',
        component: Complaint,
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
        title: 'Review',
        component: Review103,
        isActive: false
    }
]

