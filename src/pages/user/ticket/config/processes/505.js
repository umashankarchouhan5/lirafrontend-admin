import GeneralInfo from '../../components/certificateOfGoodStanding/RequestCertificate'
import Review from '../../components/Review'

export default [
    {
        id: 1,
        title: 'General Info',
        component: GeneralInfo,
        isActive: true
    },
    {
        id: 2,
        title: 'Review',
        component: Review,
        isActive: false
    }
]

