import GeneralInfo from '../../components/cslChanges/GeneralInfo'
import Review103 from '../../components/Review103'
import Documents from '../../components/Documents'

export default [
    {
        id: 1,
        title: 'General Info',
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

