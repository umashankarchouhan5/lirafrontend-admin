import GeneralInfo from '../../components/govRFI/GeneralInfo'
import Review from '../../components/Review'
import Observation from '../../components/Observation';

export default [
    {
        id: 1,
        title: 'General Info',
        component: GeneralInfo,
        isActive: true
    },
    // {
    //     id: 2,
    //     title: 'Observation',
    //     component: Observation,
    //     isActive: false
    // },
    {
        id: 2,
        title: 'Review',
        component: Review,
        isActive: false
    }
]

