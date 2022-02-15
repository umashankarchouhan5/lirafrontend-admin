import GeneralInfo from '../../components/cessation/RestorationByCourtOrder'
import Review103 from '../../components/Review103'
import Documents from '../../components/Documents'

export default [
    {
        id: 1,
        title: 'Cessation',
        component: GeneralInfo,
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
