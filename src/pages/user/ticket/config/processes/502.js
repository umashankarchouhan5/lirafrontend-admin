import GeneralInfo from '../../components/certificateOfGoodStanding/RequestCertificate'
import Review from '../../components/Review'
// import PaidFees from  '../../components/PaidFees';

export default [
    {
        id: 1,
        title: 'General Info',
        component: GeneralInfo,
        isActive: true
    },
    // {
    //     id: 2,
    //     title: 'Paid Fees',
    //     component: PaidFees,
    //     isActive: false
    // },
    {
        id: 2,
        title: 'Review',
        component: Review,
        isActive: false
    }
]

