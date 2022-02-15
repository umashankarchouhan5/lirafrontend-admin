import GeneralInfo from '../../components/nameIncorporation/GeneralInfo'
import ProposedName from '../../components/nameIncorporation/ProposedName'
import Review103 from '../../components/Review'

export default [
    {
        id: 1,
        title: 'Proposed Name',
        component: ProposedName,
        isActive: true
    },{
        id: 2,
        title: 'General Info',
        component: GeneralInfo,
        isActive: false
    },
    {
        id: 3,
        title: 'Review',
        component: Review103,
        isActive: false
    }
]

